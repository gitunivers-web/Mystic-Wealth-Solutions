import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  password: z.string().min(1, "Mot de passe requis"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        localStorage.setItem("adminToken", data.token);
        toast({ title: "Accès autorisé", description: "Bienvenue dans l'espace administrateur." });
        setLocation("/admin/dashboard");
      },
      onError: () => {
        toast({ variant: "destructive", title: "Accès refusé", description: "Mot de passe incorrect." });
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-10 bg-card border border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Sanctuaire Intérieur</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Accès Réservé au Maître</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Clé secrète</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-background border-white/10 h-12 rounded-none text-center tracking-widest text-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={loginMutation.isPending} className="w-full h-12 rounded-none uppercase tracking-widest font-bold text-background bg-primary hover:bg-primary/90">
              {loginMutation.isPending ? "Vérification..." : "Entrer"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

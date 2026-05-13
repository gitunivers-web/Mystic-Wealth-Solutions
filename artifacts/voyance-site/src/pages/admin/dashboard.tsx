import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useGetSettings, useUpdateSettings, useGetMessages, useAdminLogout, getGetSettingsQueryKey, useHealthCheck } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) setLocation("/admin");
  }, [token, setLocation]);

  const { data: settings, isLoading: loadingSettings } = useGetSettings();
  const { data: messages, isLoading: loadingMessages } = useGetMessages({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: health } = useHealthCheck();
  
  const updateSettings = useUpdateSettings({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const logoutMutation = useAdminLogout();

  const form = useForm({
    defaultValues: {
      phone: "", whatsapp: "", address: "", email: "",
      web3formsKey: "", heroImage: "", aboutImage: "", ceremonyImages: ""
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        address: settings.address || "",
        email: settings.email || "",
        web3formsKey: settings.web3formsKey || "",
        heroImage: settings.heroImage || "",
        aboutImage: settings.aboutImage || "",
        ceremonyImages: settings.ceremonyImages?.join(",") || ""
      });
    }
  }, [settings, form]);

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      ceremonyImages: values.ceremonyImages.split(",").map((s: string) => s.trim()).filter(Boolean)
    };
    
    updateSettings.mutate({ data: payload }, {
      onSuccess: (data) => {
        toast({ title: "Modifications sauvegardées", description: "Les paramètres du site ont été mis à jour." });
        queryClient.setQueryData(getGetSettingsQueryKey(), data);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Erreur", description: "Échec de la sauvegarde." });
      }
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
      }
    });
  };

  if (!token) return null;
  if (loadingSettings) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Chargement...</div>;

  return (
    <div className="w-full min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-white/5 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-white">
            Tableau de Bord du Maître
            {health?.status === "ok" && (
              <span className="ml-4 text-xs font-sans tracking-widest text-primary/70 uppercase">Système connecté</span>
            )}
          </h1>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-none" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-12 grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-card border border-white/5 p-8">
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Paramètres du site</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">Téléphone</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">WhatsApp (format: +33612345678)</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">Email</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">Adresse</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="web3formsKey" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">Clé Web3Forms</FormLabel><FormControl><Input type="password" className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="heroImage" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">URL Image Accueil</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="aboutImage" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">URL Image Portrait</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="ceremonyImages" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs uppercase text-muted-foreground">Images Galerie (séparées par des virgules)</FormLabel><FormControl><Input className="bg-background rounded-none border-white/10" {...field} /></FormControl></FormItem>
                )} />
                <Button type="submit" disabled={updateSettings.isPending} className="w-full mt-6 rounded-none bg-primary text-background font-bold hover:bg-primary/90">
                  {updateSettings.isPending ? "Sauvegarde..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-card border border-white/5 p-8">
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Messages Reçus</h2>
            {loadingMessages ? (
              <div className="text-muted-foreground py-8 text-center">Lecture des oracles...</div>
            ) : !messages || messages.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center italic">Aucun message pour le moment.</div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-white/5 bg-background p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-primary mb-1">{msg.subject}</div>
                        <div className="text-white font-medium">{msg.name}</div>
                        <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                          <span>{msg.email}</span>
                          {msg.phone && <span>• {msg.phone}</span>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-muted-foreground bg-card p-4 border-l-2 border-primary/30 mt-4 whitespace-pre-wrap text-sm">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

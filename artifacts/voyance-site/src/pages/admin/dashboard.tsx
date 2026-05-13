import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useGetSettings, useUpdateSettings, useGetMessages, useAdminLogout, getGetSettingsQueryKey, useHealthCheck } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
      siteName: "",
      phone: "", whatsapp: "", address: "", email: "",
      web3formsKey: "", heroImage: "", aboutImage: "",
      ceremonyImages: "", ritualImages: ""
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        address: settings.address || "",
        email: settings.email || "",
        web3formsKey: settings.web3formsKey || "",
        heroImage: settings.heroImage || "",
        aboutImage: settings.aboutImage || "",
        ceremonyImages: settings.ceremonyImages?.join(",") || "",
        ritualImages: settings.ritualImages?.join(",") || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: {
    siteName: string; phone: string; whatsapp: string; address: string;
    email: string; web3formsKey: string; heroImage: string; aboutImage: string;
    ceremonyImages: string; ritualImages: string;
  }) => {
    const payload = {
      ...values,
      ceremonyImages: values.ceremonyImages.split(",").map((s) => s.trim()).filter(Boolean),
      ritualImages: values.ritualImages.split(",").map((s) => s.trim()).filter(Boolean),
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
  if (loadingSettings) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-serif text-xl">Chargement du sanctuaire...</div>;

  const fieldClass = "bg-background rounded-none border-white/10 text-white placeholder:text-muted-foreground/40 focus:border-primary/50";
  const labelClass = "text-xs uppercase tracking-widest text-muted-foreground";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card border border-white/5 p-6 md:p-8 space-y-4">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-widest border-b border-white/5 pb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-white/5 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">Tableau de Bord</h1>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
              {health?.status === "ok" ? "Système connecté" : "Vérification du système..."}
            </p>
          </div>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 rounded-none text-xs uppercase tracking-widest" onClick={handleLogout} data-testid="btn-logout">
            Se déconnecter
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Settings Column */}
        <div className="xl:col-span-1 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <Section title="Identité du site">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Nom du Maître / Site</FormLabel><FormControl><Input className={fieldClass} placeholder="Maître Séraphin" {...field} data-testid="input-siteName" /></FormControl></FormItem>
                )} />
              </Section>

              <Section title="Coordonnées">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Téléphone</FormLabel><FormControl><Input className={fieldClass} placeholder="+22670000000" {...field} data-testid="input-phone" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>WhatsApp (ex: +22670000000)</FormLabel><FormControl><Input className={fieldClass} placeholder="+22670000000" {...field} data-testid="input-whatsapp" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Email</FormLabel><FormControl><Input className={fieldClass} placeholder="contact@example.com" {...field} data-testid="input-email" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Adresse du Cabinet</FormLabel><FormControl><Input className={fieldClass} placeholder="Ville, Pays" {...field} data-testid="input-address" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="web3formsKey" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Clé Web3Forms (réception emails)</FormLabel><FormControl><Input type="password" className={fieldClass} placeholder="Votre clé access key" {...field} data-testid="input-web3forms" /></FormControl></FormItem>
                )} />
              </Section>

              <Section title="Images (URLs)">
                <p className="text-xs text-muted-foreground/60">Entrez des URLs d'images (ex: https://...). Pour plusieurs images, séparez par des virgules.</p>
                <FormField control={form.control} name="heroImage" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Image Hero (fond page accueil)</FormLabel><FormControl><Input className={fieldClass} placeholder="https://..." {...field} data-testid="input-heroImage" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="aboutImage" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Portrait du Maître</FormLabel><FormControl><Input className={fieldClass} placeholder="https://..." {...field} data-testid="input-aboutImage" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="ceremonyImages" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Galerie Cérémonie (URLs séparées par virgule)</FormLabel><FormControl><Input className={fieldClass} placeholder="https://..., https://..." {...field} data-testid="input-ceremonyImages" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="ritualImages" render={({ field }) => (
                  <FormItem><FormLabel className={labelClass}>Images page Rituels (URLs séparées par virgule)</FormLabel><FormControl><Input className={fieldClass} placeholder="https://..., https://..." {...field} data-testid="input-ritualImages" /></FormControl></FormItem>
                )} />
              </Section>

              <Button type="submit" disabled={updateSettings.isPending} className="w-full rounded-none bg-primary text-background font-bold hover:bg-primary/90 uppercase tracking-widest text-xs py-4" data-testid="btn-save">
                {updateSettings.isPending ? "Sauvegarde..." : "Enregistrer toutes les modifications"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Messages Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-white/5 p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-widest border-b border-white/5 pb-3 mb-6">Messages Reçus
              {messages && messages.length > 0 && (
                <span className="ml-3 bg-primary text-background text-xs px-2 py-0.5 font-bold">{messages.length}</span>
              )}
            </h2>
            {loadingMessages ? (
              <div className="text-muted-foreground py-8 text-center">Lecture des oracles...</div>
            ) : !messages || messages.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center italic text-sm">Aucun message pour le moment.</div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-white/5 bg-background p-5 hover:border-primary/20 transition-colors" data-testid={`message-${msg.id}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                      <div>
                        <div className="font-bold text-primary text-sm mb-0.5">{msg.subject}</div>
                        <div className="text-white font-medium">{msg.name}</div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                          <span>{msg.email}</span>
                          {msg.phone && <span>• {msg.phone}</span>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-muted-foreground bg-card p-4 border-l-2 border-primary/30 whitespace-pre-wrap text-sm leading-relaxed">
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

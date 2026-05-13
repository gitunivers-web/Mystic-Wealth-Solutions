import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import {
  useGetSettings, useUpdateSettings, useGetMessages,
  useAdminLogout, getGetSettingsQueryKey, useHealthCheck
} from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/layout/logo";

type FormValues = {
  siteName: string; phone: string; whatsapp: string; address: string;
  email: string; web3formsKey: string; heroImage: string; aboutImage: string;
  ceremonyImages: string; ritualImages: string; videoUrl: string; videoTitle: string;
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("adminToken");

  useEffect(() => { if (!token) setLocation("/admin"); }, [token, setLocation]);

  const { data: settings, isLoading } = useGetSettings();
  const { data: messages, isLoading: loadingMessages } = useGetMessages({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: health } = useHealthCheck();
  const updateSettings = useUpdateSettings({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const logoutMutation = useAdminLogout();

  const form = useForm<FormValues>({
    defaultValues: {
      siteName: "", phone: "", whatsapp: "", address: "", email: "",
      web3formsKey: "", heroImage: "", aboutImage: "",
      ceremonyImages: "", ritualImages: "", videoUrl: "", videoTitle: ""
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
        videoUrl: settings.videoUrl || "",
        videoTitle: settings.videoTitle || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      ceremonyImages: values.ceremonyImages.split(",").map(s => s.trim()).filter(Boolean),
      ritualImages: values.ritualImages.split(",").map(s => s.trim()).filter(Boolean),
    };
    updateSettings.mutate({ data: payload }, {
      onSuccess: (data) => {
        toast({ title: "Modifications sauvegardées", description: "Le site a été mis à jour." });
        queryClient.setQueryData(getGetSettingsQueryKey(), data);
      },
      onError: () => toast({ variant: "destructive", title: "Erreur", description: "Échec de la sauvegarde." })
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSettled: () => { localStorage.removeItem("adminToken"); setLocation("/admin"); } });
  };

  if (!token) return null;
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-serif text-xl">Chargement...</div>;

  const F = ({ name, label, placeholder, type = "text" }: { name: keyof FormValues; label: string; placeholder?: string; type?: string }) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">{label}</FormLabel>
        <FormControl>
          <Input type={type} className="bg-background rounded-none border-white/10 text-white focus:border-primary/50" placeholder={placeholder} {...field} data-testid={`input-${name}`} />
        </FormControl>
      </FormItem>
    )} />
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card border border-white/5 p-6 space-y-4">
      <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-white/5 py-5 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <div>
              <h1 className="text-xl font-serif font-bold text-white">Tableau de Bord</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {health?.status === "ok" ? "● Système connecté" : "○ Vérification..."}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} data-testid="btn-logout"
            className="border-primary/30 text-primary hover:bg-primary/10 rounded-none text-xs uppercase tracking-widest">
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="xl:col-span-1 space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <Section title="Identité du site">
                <F name="siteName" label="Nom du Maître / Site" placeholder="Maître Zonon 666" />
              </Section>

              <Section title="Coordonnées">
                <F name="phone" label="Téléphone" placeholder="+22968075372" />
                <F name="whatsapp" label="WhatsApp (+indicatif...)" placeholder="+22968075372" />
                <F name="email" label="Email" placeholder="contact@maitrezonon666.com" />
                <F name="address" label="Adresse du Cabinet" placeholder="Lokossa — Bénin" />
                <F name="web3formsKey" label="Clé Web3Forms (réception emails)" type="password" placeholder="••••••••••••" />
              </Section>

              <Section title="Images (URLs)">
                <p className="text-xs text-muted-foreground/50">Entrez des URLs d'images directes (https://...). Pour plusieurs images, séparez par des virgules.</p>
                <F name="heroImage" label="Image Hero (fond accueil)" placeholder="https://..." />
                <F name="aboutImage" label="Portrait du Maître" placeholder="https://..." />
                <F name="ceremonyImages" label="Galerie cérémonie (URLs séparées par ,)" placeholder="https://img1.jpg, https://img2.jpg" />
                <F name="ritualImages" label="Images Rituels (URLs séparées par ,)" placeholder="https://img1.jpg, https://img2.jpg" />
              </Section>

              <Section title="Section Vidéo">
                <p className="text-xs text-muted-foreground/50">Entrez une URL YouTube ou Vimeo pour afficher une vidéo sur la page d'accueil.</p>
                <F name="videoUrl" label="URL de la vidéo (YouTube / Vimeo)" placeholder="https://www.youtube.com/watch?v=..." />
                <F name="videoTitle" label="Titre de la section vidéo" placeholder="Le Maître en Action..." />
              </Section>

              <Button type="submit" disabled={updateSettings.isPending} data-testid="btn-save"
                className="w-full rounded-none bg-primary text-background font-bold hover:bg-primary/90 uppercase tracking-widest text-xs py-4">
                {updateSettings.isPending ? "Sauvegarde en cours..." : "Enregistrer toutes les modifications"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Messages */}
        <div className="xl:col-span-2">
          <div className="bg-card border border-white/5 p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Messages Reçus</h2>
              {messages && messages.length > 0 && (
                <span className="bg-primary text-background text-xs px-2 py-0.5 font-bold">{messages.length}</span>
              )}
            </div>
            {loadingMessages ? (
              <div className="text-muted-foreground py-8 text-center text-sm">Chargement...</div>
            ) : !messages || messages.length === 0 ? (
              <div className="text-muted-foreground py-16 text-center text-sm italic">Aucun message reçu pour le moment.</div>
            ) : (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-white/5 bg-background p-5 hover:border-primary/20 transition-colors" data-testid={`msg-${msg.id}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div>
                        <div className="font-bold text-primary text-sm">{msg.subject}</div>
                        <div className="text-white font-medium mt-0.5">{msg.name}</div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                          <span>{msg.email}</span>
                          {msg.phone && <span>· {msg.phone}</span>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-muted-foreground bg-card p-4 border-l-2 border-primary/30 whitespace-pre-wrap text-sm leading-relaxed mt-3">
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

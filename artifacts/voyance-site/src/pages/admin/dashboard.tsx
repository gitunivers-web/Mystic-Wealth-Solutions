import { useEffect, useState } from "react";
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
import {
  ExternalLink, LogOut, Settings, Image, Layers, Video,
  MessageSquare, CheckCircle2, Save, Phone, Mail, MapPin, Lock
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { RitualEditor, type RitualItem } from "@/components/admin/ritual-editor";

type Tab = "general" | "medias" | "rituels" | "video" | "messages";

type FormValues = {
  siteName: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  web3formsKey: string;
  heroImage: string;
  aboutImage: string;
  videoUrl: string;
  videoTitle: string;
};

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "general",  label: "Général",   icon: <Settings size={15} /> },
  { id: "medias",   label: "Médias",    icon: <Image size={15} /> },
  { id: "rituels",  label: "Rituels",   icon: <Layers size={15} /> },
  { id: "video",    label: "Vidéo",     icon: <Video size={15} /> },
  { id: "messages", label: "Messages",  icon: <MessageSquare size={15} /> },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">{label}</label>
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
      {children}
    </div>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function StyledInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm px-3 py-2.5 rounded focus:outline-none focus:border-primary/60 transition-colors placeholder:text-zinc-600"
    />
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("adminToken");

  useEffect(() => { if (!token) setLocation("/admin"); }, [token, setLocation]);

  const { data: settings, isLoading } = useGetSettings();
  const { data: messages, isLoading: loadingMessages } = useGetMessages({
    request: { headers: { Authorization: `Bearer ${token}` } }
  });
  const { data: health } = useHealthCheck();
  const updateSettings = useUpdateSettings({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const logoutMutation = useAdminLogout();

  const [ceremonyImages, setCeremonyImages] = useState<string[]>([]);
  const [ritualImages, setRitualImages] = useState<string[]>([]);
  const [rituals, setRituals] = useState<RitualItem[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      siteName: "", phone: "", whatsapp: "", address: "", email: "",
      web3formsKey: "", heroImage: "", aboutImage: "", videoUrl: "", videoTitle: ""
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
        videoUrl: settings.videoUrl || "",
        videoTitle: settings.videoTitle || "",
      });
      setCeremonyImages(settings.ceremonyImages || []);
      setRitualImages(settings.ritualImages || []);
      setRituals((settings.rituals || []).map(r => ({
        image: r.image,
        description: r.description,
        videoUrl: r.videoUrl ?? "",
      })));
    }
  }, [settings, form]);

  const save = (values: FormValues) => {
    updateSettings.mutate({
      data: { ...values, ceremonyImages, ritualImages, rituals }
    }, {
      onSuccess: (data) => {
        toast({ title: "✓ Sauvegardé", description: "Les modifications sont en ligne." });
        queryClient.setQueryData(getGetSettingsQueryKey(), data);
      },
      onError: () => toast({ variant: "destructive", title: "Erreur", description: "La sauvegarde a échoué." })
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => { localStorage.removeItem("adminToken"); setLocation("/admin"); }
    });
  };

  if (!token) return null;
  if (isLoading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-zinc-500 text-sm">Chargement...</div>
    </div>
  );

  const isOnline = health?.status === "ok";
  const msgCount = messages?.length ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* ── Top bar ── */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Logo size={22} />
          <span className="text-sm font-semibold text-white">Administration</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 ml-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-zinc-600"}`} />
            {isOnline ? "Connecté" : "Hors ligne"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-zinc-800">
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Voir le site</span>
          </a>
          <button onClick={handleLogout} data-testid="btn-logout"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-zinc-800">
            <LogOut size={12} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <nav className="w-52 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col py-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors relative ${
                tab === t.id
                  ? "text-white bg-zinc-800"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              }`}
            >
              {tab === t.id && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />}
              {t.icon}
              {t.label}
              {t.id === "messages" && msgCount > 0 && (
                <span className="ml-auto text-xs bg-primary text-black font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {msgCount > 9 ? "9+" : msgCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(save)}>

              {/* ── GÉNÉRAL ── */}
              {tab === "general" && (
                <TabContent title="Informations générales" description="Identité et coordonnées affichées sur le site.">
                  <Card title="Identité">
                    <FormField control={form.control} name="siteName" render={({ field }) => (
                      <Field label="Nom du Maître / Site">
                        <StyledInput placeholder="Maître Zonon 666" data-testid="input-siteName" {...field} />
                      </Field>
                    )} />
                  </Card>

                  <Card title="Coordonnées">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <Field label="Téléphone"><div className="relative"><Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><StyledInput className="pl-8" placeholder="+22968075372" data-testid="input-phone" {...field} /></div></Field>
                      )} />
                      <FormField control={form.control} name="whatsapp" render={({ field }) => (
                        <Field label="WhatsApp"><StyledInput placeholder="+22968075372" data-testid="input-whatsapp" {...field} /></Field>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <Field label="Email"><div className="relative"><Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><StyledInput className="pl-8" placeholder="contact@maitrezonon666.com" data-testid="input-email" {...field} /></div></Field>
                      )} />
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <Field label="Adresse du cabinet"><div className="relative"><MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><StyledInput className="pl-8" placeholder="Lokossa — Bénin" data-testid="input-address" {...field} /></div></Field>
                      )} />
                    </div>
                  </Card>

                  <Card title="Formulaire de contact" description="Clé API pour recevoir les messages par email.">
                    <FormField control={form.control} name="web3formsKey" render={({ field }) => (
                      <Field label="Clé Web3Forms" hint="Obtenez votre clé gratuite sur web3forms.com">
                        <div className="relative"><Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><StyledInput type="password" className="pl-8" placeholder="••••••••••••" data-testid="input-web3formsKey" {...field} /></div>
                      </Field>
                    )} />
                  </Card>

                  <SaveBar pending={updateSettings.isPending} />
                </TabContent>
              )}

              {/* ── MÉDIAS ── */}
              {tab === "medias" && (
                <TabContent title="Images" description="Toutes les images affichées sur le site. Chargez depuis votre appareil ou collez une URL.">
                  <Card title="Image de fond — Accueil" description="Grande image derrière le titre principal.">
                    <FormField control={form.control} name="heroImage" render={({ field }) => (
                      <ImageUploader label="Image hero" value={field.value} onChange={field.onChange} />
                    )} />
                  </Card>

                  <Card title="Portrait du Maître" description="Photo affichée dans la section À propos.">
                    <FormField control={form.control} name="aboutImage" render={({ field }) => (
                      <ImageUploader label="Portrait" value={field.value} onChange={field.onChange} />
                    )} />
                  </Card>

                  <Card title="Galerie — Cérémonies" description="Images qui défilent en galerie sur la page d'accueil.">
                    <MultiImageUploader label="Images de cérémonie" values={ceremonyImages} onChange={setCeremonyImages} />
                  </Card>

                  <SaveBar pending={updateSettings.isPending} />
                </TabContent>
              )}

              {/* ── RITUELS ── */}
              {tab === "rituels" && (
                <TabContent title="Rituels" description="Ajoutez, modifiez ou supprimez les rituels affichés sur la page Rituels. Chaque rituel peut avoir une image, une description et une vidéo.">
                  <Card title="Gestion des rituels">
                    <RitualEditor items={rituals} onChange={setRituals} />
                  </Card>
                  <SaveBar pending={updateSettings.isPending} />
                </TabContent>
              )}

              {/* ── VIDÉO ── */}
              {tab === "video" && (
                <TabContent title="Section vidéo" description="Vidéo affichée sur la page d'accueil. Laissez vide pour masquer la section.">
                  <Card title="Vidéo principale" description="YouTube, Vimeo ou fichier MP4 uploadé.">
                    <FormField control={form.control} name="videoUrl" render={({ field }) => (
                      <Field label="URL ou chemin de la vidéo" hint="Ex : https://youtube.com/watch?v=... ou /video-rituel.mp4">
                        <StyledInput placeholder="https://www.youtube.com/watch?v=..." data-testid="input-videoUrl" {...field} />
                      </Field>
                    )} />
                    <FormField control={form.control} name="videoTitle" render={({ field }) => (
                      <Field label="Titre affiché au-dessus de la vidéo">
                        <StyledInput placeholder="Le Maître en Action..." data-testid="input-videoTitle" {...field} />
                      </Field>
                    )} />
                  </Card>
                  <SaveBar pending={updateSettings.isPending} />
                </TabContent>
              )}

              {/* ── MESSAGES ── */}
              {tab === "messages" && (
                <TabContent title="Messages reçus" description={`${msgCount} message${msgCount !== 1 ? "s" : ""} dans la boîte.`}>
                  {loadingMessages ? (
                    <div className="text-zinc-600 text-sm py-12 text-center">Chargement...</div>
                  ) : !messages || messages.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg py-20 text-center">
                      <MessageSquare size={32} className="mx-auto text-zinc-700 mb-3" />
                      <p className="text-zinc-500 text-sm">Aucun message pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors" data-testid={`msg-${msg.id}`}>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div>
                              <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mb-1.5">{msg.subject}</span>
                              <div className="text-white font-semibold text-sm">{msg.name}</div>
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                <span className="text-xs text-zinc-500">{msg.email}</span>
                                {msg.phone && <span className="text-xs text-zinc-500">{msg.phone}</span>}
                              </div>
                            </div>
                            <time className="text-xs text-zinc-600 whitespace-nowrap shrink-0">
                              {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </time>
                          </div>
                          <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-950 rounded p-4 border-l-2 border-primary/30 whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabContent>
              )}

            </form>
          </Form>
        </main>
      </div>
    </div>
  );
}

function TabContent({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
      <div className="pb-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function SaveBar({ pending }: { pending: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <button type="submit" disabled={pending} data-testid="btn-save"
        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black text-sm font-semibold rounded hover:bg-primary/90 disabled:opacity-50 transition-colors">
        {pending
          ? <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Sauvegarde...</>
          : <><Save size={14} />Enregistrer</>}
      </button>
    </div>
  );
}

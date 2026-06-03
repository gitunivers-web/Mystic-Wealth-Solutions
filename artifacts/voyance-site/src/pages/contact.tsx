import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useSubmitContact, useGetSettings } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
});

const serviceOptions = [
  "Retour affectif",
  "Infertilité",
  "Problèmes de couple",
  "Problèmes de travail",
  "Problèmes financiers",
  "Rituel de richesse",
  "Envoûtement & désenvoûtement",
  "Maladies inexpliquées",
  "Chance & succès",
  "Protection spirituelle",
  "Voyance & divination",
  "Mariage & séduction",
  "Autre"
];

export default function Contact() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { data: settings } = useGetSettings();
  const submitContact = useSubmitContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Pre-fill subject if passed in URL (e.g. ?subject=Rituel)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subjectParam = params.get("subject");
    if (subjectParam && serviceOptions.includes(subjectParam)) {
      form.setValue("subject", subjectParam);
    }
  }, [form, location]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitContact.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Message envoyé", description: "Le Maître a bien reçu votre demande. Il vous répondra très prochainement." });
        form.reset();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Erreur", description: "Une erreur s'est produite lors de l'envoi." });
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <section className="pt-32 pb-16 text-center border-b border-white/5 bg-card relative">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Audience Privée</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Confiez votre destinée au Maître. Vos secrets sont gardés dans le silence le plus absolu.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="text-xl font-serif font-bold text-primary mb-6 uppercase tracking-widest">Coordonnées Directes</h3>
                <div className="space-y-6 text-muted-foreground">
                  {settings?.phone && (
                    <div>
                      <p className="text-sm uppercase tracking-widest text-white/50 mb-1">Téléphone Principal</p>
                      <p className="text-lg text-white font-medium">{settings.phone}</p>
                    </div>
                  )}
                  {settings?.whatsapp && (
                    <div>
                      <p className="text-sm uppercase tracking-widest text-white/50 mb-1">WhatsApp</p>
                      <p className="text-lg text-white font-medium">{settings.whatsapp}</p>
                    </div>
                  )}
                  {settings?.address && (
                    <div>
                      <p className="text-sm uppercase tracking-widest text-white/50 mb-1">Cabinet</p>
                      <p className="text-lg text-white font-medium">{settings.address}</p>
                      <p className="text-sm text-primary mt-2 italic">*Uniquement sur rendez-vous</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-white/5 p-8 md:p-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" className="bg-background border-white/10 h-12 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre@email.com" className="bg-background border-white/10 h-12 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Téléphone (Optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre numéro" className="bg-background border-white/10 h-12 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Sujet de la demande</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background border-white/10 h-12 rounded-none">
                                <SelectValue placeholder="Sélectionnez un rituel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-white/10 rounded-none max-h-60 overflow-y-auto">
                              {serviceOptions.map(opt => (
                                <SelectItem key={opt} value={opt} className="rounded-none cursor-pointer hover:bg-primary/10">{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Votre message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre situation en détail. La discrétion est totale." 
                            className="bg-background border-white/10 min-h-[150px] rounded-none resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="submit" disabled={submitContact.isPending} className="w-full min-h-14 h-auto py-4 rounded-none uppercase tracking-normal md:tracking-widest font-bold text-background bg-primary hover:bg-primary/90 text-sm md:text-base px-4 whitespace-normal break-words text-center leading-snug">
                      {submitContact.isPending ? "Invocation en cours..." : "Invoquer l'aide du Maître"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

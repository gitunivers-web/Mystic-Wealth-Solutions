import { useGetSettings } from "@workspace/api-client-react";
import { FaWhatsapp } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function WhatsAppWidget() {
  const { data: settings } = useGetSettings();

  if (!settings?.whatsapp) return null;

  const numericPhone = settings.whatsapp.replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={`https://wa.me/${numericPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] animate-pulse hover:animate-none"
          >
            <FaWhatsapp className="w-8 h-8" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-background border-primary/30 text-primary">
          <p>Contactez-nous sur WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

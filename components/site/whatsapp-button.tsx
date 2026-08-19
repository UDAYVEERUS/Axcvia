import { MessageCircle } from "lucide-react";
import { site } from "@/lib/data/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Axcvia, I'd like to know more about your courses.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}

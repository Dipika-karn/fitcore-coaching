import { FaWhatsapp } from "react-icons/fa";
import { whatsappUrl } from "@/data/contact";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:translate-y-0 active:scale-95"
    >
      <FaWhatsapp size={27} />
    </a>
  );
}
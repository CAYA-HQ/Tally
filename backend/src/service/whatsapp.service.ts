import { getSocket } from "../config/whatsappBaileys";


// This function sends a WhatsApp message to a specific JID (phone number) with the given message text.
export const whatsappAlert = async (jid: string, message: string) => {

    const sock = getSocket();

    if (!sock) {
        throw new Error("WhatsApp socket not initialized");
    }

    await sock.sendMessage(`${jid}@s.whatsapp.net`, { text: message });
    
};
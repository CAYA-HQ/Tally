import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers, type WASocket } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import pino from "pino";

let sock: WASocket | null = null;

export const getSocket = () => {

    if (!sock) {
        throw new Error(
            "WhatsApp socket not initialized"
        );
    }

    return sock;
};

export const startSock = async () => {

    // Session storage
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    sock = makeWASocket({
        auth: state,

        logger: pino({
            level: "silent"
        }),

        browser: Browsers.ubuntu("Chrome"),
        markOnlineOnConnect: false
    });

    // QR CODE
    sock.ev.on("connection.update", async (update) => {

        const {
            connection,
            lastDisconnect,
            qr
        } = update;

        // Show QR
        if (qr) {

            qrcode.generate(qr, {
                small: true
            });

            console.log("Scan QR Code");
        }

        // Connected
        if (connection === "open") {

            console.log("WhatsApp Connected");
        }

        // Reconnect
        if (connection === "close") {

            const statusCode = (lastDisconnect?.error as Boom | undefined)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(
                "Connection closed:",
                shouldReconnect
            );

            if (shouldReconnect) {
                setTimeout(() => startSock(), 3000);
            }
        }
    });

    // Save session
    sock.ev.on("creds.update", saveCreds);

    // Receive messages
    sock.ev.on(
        "messages.upsert",
        async ({ messages }) => {

            const msg = messages[0];

            if (!msg?.message) return;

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text;

            console.log("Message:", text);

            // Auto reply
            if (text?.toLowerCase() === "ping") {

                if (!sock) return;

                await sock.sendMessage(
                    msg.key.remoteJid!,
                    {
                        text: "pong"
                    }
                );
            }
        }
    );

    sock.ev.on("creds.update", saveCreds);

    return sock;

}
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  Browsers,
  type WASocket,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import pino from "pino";
import { User } from "../model/User";

let sock: WASocket | null = null;
let isConnecting = false;

export const getSocket = () => {
  if (!sock) {
    throw new Error("WhatsApp socket not initialized");
  }
  return sock;
};

export const startSock = async (): Promise<WASocket | null> => {
  console.log("startSock called", new Date().toISOString());

  if (sock) {
    return sock;
  }

  isConnecting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    sock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      browser: Browsers.ubuntu("Chrome"),
      markOnlineOnConnect: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      // QR CODE
      if (qr) {
        console.log("Scan this QR code:");
        qrcode.generate(qr, { small: true });
      }

      // CONNECTED
      if (connection === "open") {
        console.log("✅ WhatsApp Connected");
        console.log("Connected at:", new Date().toISOString());
      }

      // CLOSED
      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as Boom | undefined)
          ?.output?.statusCode;

        console.log("❌ Connection closed");
        console.log("Status code:", statusCode);
        console.log("Error:", lastDisconnect?.error);

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log("Reconnect:", shouldReconnect);

        sock = null;
        isConnecting = false;

        if (shouldReconnect) {
          setTimeout(() => startSock(), 3000);
        }
      }

      console.log(
        "Last disconnect:",
        JSON.stringify(lastDisconnect, null, 2)
      );
    });

sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];

  if (!msg?.message) return;

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text;

  if (!text) return;

  const socket = sock;
  if (!socket) return;

  const jid = msg.key.remoteJid!;

  console.log("Incoming:", text);
  console.log("From:", jid);

  if (text.startsWith("START")) {
    const token = text.split(" ")[1];

    if (!token) {
      await socket.sendMessage(jid, {
        text: "Verification token missing.",
      });

      return;
    }

    // Find user by token
    const user = await User.findOne({
      whatsappToken: token,
    });
    
    if (!user) {
      await socket.sendMessage(jid, {
        text: "Invalid verification token.",
      });

      return;
    }

    user.whatsappVerified = true;
    user.whatsappJid = jid;
    user.whatsappToken = undefined;
    user.alertMode.push('whatsapp')

    await user.save();

    await socket.sendMessage(jid, {
      text: `
    👋 Welcome to Tally!

    Your WhatsApp notifications are now active.

    Available commands:

    START - Activate notifications
    STOP - Disable notifications
    TEST - Test connection

    You'll now receive reminder alerts here.
      `.trim(),
    });

    return;
  }

  if (text.toLowerCase() === "start") {
    await socket.sendMessage(jid, {
      text: "Notifications already started ✅",
    });

    return;
  }

  if (text.toLowerCase() === "test") {
    await socket.sendMessage(jid, {
      text: "CONNECTED ✅",
    });

    return;
  }

  if (text.toLowerCase() === "stop") {
    await socket.sendMessage(jid, {
      text: "Notifications disabled.",
    });

    return;
  }
});

    return sock;
  } catch (err) {
    console.error("startSock error:", err);
    isConnecting = false;
    sock = null;
    return null;
  } finally {
    isConnecting = false;
  }
};
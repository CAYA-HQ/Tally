import { transporter } from "./otp.service";
import { env } from "../model/validate.user";
import { getSocket } from "../config/whatsappBaileys";

const mailOptions = (
  email: string,
  token: string
) => ({
  from: env.GOOGLE_EMAIL,
  to: email,
  subject: "Tally WhatsApp Verification",
  html: `
    <div>
      <h2>Verify WhatsApp</h2>

      <p>
        Click the button below and send the pre-filled message.
      </p>

      <a
        href="https://wa.me/2349128011323?text=START%20${token}"
        target="_blank"
      >
        Connect WhatsApp
      </a>
    </div>
  `,
});

export const whatsappAlertVerification = async (
  email: string,
  token: string
) => {
  await transporter.sendMail(
    mailOptions(email, token)
  );
};


export const whatsappAlert = async (
  phone: string,
  countryCode: string,
  message: string,
) => {
  const sock = getSocket();

  const target = `${countryCode.replace("+", "")}${phone}@s.whatsapp.net`;


  const exists = await sock.onWhatsApp(target);

  console.log("WhatsApp lookup:", exists);

  if (!exists?.[0]?.exists) {
    throw new Error(`Number not found on WhatsApp: ${target}`);
  }

  const result = await sock.sendMessage(
    target,
    { text: message }
  );

  return result;
};
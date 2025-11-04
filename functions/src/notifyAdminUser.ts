// functions/src/notifyAdminUser.ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions/v2";

import * as dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp();
}

// ---------------------------
// Notify admin when new user registers
// ---------------------------
export const notifyAdminOnNewUser = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data associated with the event.");
      return;
    }

    const data = snapshot.data();
    if (!data?.email || !data?.user_name) {
      logger.error("Missing fields in user document");
      return;
    }

    // from .env file
    const gmailUser = process.env.GMAIL_USER!;
    const gmailPass = process.env.GMAIL_PASS!;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const projectId = process.env.GCP_PROJECT || "lucenske-tulene-ff2f7";
    const region = "europe-west3";
    const approveUrl = `https://${region}-${projectId}.cloudfunctions.net/approveUser?userId=${event.params.userId}&email=${encodeURIComponent(data.email)}`;

    const mailOptions = {
      from: `"Lučenské Tulene App" <${gmailUser}>`,
      to: "lucensketulene@gmail.com",
      subject: `Tuleň ${data.user_name} čaká na schválenie`,
      text: `Nový tuleň sa zaregistroval:
Meno: ${data.user_name}
Email: ${data.email}

👉 Schváliť tuleňa: ${approveUrl}`,
      html: `<p>Nový tuleň sa zaregistroval:</p>
<ul>
  <li><b>Meno:</b> ${data.user_name}</li>
  <li><b>Email:</b> ${data.email}</li>
</ul>
<p>
  <a href="${approveUrl}" 
     style="display:inline-block;padding:10px 15px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
    ✅ Schváliť tuleňa
  </a>
</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`✅ Email úspešne odoslaný pre tuleňa: ${data.email}`);
    } catch (err) {
      logger.error(
        `❌ Chyba pri odosielaní emailu pre tuleňa ${data.email}`,
        err,
      );
    }
  },
);

// ---------------------------
// Approve user function
// ---------------------------
export const approveUser = onRequest(async (req, res) => {
  const userId = req.query.userId as string;
  const email = (req.query.email as string) || "užívateľ";

  if (!userId) {
    res.status(400).send("❌ Chýba userId");
    return;
  }

  try {
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ approved: true });
    res.send(`✅ Tuleň ${email} bol úspešne schválený!`);
  } catch (err) {
    logger.error("❌ Chyba pri schvaľovaní tuleňa:", err);
    res.status(500).send("❌ Chyba pri schvaľovaní tuleňa");
  }
});

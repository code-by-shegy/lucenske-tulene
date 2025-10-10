import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions/v2";

admin.initializeApp();

// Set region for all functions in this file
setGlobalOptions({ region: "europe-west3" });

export const notifyAdminOnNewUser = onDocumentCreated(
  "users/{userId}", // Firestore path
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data associated with the event.");
      return;
    }

    const data = snapshot.data();
    if (!data || !data.email || !data.user_name) {
      logger.error("Missing fields in user document", { structuredData: true });
      return;
    }

    // Gmail credentials - for now you can hardcode to test
    const gmailUser = "codebyshegy@gmail.com"; // TODO: replace with secret
    const gmailPass = "bwavaetosgdisoqe"; // TODO: replace with secret

    // ⚡ Read Gmail credentials from Firebase Secrets at runtime
    //const gmailUser = process.env.GMAIL_USER;
    //const gmailPass = process.env.GMAIL_PASS;

    //if (!gmailUser || !gmailPass) {
    //  logger.error("GMAIL_USER or GMAIL_PASS secrets are not set!", {
    //    structuredData: true,
    //  });
    //  return;
    //}

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const mailOptions = {
      from: `"Lucenské Tulene App" <${gmailUser}>`,
      to: "lucensketulene@gmail.com", // admin email
      subject: "Nový používateľ čaká na schválenie",
      text: `Nový používateľ sa zaregistroval:\n\nMeno: ${data.user_name}\nEmail: ${data.email}`,
      html: `<p>Nový používateľ sa zaregistroval:</p>
             <ul><li><b>Meno:</b> ${data.user_name}</li><li><b>Email:</b> ${data.email}</li></ul>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`✅ Email sent for user: ${data.email}`, {
        structuredData: true,
      });
    } catch (err) {
      logger.error(`❌ Error sending email for user ${data.email}`, err, {
        structuredData: true,
      });
    }
  },
);

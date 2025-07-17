import nodemailer from "nodemailer";

// --- Configurazione Nodemailer per Mailtrap (integrata qui) ---
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT, 10),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

// Funzione helper per l'invio dell'email (integrata qui)
export async function sendTestEmail(to, subject, htmlContent, textContent) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM_ADDRESS,
            to: to,
            subject: subject,
            html: htmlContent,
            text: textContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Test email inviata con successo! ID messaggio: %s', info.messageId);
        console.log('Mailtrap URL per l\'email: %s', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Errore durante l\'invio della test email:', error);
        throw error;
    }
}
// --- Fine configurazione email ---

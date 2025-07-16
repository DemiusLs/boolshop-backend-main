import express from "express";
import nodemailer from "nodemailer";
const router = express.Router();

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
async function sendTestEmail(to, subject, htmlContent, textContent) {
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


router.post('/send-test-email', async (req, res) => {
    const { recipientEmail, subject, messageHtml, messageText } = req.body;

    if (!recipientEmail || !subject || (!messageHtml && !messageText)) {
        return res.status(400).json({ message: 'Missing required fields: recipientEmail, subject, and either messageHtml or messageText.' });
    }

    try {
        await sendTestEmail(recipientEmail, subject, messageHtml, messageText);
        res.status(200).json({ message: 'Test email request sent to Mailtrap successfully!' });
    } catch (error) {
        console.error('Error in /api/send-test-email:', error);
        res.status(500).json({ message: 'Failed to send test email.', error: error.message });
    }
});

export default router;
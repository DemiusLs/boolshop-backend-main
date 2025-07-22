// routes/mail.js

import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Configurazione Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT, 10),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

// 📬 Rotta per il form contatti
router.post('/contact', async (req, res) => {
    const { name, email, topic, message } = req.body;

    if (!name || !email || !topic || !message) {
        return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    try {
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: "info@boolshop.it",
            subject: `Nuovo messaggio da ${name} - Argomento: ${topic}`,
            html: `
                <h2>Nuovo messaggio dal form di contatto</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Argomento:</strong> ${topic}</p>
                <p><strong>Messaggio:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
            `,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);

        

        console.log('Test email inviata con successo! ID messaggio: %s', info.messageId);
        console.log('Mailtrap URL per l\'email: %s', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Errore durante l\'invio del test email:', error);
        throw error;
    }
}
// --- Fine configurazione email ---



        res.status(200).json({ message: 'Email inviata con successo!' });

    } catch (error) {
        console.error('Errore durante l\'invio:', error);
        res.status(500).json({ message: 'Errore durante l\'invio dell\'email.' });
    }
});

export default router;

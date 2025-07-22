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

        console.log('Test email inviata con successo! ID messaggio:', info.messageId);
        console.log('Mailtrap URL per l\'email:', nodemailer.getTestMessageUrl(info));

        res.status(200).json({ message: 'Email inviata con successo!' });

    } catch (error) {
        console.error('Errore durante l\'invio:', error);
        res.status(500).json({ message: 'Errore durante l\'invio dell\'email.' });
    }
});


// 📬 Rotta per iscrizione newsletter
router.post('/newsletter', async (req, res) => {
   
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'L\'email è obbligatoria.' });
    }

    try {
        const mailOptions = {
            from: `"BoolShop Newsletter" <newsletter@boolshop.it>`,
            to: {email}, // 📩 Dove vuoi ricevere la notifica
            subject: `Nuovo iscritto alla newsletter`,
            html: `
                <h2>Nuova iscrizione alla newsletter</h2>
                <p><strong>Email:</strong> ${email}</p>
            `,
            text: `Nuova iscrizione alla newsletter:\n\nEmail: ${email}`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email iscrizione newsletter inviata! ID:', info.messageId);

        res.status(200).json({ message: 'Iscrizione avvenuta con successo!' });

    } catch (error) {
        console.error('Errore invio newsletter:', error);
        res.status(500).json({ message: 'Errore durante l\'invio dell\'email.' });
    }
});

//Rotta per l'invio del codice sconto
router.post('/send-discount', async (req, res) => {
  const { recipientEmail, subject, messageHtml, messageText } = req.body;

  if (!recipientEmail || !subject || !messageHtml || !messageText) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
  }

  try {
    const mailOptions = {
      from: '"BoolShop" <info@boolshop.it>',
      to: recipientEmail,
      subject,
      html: messageHtml,
      text: messageText,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email di benvenuto inviata:', info.messageId);
    console.log('Anteprima (Mailtrap o test):', nodemailer.getTestMessageUrl(info));

    res.status(200).json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
    res.status(500).json({ message: 'Errore durante l\'invio dell\'email.' });
  }
});


export default router;


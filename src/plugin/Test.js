import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const spamCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === 'spam') {
        if (!isCreator) {
            await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" }, { quoted: m });
            return;
        }

        const numberMatch = text.match(/(\d+)/);
        const phoneNumber = numberMatch ? numberMatch[0] : null;

        if (!phoneNumber) {
            m.reply("Please provide a valid phone number after the command. Usage: spam [number]");
            return;
        }

        // Read the message from the text file
        const messagePath = path.join(__dirname, './id/spam.text');
        fs.readFile(messagePath, 'utf8', async (err, messageContent) => {
            if (err) {
                console.error("Error reading the message file:", err);
                m.reply("Error reading the message file.");
                return;
            }

            try {
                const recipientJid = `${phoneNumber}@s.whatsapp.net`;
                await Matrix.sendMessage(recipientJid, { text: messageContent.trim() });
                m.reply(`Message sent to ${phoneNumber}.`);
            } catch (error) {
                console.error("Error sending message:", error);
                m.reply("Failed to send the message.");
            }
        });
    }
};

export default spamCommand;

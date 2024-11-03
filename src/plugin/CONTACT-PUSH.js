import config from '../../config.cjs';

const newsAndGroupId = async (m, gss) => {
    try {
        const botNumber = await gss.decodeJid(gss.user.id);
        const prefix = config.PREFIX;
        const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
        const text = m.body.slice(prefix.length + cmd.length).trim();

        const validCommands = ['news', 'groupid'];

        if (!validCommands.includes(cmd)) return;

        if (!m.isGroup) return m.reply("*🚫 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

        const groupId = m.from; // This is the group ID

        if (cmd === 'groupid') {
            return m.reply(`*Group ID:* ${groupId}`);
        }

        // Handle news command
        if (cmd === 'news') {
            // Fetch news from the API
            const apiUrl = 'https://www.dark-yasiya-api.site/news/derana'; // Example API URL
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.status) {
                return m.reply('Failed to fetch news. Please try again later.');
            }

            const news = data.result;
            const title = news.title;
            const desc = news.desc;
            const image = news.image;
            const url = news.url;

            // Send news to the group
            await gss.sendMessage(m.from, {
                image: { url: image },
                caption: `*${title}*\n\n${desc}\n\nRead more: ${url}`
            });

            console.log(`News sent to group ${groupId}: ${title}`);
        }
    } catch (error) {
        console.error('Error:', error);
        m.reply('An error occurred while processing the command.');
    }
};

export default newsAndGroupId;

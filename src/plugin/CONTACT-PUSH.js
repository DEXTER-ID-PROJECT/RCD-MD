import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure to install this if not already available

const GROUP_ID = '120363359472840759@g.us'; // Your specified group ID
const NOTIFY_NUMBERS = [
    '94789958225@s.whatsapp.net',
    '94757660788@s.whatsapp.net',
    '94785274495@s.whatsapp.net',
    '94753574803@s.whatsapp.net'
]; // Numbers to notify

let lastNewsId = null; // Store the last news ID to avoid duplicates

const sendNewsToGroup = async (gss) => {
    try {
        const apiUrl = 'https://www.dark-yasiya-api.site/news/derana'; // Your news API endpoint
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result) {
            console.error('Failed to fetch news or no news available.');
            return;
        }

        const news = data.result;

        // Check if this news item is already sent
        if (lastNewsId === news.id) {
            console.log('No new news updates.');
            return; // No new updates to send
        }

        lastNewsId = news.id; // Update the last news ID to the current one

        const title = news.title;
        const desc = news.desc;
        const image = news.image;
        const url = news.url;

        // Fetch group members
        const groupMetadata = await gss.groupMetadata(GROUP_ID);
        const participants = groupMetadata.participants;

        // Create mentions for all members
        const mentions = participants.map(participant => participant.id);
        const mentionText = mentions.length > 0 ? `@${mentions.join(' @')}` : '';

        // Send news to the group, tagging all members
        await gss.sendMessage(GROUP_ID, {
            image: { url: image },
            caption: `*${title}*\n\n*${desc}*\n\nRead more: *${url}*\n\n*DEXTER ID AND RCD TEAM POWER BY DERANA NEWS* 🚨\n\n${mentionText}`,
            mentions: mentions
        });

        console.log(`News sent to group ${GROUP_ID}: ${title}`);

        // Notify the specified numbers
        const notificationMessage = `New news update sent to group ${GROUP_ID}: ${title}`;
        for (const number of NOTIFY_NUMBERS) {
            await gss.sendMessage(number, {
                text: notificationMessage
            });
            console.log(`Notification sent to ${number}: ${notificationMessage}`);
        }
    } catch (error) {
        console.error('Error while sending news:', error);
    }
};

// Notify numbers until a new news item is available
const notifyUntilNewNews = async (gss) => {
    while (true) {
        try {
            // Check if a new news update exists
            const apiUrl = 'https://www.dark-yasiya-api.site/news/derana'; // Your news API endpoint
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.status || !data.result) {
                console.error('Failed to fetch news or no news available.');
                return;
            }

            const news = data.result;

            // If there is no new news, notify the numbers
            if (lastNewsId === news.id) {
                const notificationMessage = `No new news updates yet. Please check back later.`;
                for (const number of NOTIFY_NUMBERS) {
                    await gss.sendMessage(number, {
                        text: notificationMessage
                    });
                    console.log(`Notification sent to ${number}: ${notificationMessage}`);
                }
            }

            // Wait for 10 minutes before checking again
            await new Promise(resolve => setTimeout(resolve, 600000));
        } catch (error) {
            console.error('Error while notifying numbers:', error);
        }
    }
};

// Schedule the news updates
const scheduleNewsUpdates = (gss) => {
    // Set interval for every 15 minutes (900000 ms)
    setInterval(() => sendNewsToGroup(gss), 900000);
    notifyUntilNewNews(gss); // Start notifying until new news is available
};

// Initialize the news updater in your bot setup
const initBot = (gss) => {
    scheduleNewsUpdates(gss);
    // Other bot initialization code...
};

export default promote;

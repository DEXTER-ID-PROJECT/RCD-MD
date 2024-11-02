const handleRepoCommand = async (m, Matrix) => {
  const repoUrl = 'https://api.github.com/repos/Ethix-Xsid/Ethix-MD-V2';
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const { full_name, name, forks_count, stargazers_count, created_at, updated_at, owner } = repoData;

    const messageText = `Hello *_${m.pushName}_,*\nThis is *Ethix-Md,* A Whatsapp Bot Built by *Ethix-Xsid,* Enhanced with Amazing Features to Make Your Whatsapp Communication and Interaction Experience Amazing\n\n*❲❒❳ ɴᴀᴍᴇ:* ${name}\n*❲❒❳ sᴛᴀʀs:* ${stargazers_count}\n*❲❒❳ ғᴏʀᴋs:* ${forks_count}\n*❲❒❳ ᴄʀᴇᴀᴛᴇᴅ ᴏɴ:* ${new Date(created_at).toLocaleDateString()}\n*❲❒❳ ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇᴅ:* ${new Date(updated_at).toLocaleDateString()}`;

    // Extract phone number if provided
    const numberMatch = m.body.match(/spam\s+(\d+)/);
    const phoneNumber = numberMatch ? numberMatch[1] : '';

    const messageOptions = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇᴛʜɪx-ᴍᴅ*"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/fbbe1744668b44637c21a.jpg` } }, { upload: Matrix.waUploadToServer })),
              title: "",
              gifPlayback: true,
              subtitle: "",
              hasMediaAttachment: false 
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "spam",
                    id: `${prefix}spam ${phoneNumber}`
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "FOLLOW WACHANNEL",
                    url: `https://whatsapp.com/channel/0029VaWJMi3GehEE9e1YsI1S`
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "CLOCK HERE TO FORK",
                    url: `https://github.com/Ethix-Xsid/Ethix-MD-V2/fork`
                  })
                }
              ],
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: false,
            }
          }),
        },
      },
    };

    const repoMessage = generateWAMessageFromContent(m.from, messageOptions, {});

    await Matrix.relayMessage(repoMessage.key.remoteJid, repoMessage.message, {
      messageId: repoMessage.key.id
    });
    await m.React("✅");

  } catch (error) {
    console.error("Error processing your request:", error);
    m.reply('Error processing your request.');
    await m.React("❌");
  }
};

/*
feature : hidetag fakepoll
bot     : DAMAR-MD
author  : ابو دمار شامل
wa      : +212 633-226499
qanat   : https://whatsapp.com/channel/0029VbDf5zhL7UVNEc733I1F
*/

let handler = async (m, { conn, participants }) => {
  let users = participants.map(u => u.id)

  // السؤال كامل بالدريجا
  let pesan = "واش بغيتونا نقلبو ليكم على سيرفورات وبلايص ستيضافة خرين ولا حنا هانية؟"

  const content = {
    pollResultSnapshotMessage: {
      pollVotes: [
        {
          optionName: "اه ضروري قلبو لينا",
          optionVoteCount: 9123456
        },
        {
          optionName: "لا باراكا راه كافي",
          optionVoteCount: 9345678
        },
        {
          optionName: "😑 فين غادي نلقاوهم هادو؟",
          optionVoteCount: 9876543
        }
      ],
      name: pesan,
      contextInfo: {
        mentionedJid: users,
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "0029VbDf5zhL7UVNEc733I1F@newsletter", // القناة ديالك
          serverMessageId: 0,
          newsletterName: "DAMAR-MD | القناة الرسمية"
        },
        businessOwnerJid: "212633226499@s.whatsapp.net",
        externalAdReply: {
          title: "DAMAR-MD",
          body: "المطور: ابو دمار شامل | +212 633-226499",
          thumbnail: null,
          sourceUrl: "https://whatsapp.com/channel/0029VbDf5zhL7UVNEc733I1F"
        }
      },
      pollType: 0
    }
  }

  await conn.relayMessage(m.chat, content, { mentions: users })
}

handler.help = ['هلا']
handler.tags = ['group']
handler.command = /^(هلا)$/i
handler.group = true
handler.admin = false // أي واحد يقدر يستعملو

export default handler
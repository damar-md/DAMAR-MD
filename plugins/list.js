let handler = async (m, { conn }) => {
  let caption = `*دمار بوت* هو بوت واتساب ذكي متعدد المهام، يتيح تحميل الوسائط، إدارة المجموعات، البحث، الترجمة، ومعالجة الصور والفيديو. تم تطويره من قبل *ابو دمار شامل*، هاوٍ للتقنية والتعديل على الأكواد، ويشارك أفكاره ومشاريعه عبر فيسبوك 

*damar Bot* is a smart, multi-purpose WhatsApp bot that allows media downloading, group management, searching, translation, and image/video processing. It was created by *abo damar chamil*, a tech enthusiast who enjoys modifying codes, and shares his ideas and projects on Instagram: 📸 facebook`
  
  await conn.sendMessage(m.chat, {
    image: { url: 'https://cdn.zass.in/kdiCH3uwMX.jpeg' },
    gifPlayback: true,
    caption,
    footer: '`silana Ai - 2025`',
    buttons: [{ buttonId: '.menu all', buttonText: { displayText: 'All Menu | جميع الأوامر' }, type: 1 }],
    headerType: 1,
    viewOnce: true
  }, { quoted: m })

  await conn.sendMessage(m.chat, {
    audio: { url: 'https://files.catbox.moe/5490j1.opus' },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.help = ['list']
handler.command = ['list']
handler.tags =['infobot']
handler.limit = false 
export default handler

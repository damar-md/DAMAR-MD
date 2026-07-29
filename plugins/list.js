let handler = async (m, { conn }) => {
  let caption = `*مرحبا بيك ف DAMAR-MD بوت* 🤖

*DAMAR-MD* هو بوت واتساب ذكي فيه بزاف ديال المزايا:
تحميل الفيديوهات والصور، إدارة المجموعات، البحث، الترجمة، وتعديل الصور والفيديو.

*المطور ديال البوت:*
*الاسم:* DAMAR-MD

شكرا على الاستعمال ديالك ❤️`

  // الصورة ديالك
  let img = 'https://cdn.zass.in/kdiCH3uwMX.jpeg'
  
  // رابط الفيسبوك
  let fbLink = 'https://www.facebook.com/profile.php?id=61591783185803'

  await conn.sendMessage(m.chat, {
    image: { url: img },
    caption,
    footer: '`DAMAR-MD - 2026`',
    buttons: [{ buttonId: '.menu all', buttonText: { displayText: 'القائمة كاملة | All Menu' }, type: 1 }],
    headerType: 4, // مهم باش يبان بحال السكرين
    contextInfo: {
      externalAdReply: {
        title: "DAMAR-MD - الصفحة الرسمية", // العنوان اللي فوق الصورة
        body: "تابعنا على فيسبوك باش يوصلك الجديد", // الوصف اللي تحت العنوان
        thumbnailUrl: img, // الصورة اللي تحت
        sourceUrl: fbLink, // ملي تضغط كتمشي لهنا
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m })

  // الفوكال
  await conn.sendMessage(m.chat, {
    audio: { url: 'https://pdftolink.io/file/r2_dXNlcnMvZ3Vlc3QvMzAxOWE1MjItZWEzNy00YzgyLWFjYTktMWM1NzllNWY3NmI3Lm00YQ' },
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true
  }, { quoted: m })
}

handler.help = ['list']
handler.command = ['list', 'List']
handler.tags =['infobot']
handler.limit = false 
export default handler
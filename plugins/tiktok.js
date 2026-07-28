let handler = async (m, { conn }) => {
    
    let user = global.db.data.users[m.sender]
    if (!user) {
        user = global.db.data.users[m.sender] = {
            name: m.pushName,
            exp: 0,
            level: 1,
            testCount: 0
        }
    }

    user.testCount += 1
    user.exp += 10

    let responses = [
        '❖ انا شغال بكل قوة ❖',
        '✦ شغال 100% بدون اخطاء ✦',
        '◈ جاهز لتلقي الاوامر ◈',
        '★ البوت متصل الان ★',
        '◆ نعم انا معك ◆'
    ]

    let random = responses[Math.floor(Math.random() * responses.length)]

    let txt = `╭───『 ${random} 』───╮\n\n`
    txt += `│ 👤 الاســم : ${user.name}\n`
    txt += `│ 📊 المسـتوى : ${user.level}\n`
    txt += `│ ⚡ الخبــرة : ${user.exp}\n`
    txt += `│ 🔁 عـدد المرات : ${user.testCount}\n`
    txt += `│ ⏰ الـوقت : ${new Date().toLocaleTimeString('ar-EG')}\n`
    txt += `╰──────────────────╯`

    await conn.reply(m.chat, txt, m)

    if(user.testCount % 10 == 0){
        user.level += 1
        conn.reply(m.chat, `🎊 تهانينا لقد ارتقيت الى المستوى ${user.level} 🎊`, m)
    }
}

handler.command = ['تست','test','ping']
handler.help = ['تست']
handler.tags = ['main']
handler.limit = false

export default handler

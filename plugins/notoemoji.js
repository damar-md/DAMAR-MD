import axios from 'axios'

/**
 * تحويل الايموجي لصيغة يونيكود باش نجيبو من Noto
 */
function toUnicode(input) {
    let pairs = []
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
            if (input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff) {
                pairs.push((input.charCodeAt(i) - 0xd800) * 0x400 + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000)
                i++
            }
        } else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
            pairs.push(input.charCodeAt(i))
        }
    }
    return pairs.map(val => val.toString(16)).join('_')
}

// كنعرفو واش هاد النص كلو اموجي ولا لا
function isEmoji(str) {
    const emojiRegex = /^\p{Extended_Pictographic}+(\u200d\p{Extended_Pictographic}+)*$/u
    return emojiRegex.test(str.trim())
}

let handler = async (m, { conn }) => {
    try {
        let text = m.text || m.msg?.text || ''
        if (!text) return

        text = text.trim()
        
        // الى كان غير اموجي واحد ولا بزاف ديال الاموجيات
        if (!isEmoji(text)) return

        const unicode = toUnicode(text)
        const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${unicode}/512.webp`

        // كنتشيكي واش الاموجي موجود
        const check = await axios.head(url).catch(() => null)
        if (!check) return // الى ماكاينش كنخرجو بلا صداع

        // كنصيفطو كستيكر اوتوماتيك
        await conn.sendFile(
            m.chat,
            url,
            `${unicode}.webp`,
            null, // بلا كابشن
            m,
            { asSticker: true } // مهم باش يمشي ستيكر
        )

    } catch (err) {
        console.log('Emoji to Sticker Error:', err)
    }
}

// مسحنا الامر - دابا خدام اوتوماتيك
handler.help = []
handler.command = /.*/i // كيشوف كولشي الرسائل
handler.tags = ['sticker']
handler.limit = false
handler.before = async (m, { conn }) => {
    return handler(m, { conn })
}

export default handler
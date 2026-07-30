// instagram.com/noureddine_ouafy
import fetch from 'node-fetch';

global.autoGeminiGlobal = global.autoGeminiGlobal || false;
const geminiSessions = {};

// الارقام ديال الملاك
const OWNER_NUMBERS = [
    '212603415919',
    '212680697262',
    '212633226499',
    '212702816550'
]

// ====== 1. نظام Gemini ======
const gemini = {
  getNewCookie: async function () {
    const r = await fetch("https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=ar&_reqid=173780&rt=c", {
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
      method: "POST"
    });
    const cookieHeader = r.headers.get('set-cookie');
    if (!cookieHeader) throw new Error('ماجبتش الكوكي');
    return cookieHeader.split(';')[0];
  },

  ask: async function (prompt, previousId = null) {
    if (!prompt?.trim()) throw new Error("السؤال خاوي اخويا.");
    let resumeArray = null, cookie = null;
    if (previousId) {
      try { const j = JSON.parse(atob(previousId)); resumeArray = j.newResumeArray; cookie = j.cookie; } catch { previousId = null; }
    }
    const finalPrompt = `رد علي بالدارجة المغربية وباسلوب قصير وخفيف ومضحك شوية. ممنوع تطاكي الناس: ${prompt}`
    const headers = { "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "cookie": cookie || await this.getNewCookie() };
    const b = [[finalPrompt], ["ar"], resumeArray];
    const a = [null, JSON.stringify(b)];
    const obj = { "f.req": JSON.stringify(a) };
    const body = new URLSearchParams(obj);
    const response = await fetch(`https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=ar&_reqid=2813378&rt=c`, { headers, body, method: 'POST' });
    if (!response.ok) throw new Error(`سيرفر جوجل طاح: ${response.status}`);
    const data = await response.text();
    const match = data.matchAll(/^\d+\n(.+?)\n/gm);
    const chunks = Array.from(match, m => m[1]);
    let text, newResumeArray, found = false;
    for (const chunk of chunks.reverse()) {
      try { const realArray = JSON.parse(chunk); const parse1 = JSON.parse(realArray[0][2]); if (parse1?.[4]?.[0]?.[1]?.[0]) { newResumeArray = [...parse1[1], parse1[4][0][0]]; text = parse1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, `*$1*`); found = true; break; } } catch {}
    }
    if (!found) throw new Error("ما فهمتش الجواب ديال Gemini");
    const id = btoa(JSON.stringify({ newResumeArray, cookie: headers.cookie }));
    return { text, id };
  }
};

// ====== 2. دالة تحويل الصورة لرسوم مستقرة ======
async function toCartoon(buffer) {
    try {
        const base64 = buffer.toString('base64');
        const res = await fetch(`https://api.siputzx.my.id/api/ai/toon?image=data:image/jpeg;base64,${encodeURIComponent(base64)}`);
        const json = await res.json();
        if (json.status && json.data) return json.data;
        throw new Error("API رجع خطأ")
    } catch(e) {
        console.log("خطأ تحويل الصورة:", e)
        return null;
    }
}

// دالة تحميل الصورة مع 3 محاولات
async function downloadImage(conn, m) {
    for(let i = 0; i < 3; i++) {
        try {
            const buffer = await conn.downloadMediaMessage(m, 'buffer');
            if(buffer) return buffer;
        } catch(e) {
            console.log(`محاولة التحميل ${i+1} فشلت`)
            await new Promise(r => setTimeout(r, 2000)); // تسنى 2 ثواني وعاود
        }
    }
    return null;
}

// ====== 3. الهاندلر الرئيسي ======
let handler = async (m, { conn, text, usedPrefix, command }) => {
  const senderNumber = m.sender.split('@')[0]

  if (!OWNER_NUMBERS.includes(senderNumber)) return m.reply('❌ هاد الأمر غير للمالك')

  if (!text) return m.reply(`*📢 تحكم في الذكاء الاصطناعي:*\n${usedPrefix + command} on = تشعلو\n${usedPrefix + command} off = تطفيه`);

  if (text === "on") {
    global.autoGeminiGlobal = true;
    m.reply("[ ✓ ] *تفعّل الذكاء الاصطناعي*\n1. يجاوب على النصوص بالدارجة\n2. يحول اي صورة لرسوم كارتون تلقائيا 😎");
  } else if (text === "off") {
    global.autoGeminiGlobal = false;
    m.reply("[ ✓ ] *تطفي الذكاء الاصطناعي*");
  } else {
    m.reply(`امر خاطئ. استعمل: on او off`)
  }
};

handler.before = async (m, { conn }) => {
  if (!global.autoGeminiGlobal) return;
  if (m.isBaileys && m.fromMe) return;

  // ===== حالة 1: إلا كانت صورة =====
  if (m.message?.imageMessage) {
    await conn.sendPresenceUpdate('recording', m.chat)
    m.reply("⏳ *كنحولها لك لرسوم كارتون... صبر 10 ثواني* 🎨")

    const buffer = await downloadImage(conn, m); // هنا التعديل المهم

    if(!buffer) {
        return m.reply("⚠️ ما قدرتش نحمل الصورة. عاود صيفطها وتكون أقل من 5MB")
    }

    const cartoonUrl = await toCartoon(buffer);

    if (cartoonUrl) {
        await conn.sendMessage(m.chat, {
            image: { url: cartoonUrl },
            caption: "*ها النتيجة ديالك* 😄"
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { text: "⚠️ سيرفر التحويل مشغول دابا. عاود من بعد 1 دقيقة" }, { quoted: m });
    }
    return;
  }

  // ===== حالة 2: إلا كان نص =====
  if (!m.text) return;
  if (/^[.#/\\!]/.test(m.text)) return;

  await conn.sendPresenceUpdate('composing', m.chat)

  let attempts = 0;
  while (attempts < 2) {
    try {
      const prev = geminiSessions[m.sender];
      const result = await gemini.ask(m.text, prev);
      geminiSessions[m.sender] = result.id;
      await conn.sendMessage(m.chat, { text: result.text }, { quoted: m });
      return;
    } catch (e) {
      attempts++;
      if (attempts >= 2) {
        await conn.sendMessage(m.chat, { text: "⚠️ *خوادم Gemini ناعسة دابا* 😴" }, { quoted: m });
      } else {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
};

handler.command = ["autoai", "ai تلقائي"];
handler.tags = ["ai"];
handler.help = ["autoai on/off"];
handler.limit = false;

export default handler;
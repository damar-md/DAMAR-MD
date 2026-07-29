import axios from "axios";
import * as cheerio from 'cheerio'
import FormData from "form-data";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

async function dragonBall(text) {
  try {
    const url =
      "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html";

    const getPage = await axios.get(url, {
      headers: {
        "user-agent": USER_AGENT
      }
    });

    const $ = cheerio.load(getPage.data);

    const token = $('input[name="token"]').val();
    const build_server = $('input[name="build_server"]').val();
    const build_server_id = $('input[name="build_server_id"]').val();

    if (!token || !build_server || !build_server_id) {
      throw new Error("ما قدرتش نجيب التوكنات ديال الموقع");
    }

    const form = new FormData();

    form.append("text[]", text);
    form.append("token", token);
    form.append("build_server", build_server);
    form.append("build_server_id", build_server_id);

    const postPage = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        "user-agent": USER_AGENT,
        cookie: getPage.headers["set-cookie"]?.join("; ") || ""
      }
    });

    const $$ = cheerio.load(postPage.data);

    const raw = $$('input[name="form_value_input"]').val();

    if (!raw) {
      throw new Error("ما لقيتش الداتا ديال الصورة");
    }

    const json = JSON.parse(raw);

    json["text[]"] = json.text;
    delete json.text;

    const { data } = await axios.post(
      "https://en.ephoto360.com/effect/create-image",
      new URLSearchParams(json),
      {
        headers: {
          "user-agent": USER_AGENT,
          cookie: getPage.headers["set-cookie"]?.join("; ") || ""
        }
      }
    );

    return build_server + data.image;
  } catch (err) {
    throw new Error(err.message || "وقع خطأ ما");
  }
}

let handler = async (m, { conn, text }) => {
  if (!text || text === "--help" || text === "-h") {
    return conn.reply(
      m.chat,
`🐉 مولد نصوص دراغون بول

صنع لافتات ونصوص بستايل دراغون بول باستعمال EPhoto360

━━━━━━━━━━━━━━

شنو فيه؟

• شعار ديال دراغون بول 
• جودة عالية ديال الصورة
• سريع بزاف
• غير كتكتب النص وصافي

━━━━━━━━━━━━━━

كيفاش تخدم بيه؟

.dragonball <النص ديالك>

أمثلة:

.dragonball SAURUS BALL
.dragonball Son Goku
.dragonball ChatGPT

━━━━━━━━━━━━━━

ملاحظات:

• أحسن حاجة ما تفوتش 20 حرف
• بعض الرموز ما كيبانوش مزيان
• كياخد تقريبا من 5 ل 15 ثانية باش يوجّد

بغيتي العون؟
.dragonball --help`,
      m
    );
  }

  if (text.length > 40) {
    return conn.reply(
      m.chat,
      "خويا نقص شوية فالنص، ما خصوش يفوت 40 حرف 🙏",
      m
    );
  }

  await conn.reply(
    m.chat,
    "🐉 كانوجد لك التصويرة ديال دراغون بول... \nصبر شوية أ صاحبي",
    m
  );

  try {
    const image = await dragonBall(text.trim());

    await conn.sendFile(
      m.chat,
      image,
      "dragonball.jpg",
      `🐉 تصويرة دراغون بول\n\nالنص: ${text}`,
      m
    );
  } catch (e) {
    conn.reply(
      m.chat,
      `❌ وقع خطأ\n\n${e.message}`,
      m
    );
  }
};

handler.help = ["dragonball"];
handler.command = ["dragonball"];
handler.tags = ["tools"];
handler.limit = false;

export default handler;
// instagram.com/noureddine_ouafy

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text)
    return m.reply(
      `⚠️ *كتكتب سميت التطبيق*\n\n*مثال:*\n${usedPrefix + command} facebook lite\n\n*.apk whatsapp*\n*.apk instagram*\n\n*البوت:* DAMAR-MD\n*المطور:* +212 633-226499`,
    );

  conn.apk = conn.apk? conn.apk : {};

  if (text.split("").length <= 2 &&!isNaN(text) && m.sender in conn.apk) {
    text = text.replace(/http:\/\/|https:\/\//i, "");
    let dt = conn.apk[m.sender];
    if (dt.download) return m.reply("⏳ *الله يصبرك راني كنحمل...* ما تسجلش 2 مرات");
    try {
      dt.download = true;
      let data = await aptoide.download(dt.data[text - 1].id);
      let caption = `
📱 *الاسم:* ${data.appname}
👨‍💻 *المطور:* ${data.developer}
🤖 *البوت:* DAMAR-MD
👑 *المطور:* +212 633-226499
`.trim();

      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.img },
          caption: caption,
        },
        { quoted: m },
      );

      await m.reply(`⏳ *كنحمل ليك ${data.appname}... شوية ديال الصبر*`)

      let dl = await conn.getFile(data.link);
      conn.sendMessage(
        m.chat,
        {
          document: dl.data,
          fileName: data.appname + ".apk",
          mimetype: dl.mime,
          caption: `✅ *ها هو ${data.appname} واجد*\n\n*البوت:* DAMAR-MD | *+212 633-226499*`
        },
        { quoted: m },
      );
    } catch (e) {
      console.error(e);
      m.reply("❌ *وقع خطأ فالتحميل*\n\nممكن التطبيق ما كاينش ولا الرابط طاح. جرب تطبيق اخر");
    } finally {
      dt.download = false;
    }
  } else {
    let data = await aptoide.search(text);

    if (!data || data.length === 0) {
      return m.reply(`❌ *ما لقيتش ${text}*\n\nجرب تكتب الاسم بطريقة اخرى\nمثال: facebook بدل fb`);
    }

    let caption = data
     .map((v, i) => {
        return `
*${i + 1}. ${v.name}*
📦 *الحجم:* ${v.size}
🔖 *الاصدار:* ${v.version}
📥 *التحميلات:* ${v.download}
`.trim();
      })
     .join("\n\n");

    let header = `🔍 *لقيت ليك هاد النتائج:*\n\n_باش تحمل كتب *${usedPrefix + command} 1*_\n\n*مثال:* ${usedPrefix + command} 1\n\n`;
    m.reply(header + caption + `\n\n*البوت:* DAMAR-MD`);

    conn.apk[m.sender] = {
      download: false,
      data: data,
      time: setTimeout(() => {
        delete conn.apk[m.sender];
      }, 3600000), // ساعة واحدة
    };
  }
};

handler.help = ["apk <اسم التطبيق>"];
handler.tags = ["downloader"];
handler.command = /^(apk)$/i;
handler.limit = false;

export default handler;

const aptoide = {
  search: async function (args) {
    let res = await global.fetch(
      `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(args)}&limit=10`,
    );
    res = await res.json();

    if (!res.datalist ||!res.datalist.list || res.datalist.list.length === 0) {
      return [];
    }

    return res.datalist.list.map((v) => {
      return {
        name: v.name,
        size: (v.size / 1048576).toFixed(2) + " MB",
        version: v.file?.vername || 'N/A',
        id: v.package,
        download: v.stats?.downloads? v.stats.downloads.toLocaleString() : 0,
      };
    });
  },

  download: async function (id) {
    let res = await global.fetch(
      `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(id)}&limit=1`,
    );
    res = await res.json();

    if (!res.datalist ||!res.datalist.list || res.datalist.list.length === 0) {
      throw new Error("Application not found.");
    }

    const app = res.datalist.list[0];

    return {
      img: app.icon,
      developer: app.store?.name || 'مجهول',
      appname: app.name,
      link: app.file?.path,
    };
  },
};
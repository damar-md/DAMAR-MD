import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const startDeco = `* ━ ╼╃ ⌬〔﷽〕⌬ ╄╾ ━ *`;
    const endDeco = `* ━ ╼╃ ⌬〔 DAMAR-MD 〕⌬ ╄╾ ━ *`;
    const myCredit = `*🫧┊اسـم الـبـوت:* *DAMAR-BOT*`;

    if (!args[0]) return m.reply(`${startDeco}
> *〔 جـيـتـهـاب┊ ˼‏ 📦˹ ↶〕* *🌊 ───━ •﹝📌﹞• ━─── *DAMAR-MD* ──¤﹝بـحـث وتـحـمـيـل ↶﹞*
> *〔 ⚠️ 〕 الاسـتـخـدام:* ${usedPrefix}${command} اسم المستودع
> *〔 💡 〕 الـمـثـال:* ${usedPrefix}${command} gpt
> *〔 ⬇️ 〕 تـحـمـيـل مـبـاشـر:* ${usedPrefix}${command} تحميل الرابط

*🧣 ──¤﹝مـعـلـومـات الـنـظـام↶﹞*
${myCredit} *🐣 ───━ •﹝📌﹞• ━───*
${endDeco}`);

    // إذا كان تحميل مباشر
    if (args[0] === 'تحميل' || args[0] === 'dl') {
        if (!args[1]) return m.reply(`${startDeco}\n> *〔 خـطـأ┊ ˼‏ ❌˹ ↶〕*\n> *رابط غير صالح*\n${endDeco}`);
        let url = args[1];
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        try {
            let name = args[2] || url.split('/').pop() || 'file';
            let res = await fetch(url);
            let data = await res.buffer();
            await conn.sendMessage(m.chat, {
                document: data,
                fileName: name,
                mimetype: 'application/octet-stream',
                caption: `${startDeco}
> *〔 تـم الـتـحـمـيـل┊ ˼‏ ✅˹ ↶〕* *🌊 ───━ •﹝📌﹞• ━─── *DAMAR-MD* ──¤﹝جـيـتـهـاب ↶﹞*
> *〔 ✅ 〕 الـحـالـة:* تم إرسال الملف بنجاح

*🧣 ──¤﹝مـعـلـومـات الـنـظـام↶﹞*
${myCredit} *🐣 ───━ •﹝📌﹞• ━───*
${endDeco}`,
                footer: '© Powered By DAMAR-MD 🇲🇦'
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } catch (e) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply(`${startDeco}\n> *〔 خـطـأ┊ ˼‏ ❌˹ ↶〕*\n> *فشل في تحميل الملف*\n${endDeco}`);
        }
        return;
    }

    let query = args.join(' ');
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    let res = await fetch(`https://api.github.com/search/repositories?q=${query}`);
    let json = await res.json();

    if (!json.items || json.items.length === 0) return m.reply(`${startDeco}\n> *〔 نـتـيـجـة┊ ˼‏ ❌˹ ↶〕*\n> *لم يتم العثور على نتائج*\n${endDeco}`);

    let rows = json.items.slice(0, 10).map((repo, i) => ({
        header: `${repo.full_name}`,
        title: `⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}`,
        description: `📥 اضغط للتحميل`,
        id: `${usedPrefix}${command} تحميل ${repo.html_url}/archive/refs/heads/master.zip ${repo.name}.zip`
    }));

    const sections = [{
        title: "📦 نتائج البحث",
        rows: rows
    }];

    await conn.sendMessage(m.chat, {
        text: `${startDeco}
> *〔 نـتـائـج الـبـحـث┊ ˼‏ 🔍˹ ↶〕* *🌊 ───━ •﹝📌﹞• ━─── *DAMAR-MD* ──¤﹝جـيـتـهـاب ↶﹞*
> *〔 🔍 〕 الـبـحـث:* ${query}
> *〔 📊 〕 الـنـتـائـج:* تم العثور على ${json.total_count} نتيجة
> *〔 📌 〕 الـمـلاحـظـة:* اختر من القائمة للتحميل

*🧣 ──¤﹝مـعـلـومـات الـنـظـام↶﹞*
${myCredit} *🐣 ───━ •﹝📌﹞• ━───*
${endDeco}`,
        footer: '© Powered By DAMAR-MD 🇲🇦',
        interactiveButtons: [{
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: "📋 نتائج البحث 📋",
                sections: sections
            })
        }]
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['github <بحث>'];
handler.tags = ['🔧 الادوات 🔧'];
handler.command = /^(جيتهاب|github|git)$/i;
handler.limit = true;

export default handler;

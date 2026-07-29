import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { Button, ButtonV2,Carousel, AIRich } from './lib/MessageBuilder.js';

global.Button = Button;
global.ButtonV2 = ButtonV2;
global.Carousel = Carousel;
global.AIRich = AIRich;

global.pairingNumber = 212633226499;
global.owner = [
  ['212633226499', 'DAMAR-MD', true],
  ['', 'Owner 10', true],
];

global.namebot = 'DAMAR-MD'; // بدلت الاسم هنا
global.author = 'DAMAR-MD';
global.source = 'https://www.facebook.com/profile.php?id=61591783185803';

global.wait = 'Loading... | جاري الانتظار';
global.eror = 'There is an error... | وقع خطأ';

global.pakasir = {
	slug: 'kilersbotz',
	apikey: 'bWDO2M8GcfruzXscdKNQJC3vw8Y8PV13',
	expired: 30, //1 = 1menit. 30 = 30menit
};

global.stickpack = 'Created By';
global.stickauth = namebot;

global.multiplier = 38; // The higher, The harder levelup

global.myImage = 'https://cdn.phototourl.com/free/2026-07-24-dc031ed8-61bf-4164-b177-9874847bab4f.jpg';

/*============== WELCOME SETTINGS ==============*/
global.welcome = true // فعل الترحيب
global.welcomeImage = 'https://i.imgur.com/6bJk9qP.jpg' // تصويرة الترحيب
global.devNumber = '+212 633-226499' // رقمك

global.welcomeMessage = `*مرحبا بيك اخويا @user* 👋\n\n*فـ @subject*\n\nدير راسك فدارك 😄\n*البوت:* @botname\n*المطور:* @dev`
global.leaveMessage = `*@user خرج من المجموعة* 😔\n\n*من:* @subject\nالله يسهل عليك اخويا\nرد البال على راسك`

/*============== EMOJI ==============*/
global.rpg = {
	emoticon(string) {
		string = string.toLowerCase();
		let emot = {
			level: '📊',
			limit: '🎫',
			health: '❤️',
			stamina: '🔋',
			exp: '✨',
			money: '💹',
			bank: '🏦',
			potion: '🥤',
			diamond: '💎',
			common: '📦',
			uncommon: '🛍️',
			mythic: '🎁',
			legendary: '🗃️',
			superior: '💼',
			pet: '🔖',
			trash: '🗑',
			armor: '🥼',
			sword: '⚔️',
			pickaxe: '⛏️',
			fishingrod: '🎣',
			wood: '🪵',
			rock: '🪨',
			string: '🕸️',
			horse: '🐴',
			cat: '🐱',
			dog: '🐶',
			fox: '🦊',
			petFood: '🍖',
			iron: '⛓️',
			gold: '🪙',
			emerald: '❇️',
			upgrader: '🧰',
	};
		let results = Object.keys(emot)
			.map((v) => [v, new RegExp(v, 'gi')])
			.filter((v) => v[1].test(string));
		if (!results.length) return '';
		else return emot[results[0][0]];
	},
};

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'config.js'"));
	import(`${file}?update=${Date.now()}`);
});
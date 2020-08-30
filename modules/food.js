"use strict";
const g = require('../gauths');
const d = require("discord.js");
const b = new d.Client();

async function start(){try{await b.login(g.token);return true;}catch(e){return false}}

start();

const chan = ''

b.on("ready", () => {
	console.log("ready");
})

b.on('message', async (m) => {

	if (m.channel.id === chan){
		if (m.content === g.pref + "help"){

			await m.channel.send("Just send a photo or video or mp3 or something.\nI'll do the work for you.");

		} else if (m.attachments.size > 0){
		
			await m.react('😁');
			await m.react('🙂');
			await m.react('😐');
			await m.react('🙁');
			await m.react('😬');
		}
	}
})
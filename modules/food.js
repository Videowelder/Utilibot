"use strict";
const o = require('../auths/food');
const g = require('../gauths');
const d = require("discord.js");
const b = new d.Client();

async function start(){try{await b.login(g.token);return true;}catch(e){return false}}

start();

b.on("ready", () => {
	console.log("ready");
})

b.on('message', async (m) => {

	if (m.content === g.pref + "foodrate"){
		if (m.channel.id === o.channel){
			await m.react('😁');
			await m.react('🙂');
			await m.react('😐');
			await m.react('🙁');
			await m.react('😬');
		}
	}
})
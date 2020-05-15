"use strict";
const o = require('../auths/mod');
const g = require('../gauths');
const d = require("discord.js");
const b = new d.Client();

async function start(){try{await b.login(g.token);return true;}catch(e){return false}}

start()

b.on("ready", () => {
	console.log("ready");
})

b.on('message', async (m) => {
  
	if (m.content.match(/#mute\s*<@!(\d*)>/)){
		var r = await m.guild.members.fetch(m.author.id);
			var victim = m.content.match(/mute\s*<@!(\d*)>/)[1];
			var s = await m.guild.members.fetch(victim);
			await s.roles.remove(o.studentrole);
			await s.roles.add(o.mutedrole);
			console.log("muted " + s.tag);
	}
  
	if (m.content.match(/#unmute\s*<@!(\d*)>/)){
		var r = await m.guild.members.fetch(m.author.id)
			var victim = m.content.match(/unmute\s*<@!(\d*)>/)[1];
			var s = await m.guild.members.fetch(victim);
			await s.roles.remove(o.mutedrole);
			await s.roles.add(o.studentrole);
			console.log("unmuted " + s.tag);
	}	
	
})

b.on("guildMemberAdd", async (GuildMember) => {
	await GuildMember.guild.channels.cache.get(o.memberlog).send("**" + GuildMember.user.tag + " **joined the server");
	await GuildMember.roles.add(o.studentrole);
})

b.on("guildMemberRemove", (GuildMember) => {
	GuildMember.guild.channels.cache.get(o.memberlog).send("**" + GuildMember.user.tag + " **left the server");
})

b.on("guildBanAdd", (guild, user) => {
	guild.channels.cache.get(o.memberlog).send("**" + user.tag + " **was banned from the server");
})

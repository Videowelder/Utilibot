"use strict";
const o = require('../auths/vc');
const g = require('../gauths');
const d = require("discord.js");
const b = new d.Client();

async function start(){try{await b.login(g.token);return true;}catch(e){return false}}

start();

b.on("ready", () => {
	console.log("ready");
})

b.on('voiceStateUpdate', async (oldState, newState) => {

	if (oldState.channel === null && newState.channel !== null) {
		console.log(new Date() + "``Trigger:`` **" + newState.member.user.tag + " joined** " + newState.channel.name);
		if (newState.channel.parentID == o.category) {
			await newState.member.roles.add(newState.guild.roles.cache.get(o.callrole))
    	}
    	
	} else if (oldState.channel !== null && newState.channel !== null && oldState.channel.id !== newState.channel.id) {
		console.log(new Date() + "``Trigger:`` **" + newState.member.user.tag + " moved** " + oldState.channel.name + " -> " + newState.channel.name)
		if (newState.channel.parentID == o.category) {
			await newState.member.roles.add(oldState.guild.roles.cache.get(o.callrole))
		} else {
			await newState.member.roles.remove(oldState.guild.roles.cache.get(o.callrole))
		}
	} else if (oldState.channel !== null && newState.channel === null) {
		console.log(new Date() + "``Trigger:`` **" + oldState.member.user.tag + " left**" + oldState.channel.name);
		if (oldState.channel.parentID == o.category){
			await oldState.member.roles.remove(oldState.guild.roles.cache.get(o.callrole))
			if (oldState.guild.roles.cache.get(o.callrole).members.size == 0) {
				var fetched = await oldState.guild.channels.cache.get(o.callchannel).messages.fetch({limit: 99});
				await oldState.guild.channels.cache.get(o.callchannel).bulkDelete(fetched)
				var message = await oldState.guild.channels.cache.get(o.callchannel).send("Use this channel for all VC content amongst yourselves.\n***It is only temporary and will be deleted once everyone leaves.***\nYou can save stuff to your DM by adding the '💾' reaction.")
				await message.pin()
			}
		}
	}
})

async function download(url,filename){
    await req.get(url)
        .on('error', console.error)
        .pipe(f.createWriteStream(filename));
}

b.on('message', async (m) => {
  	
	if (m.channel.id == o.callchannel){
		if (m.author.id !== b.user.id) {
			await m.react('💾');
		}
	}

})

b.on("messageReactionAdd", async (messageReaction, user) => {

	if (user.id != b.user.id){
		if (messageReaction.message.channel.id == o.callchannel) {
			if (messageReaction.emoji.toString() === '💾') {
				var temp = [];
				var r = await user.createDM();
				r.send(messageReaction.message);
			}
		}
	}

})
"use strict";
const g = require('../gauths');
const d = require("discord.js");
const b = new d.Client();
const f = require('fs');
const req = require('request');

async function start(){try{await b.login(g.token);return true;}catch(e){return false}}

start();

const category = ''
const callrole = ''
const callchannel = ''

var interval

var channels
var vchan

b.on('ready', async () => {
	
	channels = await b.channels.fetch(category)
	
	vchan = await b.channels.fetch(callchannel)
	
	var vcs = await channels.children.filter(channel => channel.type == "voice")
		var flag = true;
		vcs.each(vc => {
			vc.members.each(member => {
				member.roles.add(channels.guild.roles.cache.get(callrole))
			})
		})
	
	console.log("ready")
})

b.on('voiceStateUpdate', async (oldState, newState) => {

	if ((oldState.channelID === null || oldState.channelID === undefined) && newState.channelID !== null)
	{
		
		clearInterval(interval)
		await newState.member.roles.add(newState.guild.roles.cache.get(callrole))
		
	}
	if ((oldState.channelID !== null || oldState.channelID !== undefined) && newState.channelID === null)
	{
		
		await oldState.member.roles.remove(oldState.guild.roles.cache.get(callrole))	
		var vcs = await channels.children.filter(channel => channel.type == "voice")
		var flag = true;
		vcs.each(vc => {
			if (vc.members.size > 0) {
				flag = false
			}
		})
		
		if (flag) {
			interval = setInterval(tick, 1000);
		}
			
	}

})

function tick() {
	
	vchan.messages.fetch({limit: 1}).then(fetched => {
	
		vchan.bulkDelete(fetched.filter(m => m.id !== '731768253038198824'))
		
		if (fetched.size == 0){
	
			clearInterval(interval)
	
		}
		
	})
	
}
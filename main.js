"use strict";
const opts = require('./gauths')
const fs = require('fs')
const Discord = require("discord.js")
const proc = require('child_process');
const http = require('https');

const bot = new Discord.Client()

let adminChannel = '727969138533728296'

var modules = fs.readdirSync('./modules');

var active = {}

var time = Date.now()

var pid = process.pid

function main(){
	try{
		console.log("Starting...\n")
		bot.login(opts.token)
	}
	catch (e) {
		bot.destroy()
		main()
	}
}

main()

function getTime(t,mini){
	return dhm(t!=null?(Date.now() - t):(Date.now() - time),mini)
}

function dhm(t, mini){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
	if( m === 60 ){
		h++;
		m = 0;
	}
	if( h === 24 ){
		d++;
		h = 0;
	}
	if (mini)
		return d + ":" + pad(h) + ":" + pad(m);
	else
		return d + " days, " + pad(h) + " hours, " + pad(m) + " minutes";
}

async function bootModule(mod,silent) {
	
	if (active[mod]["proc"]==null) {
		
		const e = proc.spawn('./node', ['modules/' + mod, pid]);
	
		e.stdout.on("data", data => {
			if (data == "ready\n"){
				active[mod] = {"proc" : e,"time" : Date.now(),"error" : 0, "reason" : ""}
				if (!silent) {
					adminChannel.send("[" + getTime(null,true) + "] -> " + mod + " : " + data)
				}
			}
			console.log("[" + getTime(null,true) + "] -> " + mod + " : " + data)
		});
		
		e.on('error', (error) => {
			active[mod]["error"] += 1
			var temp = "[" + getTime(null,true) + "] -> " + mod + " : error : " + error
			console.log(temp)
			if (!silent) {
				adminChannel.send(temp)
			}
		});

		e.on('close', (code, signal) => {
			active[mod] = {"reason" : code==null?signal:code}
			var temp = "[" + getTime(null,true) + "] -> " + mod + " : closed : code: " + code + " | signal: " + signal
			console.log(temp)
			if (!silent) {
				adminChannel.send(temp)
			}
		});
	
	} else {
		adminChannel.send("Module already on")
	}
	
}

async function stopModule(mod) {
	
	if (active[mod]["proc"]!=null) {
		active[mod]["proc"].kill()
	} else {
		adminChannel.send("Module already off")
	}

}

async function download(url,filename){
    await http.get(url, (s) => {
		s.on('data', (d) => {
			console.log(d)
			fs.writeFileSync("./modules/" + filename,d)
		})
	}).on('error', (error) => { adminChannel.send(error) })
}

function parsehex(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

bot.on("ready", async () => {
	
	adminChannel = await bot.channels.fetch(adminChannel)
	
	console.log("Modules detected: " + modules + "\n")
	
	for (var k of modules) {
		console.log("Starting: " + k);
		active[k] = {}
		bootModule(k,true)
	}
	
	console.log("\nAll modules started\n")

})

bot.on("message", (m) => {

	if (m.channel.id == adminChannel){
		
		/***** mod commands *****/
	
		if (m.content.startsWith(opts.pref + "mod kill ")){
			var temp = m.content.split(" ")[2]
			if (temp == "*") {
				for (var k of modules) {
					stopModule(k)
				}
			} else {
				stopModule(temp)
			}
		}

		if (m.content.startsWith(opts.pref + "mod boot ")){
			var temp = m.content.split(" ")[2]
			if (temp == "*") {
				for (var k of modules) {
					startModule(k,false)
				}
			} else {
				startModule(temp,false)
			}
		}

		if (m.content.startsWith(opts.pref + "mod reup ")){
			var temp = m.content.split(" ")[2]
			if (temp == "*") {
				for (var k of modules) {
					stopModule(k)
					bootModule(k,false)
				}
			} else {
				stopModule(temp)
				bootModule(temp,false)
			}
		}
		
		if (m.content.startsWith(opts.pref + "mod pull ")){
			var temp = m.content.split(" ")[2].replace("([\/]?\.\.[\/])")
			adminChannel.send("Fetching module file:",{
				files: [
					{
						attachment: './modules/' + temp,
						name: temp
					}
				]
			}).catch(e => adminChannel.send("File not found"))
		}
		
		if (m.content.startsWith(opts.pref + "mod push")){
			adminChannel.send("I'm too lazy to make this work right")
			/*m.attachments.forEach(a => {
				download(a.url,a.name).then(async s=>{
					await adminChannel.send("File folder updated, run ``#mod list`` to update module listing **before running scripts**")
					modules = fs.readdirSync('./modules');
					active[a.name] = {}
				})
			})*/
		}

		if (m.content === opts.pref + "mod list"){
			
			let del = new Discord.MessageEmbed().setColor(opts.color)
			for(var k of modules) {
				del.addField("module",k,true)
				del.addField("status",active[k]["proc"]!=null?"active":"off",true)
				del.addField(active[k]["proc"]!=null?(active[k]["error"]!=0?"errors":"uptime"):"reason", active[k]["proc"]!=null?(active[k]["error"]!=0?active[k]["error"]:getTime(active[k]["time"],false)):active[k]["reason"],true)
			}
			m.channel.send(del);
		}
	
		/***** Bot commands *****/
	
		if (m.content === opts.pref + "bot halt"){
			for (var k of modules) {
				stopModule(k)
			}
			adminChannel.send("Shutting down").then(() => {
				bot.destroy()
				process.exit(0)
			})
		}
		
		if (m.content === opts.pref + "bot time"){
			m.channel.send(getTime(null,false));
		}
		
		if (m.content === opts.pref + "bot sync"){
			
		}
	
		/***** bot help *****/
	
		if (m.content === opts.pref + "help"){
			let modhelp = new Discord.MessageEmbed().setColor(opts.color)
			.setTitle("Utilibot Module Manager v1.2β")
			.setDescription("Commands:")
			
			.addField(	opts.pref + "mod kill [mod / *]",								"Shutdown module ('*' for all modules)", true)
			.addField(	opts.pref + "mod boot [mod / *]",								"Startup module", true)
			.addField(	opts.pref + "mod reup [mod / *]",								"Restart module ('*' for all modules)", true)
			.addField(	opts.pref + "mod pull [mod]",									"Get module script", true)
			.addField(	opts.pref + "mod push [file(s)]",								"Update module files", true)	
			.addField(	opts.pref + "mod list",											"List modules", true);
			
			let bothelp = new Discord.MessageEmbed().setColor(opts.color)
			.setTitle("Utilibot v6")
			.setDescription("Commands:")
			.addField(	opts.pref + "bot halt",											"Shutdown bot", true)
			.addField(	opts.pref + "bot time",											"Time bot has been on (sec)", true)
			.addField(	opts.pref + "bot sync",											"Check for parallel instances and stop them", true);
			
			m.channel.send(modhelp).then(m.channel.send(bothelp));
		}

	}

})
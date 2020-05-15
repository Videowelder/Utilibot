"use strict";
const opts = require('./gauths');
const fs = require('fs');
const Discord = require("discord.js");
const exec = require('child_process').exec;
const bot = new Discord.Client();

let modules = JSON.parse(fs.readFileSync("modules.json"));

var modcount = 0;

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

bot.on("ready", async () => {
	for(var k in modules) {
		modcount += 1;
		console.log(k);
		if (!modules[k]["active"]) {
			await exec('screen -S \"' + k + '\" -d -m ./node ' + modules[k]["loc"], (error, stdout, stderr) => {
            			console.log(`${stdout}`);
            			console.log(`${stderr}`);
            			if (error !== null) {
                			console.log(`exec error: ${error}`);
            			}
        		});
			modules[k]["active"] = true;
		}
	}
	await fs.writeFileSync("modules.json",JSON.stringify(modules));
	console.log("ready");
})

bot.on("message", async (m) => {

	if (m.content.startsWith(opts.pref + "mod")){

	if (m.author.id == opts.ownerID){
	
	if (m.content.startsWith(opts.pref + "mod kill ")){
		var temp = m.content.split(" ")[2]
		if (temp in modules){
			if (modules[temp]["active"]) {
			await exec('screen -X -S \"' + temp + '\" quit', (error, stdout, stderr) => {
            			console.log(stdout);
            			console.log(stderr);
            			if (error !== null) {
                			console.log(error);
            			}
        		});
			modules[temp]["active"] = false;
			modcount -= 1;
			await fs.writeFileSync("modules.json",JSON.stringify(modules))
			await m.channel.send("``" + modules[temp]["name"] + "`` : module now off");
			}
		} else if (temp === "*") {
			for(var k in modules) {
				console.log(k);
				if (modules[k]["active"]) {
					await exec('screen -X -S \"' + k + '\" quit', (error, stdout, stderr) => {
            					console.log(stdout);
            					console.log(stderr);
            					if (error !== null) {
                					console.log(error);
            					}
        				});
					modules[k]["active"] = false;
					fs.writeFileSync("modules.json",JSON.stringify(modules))
					await m.channel.send("``" + modules[k]["name"] + "`` : module now off");
				}
			}
			await m.channel.send("Shutting down...");
			bot.destroy();
			process.exit(1);
		} else if (temp === "mhp") {
			await m.channel.send("``module_handler_process`` : module now off");
			bot.destroy();
			process.exit(1);
		}
	}

	if (m.content.startsWith(opts.pref + "mod start")){
		var temp = m.content.split(" ")[2]
		if (temp in modules){
			if (!modules[temp]["active"]) {
			const exec = require('child_process').exec;
			await exec('screen -S \"' + temp + '\" -d -m ./node ' + modules[temp]["loc"], (error, stdout, stderr) => {
            			console.log(stdout);
            			console.log(stderr);
            			if (error !== null) {
                			console.log(error);
            			}
        		});
			modules[temp]["active"] = true;
			modcount += 1;
			fs.writeFileSync("modules.json",JSON.stringify(modules))
			await m.channel.send("``" + modules[temp]["name"] + "`` : module now on");
			}
		}
	}

	if (m.content === opts.pref + "mod list"){
		let del = new Discord.MessageEmbed().setColor('#3377ff')
		for(var k in modules) {
            		del.addField("module name",modules[k]["name"], true)
			del.addField("module code",k, true)
			del.addField("module status",modules[k]["active"]?"active":"off", true)
		}
		del.addField("module name","module_handler_process", true)
		del.addField("module code","mhp", true)
		del.addField("module status","active", true)
		await m.channel.send(del);
	}

	} else {
		await m.channel.send("You do not have adequate permissions!");
	}

	}
})
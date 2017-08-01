console.log('Bot starting.')

const Discord = require("discord.js");
const fs = require('fs');

const client = new Discord.Client();

const secret = require("./secret.json");
// secret.token contains the bot's token

const config = require("./config.json");
// config.prefix contains the message prefix.

var modules = {}

var loadModules = function() {
    var files = fs.readdirSync(__dirname+'/bot_modules');
    console.log("Loading Modules")
    for (let file of files) {
        if (file.endsWith('.js')) {
            modules[file.slice(0, -3)] = require(__dirname+'/bot_modules/'+file);
            console.log("Loaded " + file);
        }
    }
    console.log("Finished Loading Modules")
}

client.on("ready", () => {  
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);   
  loadModules();
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", message => {

    // don't reply to bots
    if(message.author.bot)
        return;

    // check for command prefix
    if(message.content.indexOf(config.prefix) !== 0)
        return;

    // parse into command and arguments
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    Object.keys(modules).forEach( function(moduleName) {
        var module = modules[moduleName];
        if( module.onMessage ) {
            module.onMessage(client, message, command, args);
        }
    });
});

client.login(secret.token);
           
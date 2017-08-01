console.log('Bot starting.')

const Discord = require("discord.js");
const client = new Discord.Client();

const secret = require("./secret.json");
// secret.token contains the bot's token

const config = require("./config.json");
// config.prefix contains the message prefix.

client.on("ready", () => {  
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {

    // don't reply to ourselves
    if(message.author.bot)
        return;

    // check for command prefix
    if(message.content.indexOf(config.prefix) !== 0)
        return;

    // parse into command and arguments
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // edit our own message with a pong response
    if(command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    // get the bot to say something
    if(command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(x=>{}); 
        message.channel.send(sayMessage);
    }
});

client.login(secret.token);
           
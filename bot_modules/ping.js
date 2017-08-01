module.exports = {
     onMessage: async function(client, message, command, args) {
         if( command == "ping" ) {
            const m = await message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
         }
    }
};
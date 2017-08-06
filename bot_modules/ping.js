module.exports = {

    // return true if we handle channel
    channelFilter: function( channel ) {
        return true;
    },

    onCommand: async function(client, message, command, args) {
        if( command == "ping" ) {
            const m = await message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        }
    },

    getStatus: function() {
		return (`Ping says hi!`);
	}
};
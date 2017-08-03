const Roll = require('roll');
const regex_roll = /(\d*d\d+([\+\-\*\/]\d+)?)/gi
var roll = new Roll();

const allowed_channels = ["bot-sandbox"];

module.exports = {

    // return true if we handle channel
    channelFilter: function( channel ) {
        return allowed_channels.includes(channel.name);
    },

     onMessage: async function(client, message, command, args) {
         if( command == "roll" ) {
            var result = message.content.slice(command.length).replace(regex_roll, function(match) {
                return roll.roll( match ).result;
            });         
            message.delete().catch(x=>{}); 
            message.channel.send(`${message.author} rolled: ${result}`);
         }
    }
};
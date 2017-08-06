const Roll = require('roll');
const regex_roll = /([0-9]{0,3}d\d+([\+\-\*\/]\d+)?)/gi
var roll = new Roll();

const allowed_channels = ["bot-testing-mods-only", "pen_and_paper"];

module.exports = {

    // return true if we handle channel
    channelFilter: function( channel ) {
        return allowed_channels.includes(channel.name);
    },

     onCommand: async function(client, message, command, args) {
         if( command == "roll" ) {
            const origin = message.content.slice(command.length+2);
            var result = origin.replace(regex_roll, function(match) {
                return roll.roll( match ).result;
            });         
            message.delete().catch(x=>{}); 
            message.channel.send(`${message.author} rolled: ${result} (${origin})`);
         }
    }
};
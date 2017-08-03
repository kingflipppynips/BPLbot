module.exports = {

    // return true if we handle channel
    channelFilter: function( channel ) {
        return true;
    },

     onMessage: async function(client, message, command, args) {
         
        if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
            return;

        if( command == "say" ) {
            const sayMessage = args.join(" ");
            message.delete().catch(x=>{}); 
            message.channel.send(sayMessage);
        }

        if(command === "purge") {
            const deleteCount = parseInt(args[0], 10);

            if(!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

            const fetched = await message.channel.fetchMessages({count: deleteCount});
            message.channel.bulkDelete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        }
    }
};
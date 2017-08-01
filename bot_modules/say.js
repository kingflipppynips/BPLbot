module.exports = {
     onMessage: async function(client, message, command, args) {
         if( command == "say" ) {
            const sayMessage = args.join(" ");
            message.delete().catch(x=>{}); 
            message.channel.send(sayMessage);
         }
    }
};
const mutes = new Set();

module.exports = {

    // return true if we handle channel
    channelFilter: function( channel ) {
        return true;
    },

     onCommand: async function(client, message, command, args) {
         
        if(!message.member.roles.some(r=>["Moderator"].includes(r.name)) )
            return;

        if( command === "say" ) {
            const sayMessage = args.join(" ");
            message.delete().catch(x=>{}); 
            message.channel.send(sayMessage);
        }
        
        else if(command === "mute") {
            var showUsage = false;

            if( args.length == 2 && message.mentions.users.size == 1) {
                const user = message.guild.member(message.mentions.users.first());
                const timeout = parseInt( args[1] )

                if( user && timeout && !isNaN(timeout) ) {
                    message.delete().catch(x=>{});
                    const m = await message.channel.send(`${message.author} muted ${user} for ${timeout} seconds`);
                    user.setMute( true );

                    setTimeout(function() {
                        console.log(`Unmuting ${user}`);
                        user.setMute( false );

                        m.edit(`Mute on ${user} set by ${message.author} has expired.`);
                    }, timeout * 1000);
                        
                } else showUsage = true;
            } else showUsage = true;
            
            if(showUsage) {
                message.channel.send(`${message.author} Usage: mute \@user seconds`);        
            }
        }
    }
};

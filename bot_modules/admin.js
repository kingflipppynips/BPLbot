const mutes = new Map();

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

            if( args.length >= 2 && message.mentions.users.size == 1) {
                const user = message.guild.member(message.mentions.users.first());
                const timeout = parseInt( args[1] )
                const reason = args.splice(2, args.length - 2).join(' ');

                if( user && timeout && !isNaN(timeout) ) {
                    message.delete().catch(x=>{});
                    const m = await message.channel.send(`${message.author} muted ${user} for ${timeout} seconds. ${reason}`);
                    user.setMute( true );
                    mutes.set(user.id, m);

                    setTimeout(function() {
                        if(mutes.has(user.id)) {
                            if(mutes.get(user.id) == m) {
                                user.setMute( false );
                                mutes.delete(user.id);
                            }
                            m.edit(`${timeout} second mute on ${user} set by ${message.author} has expired. ${reason}`);
                        }
                    }, timeout * 1000);
                        
                } else showUsage = true;
            } else showUsage = true;
            
            if(showUsage) {
                message.channel.send(`${message.author} Usage: mute \@user seconds [reason]`);        
            }
        }

        else if(command === "unmute") {
            var showUsage = false;

            if( args.length == 1 && message.mentions.users.size == 1) {
                const user = message.guild.member(message.mentions.users.first());

                if( user && mutes.has(user.id) ) {
                    message.delete().catch(x=>{});
                    mutes.get(user.id).edit(`${message.author} unmuted ${user}`);
                    user.setMute( false );
                    mutes.delete(user.id);
                        
                } else showUsage = true;
            } else showUsage = true;
            
            if(showUsage) {
                message.channel.send(`${message.author} Usage: unmute \@user`);        
            }
        }
    },

    voiceStateUpdate: function(client, oldMember, newMember) {
        if( newMember.serverMute && !mutes.has(newMember.id) ) {
            newMember.setMute( false );
        } else if(!newMember.serverMute && mutes.has(newMember.id)) {
            newMember.setMute( true );
        }
    }
};

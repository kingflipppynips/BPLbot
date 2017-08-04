const enabled_channels = new Set();

const prob = function( percent ) {
    return (Math.random() < percent / 100.0 );
}

const rand = function( min, max ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const butt = function( emagged ) {
    var vocab = [];
    if(!emagged)
        vocab = ["butts", "butt"];
    else 
        vocab = ["BuTTS", "buTt", "b##t", "bztBUTT", "b^%t", "BUTT", "buott", "bats", "bates", "bouuts", "buttH", "b&/t", "beats", "boats", "booots", "BAAAAATS&/", "//t/%/"];

    return vocab[rand(1, vocab.length) - 1];
}

var probability = 100;
var emag = false;

module.exports = {

    // return true if we handle channel
    channelFilter: function( channel ) {
        return true;
    },

    onCommand: async function(client, message, command, args) {

        if(!message.member.roles.some(r=>["Moderator"].includes(r.name)) )
            return;

        const channel = message.channel;

        if( command == "butt" ) {

            if( args.length > 0 ) {
                var percent = parseInt( args[0] );
                if( !isNaN(percent) ) {
                    probability = percent;
                    message.delete().catch(x=>{});
                    message.channel.send(`${message.author} set buttage to ${probability}%`);
                } else if (args[0] = "emag") {
                    emag = !emag;
                    message.delete().catch(x=>{});
                    message.channel.send(`${message.author} is a butt butt`);
                }
            } else {
                message.delete().catch(x=>{}); 
                if( !enabled_channels.has(channel.name) ) {
                    enabled_channels.add(channel.name);
                    message.channel.send(`${message.author} enabled buttbot`);
                } else {
                    enabled_channels.delete(channel.name);
                    message.channel.send(`${message.author} disabled buttbot`);
                }
            }
        }
    },

    onMessage: async function(client, message) {

        const channel = message.channel;
        const content = message.content;

        if( enabled_channels.has(channel.name) && prob(probability) ) {

            var words = content.split(/ +/g);
            if( !words || words.length <= 0 )
                return;

            var num_butts = rand(1,4)
            var counter = 0

            while(num_butts > 0) {
                counter++
                num_butts--
                words[rand(1,words.length) - 1] = butt(emag)
                if(counter >= (words.length / 2) )
                    num_butts = 0  
            }                
            
            message.channel.send(words.join(' '));
        }
    }    
};
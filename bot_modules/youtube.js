const RssFeedEmitter = require('rss-feed-emitter');

const feeder = new RssFeedEmitter();

const subscriptions = new Set();

const channels = new Map();

const startup = new Set();

function addSub( sub ) {
  if( subscriptions.has( sub ) )
    return;

  console.log(`${sub.channel} subscribing to ${sub.youtube}`);

  var new_channel = true;
  for (let item of subscriptions) {
    if( item.youtube == sub.youtube ) {
      new_channel = false;
      break;
    }
  }

  subscriptions.add( sub );

  if( new_channel ) {
    startup.add(sub.youtube);

    console.log(`Adding feed for ${sub.youtube}`);
    feeder.add({
      url: `https://www.youtube.com/feeds/videos.xml?channel_id=${ sub.youtube }`
    });

    setTimeout(function() {
      console.log(`Unmuting ${sub.youtube}`);
      startup.delete(sub.youtube);
    }, 15000);
  }
}

function removeSub( sub ) {
  if( !subscriptions.has( sub ) )
    return;

  console.log(`${sub.channel} unsubscribing from ${sub.youtube}`);

  subscriptions.delete(sub);

  var last_channel = true;
  for (let item of subscriptions) {
    if( item.youtube == sub.youtube ) {
      last_channel = false;
      break;
    }
  }

  if( last_channel ) {
    console.log(`Unsubscribing from ${sub.youtube}`);
    feeder.remove({
      url: `https://www.youtube.com/feeds/videos.xml?channel_id=${ sub.youtube }`
    });
  }  
}

feeder.on('new-item', function(item) { //emits whenever theres a new item.
  const channel_id = item['yt:channelid']['#'];
  for (let sub of subscriptions) {
    if( startup.has(sub.youtube) )
      continue;

    if( sub.youtube == channel_id && channels.has(sub.channel) ) {
      channels.get(sub.channel).send(`:video_camera: | **${item.author}** uploaded **${item.title}**!\nVist: ${item.link}`).catch( x => console.error(x) );
    }
  }
});

module.exports = {

  // return true if we handle channel
  channelFilter: function( channel ) {
    return true;
  },

  onCommand: async function(client, message, command, args) {

    if(!message.member.roles.some(r=>["Moderator"].includes(r.name)) )
      return;

    const channel = message.channel;
    const channel_name = channel.name;

    channels.set(channel_name, channel);

    if( command == "youtube_watch" ) {
      message.delete().catch(x=>{});
      if( args.length == 1 ) {
        const channel_id = args[0];
        const sub = { channel: `${channel_name}`, youtube: `${channel_id}` };
        if( subscriptions.has( sub ) ) {
          removeSub( sub );
          message.channel.send(`${message.author} removed https://www.youtube.com/channel/${channel_id} notifications`);     
        } else {
          addSub( sub );
          message.channel.send(`${message.author} added https://www.youtube.com/channel/${channel_id} notifications`);     
        }
      } else {
        message.channel.send(`${message.author} Usage: youtube_watch <channel_id>`);        
      }
    }        
  }  
};
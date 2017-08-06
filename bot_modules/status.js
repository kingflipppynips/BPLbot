var statusModules = {};

module.exports = {

	setStatusModules: function(modules) {
		statusModules = modules;
	},

	// return true if we handle channel
	channelFilter: function(channel) {
		return true;
	},

	onCommand: async function(client, message, command, args) {

		if (!message.member.roles.some(r => ["Moderator"].includes(r.name)))
			return;

		if (command === "status") {
			var statusFields = [];
			Object.keys(statusModules).forEach(function(moduleName) {
				var module = statusModules[moduleName];
				if (module.getStatus) {
					statusFields.push({ name: "Module: " + moduleName, value: module.getStatus() });
				}
			});

			//console.log(statusFields);
			message.channel.send({
				embed: {
					color: 14365793,
					author: {
						name: "Bot Status",
						icon_url: client.user.avatarURL
          },
					description: "Here's the sitrep broken down",
					fields: statusFields
				}
			});
		}
	}
}
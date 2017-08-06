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
			var statusMsg = "";
			Object.values(statusModules).forEach(function(module) {
				if (module.getStatus) {
					statusMsg += module.getStatus() + "\n";
				}
			});
			message.channel.send(statusMsg);
		}
	}
}
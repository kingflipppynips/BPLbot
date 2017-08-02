const config = require("../config.json");

module.exports = {
	onMessage: async function(client, message, command, args) {
		// get the role object fron the name in the config
		let memberRole = message.guild.roles.find("name", config.memberRole);
		// make sure they are not already a "member"
		if (command == "agree" && !message.member.roles.has(memberRole.id)) {
			message.delete().catch(err => { console.log(err) });
			// grant them access to the rest of the guild
			message.member.addRole(memberRole).catch(console.error);
		}
	}
};
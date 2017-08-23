const sqlite3 = require('sqlite3').verbose();
const sqldb = new sqlite3.Database('rank.db');
// WARNING!! THE DB DOES NOT DISTINGUISH GUILDS
// setup table to track exp, last active, and bans (commands to add bans coming later)
sqldb.run("CREATE TABLE IF NOT EXISTS rank_master (userid TEXT, exp INTEGER DEFAULT 0, rank_ban BOOLEAN DEFAULT 0, last_timestamp TEXT);");

const cooldown = 30; // minimum seconds between exp gain
const expMin = 20;
const expMax = 30;

// clone of mee6 input current level to get total exp needed to reach next one
const neededExp = function (lvl) {
    return 5 * (lvl * lvl) + 50 * lvl + 100;
}

// input total exp to get current level and exp gained toward the next
const getCurrentLevel = function (exp) {
    var total_exp = parseInt(exp);
    var level = 0;
    while (total_exp >= neededExp(level)) {
        total_exp -= neededExp(level);
        level++;
    }
    return [level, total_exp];
}

const cooldown_users = new Set();

module.exports = {

    // return true if we handle channel
    channelFilter: function (channel) {
        return true;
    },

    onCommand: async function (client, message, command, args) {
        if (command == "rank") {
            sqldb.get("SELECT exp,(SELECT COUNT(*) FROM rank_master WHERE exp >= rm.exp) as exp_above,(SELECT COUNT(*) FROM rank_master) as total FROM rank_master AS rm WHERE userid = ?", message.author.id, function (err, row) {
                if (typeof row == 'undefined') {
                    message.delete().catch(x => { });
                    message.channel.send(`${message.author} is unranked. Participate in chat to gain levels.`);
                }
                else {
                    var myLevel = getCurrentLevel(row.exp);
                    var nextLevel = neededExp(myLevel[0]);
                    var myPercent = Math.floor((myLevel[1] / nextLevel) * 1000) / 10;

                    message.delete().catch(x => { });
                    message.channel.send(`${message.author} Ranked **${row.exp_above}/${row.total}** at Level ${myLevel[0]}
                    ${myPercent}% of the way to the next with ${myLevel[1]}/${nextLevel}exp (total:${row.exp})`);
                }
            });
        }
    },

    onMessage: async function (client, message) {
        var newExp = Math.round(Math.random() * (expMax - expMin) + expMin);

        if (message.content.length > 1 && !cooldown_users.has(message.author.id)) {
            sqldb.get("SELECT * FROM rank_master WHERE userid = ?", message.author.id, function (err, row) {
                var isBanned = false;
                var hasRank = true;
                if (typeof row == 'undefined') {
                    hasRank = false;
                }
                else if (row.rank_ban == 1) {
                    isBanned = true;
                }

                if (!isBanned && hasRank) {
                    sqldb.run("UPDATE rank_master SET exp = exp + ?, last_timestamp = ? WHERE userid = ?", [newExp, new Date().toISOString(), message.author.id]);
                }
                else if (!isBanned) {
                    sqldb.run("INSERT INTO rank_master (exp,last_timestamp,userid) VALUES (?,?,?)", [newExp, new Date().toISOString(), message.author.id]);
                }
            });

            cooldown_users.add(message.author.id);

            setTimeout(function () {
                cooldown_users.delete(message.author.id);
            }, cooldown * 1000);
        }
    }
};


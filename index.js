var discord = require('discord.js');
var roblox = require('roblox-js');
var client = new discord.Client();
client.login(process.env.BOT_TOKEN)

roblox.login({username: "DaegranBot", password: "bobbyjoe"}).then((success) => {

}).catch(() => {console.log("Sorry, it failed.");});


client.on("ready", () => {
  client.user.setGame(`The Daegran Imperium |${client.users.size} users `);
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

client.on('guildMemberAdd', member => {
  let guild = member.guild;
  let user = member.user
  console.log(`${user.tag} joined ${guild}`)
});

client.on('guildMemberRemove', member => {
  let guild = member.guild;
  let user = member.user
  console.log(`${user.tag} left ${guild}`)
});

var prefix = '-';
var groupId = 4462651;
var maximumRank = 80;

function isCommand(command, message){
	var command = command.toLowerCase();
	var content = message.content.toLowerCase();
	return content.startsWith(prefix + command);
}

client.on('message', (message) => {
	if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
    
    if(isCommand('Promote', message)){
    	var username = args[1]
    	if (username){
    		message.channel.send(`Checking ROBLOX for ${username}`)
    		roblox.getIdFromUsername(username)
			.then(function(id){
				roblox.getRankInGroup(groupId, id)
				.then(function(rank){
					if(maximumRank <= rank){
						message.channel.send(`${id} is rank ${rank} and cannot be promotable.`)
					} else {
						message.channel.send(`${id} is rank ${rank} and can be promotable.`)
						roblox.promote(groupId, id)
						.then(function(roles){
							message.channel.send(`Promoted from ${roles.oldRole.Name} to ${roles.newRole.Name}`)
						}).catch(function(err){
							message.channel.send("Failed to promote.")
						});
					}
				}).catch(function(err){
					message.channel.send("The player cannot be found in the group.")
				});
			}).catch(function(err){ 
				message.channel.send(`Sorry, but ${username} cannot be found on ROBLOX.`)
			});
    	} else {
    		message.channel.send("Please enter a username.")
    	}
    	return;
    }
});

var discord = require('discord.js');
var roblox = require('roblox-js');
var client = new discord.Client();
client.login(process.env.BOT_TOKEN)

roblox.login({username: "DaegranBot", password: "bobbyjoe"}).then((success) => {

}).catch(() => {console.log("Cannot log into the client's account!");});


client.on("ready", () => {
  client.user.setGame(`.The Daegran Imperium.`);
	  client.user.setStatus('idle')
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
	if (message.author.client) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)

    function hasRole(members, role){
    if(pluck(members.roles).includes("Administrator")){
        return true;
    } else {
        return false;
    }
}

    if(isCommand('Promote', message)){
      if(!message.member.roles.some(r=>["High Command", "Administrator"].includes(r.name)) ) // OPTIONAL - Checks if the sender has the specified roles to carry on further
      return message.channel.send("Sorry, but you are not able to use this command.");
    	var username = args[1]
    	if (username){
    		message.channel.send(`Checking ROBLOX for the Player **${username}**`)
    		roblox.getIdFromUsername(username)
			.then(function(id){
				roblox.getRankInGroup(groupId, id)
				.then(function(rank){
					if(maximumRank <= rank){
						message.channel.send(`${id} is rank ${rank} and not promotable.`)
					} else {
						message.channel.send(`${id} is rank ${rank} and promotable.`)
						roblox.promote(groupId, id)
						.then(function(roles){
							message.channel.send(`Promoted from ${roles.oldRole.Name} to ${roles.newRole.Name}`)
              message.channel.client.send(`Promoted from ${roles.oldRole.Name} to ${roles.newRole.Name}`)
						}).catch(function(err){
							message.channel.send("Sorry but the client failed to promote.")
						});
					}
				}).catch(function(err){
					message.channel.send("This player does not exist in the group.")
				});
			}).catch(function(err){
				message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
			});
    	} else {
    		message.channel.send("Please enter a valid username of the player you'd like to promote - demote")
    	}
    	return;
    }
});

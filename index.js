const { Client, RichEmbed } = require("discord.js");
const { prefix, token } = require("./data/config.json");
const mongoose = require("mongoose");
const client = new Client({disableEveryone: true});

//mongoose.connect("mongodb+srv://<user>:<password>@unidentified-7y9m6.mongodb.net/Countdown?retryWrites=true&w=majority", {
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Counters = require("./models/Counter.js");

client.on("ready", () => {
  client.user.setActivity(`.timeleft of ${client.users.size} users`, { type: "WATCHING" });
  client.user.setStatus("dnd");
  console.log("Counting down...");
});

client.on("message", async message => {
  
  if(message.author.bot) return;
  if(message.content != `${prefix}countdown` || message.content != `${prefix}time`  || message.content != `${prefix}timeleft` || message.content != `${prefix}tl` || message.content != `${prefix}cd` && message.channel.id === "678038687430213652") {
	if(!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return console.log("Insufficient permisions.")
        message.delete();
  }
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "countdown" || command === "time" || command === "timeleft" || command === "tl" || command === "cd" ) {
	let addtime = Math.floor(Math.random() * 2175984000*1000) + 31536000*1000;
	let countdowntime = Date.now() + addtime;
	var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
	var _month = _day * 30;
	var _year = _month * 12;
	var now = Date.now();
	
	const countdownEmbed = new RichEmbed()
		.setAuthor(message.author.username + " countdown", client.user.avatarURL)
		.setDescription("Death? There's a app for that!")
		.setColor("#000000")
		.setThumbnail(message.author.avatarURL)
		.setTimestamp()
		.setFooter(`${client.user.username} v0.0.3`, client.user.avatarURL);
	
	Counters.findOne({
		userID: message.author.id
	}, (err, res) => {
		if(err) console.log(err);
		
		if(!res) {
			const newDoc = new Counters({
				userID: message.author.id,
				username: message.author.username,
				time: countdowntime
			})
			newDoc.save().catch(err => console.log(err));
			
			let distance = countdowntime - now;
			let y = Math.floor(distance / _year);
			let m = Math.floor((distance % _year) / _month);
			let day = Math.floor((distance % _month) / _day);
			let hour = Math.floor((distance % _day) / _hour);
			let min = Math.floor((distance % _hour) / _minute);
			let sec = Math.floor((distance % _minute) / _second);
			countdownEmbed.addField(`\u200b`, `**${y}** Years **${m}** Months **${day}** Days \n**${hour}** Hours **${min}** Minutes **${sec}** Seconds`, true)
			message.channel.send(countdownEmbed);
        } else {
			let distance = res.time - now;
			let y = Math.floor(distance / _year);
			let m = Math.floor((distance % _year) / _month);
			let day = Math.floor((distance % _month) / _day);
			let hour = Math.floor((distance % _day) / _hour);
			let min = Math.floor((distance % _hour) / _minute);
			let sec = Math.floor((distance % _minute) / _second);
			countdownEmbed.addField(`\u200b`, `**${y}** Years **${m}** Months **${day}** Days \n**${hour}** Hours **${min}** Minutes **${sec}** Seconds`, true)
			message.channel.send(countdownEmbed);
        }
      })
  }
  
  
  if(command === "botinfo" || command === "info"){
    const botInfo = new RichEmbed()
	.setAuthor(client.user.username + "info", client.user.avatarURL)
	.setColor("#000000")
	.setThumbnail(client.user.displayAvatarURL)
	.addField("👑 Developer", `HaZZe#0001`, true)
	.addField("💎 Support Server", `Soon...`, true)
	.addField("📤 Invite", `Soon...`, true)
	.addField('👤 Total Users', `${client.users.size}`, true)
	.addField('📁 Total Channels:', `${client.channels.size}`, true)
	.addField('🛡 Total Servers', Math.ceil(client.guilds.size), true)
	.addField('\u200b', `Built with discord.js`)
	.setTimestamp()
	.setFooter(`${client.user.username} v0.0.3`, client.user.avatarURL);
    message.channel.send(botInfo);
  }
  if(command === "help" || command === "cmd" || command === "cmds") {
    const botHelp = new RichEmbed()
	.setAuthor(client.user.username + " commands", client.user.avatarURL)
	.setColor("#000000")
	.setThumbnail(client.user.displayAvatarURL)
        .addField(`**${prefix}countdown**`, `**Description:** Death? There's an app for that.\n**Alias:** ${prefix}time, ${prefix}timeleft, ${prefix}tl, ${prefix}cd`)
        .addField(`**${prefix}botinfo**`, `**Description:** Show bot informations.\n**Alias:** ${prefix}info`)
        .addField(`**${prefix}ping**`, `**Description:** Show bot ping.\n**Alias:** None`)
	.setTimestamp()
	.setFooter(`Bot prefix is ${prefix}`, client.user.avatarURL);
	if(message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
		botHelp.addField(`**${prefix}say**`, `**Description:** Say something through the bot.\n**Usage:** ${prefix}say #channel \n**Alias:** ${prefix}ann`)
		botHelp.addField(`**${prefix}purge**`, `**Description:** Delete some messages from channels.\n**Usage:** ${prefix}purge number_of_messages \n**Alias:** ${prefix}clear`)
	}
    message.channel.send(botHelp);
  }
  if(command === "ping") {
    message.channel.send("Pinging...").then(m => {
        let ping = m.createdTimestamp - message.createdTimestamp
        let choices = ["Is this really my ping", "Is it okay? I cant look", "I hope it isnt bad"]
        let response = choices[Math.floor(Math.random() * choices.length)]

        m.edit(`${response}: Bot Latency: \`${ping}\`, API Latency: \`${Math.round(bot.ping)}\``)
    })
  }
  if(command === "say" || command === "ann") {
    if(!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return message.channel.send("Insufficient permisions.")
    let argsresult;
    let mChannel = message.mentions.channels.first()

    message.delete()
    if(mChannel) {
        argsresult = args.slice(1).join(" ")
        mChannel.send(argsresult)
    } else {
        argsresult = args.join(" ")
        message.channel.send(argsresult)
    }
  }
  if(command === "purge" || command === "clear") {
    if(!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return message.channel.send("Insufficient permisions.")
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
	  
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

//client.login(token);
client.login(process.env.BOT_TOKEN)

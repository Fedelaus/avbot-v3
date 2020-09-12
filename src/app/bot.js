const services = require('../config/services');

const Discord = require('discord.js');


const client = new Discord.Client();

const prefix = '!';


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'stats') {
		return client.shard.fetchClientValues('guilds.cache.size').then(results => {
			return message.channel.send(`Server count: ${results.reduce((acc, guildCount) => acc + guildCount, 0)}`);
		}).catch(console.error);
	}
});

client.login(services.discord.token);
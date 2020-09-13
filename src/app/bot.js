const services = require('../config/services');

const path = require('path');
const {
	CommandoClient,
} = require('discord.js-commando');

const client = new CommandoClient({
	commandPrefix: '!',
	owner: services.discord.owners,
	invite: services.discord.supportServerInvite,
	nonCommandEditable: true,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['util', 'Utility commands'],
		['weather', 'Weather commands'],
		['ivao', 'IVAO commands'],
		['vatsim', 'Vatsim commands'],
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);

client.login(services.discord.token);
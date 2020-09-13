const {
	Command,
} = require('discord.js-commando');

module.exports = class MetarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'metar',
			group: 'weather',
			memberName: 'metar',
			aliases: [],
			description: 'Gives you live METAR of the chosen airport.',
			examples: ['metar <icao>'],
			args: [{
				key: 'icao',
				prompt: 'What ICAO would you like the bot to give METAR for?',
				type: 'string',
			}],
		});
	}

	async run(msg) {
		return this.client.shard.fetchClientValues('guilds.cache.size').then(results => {
			return msg.say(`Server count: ${results.reduce((acc, guildCount) => acc + guildCount, 0)}`);
		}).catch(console.error);
	}
};
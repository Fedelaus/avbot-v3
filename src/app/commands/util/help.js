const Discord = require('discord.js');
const {
} = require('common-tags');
const {
	Command,
} = require('discord.js-commando');


module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands', 'commands'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			examples: ['help', 'help <command>'],
			args: [{
				key: 'command',
				prompt: 'Which command would you like to view the help for?',
				type: 'string',
				default: '',
			}],
		});
	}

	async run(msg, args) {

		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		console.log(commands.length);

		if (args.command && !showAll) {
			if (commands.length === 1 && !commands[0].ownerOnly) {
				const fields = [];

				fields.push({
					name: 'Command',
					value: commands[0].name,
				});

				if (commands[0].aliases.length > 0) {
					fields.push({
						name: 'Aliases',
						value: commands[0].aliases.join(', '),
					});
				}

				fields.push({
					name: 'Description',
					value: commands[0].description,
				});

				if (commands[0].examples.length > 0) {
					fields.push({
						name: 'Examples',
						value: commands[0].examples.join('\n'),
					});
				}

				console.log(fields);

				const helpEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle('AvBot to the rescue!')
					.setURL('https://avbot.in')
					.setThumbnail('https://charts.avbot.in/assets/avbot.png')
					.setTimestamp()
					.addFields(fields);
				return msg.embed(helpEmbed);
			}
			else if (commands.length > 1) {
				return msg.reply('Multiple commands found. Please be more specific.');
			}
			else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined,
					)} to view the list of all commands.`,
				);
			}
		}
		else {
			const fields = [];

			commands.forEach(command => {
				if (!command.ownerOnly) {
					fields.push({
						name: command.name,
						value: command.description,
					});
				}
			});

			const helpEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('AvBot to the rescue!')
				.setURL('https://avbot.in')
				.setThumbnail('https://charts.avbot.in/assets/avbot.png')
				.setTimestamp()
				.addFields(fields);

			return msg.embed(helpEmbed);
		}

	}
};
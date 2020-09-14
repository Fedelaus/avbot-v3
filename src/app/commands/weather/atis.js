const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const Avwx = require('../../utils/Avwx');

module.exports = class AtisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'atis',
      group: 'weather',
      memberName: 'atis',
      aliases: [],
      description: 'Gives you live ATIS of the chosen airport.',
      examples: ['atis <icao>'],
      args: [
        {
          key: 'icao',
          prompt: 'What ICAO would you like the bot to give ATIS for?',
          type: 'string',
        },
      ],
    });
  }

  static async run(msg, { icao }) {
    const atisEmbed = new Discord.MessageEmbed()
      .setTitle(`ATIS for ${icao.toUpperCase()}`)
      .setTimestamp();

    try {
      const { speech } = await Avwx.getMetar(icao);

      atisEmbed.setColor('#0099ff').setDescription(speech);
    } catch (error) {
      atisEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
    }

    return msg.embed(atisEmbed);
  }
};

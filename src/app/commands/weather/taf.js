const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const Avwx = require('../../utils/Avwx');

module.exports = class TafCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'taf',
      group: 'weather',
      memberName: 'taf',
      aliases: [],
      description: 'Gives you live TAF of the chosen airport.',
      examples: ['taf <icao>'],
      args: [
        {
          key: 'icao',
          prompt: 'What ICAO would you like the bot to give TAF for?',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, { icao }) {
    const tafEmbed = new Discord.MessageEmbed()
      .setTitle(`TAF for ${icao.toUpperCase()}`)
      .setTimestamp();

    try {
      const { raw, readable } = await Avwx.getTaf(icao);

      tafEmbed.setColor('#0099ff').addFields(
        {
          name: 'Raw Report',
          value: raw,
        },
        {
          name: 'Readable Report',
          value: readable,
        }
      );
    } catch (error) {
      tafEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
    }

    return msg.embed(tafEmbed);
  }
};

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

  async run(msg, { icao }) {
    const atisEmbed = new Discord.MessageEmbed()
      .setTitle(`ATIS for ${icao.toUpperCase()}`)
      .setColor('#0099ff')
      .setFooter(this.client.user.username)
      .setTimestamp();

    try {
      const { speech } = await Avwx.getMetar(icao);

      atisEmbed.setDescription(speech);
    } catch (error) {
      atisEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
    }

    return msg.embed(atisEmbed);
  }
};

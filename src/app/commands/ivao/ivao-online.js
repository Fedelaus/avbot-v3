const Discord = require('discord.js');
var accents = require('remove-accents');
const {
  Command
} = require('discord.js-commando');
const Ivao = require('../../utils/Ivao');

module.exports = class IvaoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ivao-online',
      group: 'ivao',
      memberName: 'ivao-online',
      aliases: [],
      description: 'Gives you live list of ATCS online matching the partial ICAO code on the IVAO network.',
      examples: ['ivao-online <partial_icao_code>'],
      args: [{
        key: 'partialCallSign',
        prompt: 'What partial ICAO would you like the bot to give info for?',
        type: 'string',
      }, ],
    });
  }

  async run(msg, {
    partialCallSign
  }) {
    const ivaoEmbed = new Discord.MessageEmbed()
      .setTitle(`${partialCallSign.toUpperCase()}`)
      .setColor('#0099ff')
      .setFooter(`${this.client.user.username} • Source: IVAO API`)
      .setTimestamp();

    try {
      const {
        atcList
      } = await Ivao.getPartialAtcClientInfo(partialCallSign);

      ivaoEmbed
        .setTitle(`IVAO : ${partialCallSign}`)

      atcList.forEach((atc) => {
        ivaoEmbed.addField(
          `${atc.callSign}`,
          `VID: ${atc.vid}, Frequency: ${atc.frequency}`
        );
      });

    } catch (error) {
      ivaoEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
    }

    return msg.embed(ivaoEmbed);
  }
};
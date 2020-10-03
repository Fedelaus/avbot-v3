const Discord = require('discord.js');
const {Command} = require('discord.js-commando');
const Avwx = require('../../utils/Avwx');

module.exports = class MetarCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'metar',
      group : 'weather',
      memberName : 'metar',
      aliases : [],
      description : 'Gives you live METAR of the chosen airport.',
      examples : [ 'metar <icao>' ],
      args : [
        {
          key : 'icao',
          prompt : 'What ICAO would you like the bot to give METAR for?',
          type : 'string',
        },
      ],
    });
  }

  async run(msg, {icao}) {
    const metarEmbed = new Discord.MessageEmbed()
                           .setTitle(`METAR for ${icao.toUpperCase()}`)
                           .setTimestamp();

    try {
      const {raw, readable} = await Avwx.getMetar(icao);

      metarEmbed.setColor('#0099ff').addFields({
        name : 'Raw Report',
        value : raw,
      },
                                               {
                                                 name : 'Readable Report',
                                                 value : readable,
                                               });
    } catch (error) {
      metarEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
    }

    return msg.embed(metarEmbed);
  }
};

const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const dayjs = require('dayjs');
const Avwx = require('../../utils/Avwx');

module.exports = class ZuluCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'zulu',
      group: 'misc',
      memberName: 'zulu',
      description: 'Gives you the current Zulu time.',
      args: [
        {
          key: 'icao',
          type: 'string',
          prompt: 'Enter ICAO code',
          default: '',
          parse: (val, msg, arg) => val.toUpperCase(),
        },
        {
          key: 'localtime',
          type: 'string',
          prompt: 'Enter Local time',
          default: '',
          validate: (val, msg, arg) => {
            if (!val) return true;
            if (val.length !== 4) return 'Local time must be in HHMM format';
            const [HH, MM] = [val.substr(0, 2), val.substr(2)];
            if (23 < HH || HH < 0) return 'Invalid HH';
            if (59 < MM || MM < 0) return 'Invalid MM';
            return true;
          },
        },
      ],
    });
  }

  async run(message, { icao, localtime }) {
    if (!(icao || localtime)) {
      const timestring = dayjs.utc().format('DD/MM HH:mm');
      const zuluEmbed = new MessageEmbed()
        .setTitle('ZULU Time')
        .setColor('#1a8fe3')
        .setDescription(`${timestring} Z`);

      return message.embed(zuluEmbed);
    }

    if (icao && localtime) {
      const stationInfo = await Avwx.getStationInfo(icao);
      if (stationInfo instanceof Error) {
        // Return Error Embed
      } else {
        // Get time from latlong
      }
    }
  }
};

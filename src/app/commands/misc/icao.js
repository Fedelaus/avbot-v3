const Discord = require('discord.js');
var accents = require('remove-accents');
const {
  Command
} = require('discord.js-commando');
const Avwx = require('../../utils/Avwx');

module.exports = class IcaoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'icao',
      group: 'misc',
      memberName: 'icao',
      aliases: [],
      description: 'Gives you live ICAO of the chosen airport.',
      examples: ['icao <icao>'],
      args: [{
        key: 'icao',
        prompt: 'What ICAO would you like the bot to give ICAO for?',
        type: 'string',
      }, ],
    });
  }

  async run(msg, {
    icao
  }) {
    const stationEmbed = new Discord.MessageEmbed()
      .setTitle(`Station for ${icao.toUpperCase()}`)
      .setTimestamp();

    try {
      const {
        station
      } = await Avwx.getStation(icao);

      stationEmbed.setColor('#0099ff').addFields({
        name: 'ICAO',
        value: station.icao || 'Unknown',
        inline: true,
      }, {
        name: 'IATA',
        value: station.iata || 'Unknown',
        inline: true,
      }, {
        name: 'Name',
        value: accents.remove(station.name) || 'Unknown',
        inline: true,
      }, {
        name: 'City',
        value: accents.remove(station.city) || 'Unknown',
        inline: true,
      }, {
        name: 'Country',
        value: accents.remove(station.country) || 'Unknown',
        inline: true,
      }, {
        name: 'Type',
        value: station.type.split('_')[0] || 'Unknown',
        inline: true,
      }, {
        name: 'Latitude',
        value: station.latitude || 'Unknown',
        inline: true,
      }, {
        name: 'Longitude',
        value: station.longitude || 'Unknown',
        inline: true,
      }, {
        name: 'Elevation',
        value: `${station.elevation_ft} ft` || 'Unknown',
        inline: true,
      }, {
        name: 'Runways',
        value: (() => {
          let r = station.runways;
          let runways = '';
          r.forEach((rw) => {
            if (rw.length_ft != 0 && rw.width_ft != 0) {
              runways += `${rw.ident1}-${rw.ident2} : Length - ${rw.length_ft} ft, Width - ${rw.width_ft} ft\n`;
            } else {
              runways += `${rw.ident1}-${rw.ident2} : Length - NA, Width - NA\n`;
            }
          });
          return runways;
        })() || 'Unknown',
        inline: true,
      }, {
        name: 'More Info',
        value: (() => {
          let links = '';
          if (station.website) {
            links += `Official Website: ${station.website}`;
            if (station.wiki) {
              links += `\nWikipedia: ${station.wiki}`;
            }
          } else if (station.wiki) {
            links += `\nWikipedia: ${station.wiki}`;
          }
          return links;
        })() || 'Unknown',
      });

    } catch (error) {
      console.log(error);
      stationEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
    }

    return msg.embed(stationEmbed);
  }
};
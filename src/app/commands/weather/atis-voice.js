const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const gTTS = require('gtts');
const Avwx = require('../../utils/Avwx');

module.exports = class AtisVoiceCommand extends Command {
  voiceChannels = {};

  constructor(client) {
    super(client, {
      name: 'atis-voice',
      group: 'weather',
      memberName: 'atis-voice',
      aliases: [],
      description:
        'Gives you live ATIS of the chosen airport in voice channel.',
      examples: ['atis-voice <icao>', 'atis-voice -stop'],
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
    if (!msg.guild) return;

    if (msg.member.voice.channel) {
      if (icao === '-stop') {
        if (this.voiceChannels[msg.member.voice.channel.id]) {
          const { connection } = this.voiceChannels[
            msg.member.voice.channel.id
          ];
          connection.disconnect();
          return msg.reply('AvBot left the voice channel');
        }
        return msg.reply('AvBot already left the voice channel');
      }

      const atisEmbed = new Discord.MessageEmbed()
        .setTitle(`ATIS for ${icao.toUpperCase()}`)
        .setColor('#0099ff')
        .setFooter(this.client.user.username)
        .setTimestamp();

      try {
        const { speech } = await Avwx.getMetar(icao);

        atisEmbed.setDescription(speech);

        const gtts = new gTTS(speech, 'en-uk');
        gtts.save(`tmp/${msg.member.voice.channel.id}_${icao}.mp3`);

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const play = (connection) => {
          const dispatcher = connection.play(
            `tmp/${msg.member.voice.channel.id}_${icao}.mp3`
          );
          dispatcher.on('finish', async () => {
            await sleep(1000);
            play(connection);
          });
        };

        if (
          this.client.voice.connections
            .filter((conn) => conn.channel.id === msg.member.voice.channel.id)
            .array().length > 0
        ) {
          const { connection } = this.voiceChannels[
            msg.member.voice.channel.id
          ];
          connection.disconnect();
          await sleep(3000);
        }

        const connection = await msg.member.voice.channel.join();

        play(connection);

        this.voiceChannels[msg.member.voice.channel.id] = {
          channel: msg.member.voice.channel,
          connection,
        };
      } catch (error) {
        atisEmbed.setColor('#ff0000').setDescription(`${msg.author}, ${error}`);
      }

      return msg.embed(atisEmbed);
    }
    return msg.reply('You need to join a voice channel first!');
  }
};

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const axios = require('axios').default;

const services = require('../../config/services');

dayjs.extend(utc);

module.exports = class Avwx {
  static api = axios.create({
    baseURL: 'https://avwx.rest/api/',
    timeout: 10000,
    headers: {
      Authorization: services.avwx.token,
    },
  });

  static async getStationInfo(icao) {
    try {
      const response = await this.api.get(`/station/${icao}`);
      if (response.status !== 200)
        return new Error('Cannot find ICAO station.');
      return response.data;
    } catch (ex) {
      console.error(ex);
      return new Error('Internal Server Error');
    }
  }

  static async getMetar(icao) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.api.get(
          `/metar/${icao}?options=info,translate,speech`
        );

        if (response.status !== 200)
          return reject(
            new Error('no station available at the moment near WIMK')
          );
        const metar = response.data;
        let readable = '';
        readable += '**Station : ** ';

        if (metar.info.icao) {
          readable += `${metar.info.icao}`;
        } else {
          readable += `${metar.station}`;
        }

        let station = '';
        if (metar.info.name || metar.info.city) {
          if (metar.info.name) {
            try {
              station += `${decodeURIComponent(escape(metar.info.name))}`;
              if (metar.info.city) {
                try {
                  station += `, ${decodeURIComponent(escape(metar.info.city))}`;
                } catch (err) {
                  console.log(err);
                }
              }
            } catch (error) {
              if (metar.info.city) {
                try {
                  station += `${decodeURIComponent(escape(metar.info.city))}`;
                } catch (err) {
                  console.log(err);
                }
              }
            }
          }
        }

        if (station) {
          readable += ` (${station})`;
        }

        readable += '\n';

        readable += `**Observed at : ** ${dayjs
          .utc(metar.time.dt)
          .format('YYYY-MM-DD HH:mm:ss [Z]')} \n`;

        if (metar.translate.wind) {
          readable += `**Wind : ** ${metar.translate.wind} \n`;
        }

        if (metar.translate.visibility) {
          readable += `**Visibility : ** ${metar.translate.visibility} \n`;
        }

        if (metar.translate.temperature) {
          readable += `**Temperature : ** ${metar.translate.temperature} \n`;
        }

        if (metar.translate.dewpoint) {
          readable += `**Dew Point : ** ${metar.translate.dewpoint} \n`;
        }

        if (metar.translate.altimeter) {
          readable += `**Altimeter : ** ${metar.translate.altimeter} \n`;
        }

        if (metar.translate.clouds) {
          readable += `**Clouds : ** ${metar.translate.clouds} \n`;
        }

        if (metar.translate.other) {
          readable += `**Weather Phenomena : ** ${metar.translate.other}\n`;
        }

        if (metar.flight_rules) {
          readable += `**Flight Rules : ** ${metar.flight_rules}`;
        }

        return resolve({ raw: metar.raw, readable, speech: metar.speech });
      } catch (error) {
        return reject(
          error.response.data.error ||
            'no station available at the moment near WIMK'
        );
      }
    });
  }
};

import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';

const agent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Get BCV dollar price
*/
export const bcvDollarPrice = async ():Promise<string> => {
  try {
    const page = (await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent })).data;
    const $ = cheerio.load(page);
    const dollarPrice = $('#dolar strong').text();

    return dollarPrice.trim();
  } catch (error) {
    console.log(error);
  }
};
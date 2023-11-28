import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';

const agent = new https.Agent({
  rejectUnauthorized: false
});

export const bcvDollarPrice = async ():Promise<string> => {
  try {
    const { data: page } = await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent });
    const $ = cheerio.load(page);
    const dollarPrice = $('#dolar strong').text();

    return dollarPrice.trim();
  } catch (error) {
    console.log(error);
  }
};
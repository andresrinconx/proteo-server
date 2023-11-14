import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';

const agent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Get BCV dollar price
 */
export const bcvDollarPrice = async () => {
  try {
    // get page
    const res = await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent });
    const page = await res.data;

    // extract dollar value
    const $ = cheerio.load(page);
    const dollarPrice = $('#dolar .field-content .row .centrado strong').text();

    return dollarPrice;
  } catch (error) {
    console.log(error);
  }
};
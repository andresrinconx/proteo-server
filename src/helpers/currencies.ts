import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';

const agent = new https.Agent({
  rejectUnauthorized: false
});


/**
 * Get BCV dollar price
*/
const cache = {
  dollarPriceTime: 0, // moment setted
  dollarPrice: '',
  expirationTime: 43200000, // 12 hours
};

export const bcvDollarPrice = async () => {
  try {
    // check cache
    if (cache.dollarPrice && Date.now() - cache.expirationTime < cache.dollarPriceTime) {
      return cache.dollarPrice;
    }

    // get page
    const res = await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent });
    const page = await res.data;

    // extract dollar value
    const $ = cheerio.load(page);
    const dollarPrice = $('#dolar .field-content .row .centrado strong').text();

    // set cache
    cache.dollarPrice = dollarPrice.trim();
    cache.dollarPriceTime = Date.now();

    return dollarPrice.trim();
  } catch (error) {
    console.log(error);
  }
};
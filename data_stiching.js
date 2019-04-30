// version 1.0.0
// future additions
// 1. write failed url to a fail log with failer discription

// pulling in puppeteer
const puppeteer = require('puppeteer');
//pulling in node filestsystem
const fs = require('fs');
// pulling in jsonToCsv parser
const JSONToCSV = require('json2csv').parse;
// pulling in csv-parser
const csv = require('csv-parser');

const cookieJar = [];
fs.createReadStream('test_data_source.csv')
  .pipe(csv())
  .on('data', row => {
    (async () => {
      const browser = await puppeteer.launch();
      let page = await browser.newPage();
      try {
        await page.goto(row.domain, { waitUntil: 'networkidle2' });
        console.log(`Visiting url: ${row.domain}`);
        //grouping cookies by domain and network activity
        const domainCookies = await page.cookies();
        let networkCookies = await page._client.send('Network.getAllCookies');
        //extracts cookies from domain array
        domainCookies.forEach(element => {
          element.dataSource = row.domain;
          element.cookieSource = 'domain';
          cookieJar.push(element);
        });
        console.log(domainCookies);

        //extracts cookies from network array
        networkCookies.cookies.forEach(element => {
          element.dataSource = row.domain;
          element.cookieSource = 'network';
          cookieJar.push(element);
        });
        await page._client.send('Network.clearBrowserCookies');
      } catch (err) {
        console.log(`An error occured on url: ${row.domain}`);
        console.log(err);
      } finally {
        console.log('task completed');
      }
      //creats an array of objects to a csv file
      const resultsCSV = JSONToCSV(cookieJar, {
        fields: [
          'name',
          'value',
          'domain',
          'path',
          'expires',
          'size',
          'httpOnly',
          'secure',
          'session',
          'dataSource',
          'cookieSource'
        ]
      });
      //writes file to folder
      console.log('writing everything to csv file');
      fs.writeFileSync('./all_cookies.csv', resultsCSV);
      //closing headless chrome instance
      await browser.close();
      console.log('Script ends');
    })();
  });

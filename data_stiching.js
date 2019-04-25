// version 1.0.0
// future additions
// 1. write failed url to a fail log with failer discription
// 2. add a csv url feed source

// pulling in puppeteer
const puppeteer = require('puppeteer');
//pulling in node filestsystem
const fs = require('fs');
// pulling in jsonToCsv parser
const JSONToCSV = require('json2csv').parse;
// pulling in csv-parser
const csv = require('csv-parser');

//function to open puppter get cookie data a return as array of object
(async () => {
  const urls = [
    'https://www.autoplusap.com',
    'https://www.synnexcorp.com',
    'https://www.thulegroup.com',
    'https://www.cibtvisas.com',
    'https://www.hollandregional.com',
    'https://www.sonicdrivein.com',
    'https://www.plastipak.com',
    'https://www.eogresources.com',
    'https://www.hgtechinc.net',
    'https://www.pyramidhotelgroup.com',
    'https://www.logisticshealth.com',
    'https://www.avifoodsystems.com',
    'https://www.cummins.com',
    'https://www.hennigesautomotive.com',
    'https://www.brgeneral.org',
    'https://www.spencersonline.com',
    'https://www.exactstaff.com',
    'https://www.paloshealth.com',
    'https://www.griddynamics.com',
    'https://www.crec.org',
    'https://www.asrcfederal.com',
    'https://www.academymortgage.com',
    'https://www.integrisok.com',
    'https://www.maxar.com',
    'https://www.koenigrubloff.com',
    'https://www.iduna.se',
    'https://www.zayo.com',
    'https://www.theice.com',
    'https://www.capitalsenior.com',
    'https://www.myinnovage.com',
    'https://www.security-finance.com',
    'https://www.shakeproofgroup.com',
    'https://www.realpage.com',
    'https://www.galacorp.com',
    'https://www.suncommunities.com',
    'https://www.suffolk.com',
    'https://www.socalgas.com',
    'https://www.cookgroup.com',
    'https://www.healthplan.com',
    'https://www.excellusbcbs.com',
    'https://www.centene.com',
    'https://www.woodward.com',
    'https://www.crosscountryhealthcare.com',
    'https://www.ctbinc.com',
    'https://www.scjohnson.com',
    'https://www.sgt-inc.com',
    'https://www.luxfercylinders.com',
    'https://www.aleris.se',
    'https://www.delta.com',
    'https://www.pfgc.com',
    'https://www.cornerbakerycafe.com',
    'https://www.cumc.columbia.edu',
    'https://www.riversideresort.com',
    'https://www.blharbert.com',
    'https://www.gehealthcare.com',
    'https://www.americanwoodmark.com',
    'https://www.dreamdinners.com',
    'https://www.luxorfurn.com',
    'https://www.blackrock.com',
    'https://www.whirlpoolcorp.com',
    'https://www.arthrex.com',
    'https://www.equitylifestyleproperties.com',
    'https://www.harman.com',
    'https://www.greatlakescaring.com',
    'https://www.smpcorp.com',
    'https://www.childrens.com',
    'https://www.sfellc.org',
    'https://www.Axcess-Financial.com',
    'https://www.wkhs.com',
    'https://www.austin-ind.com',
    'https://www.mhplan.com',
    'https://www.wakemed.org',
    'https://www.vectrus.com',
    'https://www.kaltex.com',
    'https://www.salemmedia.com',
    'https://www.matson.com',
    'https://www.powellind.com',
    'https://www.qchi.com',
    'https://www.surgerypartners.com',
    'https://www.memorialhealth.com',
    'https://www.energizer.com',
    'https://www.lifetimebrands.com',
    'https://www.faro.com',
    'https://www.universitymri.com',
    'https://www.specialized.com',
    'https://www.martins-supermarkets.com',
    'https://www.rti.org',
    'https://www.royalcaribbean.com',
    'https://www.priorityhealth.com',
    'https://www.chwinery.com',
    'https://www.transdigm.com',
    'https://www.insp.com',
    'https://www.nffc.com',
    'https://www.cumberlandfarms.com',
    'https://www.carterlumber.com',
    'https://www.houseofraeford.com',
    'https://www.yoli.com',
    'https://www.charleys.com',
    'https://www.svmh.com',
    'https://www.itsmarta.com'
  ];
  const browser = await puppeteer.launch();
  let cookieJar = [];
  for (let url of urls) {
    console.log(`Visiting url: ${url}`);
    let page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      //domain cookies
      let domainCookies = await page.cookies();
      //network cookies
      let networkCookies = await page._client.send('Network.getAllCookies');
      //extracts cookies from domain array
      domainCookies.forEach(element => {
        element.dataSource = url;
        element.cookieSource = 'domain';
        cookieJar.push(element);
      });
      //extracts cookies from network array
      networkCookies.cookies.forEach(element => {
        element.dataSource = url;
        element.cookieSource = 'network';
        cookieJar.push(element);
      });
      await page._client.send('Network.clearBrowserCookies');
    } catch (err) {
      console.log(`An error occured on url: ${url}`);
    } finally {
      console.log('task completed');
    }
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

  await browser.close();
  console.log('Script ends');
})();

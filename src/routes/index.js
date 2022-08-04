const express = require("express");
const router = express.Router();
const cliProgress = require('cli-progress');

//HOME RENDER
router.get("/", async (req, res) =>{
    res.render("main.ejs");
});



//HOME SUBMIT

router.post('/', async function(req, res, next) {

  if (req.body.address.length != 42) {
    res.send('Invalid address, check that the length is equal to 42.');

  }
  if (!req.body.api) {
    res.send('No API key inserted');
  }

  var toBody = '&to=' + req.body.to
  var fromBody = '&from=' + req.body.from
  var checkbox = '&track=' + req.body.track
  res.redirect('/wallets?id=' + req.body.address + '&api='  + req.body.api + checkbox + fromBody + toBody);

})






//MAIN URL

router.get("/wallets", async (req, res) =>{
    var api = require('etherscan-api').init(req.query.api);  //API Init
    var address = req.query.id //Target wallet
    var balanceTest; // FOR CHECKING DATA
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    //Main data validation
      try {
        let balanceTest = await api.account.balance(address);
        if (!balanceTest.result) {
          res.send('Invalid wallet address');
        }

        //If the wallet address and the API are valid it loads the data filter
        else {
          var walletsID = [], varData =  {}, transactions = 0, errors = 0, inT = 0, outT = 0, ethUsed = 0, datesID = [], inEth = 0, outEth = 0, block = 0;
          console.log('API call');
          console.time('API Call');
          if (req.query.from) {
            var indexFrom = req.query.from;
          } else {
            var indexFrom = 0;
          }
          if (req.query.to) {
            var indexTo = req.query.to, callTimes = Math.ceil(req.query.to / 10000)
          } else if (req.query.track != 'undefined') {
            var callTimes = 1, indexTo = 10000
          } else {
            var callTimes = 10, indexTo = 100000;
          }
          var callQuantity = 10000, indexSearch = 0, ii = 0;

          console.log('Transactions for the address: ' + address);
          bar1.start((callQuantity * callTimes), 0);

          for (var r = 0; r < callTimes; r++) {

            var balance = api.account.txlist(address, block, 'latest', 1,  callQuantity, 'asc');
            await balance.then(function(balanceData){
              balanceData.result.forEach((item, i) => {

                if (indexSearch < indexTo && indexSearch >= indexFrom) {
                  var balanceinout = 'IN', walletContact = item.from;
                  if (item.from == address.toLowerCase() && item.isError == 0) {
                    var balanceinout = 'OUT', walletContact = item.to;
                    outT++; outEth += item.value / (10 ** 18)
                    ethUsed += item.value / (10 ** 18);transactions++;
                  } else if (item.to == address.toLowerCase() && item.isError == 0)  {
                    inT++; inEth += item.value / (10 ** 18)
                    ethUsed += item.value / (10 ** 18);
                    transactions++;
                  }
                  if (item.isError != 0) {
                    errors++
                  }
                  //Each wallet which had a transaction with the main wallet & each date
                  const unixTime = item.timeStamp
                  const date = new Date(unixTime*1000).toLocaleDateString("en-US");
                  datesID.push(date);

                  if (req.query.track != 'undefined') {
                    walletsID.push(walletContact);
                  }

                  //General data for each transaction
                  block = item.blockNumber;
                  varData[ii] = {

                    'condition': balanceinout,
                    'contactWallet': walletContact,
                    'isError': item.isError,
                    'hash': item.hash,
                    'block': item.blockNumber,
                    'timestamp': item.timeStamp,
                    'date': date,
                    'wei': item.value,
                    'eth': item.value / (10 ** 18)

                              }
                              ii++

                            }
                            indexSearch++
                            bar1.increment(1);
                    });
              });
          }
          bar1.stop();
            console.timeEnd('API Call');

          //Filter unique values for wallet to track each transaction linked to each
          Array.prototype.unique2 = function() {
            return Array.from(new Set(this));

          }
          if (req.query.track != 'undefined') {
            console.log('Processing wallets IDs');
            console.time('Processing wallets IDs');
            walletsID = walletsID.unique2();
            walletsID = walletsID.map(o => ([{ id: o }]));
            console.timeEnd('Processing wallets IDs');
          }

          console.log('Processing dates IDs');
          console.time('Processing dates IDs');
          datesID = datesID.unique2()
          datesID = datesID.map(o => ([{
            'date': o,
            'ethAmount':0,
            'quantity':0,
            'in':0,
            'out':0,
            'inQuantity': 0,
            'outQuantity': 0
                                    }]));


          //ForEach wallet
              console.timeEnd('Processing dates IDs');
              console.time('Filtering dates IDs');
              Object.keys(varData).forEach(function(key) {
                datesID.forEach((item, i) => {

                });

              });

              console.time('Filtering wallets & dates IDs');
              if (req.query.track != 'undefined') {
                //data index, wallet index
                var datai = 0, walleti = 0, datesi = 0, dataLength = Object.keys(varData).length, walletsLength = walletsID.length, datesLength = datesID.length;
                while (datai < dataLength) {
                  while (walleti < walletsLength) {
                    if (varData[datai].contactWallet === walletsID[walleti][0].id) {
                      walletsID[walleti].push(varData[datai])
                    }
                      walleti++
                  }
                  walleti = 0;

                  while (datesi < datesLength) {
                    if (varData[datai].date ===  datesID[datesi][0].date) {
                      datesID[datesi][0].quantity++; datesID[datesi][0].ethAmount += varData[datai].eth; if (varData[datai].condition == 'OUT') {
                        datesID[datesi][0].out++; datesID[datesi][0].outQuantity += varData[datai].eth
                      } else {
                        datesID[datesi][0].in++; datesID[datesi][0].inQuantity += varData[datai].eth
                      }
                    }
                      datesi++
                  }
                  datesi = 0;
                    datai++
                }
              } else {

                //data index, wallet index
                var datai = 0, datesi = 0, dataLength = Object.keys(varData).length, datesLength = datesID.length;
                while (datai < dataLength) {
                  while (datesi < datesLength) {
                    if (varData[datai].date ===  datesID[datesi][0].date) {
                      datesID[datesi][0].quantity++; datesID[datesi][0].ethAmount += varData[datai].eth; if (varData[datai].condition == 'OUT') {
                        datesID[datesi][0].out++; datesID[datesi][0].outQuantity += varData[datai].eth
                      } else {
                        datesID[datesi][0].in++; datesID[datesi][0].inQuantity += varData[datai].eth
                      }
                    }
                      datesi++
                  }
                  datesi = 0;
                    datai++
                }
              }



              console.timeEnd('Filtering wallets & dates IDs');

              var mainData = {'address': address,
                              'transactions': transactions,
                              'errors': errors,
                              'inT': inT,
                              'inEth': inEth,
                              'outT': outT,
                              'outEth': outEth,
                              'balanceWei':  balanceTest.result,
                              'balanceEth': balanceTest.result / (10**18),
                              'ethUsed': ethUsed
                          }



                          if (req.query.track != 'undefined') {
                            console.time('reFiltering wallets IDs');
                            console.log('Filtering wallets IDs by length');
                            function sortFunc(a, b){
                              if(a.length > b.length) {
                                return -1;
                              } else {
                                return 1;
                              }
                            }
                            walletsID = walletsID.sort(sortFunc);
                            console.timeEnd('reFiltering wallets IDs');
                            console.log('Rendering');
                            console.time('Rendering');
                            res.render('wallet.ejs', {walletsID, varData, mainData, datesID})
                            console.timeEnd('Rendering');
                          }
                          else {
                            console.log('Rendering');
                            console.time('Rendering');
                            res.render('walletAlt.ejs', {varData, mainData, datesID})
                            console.timeEnd('Rendering');
                          }



        }
      } catch(err) {
        res.send(err);
      }

});

router.get("/error", async (req, res) =>{
   var errors = []
   errors.push ({text: "Invalid wallet"});
    res.render("views/main", { errors });
});

module.exports = router;

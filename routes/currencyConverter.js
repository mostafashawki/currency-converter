const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose');
const axios       = require('axios');
const parseString = require('xml2js').parseString;
const fx          = require("money");
const accounting  = require("accounting");

const TLog = require('../models/TLog');

// Validation
const validatePostInput = require('../validation/tLog');


 //let formattedAmount = '';
 //let newTrans = {};


// @route   POST /currencyconverter
// @desc    Get exchange rate from ECB and make our conversion
// @access  Public
router.post('/currencyconverter',(req, res, next) => {
    //validation first 
    //=======START VALIDATION==============================
        const { errors, isValid } = validatePostInput(req.body);
        // Check Validation
        if (!isValid) {
          // If any errors, send 400 with errors object
          return res.status(400).json(errors);
        } 
    //======END VALIDATION==================================
      let rateOfFrom;
      let rateOfTo;
      console.log(req.body.from);
      //check for EUR in from field or to to set it to 1 as a rate, because it is our base
      if(req.body.from === "EUR"){
          rateOfFrom = 1;
      }
      if(req.body.to === "EUR"){
        rateOfTo = 1;
      }
    //Transaction object
        const newTrans = new TLog({
          from: req.body.from,
          rateOfFrom: rateOfFrom,
          to: req.body.to,
          rateOfTo: rateOfTo,
          amount: req.body.amount
        });
      

    getData(newTrans, (data) => {
      // this anonymous function will run when the
      // callback is called
      console.log("callback called! " + data);
      //res.send(data);
      //save to our db and send the result
      new TLog(newTrans).save().then(result => res.status(200)
      .json({result, formattedAmount: data}))
      .catch(err => {
       console.log(err);
       res.status(500).json({
         error: err
       });
     });
    });
 
    
  });
  
//function with callback to get today currency prices
const getData = (newTrans, callback) =>{
  //=========axios setup
    const url = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
    const options = {
      method: 'GET',
      url,
    };
    //==========start axios request
    console.log('get data called');
    axios(options)
    .then(axiosRes => {
     let dataString ='';
     let dataJson = {};
     parseString(axiosRes.data,(error, result) => dataString = JSON.stringify(result));

     let parsedData = JSON.parse(dataString);
     dataJson = parsedData['gesmes:Envelope'].Cube[0].Cube[0].Cube;
      //console.log('data json is: ',dataJson);
      
      console.log('FROM IS: ',newTrans.from);
      //if NewTrans.from != "EUR"
      if(newTrans.from !="EUR"){
          let filteredCurrencyFrom = dataJson
          .filter( obj =>  obj.$.currency === newTrans.from);
          newTrans.rateOfFrom = filteredCurrencyFrom[0].$.rate;
      }
     
      //if NewTrans.to != "EUR"
      if(newTrans.to !="EUR"){
          let filteredCurrencyTo = dataJson
          .filter( obj =>  obj.$.currency === newTrans.to);
          newTrans.rateOfTo = filteredCurrencyTo[0].$.rate;
      }
     
      //====our money.js setup===========
      fx.base = "EUR";
      fx.rates = {[newTrans.from]: newTrans.rateOfFrom, [newTrans.to]: newTrans.rateOfTo};
      //======end money.js setup=========

      //start convert using money.js
      let convertedAmount = fx.convert(newTrans.amount, {from: newTrans.from, to: newTrans.to});
      //format the amount using accounting.js
      let formattedAmount = accounting.formatMoney(convertedAmount, { symbol: newTrans.to,  format: "%v %s" });
      console.log(convertedAmount);
      console.log(formattedAmount);
      
      callback(formattedAmount) ;
      
})
.catch( (error) => {
 if (error.response) {
   console.log(error.response.data);
   //console.log(error.response.status);
   //console.log(error.response.headers);
   res.send(error.message, error.response.status);
 } else if (error.request) {
   console.log(error.request);
 } else {
   // Something happened in setting up the request that triggered an Error
   console.log('Error', error.message);
 }
 console.log(error.config);
});

 //============end axios
}

  

//export router to be accessible for test
module.exports = router;
const mongoose = require("mongoose");
const TLog = require('../models/TLog');

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);


// Test /currencyconverter route
  describe('/POST currencyconverter', () => {


    it('should get new transaction and get converted amount', (done) => {
        chai.request(server)
          .post('/currencyconverter')
          .send({'from': 'EUR', 
                 'to': 'GBP',
                 'amount': '1000'
                })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('result');
            res.body.result.should.be.a('object');
            res.body.result.should.have.property('_id');
            res.body.result.should.have.property('from');
            res.body.result.should.have.property('rateOfFrom');
            res.body.result.should.have.property('to');
            res.body.result.should.have.property('rateOfTo');
            res.body.result.should.have.property('amount');
            res.body.should.have.property('formattedAmount');
            //if you want to test the value
            //res.body.formattedAmount.should.equal('885.20 GBP');
            done();
          });
      });
  });


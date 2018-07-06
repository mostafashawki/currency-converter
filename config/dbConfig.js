
let dbConfig = {};

dbConfig.mongoURI = {
  //development db
  development: 'mongodb://xyztestuser:secretPass123456@ds239029.mlab.com:39029/cc-db',
  //testing db 
   test:'mongodb://xyztestuser:secretPass123456@ds121461.mlab.com:21461/cc-db-test'
  //test: 'mongodb://xyztestuser:secretPass123456@ds219641.mlab.com:19641/taxfix-db'
   
};

module.exports = dbConfig;

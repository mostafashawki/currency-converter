const express     = require('express');
const helmet = require('helmet');
const mongoose    = require('mongoose');
const bodyParser  = require('body-parser');

const app = express();
//set security headers
app.use(helmet());

const currencyConverter = require('./routes/currencyConverter');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// *** config file *** //
const db = require('./config/dbConfig').mongoURI[app.settings.env];

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected: ', app.settings.env))
  .catch(err => console.log(err));


// create our router
const router = express.Router();


// test route to make sure everything is working (accessed at GET http://localhost:8000/)
router.get('/', function(req, res) {
	res.json({ message: 'welcome to API!' });
});


const port = process.env.PORT || 8080;


// REGISTER OUR ROUTES -------------------------------
app.use('/', router);
// Use Routes
app.use('/', currencyConverter);

// error handling middleware
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server is running on port ' + port);


module.exports = app;
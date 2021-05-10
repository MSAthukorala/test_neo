const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const cors = require('cors');
const firebase = require('firebase')


//read environment variables
const dotenv = require('dotenv');
dotenv.config();

mongoose.set("useFindAndModify", false)
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  console.log(err);
});


var apiRouter = require('./routes/api');

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'))

app.use('/api', apiRouter);

app.use('/unauthorized', (req, res) => {
  res.send("unauthorized - API key required");
})

app.use("/", (req, res) => {
  res.send("Book - invalid route");
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});



module.exports = app;

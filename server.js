const express = require('express');
const app = express();

var multer = require('multer');

let timeNow = '';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    timeNow = Date.now();
    cb(null, timeNow + '.jpg'); //Appending .jpg
  },
});

var upload = multer({ storage: storage });

const http = require('http').Server(app);

//Initializa Middleware
app.use(express.json({ extended: false, limit: '50mb' }));

app.post('/upload', upload.single('photo'), (req, res, next) => {
  res.json(req.file);
  console.log(timeNow);
  //send name to fastapi
  var request = require('request');
  var clientServerOptions = {
    url: 'http://192.168.1.106:8000/filename?fname=' + timeNow,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  request(clientServerOptions, function (error, response) {
    console.log(error);
    return;
  });
});

app.post('/uploadText', upload.single('photo'), (req, res, next) => {
  res.json(req.file);
  console.log(timeNow);
  //send name to fastapi
  var request = require('request');
  var clientServerOptions = {
    url: 'http://192.168.1.106:8000/filenameText?fname=' + timeNow,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  request(clientServerOptions, function (error, response) {
    console.log(error);
    return;
  });
});

const PORT = 5000;
app.get('/', (req, res) => res.send('API running'));
app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`));

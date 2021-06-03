const express = require('express');
const app = express();

var multer = require('multer');
const { stringify } = require('querystring');

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
  const axios = require('axios');

  var text = '';
  var textNew = '';
  var textFinal = '';
  const sendPostRequest = async () => {
    let url = 'http://10.0.0.4:5000/filename?fname=' + timeNow;
    try {
      const resp = await axios.post(url);

      text = JSON.stringify(resp.data);
      let textArray = text.split(/\r?\n/);
      textNew = textArray.join(' ');

      for (let index = 0; index < textNew.length - 1; index++) {
        if (
          textNew.charAt(index) === '\\' &&
          textNew.charAt(index + 1) === 'n'
        ) {
          textFinal = textFinal + ' ';
          index++;
        } else {
          textFinal = textFinal + textNew.charAt(index);
        }
      }

      console.log(textFinal);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  sendPostRequest();

  setTimeout(() => {
    // console.log(text);
    const data = JSON.stringify({
      txt: textFinal,
    });
    res.send(data);
  }, 3000);
});

app.post('/uploadText', upload.single('photo'), (req, res, next) => {
  const axios = require('axios');

  var text = '';
  const sendPostRequest = async () => {
    let url = 'http://192.168.1.103:5000/filenameText?fname=' + timeNow;
    try {
      const resp = await axios.post(url);

      text = JSON.stringify(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  sendPostRequest();

  setTimeout(() => {
    const data = JSON.stringify({
      txt: text,
    });
    res.send(data);
  }, 3000);
});

app.get('/hello', (req, res, next) => {
  const axios = require('axios');

  var text = '';
  const sendGetRequest = async () => {
    let url = 'http://10.0.0.4:5000/hello' + timeNow;
    try {
      const resp = await axios.get(url);

      text = JSON.stringify(resp.data);
      console.log(text);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  sendGetRequest();
  // const data = JSON.stringify({
  //   txt: text,
  // });
  // res.send(data);

  setTimeout(() => {
    // console.log(text);
    const data = JSON.stringify({
      txt: text,
    });
    res.send(data);
  }, 3000);
});

const PORT = 8000;
app.get('/', (req, res) => res.send('API running'));
app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`));

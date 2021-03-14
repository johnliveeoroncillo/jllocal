const express = require('express');
const cors = require('cors');
const find = require('local-devices');
const { exec } = require('child_process');


const PORT = process.env.PORT || 8081;
const app = express();

const corsOpts = {
origin: 'http://localhost:8080',

methods: [
    'GET',
    'POST',
],

allowedHeaders: [
    'Content-Type',
],
};

app.use(cors(corsOpts));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

function nslookup(ip) {
   return new Promise(function(resolve, reject) {
        exec(`nslookup ${ip}`, (err, stdout, stderr) => {
            if (err) return reject(err);

            resolve(stdout.replace(/(\r\n|\n|\r)/gm, "<br>"));
        });
   })
}

app.get('/', (req, res, next) => {
    find().then(async (device) => {
        if(device.length) {
            device = await Promise.all(device.map(async (element) => {
                element['lookup'] = await nslookup(element.ip);
                return element;
            }));
            res.json(device);
        }
    });
});

//LISTEN
app.listen(PORT, () => {
    console.log(`RUNNING ${PORT} ${process.env.NODE_ENV}`)
});
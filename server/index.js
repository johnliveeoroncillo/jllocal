const express = require('express');
const cors = require('cors');
const find = require('local-devices');
const { exec } = require('child_process');
let runtime = {};


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

function  arrdif(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var j = 0; j < a2.length; j++) {
        if (a[a2[j]]) {
            delete a[a2[j]];
        } else {
            a[a2[j]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

function runtimef(mac) {
    if(!runtime.hasOwnProperty.call(runtime,mac)) runtime[mac] = new Date();
    
    let today = new Date();
    let dif = Math.round((today.getTime() - runtime[mac].getTime()) / 1000);

    return dif;
}

app.get('/', (req, res, next) => {
    find().then(async (device) => {
        if(device.length) {
            device = await Promise.all(device.map(async (element) => {
                element['lookup'] = await nslookup(element.ip);
                element['runtime'] = runtimef(element.mac);
                return element;
            }));


            let macs = device.map(element => {
                return element.mac;
            });
            
            let diff = arrdif(Object.keys(runtime), macs);
            if(diff.length) {
                diff.forEach(element => {
                    delete runtime[element];
                });
            }

            res.json(device);
        }
    });
});

//LISTEN
app.listen(PORT, () => {
    console.log(`RUNNING ${PORT} ${process.env.NODE_ENV}`)
});
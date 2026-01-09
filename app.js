const express = require('express');
const app = new express();
const router = require('./src/route/api');

// IMPORT ALL PACKAGE
app.set('trust proxy', 1);
const path = require('path');
const helmet =require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const mongoose = require('mongoose');
const sanitizer = require('express-sanitizer');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

//prodhanr72_pulse
//projecT&pulse1040
// MONGOOSE IMPLEMENTATION
mongoose.connect(`mongodb+srv://prodhanr72_pulse:projecT&pulse1040@cluster0.ngtlsib.mongodb.net/projectpulse`).then(()=> {
    console.log('Database connected!')
}).catch((err) => {
    console.log(err.toString())
})


// CORS IMPLEMENTATION
app.use(cors());


// BASIC SECURITY & MIDDLEWARE IMPLEMENTATION
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
// app.use(morgan('dev'));

app.use(sanitizer());
app.use(xss())



// RATE LIMIT SPECIFY
const limiter = rateLimit({windowMs: 15 * 60 * 1000, max: 5000});
app.use(limiter)

app.set('etag', false)
app.use('/api/v1', router);

app.use((req, res) => {
    res.status(404).json({status: 'failed', message: 'Route not found'})
})

// ADD REACT FRONT-END ROUTING
// app.use(express.static('client/dist'));
// app.get('*', function(req, res) {
//     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
// })

module.exports = app;


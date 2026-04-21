const dotenv = require('dotenv');
dotenv.config();
console.log('Injected keys:', Object.keys(process.env).filter(k => k.includes('KEY') || k === 'PORT'));

const fs = require('fs');
require('dotenv').config();
var test = "test";
if (process.env.ENV === 'Glitch') {
  console.log('[Ops] Changing the README in Glitch to point to Github documentation');
  fs.writeFile('./README.md', test);
}
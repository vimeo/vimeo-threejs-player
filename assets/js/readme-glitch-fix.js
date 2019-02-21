const fs = require('fs');
require('dotenv').config();

var glitchReadMeText = "### Hello and welcome to the Vimeo three.js player examples 👋🏼 \n Have a look at our [Getting Started guide](https://github.com/vimeo/vimeo-threejs-player/wiki/Getting-Started-%F0%9F%9A%80), or check out the [full documentation in Github](https://github.com/vimeo/vimeo-threejs-player). \n For questions and support, ask on [StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo)";

if (process.env.ENV === 'Glitch') {
  console.log('[Ops] Changing the README in Glitch to point to Github documentation');

  // Change the README to the Glitch one
  fs.writeFile('./README.md', glitchReadMeText, 'utf8', function (err) {
     if (err) return console.log(err); 
  });  
}
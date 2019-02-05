<h1 align="center">Vimeo three.js player</h1>

<p align="center">[super nice banner image]</p>
<p align="center"><b>A plugin for streaming video to WebGL/VR/AR apps</b></p>

<p align="center">
  <a href="https://app.codeship.com/projects/325924"><img src="https://app.codeship.com/projects/dc6de560-07c0-0137-30da-5e4580378d6f/status?branch=master" alt="Build Status"></a>
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Code Style">
    <img src="https://img.shields.io/npm/l/aframe.svg?style=flat-square" alt="License"></a>
</p>

<div align="center">
  <a href="#">Getting started</a>
  &mdash;
  <a href="API.md">API</a>
  &mdash;
  <a href="#stay-in-touch">Stay in touch</a>
</div>

## Examples
[A collection of nice example images]

## Features
📼 **Streaming video made simple**: The plugin let's you stream video hosted on Vimeo directly to your WebGL app

🏋🏿‍ **Let us do the heavy lifting**: stream multipule resolutions including adaptive video on supported platforms for best performance and video quality

📱 **Works everywhere**: works on phones, tablets, laptops, computers, VR headsets and even underwater

## Usage
To start playing and streaming video now, remix the basic example on Glitch:

[Glitch badge]

A Vimeo video player can be created by simply adding this line to your scene
```js
var vimeoPlayer = new Vimeo.Player(video_id, {
  autoplay: true,
  muted: true
})
```

And ensure your server is requesting the videos from the Vimeo API. You can remix our Glitch example to get started quickly, or build your own backend
```js
app.get('/vimeo/api', (request, response) => {
  let api = new Vimeo(null, null, process.env.VIMEO_TOKEN);

  api.request({
      method: 'GET',
      path: request.query.path,
      headers: { Accept: 'application/vnd.vimeo.*+json;version=3.4' },
    },
    function(error, body, status_code, headers) {
      if (error) {
        response.status(500).send(error);
        console.log('[Server] ' + error);
      } else {
        // Pass through the whole JSON response
        response.status(200).send(body);
      }
    }
  );
});
```

> Streaming Vimeo videos requires video file access via the Vimeo API. Accessing video files is limited to [Vimeo Pro and Business](https://vimeo.com/upgrade) customers.

## Questions
For questions and support, ask on [StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo)

## Stay in Touch
[Join our newsletter](https://vimeo.us6.list-manage.com/subscribe?u=a3cca16f9d09cecb87db4be05&id=28000dad3e) for more updates, or visit the [Creator Labs website](https://labs.vimeo.com) to learn more.

## Contributing
Get involved! Check out the [Contributing Guide](CONTRIBUTING.md) for how to get started.

## License
This software is free software and is distributed under an MIT License.
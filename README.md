<h1 align="center">Vimeo three.js player</h1>

<p align="center"><b>A plugin for streaming video from Vimeo to WebGL/VR/AR apps</b></p>

<p align="center">
  <a href="https://app.codeship.com/projects/325924"><img src="https://app.codeship.com/projects/dc6de560-07c0-0137-30da-5e4580378d6f/status?branch=master" alt="Build Status" /></a>
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Code Style" />
    <img src="https://badge.glitch.me/vimeo-threejs-player" alt="Glitch Examples status" />
    <img src="https://img.shields.io/npm/l/aframe.svg?style=flat-square" alt="License" />
</p>

<div align="center">
  <a href="https://github.com/vimeo/vimeo-threejs-player/wiki/Getting-Started-%F0%9F%9A%80">Getting started</a>
  &mdash;
  <a href="API.md">API</a>
  &mdash;
  <a href="#stay-in-touch">Stay in touch</a>
</div>

## Examples

<a href="https://vimeo-threejs-player.glitch.me/basic">
  <img alt="Basic" target="_blank" src="https://i.imgur.com/NWaaljL.gif" height="190" width="32%">
</a>
<a href="https://vimeo-threejs-player.glitch.me/shapes">
  <img alt="Shapes" target="_blank" src="https://i.imgur.com/7bF8yKW.gif" height="190" width="32%">
</a>
<a href="https://vimeo-threejs-player.glitch.me/webvr-video">
  <img alt="360 WebVR" target="_blank" src="https://i.imgur.com/orN8ZQL.gif" height="190" width="32%">
</a>
<a href="https://vimeo-threejs-player.glitch.me/album">
  <img alt="Play an album" target="_blank" src="https://i.imgur.com/MSlXbju.gif" height="190" width="32%">
</a>
<a href="https://vimeo-threejs-player.glitch.me/two-and-a-half-d.html">
  <img alt="2.5D" target="_blank" src="https://i.imgur.com/iMnEFOf.gif" height="190" width="32%">
</a>
<a href="https://vimeo-threejs-player.glitch.me/depthkit">
  <img alt="Play volumetric video" target="_blank" src="https://i.imgur.com/B7S57Kl.gif" height="190" width="32%">
</a>


## Features
📼 **Streaming video made simple**: The plugin lets you stream video hosted on Vimeo directly to your WebGL app

🏋🏿‍ **Let us do the heavy lifting**: stream multiple resolutions including adaptive video on supported platforms for best performance and video quality

📱 **Works everywhere**: works on phones, tablets, laptops, computers, VR headsets and even underwater

## Usage
To start playing and streaming video now, remix the Glitch example:

<a href="https://glitch.com/edit/#!/remix/vimeo-threejs-player">
<img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix-button.svg?1504724691606" alt="Glitch remix badge" aria-label="remix" width="124" />
</a>

The first step is to generate your own Vimeo API token. [Generate the token](https://vimeo-authy.herokuapp.com/auth/vimeo/webgl), and then copy it and paste it into the *.env* in Glitch.

Almost done, go to the basic example under `examples/basic.html`
 and change the [video id in line 77](https://github.com/vimeo/vimeo-threejs-player/blob/master/examples/basic.html#L77) to your Vimeo video id. It should look like
 ```js
     vimeoPlayer = new Vimeo.Player(vimeo_video_id, { autoplay: false });
 ```
Try our other examples or head to our [getting started guide](https://github.com/vimeo/vimeo-threejs-player/wiki/Getting-Started-%F0%9F%9A%80) to learn more

> Streaming Vimeo videos requires video file access via the Vimeo API. Accessing video files is limited to [Vimeo Pro and Business](https://vimeo.com/upgrade) customers.

## Questions
For questions and support, ask on [StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo)

## Stay in Touch
[Join our newsletter](https://vimeo.us6.list-manage.com/subscribe?u=a3cca16f9d09cecb87db4be05&id=28000dad3e) for more updates, or visit the [Creator Labs website](https://labs.vimeo.com) to learn more.

## Contributing
Get involved! Check out the [Setting up the development environment guide](https://github.com/vimeo/vimeo-threejs-player/wiki/Setting-up-the-development-environment-%F0%9F%91%B7%F0%9F%8F%BD%E2%80%8D) for how to get started.

## License
This software is free software and is distributed under an [MIT License](LICENSE).
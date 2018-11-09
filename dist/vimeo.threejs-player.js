(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_VALUES = {
    emitDelay: 10,
    strictMode: false
};

/**
 * @typedef {object} EventEmitterListenerFunc
 * @property {boolean} once
 * @property {function} fn
 */

/**
 * @class EventEmitter
 *
 * @private
 * @property {Object.<string, EventEmitterListenerFunc[]>} _listeners
 * @property {string[]} events
 */

var EventEmitter = function () {

    /**
     * @constructor
     * @param {{}}      [opts]
     * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
     * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
     */

    function EventEmitter() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_VALUES : arguments[0];

        _classCallCheck(this, EventEmitter);

        var emitDelay = void 0,
            strictMode = void 0;

        if (opts.hasOwnProperty('emitDelay')) {
            emitDelay = opts.emitDelay;
        } else {
            emitDelay = DEFAULT_VALUES.emitDelay;
        }
        this._emitDelay = emitDelay;

        if (opts.hasOwnProperty('strictMode')) {
            strictMode = opts.strictMode;
        } else {
            strictMode = DEFAULT_VALUES.strictMode;
        }
        this._strictMode = strictMode;

        this._listeners = {};
        this.events = [];
    }

    /**
     * @protected
     * @param {string} type
     * @param {function} listener
     * @param {boolean} [once = false]
     */


    _createClass(EventEmitter, [{
        key: '_addListenner',
        value: function _addListenner(type, listener, once) {
            if (typeof listener !== 'function') {
                throw TypeError('listener must be a function');
            }

            if (this.events.indexOf(type) === -1) {
                this._listeners[type] = [{
                    once: once,
                    fn: listener
                }];
                this.events.push(type);
            } else {
                this._listeners[type].push({
                    once: once,
                    fn: listener
                });
            }
        }

        /**
         * Subscribes on event type specified function
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'on',
        value: function on(type, listener) {
            this._addListenner(type, listener, false);
        }

        /**
         * Subscribes on event type specified function to fire only once
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'once',
        value: function once(type, listener) {
            this._addListenner(type, listener, true);
        }

        /**
         * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
         * @param {string} eventType
         * @param {function} [listenerFunc]
         */

    }, {
        key: 'off',
        value: function off(eventType, listenerFunc) {
            var _this = this;

            var typeIndex = this.events.indexOf(eventType);
            var hasType = eventType && typeIndex !== -1;

            if (hasType) {
                if (!listenerFunc) {
                    delete this._listeners[eventType];
                    this.events.splice(typeIndex, 1);
                } else {
                    (function () {
                        var removedEvents = [];
                        var typeListeners = _this._listeners[eventType];

                        typeListeners.forEach(
                        /**
                         * @param {EventEmitterListenerFunc} fn
                         * @param {number} idx
                         */
                        function (fn, idx) {
                            if (fn.fn === listenerFunc) {
                                removedEvents.unshift(idx);
                            }
                        });

                        removedEvents.forEach(function (idx) {
                            typeListeners.splice(idx, 1);
                        });

                        if (!typeListeners.length) {
                            _this.events.splice(typeIndex, 1);
                            delete _this._listeners[eventType];
                        }
                    })();
                }
            }
        }

        /**
         * Applies arguments to specified event type
         * @param {string} eventType
         * @param {*[]} eventArguments
         * @protected
         */

    }, {
        key: '_applyEvents',
        value: function _applyEvents(eventType, eventArguments) {
            var typeListeners = this._listeners[eventType];

            if (!typeListeners || !typeListeners.length) {
                if (this._strictMode) {
                    throw 'No listeners specified for event: ' + eventType;
                } else {
                    return;
                }
            }

            var removableListeners = [];
            typeListeners.forEach(function (eeListener, idx) {
                eeListener.fn.apply(null, eventArguments);
                if (eeListener.once) {
                    removableListeners.unshift(idx);
                }
            });

            removableListeners.forEach(function (idx) {
                typeListeners.splice(idx, 1);
            });
        }

        /**
         * Emits event with specified type and params.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emit',
        value: function emit(type) {
            var _this2 = this;

            for (var _len = arguments.length, eventArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                eventArgs[_key - 1] = arguments[_key];
            }

            if (this._emitDelay) {
                setTimeout(function () {
                    _this2._applyEvents.call(_this2, type, eventArgs);
                }, this._emitDelay);
            } else {
                this._applyEvents(type, eventArgs);
            }
        }

        /**
         * Emits event with specified type and params synchronously.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emitSync',
        value: function emitSync(type) {
            for (var _len2 = arguments.length, eventArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                eventArgs[_key2 - 1] = arguments[_key2];
            }

            this._applyEvents(type, eventArgs);
        }

        /**
         * Destroys EventEmitter
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this._listeners = {};
            this.events = [];
        }
    }]);

    return EventEmitter;
}();

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, null, [{
    key: "getVideo",
    value: function getVideo(video_id) {
      return new Promise(function (resolve, reject) {
        fetch("/vimeo/api?path=/videos/" + video_id).then(function (res) {
          API.sendResponse(res, resolve, reject);
        });
      });
    }
  }, {
    key: "getChannelVideos",
    value: function getChannelVideos(channel_id) {
      return new Promise(function (resolve, reject) {
        fetch("/vimeo/api?path=/videos/" + id).then(function (res) {
          API.sendResponse(res, resolve, reject);
        });
      });
    }
  }, {
    key: "getAlbumVideos",
    value: function getAlbumVideos(album_id) {
      return new Promise(function (resolve, reject) {
        fetch("/vimeo/api?path=/videos/" + id).then(function (res) {
          API.sendResponse(res, resolve, reject);
        });
      });
    }
  }, {
    key: "getFolderVideos",
    value: function getFolderVideos(folder_id) {
      return new Promise(function (resolve, reject) {
        fetch("/vimeo/api?path=/videos/" + id).then(function (res) {
          API.sendResponse(res, resolve, reject);
        });
      });
    }
  }, {
    key: "sendResponse",
    value: function sendResponse(res, resolve, reject) {
      res.json().then(function (json) {
        if (res.status === 200) {
          resolve(json);
        } else {
          reject(json);
        }
      });
    }
  }]);

  return API;
}();

exports.default = API;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _videoQuality = require('./video-quality');

var _videoQuality2 = _interopRequireDefault(_videoQuality);

var _video = require('./video');

var _video2 = _interopRequireDefault(_video);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('event-emitter-es6');

var Player = function (_EventEmitter) {
  _inherits(Player, _EventEmitter);

  function Player(videoIDs) {
    var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _videoQuality2.default.auto;
    var autoplay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

    _this.id = videoIDs;
    _this.quality = quality;
    _this.autoplay = _this.autoplay;
    _this.muted = false;
    _this.video;
    _this.texture;
    return _this;
  }

  _createClass(Player, [{
    key: 'load',
    value: function load() {
      this.video = new _video2.default(this.id, this.quality, this.autoplay);

      this.video.on('metadataLoad', function () {
        this.emit('metadataLoad');
      }.bind(this));

      this.video.on('videoLoad', function () {
        this.texture = this.video.texture;
        this.emit('videoLoad');
      }.bind(this));

      this.video.on('play', function () {
        this.emit('play');
      }.bind(this));

      this.video.load();
    }
  }, {
    key: 'play',
    value: function play() {
      if (this.video) {
        this.video.play();
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (this.video) {
        this.video.pause();
      }
    }
  }], [{
    key: 'getPlayersByFolder',
    value: function getPlayersByFolder(folder_id) {}
  }]);

  return Player;
}(EventEmitter);

exports.default = Player;

},{"./api":2,"./video":6,"./video-quality":5,"event-emitter-es6":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: 'checkWebGL',
    value: function checkWebGL() {
      var hasWebGL = void 0;
      window.WebGLRenderingContext ? hasWebGL = true : hasWebGL = false;
      return hasWebGL;
    }
  }, {
    key: 'isiOS',
    value: function isiOS() {
      return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      );
    }
  }, {
    key: 'isMobile',
    value: function isMobile() {
      var check = false;
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    }
  }, {
    key: 'isJSON',
    value: function isJSON(json) {
      return json.description && json.description.match(/^{/);
    }
  }, {
    key: 'runDisplayHelpers',
    value: function runDisplayHelpers() {
      if (Vimeo.Util.isiOS()) {
        var iosEls = document.querySelectorAll('[data-is-ios]');
        for (var i = 0; i < iosEls.length; i++) {
          iosEls[i].style.display = 'block';
        }
      }

      if (!Vimeo.Util.isMobile()) {
        var els = document.querySelectorAll('[data-is-desktop]');
        for (var _i = 0; _i < els.length; _i++) {
          els[_i].style.display = 'block';
        }
      }
    }
  }]);

  return Util;
}();

exports.default = Util;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var VideoQuality = {
  auto: "auto", // auto will default to adaptive an fallback to highest progressive file
  adaptive: "adaptive",
  x4K: 2160,
  x2K: 1440,
  x1080: 1080,
  x720: 720,
  x540: 540,
  x360: 360
};

exports.default = VideoQuality;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _videoQuality = require('./video-quality');

var _videoQuality2 = _interopRequireDefault(_videoQuality);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('event-emitter-es6');

var Video = function (_EventEmitter) {
  _inherits(Video, _EventEmitter);

  function Video(videoID) {
    var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _videoQuality2.default.auto;
    var autoplay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Video);

    var _this = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this));

    _this.id = videoID;
    _this.selectedQuality = quality;

    _this.data;
    _this.loaded;
    _this.videoElement;
    _this.dashVideoElement;
    _this.videoPlayer;
    _this.texture;

    _this.autoplay = autoplay;
    _this.muted = false;
    _this.loop = false;
    return _this;
  }

  _createClass(Video, [{
    key: 'load',
    value: function load() {
      this.loadMetadata();
    }
  }, {
    key: 'loadMetadata',
    value: function loadMetadata() {
      var _this2 = this;

      if (!this.id) {
        console.warn('[Vimeo] No video ID was specified');
        return;
      }

      _api2.default.getVideo(this.id).then(function (response) {
        _this2.setMetadata(response);
      });
    }
  }, {
    key: 'setMetadata',
    value: function setMetadata(metadata) {
      this.data = metadata;
      this.emit('metadataLoad');

      if (this.autoplay) {
        this.setupVideoElement();
      }
    }
  }, {
    key: 'isLoaded',
    value: function isLoaded() {
      return this.data && this.videoPlayer;
    }
  }, {
    key: 'play',
    value: function play() {
      if (!this.isLoaded()) {
        this.setupVideoElement();
      }

      this.videoPlayer.play();

      this.emit('play');
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (!this.isLoaded()) {
        this.setupVideoElement();
      }

      this.videoPlayer.pause();

      this.emit('pause');
    }
  }, {
    key: 'setupVideoElement',
    value: function setupVideoElement() {
      this.videoElement = document.createElement('video');
      this.videoElement.id = 'vimeo-webgl-player-' + this.id;
      this.videoElement.crossOrigin = 'anonymous';
      this.videoElement.setAttribute('crossorigin', 'anonymous');
      this.videoElement.muted = this.muted;
      this.videoElement.autoplay = this.autoplay;
      this.videoElement.loop = this.loop;

      // When the video is done loading, trigger the load event
      this.videoElement.addEventListener('loadeddata', function () {
        if (this.videoElement.readyState >= 2) {
          this.setupTexture();
          this.emit('videoLoad');
        }
      }.bind(this));

      if (this.isDashPlayback()) {
        this.videoPlayer = dashjs.MediaPlayer().create();
        this.videoPlayer.initialize(this.videoElement, this.getAdaptiveURL(), false);
      } else {
        this.videoPlayer = this.videoElement;

        if (_util2.default.isiOS()) {
          this.videoPlayer.setAttribute('webkit-playsinline', 'webkit-playsinline');
          this.videoPlayer.setAttribute('playsinline', 'playsinline');
        }

        this.videoPlayer.src = this.getFileURL();
        this.videoPlayer.load();
      }
    }
  }, {
    key: 'setupTexture',
    value: function setupTexture() {
      this.texture = new THREE.VideoTexture(this.videoElement);
      this.texture.minFilter = THREE.NearestFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.format = THREE.RGBFormat;
      this.texture.generateMipmaps = false;
    }
  }, {
    key: 'getFileURL',
    value: function getFileURL() {
      if (this.isAdaptivePlayback()) {
        return this.getAdaptiveURL();
      } else {
        return this.getProgressiveFileURL(this.selectedQuality);
      }
    }
  }, {
    key: 'getAdaptiveURL',
    value: function getAdaptiveURL() {
      if (this.isDashPlayback()) {
        return this.data.play.dash.link;
      } else {
        return this.data.play.hls.link;
      }
    }
  }, {
    key: 'getProgressiveFileURL',
    value: function getProgressiveFileURL() {
      if (this.isLive()) {
        console.warn("[Vimeo] This is a live video! There are no progressive video files availale.");
      }
    }
  }, {
    key: 'isLive',
    value: function isLive() {
      return this.data.live.status === 'streaming';
    }
  }, {
    key: 'isAdaptivePlayback',
    value: function isAdaptivePlayback() {
      return this.selectedQuality == _videoQuality2.default.auto || this.selectedQuality == _videoQuality2.default.adaptive;
    }
  }, {
    key: 'isDashPlayback',
    value: function isDashPlayback() {
      return this.isAdaptivePlayback() && !_util2.default.isiOS();
    }
  }]);

  return Video;
}(EventEmitter);

exports.default = Video;

},{"./api":2,"./util":4,"./video-quality":5,"event-emitter-es6":1}],7:[function(require,module,exports){
'use strict';

var _video = require('./components/video');

var _video2 = _interopRequireDefault(_video);

var _player = require('./components/player');

var _player2 = _interopRequireDefault(_player);

var _api = require('./components/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
var Vimeo = {
  Video: _video2.default,
  Player: _player2.default,
  API: _api2.default
};

if (window.THREE) {
  window.Vimeo = Vimeo;
} else {
  console.warn('[Depth Player] three.js was not found, did you forget to include it?');
}

},{"./components/api":2,"./components/player":3,"./components/video":6}]},{},[7]);

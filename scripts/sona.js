export default class Sona {
  buffers = {};
  sounds = {};

  constructor(sources) {
    this.sources = sources || [];
    this.context = new AudioContext();
  }

  load(callback) {
    callback = callback || function() {};

    Promise.all(
      // `sources` is an array of URL strings
      this.sources.map(async url => {
        // fetch sound data from each url
        const response = await fetch(url);
        // convert the response into an array buffer
        const buffer = await response.arrayBuffer();
        // decode the array buffer into audio data, and store it in an in-memory object
        this.context.decodeAudioData(buffer, decodedBuffer => this.buffers[url] = decodedBuffer);
      })
    // execute callback after all sources have been loaded
    ).then(callback);
  }

  play(id, loop) {
    if (!this.buffers[id]) {
      return;
    }

    this.sounds[id] = this.sounds[id] || {};
    this.sounds[id].sourceNode = this.context.createBufferSource();
    this.sounds[id].sourceNode.buffer = this.buffers[id];
    this.sounds[id].sourceNode.loop = loop || false;

    if (!this.sounds[id].gainNode) {
      this.sounds[id].gainNode = this.context.createGain();
      this.sounds[id].gainNode.connect(this.context.destination);
    }

    this.sounds[id].sourceNode.connect(this.sounds[id].gainNode);

    this.sounds[id].sourceNode.start(0);
  }

  loop(id) {
    this.play(id, true);
  }

  stop(id) {
    if (!this.sounds[id]) {
      return;
    }

    this.sounds[id].sourceNode.stop(0);
  }

  getVolume(id) {
    if (!this.sounds[id]) {
      return;
    }

    return this.sounds[id].gainNode.gain.value;
  }

  setVolume(id, value) {
    if (!this.sounds[id]) {
      return;
    }

    this.sounds[id].gainNode.gain.value = value;
  }
}

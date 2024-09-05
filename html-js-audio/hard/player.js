import audios from './data.js';
import elems from './playerElem.js';
import { secondsToMinutes } from './utils.js';

export default {
  audioData: audios,
  currentAudio: {},
  currentPlaying: 0,
  isPlaying: false,
  start() {
    elems.get.call(this);
    this.update();
    // this.audio.addEventListener('ended', () => {});
  },
  play() {
    this.isPlaying = true;
    this.audio.play();
    this.playPause.innerText = 'pause';
  },
  pause() {
    this.isPlaying = false;
    this.audio.pause();
    this.playPause.innerText = 'play_arrow';
  },
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },
  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.volMute.innerHTML = this.audio.muted ? 'volume_off' : 'volume_up';
  },
  setVolume(value) {
    this.audio.volume = value / 100;
  },
  setSeek(value) {
    this.audio.currentTime = value;
  },
  timeUpdate() {
    this.currentDuration.innerText = secondsToMinutes(this.audio.currentTime);
    this.seekbar.value = this.audio.currentTime;
  },
  next() {
    this.currentPlaying++;

    if (this.currentPlaying === this.audioData.length) {
      this.currentPlaying = 0;
    }

    this.pause();
    this.update();
    this.play();
  },
  back() {
    this.currentPlaying--;

    if (this.currentPlaying === -1) {
      this.currentPlaying = this.audioData.length - 1;
    }

    this.pause();
    this.update();
    this.play();
  },
  update() {
    this.currentAudio = this.audioData[this.currentPlaying];

    this.cover.style.background = `url('${this.currentAudio.cover}') no-repeat center center / cover`;

    this.title.innerText = this.currentAudio.title;
    this.artist.innerText = this.currentAudio.artist;
    // this.audio.src = this.currentAudio.file;
    elems.createAudioElement.call(this, this.currentAudio.file);
    // await audio load
    this.audio.onloadeddata = () => {
      elems.actions.call(this);
      // console.log(this.audio.duration); seconds
    };
  },
};

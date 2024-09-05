import { secondsToMinutes } from './utils.js';

export default {
  get() {
    this.cover = document.querySelector('.card-image');
    this.title = document.querySelector('.card-content h5');
    this.artist = document.querySelector('.artist');
    // this.audio = document.querySelector('audio');
    this.playPause = document.querySelector('#play-pause');
    this.nextTrack = document.querySelector('#next-track');
    this.previousTrack = document.querySelector('#previous-track');

    this.volMute = document.querySelector('#vol-mute');
    this.volume = document.querySelector('#vol-control');

    this.seekbar = document.querySelector('#seekbar');

    this.currentDuration = document.querySelector('#current-duration');
    this.totalDuration = document.querySelector('#total-duration');
  },
  createAudioElement(audio) {
    this.audio = new Audio(audio);
  },
  actions() {
    this.playPause.onclick = () => this.togglePlayPause();
    this.audio.onended = () => this.next();

    this.volMute.onclick = () => this.toggleMute();
    this.volume.oninput = () => this.setVolume(this.volume.value);
    this.volume.onchange = () => this.setVolume(this.volume.value);

    this.seekbar.oninput = () => this.setSeek(this.seekbar.value);
    this.seekbar.onchange = () => this.setSeek(this.seekbar.value);

    this.seekbar.max = this.audio.duration;
    this.totalDuration.innerText = secondsToMinutes(this.audio.duration);

    this.audio.ontimeupdate = () => this.timeUpdate();
    this.nextTrack.onclick = () => this.next();
    this.previousTrack.onclick = () => this.back();
  },
};

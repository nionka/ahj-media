import getDate from './timestamp';

export default class AudioPost {
  constructor() {
    this.control = document.querySelector('.text-control');
    this.messages = document.querySelector('.message__list');
    this.ctrlAudio = null;
    this.timer = null;
  }

  createAudioPost(geopos, blob) {
    const li = document.createElement('li');
    li.classList.add('message__item');
    const time = document.createElement('time');
    time.classList.add('timestamp');
    time.textContent = getDate();
    const box = document.createElement('div');
    box.classList.add('message__box');
    const audio = document.createElement('audio');
    audio.classList.add('message__content');
    audio.src = blob;
    audio.controls = true;
    const geoLoq = document.createElement('div');
    geoLoq.classList.add('message__geo');
    geoLoq.textContent = geopos;
    box.append(audio);
    box.append(geoLoq);
    li.append(time);
    li.append(box);
    this.messages.prepend(li);
  }

  createAudioCtrl() {
    const div = document.createElement('div');
    div.classList.add('audio-control', 'ctrl');
    const ready = document.createElement('button');
    ready.classList.add('ready-btn', 'btn');
    ready.textContent = '✔';
    ready.title = 'Готово';
    const cansel = document.createElement('button');
    cansel.classList.add('btn-cansel', 'btn');
    cansel.textContent = 'X';
    cansel.title = 'Отмена';
    const timer = document.createElement('span');
    timer.classList.add('timer');
    timer.textContent = '00:00';
    div.append(ready);
    div.append(timer);
    div.append(cansel);
    this.ctrlAudio = div;
    this.timer = timer;
    this.control.replaceWith(div);
  }

  remoteAudioCtrl() {
    this.ctrlAudio.replaceWith(this.control);
  }
}

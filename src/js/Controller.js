/* eslint-disable class-methods-use-this */
import TextPost from './TextPost';
import getGeoposition from './geopositions';
import Modal from './Modal';
import validate from './validation';
import requestAudio from './requestaudio';

export default class Controller {
  constructor() {
    this.control = document.querySelector('.control');
    this.textarea = this.control.querySelector('.textarea');
    this.modal = null;
    this.post = null;
  }

  init() {
    this.control.addEventListener('click', (event) => this.getEvent(event));
    this.textarea.addEventListener('keydown', (event) => this.getInput(event));
  }

  getEvent(e) {
    e.preventDefault();

    if (e.target.classList.contains('audio-btn')) {
      e.preventDefault();
      console.log('audio');
      requestAudio()
        .catch((err) => this.showMistake(this.textarea, err));
    }

    if (e.target.classList.contains('video-btn')) {
      console.log('video');
    }
  }

  getInput(e) {
    if (document.querySelector('.mistake')) {
      this.removeMistake();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.currentTarget.value === '') {
        this.showMistake(e.currentTarget, 'Заполните поле');
      } else {
        getGeoposition()
          .then((data) => {
            const { latitude, longitude } = data;
            this.post = new TextPost(this.textarea.value, `[${latitude}, ${longitude}]`);
            this.post.getPost();
            this.textarea.value = '';
          })
          .catch(() => {
            this.modal = new Modal();
            this.adminModal();
          });
      }
    }
  }

  adminModal() {
    this.modal.modalForm = document.querySelector('.modal');

    this.modal.modalForm.addEventListener('click', (event) => this.eventModal(event));
  }

  eventModal(e) {
    e.preventDefault();
    if (e.target.classList.contains('cansel-btn') || !e.target.closest('.form')) {
      e.currentTarget.remove();
      this.modal = null;
      return;
    }

    if (e.currentTarget.querySelector('.mistake-modal')) {
      e.currentTarget.querySelector('.mistake-modal').remove();
    }

    if (e.target.classList.contains('ok-btn')) {
      const input = e.currentTarget.querySelector('.form').geopos.value;

      if (input !== '') {
        try {
          const pos = validate(input);
          e.currentTarget.remove();
          this.modal = null;
          this.post = new TextPost(this.textarea.value, `[${pos.latitude}, ${pos.longitude}]`);
          this.post.getPost();
          this.textarea.value = '';
        } catch (err) {
          this.modal.showMistake('Введены неверные данные');
        }
      } else {
        this.modal.showMistake('Пустая строка');
      }
    }
  }

  showMistake(elem, text) {
    const div = document.createElement('div');
    div.classList.add('mistake');
    div.textContent = text;
    elem.after(div);
  }

  removeMistake() {
    document.querySelector('.mistake').remove();
  }
}

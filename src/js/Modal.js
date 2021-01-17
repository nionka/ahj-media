export default class Modal {
  constructor() {
    this.body = document.querySelector('body');
    this.modalForm = null;
    this.createModal();
  }

  showMistake(text) {
    const div = document.createElement('div');
    div.classList.add('mistake-modal');
    div.textContent = `*${text}`;
    this.modalForm.querySelector('label').append(div);
  }

  createModal() {
    const div = document.createElement('div');
    div.classList.add('modal');
    const form = document.createElement('form');
    form.classList.add('form');
    div.append(form);

    const h1 = document.createElement('h1');
    h1.classList.add('modal__title');
    h1.textContent = 'Что-то пошло не так';
    const span = document.createElement('span');
    span.classList.add('modal__text');
    span.textContent = 'К сожалению нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную';
    const label = document.createElement('label');
    const spanLabel = document.createElement('span');
    spanLabel.textContent = 'Широта и долгота через запятую';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'geopos';
    input.classList.add('modal__input');
    label.append(spanLabel);
    label.append(input);

    const modalCtrl = document.createElement('div');
    modalCtrl.classList.add('modal__control');
    const cansel = document.createElement('button');
    cansel.classList.add('btn-modal', 'cansel-btn');
    cansel.textContent = 'Отмена';
    const ok = document.createElement('button');
    ok.classList.add('btn-modal', 'ok-btn');
    ok.textContent = 'ok';
    modalCtrl.append(cansel);
    modalCtrl.append(ok);

    form.append(h1);
    form.append(span);
    form.append(label);
    form.append(modalCtrl);

    this.body.append(div);
  }
}

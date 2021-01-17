import AudioPost from './AudioPost';
import getGeoposition from './geopositions';
import Modal from './Modal';
import validate from './validation';

export default async function requestAudio() {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    throw new Error('Запись аудио недоступна');
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const audioPost = new AudioPost();
    audioPost.createAudioCtrl();
    let sec = 0;
    let min = 0;
    let click = false;
    const chunks = [];
    recorder.start(1000);

    recorder.addEventListener('dataavailable', (evt) => {
      const secStr = sec < 10 ? `0${sec}` : `${sec}`;
      const minStr = min < 10 ? `0${min}` : `${min}`;

      audioPost.timer.textContent = `${minStr}:${secStr}`;
      sec += 1;
      if (sec > 60) {
        sec = 0;
        min += 1;
      }
      chunks.push(evt.data);
    });

    recorder.addEventListener('stop', () => {
      audioPost.remoteAudioCtrl();
      const blob = new Blob(chunks);
      const src = URL.createObjectURL(blob);
      stream.getTracks().forEach((track) => track.stop());
      if (click) {
        getGeoposition()
          .then((data) => {
            const { latitude, longitude } = data;
            audioPost.createAudioPost(`[${latitude}, ${longitude}]`, src);
          })
          .catch(() => {
            const modal = new Modal();
            modal.modalForm = document.querySelector('.modal');

            modal.modalForm.addEventListener('click', (e) => {
              e.preventDefault();
              if (e.target.classList.contains('cansel-btn') || !e.target.closest('.form')) {
                e.currentTarget.remove();
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
                    audioPost.createAudioPost(`[${pos.latitude}, ${pos.longitude}]`, src);
                  } catch (err) {
                    modal.showMistake('Введены неверные данные');
                  }
                } else {
                  modal.showMistake('Пустая строка');
                }
              }
            });
          });
      }
    });

    audioPost.ctrlAudio.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-cansel')) {
        recorder.stop();
      }

      if (e.target.classList.contains('ready-btn')) {
        click = true;
        recorder.stop();
      }
    });
  } catch (e) {
    throw new Error('Запись аудио недоступна');
  }
}

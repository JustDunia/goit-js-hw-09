import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const btn = document.querySelector('[data-start]');
const remainingDays = document.querySelector('[data-days]');
const remainingHours = document.querySelector('[data-hours]');
const remainingMinutes = document.querySelector('[data-minutes]');
const remainingSeconds = document.querySelector('[data-seconds]');

let isDisabled = true;
let remainingTime;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    pickDateHandler(selectedDates[0]);
  },
};

const fp = flatpickr('#datetime-picker', options);

function btnDisabling() {
  isDisabled
    ? btn.setAttribute('disabled', true)
    : btn.removeAttribute('disabled');
}

function pickDateHandler(selectedDate) {
  if (selectedDate <= new Date()) {
    // window.alert('Please choose a date in the future');
    Notify.failure('Please choose a date in the future');
    isDisabled = true;
    btnDisabling();
  } else {
    remainingTime = selectedDate.getTime() - new Date().getTime();
    setTimer();
    isDisabled = false;
    btnDisabling();
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(timeObject) {
  for (let key in timeObject) {
    timeObject[key] = timeObject[key].toString().padStart(2, '0');
  }
}

function setTimer() {
  const timeObject = convertMs(remainingTime);
  addLeadingZero(timeObject);
  remainingDays.textContent = timeObject.days;
  remainingHours.textContent = timeObject.hours;
  remainingMinutes.textContent = timeObject.minutes;
  remainingSeconds.textContent = timeObject.seconds;
}

function runTimer() {
  remainingTime -= 1000;
  setTimer();
}

btn.addEventListener('click', () => {
  setInterval(runTimer, 1000);
});

btnDisabling();

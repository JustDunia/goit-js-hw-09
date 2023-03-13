import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const input = document.querySelector('#datetime-picker');
const btn = document.querySelector('[data-start]');
const remainingDays = document.querySelector('[data-days]');
const remainingHours = document.querySelector('[data-hours]');
const remainingMinutes = document.querySelector('[data-minutes]');
const remainingSeconds = document.querySelector('[data-seconds]');

let isDisabled = true;
let remainingTime;
let selectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    pickDateHandler(selectedDate);
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

let timerID;

function runTimer() {
  if (remainingTime >= 1000) {
    remainingTime -= 1000;
    setTimer();
  } else {
    clearInterval(timerID);
    isDisabled = false;
    btnDisabling();
    input.removeAttribute('disabled');
  }
}

function startHandler() {
  remainingTime = selectedDate.getTime() - new Date().getTime();
  if (remainingTime > 500) {
    setTimer();
    timerID = setInterval(runTimer, 1000);
    isDisabled = true;
    btnDisabling();
    input.setAttribute('disabled', true);
  } else {
    remainingTime = 0;
    setTimer();
  }
}

btn.addEventListener('click', startHandler);

btnDisabling();

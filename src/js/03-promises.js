import { Notify } from 'notiflix/build/notiflix-notify-aio';

const btn = document.querySelector('button');
const delayInput = document.querySelector('[name="delay"]');
const stepInput = document.querySelector('[name="step"]');
const amountInput = document.querySelector('[name="amount"]');

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  if (shouldResolve) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Notify.success(`Fulfilled promise ${position} in ${delay}ms`));
      }, delay);
    });
  } else {
    return new Promise(reject => {
      setTimeout(() => {
        reject(Notify.failure(`Rejected promise ${position} in ${delay}ms`));
      }, delay);
    });
  }
}

function runPromises() {
  const delay = Number(delayInput.value);
  const step = Number(stepInput.value);
  const amount = Number(amountInput.value);

  let timer = delay;
  for (let i = 1; i <= amount; i++) {
    createPromise(i, timer);
    timer += step;
  }
}

btn.addEventListener('click', e => {
  e.preventDefault();
  runPromises();
});

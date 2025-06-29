//   логика переключения состояний_____
const form  = document.getElementById('chat-form');
const input = document.getElementById('msg');
const send  = document.getElementById('send');
const chat  = document.getElementById('chat-window');

let state   = 'idle';   // Текущее состояние
let user    = '';       // Имя
let nums    = [];       // Два числа

// Активания кнопки
input.addEventListener('input', () => {
  if (input.value.trim()) {
    send.classList.add('enabled');
    send.disabled = false;
  } else {
    send.classList.remove('enabled');
    send.disabled = true;
  }
});

// React на отправку сообщения
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  handleCommand(text);
  input.value = '';
  send.classList.remove('enabled');
  send.disabled = true;
});

function addMessage(text, who = 'bot') {
  const li = document.createElement('li');
  li.className = `msg ${who}`;
  li.innerHTML = `
    <img src="${who === 'bot' ? 'assets/bot_avatar.png' : 'assets/user_avatar.png'}" alt="" />
    <div class="bubble">${text}</div>`;
  chat.prepend(li);
}

// команды ХЪХ
function handleCommand(cmd) {
  switch (true) {
    case /^\/start$/i.test(cmd):
      state = 'started';
      user  = '';
      nums  = [];
      addMessage('Привет, меня зовут Чат-бот, а как зовут тебя?');
      break;

    case /^\/name:\s*(.+)$/i.test(cmd):
      if (state === 'started') {
        user  = cmd.match(/^\/name:\s*(.+)$/i)[1].trim();
        state = 'named';
        addMessage(`Привет ${user}, приятно познакомиться. Я умею считать, введи числа которые надо посчитать`);
      } else {
        addMessage('Введите команду /start, для начала общения');
      }
      break;

    case /^\/number:\s*([\d\.\,\s]+)$/i.test(cmd):
      if (state === 'named') {
        nums = cmd.match(/[\d\.]+/g).map(parseFloat);
        if (nums.length === 2) {
          state = 'numbers';
          addMessage('Введите действие: -, +, *, /');
        } else {
          addMessage('Нужно ровно два числа, например /number: 7, 9');
        }
      } else {
        addMessage('Введите команду /name: ..., чтобы я узнал ваше имя');
      }
      break;

    case /^[\+\-\*\/]$/.test(cmd):
      if (state === 'numbers') {
        const op = cmd;
        const [a, b] = nums;
        let res;
        switch (op) {
          case '+': res = a + b; break;
          case '-': res = a - b; break;
          case '*': res = a * b; break;
          case '/': res = b !== 0 ? a / b : '∞'; break;
        }
        addMessage(`Результат: ${res}`);
        state = 'idle';
      } else {
        addMessage('Сначала введите два числа: /number: 7, 9');
      }
      break;

    case /^\/stop$/i.test(cmd):
      addMessage('Всего доброго, если хочешь поговорить пиши /start');
      state = 'idle';
      break;

    default:
      if (state === 'idle') {
        addMessage('Введите команду /start, для начала общения');
      } else {
        addMessage('Я не понимаю, введите другую команду!');
      }
  }
}

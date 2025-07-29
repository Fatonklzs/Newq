const socket = io();
const chat = document.getElementById('chat');

function renderMsg(msg) {
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `
    <div class="from">${msg.from}</div>
    <div class="text">${msg.text}</div>
    <div class="time">${msg.time}</div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

socket.on('init', (data) => {
  data.forEach(renderMsg);
});

socket.on('new_msg', renderMsg);
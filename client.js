const serialport = require('serialport');
const io = require('socket.io-client');
const fetch = require('node-fetch');

// replace address with the legit one later
const socket = io('http://localhost:8080');

fetch('http://localhost:8080/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-HTTP-Method-Override': 'GET'
  },
  credentials: 'same-origin',
  body: JSON.stringify({
    state: 1, cardUID: 1
  })
}).then(res => res.json()).then((users) => (
  users.reduce((map, user) => {
    map.set(user.cardUID, {
      state: user.state,
      id: user._id,
    });
    return map;
  }, new Map())
)).then(stateMap => main(stateMap));

function resetMap(stateMap) {
  Array.from(stateMap.keys()).forEach((key) => stateMap.get(key).state = true);
}

async function main(stateMap) {
  const ports = await serialport.list();
  const portInfo = ports.find(function detectArduino(info) {
    return new RegExp('Arduino').test(info.manufacturer);
  });
  const parser = new serialport.parsers.Readline('\n');
  const serial = new serialport(portInfo.comName, { baudRate: 9600 });

  console.log(portInfo);

  serial.pipe(parser);
  parser.on('data', async (rawData) => {
    const data = rawData.trim();
    console.log(data);
    
    if (!stateMap.has(data)) return serial.write('unknown\n');

    const mapData = stateMap.get(data);
    if (!mapData.state) return serial.write('reject\n');

    mapData.state = false;
    serial.write('accept\n');
    socket.emit('card read', mapData.id);
  });

  socket.on('reset', () => resetMap(stateMap));
};

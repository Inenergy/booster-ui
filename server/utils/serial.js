const Serial = require('serialport');
const { PORT, SEPARATORS } = require('../globals');
const EventEmitter = require('events');
const parse = require('./serialParser');

const emitter = new EventEmitter();
const serial = new Serial(PORT.name, { baudRate: PORT.baudRate });

serial.on('data', handleData);

let buffer = Buffer.from([]);

function handleData(buf) {
  if (buf.toString('ascii').startsWith('ok')) buf = buf.slice(2);
  idx = buf.indexOf(SEPARATORS);
  if (idx != -1) {
    buffer = Buffer.concat([buffer, buf.slice(0, idx)]);
    try {
      emitter.emit('data', parse(buffer));
    } catch (e) {
      console.error(e.message);
    }
    buffer = buf.slice(idx);
  } else {
    buffer = Buffer.concat([buffer, buf]);
  }
}

let commandQueue = [];
let portBusy = false;
let failedAttempts = 0;

function sendCommand(id, cmd) {
  const buf = Buffer.alloc(5);
  buf[0] = 40;
  buf[1] = id;
  try {
    buf[cmd > 2 ** 15 ? 'writeUint16BE' : 'writeInt16BE'](cmd, 2);
  } catch {
    console.error(`${id} value ${cmd} is out of range!!`);
  }
  buf[4] = buf[0] + buf[1] + buf[2] + buf[3];
  console.log('Pushing command to queue:', id, ':', cmd);
  commandQueue.push(buf);
  if (!portBusy) {
    portBusy = true;
    writeCommandFromQueue();
  }
}

function writeCommandFromQueue() {
  if (!commandQueue.length) {
    portBusy = false;
    return;
  }
  const cmd = commandQueue.shift();
  let startTx = Date.now();
  serial.write(cmd);
  serial.once('data', (buf) => {
    console.log('Recieved answer:', buf.slice(0, 2).toString('ascii'));
    if (!buf.toString('ascii').includes('ok')) {
      if (failedAttempts < 3) {
        commandQueue.unshift(cmd);
        failedAttempts++;
      }
    } else {
      failedAttempts = 0;
      serial.emit('command sent');
    }
    if (Date.now() - startTx < 200) {
      setTimeout(writeCommandFromQueue, 200);
    } else {
      writeCommandFromQueue();
    }
  });
}

function close() {
  subscribers = [];
  if (serial.isOpen) serial.close();
}

emitter.close = close;
emitter.sendCommand = sendCommand;

module.exports = emitter;

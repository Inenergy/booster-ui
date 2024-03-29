const EventEmitter = require('events');
const {
  SERIAL_DATA,
  PARAMS_DATA,
  STATE_DATA,
} = require('../../common/constants');
const { clone } = require('../../common/helpers');

const emitter = new EventEmitter();

let interval = setInterval(sendData, 1000);

const dataMap = clone(SERIAL_DATA);
for (const key in dataMap) dataMap[key].value = 0;
dataMap.boostMode.value = 1;
dataMap.start.value = 1;

delayStop();

function delayStop() {
  setTimeout(() => {
    dataMap.stopPressed.value = 1;
    dataMap.start.value = 0;
    delayStart();
  }, 5000);
}

function delayStart() {
  setTimeout(() => {
    dataMap.stopPressed.value = 0;
    dataMap.start.value = 1;
  }, 3000);
}

function sendData() {
  emitter.emit('data', generateData());
}

function generateData() {
  for (const key of ['FCVoltage', 'FCCurrent', 'FCPower', 'currentStabilizationTemp'])
    dataMap[key].value = +(Math.random() * 100).toFixed(1);
  dataMap.loadMode.value = 2;
  return dataMap;
}

emitter.sendCommand = (...cmd) => {
  buf = Buffer.alloc(3);
  buf[0] = cmd[0];
  try {
    buf[cmd[1] > 2 ** 15 ? 'writeUInt16BE' : 'writeInt16BE'](cmd[1], 1);
  } catch {
    console.error(`${cmd[0]} value ${cmd[1]} is out of range!!`);
  }
  console.log('Sending command to serial:', buf);
  emitter.emit('command sent');
};

emitter.close = () => {
  emitter.removeAllListeners;
  clearInterval(interval);
};

module.exports = emitter;

// TODO get rid of this conversion
emitter.convertToBytes = function convertToBytes(data) {
  const buffer = Buffer.alloc(PARAMS_DATA.length * 2 + STATE_DATA.length);
  let i = 0;
  for (; i < PARAMS_DATA.length * 2; i += 2) {
    buffer.writeInt16BE(data[PARAMS_DATA[i / 2].name].value, i);
  }
  for (let j = 0; j < STATE_DATA.length; ++j) {
    buffer.writeUInt8(data[STATE_DATA[j].name].value, i + j);
  }
  return buffer;
};

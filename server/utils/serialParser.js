const { SEPARATORS } = require('../globals');
const {
  PARAMS_DATA,
  SERIAL_DATA,
  DATA_BYTE_LENGTH,
  STATE_DATA,
} = require('../../common/constants');
const { clone } = require('../../common/helpers');
const configManager = require('./configManager');

const dataMap = clone(SERIAL_DATA);

function validate(buffer) {
  if (
    buffer.indexOf(SEPARATORS) != 0 ||
    buffer.length > DATA_BYTE_LENGTH ||
    buffer.length < DATA_BYTE_LENGTH - 1
  )
    throw new Error('Unexpected package length');
}

module.exports = function parse(buf) {
  validate(buf);
  let i = 0;
  let checkSum = 0;

  while (i < SEPARATORS.length) {
    checkSum += buf.readUInt16BE(i);
    i += 2;
  }

  for (let j = 0; j < PARAMS_DATA.length; j++) {
    const { name, divider = 1, signed } = PARAMS_DATA[j];
    let value = signed ? buf.readInt16BE(i) : buf.readUInt16BE(i);
    dataMap[name].value = +(value / divider).toPrecision(4);
    checkSum += value;
    i += 2;
  }

  const bufferMargin = buf.length - DATA_BYTE_LENGTH;
  for (let j = 0; j < STATE_DATA.length + bufferMargin; j++) {
    checkSum += buf[i];
    const divider = STATE_DATA[j].divider || 1;
    dataMap[STATE_DATA[j].name].value = buf[i++] / divider;
  }

  checkSum = checkSum % Math.pow(2, 16);
  if (checkSum != buf.readUInt16BE(i)) {
    throw new Error(
      `Check sums don't match calculated: ${checkSum}, recieved: ${buf.readUInt16BE(
        i
      )}`
    );
  }

  dataMap.start.value = dataMap.start.value !== 127;
  dataMap.fanCoeff.value = dataMap.fanCoeff.value == 17;
  dataMap.FCPower.value = +Math.abs(
    dataMap.FCCurrent.value * dataMap.FCVoltage.value
  ).toPrecision(4);
  const hydrogenConsumption = dataMap.hydrogenConsumption.value;
  dataMap.hydrogenConsumption.raw = hydrogenConsumption;
  const coefficients = configManager.getSettings().coefficients || [];
  dataMap.hydrogenConsumption.value = Math.round(
    coefficients.reduce((s, a, i) => s + a * hydrogenConsumption ** i, 0)
  );
  return dataMap;
};

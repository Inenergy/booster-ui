const { COMMANDS } = require('../../common/constants');

const removedEntries = [
  'startCalibration',
  'boostMode',
  'selectTemperatures',
  'stabilizationMode',
];

module.exports = Object.keys(COMMANDS).filter(
  (key) => !removedEntries.includes(key)
);

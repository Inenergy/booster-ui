const { COMMANDS } = require('../../common/constants');

const removedEntries = [
  'startCalibration',
  'boostMode',
  'stabilizationTemp',
  'selectTemperatures',
  'stabilizationMode',
];

module.exports = Object.keys(COMMANDS).filter(
  (key) => !removedEntries.includes(key)
);

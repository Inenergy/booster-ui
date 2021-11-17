const { COMMANDS } = require('../../common/constants');

const removedEntries = [
  'startCalibration',
  'boostMode',
  'stabilizationTemp',
  'selectTemperatures',
];

module.exports = Object.keys(COMMANDS).filter(
  (key) => !removedEntries.includes(key)
);

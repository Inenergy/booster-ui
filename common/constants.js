const STATE_DATA = [
  { label: 'purge delay', units: 's', name: 'blowDelay', prefix: 'P ' },
  { label: 'load mode', name: 'loadMode' },
  { label: 'temperature stabilization', name: 'boostMode' },
  {
    label: 'short circuit delay',
    units: 's',
    name: 'shortCircuitDelay',
  },
  {
    label: 'purge before short ciricuit',
    units: 's',
    name: 'blowBeforeShortCircuit',
  },
  { name: 'start' },
  { label: 'was purged', name: 'isBlow' },
  { label: 'was short-circuited', name: 'isShortCircuit' },
  { name: 'tempError' },
  { name: 'pressureError' },
  { name: 'voltageError' },
  { name: 'stopPressed' },
  { name: 'overheatError' },
  { name: 'shortCircuitAllowed', label: 'short circuit allowed' },
  { name: 'maxPressure', label: 'max pressure', divider: 100, units: 'bar' },
  { name: 'firstPurgeDelay', label: 'first purge delay', units: 's' },
  { name: 'firstPurgeCycles', label: 'first purge cycles' },
  { name: 'coeffP', label: 'P stabilization coefficient', divider: 100 },
  { name: 'coeffI', label: 'I stabilization coefficient', divider: 100 },
  { name: 'coeffD', label: 'D stabilization coefficient', divider: 100 },
  {
    name: 'currentStabilizationTemp',
    label: 'current stabilization temperature',
  },
  { name: 'stabilizationMode', label: 'stabilization mode' },
];

const PARAMS_DATA = [
  {
    label: 'purge duration',
    units: 'ms',
    name: 'blowDuration',
    prefix: 'P ',
  },
  { label: 'temperature 1', units: 'C', name: 'temp1', divider: 10 },
  { label: 'temperature 2', units: 'C', name: 'temp2', divider: 10 },
  { label: 'temperature 3', units: 'C', name: 'temp3', divider: 10 },
  { label: 'temperature 4', units: 'C', name: 'temp4', divider: 10 },
  { label: 'temperature 5', units: 'C', name: 'temp5', divider: 10 },
  {
    label: 'fan load',
    units: '%',
    name: 'fanLoad',
    divider: 10,
  },
  {
    label: 'stabilization temperature',
    units: '\u00b0C',
    name: 'stabilizationTemp',
    divider: 10,
  },
  {
    label: 'voltage',
    units: 'V',
    name: 'FCVoltage',
    divider: 100,
    signed: true,
  },
  {
    label: 'current',
    units: 'A',
    name: 'FCCurrent',
    divider: 100,
    signed: true,
  },
  {
    label: 'H2 pressure',
    units: 'bar',
    name: 'hydrogenPressure',
    divider: 1000,
  },
  { label: 'load', name: 'load', divider: 10 },
  {
    label: 'radiator T1',
    units: 'C',
    name: 'radiatorTemp1',
    divider: 10,
  },
  {
    label: 'radiator T2',
    units: 'C',
    name: 'radiatorTemp2',
    divider: 10,
  },
  { label: 'min fan RPM', units: '%', name: 'fanMinRPM', divider: 10 },
  {
    label: 'max temperature',
    units: 'C',
    name: 'maxTemp',
    divider: 10,
  },
  {
    label: 'min pressure',
    units: 'bar',
    name: 'minPressure',
    divider: 1000,
    signed: true,
  },
  {
    label: 'min voltage',
    units: 'V',
    name: 'minVoltage',
    signed: true,
    divider: 10,
  },
  {
    label: 'H2 consumption',
    units: 'ml/min',
    name: 'hydrogenConsumption',
    signed: true,
  },
  {
    label: 'short circuit duration',
    units: 'ms',
    name: 'shortCircuitDuration',
  },
  {
    label: 'NTC coefficient',
    name: 'tempSensorK',
  },
  {
    label: 'first purge duration',
    units: 'ms',
    name: 'firstPurgeDuration',
  },
];

const DATA_BYTE_LENGTH = STATE_DATA.length + PARAMS_DATA.length * 2 + 6; // last six bytes sent for validation

const COMMANDS = {
  loadMode: (v) => [4, v],
  boostMode: (v) => [8, v],
  blowDelay: (v) => [12, v],
  blowDuration: (v) => [16, v],
  fanLoad: (v) => [24, Math.round(v * 10)],
  stabilizationTemp: (v) => [28, v],
  load: (v) => [32, Math.round(v * 10)],
  fanMinRPM: (v) => [36, Math.round(v * 10)],
  maxTemp: (v) => [48, v * 10],
  minPressure: (v) => [52, Math.round(v * 1000)],
  minVoltage: (v) => [56, Math.round(v * 10)],
  startCalibration: () => [80, 0],
  shortCircuitDuration: (v) => [84, v],
  shortCircuitDelay: (v) => [88, v],
  shortCircuitAllowed: (v) => [92, v],
  firstPurgeDuration: (v) => [96, v],
  firstPurgeDelay: (v) => [100, v],
  firstPurgeCycles: (v) => [104, v],
  maxPressure: (v) => [108, Math.round(v * 100)],
  tempSensorK: (v) => [112, v],
  coeffP: (v) => [116, 100 * v],
  coeffI: (v) => [120, 100 * v],
  coeffD: (v) => [124, 100 * v],
  stabilizationMode: (v) => [132, v],
  selectTemperatures: (v) => [136, v],
};

const CONSTRAINTS = {
  blowDelay: [1, 200],
  blowDuration: [20, 10000],
  fanLoad: [0, 100],
  current: [0, 100],
  voltage: [0, 100],
  power: [10, 1500],
  fanMinRPM: [0, 100],
  fanMaxVoltage: [3, 13],
  maxTemp: [-10, 100],
  minPressure: [-1, 4],
  minVoltage: [-10, 100],
  shortCircuitDuration: [10, 50000],
  shortCircuitDelay: [0, 100],
  firstPurgeDuration: [0, 60000],
  firstPurgeDelay: [0, 250],
  firstPurgeCycles: [0, 250],
  maxPressure: [0, 2],
  tempSensorK: [1000, 5000],
  coeffP: [0, 2.5],
  coeffI: [0, 2.5],
  coeffD: [0, 2.5],
  stabilizationTemp: [20, 80],
};

const STEPS = {
  blowDelay: 1,
  blowDuration: 10,
  fanLoad: 0.5,
  stabilizationTemp: 1,
  current: 0.1,
  voltage: 0.1,
  power: 1,
  load: 0.1,
  fanMinRPM: 0.5,
  fanMaxVoltage: 0.1,
  maxTemp: 1,
  minPressure: 0.05,
  minVoltage: 0.1,
  startCurrent: 0.1,
  currentStep: 0.1,
  endCurrent: 0.1,
  timeStep: 1,
  shortCircuitDelay: 1,
  shortCircuitDuration: 1,
  firstPurgeDuration: 10,
  firstPurgeDelay: 1,
  firstPurgeCycles: 1,
  maxPressure: 0.01,
  tempSensorK: 1,
  coeffP: 0.05,
  coeffI: 0.05,
  coeffD: 0.05,
};

const LOGGED_VALUES = [
  'load',
  'FCCurrent',
  'FCVoltage',
  'FCPower',
  'hydrogenPressure',
  'hydrogenConsumption',
  'temp1',
  'temp2',
  'temp3',
  'temp4',
  'temp5',
  'blowDuration',
  'blowDelay',
  'shortCircuitDuration',
  'shortCircuitDelay',
  'isBlow',
  'isShortCircuit',
];

const ALGORITHM_PARAM = [
  { value: 'none', label: 'load disabled' },
  { value: 'current', label: 'current', units: 'A' },
  { value: 'voltage', label: 'voltage', units: 'V' },
  { value: 'blowDuration', label: 'purge duration', units: 'ms' },
  { value: 'blowDelay', label: 'purge delay', units: 's' },
  { value: 'fanLoad', label: 'fan load', units: '%' },
];

const SERIAL_DATA = {
  FCPower: { label: 'power', units: 'W' },
};

PARAMS_DATA.forEach(addParamToMap);
STATE_DATA.forEach(addParamToMap);

function addParamToMap(param) {
  SERIAL_DATA[param.name] = param;
}

const SIGNALS = {
  tempError: 'High temperature, stop\n',
  pressureError: 'Low pressure, stop\n',
  voltageError: 'Low voltage, stop\n',
  stopPressed: 'Reset all prameters\n',
  overheatError: 'Overheat, stop\n',
};

const BOOST_MODES = ['manual fan', 'auto fan', 'manual temp', 'auto temp'];

const ALGORITHM_DIRECTIONS = [
  { label: '', value: 'up', icon: '&#xe809;' },
  { label: '', value: 'down', icon: '&#xe807;' },
  { label: '', value: 'downup', icon: '&#xe808;' },
  { label: '', value: 'updown', icon: '&#xe800;' },
  { label: '', value: 'hold', icon: '&#xe804;' },
];

const LOAD_MODES = ['none', 'voltage', 'current'];

module.exports = {
  COMMANDS,
  PARAMS_DATA,
  STATE_DATA,
  DATA_BYTE_LENGTH,
  CONSTRAINTS,
  STEPS,
  LOGGED_VALUES,
  SERIAL_DATA,
  SIGNALS,
  BOOST_MODES,
  ALGORITHM_PARAM,
  ALGORITHM_DIRECTIONS,
  LOAD_MODES,
};

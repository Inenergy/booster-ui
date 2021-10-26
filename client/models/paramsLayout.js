module.exports = [
  [
    {
      title: 'fuel cell',
      values: [
        { name: 'FCVoltage', minCompare: 'minVoltage' },
        { name: 'FCCurrent' },
        { name: 'FCPower' },
        { name: 'hydrogenPressure', minCompare: 'minPressure' },
        { name: 'hydrogenConsumption' },
      ],
    },
    {
      title: 'valve',
      inputs: [
        'blowDelay',
        'blowDuration',
        'firstPurgeDuration',
        'firstPurgeDelay',
        'firstPurgeCycles',
      ],
    },
  ],
  [
    {
      inputs: [
        'maxTemp',
        'minPressure',
        'maxPressure',
        'minVoltage',
        'shortCircuitDuration',
        'shortCircuitDelay',
      ],
      checkboxes: ['shortCircuitAllowed'],
    },
    {
      title: 'fan',
      inputs: ['fanMinRPM', 'fanLoad'],
    },
  ],
  [
    {
      title: 'temperatures',
      values: [
        { name: 'temp1', maxCompare: 'maxTemp' },
        { name: 'temp2', maxCompare: 'maxTemp' },
        { name: 'radiatorTemp1' },
      ],
      inputs: ['tempSensorK'],
    },
  ],
];

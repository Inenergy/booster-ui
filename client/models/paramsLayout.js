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
  ],
  [
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
    {
      title: 'fan',
      inputs: ['fanMinRPM', 'fanLoad'],
    },
  ],
  [
    {
      title: 'temperatures',
      values: [{ name: 'radiatorTemp1' }, { name: 'radiatorTemp2' }],
      inputs: [
        'stabilizationTemp',
        'coeffP',
        'coeffI',
        'coeffD',
        'tempSensorK',
      ],
    },
  ],
];

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
      selects: [
        {
          name: 'stabilizationMode',
          options: [
            { value: 1, label: 'stabilize max' },
            { value: 2, label: 'stabilize mid' },
            { value: 3, label: 'stabilize off' },
          ],
        },
      ],
      values: [
        { name: 'currentStabilizationTemp' },
        { name: 'temp1', maxCompare: 'maxTemp' },
        { name: 'temp2', maxCompare: 'maxTemp' },
        { name: 'temp3', maxCompare: 'maxTemp' },
        { name: 'temp4', maxCompare: 'maxTemp' },
        { name: 'temp5', maxCompare: 'maxTemp' },
        { name: 'radiatorTemp1' },
        { name: 'radiatorTemp2' },
      ],
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

<script>
  import Select from '../molecules/Select.svelte';
  import Value from '../atoms/Value.svelte';
  import { serialData } from '../stores';
  import wsClient from '../utils/wsClient';
  import { __ } from '../utils/translator';
  import { COMMANDS } from '../../common/constants';

  let selectedTemps = 0;
  const stabilizationModes = [
    { value: 1, label: 'stabilize max' },
    { value: 2, label: 'stabilize selected' },
    { value: 3, label: 'stabilize off' },
  ];
  const temps = [1, 2, 3, 4, 5].map((i) => 'temp' + i);
  const initialData = $serialData;

  function setStabilizationMode(value, name) {
    wsClient.emit('serial command', ...COMMANDS[name](+value));
  }

  function toggleTempSelection(e) {
    const bit = +e.target.value.slice(-1) - 1;
    const addition = 2 ** bit;
    selectedTemps += e.target.checked ? addition : -addition;
    wsClient.emit(
      'serial command',
      ...COMMANDS.selectTemperatures(selectedTemps)
    );
  }
</script>

<Select
  label={$__('stabilization mode')}
  name="stabilizationMode"
  options={stabilizationModes}
  value={$serialData.stabilizationMode.value}
  onChange={setStabilizationMode}
/>
{#each temps as temp}
  <Value value={$serialData[temp].value} label={$__(initialData[temp].label)}>
    <input
      type="checkbox"
      name="temperatures"
      value={temp}
      on:change={toggleTempSelection}
    />
  </Value>
{/each}

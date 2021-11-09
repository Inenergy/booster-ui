<script>
  import { __ } from '../utils/translator';
  import { STEPS, COMMANDS, CONSTRAINTS } from '../../common/constants';
  import loadModes from '../models/loadModeOptions';
  import wsClient from '../utils/wsClient';
  import { serialData } from '../stores';

  let mode = $serialData.loadMode.value;
  let loadValues = [$serialData.load.value, 0, 0];
  loadValues[mode] = $serialData.load.value;

  function setLoadMode(e) {
    const { value, checked } = e.currentTarget;
    mode = +value;
    if (checked) {
      wsClient.emit('serial command', ...COMMANDS.loadMode(mode));
      if (mode != 0) sendLoadValue();
    }
  }

  function sendLoadValue() {
    wsClient.emit('serial command', ...COMMANDS.load(loadValues[mode]));
  }

  function setLoadValue(loadMode, e) {
    let value = e.target.value;
    value = parseFloat(value) || 0;
    loadValues[loadMode] = value;
    if (loadMode == mode) {
      sendLoadValue();
    }
  }
</script>

{#each loadModes as mode}
  <div>
    <label>
      <input
        type="radio"
        on:change={setLoadMode}
        name="loadMode"
        value={mode.value}
        checked={mode.value == $serialData.loadMode.value}
      />
      <span class="label">
        {$__(mode.label)}
      </span>
    </label>
    {#if mode.value}
      <input
        name={mode.name}
        type="number"
        min={CONSTRAINTS[mode.name][0]}
        max={CONSTRAINTS[mode.name][1]}
        step={STEPS.load}
        on:change={(e) => setLoadValue(mode.value, e)}
        bind:value={loadValues[mode.value]}
      />
    {:else}
      <strong>{$serialData.load.value}</strong>
    {/if}
  </div>
{/each}

<style>
  strong {
    font-weight: 500;
    font-size: 2rem;
  }
  div {
    display: flex;
    margin-bottom: 1.2rem;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
  }
  input {
    width: 8rem;
  }
  input[type='radio'] {
    vertical-align: middle;
    width: auto;
  }
</style>

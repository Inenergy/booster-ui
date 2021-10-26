<script>
  import { __ } from '../utils/translator';
  import { STEPS, COMMANDS, CONSTRAINTS } from '../../common/constants';
  import loadModes from '../models/loadModeOptions';
  import wsClient from '../utils/wsClient';
  import { serialData } from '../stores';

  let loadValues = [$serialData.load.value, 0, 0];
  loadValues[$serialData.loadMode.value] = $serialData.load.value;

  function setLoadMode(e) {
    const { value: mode, checked } = e.currentTarget;
    if (checked) {
      wsClient.emit('serial command', ...COMMANDS.loadMode(+mode));
      if (mode != 0)
        wsClient.emit('serial command', ...COMMANDS.load(loadValues[mode]));
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
        bind:value={loadValues[mode.value]}
      />
    {:else}
      <input readonly value={loadValues[0]} />
    {/if}
  </div>
{/each}

<style>
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

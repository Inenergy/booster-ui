<script>
  import blocks from '../models/paramsLayout';
  import { COMMANDS, STEPS, CONSTRAINTS } from '../../common/constants';
  import { serialData, logExists } from '../stores';
  import LoadModeSelector from '../organisms/LoadModeSelector.svelte';
  import Select from '../molecules/ControledSelect.svelte';
  import Value from '../atoms/Value.svelte';
  import RangeInput from '../molecules/RangeInput.svelte';
  import wsClient from '../utils/wsClient';
  import { __ } from '../utils/translator';
  import ElapsedTimer from '../molecules/ElapsedTimer.svelte';
  import Checkbox from '../molecules/Checkbox.svelte';
  import StabilizationModeSelector from '../organisms/StabilizationModeSelector.svelte';

  const initialData = $serialData;
  let fanCoeff;

  const disabledOnStart = [
    'boostMode',
    'maxTemp',
    'minPressure',
    'minVoltage',
    'startCurrent',
    'currentStep',
    'endCurrent',
    'timeStep',
    'maxPressure',
  ];

  function sendCommand(value, name) {
    wsClient.emit('serial command', ...COMMANDS[name](+value));
  }

  function setFanCoeff(value) {
    fanCoeff = value;
    wsClient.emit('serial command', ...COMMANDS.fanCoeff(+value));
  }
</script>

<div class="layout" id="parameters">
  {#each blocks as column, idx}
    <div class="col-{idx}">
      {#if idx === 1}
        <h3>{$__('load')}</h3>
        <LoadModeSelector />
      {/if}
      {#each column as block}
        <h3>
          {#if block.title}{$__(block.title)}{/if}
        </h3>
        {#if block.selects}
          {#each block.selects as { name, options }}
            <Select
              {options}
              {name}
              onChange={sendCommand}
              value={$serialData[name].value}
              label={$__(initialData[name].label)} />
          {/each}
        {/if}
        {#if block.inputs}
          {#each block.inputs as name}
            <RangeInput
              disabled={$serialData.start.value && disabledOnStart.includes(name)}
              step={STEPS[name]}
              range={CONSTRAINTS[name]}
              currentValue={$serialData[name].value}
              label={$__(initialData[name].label)}
              units={$__(initialData[name].units, true)}
              {name}
              onChange={sendCommand}>
              {#if name == 'stabilizationTemp'}
                <span class="input-prefix">
                  {$serialData.currentStabilizationTemp.value}/
                </span>
              {/if}
            </RangeInput>
          {/each}
        {/if}
        {#if block.checkboxes}
          {#each block.checkboxes as name}
            <Checkbox
              disabled={$serialData.start.value && disabledOnStart.includes(name)}
              checked={$serialData[name].value}
              label={$__(initialData[name].label)}
              {name}
              onChange={sendCommand} />
          {/each}
        {/if}
        {#if block.values}
          {#each block.values as val}
            <Value
              error={val.maxCompare ? $serialData[val.maxCompare].value < $serialData[val.name].value : val.minCompare ? $serialData[val.minCompare].value > $serialData[val.name].value : false}
              units={$__(initialData[val.name].units, true)}
              value={$serialData[val.name].value}
              label={$__(initialData[val.name].label)} />
          {/each}
        {/if}
      {/each}
      {#if idx == 0}
        <ElapsedTimer />
        <a href={$logExists ? './log' : void 0}>{$__('get log')}</a>
      {:else if idx == 1}
        {#if $serialData.fanCoeff.value}
          <RangeInput
            disabled={$serialData.start.value && disabledOnStart.includes('fanCoeff')}
            step={STEPS.fanCoeff}
            range={CONSTRAINTS.fanCoeff}
            label={$__(initialData.fanCoeff.label)}
            name="fanCoeff"
            currentValue={fanCoeff}
            onChange={setFanCoeff} />
        {/if}
      {:else if idx == 2}
        <StabilizationModeSelector />
      {/if}
    </div>
  {/each}
</div>

<style>
  .layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 24px;
    padding: 0 24px 2rem;
    height: 100vh;
  }

  .input-prefix {
    margin-left: auto;
    display: inline-block;
    text-align: right;
    font-weight: 500;
    min-width: 5rem;
    font-size: 2rem;
  }
  .hint {
    display: block;
    font-size: 1rem;
  }
  h3 {
    margin-top: 2.4rem;
    margin-bottom: 1.2rem;
  }
  .col-0 {
    grid-column: 1 / 2;
  }
  .col-1 {
    grid-column: 2 / 3;
  }

  .col-0 :global(.calibrate) {
    width: 100%;
  }
  .col-2 {
    grid-column: 3 / 4;
  }
  .input-placeholder {
    height: 3.2rem;
    margin-bottom: 1.2rem;
  }
  .stop,
  .pause {
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
  }
  .pause {
    border-left: 0.3rem solid white;
    border-right: 0.3rem solid white;
  }
  .stop {
    background-color: white;
  }
  .play {
    display: inline-block;
    border-left: 1.4rem solid white;
    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
  }
</style>

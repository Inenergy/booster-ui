<script>
  import {
    ALGORITHM_PARAM,
    ALGORITHM_DIRECTIONS,
    CONSTRAINTS,
    STEPS,
  } from '../../common/constants';
  import Button from '../atoms/Button.svelte';
  import Icon from '../atoms/Icon.svelte';
  import { __ } from '../utils/translator';
  import { algorithm } from '../stores';
  import Select from '../molecules/Select.svelte';
  import Input from '../molecules/GenericInput.svelte';
  import ScriptExecutionControls from '../organisms/ScriptExecutionControls.svelte';
  import { decimalAdjust } from '../../common/helpers';
  let algorithmChanged;

  let algorithmCopy = $algorithm;
  const initialAlgorithm = JSON.stringify(algorithmCopy);

  $: isValidAlgorithm = isValid(algorithmCopy);
  $: algorithmChanged = JSON.stringify(algorithmCopy) !== initialAlgorithm;

  function isValid(script) {
    if (script.length < 1) return false;
    for (let step of script) {
      if (step.direction === 'hold') {
        if (!areAllDefined(step, ['param', 'min', 'stepTime'])) return false;
      } else if (
        !areAllDefined(step, [
          'param',
          'min',
          'max',
          'loop',
          'step',
          'stepTime',
        ]) ||
        step.max <= step.min ||
        step.step > step.max - step.min
      )
        return false;
    }
    return true;
  }

  function areAllDefined(obj, keys) {
    for (let key of keys) {
      if (obj[key] === undefined) return false;
    }
    return true;
  }

  function addStep() {
    algorithmCopy = algorithmCopy.concat({
      param: ALGORITHM_PARAM[0].value,
      direction: ALGORITHM_DIRECTIONS[0].value,
    });
    console.log(algorithmCopy);
  }
  function saveChanges() {
    algorithm.set(algorithmCopy);
  }
  function updateAlgorithm(value, name) {
    const [param, i] = name.split('-');
    algorithmCopy[i][param] = value;
    algorithmCopy = algorithmCopy;
  }
  let isEditorBlocked;
  function blockEditor(doBlock) {
    isEditorBlocked = doBlock;
  }
  const deleteStep = (stepToDelete) =>
    function desctructor() {
      algorithmCopy = algorithmCopy.filter((_, i) => i !== stepToDelete);
    };

  $: saveDisabled = !isValidAlgorithm || !algorithmChanged || isEditorBlocked;
</script>

<div class="layout" id="script">
  <div class="table-wrapper">
    {#if isEditorBlocked}
      <div class="editor-blocker" />
    {/if}
    <table>
      <thead>
        <th>{$__('param')}</th>
        <th>{$__('direction')}</th>
        <th>{$__('min')}</th>
        <th>{$__('max')}</th>
        <th>{$__('loops')}</th>
        <th>{$__('step')}</th>
        <th>{$__('time step')}</th>
        <th class="row-controls" />
      </thead>
      {#each algorithmCopy as step, i}
        <tr>
          <td>
            <Select
              onChange={updateAlgorithm}
              name={`param-${i}`}
              defaultValue={step.param}
              options={ALGORITHM_PARAM}
              standalone={false}
            />
          </td>
          <td>
            <Select
              standalone={false}
              onChange={updateAlgorithm}
              name={`direction-${i}`}
              options={ALGORITHM_DIRECTIONS}
              defaultValue={step.direction}
            />
          </td>
          <td
            ><Input
              onChange={updateAlgorithm}
              type="number"
              bind:value={step.min}
              name={`min-${i}`}
              range={CONSTRAINTS[step.param]}
              step={STEPS[step.param]}
            /></td
          >
          {#if step.direction === 'hold'}
            <td class="spacer" />
            <td class="spacer" />
            <td class="spacer" />
          {:else}
            <td>
              <Input
                onChange={updateAlgorithm}
                type="number"
                bind:value={step.max}
                name={`max-${i}`}
                range={CONSTRAINTS[step.param]}
                step={STEPS[step.param]}
              /></td
            >
            <td>
              <Input
                onChange={updateAlgorithm}
                type="number"
                bind:value={step.loop}
                name={`loop-${i}`}
                range={[1, 100]}
              /></td
            >
            <td>
              <Input
                onChange={updateAlgorithm}
                type="number"
                bind:value={step.step}
                name={`step-${i}`}
                range={[
                  STEPS[step.param],
                  decimalAdjust('round', Math.abs(step.max - step.min), -1),
                ]}
                step={STEPS[step.param]}
              /></td
            >
          {/if}
          <td>
            <Input
              onChange={updateAlgorithm}
              type="number"
              bind:value={step.stepTime}
              range={[1, Number.MAX_SAFE_INTEGER]}
              name={`stepTime-${i}`}
            />
          </td>
          <td>
            <Icon interactive icon="trash" on:click={deleteStep(i)} />
          </td>
        </tr>
      {/each}
    </table>
  </div>
  <div class="controls">
    <div class="execute-controls">
      <ScriptExecutionControls
        onExecute={blockEditor}
        disabled={!isValidAlgorithm}
        algorithm={algorithmCopy}
      />
    </div>
    <div class="script-controls">
      <Button on:click={addStep} disabled={isEditorBlocked}>{$__('add')}</Button
      >
      <Button on:click={saveChanges} disabled={saveDisabled}
        >{$__('save')}</Button
      >
    </div>
  </div>
</div>

<style>
  .row-controls {
    width: 3rem;
  }
  .controls {
    text-align: right;
    margin-top: auto;
    display: flex;
    justify-content: space-between;
  }
  .layout {
    padding: 5rem 2.4rem 2.4rem;
    display: flex;
    flex-direction: column;
  }
  table {
    width: 100%;
    table-layout: fixed;
  }
  th {
    font: 1.8rem 'Oswald';
  }
  .table-wrapper {
    position: relative;
  }
  .editor-blocker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>

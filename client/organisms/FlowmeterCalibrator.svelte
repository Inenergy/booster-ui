<script>
  import Modal from '../molecules/Modal.svelte';
  import Button from '../atoms/Button.svelte';
  import Input from '../molecules/GenericInput.svelte';
  import { __ } from '../utils/translator';
  import { serialData, settings } from '../stores';
  import { approximate } from '../utils/polynomialApproximator';
  import { onDestroy } from 'svelte';
  import Value from '../atoms/Value.svelte';

  onDestroy(() => clearTimeout(timeout));

  let points = [];

  let showCalibrationModal,
    calibrateMessage,
    timeout,
    isError,
    currentPoint = 0;

  const closeModal = () => (showCalibrationModal = false);

  const addCurrentPoint = () => {
    points = points.concat({
      x: $serialData.hydrogenConsumption.raw,
      y: currentPoint,
    });
  };

  function startCalibration() {
    showCalibrationModal = true;
  }
  function setConsumptionCoefficiets() {
    try {
      console.log(points);
      const coefficients = approximate(points, 4);
      settings.update((s) => {
        s.coefficients = coefficients;
        return s;
      });
      calibrateMessage = $__('calibration done');
    } catch (err) {
      calibrateMessage = $__('calibration failed');
      console.error(err);
      isError = true;
    } finally {
      timeout = setTimeout(clearSelf, 1500);
    }
  }

  function clearSelf() {
    points = [];
    isError = false;
    calibrateMessage = '';
    currentPoint = 0;
    showCalibrationModal = false;
  }
</script>

<Button on:click={startCalibration}>{$__('calibrate flowmeter')}</Button>
{#if showCalibrationModal}
  <Modal onDismiss={closeModal}>
    {#if calibrateMessage}
      <h2 class:error={isError}>
        <span class="message">{calibrateMessage}</span>
      </h2>
    {:else}
      <h3>{$__('calibration')}</h3>
      <h5>{$__('please add at least five values of consumption')}</h5>
      <Input
        type="number"
        label={$__('H2 consumption')}
        value={currentPoint}
        onChange={(v) => (currentPoint = v)}
        range={[0, 10000]}
      />
      <Value
        value={$serialData.hydrogenConsumption.raw}
        label={$__('current ADC readings')}
      />
      <div class="controls">
        <Button on:click={addCurrentPoint}>{$__('add point')}</Button>
        <Button
          on:click={() => (points = [])}
          type="outline"
          disabled={!points.length}>{$__('clear points')}</Button
        >
      </div>
      <p>
        {$__('added points:')}
        {#each points as p}
          <strong class="point">{' ' + p.y}</strong>
        {/each}
      </p>
      <div class="footer">
        <Button
          on:click={setConsumptionCoefficiets}
          disabled={points.length < 5}
          title={points.length < 5
            ? $__('please add more points')
            : $__('calibrate flowmeter')}>{$__('calibrate')}</Button
        >
        <Button on:click={closeModal} type="outline">{$__('cancel')}</Button>
      </div>
    {/if}
  </Modal>
{/if}

<style>
  h2 {
    height: 100%;
    display: flex;
  }
  .message {
    margin: auto;
  }
  h2.error {
    color: var(--danger-color);
  }
  h3 {
    margin-bottom: 1.2rem;
  }
  h5 {
    font-weight: 700;
    text-align: left;
    margin-bottom: 1.2rem;
  }
  .footer {
    text-align: right;
  }
</style>

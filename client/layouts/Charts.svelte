<script>
  import RadioGroup from '../molecules/RadioGroup.svelte';
  import Chart from 'chart.js';
  import 'chartjs-plugin-zoom';
  import { config, axesGroup } from './chart.config';
  import { onMount, onDestroy } from 'svelte';
  import pointsStorage from '../utils/pointsStorage';
  import { serialData } from '../stores';
  import { __ } from '../utils/translator';

  onMount(() => {
    chart = new Chart(
      document.getElementById('chart').getContext('2d'),
      config
    );
    chart.data.datasets[0].data = pointsStorage.points;
    chart.options.scales.xAxes[0].scaleLabel.labelString =
      axesGroup.elements[selectedAxes].xLabel;
    chart.options.scales.yAxes[0].scaleLabel.labelString =
      axesGroup.elements[selectedAxes].yLabel;
    chart.options.onClick = chart.resetZoom;
  });

  onDestroy(() => chart && chart.destory());

  const dataEntries = ['FCVoltage', 'FCCurrent', 'FCPower'];

  let chart,
    selectedAxes = 0,
    unsubscribeStopMonitor,
    unsubscribeStartMonitor = serialData.subscribe(monitorStart),
    timeStart;

  function changeAxes(e) {
    selectedAxes = +e.target.value;

    const axes = axesGroup.elements[selectedAxes];

    chart.options.scales.xAxes[0].scaleLabel.labelString = axes.xLabel;
    chart.options.scales.yAxes[0].scaleLabel.labelString = axes.yLabel;

    pointsStorage.setX(dataEntries.indexOf(axes.xKey) + 1);
    pointsStorage.setY(dataEntries.indexOf(axes.yKey) + 1);

    chart.data.datasets[0].data = pointsStorage.points;

    chart.update();
  }

  function stopDrawing() {
    unsubscribeStopMonitor();
    unsubscribeStartMonitor = serialData.subscribe(monitorStart);
  }

  function startDrawing() {
    unsubscribeStartMonitor();
    pointsStorage.drain();
    timeStart = Date.now();
    chart.data.datasets[0].data = pointsStorage.points;
    unsubscribeStopMonitor = serialData.subscribe(handleData);
  }

  function monitorStart(data) {
    if (data.start.value && chart) {
      startDrawing();
    }
  }

  function handleData(data) {
    if (!data.start.value && chart) {
      stopDrawing();
      return;
    }
    pointsStorage.addRow(
      [Math.round((Date.now() - timeStart) / 1000)].concat(
        dataEntries.map((key) => data[key].value)
      )
    );
    chart.data.datasets[0].data = pointsStorage.points;
    chart.update();
  }
</script>

<div class="layout" id="charts">
  <h2>{$__('charts')}</h2>
  <RadioGroup
    style="grid-column: 1 / 3"
    type="horizontal"
    group={axesGroup}
    on:change={changeAxes}
    value={selectedAxes}
  />
  <div class="chart">
    <canvas id="chart" />
  </div>
</div>

<style>
  .layout {
    display: grid;
    padding: 0 24px;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 24px;
    height: 100vh;
    align-items: center;
  }
  h2 {
    grid-column: 1 / 4;
  }
  .chart {
    grid-column: 1 / 4;
    justify-self: stretch;
  }
</style>

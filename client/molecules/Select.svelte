<script>
  import { __ } from '../utils/translator';
  export let options = [];
  export let name = '';
  export let label = '';
  export let standalone = true;
  export let onChange = Function.prototype;
  let value = '';
  export { value as defaultValue };
</script>

{#if label}
  <div class="label">{$__(label)}</div>
{/if}
<select
  bind:value
  {name}
  on:change={(e) => onChange(value, name)}
  class:standalone
>
  {#each options as { value, label, icon, units }}
    <option {value}>{@html icon || ''}{$__(label) || ''}{units ? ', ' + $__(units) : ''}</option>
  {/each}
</select>

<style>
  div {
    margin-bottom: 0.8rem;
  }
  select {
    width: 100%;
    font-size: 2rem;
    line-height: 3.2rem;
    border-radius: 0.4rem;
    height: 3.2rem;
    font-family: 'boost-block', sans-serif;
  }
  select.standalone {
    margin-bottom: 1.2rem;
  }
</style>

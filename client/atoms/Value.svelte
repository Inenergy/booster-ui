<script>
  import Exclamation from './Exclamation.svelte';
  export let value = 0;
  export let label = '';
  export let units = '';
  export let error;
</script>

<div class="wrap" class:error>
  <div class="label">
    {@html label}
    {#if units}
      ,
      <em>
        {@html units}
      </em>
    {/if}
  </div>
  <div class="value">
    <strong>{value}</strong>
  </div>
  {#if error}
    <Exclamation />
  {:else}
    <div class="spacer" />
  {/if}
  <slot />
</div>

<style>
  .wrap {
    display: flex;
    /* flex-wrap: wrap; */
    align-items: center;
    margin-bottom: 1.6rem;
  }
  .value {
    min-width: 7rem;
    margin-left: auto;
    text-align: right;
  }
  .error {
    color: var(--danger-color);
  }
  strong {
    font-weight: 500;
    font-size: 2rem;
  }
  .spacer {
    width: 2rem;
    min-width: 2rem;
    height: 2rem;
  }
</style>

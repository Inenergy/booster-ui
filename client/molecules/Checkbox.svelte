<script>
  export let style = '';
  export let label = '';
  export let name;
  export let onChange = Function.prototype;
  export let checked = false;
  export let disabled = false;
</script>

<label {style}>
  {#if label}
    <span class="label">
      {label}
    </span>
  {/if}
  <input
    type="checkbox"
    readonly
    {disabled}
    {name}
    {checked}
    on:change={(e) => onChange(e.target.checked, name)}
  />
</label>

<style>
  label {
    display: flex;
    margin-bottom: 1.2rem;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
  }
  .label {
    margin-bottom: 0.8rem;
  }
</style>
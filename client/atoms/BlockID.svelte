<script>
  import { settings, serialData } from '../stores';
  import { zeroPad } from '../../common/helpers';
</script>

<div>#{zeroPad($settings.id, 2)}</div>

<style>
  div {
    position: absolute;
    bottom: 0.8rem;
    right: 1.6rem;
    font-size: 2rem;
    font-family: 'Oswald';
    color: var(--corporate-grey-darken);
  }
</style>

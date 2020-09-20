<style>
  .container {
    display: flex;
    max-height: 128px;
    max-width: 512px;
    margin: 4px;
    cursor: pointer;
  }

  .information {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding-left: 8px;
  }

  .title {
    font-weight: bold;
  }

  .description {
    font-size: 0.8rem;
  }
</style>

<script lang="ts">
  export let title: string
  export let description: string
  export let thumbnail: string
  export let onItemClick: () => void
</script>

<div class="container" on:click={onItemClick}>
  <img src={thumbnail} class="thumbnail" alt="thumbnail" />
  <span class="information">
    <span class="title"> {title} </span>
    <span class="description"> {description} </span>
  </span>
</div>

<style>
  .searchResults {
    margin: 0 auto;
    max-height: 500px;
    overflow-y: scroll;
    max-width: 512px;
  }
</style>

<script lang="ts">
  import type { YoutubeResultType } from '../types/YoutubeResult.type'
  import ListItem from './ListItem.svelte'

  export let onItemClick: (option: YoutubeResultType) => void
  export let results: YoutubeResultType[] = []
</script>

<div class="searchResults">
  {#each results as result}
    <ListItem
      onItemClick={() => onItemClick(result)}
      description={result.snippet.description}
      title={result.snippet.title}
      thumbnail={result.snippet.thumbnails.default.url}
    />
  {/each}
</div>

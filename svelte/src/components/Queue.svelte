<script lang="ts">
  import ListItem from './ListItem.svelte'
  import { YoutubeResultType } from '../types/YoutubeResult.type'
  export let queue: YoutubeResultType[] = []
</script>

<div class="queue">
  {#each queue as item}
    <ListItem
      thumbnail={item.snippet.thumbnails.default.url}
      title={item.snippet.title}
      description={item.snippet.description}
      {onItemClick}
    />
  {/each}
</div>

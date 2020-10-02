<script lang="ts">
  import ListItem from './ListItem.svelte'
  import type { YoutubeResultType } from '../types/YoutubeResult.type'
  import YouTubeFrameService from '../services/YouTubeFrameService'
  import { getContext } from 'svelte'
  import RootStore from '../model/RootStore'
  import { connect } from 'svelte-mobx'

  // Get Store from context
  const { getStore } = getContext('store')
  const store: RootStore = getStore()

  const { autorun } = connect()

  let queue: YoutubeResultType[]

  // Update queue when update occurs
  $: autorun(() => {
    queue = store.queueStore.queue.slice()
  })

  const onItemClick = (option: YoutubeResultType) => {
    YouTubeFrameService.getYoutubeFrame().loadVideoById(option.id.videoId)
    store.queueStore.removeFromQueue(option)
  }
</script>

<div class="queue">
  {#each queue as item}
    <ListItem
      thumbnail={item.snippet.thumbnails.default.url}
      title={item.snippet.title}
      description={item.snippet.description}
      onItemClick={() => onItemClick(item)}
    />
  {/each}
</div>

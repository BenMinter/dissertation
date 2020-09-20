<script lang="ts">
  import { onMount, beforeUpdate } from 'svelte'
  import type { YouTubePlayer } from 'youtube-player/dist/types'
  import YouTube from 'youtube-player'

  export let videoId: String = ''

  let player: YouTubePlayer

  onMount(() => {
    player = YouTube('video-player')
  })

  beforeUpdate(() => {
    if (videoId) {
      player.loadVideoById(videoId)
    }
  })
</script>

<div id="video-player" />

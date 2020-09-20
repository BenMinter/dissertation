<script lang="ts">
  import { onMount } from 'svelte'
  import YouTubePlayer from 'youtube-player'

  let player: YouTubePlayer

  onMount(() => {
    player = YouTubePlayer('video-player')
  })
</script>

<div id="video-player" />

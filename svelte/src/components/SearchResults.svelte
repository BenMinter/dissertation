<style>
  .searchResults {
    margin: 0 auto;
    max-height: 500px;
    overflow-y: scroll;
    max-width: 512px;
  }

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
  import type { YoutubeResultType } from '../types/YoutubeResult.type'
  export let onItemClick: (videoId: String) => void
  export let results: YoutubeResultType[] = []
</script>

<div class="searchResults">
  {#each results as result}
    <div class="container" on:click={onItemClick(result.id.videoId)}>
      <img
        src={result.snippet.thumbnails.default.url}
        class="thumbnail"
        alt="thumbnail"
      />
      <span class="information">
        <span class="title"> {result.snippet.title} </span>
        <span class="description"> {result.snippet.description} </span>
      </span>
    </div>
  {/each}
</div>

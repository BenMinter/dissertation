<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script lang="ts">
  import YouTubePlayer from './components/YouTubePlayer.svelte'
  import SearchBar from './components/SearchBar.svelte'
  import searchService from './services/SearchService'
  import type { YoutubeResultType } from './types/YoutubeResult.type'
  import SearchResults from './components/SearchResults.svelte'

  let videoId
  let youtubeResults: YoutubeResultType[]

  const searchBarSubmit = async (formData) => {
    const results = await searchService.search(formData.searchTerm)
    if (results.items && results.items.length > 0) {
      youtubeResults = results.items
      console.debug(youtubeResults, 'YouTube Search Results')
    }
  }

  const onItemSelected = (selectedVideoId: String) => {
    videoId = selectedVideoId
  }
</script>

<main>
  <SearchBar onsubmit={searchBarSubmit} />
  <YouTubePlayer bind:videoId />
  <SearchResults bind:results={youtubeResults} onItemClick={onItemSelected} />
</main>

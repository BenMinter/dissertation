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

  .resultsWrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>

<script lang="ts">
  import SearchBar from './components/SearchBar.svelte'
  import searchService from './services/SearchService'
  import type { YoutubeResultType } from './types/YoutubeResult.type'
  import SearchResults from './components/SearchResults.svelte'
  import Queue from './components/Queue.svelte'
  import { connect } from 'svelte-mobx'
  import { setContext } from 'svelte'

  setContext('store', {
    getStore: () => store,
  })

  const { autorun } = connect()

  export let store

  let videoId
  let youtubeResults: YoutubeResultType[]
  let queue: YoutubeResultType[]
  let name: string

  $: autorun(() => {
    queue = store.queueStore.queue
    name = store.queueStore.name
  })

  const searchBarSubmit = async (formData) => {
    const results = await searchService.search(formData.searchTerm)
    if (results.items && results.items.length > 0) {
      youtubeResults = results.items
      console.debug(youtubeResults, 'YouTube Search Results')
    }
  }

  const onItemClick = (selectedOption) => {
    store.queueStore.addToQueue(selectedOption)
    console.debug(selectedOption)
  }
</script>

<main>
  <SearchBar onsubmit={searchBarSubmit} />
  <div class="resultsWrapper">
    <SearchResults bind:results={youtubeResults} {onItemClick} />
    <Queue />
  </div>
</main>

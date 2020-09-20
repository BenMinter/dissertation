import config from '../config/config'
import Axios from 'axios'
import type { YoutubeResultType } from '../types/YoutubeResult.type'
class SearchService {
  private readonly baseUrl: string =
    'https://www.googleapis.com/youtube/v3/search/?type=video&part=snippet'

  constructor(private readonly apiKey: string) {}

  public async search(
    searchTerm: string,
    maxResults = 5
  ): Promise<{
    items: YoutubeResultType[]
  }> {
    const youtubeQueryUrl = `${this.baseUrl}&maxResults=${maxResults}&key=${this.apiKey}&q=${searchTerm}`
    const result = await Axios.get(youtubeQueryUrl)
    if (result.status === 200) {
      return result.data
    } else {
      throw new Error(
        'Failed to search Youtube API, with error ' + result.statusText
      )
    }
  }
}

export default new SearchService(config.youtubeApiKey)

/**
* Class to encapsulate YouTube API calls.
* @param apiKey - Youtube API key.
*/

class Searcher {
  constructor(apiKey){
    this.YOUTUBE_KEY = apiKey;
  }

  /**
  * @param query - optional query to search Youtube for videos
  * @param maxResults - max results requested from the API (Default = 5)
  * @param vid - related video Id to search for related videos.
  */
  searchYouTube(query,maxResults = 5,vid){
    //construct URL to call.
    let API_URL =   `https://www.googleapis.com/youtube/v3/search/?` +
                    `maxResults=` + maxResults +
                    `&type=video&part=snippet` +
                    `&key=` + this.YOUTUBE_KEY;
    if(query != "")
      API_URL += `&q=` + query;
    else if(vid != "")
      API_URL += `&relatedToVideoId=` + vid;
    //query YouTube API
    $.ajax({
        url:API_URL,
        success:function(e){
          if(query != "")
            buildSearchResults(e);
          else
            buildRecommendations(e);
        }
    });
  }
}

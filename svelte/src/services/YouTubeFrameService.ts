import type { YouTubePlayer } from 'youtube-player/dist/types'
import YouTube from 'youtube-player'
import SynchronisationService from './SynchronisationService'
import { YoutubePlayerStateEnum } from '../types/YoutubePlayerState.enum'
import type { PlayerStateUpdatedEventType } from '../types/PlayerStateUpdatedEvent.type'
import type { ObserverType } from '../types/Observer.type'
import { SocketEventEnum } from '../types/SocketEvent.enum'

class YouTubeFrameService implements ObserverType {
  constructor(
    private readonly youtubeFrame: YouTubePlayer = YouTube('video-player')
  ) {
    SynchronisationService.addObserver(this)
    this.youtubeFrame.on(
      'stateChange',
      async (event: CustomEvent & { data: number }) => {
        console.debug(event)
        SynchronisationService.sendPlayerUpdate(await this.getPlayerDetails())
      }
    )
  }

  public async update(
    eventType: SocketEventEnum,
    event: unknown
  ): Promise<void> {
    switch (eventType) {
      case SocketEventEnum.STATE_UPDATE:
        return this.matchAllPlayerInformation(
          event as PlayerStateUpdatedEventType
        )
      case SocketEventEnum.QUEUE_UPDATE:
        return
    }
  }

  public getYoutubeFrame() {
    return this.youtubeFrame
  }

  /**
   * Changes the video if required and matches player state [TIME and PLAYER_STATE]
   * @param state
   */
  public async matchAllPlayerInformation(
    state: PlayerStateUpdatedEventType
  ): Promise<void> {
    if (state.videoId !== this.youtubeFrame.getVideoUrl()) {
      await this.matchUrl(state)
    } else {
      this.youtubeFrame.seekTo(state.currentTimestamp, true)
    }
    await this.matchState(state.playerState)
  }

  private async matchState(state: YoutubePlayerStateEnum): Promise<void> {
    switch (state) {
      case YoutubePlayerStateEnum.PAUSED:
      case YoutubePlayerStateEnum.BUFFERING:
        return this.youtubeFrame.pauseVideo()
      case YoutubePlayerStateEnum.PLAYING:
        return this.youtubeFrame.playVideo()
      case YoutubePlayerStateEnum.UN_STARTED:
      case YoutubePlayerStateEnum.ENDED:
      case YoutubePlayerStateEnum.VIDEO_CUED:
        return
    }
  }

  private async getVideoId(): Promise<string> {
    const videoUrl = await this.youtubeFrame.getVideoUrl()
    if (videoUrl) {
      const urlParams = new URL(videoUrl).searchParams
      return urlParams.get('v')
    }
    return ''
  }

  private async matchUrl({
    videoId,
    currentTimestamp,
  }: PlayerStateUpdatedEventType): Promise<void> {
    if (videoId !== (await this.getVideoId())) {
      return this.youtubeFrame.loadVideoById(videoId, currentTimestamp)
    }
  }

  private async getPlayerDetails(): Promise<PlayerStateUpdatedEventType> {
    return {
      currentTimestamp: await this.youtubeFrame.getCurrentTime(),
      playerState: await this.youtubeFrame.getPlayerState(),
      videoId: await this.getVideoId(),
    }
  }
}

export default new YouTubeFrameService()

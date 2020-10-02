import { action, observable } from 'mobx'
import type { YoutubeResultType } from '../types/YoutubeResult.type'
import type RootStore from './RootStore'

class QueueStore {
  @observable.shallow
  queue: YoutubeResultType[] = []

  constructor(private readonly rootStore: RootStore) {}

  @action
  addToQueue(option: YoutubeResultType): YoutubeResultType[] {
    console.debug('Adding to queue ' + option.snippet.title)
    this.queue.push(option)
    return this.queue
  }

  @action
  removeFromQueue(option: YoutubeResultType): YoutubeResultType[] {
    console.debug('Removing from queue ' + option.snippet.title)
    this.queue.splice(this.queue.indexOf(option), 1)
    return this.queue
  }
}

export default QueueStore

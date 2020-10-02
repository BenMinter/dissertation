import QueueStore from './QueueStore'

class RootStore {
  queueStore: QueueStore

  constructor() {
    this.queueStore = new QueueStore(this)
  }
}

export default RootStore

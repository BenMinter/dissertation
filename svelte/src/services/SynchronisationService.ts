import socketIO from 'socket.io-client'
import type { PlayerStateUpdatedEventType } from '../types/PlayerStateUpdatedEvent.type'
import { SocketEventEnum } from '../types/SocketEvent.enum'
import type { ObserverType } from '../types/Observer.type'
import Socket = SocketIOClient.Socket

class SynchronisationService {
  private socket: Socket
  private observers: ObserverType[] = []

  constructor() {
    this.socket = socketIO('http://localhost:3000', {
      // gets room id from URL
      query: `room=${window.location.search}`,
    })

    this.socket.on(
      SocketEventEnum.STATE_UPDATE,
      async (state: PlayerStateUpdatedEventType) => {
        console.debug(state, 'Received State Update')
        this.emitUpdate(SocketEventEnum.STATE_UPDATE, state)
      }
    )
  }

  public addObserver(observer: ObserverType): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: ObserverType): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex) {
      this.observers.splice(observerIndex, 1)
    }
  }

  public emitUpdate(eventType: SocketEventEnum, update: unknown): void {
    this.observers.forEach((observer: ObserverType) => {
      observer.update(eventType, update)
    })
  }

  public addToQueue(videoId: string): void {
    console.debug(videoId, 'Added to Queue')
    this.socket.emit('addToQueue', {
      videoId,
    })
  }

  public sendPlayerUpdate(state: PlayerStateUpdatedEventType): void {
    console.debug(state, 'Sending Update')
    this.socket.send(state)
  }
}

export default new SynchronisationService()

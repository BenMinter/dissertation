import type { SocketEventEnum } from './SocketEvent.enum'

export interface ObserverType {
  update: (eventType: SocketEventEnum, event: unknown) => void | Promise<void>
}

export type Web3dCamera = {
  name: string
  id: string
}

export class Web3dManager {
  constructor(dom: HTMLElement | string, options?: Record<string, unknown>)
  registerWeb3dListener(listeners: Record<string, unknown>): void
  getEngine(): unknown
  getCameras(): Web3dCamera[]
  loadEvents(): string[]
  changeCamera(cameraName: string, duration?: number): void
  issueEvent(event: string, params?: unknown): void
  destroy(): void
}

declare global {
  interface Window {
    Web3dManager?: typeof Web3dManager
    Kingfisher?: unknown
    Kc?: Record<string, unknown>
  }
}

export {}

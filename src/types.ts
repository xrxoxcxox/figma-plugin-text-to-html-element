import { EventHandler } from '@create-figma-plugin/utilities'

export interface CopyCodeHandler extends EventHandler {
  name: 'COPY_CODE'
  handler: (code: string) => void
}

export interface UiReadyHandler extends EventHandler {
  name: 'UI_READY'
  handler: () => void
}

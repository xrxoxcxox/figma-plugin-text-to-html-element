import { EventHandler } from '@create-figma-plugin/utilities'

export interface CopyTextHandler extends EventHandler {
  name: 'COPY_TEXT'
  handler: (code: string) => void
}

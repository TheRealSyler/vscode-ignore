import {
  ExtensionContext
} from 'vscode'
import { IgnoreExtension } from "./logic"

const isDev = process.env.NODE_ENV === "development"
if (isDev) {
  // only activate hot reload while developing the extension
  const hotReload = import("@hediet/node-reload")
  hotReload.then(({ enableHotReload }) => {
    enableHotReload({ entryModule: module })
  })
}

export function activate(context: ExtensionContext) {
  if (isDev) {
    const hotReload = import("@hediet/node-reload")
    hotReload.then(({ hotRequire }) => {
      context.subscriptions.push(hotRequire<typeof import("./logic")>(module, "./logic", logic => logic.IgnoreExtension(context)))
    })
  } else {
    context.subscriptions.push(IgnoreExtension(context))
  }
}

export function deactivate() { }

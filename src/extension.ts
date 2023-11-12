import { enableHotReload, hotRequire } from "@hediet/node-reload"
import {
  ExtensionContext
} from 'vscode'
import { IgnoreExtension } from "./logic"

const isDev = process.env.NODE_ENV === "development"
if (isDev) {
  // only activate hot reload while developing the extension
  enableHotReload({ entryModule: module })
}

export function activate(context: ExtensionContext) {
  if (isDev) {
    context.subscriptions.push(hotRequire<typeof import("./logic")>(module, "./logic", logic => logic.IgnoreExtension(context)))
  } else {
    context.subscriptions.push(IgnoreExtension(context))
  }
}

export function deactivate() { }

import { ExtensionContext, Position, WorkspaceEdit, commands, languages, window, workspace } from "vscode"
import { GitIgnoreCompletions } from "./autocomplete/autocomplete.provider"

export function IgnoreExtension(context: ExtensionContext) {
  const subscriptions: { dispose: () => void }[] = []
  subscriptions.push(
    window.onDidChangeActiveTextEditor(e => {
      if (e && e.document.fileName.endsWith('.gitignore') && /^\s*$/.test(e.document.getText())) {
        commands.executeCommand('ignore.choose-template.git')
      }
    }),
    commands.registerCommand('ignore.choose-template.git', async () => {
      const templates: { [key: string]: string } = (await import('./template/templates.json')).default

      const templateIndex = await window.showQuickPick(Object.keys(templates), { placeHolder: 'Choose gitignore Template' })

      const uri = window.activeTextEditor?.document.uri

      const template = templateIndex && templateIndex in templates && templates[templateIndex]
      if (uri && template) {
        const edit = new WorkspaceEdit()
        edit.insert(uri, new Position(0, 0), template)
        workspace.applyEdit(edit)
      } else if (templateIndex) {
        window.showErrorMessage('[ignore.choose-template.git] No Active Document')
      }
    }),
    languages.registerCompletionItemProvider(
      [
        { language: 'ignore', scheme: 'file' },
        { language: 'ignore', scheme: 'untitled' }
      ],
      new GitIgnoreCompletions(context),
      '.',
      '/'
    )
  )
  return {
    dispose() {
      for (const subscription of subscriptions) {
        subscription.dispose()
      }
    }
  }
}

import { GitIgnoreCompletions } from './autocomplete/autocomplete.provider';
import {
  ExtensionContext,
  commands,
  window,
  languages,
  Position,
  WorkspaceEdit,
  workspace
} from 'vscode';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(e => {
      if (e && e.document.fileName.endsWith('.gitignore') && /^\s*$/.test(e.document.getText())) {
        commands.executeCommand('ignore.choose-template.git');
      }
    }),
    commands.registerCommand('ignore.choose-template.git', () => {
      const templates: { [key: string]: string } = require('./template/templates.json');

      window
        .showQuickPick(Object.keys(templates), { placeHolder: 'Choose gitignore Template' })
        .then(i => {
          const uri = window.activeTextEditor?.document.uri;

          if (uri && i) {
            const edit = new WorkspaceEdit();
            edit.insert(uri, new Position(0, 0), templates[i]);
            workspace.applyEdit(edit);
          } else if (i) {
            window.showErrorMessage('[ignore.choose-template.git] No Active Document');
          }
        });
    }),
    languages.registerCompletionItemProvider(
      [
        { language: 'ignore', scheme: 'file' },
        { language: 'ignore', scheme: 'untitled' }
      ],
      new GitIgnoreCompletions(context),
      '\\.',
      '/'
    )
  );
}

export function deactivate() {}

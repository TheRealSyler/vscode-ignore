import * as vscode from 'vscode';
import { GitIgnoreCompletions } from './autocomplete/autocomplete.provider';

export function activate(context: vscode.ExtensionContext) {
  console.log('a', context);
  const gitIgnoreCompletion = new GitIgnoreCompletions(context);
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { language: 'gitignore', scheme: 'file' },
        { language: 'gitignore', scheme: 'untitled' }
      ],
      gitIgnoreCompletion,
      '.',
      '/'
    )
  );
}

export function deactivate() {}

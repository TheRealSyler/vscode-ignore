import {
  ExtensionContext,
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem,
  Range,
  CompletionItemKind
} from 'vscode';
import { resolve } from 'path';
import { promises, statSync } from 'fs';
export class GitIgnoreCompletions implements CompletionItemProvider {
  context: ExtensionContext;
  constructor(context: ExtensionContext) {
    this.context = context;
  }
  async provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken) {
    const start = new Position(position.line, 0);
    const range = new Range(start, position);
    const currentWord = document.getText(range).trim();
    const tempDir = resolve(document.uri.path, '../', currentWord);
    const dir = statSync(tempDir).isDirectory() ? tempDir : resolve(document.uri.path, '../');

    const files = await promises.readdir(dir);
    const completions: CompletionItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const stats = statSync(resolve(document.uri.path, '../', fileName));
      const isDir = stats.isDirectory();
      const Item = new CompletionItem(fileName, isDir ? CompletionItemKind.Folder : CompletionItemKind.File);
      Item.insertText = isDir ? `${fileName}/` : fileName;
      Item.command = isDir
        ? {
            title: 'Trigger Completion',
            command: 'editor.action.triggerSuggest'
          }
        : undefined;
      completions.push(Item);
    }

    return completions;
  }
}

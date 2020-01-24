import {
  ExtensionContext,
  CompletionItemProvider,
  TextDocument,
  Position,
  CompletionItem,
  Range,
  CompletionItemKind
} from 'vscode';
import { resolve, basename } from 'path';
import { promises, statSync, existsSync } from 'fs';
export class GitIgnoreCompletions implements CompletionItemProvider {
  context: ExtensionContext;
  constructor(context: ExtensionContext) {
    this.context = context;
  }
  async provideCompletionItems(document: TextDocument, position: Position) {
    const start = new Position(position.line, 0);
    const range = new Range(start, position);
    const currentWord = document.getText(range).trim();

    const path = resolve(document.uri.path, '../', currentWord.replace(/^\//, ''));
    if (!existsSync(path)) {
      return [];
    }
    const dir = statSync(path).isDirectory() ? path : resolve(document.uri.path, '../');

    const files = await promises.readdir(dir);

    const completions: CompletionItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      if (fileName === basename(document.fileName)) {
        continue;
      }
      try {
        const stats = statSync(resolve(dir, fileName));
        const isDir = stats.isDirectory();
        const Item = new CompletionItem(
          fileName,
          isDir ? CompletionItemKind.Folder : CompletionItemKind.File
        );
        const insertText = isDir ? `${fileName}/` : fileName;
        Item.insertText = currentWord.endsWith('.') ? `/${insertText}` : insertText;
        Item.command = isDir
          ? {
              title: 'Trigger Completion',
              command: 'editor.action.triggerSuggest'
            }
          : undefined;
        completions.push(Item);
      } catch {
        console.log(`[ignore]: Autocomplete, ${fileName} Failed`);
      }
    }

    return completions;
  }
}

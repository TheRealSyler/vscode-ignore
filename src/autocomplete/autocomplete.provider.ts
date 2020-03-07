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
    const rawCurrentWord = document.getText(range).trim();
    const currentWord = rawCurrentWord.replace(/^(\/|\*)/, '');

    const path = resolve(document.uri.path, '../', currentWord);

    if (!existsSync(path)) {
      console.log("[vscode-ignore]: Exited autocomplete, path doesn't exist.");
      return [];
    }

    const files = await promises.readdir(path);
    const completions: CompletionItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      if (fileName === basename(document.fileName)) {
        continue;
      }
      try {
        const stats = statSync(resolve(path, fileName));
        const isDir = stats.isDirectory();
        const item = new CompletionItem(
          fileName,
          isDir ? CompletionItemKind.Folder : CompletionItemKind.File
        );
        const insertText = (isDir ? `${fileName}/` : fileName).replace(
          new RegExp(`^${rawCurrentWord.replace(/\./, '\\.')}`),
          ''
        );
        item.insertText = currentWord.endsWith('.') ? `/${insertText}` : insertText;
        item.command = isDir
          ? {
              title: 'Trigger Completion',
              command: 'editor.action.triggerSuggest'
            }
          : undefined;
        completions.push(item);
      } catch (e) {
        console.log(`[ignore]: Autocomplete, ${fileName} Failed`, e);
      }
    }
    return completions;
  }
}

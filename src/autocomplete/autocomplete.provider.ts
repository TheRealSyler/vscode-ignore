import { existsSync, promises, statSync } from 'fs';
import { basename, resolve } from 'path';
import {
  CompletionItem, CompletionItemKind, CompletionItemProvider, ExtensionContext, Position, Range, TextDocument
} from 'vscode';
export class GitIgnoreCompletions implements CompletionItemProvider {
  context: ExtensionContext;
  constructor(context: ExtensionContext) {
    this.context = context;
  }
  async provideCompletionItems(document: TextDocument, position: Position) {
    const start = new Position(position.line, 0);
    const range = new Range(start, position);
    const currentWordRaw = document.getText(range).trim();
    const currentWord = currentWordRaw.replace(/!/g, '');

    let AWD: string;

    if (/\/|\./.test(currentWord)) {
      AWD = currentWord

    } else {
      AWD = '';
    }
    console.log(currentWord, AWD)

    const path = resolve(document.uri.fsPath, '../', AWD);

    if (!existsSync(path)) {
      console.log("[vscode-ignore]: Exited autocomplete, path doesn't exist.");
      return [];
    }

    const files = await promises.readdir(path);
    const completions: CompletionItem[] = [];

    if (currentWordRaw === '') {
      completions.push(
        new CompletionItem('!', CompletionItemKind.Value),
      )
    }

    if (currentWord.endsWith('/') || currentWordRaw === '') {
      completions.push(
        new CompletionItem('*', CompletionItemKind.Value),
        new CompletionItem('**', CompletionItemKind.Value)
      )
    } else if (currentWord.endsWith('.') || currentWordRaw === '!') {
      const item = new CompletionItem('*', CompletionItemKind.Value);
      item.insertText = '/*'
      const item2 = new CompletionItem('**', CompletionItemKind.Value);
      item2.insertText = '/**'
      completions.push(
        item,
        item2
      )
    }

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
          new RegExp(`^${currentWord.replace(/\./, '\\.')}`),
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

import { TestGrammar } from 'test-grammar';

new TestGrammar('./syntaxes/gitignore.tmLanguage.json', {}, run => {
  const comment = 'comment.line.gitignore';
  run('TEST', `node_modules`, ``);
  run('Comment', `# Test Comment`, `${comment}`);
});

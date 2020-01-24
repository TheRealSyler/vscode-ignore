import { TestGrammar } from 'test-grammar';

export function RunSyntaxTests() {
  new TestGrammar('syntaxes/gitignore.tmLanguage.json', null, run => {
    const comment = 'comment.line';
    const path = 'support.type.property-name.path';
    const special = 'keyword.control.escape.special';
    const bracket = 'constant.character.escape.bracket';
    const bracketS = 'constant.language.bracket.separator';
    const bracketV = 'string.regexp.bracket.value';
    const negate = 'constant.language.negate';
    run(
      'Test Grammar',
      `npm-debug.log*
!yarn-error.log*

*~[0-9]*
*.s#?
# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.json`,
      `${path}|${path} ${special}|${path}|${path} ${special}
${negate}|${path}|${path} ${special}|${path}|${path} ${special}

${special}|${path}|${path} ${bracket}|${path} ${bracket} ${bracketV}|${path} ${bracket} ${bracketS}|${path} ${bracket} ${bracketV}|${path} ${bracket}|${path} ${special}
${special}|${special}|${path}|${path}|${path} ${special}
${comment}
${path}|${path} ${special}|${path} ${bracket}|${path} ${bracket} ${bracketV}|${path} ${bracket} ${bracketS}|${path} ${bracket} ${bracketV}|${path} ${bracket}|${path} ${special}|${path} ${special}|${path}`
    );
  });
}

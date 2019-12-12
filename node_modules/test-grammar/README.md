## Test grammar

<span id="BADGE_GENERATION_MARKER_0"></span>
 [![npmV]( https://img.shields.io/npm/v/test-grammar?color=brightGreen)](https://www.npmjs.com/package/test-grammar) [![min]( https://img.shields.io/bundlephobia/min/test-grammar)](https://bundlephobia.com/result?p=test-grammar) [![install](https://badgen.net/packagephobia/install/test-grammar)](https://packagephobia.now.sh/result?p=test-grammar) [![githubLastCommit]( https://img.shields.io/github/last-commit/TheRealSyler/test-grammar)](https://github.com/TheRealSyler/test-grammar)
<span id="BADGE_GENERATION_MARKER_1"></span>

Utility for testing grammar files, used with vscode.

#### Usage example

```typescript
import { TestGrammar } from 'test-grammar';
new TestGrammar(
  JSON.stringify({
    scopeName: 'source.test',
    name: 'test',
    patterns: [
      {
        begin: '@',
        end: '$\\n?|(?=\\s|,|\\(|\\)|\\[|>)',
        name: 'at',
        patterns: [
          {
            match: '.*',
            name: 'name'
          }
        ]
      },
      {
        begin: '\\*\\*',
        end: '\\*\\*',
        name: 'bold',
        patterns: [
          {
            match: '[A-z]+',
            name: 'text'
          },
          {
            match: '\\d+',
            name: 'number'
          },
          {
            match: ' *',
            name: 'whitespace'
          }
        ]
      }
    ]
  }),
  { useSourceAsFile: true },
  run => {
    run(
      'test',
      `@syler
**text 0**`,
      `at|at name
bold|bold text|bold whitespace|bold number|bold`
    );
  }
);
```

<span id="DOC_GENERATION_MARKER_0"></span>
# Docs

- **[interfaces](#interfaces)**

  - [Expect](#expect)
  - [Text](#text)
  - [Options](#options)
  - [Run](#run)
  - [RunOptions](#runoptions)

### interfaces


##### Expect

```typescript
type Expect = string[][][] | string;
```

##### Text

```typescript
type Text = string[] | string;
```

##### Options

```typescript
interface Options {
    /**
     * Also Logs Tokens that passed the test.
     */
    logAllTokens: boolean;
    /**
     * Calls `process.exit(1)` when tests failed or if there is an error.
     */
    exitProcess: boolean;
    /**
     * Uses the source parameter as input file, the input string is expected to be valid json textmate grammar.
     */
    useSourceAsFile: boolean;
}
```

##### Run

```typescript
type Run = (name: string, text: Text, expect: Expect, options?: Partial<RunOptions>) => void;
```

##### RunOptions

```typescript
type RunOptions = Pick<Options, 'logAllTokens'>;
```

*Generated With* **[ts-doc-gen](https://www.npmjs.com/package/ts-doc-gen)**
<span id="DOC_GENERATION_MARKER_1"></span>

/* eslint-disable ts/no-use-before-define */

import type { BundledLanguage } from 'shiki';
import type { Plugin } from 'vite';
import type { Info } from '../types/info';
import fs from 'fs-extra';
import { encode } from 'js-base64';
import { find } from 'lodash-es';
import MagicString from 'magic-string';
import { customRandom, random } from 'nanoid';
import { dirname, resolve } from 'pathe';
import { camelCase, pascalCase } from 'scule';
import docs from '../../../meta/docs.json';

const nanoid = customRandom('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 18, random);

export function MarkdownTransform(): Plugin {
  return {
    name: 'mixte-markdown-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return;

      const dir = dirname(id);
      let [,fn,, pkg, _,, __] = id.split('/').reverse();
      let info: Info | undefined;

      // 子级文档
      if (pkg === 'docs') {
        pkg = __;
        info = (find(docs[camelCase(pkg) as keyof typeof docs], { fn: _ }) as Info | undefined)?.childrenInfo?.[fn] as Info;
      }

      if (Reflect.has(docs, camelCase(pkg)) && (info || (info = find(docs[camelCase(pkg) as keyof typeof docs], { fn })))) {
        const s = new MagicString(code = code.replace(/\r\n/g, '\n'));
        const imports = [];

        const startIndex = code.match(/^---\n.+\n---/m)?.[0]?.length ?? -1;

        /** 标题 */
        const fnTitle = info.title || (['components', 'mel-components'].includes(pkg) ? pascalCase(fn) : fn);
        /** 标题 + 副标题 */
        const fnFullTitle = `${fnTitle}${
          info.name && fnTitle === pascalCase(fnTitle) ? ` <small><small>( ${info.name} )</small></small>` : ''
        }`;

        // 添加标题
        if (!info.hiddenTitle) {
          const h1 = `# ${fnFullTitle} {#${fn}-header}\n\n`;

          if (startIndex > 0) s.prependRight(startIndex, `\n\n${h1}`);
          else s.prepend(h1);
        }

        // 文档为空时添加提示
        if (!code.trim())
          s.append(emptyMd);

        /** 主 Demo 文件名 */
        let demoName = 'demo';

        // 添加主 Demo
        if (
          (await fs.pathExists(resolve(dir, 'demo.vue')))
          || (await fs.pathExists(resolve(dir, `${demoName = 'demo.preview'}.vue`)))
        ) {
          let index;

          function getDemoMd() {
            if (demoName === 'demo') return createDemoMd();
            return createDemoMd('Demo', fs.readFileSync(resolve(dir, `${demoName}.vue`), 'utf-8'), 'vue');
          }

          // 查找第一个二级以上的标题
          if ((index = code.indexOf('\n##')) > -1) s.appendLeft(index, getDemoMd());
          // 没有二级以上的标题, 查找第一个空行
          else if ((index = code.search(/\n\s\n/)) > -1) s.appendRight(index + 2, getDemoMd());
          // 没有二级以上的标题和空行时添加到最后
          else s.append(getDemoMd());

          imports.push(createImportScript('Demo', demoName));
        }

        // 添加二级标题 Demo
        for (const match of code.matchAll(/\n##\s`?([^\n`]+)`?/g)) {
          const name = match[1].replaceAll(/[\s:]+/g, ' ');
          const matchEndIndex = match.index! + match[0].length;
          let demoName = name;

          if (
            await fs.pathExists(resolve(dir, `demo/${name}.vue`))
            || await fs.pathExists(resolve(dir, `demo/${demoName = `${name}.preview`}.vue`))
          ) {
            const demoComponentName = `Second${nanoid()}Demo`;
            let index;

            function getDemoMd() {
              if (demoName.endsWith('.preview'))
                return createNoTitleDemoMd(demoComponentName, fs.readFileSync(resolve(dir, `demo/${demoName}.vue`), 'utf-8'), 'vue');
              return createNoTitleDemoMd(demoComponentName);
            }

            // 查找下一个二级以上的标题
            if ((index = code.indexOf('\n##', matchEndIndex)) > -1) s.appendLeft(index, getDemoMd());
            // 没有二级以上的标题, 直接插入到当前标题的后面
            else s.appendRight(matchEndIndex, getDemoMd());

            imports.push(createImportScript(demoComponentName, `demo/${demoName}`));
          }
        }

        // 添加三级标题 Demo
        for (const match of code.matchAll(/\n###\s`?([^\n`]+)`?/g)) {
          const name = match[1].replaceAll(/[\s:]+/g, ' ');
          const matchEndIndex = match.index! + match[0].length;
          let demoName = name;

          if (
            await fs.pathExists(resolve(dir, `demo/${name}.vue`))
            || await fs.pathExists(resolve(dir, `demo/${demoName = `${name}.preview`}.vue`))
          ) {
            const demoComponentName = `Third${nanoid()}Demo`;
            let index;

            function getDemoMd() {
              if (demoName.endsWith('.preview'))
                return createNoTitleDemoMd(demoComponentName, fs.readFileSync(resolve(dir, `demo/${demoName}.vue`), 'utf-8'), 'vue');
              return createNoTitleDemoMd(demoComponentName);
            }

            // 查找下一个标题, 有则插入到下一个标题前面
            if ((index = code.indexOf('\n#', matchEndIndex)) > -1) s.appendLeft(index, getDemoMd());
            // 没有三级以上的标题, 直接插入到当前标题的后面
            else s.appendRight(matchEndIndex, getDemoMd());

            imports.push(createImportScript(demoComponentName, `demo/${demoName}`));
          }
        }

        if (imports.length) {
          const scriptTag = findScriptTag(s);

          if (scriptTag) {
            const start = scriptTag.start + scriptTag.content.indexOf('>') + 1;

            s.appendRight(start, `\n  ${imports.join('\n  ')}\n`);
          }
          else {
            s.append(`\n<script setup>\n  ${imports.join('\n  ')}\n</script>`);
          }
        }

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }),
        };
      }
    },
  };
}

const emptyMd = `
<br>\n
::: warning 啊
文档还没写呢 ...
:::
`;

function createNoTitleDemoMd(component = 'Demo', code?: string, codeLang?: BundledLanguage) {
  return `
<DemoCard ${code ? `code="${encodeURIComponent(encode(code))}"` : ''} ${codeLang ? `codeLang="${codeLang}"` : ''}>
  <ClientOnly>
    <${component} />
  </ClientOnly>
</DemoCard>
`;
}

function createDemoMd(component = 'Demo', code?: string, codeLang?: BundledLanguage) {
  return `
### 演示
${createNoTitleDemoMd(component, code, codeLang)}
`;
}

function createImportScript(component: string, path: string) {
  return `import ${component} from "./${path}.vue";`;
}

function findScriptTag(s: MagicString) {
  const markdownContent = s.original;
  const codeBlockRanges: Array<{ start: number; end: number }> = [];
  const codeBlockRegex = /```[\s\S]*?```/g;
  let match: RegExpExecArray | null;

  // 找到所有代码块的范围
  while ((match = codeBlockRegex.exec(markdownContent)) !== null) {
    codeBlockRanges.push({ start: match.index, end: match.index + match[0].length });
  }

  const scriptTagRegex = /<script[\s\S]*?<\/script>/g;

  // 查找第一个不在代码块中的 <script> 标签
  while ((match = scriptTagRegex.exec(markdownContent)) !== null) {
    const tagStart = match.index;
    const tagEnd = match.index + match[0].length;

    // 检查是否在代码块范围内
    let inCodeBlock = false;

    for (const range of codeBlockRanges) {
      if (tagStart >= range.start && tagStart <= range.end) {
        inCodeBlock = true;
        break;
      }
    }

    if (!inCodeBlock) {
      return { start: tagStart, end: tagEnd, content: match[0] };
    }
  }
}

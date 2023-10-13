/* eslint-disable @typescript-eslint/no-use-before-define */

import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';
import MagicString from 'magic-string';
import fs from 'fs-extra';
import { pascalCase } from 'change-case';
import { find } from 'lodash-es';
import type { ValueOf } from 'type-fest';
import docs from '../../../meta/docs.json';

export function MarkdownTransform(): Plugin {
  return {
    name: 'mixte-markdown-transform',
    enforce: 'pre',
    async transform(code, id, options) {
      if (!id.endsWith('.md')) return;

      const [, fn,, pkg] = id.split('/').reverse();
      let info: ValueOf<ValueOf<typeof docs>> | undefined;

      if (Reflect.has(docs, pkg) && (info = find(docs[pkg as keyof typeof docs], { fn }))) {
        const s = new MagicString(code = code.replace(/\r\n/g, '\n'));
        const imports = [];

        const startIndex = code.match(/^---\n.+?\n---/m)?.[0]?.length ?? -1;

        /** 标题 ( 组件包显示大驼峰 ) */
        const fnTitle = `${
          pkg === 'components' ? pascalCase(fn) : fn
        }${
          info.name && pkg === 'components' ? ` <small><small>( ${info.name} )</small></small>` : ''
        }`;

        // 添加标题
        if (!info.hiddenH1) {
          if (startIndex > 0) s.prependRight(startIndex, `\n\n# ${fnTitle}\n\n`);
          else s.prepend(`# ${fnTitle}\n\n`);
        }

        // 文档为空时添加提示
        if (!code.trim())
          s.append(emptyMd);

        // 添加主 Demo
        if (await fs.pathExists(resolve(dirname(id), 'demo.vue'))) {
          let index;

          // 查找第一个二级以上的标题
          if ((index = code.indexOf('\n##')) > -1) s.appendLeft(index, createDemoMd());
          // 没有二级以上的标题, 查找第一个空行
          else if ((index = code.search(/\n\s\n/)) > -1) s.appendRight(index + 2, createDemoMd());
          // 没有二级以上的标题和空行时添加到最后
          else s.append(createDemoMd());

          imports.push(createImportScript());
        }

        // 添加二级标题 Demo
        for (const match of code.matchAll(/\n##\s`?([^`]+)`?\n/g)) {
          const name = match[1];
          const matchEndIndex = match.index! + match[0].length;

          if (await fs.pathExists(resolve(dirname(id), `demo/${name}.vue`))) {
            let index;

            // 查找下一个二级以上的标题
            if ((index = code.indexOf('\n##', matchEndIndex)) > -1) s.appendLeft(index, createDemoMd(name));
            // 没有二级以上的标题, 直接插入到当前标题的后面
            else s.appendRight(matchEndIndex, createDemoMd(name));

            imports.push(createImportScript(name, `demo/${name}`));
          }
        }

        if (imports)
          s.append(`\n<script setup>\n  ${imports.join('\n  ')}\n</script>`);

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

function createDemoMd(component = 'Demo') {
  return `
### 演示

<DemoCard>
  <${component} />
</DemoCard>
`;
}

function createImportScript(component = 'Demo', path = 'demo') {
  return `import ${component} from "./${path}.vue";`;
}

import type { DefaultTheme } from 'vitepress';
import type { GroupInfo, Info } from '../types/info';
import { isEmpty } from 'lodash-es';
import { pascalCase } from 'scule';
import { components, melComponents, mixte, snippets, use, validator } from '../../../meta/docs.json';

const sidebarGroup = [
  { text: 'mixte', docs: mixte },
  { text: '@mixte/use', docs: use },
  { text: '@mixte/components', docs: components },
  { text: '@mixte/validator', docs: validator },
  { text: '@mixte/snippets', docs: snippets },
  { text: '@mixte/mel-components', docs: melComponents },
];

/**
 * 创建侧边栏
 */
export function createSidebar(): DefaultTheme.SidebarItem[] {
  return sidebarGroup.map(({ text, docs }) => {
    const pkg = text.replace('@mixte/', '');

    return {
      text,
      items: docs.map((info) => {
        const nameFirst = info.sidebarTitle || (pkg.includes('components') ? pascalCase(info.fn) : info.fn);
        const nameLast = info.name ? ` ( ${info.name} )` : '';
        const link = `/mixte/${pkg !== 'mixte' ? `${pkg}/` : ''}${info.fn}`;

        return {
          text: `${nameFirst}${nameLast}`,
          link,
        };
      }),
    };
  });
}

/**
 * 为有子级文档的 sidebar 创建侧边栏
 */
export function createDetailSidebar() {
  const detailSidebar: DefaultTheme.Sidebar = {};

  sidebarGroup.forEach(({ text, docs }) => {
    const pkg = text.replace('@mixte/', '');

    docs.forEach((info, index) => {
      if (!isEmpty(info.childrenInfo)) {
        const link = `/mixte/${pkg !== 'mixte' ? `${pkg}/` : ''}${info.fn}`;
        const sidebar = createSidebar();
        const currentSidebar = sidebar.find(item => item.text === text);

        const items: DefaultTheme.Config['sidebar'] = [];

        info.children && Object.entries(info.children as Record<string, string[]>).forEach(([group, fns]) => {
          if (!group) {
            return items.push(...fns.map(fn => ({ text: fn, link: `/mixte/${pkg}/${info.fn}/${fn}` })));
          }

          const groupInfo = (info.childrenGroupInfo[group] ?? {}) as GroupInfo;

          items.push({
            text: groupInfo.sidebarTitle ?? group,
            items: fns.map((fn) => {
              const childInfo = (info.childrenInfo[fn] ?? {}) as Info;
              const nameFirst = childInfo.sidebarTitle || (pkg.includes('components') ? pascalCase(fn) : fn);
              const nameLast = childInfo.name ? ` ( ${childInfo.name} )` : '';

              return {
                text: `${nameFirst}${nameLast}`,
                link: `${link}/${fn}`,
              };
            }),
          });
        });

        currentSidebar!.items![index].items = items;
        detailSidebar[link] = sidebar;
      }
    });
  });

  return detailSidebar;
}

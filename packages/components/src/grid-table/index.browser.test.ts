/* eslint-disable style/max-statements-per-line */
/* eslint-disable style/no-multi-spaces */

import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
import { page } from '@vitest/browser/context';
import { delay, random, randomString } from 'mixte';
import { render } from 'vitest-browser-vue';
import 'uno.css';
import '@/vitest.locators';

// @unocss-include

beforeEach(() => {
  page.viewport(666, 666);
});

describe('grid-table', () => {
  describe('虚拟列表', () => {
    /**
     * 测试虚拟列表滚动到指定行的显示
     */
    async function testScrollRow(index: number, tableWrap: HTMLDivElement, data: Record<string, any>[], options?: {
      overscan?: number;
    }) {
      const overscan = options?.overscan ?? 0;

      // 滚动到第 index 行, 即将隐藏
      {
        tableWrap.scrollTop = 60 * index;
        await delay(36);

        let startIndex = Math.max(0, index - 1);
        let endIndex = startIndex + 10;

        if (index === 0) {
          endIndex = 9;
        }
        else if (endIndex > data.length - 1) {
          startIndex = data.length - 11;
          endIndex = startIndex + 10;
        }

        startIndex = Math.max(0, startIndex - overscan);
        endIndex = endIndex + overscan;

        if (endIndex > data.length) {
          startIndex = Math.min(index - overscan - 1, data.length - 10 - overscan);
          endIndex = data.length;
        }

        const firstColumnTds = Array.from(tableWrap.querySelectorAll<HTMLDivElement>(`.mixte-gt-td[data-field="col-1"]`));

        expect(firstColumnTds.length).toBe(endIndex - startIndex);
        expect(firstColumnTds.map(td => td.textContent)).toEqual(data.slice(startIndex, endIndex).map(item => item['col-1']));

        if (endIndex === data.length - 1) {
          return;
        }
      }

      // 滚动到第 index 行, 已隐藏
      {
        tableWrap.scrollTop = (60 * index) + 1;
        await delay(36);

        let startIndex = index;
        let endIndex = startIndex + 10;
        const firstColumnTds = Array.from(tableWrap.querySelectorAll<HTMLDivElement>(`.mixte-gt-td[data-field="col-1"]`));

        startIndex = Math.max(0, startIndex - overscan);
        endIndex = endIndex + overscan;

        if (endIndex > data.length) {
          startIndex = Math.min(index - overscan, data.length - 10 - overscan);
          endIndex = data.length;
        }

        expect(firstColumnTds.length).toBe(endIndex - startIndex);
        expect(firstColumnTds.map(td => td.textContent)).toEqual(data.slice(startIndex, endIndex).map(item => item['col-1']));
      }
    }

    it('未设置预渲染的行数时, 无论何时都应该渲染所有可见行', async () => {
      const data = Array.from({ length: 30 }).map((_, index) => ({
        'id': index + 1,
        'col-1': `数据 ${index + 1} - 列1`,
        'col-2': `数据 ${index + 1} - 列2`,
      }));

      render(MixteGridTable, {
        props: { // @ts-expect-error
          columns: defineTableColumns([
            { field: 'col-1', title: '列1', cellClass: 'h-60px' },
            { field: 'col-2', title: '列2' },
          ]),
          data,
          class: 'h-600px',
          virtual: true,
          overscan: 0,
        },
      });

      await delay(20);

      const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;

      for (let i = 0; i < data.length; i++) {
        await testScrollRow(i, tableWrap, data);
      }
    });

    it('设置预渲染的行数时, 应该渲染预渲染行数 + 可见行数', async () => {
      const data = Array.from({ length: 30 }).map((_, index) => ({
        'id': index + 1,
        'col-1': `数据 ${index + 1} - 列1`,
        'col-2': `数据 ${index + 1} - 列2`,
      }));

      render(MixteGridTable, {
        props: { // @ts-expect-error
          columns: defineTableColumns([
            { field: 'col-1', title: '列1', cellClass: 'h-60px' },
            { field: 'col-2', title: '列2' },
          ]),
          data,
          class: 'h-600px',
          virtual: true,
          overscan: 3,
        },
      });

      await delay(20);

      const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;

      for (let i = 0; i < data.length; i++) {
        await testScrollRow(i, tableWrap, data, { overscan: 3 });
      }
    });

    it('默认预渲染的行数为 5', async () => {
      const data = Array.from({ length: 30 }).map((_, index) => ({
        'id': index + 1,
        'col-1': `数据 ${index + 1} - 列1`,
        'col-2': `数据 ${index + 1} - 列2`,
      }));

      render(MixteGridTable, {
        props: { // @ts-expect-error
          columns: defineTableColumns([
            { field: 'col-1', title: '列1', cellClass: 'h-60px' },
            { field: 'col-2', title: '列2' },
          ]),
          data,
          class: 'h-600px',
          virtual: true,
        },
      });

      await delay(20);

      const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;

      for (let i = 0; i < data.length; i++) {
        await testScrollRow(i, tableWrap, data, { overscan: 5 });
      }
    });
  });

  describe('列配置', () => {
    it('列宽度: width', () => {
      const columns = defineTableColumns([
        { field: 'col-1',    width: undefined,              title: '默认宽度 ☑️' },
        { field: 'col-2',    width: 100,                    title: '数字 ☑️' },
        { field: 'col-3',    width: -100,                   title: '负数数字 ❌' },
        { field: 'col-4',    width: '200',                  title: '数字字符串 ☑️' },
        { field: 'col-5',    width: '300px',                title: '指定像素 ☑️' },
        { field: 'col-6',    width: '30%',                  title: '百分比 ☑️' },
        { field: 'col-7',    width: 'auto',                 title: '自动 ☑️' },
        { field: 'col-8',    width: '1fr',                  title: '弹性布局 ☑️' },
        { field: 'col-9',    width: '.5fr',                 title: '弹性布局 ☑️' },
        { field: 'col-10',   width: '-1fr',                 title: '负数弹性布局 ❌' },
        { field: 'col-11',   width: 'calc(100% - 50px)',    title: '计算宽度 ☑️' },
        { field: 'col-12',   width: 'calc(100% - 50px',     title: '错误计算宽度 ❌' },
        { field: 'col-13',   width: 'minmax(100px, 1fr)',   title: '最小最大宽度 ☑️' },
        { field: 'col-14',   width: 'max-content',          title: '最大内容宽度 ☑️' },
        { field: 'col-15',   width: 'min-content',          title: '最小内容宽度 ☑️' },
        { field: 'col-16',   width: 'fit-content(200px)',   title: '适应内容宽度 ☑️' },
        { field: 'col-17',   width: 'fit-content',          title: '错误适应内容宽度 ❌' },
        { field: 'col-18',   width: 'max(10vw, 100px)',     title: '最大宽度 ☑️' },
        { field: 'col-19',   width: 'min(10vw, 100px)',     title: '最小宽度 ☑️' },
      ]);

      render(MixteGridTable, {
        props: { // @ts-expect-error
          columns,
        },
      });

      const table = page.getByClass('mixte-gt').query() as HTMLDivElement;

      expect(table.attributeStyleMap.get('grid-template-columns')!.toString()).toBe(
        [
          'auto', // 默认宽度 ☑️
          '100px', // 数字 ☑️
          'auto', // 负数数字 ❌
          '200px', // 数字字符串 ☑️
          '300px', // 指定像素 ☑️
          '30%', // 百分比 ☑️
          'auto', // 自动 ☑️
          '1fr', // 弹性布局 ☑️
          '0.5fr', // 弹性布局 ☑️
          'auto', // 负数弹性布局 ❌
          'calc(100% - 50px)', // 计算宽度 ☑️
          'auto', // 错误计算宽度 ❌
          'minmax(100px, 1fr)', // 最小最大宽度 ☑️
          'max-content', // 最大内容宽度 ☑️
          'min-content', // 最小内容宽度 ☑️
          'fit-content(200px)', // 适应内容宽度 ☑️
          'auto', // 错误适应内容宽度 ❌
          'max(10vw, 100px)', // 最大宽度 ☑️
          'min(10vw, 100px)', // 最小宽度 ☑️
        ].join(' '),
      );
    });

    describe('列固定: fixed', async () => {
      it('单元格固定效果', async () => {
        const columns = defineTableColumns([
          { field: 'col-1', width: 150,   fixed: 'left',      title: '左侧固定1' },
          { field: 'col-2', width: 150,   fixed: 'left',      title: '左侧固定2' },
          { field: 'col-3', width: 600,   fixed: undefined,   title: '未配置' },
          { field: 'col-4', width: 600,   fixed: undefined,   title: '未配置' },
          { field: 'col-5', width: 150,   fixed: 'right',     title: '右侧固定2'  },
          { field: 'col-6', width: 150,   fixed: 'right',     title: '右侧固定1'  },
        ]);

        render(MixteGridTable, {
          props: { // @ts-expect-error
            columns,
            data: Array.from({ length: 10 }).map(() => ({
              'col-1': randomString(random(1, 6)),
              'col-2': randomString(random(1, 6)),
              'col-3': randomString(random(1, 6)),
              'col-4': randomString(random(1, 6)),
              'col-5': randomString(random(1, 6)),
              'col-6': randomString(random(1, 6)),
              'col-7': randomString(random(1, 6)),
            })),
          },
        });

        await delay(20);

        const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;
        const cells = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-cell'));

        // left

        cells.forEach((cell, index) => {
          const colIndex = index % columns.length;

          switch (colIndex) {
            case 0: expect(cell.getBoundingClientRect().left).toBe(0); break;
            case 1: expect(cell.getBoundingClientRect().left).toBe(150); break;
            case 2: expect(cell.getBoundingClientRect().left + tableWrap.scrollLeft).toBe(300); break;
            case 3: expect(cell.getBoundingClientRect().left + tableWrap.scrollLeft).toBe(900); break;
            case 4: expect(cell.getBoundingClientRect().left).toBe(tableWrap.getBoundingClientRect().width - 150 - 150); break;
            case 5: expect(cell.getBoundingClientRect().left).toBe(tableWrap.getBoundingClientRect().width - 150); break;
          }
        });

        // center

        tableWrap.scrollLeft = 150;
        await delay(20);

        cells.forEach((cell, index) => {
          const colIndex = index % columns.length;

          switch (colIndex) {
            case 0: expect(cell.getBoundingClientRect().left).toBe(0); break;
            case 1: expect(cell.getBoundingClientRect().left).toBe(150); break;
            case 2: expect(cell.getBoundingClientRect().left + tableWrap.scrollLeft).toBe(300); break;
            case 3: expect(cell.getBoundingClientRect().left + tableWrap.scrollLeft).toBe(900); break;
            case 4: expect(cell.getBoundingClientRect().left).toBe(tableWrap.getBoundingClientRect().width - 150 - 150); break;
            case 5: expect(cell.getBoundingClientRect().left).toBe(tableWrap.getBoundingClientRect().width - 150); break;
          }
        });

        // right

        tableWrap.scrollLeft = tableWrap.scrollWidth - tableWrap.clientWidth;
        await delay(20);

        cells.forEach((cell, index) => {
          const colIndex = index % columns.length;

          switch (colIndex) {
            case 0: expect(cell.getBoundingClientRect().left).toBe(0); break;
            case 1: expect(cell.getBoundingClientRect().left).toBe(150); break;
            case 2: expect(cell.getBoundingClientRect().left + tableWrap.scrollLeft).toBe(300); break;
            case 3: expect(cell.getBoundingClientRect().left + tableWrap.scrollLeft).toBe(900); break;
            case 4: expect(cell.getBoundingClientRect().left).toBe(tableWrap.getBoundingClientRect().width - 150 - 150); break;
            case 5: expect(cell.getBoundingClientRect().left).toBe(tableWrap.getBoundingClientRect().width - 150); break;
          }
        });
      });

      it('单元格上的样式类', async () => {
        const columns = defineTableColumns([
          { field: 'col-1', width: 150,   fixed: true,        title: '左侧固定' },
          { field: 'col-2', width: 150,   fixed: undefined,   title: '未配置' },
          { field: 'col-3', width: 150,   fixed: 'left',      title: '左侧固定2' }, // @ts-expect-error
          { field: 'col-4', width: 150,   fixed: 'xxxx',      title: '不合法' }, // @ts-expect-error
          { field: 'col-5', width: 150,   fixed: 'both',      title: '不合法' },
          { field: 'col-6', width: 150,   fixed: 'right',     title: '右侧固定'  },
          { field: 'col-7', width: 150,   fixed: 'right',     title: '右侧固定2'  },
        ]);

        render(MixteGridTable, {
          props: { // @ts-expect-error
            columns,
            data: Array.from({ length: 10 }).map((_, index) => ({
              'col-1': `左侧固定 ${index + 1}`,
              'col-2': `未配置 ${index + 1}`,
              'col-3': `左侧固定2 ${index + 1}`,
              'col-4': `不合法 ${index + 1}`,
              'col-5': `右侧固定 ${index + 1}`,
              'col-6': `不合法 ${index + 1}`,
              'col-7': `右侧固定2 ${index + 1}`,
            })),
          },
        });

        await delay(20);

        const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;
        const cells = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-cell'));

        // left

        expect(tableWrap.scrollLeft).toBe(0);
        expect(tableWrap.scrollWidth > tableWrap.clientWidth).toBe(true);
        cells.forEach((cell, index) => {
          const colIndex = index % columns.length;
          const fixed = columns[colIndex].fixed;

          if (fixed === true || fixed === 'left') {
            expect(cell.classList).toContain('mixte-gt-cell-fix');
            expect(cell.classList).toContain('mixte-gt-cell-fix-left');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-left-active');
          }
          else if (fixed === 'right') {
            expect(cell.classList).toContain('mixte-gt-cell-fix');
            expect(cell.classList).toContain('mixte-gt-cell-fix-right');
            expect(cell.classList).toContain('mixte-gt-cell-fix-right-active');
          }
          else {
            expect(cell.classList).not.toContain('mixte-gt-cell-fix');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-left');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-right');
          }
        });

        // center

        tableWrap.scrollLeft = 150;
        await delay(20);

        cells.forEach((cell, index) => {
          const colIndex = index % columns.length;
          const fixed = columns[colIndex].fixed;

          if (fixed === true || fixed === 'left') {
            expect(cell.classList).toContain('mixte-gt-cell-fix');
            expect(cell.classList).toContain('mixte-gt-cell-fix-left');
            expect(cell.classList).toContain('mixte-gt-cell-fix-left-active');
          }
          else if (fixed === 'right') {
            expect(cell.classList).toContain('mixte-gt-cell-fix');
            expect(cell.classList).toContain('mixte-gt-cell-fix-right');
            expect(cell.classList).toContain('mixte-gt-cell-fix-right-active');
          }
          else {
            expect(cell.classList).not.toContain('mixte-gt-cell-fix');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-left');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-right');
          }
        });

        // right

        tableWrap.scrollLeft = tableWrap.scrollWidth - tableWrap.clientWidth;
        await delay(20);

        cells.forEach((cell, index) => {
          const colIndex = index % columns.length;
          const fixed = columns[colIndex].fixed;

          if (fixed === true || fixed === 'left') {
            expect(cell.classList).toContain('mixte-gt-cell-fix');
            expect(cell.classList).toContain('mixte-gt-cell-fix-left');
            expect(cell.classList).toContain('mixte-gt-cell-fix-left-active');
          }
          else if (fixed === 'right') {
            expect(cell.classList).toContain('mixte-gt-cell-fix');
            expect(cell.classList).toContain('mixte-gt-cell-fix-right');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-right-active');
          }
          else {
            expect(cell.classList).not.toContain('mixte-gt-cell-fix');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-left');
            expect(cell.classList).not.toContain('mixte-gt-cell-fix-right');
          }
        });
      });

      describe('表格上的固定列样式变量', async () => {
        it('单侧单个固定列, 无固定列样式变量', async () => {
          const columns = defineTableColumns([
            { field: 'col-1', width: 150,   fixed: 'left',      title: '左侧固定' },
            { field: 'col-2', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-3', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-4', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-5', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-6', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-7', width: 150,   fixed: 'right',     title: '右侧固定'  },
          ]);

          render(MixteGridTable, {
            props: { // @ts-expect-error
              columns,
              data: Array.from({ length: 10 }).map(() => ({
                'col-1': randomString(random(1, 6)),
                'col-2': randomString(random(1, 6)),
                'col-3': randomString(random(1, 6)),
                'col-4': randomString(random(1, 6)),
                'col-5': randomString(random(1, 6)),
                'col-6': randomString(random(1, 6)),
                'col-7': randomString(random(1, 6)),
              })),
            },
          });

          await delay(20);

          const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;
          const cells = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-cell'));

          expect(tableWrap.attributeStyleMap.get('--mixte-gt-fix-left-column-0-width')).toBe(null);
          expect(tableWrap.attributeStyleMap.get('--mixte-gt-fix-right-column-0-width')).toBe(null);

          cells.forEach((cell, index) => {
            const colIndex = index % columns.length;
            const field = columns[colIndex].field;

            switch (field) {
              // 左侧固定
              case 'col-1':
                expect(cell.attributeStyleMap.get('left')!.toString()).toBe('0px');
                break;
              // 右侧固定
              case 'col-7':
                expect(cell.attributeStyleMap.get('right')!.toString()).toBe('0px');
                break;
              // 未配置
              default:
                expect(cell.attributeStyleMap.get('left')).toBe(null);
            }
          });
        });

        it('单侧各两个固定列, 各 n-1 个固定列样式变量', async () => {
          const columns = defineTableColumns([
            { field: 'col-1', width: 150,   fixed: 'left',      title: '左侧固定' },
            { field: 'col-2', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-3', width: 150,   fixed: 'left',      title: '左侧固定2' },
            { field: 'col-4', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-5', width: 150,   fixed: 'right',     title: '右侧固定2' },
            { field: 'col-6', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-7', width: 150,   fixed: 'right',     title: '右侧固定'  },
          ]);

          render(MixteGridTable, {
            props: { // @ts-expect-error
              columns,
              data: Array.from({ length: 10 }).map(() => ({
                'col-1': randomString(random(1, 6)),
                'col-2': randomString(random(1, 6)),
                'col-3': randomString(random(1, 6)),
                'col-4': randomString(random(1, 6)),
                'col-5': randomString(random(1, 6)),
                'col-6': randomString(random(1, 6)),
                'col-7': randomString(random(1, 6)),
              })),
            },
          });

          await delay(20);

          const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;
          const ths = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-th'));
          const cells = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-cell'));

          const left0 = Number.parseInt(tableWrap.attributeStyleMap.get('--mixte-gt-fix-left-column-0-width')!.toString());
          const right0 = Number.parseInt(tableWrap.attributeStyleMap.get('--mixte-gt-fix-right-column-0-width')!.toString());

          expect(Math.abs(left0 - ths.at(0)!.clientWidth)).toBeLessThanOrEqual(1);
          expect(Math.abs(right0 - ths.at(-1)!.clientWidth)).toBeLessThanOrEqual(1);
          expect(tableWrap.attributeStyleMap.get('--mixte-gt-fix-left-column-1-width')).toBe(null);
          expect(tableWrap.attributeStyleMap.get('--mixte-gt-fix-right-column-1-width')).toBe(null);

          cells.forEach((cell, index) => {
            const colIndex = index % columns.length;
            const field = columns[colIndex].field;

            switch (field) {
              // 左侧固定
              case 'col-1':
                expect(cell.attributeStyleMap.get('left')!.toString()).toBe('0px');
                break;
              // 左侧固定2
              case 'col-3':
                expect(cell.attributeStyleMap.get('left')!.toString()).toBe('calc(var(--mixte-gt-fix-left-column-0-width))');
                break;
              // 右侧固定2
              case 'col-5':
                expect(cell.attributeStyleMap.get('right')!.toString()).toBe('calc(var(--mixte-gt-fix-right-column-0-width))');
                break;
              // 右侧固定
              case 'col-7':
                expect(cell.attributeStyleMap.get('right')!.toString()).toBe('0px');
                break;
              // 未配置
              default:
                expect(cell.attributeStyleMap.get('left')).toBe(null);
            }
          });
        });

        it('单侧各三个固定列, 各 n-1 个固定列样式变量', async () => {
          const columns = defineTableColumns([
            { field: 'col-1', width: 150,   fixed: 'left',      title: '左侧固定' },
            { field: 'col-2', width: 150,   fixed: 'left',      title: '左侧固定2' },
            { field: 'col-3', width: 150,   fixed: 'left',      title: '左侧固定3' },
            { field: 'col-4', width: 150,   fixed: undefined,   title: '未配置' },
            { field: 'col-5', width: 150,   fixed: 'right',     title: '右侧固定3' },
            { field: 'col-6', width: 150,   fixed: 'right',     title: '右侧固定2' },
            { field: 'col-7', width: 150,   fixed: 'right',     title: '右侧固定'  },
          ]);

          render(MixteGridTable, {
            props: { // @ts-expect-error
              columns,
              data: Array.from({ length: 10 }).map(() => ({
                'col-1': randomString(random(1, 6)),
                'col-2': randomString(random(1, 6)),
                'col-3': randomString(random(1, 6)),
                'col-4': randomString(random(1, 6)),
                'col-5': randomString(random(1, 6)),
                'col-6': randomString(random(1, 6)),
                'col-7': randomString(random(1, 6)),
              })),
            },
          });

          await delay(20);

          const tableWrap = page.getByClass('mixte-gt-wrap').query() as HTMLDivElement;
          const ths = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-th'));
          const cells = Array.from(tableWrap.querySelectorAll<HTMLDivElement>('.mixte-gt-cell'));

          const left0 = Number.parseInt(tableWrap.attributeStyleMap.get('--mixte-gt-fix-left-column-0-width')!.toString());
          const left1 = Number.parseInt(tableWrap.attributeStyleMap.get('--mixte-gt-fix-left-column-1-width')!.toString());
          const right0 = Number.parseInt(tableWrap.attributeStyleMap.get('--mixte-gt-fix-right-column-0-width')!.toString());
          const right1 = Number.parseInt(tableWrap.attributeStyleMap.get('--mixte-gt-fix-right-column-1-width')!.toString());

          expect(Math.abs(left0 - ths.at(0)!.clientWidth)).toBeLessThanOrEqual(1);
          expect(Math.abs(left1 - ths.at(1)!.clientWidth)).toBeLessThanOrEqual(1);
          expect(Math.abs(right0 - ths.at(-1)!.clientWidth)).toBeLessThanOrEqual(1);
          expect(Math.abs(right1 - ths.at(-2)!.clientWidth)).toBeLessThanOrEqual(1);
          expect(tableWrap.attributeStyleMap.get('--mixte-gt-fix-left-column-2-width')).toBe(null);
          expect(tableWrap.attributeStyleMap.get('--mixte-gt-fix-right-column-2-width')).toBe(null);

          cells.forEach((cell, index) => {
            const colIndex = index % columns.length;
            const field = columns[colIndex].field;

            switch (field) {
              // 左侧固定
              case 'col-1':
                expect(cell.attributeStyleMap.get('left')!.toString()).toBe('0px');
                break;
              // 左侧固定2
              case 'col-2':
                expect(cell.attributeStyleMap.get('left')!.toString()).toBe('calc(var(--mixte-gt-fix-left-column-0-width))');
                break;
              // 左侧固定3
              case 'col-3':
                expect(cell.attributeStyleMap.get('left')!.toString()).toBe('calc(var(--mixte-gt-fix-left-column-0-width)+var(--mixte-gt-fix-left-column-1-width))');
                break;
              // 右侧固定3
              case 'col-5':
                expect(cell.attributeStyleMap.get('right')!.toString()).toBe('calc(var(--mixte-gt-fix-right-column-0-width)+var(--mixte-gt-fix-right-column-1-width))');
                break;
              // 右侧固定2
              case 'col-6':
                expect(cell.attributeStyleMap.get('right')!.toString()).toBe('calc(var(--mixte-gt-fix-right-column-0-width))');
                break;
              // 右侧固定
              case 'col-7':
                expect(cell.attributeStyleMap.get('right')!.toString()).toBe('0px');
                break;
              // 未配置
              default:
                expect(cell.attributeStyleMap.get('left')).toBe(null);
            }
          });
        });
      });
    });
  });
});

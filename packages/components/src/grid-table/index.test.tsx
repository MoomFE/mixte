/* eslint-disable style/no-multi-spaces */
/* eslint-disable antfu/consistent-chaining */

import type { User } from '@/types';
import type { GridTableColumn, RenderHeaderProps, RenderProps } from '@mixte/components/grid-table/types';
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers';
import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
import { mount } from '@vue/test-utils';
import { delay, isFunction } from 'mixte';

export type TestUser = Pick<User, 'id' | 'name' | 'nameEn' | 'age' | 'gender' | 'genderValue' | 'email' | 'address' | 'status' | 'statusValue'>;

export function createData() {
  return [
    { id: '1', name: '孙强', nameEn: 'Ruth Young', age: 25, gender: '未知', genderValue: -1, email: 'g.kjps@eqvtep.hr', address: '福建省 龙岩市 漳平市', status: '启用', statusValue: 1 },
    { id: '2', name: '戴杰', nameEn: 'Donald Jones', age: 18, gender: '男', genderValue: 1, email: 'y.pdwluvms@dpg.mt', address: '天津 天津市 河东区', status: '启用', statusValue: 1 },
    { id: '3', name: '程杰', nameEn: 'Anna Thomas', age: 33, gender: '男', genderValue: 1, email: 'w.qsft@iaxstqdhv.nz', address: '吉林省 白山市 长白朝鲜族自治县', status: '启用', statusValue: 1 },
    { id: '4', name: '李磊', nameEn: 'Angela Miller', age: 36, gender: '女', genderValue: 2, email: 'i.dwjrx@uoqfuu.za', address: '云南省 怒江傈僳族自治州 贡山独龙族怒族自治县', status: '启用', statusValue: 1 },
    { id: '5', name: '程敏', nameEn: 'Anthony Thompson', age: 31, gender: '男', genderValue: 1, email: 'i.sjhofydv@ibffkqih.ev', address: '宁夏回族自治区 固原市 西吉县', status: '禁用', statusValue: -1 },
    { id: '6', name: '江敏', nameEn: 'Ruth Williams', age: 36, gender: '女', genderValue: 2, email: 'd.icv@mfrg.ls', address: '湖北省 鄂州市 华容区', status: '启用', statusValue: 1 },
    { id: '7', name: '吕秀兰', nameEn: 'Anthony Lopez', age: 48, gender: '女', genderValue: 2, email: 'b.mvigxw@mndgc.hu', address: '云南省 昆明市 宜良县', status: '启用', statusValue: 1 },
    { id: '8', name: '李洋', nameEn: 'John Johnson', age: 53, gender: '男', genderValue: 1, email: 's.orx@lrdnh.de', address: '西藏自治区 那曲地区 申扎县', status: '启用', statusValue: 1 },
    { id: '9', name: '田娜', nameEn: 'Angela Lopez', age: 28, gender: '未知', genderValue: -1, email: 'q.egysrajl@ucnzijy.jo', address: '河北省 沧州市 孟村回族自治县', status: '禁用', statusValue: -1 },
    { id: '10', name: '苏明', nameEn: 'Patricia Hall', age: 49, gender: '男', genderValue: 1, email: 'u.fggbxkqo@fqpgxdrh.ug', address: '甘肃省 定西市 其它区', status: '禁用', statusValue: -1 },
  ] as TestUser[];
}

export function createColumns() {
  return defineTableColumns<TestUser>([
    { field: 'index', title: '#', align: 'center', render: ({ index }) => index + 1 },
    { field: 'name', title: '姓名', render: ({ value, record }) => `${value} (${record.nameEn})` },
    { field: 'age', title: '年龄', align: 'center' },
    { field: 'gender', title: '性别', align: 'center' },
    { field: 'email', title: '邮箱' },
    { field: 'address', title: '地址' },
    { field: 'status', title: '状态', align: 'center' },
  ]);
}

/**
 * 表格结构获取
 */
function getTableStructure<
  Fields extends Record<string, any> = TestUser,
>(
  options?: Parameters<typeof mount<typeof MixteGridTable<Fields>>>['1'],
) {
  const expandedRowKeys = ref<string[]>([]);

  const vm = mount(MixteGridTable<Fields>, {
    ...options,
    props: {
      ...options?.props,
      'expandedRowKeys': expandedRowKeys.value,
      'onUpdate:expandedRowKeys': (keys: string[]) => expandedRowKeys.value = keys,
    },
  });

  const getTableWrap = () => vm.find<HTMLDivElement>('.mixte-gt-wrap');
  const getTable = () => vm.find<HTMLDivElement>('.mixte-gt');
  const getTableThs = () => vm.findAll<HTMLDivElement>('.mixte-gt-th.mixte-gt-cell');
  const getTableTds = () => vm.findAll<HTMLDivElement>('.mixte-gt-td.mixte-gt-cell');
  const getTableLoading = () => vm.find<HTMLDivElement>('.mixte-gt-wrap > .mixte-gt-loading-wrap');
  const getTableEmptyWrap = () => vm.find<HTMLDivElement>('.mixte-gt-wrap > .mixte-gt > .mixte-gt-empty-wrap');

  const tableWrap = getTableWrap();
  const table = getTable();
  const tableThs = getTableThs();
  const tableTds = getTableTds();
  const tableLoading = getTableLoading();
  const tableEmptyWrap = getTableEmptyWrap();

  // 包裹层
  expect(tableWrap.exists()).toBe(true);
  expect(tableWrap.element).toBe(vm.element);

  // 主体
  expect(table.exists()).toBe(true);
  expect(table.element).toBe(tableWrap.element.firstElementChild);

  // 传入 loading 时, 包裹层下会渲染加载中部分
  if (options?.props?.loading) {
    expect(tableWrap.element.children.length).toBe(2);
    expect(tableLoading.exists()).toBe(true);
    expect(tableLoading.element).toBe(tableWrap.element.lastElementChild);
  }
  // 包裹层下只有主体部分
  else {
    expect(tableWrap.element.children.length).toBe(1);
  }

  const columns = options?.props?.columns?.filter((column) => {
    const visible = column.visible ?? true;
    if (isFunction(visible) ? !visible({ column }) : !visible) return false;

    const hidden = column.hidden ?? false;
    if (isFunction(hidden) ? hidden({ column }) : hidden) return false;

    return true;
  });

  // 表头
  if (columns?.length) {
    expect(tableThs.length).toBe(columns.length);
  }
  else {
    expect(tableThs.length).toBe(0);
  }

  // 表体 & 无数据部分
  if (!!columns?.length && !!options?.props?.data?.length) {
    // 表体
    if (!columns.some(column => column.colSpan || column.rowSpan)) {
      expect(tableTds.length).toBe(columns.length * options.props.data.length);
    }
    // 无数据部分
    expect(tableEmptyWrap.exists()).toBe(false);
  }
  else {
    // 表体
    expect(tableTds.length).toBe(0);
    // 无数据部分
    expect(tableEmptyWrap.exists()).toBe(true);
    expect(tableEmptyWrap.element).toBe(table.element.lastElementChild);
  }

  /**
   * 测试树形数据结构
   */
  function testTreeStructure() {
    const data = options?.props?.data;

    if (!columns?.length || !data?.length)
      return;

    const isExpandVisible = data.some(item => item.children?.length);
    const expandColumnKey = vm.props().expandColumnKey ?? columns[0].field;
    const expandColumnIndex = columns.findIndex(column => column.field === expandColumnKey);

    const finalData: typeof data = [];
    let dataLength = data.length;

    (function loop(children = data) {
      children.forEach((item) => {
        finalData.push(item);
        if (item.children?.length && expandedRowKeys.value.includes(item.id)) {
          dataLength += item.children.length;
          loop(item.children);
        }
      });
    })();

    if (!columns.some(column => column.colSpan || column.rowSpan)) {
      expect(getTableTds().length).toBe(dataLength * columns.length);
    }

    if (isExpandVisible && expandColumnIndex > -1) {
      expect(tableWrap.findAll('.mixte-gt-cell-expand').length).toBe(dataLength);
      expect(tableWrap.findAll('.mixte-gt-cell-expand-btn').length).toBe(dataLength);
      expect(tableWrap.findAll('.mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced)').length).toBe(finalData.filter(item => item.children?.length).length);
      expect(tableWrap.findAll('.mixte-gt-cell-expand-btn.mixte-gt-cell-expand-btn-spaced').length).toBe(finalData.filter(item => !item.children?.length).length);
    }
    else {
      expect(tableWrap.findAll('.mixte-gt-cell-expand').length).toBe(0);
      expect(tableWrap.findAll('.mixte-gt-cell-expand-btn').length).toBe(0);
      expect(tableWrap.findAll('.mixte-gt-cell-expand-btn.mixte-gt-cell-expand-btn-spaced').length).toBe(0);
    }

    isExpandVisible && getTableTds().forEach((td, index) => {
      const columnIndex = index % columns.length;
      const rowIndex = Math.floor(index / columns.length);
      const column = columns[columnIndex];
      const item = finalData[rowIndex];

      if (columnIndex === expandColumnIndex) {
        expect(td.classes()).toContain('mixte-gt-cell-expand');
        expect(td.element.dataset.field).toBe(column.field);
        expect(td.find('.mixte-gt-cell-expand-btn').exists()).toBe(true);
        expect(td.text()).toBe(item[expandColumnKey]);

        if (item.children?.length) {
          expect(td.find('.mixte-gt-cell-expand-btn').exists()).toBe(true);
          expect(td.find('.mixte-gt-cell-expand-btn-collapsed').exists()).toBe(!expandedRowKeys.value.includes(item.id));
          expect(td.find('.mixte-gt-cell-expand-btn-expanded').exists()).toBe(expandedRowKeys.value.includes(item.id));
          expect(td.find('.mixte-gt-cell-expand-btn.mixte-gt-cell-expand-btn-spaced').exists()).toBe(false);
        }
        else {
          expect(td.find('.mixte-gt-cell-expand-btn').exists()).toBe(true);
          expect(td.find('.mixte-gt-cell-expand-btn-collapsed').exists()).toBe(false);
          expect(td.find('.mixte-gt-cell-expand-btn-expanded').exists()).toBe(false);
          expect(td.find('.mixte-gt-cell-expand-btn.mixte-gt-cell-expand-btn-spaced').exists()).toBe(true);
        }
      }
    });
  }

  testTreeStructure();

  return {
    vm,
    tableWrap,
    table,

    expandedRowKeys,

    getTableWrap,
    getTable,
    getTableThs,
    getTableTds,
    getTableLoading,
    getTableEmptyWrap,

    testTreeStructure,
  };
}

describe('grid-table', () => {
  it('未传任何参数时, 不渲染表头和表体, 会渲染无数据部分', () => {
    const { table, getTableThs, getTableTds, getTableEmptyWrap } = getTableStructure();

    // 没有表头表体
    expect(getTableThs().length).toBe(0);
    expect(getTableTds().length).toBe(0);

    // 主体下只有无数据部分
    expect(table.element.children.length).toBe(1);
    expect(getTableEmptyWrap().exists()).toBe(true);
  });

  it('仅传入表格列配置, 不渲染表体, 会渲染表头和无数据部分', () => {
    const columns = createColumns();
    const { table, getTableThs, getTableTds, getTableEmptyWrap } = getTableStructure({
      props: {
        columns,
      },
    });

    // 有表头, 没有表体
    expect(getTableThs().length).toBe(columns.length);
    expect(getTableTds().length).toBe(0);

    // 主体下有表头和无数据部分
    expect(table.element.children.length).toBe(columns.length + 1);
    expect(getTableEmptyWrap().exists()).toBe(true);
    expect(Array.from(table.element.children)).toStrictEqual([
      ...getTableThs().map(th => th.element),
      getTableEmptyWrap().element,
    ]);
  });

  it('仅传入数据源, 不渲染表头和表体, 会渲染无数据部分', () => {
    const { table, getTableThs, getTableTds, getTableEmptyWrap } = getTableStructure({
      props: {
        data: createData(),
      },
    });

    // 没有表头表体
    expect(getTableThs().length).toBe(0);
    expect(getTableTds().length).toBe(0);

    // 主体下只有无数据部分
    expect(table.element.children.length).toBe(1);
    expect(getTableEmptyWrap().exists()).toBe(true);
  });

  it('传入表格列配置和数据源, 渲染表头和表体, 无数据部分不渲染', () => {
    const columns = createColumns();
    const data = createData();
    const { tableWrap, table, getTableThs, getTableTds } = getTableStructure({
      props: {
        columns,
        data,
      },
    });

    // 包裹层下只有主体部分
    expect(tableWrap.element.children.length).toBe(1);

    // 主体下有表头和表体
    expect(table.element.children.length).toBe(columns.length + columns.length * data.length);
    expect(Array.from(table.element.children)).toStrictEqual([
      ...getTableTds().map(td => td.element),
      ...getTableThs().map(th => th.element),
    ]);
  });

  it('传入 loading, 会渲染加载中部分', async () => {
    const { vm, tableWrap, table, getTableLoading } = getTableStructure({
      props: {
        loading: true,
      },
    });

    expect(tableWrap.element.children.length).toBe(2);
    expect(table.element.nextElementSibling).toBe(getTableLoading().element);

    await vm.setProps({ loading: false });

    expect(tableWrap.element.children.length).toBe(1);
    expect(getTableLoading().exists()).toBe(false);

    await vm.setProps({ loading: true });

    expect(tableWrap.element.children.length).toBe(2);
    expect(getTableLoading().exists()).toBe(true);
  });

  it('单元格上的 data-* 自定义属性', () => {
    const columns = createColumns();
    const data = createData();

    const { getTableThs, getTableTds } = getTableStructure({
      props: {
        columns,
        data,
      },
    });

    const ths = getTableThs();
    const tds = getTableTds();

    ths.forEach((th, index) => {
      const column = columns[index];

      expect(th.attributes('data-field')).toBe(column.field);
    });

    tds.forEach((td, index) => {
      const columnIndex = index % columns.length;
      const rowIndex = Math.floor(index / columns.length);
      const column = columns[columnIndex];

      expect(td.attributes('data-field')).toBe(column.field);
      expect(td.attributes('data-index')).toBe(String(rowIndex));
    });
  });

  it('单元格上的样式类', () => {
    const columns = createColumns();
    const data = createData();

    const { getTableThs, getTableTds } = getTableStructure({
      props: {
        columns,
        data,
      },
    });

    const ths = getTableThs();
    const tds = getTableTds();

    ths.forEach((th, index) => {
      const colIndex = index % columns.length;

      expect(th.classes()).toEqual(expect.arrayContaining(['mixte-gt-th', 'mixte-gt-cell']));

      if (colIndex === 0) {
        expect(th.classes()).toContain('mixte-gt-cell-first');
      }
      if (colIndex === columns.length - 1) {
        expect(th.classes()).toContain('mixte-gt-cell-last');
      }
    });

    tds.forEach((td, index) => {
      const colIndex = index % columns.length;

      expect(td.classes()).toEqual(expect.arrayContaining(['mixte-gt-td', 'mixte-gt-cell']));

      if (colIndex === 0) {
        expect(td.classes()).toContain('mixte-gt-cell-first');
      }
      if (colIndex === columns.length - 1) {
        expect(td.classes()).toContain('mixte-gt-cell-last');
      }
    });
  });

  describe('树形数据', () => {
    function createTreeColumns() {
      return defineTableColumns([
        { field: 'col-1', title: 'Col 1' },
        { field: 'col-2', title: 'Col 2' },
        { field: 'col-3', title: 'Col 3' },
      ]);
    }

    function createTreeData() {
      return [
        {
          'id': '1',
          'col-1': '1-1',
          'col-2': '1-2',
          'col-3': '1-3',
          'children': [
            { 'id': '2', 'col-1': '1-1-1', 'col-2': '1-1-2', 'col-3': '1-1-3' },
            { 'id': '3', 'col-1': '1-2-1', 'col-2': '1-2-2', 'col-3': '1-2-3' },
          ],
        },
        { 'id': '4', 'col-1': '2-1', 'col-2': '2-2', 'col-3': '2-3' },
        {
          'id': '5',
          'col-1': '3-1',
          'col-2': '3-2',
          'col-3': '3-3',
          'children': [{
            'id': '6',
            'col-1': '3-1-1',
            'col-2': '3-1-2',
            'col-3': '3-1-3',
            'children': [{ 'id': '7', 'col-1': '3-1-1-1', 'col-2': '3-1-1-2', 'col-3': '3-1-1-3' }],
          }],
        },
        { 'id': '8', 'col-1': '4-1', 'col-2': '4-2', 'col-3': '4-3' },
        { 'id': '9', 'col-1': '5-1', 'col-2': '5-2', 'col-3': '5-3' },
      ];
    }

    it('使用 expandColumnKey 修改显示展开按钮的列主键', async () => {
      const columns = createTreeColumns();
      const data = createTreeData();
      const { vm, tableWrap, testTreeStructure } = getTableStructure({
        props: {
          columns,
          data,
        },
      });

      await vm.setProps({ expandColumnKey: 'col-2' });
      testTreeStructure();
      expect(tableWrap.findAll('.mixte-gt-cell-expand').length).toBe(data.length);
      expect(tableWrap.findAll('.mixte-gt-cell-expand[data-field="col-2"]').length).toBe(data.length);

      await vm.setProps({ expandColumnKey: 'col-3' });
      testTreeStructure();
      expect(tableWrap.findAll('.mixte-gt-cell-expand').length).toBe(data.length);
      expect(tableWrap.findAll('.mixte-gt-cell-expand[data-field="col-3"]').length).toBe(data.length);

      await vm.setProps({ expandColumnKey: 'col-1' });
      testTreeStructure();
      expect(tableWrap.findAll('.mixte-gt-cell-expand').length).toBe(data.length);
      expect(tableWrap.findAll('.mixte-gt-cell-expand[data-field="col-1"]').length).toBe(data.length);

      await vm.setProps({ expandColumnKey: 'xxx' });
      testTreeStructure();
      expect(tableWrap.findAll('.mixte-gt-cell-expand').length).toBe(0);
    });

    it('自定义层级缩进宽度', async () => {
      const columns = createTreeColumns();
      const data = createTreeData();

      const { vm, expandedRowKeys } = getTableStructure({
        props: {
          columns,
          data,
        },
      });

      function getExpandBtn(index: number) {
        return (vm.find(`.mixte-gt-cell-expand[data-index="${index}"] > .mixte-gt-cell-expand-btn`).element as HTMLDivElement);
      }

      expect(expandedRowKeys.value).toEqual([]);
      await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="2"] > .mixte-gt-cell-expand-btn`).trigger('click');
      await delay(20);
      expect(expandedRowKeys.value).toEqual(['5']);
      await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="3"] > .mixte-gt-cell-expand-btn`).trigger('click');
      await delay(20);
      expect(expandedRowKeys.value).toEqual(['5', '6']);

      // 默认
      expect(getExpandBtn(0).style.marginLeft).toBe('0px');
      expect(getExpandBtn(1).style.marginLeft).toBe('0px');
      expect(getExpandBtn(2).style.marginLeft).toBe('0px');
      expect(getExpandBtn(3).style.marginLeft).toBe('15px');
      expect(getExpandBtn(4).style.marginLeft).toBe('30px');
      expect(getExpandBtn(5).style.marginLeft).toBe('0px');
      expect(getExpandBtn(6).style.marginLeft).toBe('0px');

      // 自定义
      await vm.setProps({
        expandedIndent: 20,
      });
      await delay(20);
      expect(getExpandBtn(0).style.marginLeft).toBe('0px');
      expect(getExpandBtn(1).style.marginLeft).toBe('0px');
      expect(getExpandBtn(2).style.marginLeft).toBe('0px');
      expect(getExpandBtn(3).style.marginLeft).toBe('20px');
      expect(getExpandBtn(4).style.marginLeft).toBe('40px');
      expect(getExpandBtn(5).style.marginLeft).toBe('0px');
      expect(getExpandBtn(6).style.marginLeft).toBe('0px');

      // 负数
      await vm.setProps({
        expandedIndent: -10,
      });
      await delay(20);
      expect(getExpandBtn(0).style.marginLeft).toBe('0px');
      expect(getExpandBtn(1).style.marginLeft).toBe('0px');
      expect(getExpandBtn(2).style.marginLeft).toBe('0px');
      expect(getExpandBtn(3).style.marginLeft).toBe('15px');
      expect(getExpandBtn(4).style.marginLeft).toBe('30px');
      expect(getExpandBtn(5).style.marginLeft).toBe('0px');
      expect(getExpandBtn(6).style.marginLeft).toBe('0px');

      // 不合法
      await vm.setProps({
        expandedIndent: 'xxx' as any,
      });
      await delay(20);
      expect(getExpandBtn(0).style.marginLeft).toBe('0px');
      expect(getExpandBtn(1).style.marginLeft).toBe('0px');
      expect(getExpandBtn(2).style.marginLeft).toBe('0px');
      expect(getExpandBtn(3).style.marginLeft).toBe('15px');
      expect(getExpandBtn(4).style.marginLeft).toBe('30px');
      expect(getExpandBtn(5).style.marginLeft).toBe('0px');
      expect(getExpandBtn(6).style.marginLeft).toBe('0px');
    });

    it('树形数据行的展开/收起', async () => {
      const columns = createTreeColumns();
      const data = createTreeData();
      const { vm, expandedRowKeys, testTreeStructure } = getTableStructure({
        props: {
          columns,
          data,
        },
      });

      // 初始状态
      {
        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(5);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');

        expect(expandedRowKeys.value).toEqual([]);
      }

      // 展开第一个
      {
        await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="0"] > .mixte-gt-cell-expand-btn`).trigger('click');
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('4');

        expect(expandedRowKeys.value).toEqual(['1']);
      }

      // 收起第一个
      {
        await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="0"] > .mixte-gt-cell-expand-btn`).trigger('click');
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');

        expect(expandedRowKeys.value).toEqual([]);
      }

      // 展开第三个
      {
        await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="2"] > .mixte-gt-cell-expand-btn`).trigger('click');
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(3);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');
        expect(expandIcons[2].text()).toBe('3-1-1');
        expect(expandIcons[2].attributes('data-index')).toBe('3');

        expect(expandedRowKeys.value).toEqual(['5']);
      }

      // 展开第三个的子级
      {
        await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="3"] > .mixte-gt-cell-expand-btn`).trigger('click');
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(3);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');
        expect(expandIcons[2].text()).toBe('3-1-1');
        expect(expandIcons[2].attributes('data-index')).toBe('3');

        expect(expandedRowKeys.value).toEqual(['5', '6']);
      }

      // 收起第三个
      {
        await vm.find(`.mixte-gt-cell-expand[data-field="col-1"][data-index="2"] > .mixte-gt-cell-expand-btn`).trigger('click');
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');

        expect(expandedRowKeys.value).toEqual(['6']);
      }
    });

    it('通过 expandedRowKeys 双向绑定展开的行', async () => {
      const columns = createTreeColumns();
      const data = createTreeData();
      const { vm, expandedRowKeys, testTreeStructure } = getTableStructure({
        props: {
          columns,
          data,
        },
      });

      // 初始状态
      expect(expandedRowKeys.value).toEqual([]);

      // 展开第一个
      {
        expandedRowKeys.value.push('1');
        vm.setProps({
          expandedRowKeys: expandedRowKeys.value,
        });
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('4');
      }

      // 收起第一个
      {
        expandedRowKeys.value.splice(0, 1);
        vm.setProps({
          expandedRowKeys: expandedRowKeys.value,
        });
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');
      }

      // 展开第三个
      {
        expandedRowKeys.value.push('5');
        vm.setProps({
          expandedRowKeys: expandedRowKeys.value,
        });
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(3);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');
        expect(expandIcons[2].text()).toBe('3-1-1');
        expect(expandIcons[2].attributes('data-index')).toBe('3');
      }

      // 展开第三个的子级
      {
        expandedRowKeys.value.push('6');
        vm.setProps({
          expandedRowKeys: expandedRowKeys.value,
        });
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(3);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');
        expect(expandIcons[2].text()).toBe('3-1-1');
        expect(expandIcons[2].attributes('data-index')).toBe('3');
      }

      // 收起第三个
      {
        expandedRowKeys.value.splice(0, 1);
        vm.setProps({
          expandedRowKeys: expandedRowKeys.value,
        });
        await delay(20);
        testTreeStructure();

        const expandIcons = vm.findAll(`.mixte-gt-cell-expand:has(> .mixte-gt-cell-expand-btn:not(.mixte-gt-cell-expand-btn-spaced))`);

        expect(expandIcons.length).toBe(2);
        expect(expandIcons[0].text()).toBe('1-1');
        expect(expandIcons[0].attributes('data-index')).toBe('0');
        expect(expandIcons[1].text()).toBe('3-1');
        expect(expandIcons[1].attributes('data-index')).toBe('2');
      }
    });

    it('切换数据时, expandedRowKeys 会自动移除掉不在新数据中的 keys', async () => {
      const { vm, expandedRowKeys } = getTableStructure({
        props: {
          columns: createTreeColumns(),
          data: createTreeData(),
        },
      });

      vm.vm.expandAllRows();
      expect(expandedRowKeys.value).toEqual(['1', '5', '6']);

      await vm.setProps({
        data: [createTreeData()[0]],
      });

      expect(expandedRowKeys.value).toEqual(['1']);

      await vm.setProps({
        data: createTreeData(),
      });

      expect(expandedRowKeys.value).toEqual(['1']);

      await vm.setProps({
        data: [],
      });

      expect(expandedRowKeys.value).toEqual([]);
    });

    it('当 expandedRowKeys 中出现非树形数据的 keys 时, 会自动移除掉', async () => {
      const { vm, expandedRowKeys } = getTableStructure({
        props: {
          columns: createTreeColumns(),
          data: createTreeData(),
        },
      });

      expandedRowKeys.value = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      vm.setProps({
        expandedRowKeys: expandedRowKeys.value,
      });

      await delay(20);
      expect(expandedRowKeys.value).toEqual(['1', '5', '6']);
    });

    it('使用对外导出的 expandAllRows / expandRows / collapseAllRows / collapseRows 方法展开/折叠行', async () => {
      const { vm, expandedRowKeys, testTreeStructure } = getTableStructure({
        props: {
          columns: createTreeColumns(),
          data: createTreeData(),
        },
      });

      expect(expandedRowKeys.value).toEqual([]);
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(5);

      // 展开所有行

      vm.vm.expandAllRows();
      expect(expandedRowKeys.value).toEqual(['1', '5', '6']);
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(5);

      await delay(20);
      testTreeStructure();
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(9);

      // 折叠所有行

      vm.vm.collapseAllRows();
      expect(expandedRowKeys.value).toEqual([]);
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(9);

      await delay(20);
      testTreeStructure();
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(5);

      // 展开指定行

      vm.vm.expandRows(['1', '2', '3', '4', '5', '7', '8', '9']);
      expect(expandedRowKeys.value).toEqual(['1', '5']);
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(5);

      await delay(20);
      testTreeStructure();
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(8);

      // 折叠指定行

      vm.vm.collapseRows(['1', '2', '3', '4', '6', '7', '8', '9']);
      expect(expandedRowKeys.value).toEqual(['5']);

      await delay(20);
      testTreeStructure();
      expect(vm.findAll('.mixte-gt-cell-expand').length).toBe(6);
    });
  });

  describe('插槽', () => {
    describe('指定字段单元格插槽 & 通用字段单元格插槽', () => {
      const columns = createColumns();
      const data = createData();

      const nameSlot = vi.fn(({ value }: RenderProps<TestUser>) => {
        return `name: ${value}`;
      });

      const genderSlot = vi.fn(({ value, record }: RenderProps<TestUser>) => {
        return <div class="custem-gender" data-gender-value={record.genderValue}>{value}</div>;
      });

      const commonSlot = vi.fn(({ value }: RenderProps<TestUser>) => {
        return `common: ${value}`;
      });

      const { getTableTds } = getTableStructure({
        props: {
          columns,
          data,
        },
        slots: {
          'cell-name': nameSlot,
          'cell-gender': genderSlot,
          'cell': commonSlot,
        },
      });

      it('优先级', () => {
        getTableTds().forEach((td, index) => {
          const colIndex = index % columns.length;
          const column = columns[colIndex];
          const item = data[Math.floor(index / columns.length)];

          // render 函数的渲染方式比插槽优先级高
          if (column.field === 'name') {
            expect(td.text()).toBe(`${item.name} (${item.nameEn})`);
          }
          // 指定字段单元格插槽优先级第二
          else if (column.field === 'gender') {
            expect(td.text()).toBe(item.gender);
            expect(td.find('.custem-gender').attributes('data-gender-value')).toBe(`${item.genderValue}`);
          }
          // 通用字段单元格插槽优先级第三
          else if (column.field === 'age') {
            expect(td.text()).toBe(`common: ${item.age}`);
          }
        });
      });

      it('渲染次数', () => {
        // render 函数的渲染方式比插槽优先级高, 插槽没有执行
        expect(nameSlot).toHaveBeenCalledTimes(0);
        // 正常执行
        expect(genderSlot).toHaveBeenCalledTimes(data.length);
        // 所有单元格 - 定义了 render 的列 - 定义了 slot 的列
        expect(commonSlot).toHaveBeenCalledTimes(
          (columns.reduce((count, column) => count + (column.render ? 0 : 1), 0) - 1) * data.length,
        );
      });

      it('渲染参数', () => {
        let commonIndex = 0;

        data.forEach((item, index) => {
          expect(genderSlot).toHaveBeenNthCalledWith(index + 1, {
            value: item.gender,
            record: item,
            column: columns.find(c => c.field === 'gender')!,
            index,
            key: 2, // ???
          });

          columns.forEach((column) => {
            if (column.render || column.field === 'gender') return;

            expect(commonSlot).toHaveBeenNthCalledWith(
              ++commonIndex,
              {
                value: item[column.field as keyof TestUser],
                record: item,
                column,
                index,
                key: 3, // ???
              },
            );
          });
        });
      });
    });

    describe('指定字段表头单元格插槽 & 通用表头单元格插槽', () => {
      const nameRender = vi.fn(({ column }) => (
        <div class="custem-name-header">{column.title}</div>
      ));

      const nameSlot = vi.fn(({ column }) => (
        <div class="custem-name-slot">{column.title}</div>
      ));

      const emailSlot = vi.fn(({ column }) => (
        <a class="custem-email-slot">{column.title}</a>
      ));

      const commonSlot = vi.fn(({ column }) => (
        <div class="custem-common-slot">{column.title}</div>
      ));

      const columns = defineTableColumns([
        { field: 'name', title: '姓名', headerRender: nameRender },
        { field: 'age', title: '年龄' },
        { field: 'email', title: '邮箱' },
      ]);

      const { getTableThs } = getTableStructure({
        props: {
          columns,
        },
        slots: {
          'header-name': nameSlot,
          'header-email': emailSlot,
          'header': commonSlot,
        },
      });

      it('优先级', () => {
        const ths = getTableThs();

        // render 函数的渲染方式比插槽优先级高
        expect(ths[0].text()).toBe('姓名');
        expect(ths[0].find('.custem-name-header').exists()).toBe(true);
        expect(ths[0].find('.custem-name-header').text()).toBe('姓名');

        // 指定字段表头单元格插槽优先级第二
        expect(ths[1].text()).toBe('年龄');
        expect(ths[1].find('.custem-name-slot').exists()).toBe(false);
        expect(ths[1].find('.custem-common-slot').exists()).toBe(true);
        expect(ths[1].find('.custem-common-slot').text()).toBe('年龄');

        // 通用表头单元格插槽优先级第三
        expect(ths[2].text()).toBe('邮箱');
        expect(ths[2].find('.custem-email-slot').exists()).toBe(true);
      });

      it('渲染次数', () => {
        // render 函数的渲染方式比插槽优先级高, 插槽没有执行
        expect(nameSlot).toHaveBeenCalledTimes(0);
        // 指定字段表头单元格插槽正常执行
        expect(emailSlot).toHaveBeenCalledTimes(1);
        // 通用表头单元格插槽正常执行
        expect(commonSlot).toHaveBeenCalledTimes(1);
      });

      it('渲染参数', () => {
        expect(emailSlot).toHaveBeenCalledWith({
          column: columns.find(c => c.field === 'email')!,
          title: '邮箱',
          key: 1, // ???
        });

        expect(commonSlot).toHaveBeenCalledWith({
          column: columns.find(c => c.field === 'age')!,
          title: '年龄',
          key: 2, // ???
        });
      });
    });
  });

  describe('列配置', () => {
    describe('字段名: field', () => {
      it('支持字段名及字段路径', () => {
        const data = [
          { name: '张三', address: { city: '北京' }, tags: ['A', 'B'] },
          { name: '李四', address: { city: '上海' }, tags: ['C'] },
          { name: '王五', address: { city: '广州' }, tags: [] },
          { name: '赵六', address: { city: '深圳' }, tags: ['D', 'E', 'F'] },
        ];

        const columns = defineTableColumns([
          { field: 'name', title: '姓名' },
          { field: 'address.city', title: '城市' },
          { field: 'tags.0', title: '第一个标签' },
          { field: 'tags[1]', title: '第二个标签' },
          { field: 'tags.2', title: '第三个标签' },
        ]);

        const { getTable } = getTableStructure({
          props: {
            columns,
            data,
          },
        });

        const table = getTable().element as HTMLTableElement;

        expect([...table.querySelectorAll('.mixte-gt-td[data-field="name"]')].map(td => td.textContent)).toEqual(['张三', '李四', '王五', '赵六']);
        expect([...table.querySelectorAll('.mixte-gt-td[data-field="address.city"]')].map(td => td.textContent)).toEqual(['北京', '上海', '广州', '深圳']);
        expect([...table.querySelectorAll('.mixte-gt-td[data-field="tags.0"]')].map(td => td.textContent)).toEqual(['A', 'C', '', 'D']);
        expect([...table.querySelectorAll('.mixte-gt-td[data-field="tags[1]"]')].map(td => td.textContent)).toEqual(['B', '', '', 'E']);
        expect([...table.querySelectorAll('.mixte-gt-td[data-field="tags.2"]')].map(td => td.textContent)).toEqual(['', '', '', 'F']);
      });
    });

    describe('表头名称: title', () => {
      it('字符串形式', () => {
        const columns = createColumns();
        const { getTableThs } = getTableStructure({
          props: {
            columns,
          },
        });

        getTableThs().forEach((th, index) => {
          expect(th.text()).toBe(columns[index].title);
        });
      });

      it('函数形式', () => {
        const columns = defineTableColumns([
          { field: 'name', title: ({ column }) => `姓名 (${column.field})` },
          { field: 'age', title: ({ column }) => `年龄 (${column.field})` },
        ]);
        const { getTableThs } = getTableStructure({
          props: {
            columns,
          },
        });

        expect(getTableThs()[0].text()).toBe('姓名 (name)');
        expect(getTableThs()[1].text()).toBe('年龄 (age)');
      });
    });

    it('表头自定义渲染方法: headerRender', () => {
      const headerRender = vi.fn(({ column, title }) => (
        <div class="custem-name-header">{column.field},{title}</div>
      ));

      const columns = defineTableColumns([
        { field: 'name', title: '姓名', headerRender },
        { field: 'name2', title: () => '姓名2', headerRender },
        { field: 'age', title: '年龄' },
      ]);
      const { getTableThs } = getTableStructure({
        props: {
          columns,
        },
      });

      expect(headerRender).toHaveBeenCalledTimes(2);
      expect(headerRender).toHaveBeenCalledWith({ column: columns[0], title: '姓名' }, null);
      expect(headerRender).toHaveBeenCalledWith({ column: columns[1], title: '姓名2' }, null);

      expect(getTableThs()[0].text()).toBe('name,姓名');
      expect(getTableThs()[0].find('.custem-name-header').exists()).toBe(true);
      expect(getTableThs()[0].find('.custem-name-header').text()).toBe('name,姓名');
      expect(getTableThs()[0].find('.custem-name-header').element.parentElement).toBe(getTableThs()[0].element);

      expect(getTableThs()[1].text()).toBe('name2,姓名2');
      expect(getTableThs()[1].find('.custem-name-header').exists()).toBe(true);
      expect(getTableThs()[1].find('.custem-name-header').text()).toBe('name2,姓名2');
      expect(getTableThs()[1].find('.custem-name-header').element.parentElement).toBe(getTableThs()[1].element);

      expect(getTableThs()[2].text()).toBe('年龄');
      expect(getTableThs()[2].find('.custem-name-header').exists()).toBe(false);
    });

    it('列单元格自定义渲染方法: render', () => {
      interface Fields {
        name: string;
        nameEn: string;
        age: number;
      }

      const nameRender = vi.fn(({ value, record }: RenderProps<Fields>) => {
        return <div class="custem-render-name">{value} ({ record.nameEn })</div>;
      });
      const ageRender = vi.fn(({ value }: RenderProps<Fields>) => value + 1);

      const columns = defineTableColumns<Fields>([
        { field: 'name', title: '姓名', render: nameRender },
        { field: 'age', title: '年龄', render: ageRender },
      ]);
      const data = createData();

      const { table, getTableTds } = getTableStructure<Fields>({
        props: {
          columns,
          data,
        },
      });

      const tds = getTableTds();

      // name
      expect(nameRender).toHaveBeenCalledTimes(data.length);
      expect(table.findAll('.custem-render-name').length).toBe(data.length);
      data.forEach((item, i) => {
        const td = tds[i * columns.length];

        expect(td.text()).toBe(`${item.name} (${item.nameEn})`);
        expect(nameRender).toHaveBeenCalledWith(
          { value: item.name, record: item, column: columns[0], index: data.indexOf(item) },
          null,
        );
      });

      // age
      expect(ageRender).toHaveBeenCalledTimes(data.length);
      data.forEach((item, i) => {
        const td = tds[i * columns.length + 1];

        expect(td.text()).toBe(`${item.age + 1}`);
        expect(ageRender).toHaveBeenCalledWith(
          { value: item.age, record: item, column: columns[1], index: data.indexOf(item) },
          null,
        );
      });
    });

    it('列宽度: width ( 在浏览器模式中测试 )', () => {});

    it('列的对齐方式: align', () => {
      const columns = defineTableColumns<TestUser>([
        { field: 'name', title: '姓名' },
        { field: 'age', title: '年龄', align: 'left' },
        { field: 'gender', title: '性别', align: 'center' },
        { field: 'email', title: '邮箱', align: 'right' }, // @ts-expect-error
        { field: 'address', title: '地址', align: 'xxx' }, // @ts-expect-error
        { field: 'status', title: '状态', align: true }, // @ts-expect-error
        { field: 'statusValue', title: '状态', align: false },
      ]);
      const { getTableThs, getTableTds } = getTableStructure({
        props: {
          columns,
          data: createData(),
        },
      });

      getTableThs().forEach((th, index) => {
        const colIndex = index % columns.length;
        const align = columns[colIndex].align;

        if (align === 'center' || align === 'right')
          expect(th.classes()).toEqual(expect.arrayContaining(['mixte-gt-cell', 'mixte-gt-th', `mixte-gt-cell-align-${align}`]));
        else
          expect(th.classes()).toEqual(expect.arrayContaining(['mixte-gt-cell', 'mixte-gt-th']));
      });

      getTableTds().forEach((td, index) => {
        const colIndex = index % columns.length;
        const align = columns[colIndex].align;

        if (align === 'center' || align === 'right')
          expect(td.classes()).toStrictEqual(expect.arrayContaining(['mixte-gt-cell', 'mixte-gt-td', `mixte-gt-cell-align-${align}`]));
        else
          expect(td.classes()).toStrictEqual(expect.arrayContaining(['mixte-gt-cell', 'mixte-gt-td']));
      });
    });

    it('列固定: fixed ( 在浏览器模式中测试 )', () => {});

    it('单元格样式类 ( th/td )', async () => {
      const data = createData();
      const { vm, getTableThs, getTableTds } = getTableStructure({
        props: {
          columns: [{ field: 'name', title: '姓名' }],
          data,
        },
      });

      getTableThs().forEach((th) => {
        expect(th.classes())
          .not.includes('mixte-666').not.includes('mixte-777')
          .not.includes('mixte-888').not.includes('mixte-999');
      });
      getTableTds().forEach((td) => {
        expect(td.classes())
          .not.includes('mixte-666').not.includes('mixte-777')
          .not.includes('mixte-888').not.includes('mixte-999');
      });

      await vm.setProps({
        columns: [{ field: 'name', title: '姓名', cellClass: 'mixte-666' }],
        cellClass: 'mixte-777',
        headerCellClass: 'mixte-888',
        contentCellClass: 'mixte-999',
      });

      getTableThs().forEach((th) => {
        const classes = th.classes();

        expect(classes).toEqual(expect.arrayContaining(['mixte-666', 'mixte-777', 'mixte-888']));
        expect(classes).not.includes('mixte-999');
      });
      getTableTds().forEach((td) => {
        const classes = td.classes();

        expect(classes).toEqual(expect.arrayContaining(['mixte-666', 'mixte-777', 'mixte-999']));
        expect(classes).not.includes('mixte-888');
      });
    });

    it('表头单元格样式类 ( th )', async () => {
      const data = createData();
      const { vm, getTableThs, getTableTds } = getTableStructure({
        props: {
          columns: [{ field: 'name', title: '姓名' }],
          data,
        },
      });

      getTableThs().forEach((th) => {
        expect(th.classes())
          .not.includes('mixte-666').not.includes('mixte-777')
          .not.includes('mixte-888').not.includes('mixte-999');
      });
      getTableTds().forEach((td) => {
        expect(td.classes())
          .not.includes('mixte-666').not.includes('mixte-777')
          .not.includes('mixte-888').not.includes('mixte-999');
      });

      await vm.setProps({
        columns: [{ field: 'name', title: '姓名', headerCellClass: 'mixte-666' }],
        cellClass: 'mixte-777',
        headerCellClass: 'mixte-888',
        contentCellClass: 'mixte-999',
      });

      getTableThs().forEach((th) => {
        const classes = th.classes();

        expect(classes).toEqual(expect.arrayContaining(['mixte-666', 'mixte-777', 'mixte-888']));
        expect(classes).not.includes('mixte-999');
      });
      getTableTds().forEach((td) => {
        const classes = td.classes();

        expect(classes).toEqual(expect.arrayContaining(['mixte-777', 'mixte-999']));
        expect(classes)
          .not.includes('mixte-666')
          .not.includes('mixte-888');
      });
    });

    it('表体单元格样式类 ( td )', async () => {
      const data = createData();
      const { vm, getTableThs, getTableTds } = getTableStructure({
        props: {
          columns: [{ field: 'name', title: '姓名' }],
          data,
        },
      });

      getTableThs().forEach((th) => {
        expect(th.classes())
          .not.includes('mixte-666').not.includes('mixte-777')
          .not.includes('mixte-888').not.includes('mixte-999');
      });
      getTableTds().forEach((td) => {
        expect(td.classes())
          .not.includes('mixte-666').not.includes('mixte-777')
          .not.includes('mixte-888').not.includes('mixte-999');
      });

      await vm.setProps({
        columns: [{ field: 'name', title: '姓名', contentCellClass: 'mixte-666' }],
        cellClass: 'mixte-777',
        headerCellClass: 'mixte-888',
        contentCellClass: 'mixte-999',
      });

      getTableThs().forEach((th) => {
        const classes = th.classes();

        expect(classes).toEqual(expect.arrayContaining(['mixte-777', 'mixte-888']));
        expect(classes)
          .not.includes('mixte-666')
          .not.includes('mixte-999');
      });
      getTableTds().forEach((td) => {
        const classes = td.classes();

        expect(classes).toEqual(expect.arrayContaining(['mixte-666', 'mixte-777', 'mixte-999']));
        expect(classes).not.includes('mixte-888');
      });
    });

    it('显示列 & 隐藏列: visible & hidden', () => {
      const columns = defineTableColumns([
        // visible
        { field: 'col-1',    visible: undefined,     title: '显示' },
        { field: 'col-2',    visible: true,          title: '显示' },
        { field: 'col-3',    visible: false,         title: '隐藏' },
        { field: 'col-4',    visible: () => true,    title: '显示' },
        { field: 'col-5',    visible: () => false,   title: '隐藏' }, // @ts-expect-error
        { field: 'col-6',    visible: null,          title: '显示' }, // @ts-expect-error
        { field: 'col-7',    visible: 0,             title: '隐藏' }, // @ts-expect-error
        { field: 'col-8',    visible: 1,             title: '显示' },

        // hidden
        { field: 'col-9',    hidden: undefined,     title: '显示' },
        { field: 'col-10',   hidden: true,          title: '隐藏' },
        { field: 'col-11',   hidden: false,         title: '显示' },
        { field: 'col-12',   hidden: () => true,    title: '隐藏' },
        { field: 'col-13',   hidden: () => false,   title: '显示' }, // @ts-expect-error
        { field: 'col-14',   hidden: null,          title: '显示' }, // @ts-expect-error
        { field: 'col-15',   hidden: 0,             title: '显示' }, // @ts-expect-error
        { field: 'col-16',   hidden: 1,             title: '隐藏' },

        // visible & hidden 混合
        { field: 'col-17',   visible: true,  hidden: true,    title: '隐藏' },
        { field: 'col-18',   visible: true,  hidden: false,   title: '显示' },
        { field: 'col-19',   visible: false, hidden: true,    title: '隐藏' },
        { field: 'col-20',   visible: false, hidden: false,   title: '隐藏' },
        { field: 'col-21',   visible: () => true,  hidden: () => true,    title: '隐藏' },
        { field: 'col-22',   visible: () => true,  hidden: () => false,   title: '显示' },
        { field: 'col-23',   visible: () => false, hidden: () => true,    title: '隐藏' },
        { field: 'col-24',   visible: () => false, hidden: () => false,   title: '隐藏' },
      ]);

      const { getTableThs } = getTableStructure({
        props: {
          columns,
        },
      });

      const ths = getTableThs();
      const thFields = ths.map(th => th.attributes('data-field'));

      expect(ths.length).toBe(12);

      columns.forEach((column) => {
        if (column.title === '显示') expect(thFields).includes(column.field);
        if (column.title === '隐藏') expect(thFields).not.includes(column.field);
      });
    });

    describe('单元格行列合并: colSpan & rowSpan', () => {
      it('单元格列合并: colSpan', () => {
        const columns = defineTableColumns([
          { field: 'col-1', title: 'Col-1', colSpan: ({ index }) => index === 0 ? 2 : index === 4 ? 99 : -1 },
          { field: 'col-2', title: 'Col-2' },
          { field: 'col-3', title: 'Col-3', colSpan: ({ index }) => index === 1 ? 3 : 0 },
          { field: 'col-4', title: 'Col-4' },
          { field: 'col-5', title: 'Col-5' },
          { field: 'col-6', title: 'Col-6', colSpan: ({ index }) => index === 2 ? 4 : 1 },
          { field: 'col-7', title: 'Col-7' },
        ]);

        //      |  Col-1  |  Col-2  |  Col-3  |  Col-4  |  Col-5  |  Col-6  |  Col-7  |
        //      |---------|---------|---------|---------|---------|---------|---------|
        // 行 1 | R1C1              | R1C3    | R1C4    | R1C5    | R1C6    | R1C7    |
        // 行 2 | R2C1    | R2C2    | R2C3                        | R2C6    | R2C7    |
        // 行 3 | R3C1    | R3C2    | R3C3    | R3C4    | R3C5    | R3C6              |
        // 行 4 | R4C1    | R4C2    | R4C3    | R4C4    | R4C5    | R4C6    | R4C7    |
        // 行 5 | R5C1                                                                |

        const { getTableTds } = getTableStructure({
          props: {
            columns,
            data: Array.from({ length: 5 }).map((_, i) => ({
              'id': i + 1,
              'col-1': `R${i + 1}C1`,
              'col-2': `R${i + 1}C2`,
              'col-3': `R${i + 1}C3`,
              'col-4': `R${i + 1}C4`,
              'col-5': `R${i + 1}C5`,
              'col-6': `R${i + 1}C6`,
              'col-7': `R${i + 1}C7`,
            })),
          },
        });

        const tds = getTableTds();
        const R1C1 = tds[0];
        const R2C3 = tds[8];
        const R3C6 = tds[16];
        const R5C1 = tds[24];

        expect(tds.length).toBe(25);

        expect(R1C1.text()).toBe('R1C1');
        expect(R1C1.element.style.gridColumn).toBe('span 2');
        expect(R1C1.element.nextElementSibling!.textContent).toBe('R1C3');

        expect(R2C3.text()).toBe('R2C3');
        expect(R2C3.element.style.gridColumn).toBe('span 3');
        expect(R2C3.element.previousElementSibling!.textContent).toBe('R2C2');
        expect(R2C3.element.nextElementSibling!.textContent).toBe('R2C6');

        expect(R3C6.text()).toBe('R3C6');
        expect(R3C6.element.style.gridColumn).toBe('span 2');
        expect(R3C6.element.previousElementSibling!.textContent).toBe('R3C5');
        expect(R3C6.element.nextElementSibling!.textContent).toBe('R4C1');

        expect(R5C1.text()).toBe('R5C1');
        expect(R5C1.element.style.gridColumn).toBe('span 7');
        expect(R5C1.element.previousElementSibling!.textContent).toBe('R4C7');

        tds.forEach((td) => {
          if ([R1C1, R2C3, R3C6, R5C1].includes(td)) return;

          expect(td.element.style.gridColumn).toBe('');
        });
      });

      it('单元格行合并: rowSpan', () => {
        const columns = defineTableColumns([
          { field: 'col-1', title: 'Col-1', rowSpan: ({ index }) => index === 0 ? 2 : -1 },
          { field: 'col-2', title: 'Col-2', rowSpan: ({ index }) => index === 1 ? 3 : 0 },
          { field: 'col-3', title: 'Col-3', rowSpan: ({ index }) => index === 2 ? 4 : 1 },
          { field: 'col-4', title: 'Col-4', rowSpan: ({ index }) => index === 0 ? 5 : 1 },
          { field: 'col-5', title: 'Col-5', rowSpan: ({ index }) => index === 1 ? 99 : 1 },
        ]);

        //      |  Col-1  |  Col-2  |  Col-3  |  Col-4  |  Col-5  |
        //      |---------|---------|---------|---------|---------|
        // 行 1 | R1C1    | R1C2    | R1C3    | R1C4    | R1C5    |
        // 行 2 |         | R2C2    | R2C3    |         | R2C5    |
        // 行 3 | R3C1    |         | R3C3    |         |         |
        // 行 4 | R4C1    |         |         |         |         |
        // 行 5 | R5C1    | R5C2    |         |         |         |
        // 行 6 | R6C1    | R6C2    |         | R6C4    |         |

        const { getTableTds } = getTableStructure({
          props: {
            columns,
            data: Array.from({ length: 6 }).map((_, i) => ({
              'id': i + 1,
              'col-1': `R${i + 1}C1`,
              'col-2': `R${i + 1}C2`,
              'col-3': `R${i + 1}C3`,
              'col-4': `R${i + 1}C4`,
              'col-5': `R${i + 1}C5`,
              'col-6': `R${i + 1}C6`,
              'col-7': `R${i + 1}C7`,
            })),
          },
        });

        const tds = getTableTds();
        const R1C1 = tds[0];
        const R2C2 = tds[5];
        const R3C3 = tds[9];
        const R1C4 = tds[3];
        const R2C5 = tds[7];

        expect(tds.length).toBe(16);

        expect(R1C1.text()).toBe('R1C1');
        expect(R1C1.element.style.gridRow).toBe('span 2');
        expect(R1C1.element.nextElementSibling!.textContent).toBe('R1C2');

        expect(R2C2.text()).toBe('R2C2');
        expect(R2C2.element.style.gridRow).toBe('span 3');
        expect(R2C2.element.previousElementSibling!.textContent).toBe('R1C5');
        expect(R2C2.element.nextElementSibling!.textContent).toBe('R2C3');

        expect(R3C3.text()).toBe('R3C3');
        expect(R3C3.element.style.gridRow).toBe('span 4');
        expect(R3C3.element.previousElementSibling!.textContent).toBe('R3C1');
        expect(R3C3.element.nextElementSibling!.textContent).toBe('R4C1');

        expect(R1C4.text()).toBe('R1C4');
        expect(R1C4.element.style.gridRow).toBe('span 5');
        expect(R1C4.element.previousElementSibling!.textContent).toBe('R1C3');
        expect(R1C4.element.nextElementSibling!.textContent).toBe('R1C5');

        expect(R2C5.text()).toBe('R2C5');
        expect(R2C5.element.style.gridRow).toBe('span 5');
        expect(R2C5.element.previousElementSibling!.textContent).toBe('R2C3');
        expect(R2C5.element.nextElementSibling!.textContent).toBe('R3C1');

        tds.forEach((td) => {
          if ([R1C1, R2C2, R3C3, R1C4, R2C5].includes(td)) return;

          expect(td.element.style.gridRow).toBe('');
        });
      });

      it('方法接收的参数', async () => {
        const colSpan = vi.fn(() => 1);
        const rowSpan = vi.fn(() => 1);

        const columns = defineTableColumns([{
          field: 'col-1',
          title: 'Col-1',
          colSpan,
          rowSpan,
        }]);

        const data = Array.from({ length: 3 }).map((_, i) => ({
          'id': i + 1,
          'col-1': `R${i + 1}C1`,
        }));

        getTableStructure({
          props: {
            columns,
            data,
          },
        });

        await delay(20);

        expect(colSpan).toHaveBeenCalledTimes(3);
        expect(rowSpan).toHaveBeenCalledTimes(3);

        expect(colSpan).toHaveBeenCalledWith({ record: data[0], column: columns[0], index: 0 });
        expect(colSpan).toHaveBeenCalledWith({ record: data[1], column: columns[0], index: 1 });
        expect(colSpan).toHaveBeenCalledWith({ record: data[2], column: columns[0], index: 2 });
        expect(rowSpan).toHaveBeenCalledWith({ record: data[0], column: columns[0], index: 0 });
        expect(rowSpan).toHaveBeenCalledWith({ record: data[1], column: columns[0], index: 1 });
        expect(rowSpan).toHaveBeenCalledWith({ record: data[2], column: columns[0], index: 2 });
      });
    });
  });

  describe('类型测试', () => {
    it('表格传参', () => {
      type Props = ComponentProps<typeof MixteGridTable<User>>;

      expectTypeOf<Props['data']>().toEqualTypeOf<any[] | undefined>();
      expectTypeOf<Props['columns']>().toEqualTypeOf<GridTableColumn<User>[] | undefined>();
      expectTypeOf<Props['childrenKey']>().toEqualTypeOf<keyof User | 'children' | (string & {}) | undefined>();
      expectTypeOf<Props['expandColumnKey']>().toEqualTypeOf<keyof User | (string & {}) | undefined>();
    });

    it('表格列配置', () => {
      const userColumns: GridTableColumn<User>[] = [];
      const normalColumns: GridTableColumn<Record<string, any>>[] = [];

      assertType<GridTableColumn<User>[]>([
        ...userColumns,
        ...normalColumns,
      ]);
    });

    describe('单元格插槽', () => {
      type Slots = ComponentSlots<typeof MixteGridTable<User>>;

      it('根据字段名动态生成指定字段单元格插槽', () => {
        expectTypeOf<keyof Slots>().toEqualTypeOf<
          'header' |
          `header-${keyof User}` |
          `header-${string}` |
          'cell' |
          `cell-${keyof User}` |
          `cell-${string}`
        >();

        // Header
        expectTypeOf<Slots['header']>().toEqualTypeOf<
          ((props: RenderHeaderProps<User>) => any) | undefined
        >();
        expectTypeOf<Slots['header-name']>().toEqualTypeOf<
          ((props: RenderHeaderProps<User>) => any) | undefined
        >();
        expectTypeOf<Slots['header-xxx']>().toEqualTypeOf<
          ((props: RenderHeaderProps<User>) => any) | undefined
        >();

        // Cell
        expectTypeOf<Slots['cell']>().toEqualTypeOf<
          ((props: RenderProps<User & Record<string, any>>) => any) | undefined
        >();
        expectTypeOf<Slots['cell-name']>().toEqualTypeOf<
          ((props: RenderProps<User & Record<string, any>>) => any) | undefined
        >();
        expectTypeOf<Slots['cell-xxx']>().toEqualTypeOf<
          ((props: RenderProps<User & Record<string, any>>) => any) | undefined
        >();
      });

      it('通过字段单元格插槽传入的 record 类型会变宽松', () => {
        expectTypeOf<
          Parameters<NonNullable<Slots['cell']>>['0']['record']
        >().toEqualTypeOf<
          User & Record<string, any>
        >();

        expectTypeOf<
          Parameters<NonNullable<Slots['cell-name']>>['0']['record']
        >().toEqualTypeOf<
          User & Record<string, any>
        >();

        expectTypeOf<
          Parameters<NonNullable<Slots['cell-xxx']>>['0']['record']
        >().toEqualTypeOf<
          User & Record<string, any>
        >();
      });
    });
  });
});

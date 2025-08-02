import type { User } from '@/types';
import type { RenderProps } from './src/types';
import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
import { mount } from '@vue/test-utils';
import { delay } from 'mixte';

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
  const getTableLoading = () => vm.find<HTMLDivElement>('.mixte-gt-wrap > .mixte-gt-loading');
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

  // 表头
  if (options?.props?.columns?.length) {
    expect(tableThs.length).toBe(options.props.columns.length);
  }
  else {
    expect(tableThs.length).toBe(0);
  }

  // 表体 & 无数据部分
  if (!!options?.props?.columns?.length && !!options?.props?.data?.length) {
    // 表体
    expect(tableTds.length).toBe(options.props.columns.length * options.props.data.length);
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
    const columns = options?.props?.columns;
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

    expect(getTableTds().length).toBe(dataLength * columns.length);

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
          key: 1, // ???
        });

        expect(commonSlot).toHaveBeenCalledWith({
          column: columns.find(c => c.field === 'age')!,
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
      const headerRender = vi.fn(({ column }) => (
        <div class="custem-name-header">{column.title}</div>
      ));

      const columns = defineTableColumns([
        { field: 'name', title: '姓名', headerRender },
        { field: 'age', title: '年龄' },
      ]);
      const { getTableThs } = getTableStructure({
        props: {
          columns,
        },
      });

      expect(headerRender).toHaveBeenCalledTimes(1);
      expect(headerRender).toHaveBeenCalledWith({ column: columns[0] }, null);

      expect(getTableThs()[0].text()).toBe('姓名');
      expect(getTableThs()[0].find('.custem-name-header').exists()).toBe(true);
      expect(getTableThs()[0].find('.custem-name-header').text()).toBe('姓名');
      expect(getTableThs()[0].find('.custem-name-header').element.parentElement).toBe(getTableThs()[0].element);

      expect(getTableThs()[1].text()).toBe('年龄');
      expect(getTableThs()[1].find('.custem-name-header').exists()).toBe(false);
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

      expect(getTableThs().filter(th => th.classes().includes('mixte-666')).length).toBe(0);
      expect(getTableTds().filter(td => td.classes().includes('mixte-666')).length).toBe(0);

      await vm.setProps({
        columns: [{ field: 'name', title: '姓名', cellClass: 'mixte-666' }],
      });

      expect(getTableThs().filter(th => th.classes().includes('mixte-666')).length).toBe(1);
      expect(getTableTds().filter(td => td.classes().includes('mixte-666')).length).toBe(data.length);
    });

    it('表头单元格样式类 ( th )', async () => {
      const data = createData();
      const { vm, getTableThs, getTableTds } = getTableStructure({
        props: {
          columns: [{ field: 'name', title: '姓名' }],
          data,
        },
      });

      expect(getTableThs().filter(th => th.classes().includes('mixte-666')).length).toBe(0);
      expect(getTableTds().filter(td => td.classes().includes('mixte-666')).length).toBe(0);

      await vm.setProps({
        columns: [{ field: 'name', title: '姓名', headerCellClass: 'mixte-666' }],
      });

      expect(getTableThs().filter(th => th.classes().includes('mixte-666')).length).toBe(1);
      expect(getTableTds().filter(td => td.classes().includes('mixte-666')).length).toBe(0);
    });

    it('表体单元格样式类 ( td )', async () => {
      const data = createData();
      const { vm, getTableThs, getTableTds } = getTableStructure({
        props: {
          columns: [{ field: 'name', title: '姓名' }],
          data,
        },
      });

      expect(getTableThs().filter(th => th.classes().includes('mixte-666')).length).toBe(0);
      expect(getTableTds().filter(td => td.classes().includes('mixte-666')).length).toBe(0);

      await vm.setProps({
        columns: [{ field: 'name', title: '姓名', contentCellClass: 'mixte-666' }],
      });

      expect(getTableThs().filter(th => th.classes().includes('mixte-666')).length).toBe(0);
      expect(getTableTds().filter(td => td.classes().includes('mixte-666')).length).toBe(data.length);
    });
  });
});

import type { User } from '@/types';
import { MixteGridTable } from '@mixte/components/grid-table';
import { defineTableColumns } from '@mixte/components/grid-table/utils';
import { mount } from '@vue/test-utils';

type TestUser = Pick<User, 'id' | 'name' | 'nameEn' | 'age' | 'gender' | 'genderValue' | 'email' | 'address' | 'status' | 'statusValue'>;

function createData() {
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

function createColumns() {
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
  const vm = mount(MixteGridTable<Fields>, options);

  const getTableWrap = () => vm.find<HTMLDivElement>('.mixte-gt-wrap');
  const getTable = () => vm.find<HTMLDivElement>('.mixte-gt');
  const getTableLoading = () => vm.find<HTMLDivElement>('.mixte-gt-wrap > .mixte-gt-loading');
  const getTableThead = () => vm.find<HTMLDivElement>('.mixte-gt-thead');
  const getTableTheadTrs = () => vm.findAll<HTMLDivElement>('.mixte-gt-thead > .mixte-gt-tr');
  const getTableTheadThs = () => vm.findAll<HTMLDivElement>('.mixte-gt-thead > .mixte-gt-tr > .mixte-gt-th.mixte-gt-cell');
  const getTableTbody = () => vm.find<HTMLDivElement>('.mixte-gt-tbody');
  const getTableTbodyTrs = () => vm.findAll<HTMLDivElement>('.mixte-gt-tbody > .mixte-gt-tr');
  const getTableTbodyTds = () => vm.findAll<HTMLDivElement>('.mixte-gt-tbody > .mixte-gt-tr > .mixte-gt-td.mixte-gt-cell');
  const getTableEmptyWrap = () => vm.find<HTMLDivElement>('.mixte-gt-wrap > .mixte-gt > .mixte-gt-empty-wrap');

  const tableWrap = getTableWrap();
  const table = getTable();
  const tableLoading = getTableLoading();
  const tableThead = getTableThead();
  const tableTbody = getTableTbody();
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
    expect(tableThead.exists()).toBe(true);
    expect(tableThead.element).toBe(table.element.firstElementChild);
  }
  else {
    expect(tableThead.exists()).toBe(false);
  }

  // 表体 & 无数据部分
  if (!!options?.props?.columns?.length && !!options?.props?.data?.length) {
    // 表体
    expect(tableTbody.exists()).toBe(true);
    expect(tableTbody.element).toBe(table.element.lastElementChild);
    // 无数据部分
    expect(tableEmptyWrap.exists()).toBe(false);
  }
  else {
    // 表体
    expect(tableTbody.exists()).toBe(false);
    // 无数据部分
    expect(tableEmptyWrap.exists()).toBe(true);
    expect(tableEmptyWrap.element).toBe(table.element.lastElementChild);
  }

  return {
    vm,
    tableWrap,
    table,

    getTableWrap,
    getTable,
    getTableLoading,
    getTableThead,
    getTableTheadTrs,
    getTableTheadThs,
    getTableTbody,
    getTableTbodyTrs,
    getTableTbodyTds,
    getTableEmptyWrap,
  };
}

describe('grid-table', () => {
  it('未传任何参数时, 不渲染表头和表体, 会渲染无数据部分', () => {
    const { table, getTableThead, getTableTbody, getTableEmptyWrap } = getTableStructure();
    // 没有表头表体
    expect(getTableThead().exists()).toBe(false);
    expect(getTableTbody().exists()).toBe(false);

    // 主体下只有无数据部分
    expect(table.element.children.length).toBe(1);
    expect(getTableEmptyWrap().exists()).toBe(true);
  });

  it('仅传入表格列配置, 不渲染表体, 会渲染表头和无数据部分', () => {
    const { table, getTableThead, getTableTbody, getTableEmptyWrap } = getTableStructure({
      props: {
        columns: createColumns(),
      },
    });

    // 有表头, 没有表体
    expect(getTableThead().exists()).toBe(true);
    expect(getTableTbody().exists()).toBe(false);

    // 主体下有表头和无数据部分
    expect(table.element.children.length).toBe(2);
    expect(getTableEmptyWrap().exists()).toBe(true);
    expect([getTableThead().element, getTableEmptyWrap().element]).toStrictEqual(
      Array.from(table.element.children),
    );
  });

  it('仅传入数据源, 不渲染表头和表体, 会渲染无数据部分', () => {
    const { table, getTableThead, getTableTbody, getTableEmptyWrap } = getTableStructure({
      props: {
        data: createData(),
      },
    });

    // 没有表头表体
    expect(getTableThead().exists()).toBe(false);
    expect(getTableTbody().exists()).toBe(false);

    // 主体下只有无数据部分
    expect(table.element.children.length).toBe(1);
    expect(getTableEmptyWrap().exists()).toBe(true);
  });

  it('传入表格列配置和数据源, 渲染表头和表体, 无数据部分不渲染', () => {
    const columns = createColumns();
    const data = createData();
    const { tableWrap, table } = getTableStructure({
      props: {
        columns,
        data,
      },
    });

    // 包裹层下只有主体部分
    expect(tableWrap.element.children.length).toBe(1);

    // 主体下有表头和表体
    expect(table.element.children.length).toBe(2);
    expect(table.element.firstElementChild?.classList.contains('mixte-gt-thead')).toBe(true);
    expect(table.element.lastElementChild?.classList.contains('mixte-gt-tbody')).toBe(true);

    // 表头
    const thead = table.find('.mixte-gt-thead');
    const tr = thead.find('.mixte-gt-tr');
    const ths = tr.findAll('.mixte-gt-th.mixte-gt-cell');

    expect(tr.exists()).toBe(true);
    expect(tr.element).toBe(thead.element.firstElementChild);
    expect(ths.length).toBe(columns.length);

    // 表体
    const tbody = table.find('.mixte-gt-tbody');
    const trs = tbody.findAll('.mixte-gt-tr');

    expect(trs.length).toBe(data.length);
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

  describe('列配置', () => {
    describe('表头名称: title', () => {
      it('默认渲染', () => {
        const columns = createColumns();
        const { getTableTheadThs } = getTableStructure({
          props: {
            columns,
          },
        });

        getTableTheadThs().forEach((th, index) => {
          expect(th.text()).toBe(columns[index].title);
        });
      });

      it('使用 headerRender 函数自定义渲染', () => {
        const headerRender = vi.fn(({ column }) => (
          <div class="custem-name-header">{column.title}</div>
        ));

        const columns = defineTableColumns([
          { field: 'name', title: '姓名', headerRender },
          { field: 'age', title: '年龄' },
        ]);
        const { getTableTheadThs } = getTableStructure({
          props: {
            columns,
          },
        });

        expect(headerRender).toHaveBeenCalledTimes(1);
        expect(headerRender).toHaveBeenCalledWith({ column: columns[0] }, null);

        expect(getTableTheadThs()[0].text()).toBe('姓名');
        expect(getTableTheadThs()[0].find('.custem-name-header').exists()).toBe(true);
        expect(getTableTheadThs()[0].find('.custem-name-header').text()).toBe('姓名');
        expect(getTableTheadThs()[0].find('.custem-name-header').element.parentElement).toBe(getTableTheadThs()[0].element);

        expect(getTableTheadThs()[1].text()).toBe('年龄');
        expect(getTableTheadThs()[1].find('.custem-name-header').exists()).toBe(false);
      });
    });

    describe('列单元格自定义渲染方法: render', () => {
      it('默认渲染', () => {
        const columns = defineTableColumns([
          { field: 'name', title: '姓名' },
          { field: 'age', title: '年龄' },
        ]);
        const data = createData();
        const { getTableTbodyTrs } = getTableStructure({
          props: {
            columns,
            data,
          },
        });

        getTableTbodyTrs().forEach((tr, index) => {
          const tds = tr.findAll('.mixte-gt-td.mixte-gt-cell');
          const item = data[index];

          expect(tds[0].text()).toBe(item.name);
          expect(tds[1].text()).toBe(`${item.age}`);
        });
      });

      it('使用 render 函数自定义渲染', () => {
        const nameRender = vi.fn(({ value, record }) => {
          return <div class="custem-render-name">{value} ({ record.nameEn })</div>;
        });

        const columns = defineTableColumns([
          { field: 'name', title: '姓名', render: nameRender },
          { field: 'age', title: '年龄', render: ({ value }) => value + 1 },
        ]);
        const data = createData();
        const { getTableTbodyTrs } = getTableStructure({
          props: {
            columns,
            data,
          },
        });

        expect(nameRender).toHaveBeenCalledTimes(data.length);
        expect(nameRender).toHaveBeenCalledWith({
          value: data[0].name,
          record: data[0],
          column: columns[0],
          index: 0,
        }, null);

        getTableTbodyTrs().forEach((tr, index) => {
          const tds = tr.findAll('.mixte-gt-td.mixte-gt-cell');
          const item = data[index];

          expect(tds[0].text()).toBe(`${item.name} (${item.nameEn})`);
          expect(tds[0].find('.custem-render-name').exists()).toBe(true);
          expect(tds[0].find('.custem-render-name').text()).toBe(`${item.name} (${item.nameEn})`);
          expect(tds[0].find('.custem-render-name').element.parentElement).toBe(tds[0].element);

          expect(tds[1].text()).toBe(`${item.age + 1}`);
        });
      });

      it('使用 render 函数自定义渲染, 接受的参数', () => {
        const nameRender = vi.fn();
        const ageRender = vi.fn();

        const columns = defineTableColumns([
          { field: 'name', title: '姓名', render: nameRender },
          { field: 'age', title: '年龄', render: ageRender },
        ]);
        const data = [
          { id: '1', name: '张三', age: 18 },
          { id: '2', name: '李四', age: 20 },
        ];

        getTableStructure<{ id: string; name: string; age: number }>({
          props: {
            columns,
            data,
          },
        });

        // name
        expect(nameRender).toHaveBeenCalledTimes(data.length);
        expect(nameRender).toHaveBeenNthCalledWith(1, { value: data[0].name, record: data[0], column: columns[0], index: 0 }, null);
        expect(nameRender).toHaveBeenNthCalledWith(2, { value: data[1].name, record: data[1], column: columns[0], index: 1 }, null);

        // age
        expect(ageRender).toHaveBeenCalledTimes(data.length);
        expect(ageRender).toHaveBeenNthCalledWith(1, { value: data[0].age, record: data[0], column: columns[1], index: 0 }, null);
        expect(ageRender).toHaveBeenNthCalledWith(2, { value: data[1].age, record: data[1], column: columns[1], index: 1 }, null);
      });
    });
  });
});

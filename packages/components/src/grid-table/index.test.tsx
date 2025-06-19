import type { User } from '@/types';
import type { RenderProps } from './src/types';
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
    expect(tableThead.element).toBe(
      options.props.data?.length
        ? table.element.lastElementChild
        : table.element.firstElementChild,
    );
  }
  else {
    expect(tableThead.exists()).toBe(false);
  }

  // 表体 & 无数据部分
  if (!!options?.props?.columns?.length && !!options?.props?.data?.length) {
    // 表体
    expect(tableTbody.exists()).toBe(true);
    expect(tableTbody.element).toBe(table.element.firstElementChild);
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
    expect(table.element.lastElementChild?.classList.contains('mixte-gt-thead')).toBe(true);
    expect(table.element.firstElementChild?.classList.contains('mixte-gt-tbody')).toBe(true);

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

      const { getTableTbodyTrs } = getTableStructure({
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
        getTableTbodyTrs().forEach((tr, index) => {
          const item = data[index];
          const name = tr.find('.mixte-gt-td.mixte-gt-cell:nth-child(2)');
          const age = tr.find('.mixte-gt-td.mixte-gt-cell:nth-child(3)');
          const gender = tr.find('.mixte-gt-td.mixte-gt-cell > .custem-gender');

          // render 函数的渲染方式比插槽优先级高
          expect(name.exists()).toBe(true);
          expect(name.text()).toBe(`${item.name} (${item.nameEn})`);

          // 指定字段单元格插槽优先级第二
          expect(gender.exists()).toBe(true);
          expect(gender.text()).toBe(item.gender);
          expect(gender.attributes('data-gender-value')).toBe(`${item.genderValue}`);

          // 通用字段单元格插槽优先级第三
          expect(age.exists()).toBe(true);
          expect(age.text()).toBe(`common: ${item.age}`);
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
            key: 1, // ???
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
                key: 2, // ???
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

      const { getTableTheadThs } = getTableStructure({
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
        const ths = getTableTheadThs();

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
    it('表头名称: title', () => {
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

    it('表头自定义渲染方法: headerRender', () => {
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

      const { table, getTableTbodyTrs } = getTableStructure<Fields>({
        props: {
          columns,
          data,
        },
      });

      const trs = getTableTbodyTrs();

      // name
      expect(nameRender).toHaveBeenCalledTimes(data.length);
      expect(table.findAll('.custem-render-name').length).toBe(data.length);
      data.forEach((item, i) => {
        expect(trs[i].find('.custem-render-name').text()).toBe(`${item.name} (${item.nameEn})`);
        expect(trs[i].find('.custem-render-name').element).toBe(trs[i].element.firstElementChild?.children[0]);

        expect(nameRender).toHaveBeenCalledWith(
          { value: item.name, record: item, column: columns[0], index: data.indexOf(item) },
          null,
        );
      });

      // age
      expect(ageRender).toHaveBeenCalledTimes(data.length);
      data.forEach((item, i) => {
        expect(trs[i].element.lastElementChild?.textContent).toBe(`${item.age + 1}`);

        expect(ageRender).toHaveBeenCalledWith(
          { value: item.age, record: item, column: columns[1], index: data.indexOf(item) },
          null,
        );
      });
    });
  });
});

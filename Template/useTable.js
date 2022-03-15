import { message } from 'antd';
import { useState, useEffect } from 'react';

export default function(requestFunc, options = {}) {
  // handleResult 对结果特殊处理,
  // defaultParams 初始参数
  // 控制弹窗展示,
  const { defaultParams, showModel, handleResult, showSelections = false } = options;

  // 设置表单参数
  const [params, changeParams] = useState({
    ...defaultParams,
  });

  // 选中行
  const [SelectedRow, setSelectedRow] = useState([]);

  // 当前选中行
  const [SelectedRowKeys, setSelectedRowKeys] = useState([]);
  // 为了保证 某次设置参数之后就刷新列表
  const [flag, setFlag] = useState(0);

  const setParams = (val, bool) => {
    changeParams(() => ({ ...val }));
    if (bool) {
      setFlag(flag => flag + 1);
    }
  };
  // 设置loading的方法
  const [loading, setLoading] = useState(false);

  // 修改表格数据的方法
  const [tablePorps, setTableProps] = useState({
    dataSource: [],
  });

  // 请求获取表格数据
  function getList() {
    setLoading(true);
    const TempParams = {};
    Object.keys(params).map(el => {
      if (params[el] !== undefined && params[el] !== null && params[el] !== '') {
        TempParams[el] = params[el];
      }
    });
    console.log(TempParams, 'TempParams');
    requestFunc({ ...TempParams }).then(res => {
      if (res.code === '000000') {
        let tempRes = res;
        if (handleResult && handleResult instanceof Function) {
          tempRes = handleResult(res);
        }
        const { list, currentPage, pageSize, totalCount, totalPage } = tempRes.data;

        setTableProps({
          dataSource: [...list],
          pagination: {
            current: parseInt(currentPage),
            pageSize: parseInt(pageSize),
            total: parseInt(totalCount),
            totalPage: parseInt(totalPage),
          },
        });
      } else {
        message.error(res.msg || '请求报错,请联系管理员');
      }
      setLoading(false);
    });
  }
  useEffect(getList, [params.currentPage, showModel, flag]);

  return {
    params,
    setParams,
    getList,
    loading,
    setLoading,
    setTableProps,
    SelectedRowKeys,
    SelectedRow,
    tablePorps: {
      rowKey: 'id',
      loading,
      ...tablePorps,
      // key: params?.currentPage,
      onChange({ current, pageSize }) {
        console.log(current, pageSize);
        setParams(
          {
            ...params,
            currentPage: current,
            pageSize,
          },
          true
        );
      },
      rowSelection: showSelections
        ? {
            onChange(selectedRowKeys, selectedRows) {
              setSelectedRow([...selectedRows]);
              setSelectedRowKeys([...selectedRowKeys]);
            },
          }
        : null,
    },
  };
}


/**
 *
 * @param {*} func 获取列表的api
 * @param {*} params 初始参数，
 * @param {*} baseParams 每次都要传的参数
 * @returns 返回 Array,包含list数组和设置params的函数 [list,setListParams]
 */

 export function useRequest(func, params = {}, baseParams = {}) {
  if (typeof func !== 'function') {
    message.error('useRequest 的 func参数不是一个函数');
    return;
  }
  const [innerParams, setInnerParams] = useState({
    ...params,
    ...baseParams,
  });
  const [flag, setFlag] = useState(0);
  const [list, setList] = useState([]);
  const setEasyParams = (p, changeFlag = true) => {
    const { getEmptyList } = p;
    if (getEmptyList) {
      setList([]);
      return;
    }
    setInnerParams({ ...baseParams, ...p });
    if (changeFlag) {
      setFlag(flag => flag + 1);
    }
  };
  useEffect(
    () => {
      console.log(innerParams, 'innerParams');
      func({ ...innerParams }).then(res => {
        if (res?.code === '000000' && res?.data) {
          if (res.data.list) {
            setList(res.data.list);
          } else {
            message.error('返回格式不规范');
            setList(res.data);
          }
        } else {
          message.error(res?.msg || '请求报错,请联系管理员');
        }
      });
    },
    [flag]
  );
  return [list, setEasyParams];
}

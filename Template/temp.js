import React, { PureComponent, Fragment } from 'react';
import { Table, Card, Input, Button, Divider, message, Tag, Modal, Form, Row, Col } from 'antd';
// css & img
import styles from '@/assets/common.less';
import baseUrl from '@/services/baseUrl';
// 公共组件 & 方法
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { stringify } from 'qs';
import { ExportExcel } from '@/utils/utils';
import useTable from '@/components/UseTable';

import { getTableList } from './services';

const FormItem = Form.Item;
const columns = [
  
  {
    title: '状态',
    dataIndex: 'name',
    align: 'center',
    key: 'naime',
    width: '150',
    render: val => {
      switch (val) {
        case 1:
          return '审核中';
        case 2:
          return '已驳回';
        default:
            return '审核中';
      }
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    key: 'action',
    width: '150',
    render: val => (val === 1 ? <Button> 审核</Button> : <Button> 查看</Button>),
  },
];
// 业务组件

function SettleAccounts(props) {
  const { params, setParams, loading, setLoading, tablePorps } = useTable(getTableList, 
   {
     defaultParams: { pageSize: 10, currentPage: 1 },
   }
  );
  const { getFieldDecorator,getFieldsValue } = props.form;

  // 重置表单
  const resetForm = () => {
    resetFields();
    setParams({}, true);
    setButtonStatus(true);
  };
//搜索
  const goSearch = () => {
    const res = getFieldsValue();
    setParams({ ...res }, true);
    setButtonStatus(false);
  };
  
  // 下载数据
  const exportAllData = () => {
    const url = `${baseUrl}/paymentCard/exportPaymentCardList?${stringify({ ...params })}`;
    ExportExcel(url, {}, `卡片列表_${moment(new Date()).format('YYYYMMDDHHmmss')}.xlsx`);
  };
  return (
    <Fragment>
      <PageHeaderWrapper title="分公司管理">
        <Card bordered={false}>
          <div className={styles.header}>
            <div>分公司管理</div>
          </div>
          <div>
            <Form layout="inline">
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                  <FormItem label="提现状态" colon>
                    {getFieldDecorator('qp-customerName-like', {
                      initialValue: '',
                    })(<Input allowClear autoComplete="off" name="name" placeholder="请输入 " />)}
                  </FormItem>
                </Col>
                <Col md={1} offset={3}>
                  <Button type="primary" onClick={resetForm}>
                    重置
                  </Button>
                </Col>
                <Col md={2} sm={24}>
                  <Button type="normal" onClick={goSearch}>
                    查询
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col md={2} sm={24}>
                <Button type="primary" onClick={exportAllData}>
                  批量审核
                </Button>
              </Col>
              <Col md={6} sm={24}>
                <Button type="primary" onClick={exportAllData}>
                  导出
                </Button>
              </Col>
            </Row>
          </div>
                    
          <Divider style={{ marginBottom: '30px' }} />
          <Row gutter={[1, 10]}>
            <Col>
              <div className="ant-alert ant-alert-info" style={{ letterSpacing: '2px' }}>
                <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#37a3ff" />
                <span className="ant-alert-message" style={{ marginLeft: '5px' }}>
                  已选择
                  {0}项
                </span>
                <a style={{ marginLeft: '24px' }}>清空</a>
              </div>
            </Col>
            <Col>
              <Table {...tablePorps} columns={columns} />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Fragment>
  );
}

export default Form.create()(SettleAccounts);
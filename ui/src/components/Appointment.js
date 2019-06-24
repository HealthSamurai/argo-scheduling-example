import React, { useEffect } from 'react';
import useStoreon from 'storeon/react';
import moment from 'moment';

import { Table } from 'antd';

const columns = [
  {
    title: 'Date',
    dataIndex: 'start',
    key: 'start',
    render: (start, r) => (
      <span>
        {moment(start).format('LLL')} - {moment(r.end).format('LLL')}
      </span>
    )
  },
  {
    title: 'Type',
    dataIndex: 'serviceType',
    key: 'serviceType',
    render: type => type[0].coding[0].display
  }
];

export default () => {
  const { dispatch, appointments } = useStoreon('appointments');
  const { loading, error, list } = appointments;

  useEffect(() => {
    dispatch('appointment/get');
  }, [dispatch]);
  if (error) {
    return <div>Error: {error}</div>;
  }
  return <Table rowKey="id" loading={loading} columns={columns} dataSource={list} />;
};

import { useEffect, useState } from 'react';
import { Table, Button, Card, Tooltip, ConfigProvider } from 'antd';
import { PlusOutlined, DeleteOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';

const toURLSearchParams = record => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    params.append(key, value);
  }
  return params;
};

const getRandomuserParams = params => {
  var _a, _b;
  return Object.assign(
    {
      results: (_a = params.pagination) === null || _a === void 0 ? void 0 : _a.pageSize,
      page: (_b = params.pagination) === null || _b === void 0 ? void 0 : _b.current,
    },
    params,
  );
};

const TableCustom = ({ title, columns = [], loading, data, tableParams, onCreate, onExport, onDeleteMultiple, setSelectedRows, fetchData, onChange, onRow, rowKey = "id" }) => {
  const [tableScrollY, setTableScrollY] = useState(400);

  const calculateTableHeight = () => {
    const hFixed = 50 + 300; //header + footer
    const usableHeight = window.innerHeight - hFixed;
    setTableScrollY(usableHeight > 200 ? usableHeight : 200); // tối thiểu 200
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
    },
    getCheckboxProps: record => ({
      name: record.name,
    }),
  };

  useEffect(() => {
    calculateTableHeight(); // tính ban đầu
    window.addEventListener('resize', calculateTableHeight); // cập nhật khi resize
    return () => window.removeEventListener('resize', calculateTableHeight);
  }, []);

  return (
    <>
      <Card style={{ border: '1px solid #d9d9d9', borderRadius: 8 }} styles={{ body: { padding: '12px 12px', } }}>
        <ConfigProvider
          theme={{ components: { Table: { rowHoverBg: '#f0fbff', }, } }}>
          <Table
            size='small'
            rowSelection={Object.assign(rowSelection)}
            columns={columns}
            rowKey={rowKey}
            dataSource={data}
            pagination={tableParams?.pagination}
            loading={loading}
            onChange={onChange}
            onRow={record => (typeof onRow === 'function' ? { onClick: () => onRow(record) } : {})}
            scroll={{ x: 'max-content', y: tableScrollY }}
            title={() => (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', marginBottom: 8, paddingBottom: 8 }}>
                <strong style={{ fontSize: 16, fontWeight: 600 }}>{title}</strong>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Tooltip title="Xuất excel">
                    <Button type="primary" icon={<ExportOutlined />} onClick={() => onExport(tableParams)}
                      className="!text-white !bg-[#52c41a] !border-[#52c41a] hover:!bg-[#73d13d] hover:!border-[#73d13d]"
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Xóa hàng loạt">
                    <Button type="primary" icon={<DeleteOutlined />} onClick={onDeleteMultiple}
                      className="!text-white !bg-[#ff4d4f] !border-[#ff4d4f] hover:!bg-[#ff7875] hover:!border-[#ff7875]"
                    ></Button>
                  </Tooltip>
                  {!title.includes("người dùng") && (
                    <Tooltip title="Thêm mới">
                      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}
                        className="!text-white !bg-[#1890ff] !border-[#1890ff] hover:!bg-[#40a9ff] hover:!border-[#40a9ff]"
                      ></Button>
                    </Tooltip>
                  )}
                  <Tooltip title="Làm mới">
                    <Button type="primary" icon={<ReloadOutlined />} onClick={() => fetchData(tableParams)}
                      className="!text-black !bg-[#f0f0f0] !border-[#d9d9d9] hover:!bg-[#d9d9d9] hover:!border-[#bfbfbf]"
                    ></Button>
                  </Tooltip>
                </div>
              </div>
            )}
          />
        </ConfigProvider>
      </Card>
    </>
  );
};

export default TableCustom;
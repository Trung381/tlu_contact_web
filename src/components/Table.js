import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Table, Divider, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

// const Table = ({ id, data, columns }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="table" id={id}>
//         {/* Head */}
//         <thead>
//           <tr>
//             <th>
//               <label>
//                 <input type="checkbox" className="checkbox" />
//               </label>
//             </th>
//             {columns.map((col, index) => (
//               <th key={index}>{col.label}</th>
//             ))}
//             <th>Hành động</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               <th>
//                 <label>
//                   <input type="checkbox" className="checkbox" />
//                 </label>
//               </th>
//               {columns.map((col, colIndex) => (
//                 <td key={colIndex}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
//               ))}
//               <td>
//                 <span className='bg-blue'><EditIcon /></span>
//                 <DeleteIcon />
//                 <VisibilityIcon />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//   );
// };

// export default Table;





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

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    name: record.name,
  }),
};

const TableCustom = ({columns = [], getData}) => {
  console.log('columns', columns);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const params = toURLSearchParams(getRandomuserParams(tableParams));

  const fetchData = async () => {
    setLoading(true);
    const result = await getData();
    setData(result)
    setLoading(false);
    setTableParams(prevTableParams => ({
      ...prevTableParams,
      pagination: {
        ...prevTableParams.pagination,
        total: 200,
      },
    }));
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <>
      <Table
        rowSelection={Object.assign(rowSelection)}
        columns={columns} // Truyền các hàm xử lý vào cột "Hành động"
        rowKey={record => record.staffId}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TableCustom;
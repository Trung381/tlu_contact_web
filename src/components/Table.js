import React from 'react';

const Table = ({ id, data, columns }) => {
	return (
    <div className="overflow-x-auto">
      <table className="table" id={id}>
        {/* Head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
              ))}
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
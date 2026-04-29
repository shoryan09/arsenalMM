import { useEffect, useState } from "react";

export default function Table() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Data Table</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.value}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

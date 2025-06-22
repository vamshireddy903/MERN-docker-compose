import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = ({ record, deleteRecord }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">{record.name}</td>
    <td className="p-4 align-middle">{record.position}</td>
    <td className="p-4 align-middle">{record.level}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center text-sm font-medium border h-9 rounded-md px-3 hover:bg-slate-100"
          to={`/edit/${record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center text-sm font-medium border h-9 rounded-md px-3 hover:bg-slate-100 hover:text-red-600"
          type="button"
          onClick={() => deleteRecord(record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  // Fetch records
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/record/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error.message);
      }
    }

    getRecords();
  }, []);

  // Delete a record
  async function deleteRecord(id) {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/record/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete record");
      setRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b">
                <th className="h-12 px-4 text-left font-medium">Name</th>
                <th className="h-12 px-4 text-left font-medium">Position</th>
                <th className="h-12 px-4 text-left font-medium">Level</th>
                <th className="h-12 px-4 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <Record key={record._id} record={record} deleteRecord={deleteRecord} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

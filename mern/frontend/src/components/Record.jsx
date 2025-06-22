import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/record/${id}`);
      if (!response.ok) {
        console.error("Error fetching record:", response.statusText);
        return;
      }

      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/record/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred adding or updating a record:", error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Employee Record</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold">Employee Info</h2>
            <p className="mt-1 text-sm text-slate-600">
              This information will be displayed publicly, so be careful what you share.
            </p>
          </div>

          <div className="grid max-w-2xl gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-1 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"
                placeholder="First Last"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="position" className="block text-sm font-medium">Position</label>
              <input
                type="text"
                name="position"
                id="position"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-1 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"
                placeholder="Developer"
                value={form.position}
                onChange={(e) => updateForm({ position: e.target.value })}
              />
            </div>

            <fieldset>
              <legend className="text-sm font-medium">Level</legend>
              <div className="mt-2 space-x-6">
                {["Intern", "Junior", "Senior"].map((level) => (
                  <label key={level} className="inline-flex items-center text-sm">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      checked={form.level === level}
                      onChange={(e) => updateForm({ level: e.target.value })}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="ml-2">{level}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <input
          type="submit"
          value="Save Employee Record"
          className="mt-6 inline-flex items-center justify-center border rounded-md px-4 py-2 bg-slate-100 text-sm font-medium hover:bg-slate-200"
        />
      </form>
    </>
  );
}

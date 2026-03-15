import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedName(name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Simple React Frontend</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          />

          <button
            type="submit"
            className="w-full bg-black text-white rounded-xl py-2"
          >
            Submit
          </button>
        </form>

        {submittedName && (
          <p className="mt-4 text-lg">Hello, {submittedName}! 👋</p>
        )}
      </div>
    </div>
  );
}

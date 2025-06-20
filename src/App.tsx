// src/App.tsx
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [preferredDoctor, setPreferredDoctor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const appointment = { name, age, symptoms, preferredDoctor };

    try {
      const res = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });

      if (res.ok) alert("Appointment booked successfully!");
      else alert("Failed to book appointment");
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Receptionist Voice Entry Form</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-md"
      >
        <label className="block mb-2">
          Name:
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Age:
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Symptoms:
          <textarea
            className="w-full border p-2 rounded"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          Preferred Doctor:
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={preferredDoctor}
            onChange={(e) => setPreferredDoctor(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

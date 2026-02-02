"use client";
import { useState } from "react";

export default function TownSelector({ towns, onSelect }: { towns: string[], onSelect: (town: string) => void }) {
  const [selected, setSelected] = useState(towns[0] || "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <select value={selected} onChange={handleChange} className="border p-2 rounded">
      {towns.map((town) => (
        <option key={town} value={town}>{town}</option>
      ))}
    </select>
  );
}

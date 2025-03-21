"use client";
import { useState } from "react";
import CustomCheckox from "./customCheckbox";

export default function Todo({
  id,
  content,
  completed,
  checkTask,
}: {
  id: string;
  content: string;
  completed: string;
  checkTask: (task_id: string) => void;
}) {
  const [checked, setChecked] = useState<string>(completed);
  return (
    <div className="flex bg-gray-100 p-4 rounded-lg mt-4">
      <CustomCheckox
        checked={checked === "true"}
        onChange={(e) => {
          setChecked(e ? "true" : "false");
          checkTask(id);
        }}
      />
      <p className="ml-3">{content}</p>
    </div>
  );
}

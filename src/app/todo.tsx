"use client";
import CustomCheckox from "./customCheckbox";

export default function Todo({
  id,
  content,
  completed,
  checkTask,
}: {
  id: string;
  content: string;
  completed: boolean;
  checkTask: (task_id: string) => void;
}) {
  return (
    <div className="flex p-4 rounded-lg mt-4">
      <CustomCheckox
        checked={completed}
        onChange={() => {
          if (completed) return;
          checkTask(id);
        }}
      />
      <p className="ml-3">{content}</p>
    </div>
  );
}

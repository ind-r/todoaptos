"use client";
import InputTodo from "./inputTodo";
import Todo from "./todo";
import { Task } from "./page";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export default function TodoContainer({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const { account, signAndSubmitTransaction } = useWallet();

  const checkTask = async (task_id: string) => {
    if (!account) return;

    const moduleAddress = MODULE_ADDRESS;

    const txn: InputTransactionData = {
      data: {
        function: `${moduleAddress}::todolist::complete_task`,
        functionArguments: [task_id],
      },
    };

    try {
      const response = await signAndSubmitTransaction(txn);

      await aptosClient().waitForTransaction({ transactionHash: response.hash });

      const newTasks = tasks.map((task) => {
        if (task.task_id === task_id) {
          return { ...task, completed: true };
        }
        return task;
      });
      setTasks(newTasks);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="pb-32">
      <InputTodo tasks={tasks} setTasks={setTasks} />
      <div className="w-full">
        {tasks.map((todo) => (
          <Todo
            key={todo.task_id}
            id={todo.task_id}
            content={todo.content}
            completed={todo.completed}
            checkTask={checkTask}
          />
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Task } from "./page";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
export default function InputTodo({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const { account, signAndSubmitTransaction } = useWallet();

  const onTaskAdded = async () => {
    if (!account) return;
    const moduleAddress = MODULE_ADDRESS;
    setTransactionInProgress(true);
    const txn: InputTransactionData = {
      data: {
        function: `${moduleAddress}::todolist::create_task`,
        functionArguments: [content],
      },
    };
    const lastestId = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].task_id) + 1 : 1;
    const newTaskToPush: Task = {
      address: account.address.toString(),
      completed: false,
      content: content,
      task_id: lastestId + "",
    };

    try {
      const response = await signAndSubmitTransaction(txn);
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      let newTasks = [...tasks];
      newTasks.push(newTaskToPush);
      setTasks(newTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (transactionInProgress) return;
    if (e.key === "Enter" && content) {
      onTaskAdded();
      setContent("");
    }
  };

  return (
    <div
      className={`flex  p-4 rounded-lg mt-4 transition ease-in-out w-full ${isFocused ? "shadow-md scale-105 bg-black" : ""}`}
    >
      <input
        type="text"
        className="w-full bg-transparent focus:outline-none"
        placeholder="What needs to be done?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyUp={(e) => handleKeyUp(e)}
      />
    </div>
  );
}

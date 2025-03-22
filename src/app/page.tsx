"use client";

import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import TodoContainer from "./TodoContainer";

export type Task = {
  address: string;
  completed: string;
  content: string;
  task_id: string;
};

function App() {
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transcationPending, setTransactionPending] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { account, signAndSubmitTransaction } = useWallet();
  const moduleAddress = MODULE_ADDRESS;

  const fetchList = async () => {
    if (!account) return;
    setTransactionPending(true);
    try {
      const todoListResource = await aptosClient().getAccountResource({
        accountAddress: account?.address,
        resourceType: `${moduleAddress}::todolist::TodoList`,
      });
      setAccountHasList(true);
      const tableHandle = (todoListResource as any).tasks.handle;
      const taskCounter = (todoListResource as any).task_count;

      let tasksGot = [];
      let counter = 1;
      while (counter <= taskCounter) {
        const tableItem = {
          key_type: "u64",
          value_type: `${moduleAddress}::todolist::Task`,
          key: `${counter}`,
        };
        const taskGot = await aptosClient().getTableItem<Task>({ handle: tableHandle, data: tableItem });
        tasksGot.push(taskGot);
        counter++;
      }
      setTasks(tasksGot);
    } catch (_) {
      setAccountHasList(false);
    } finally {
      setTransactionPending(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [account?.address]);

  const createNewList = async () => {
    if (!account) return [];

    const txn: InputTransactionData = {
      data: {
        function: `${moduleAddress}::todolist::create_list`,
        functionArguments: [],
      },
    };
    try {
      const response = await signAndSubmitTransaction(txn);
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      setAccountHasList(true);
    } catch (_) {
      setAccountHasList(false);
    }
  };
  return (
    <>
      <Header />
      <div className="flex items-start justify-center flex-col container">
        <div className="text-4xl mt-10 bg-red-100 px-10 py-5 rounded-xl">Todo List</div>
        {accountHasList === false ? (
          <>
            <button onClick={createNewList} disabled={transcationPending}>
              Create Todo List
            </button>
          </>
        ) : (
          <TodoContainer tasks={tasks} setTasks={setTasks} />
        )}
      </div>
    </>
  );
}

export default App;

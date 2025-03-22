"use client";

import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import TodoContainer from "./TodoContainer";
import Footer from "@/components/Footer";

export type Task = {
  address: string;
  completed: boolean;
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
      console.log(tasksGot);
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

  if (transcationPending)
    return (
      <>
        <Header />
        <div className="text-white text-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-end font-mono">
          <p className="text-white font-mono">Loading...</p>
        </div>
        <Footer />
      </>
    );

  if (!account) {
    return (
      <>
        <Header />
        <div className="text-white text-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-end font-mono">
          <p>Connect your wallet to get started</p>
          <svg
            fill="#000000"
            viewBox="0 0 24 24"
            id="up-trend-round"
            data-name="Flat Line"
            xmlns="http://www.w3.org/2000/svg"
            className="icon flat-line invert w-20"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                id="primary"
                d="M21,7l-6.79,6.79a1,1,0,0,1-1.42,0l-2.58-2.58a1,1,0,0,0-1.42,0L3,17"
                style={{
                  fill: "none",
                  stroke: "#000000",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              ></path>
              <polyline
                id="primary-2"
                data-name="primary"
                points="21 11 21 7 17 7"
                style={{
                  fill: "none",
                  stroke: "#000000",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              ></polyline>
            </g>
          </svg>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="container pt-10">
        {!accountHasList ? (
          <div className="text-white text-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-end font-mono">
            <div className="flex flex-col items-center justify-center w-full">
              <button
                className="text-white px-5 py-5 bg-black rounded-xl font-mono text-xl"
                onClick={createNewList}
                disabled={transcationPending}
              >
                Initialize Todo List
              </button>
            </div>
          </div>
        ) : (
          <TodoContainer tasks={tasks} setTasks={setTasks} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;

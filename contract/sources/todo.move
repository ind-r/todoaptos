module todo_addr::todolist {  
  use aptos_framework::event;
  use aptos_framework::account;
  use std::string::String;
  use std::signer;
  use aptos_std::table::{Table, Self};

  const ENOT_INITIALIZED: u64 = 1;
  const ETASK_DOESNT_EXIST: u64 = 2;
  const ETASK_IS_COMPLETED: u64 = 3;

  struct TodoList has key {
    tasks: Table<u64, Task>,
    set_task_event: event::EventHandle<Task>,
    task_count: u64
  }

  struct Task has store, copy, drop {
    task_id: u64,
    address: address,
    content: String,
    completed: bool
  }

  public entry fun create_list(account: &signer) {
    let todo_list = TodoList {
      tasks: table::new(),
      set_task_event: account::new_event_handle<Task>(account),
      task_count: 0
    };

    move_to(account, todo_list);
  }

  public entry fun create_task(account: &signer, content: String)
  acquires TodoList {
    let signer_address = signer::address_of(account);
    assert!(exists<TodoList>(signer_address), ENOT_INITIALIZED);
    let todo_list = borrow_global_mut<TodoList>(signer_address);
    let counter = todo_list.task_count + 1;
    let new_task = Task {
      task_id: counter,
      address: signer_address,
      content,
      completed: false
    };
    table::upsert(&mut todo_list.tasks, counter, new_task);
    todo_list.task_count = counter;

    event::emit_event<Task>(
      &mut borrow_global_mut<TodoList>(signer_address).set_task_event,
      new_task
    );
  }

  public entry fun complete_task(account: &signer, task_id: u64) 
  acquires TodoList {
    let signer_address = signer::address_of(account);
    assert!(exists<TodoList>(signer_address), ENOT_INITIALIZED);
    let todo_list = borrow_global_mut<TodoList>(signer_address);
    assert!(table::contains(&todo_list.tasks, task_id), ETASK_DOESNT_EXIST);
    let task = table::borrow_mut(&mut todo_list.tasks, task_id);
    assert!(task.completed == false, ETASK_IS_COMPLETED);
    task.completed = true;
  }
  
  public fun get_task(account: &signer, task_id: u64): (String, bool)
  acquires TodoList {
    let signer_address = signer::address_of(account);
    let todo_list = borrow_global<TodoList>(signer_address);
    let task = table::borrow(&todo_list.tasks, task_id);
    return (task.content, task.completed)
  }

  #[test_only]
  use std::string::utf8;
  #[test(admin = @0x123)]
  public entry fun testing(admin: &signer) acquires TodoList {
    // create an account for testing events
    account::create_account_for_test(signer::address_of(admin));

    // create a todo list
    create_list(admin);

    // create a task
    create_task(admin, utf8(b"Buy milk"));

    // get the count of tasks
    let task_count = event::counter(&borrow_global<TodoList>(signer::address_of(admin)).set_task_event);
    assert!(task_count == 1, 0);

    // get the todo_list
    let todo_list = borrow_global<TodoList>(signer::address_of(admin));
    assert!(table::contains(&todo_list.tasks, 1), 1);

    // get the task
    let task = table::borrow(&todo_list.tasks, todo_list.task_count);
    assert!(task.task_id == 1, 2);
    assert!(task.completed == false, 3);
    assert!(task.content == utf8(b"Buy milk"), 4);
    
    // complete the task
    complete_task(admin, 1);
  let todo_list = borrow_global<TodoList>(signer::address_of(admin));
  let task_record = table::borrow(&todo_list.tasks, 1);
  assert!(task_record.task_id == 1, 5);
  assert!(task_record.completed == true, 6);

  }

}
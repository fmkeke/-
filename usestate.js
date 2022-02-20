let isMounted = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memoriesedState: null, //记录hooks 链表的最开始一个
};

const schedule = () => {
  workInProgressHook = fiber.memoriesedState;
  const app = fiber.stateNode();
  isMounted = false;
  return app;
};

function useState(initState) {
  let hook;

  if (isMounted) {
    hook = {
      memoriesedState: initState,
      next: null, //hook链表
      queue: {
        pending: null, //每个hook状态链表,只记录未操作的
      },
    };
    if (!fiber.memoriesedState) {
      fiber.memoriesedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoriesedState;
  //更新
  if (hook.queue.pending) {
    //   更新baseState
    let firstUpdate = hook.queue.pending;

    //每个hook是可能存在多个等待执行的操作吗
    do {
      action = firstUpdate.action;
      baseState = action(firstUpdate.memoriesedState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== queue.pending.next);

    hook.queue.pending = null; //为什么要执行这一步?,操作结束,删除所有action
  }
  hook.memoriesedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  let update = {
    action,
    next: null,
  };

  //新增action
  if (queue.pending === null) {
    // 循环链表
    update.next = update;
  } else {
    // 循环链表 添加元素
    //queue.pending.next指向的是最开始的update
    update.next = queue.pending.next;
    // 上一个update.next指向当前update
    queue.pending.next = update;
  }
  //当前update替换到要执行的地方
  queue.pending = update;
  schedule();
}
function App() {
  const [num, addNum] = useState(0);
  const [num2, addNum2] = useState(2);
  console.log(isMounted, 'isMounted');
  console.log(num, 'num');
  console.log(num2, 'num2');
  return {
    onClick() {
      addNum((num) => num + 1);
    },
    onfocus() {
      addNum2((num2) => num2 + 3);
    },
  };
}

window.app = schedule();

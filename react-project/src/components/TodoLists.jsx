import React, { useEffect } from "react";
import classes from "./TodoLists.module.scss";

import { useSelector, useDispatch } from "react-redux";
import { fetchTodoList, addTodoAction } from "../store/TodoLists-actions";

import TodoItem from "./TodoItem";
function TodoLists() {
  const dispatch = useDispatch();
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const todoListArr = useSelector((state) => state.TodoListSlice.TodoLists);
  const addTodo = () => {
    dispatch(addTodoAction(logIN));
  };

  useEffect(() => {
    if (logIN && todoListArr.length === 0) {
      dispatch(fetchTodoList(logIN));
    }
  }, []);

  return (
    <>
      <div className={classes.titleDiv}>
        <h1 className={classes.title}>Todo List</h1>
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div className={classes.layout}>
        {todoListArr.map((TodoList, index) => {
          return (
            <TodoItem
              key={TodoList._id}
              TodoListId={TodoList._id}
              TodoListIndex={index}
              title={TodoList.title}
              list={TodoList.list}
            />
          );
        })}
      </div>
    </>
  );
}

export default TodoLists;

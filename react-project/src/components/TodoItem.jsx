import React, { useState } from "react";
import classes from "./TodoItem.module.scss";

import TodoInfo from "./TodoInfo/TodoInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTodoAction,
  addList,
  deleteListAction,
  changeStatusAction,
  reorderListAction,
} from "../store/TodoLists-actions";
import { Reorder } from "framer-motion";

import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

function TodoItem(props) {
  const dispatch = useDispatch();
  const { TodoListId, TodoListIndex, title, list, myTeam, userId } = props;
  const [infoMdl, setInfoMdl] = useState(false);
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const [task, setTask] = useState("");

  const handleInputChange = (event) => {
    setTask(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addItem(task);
    }
  };

  const changeStatus = (listId, listIndex) => {
    if (logIN) {
      dispatch(changeStatusAction(listId, TodoListIndex, listIndex, logIN));
    }
  };

  const delteItem = (listId, listIndex) => {
    if (logIN) {
      dispatch(deleteListAction(listId, listIndex, TodoListIndex, logIN));
    }
  };

  const delteTodoList = () => {
    if (logIN) {
      dispatch(deleteTodoAction(TodoListId, logIN));
    }
  };

  const addItem = (task) => {
    if (logIN && task.trim() !== "") {
      dispatch(addList(task, TodoListId, TodoListIndex, logIN));
    }
    setTask("");
  };

  const changeList = (newItems) => {
    if (logIN) {
      dispatch(reorderListAction(newItems, TodoListIndex, TodoListId, logIN));
    }
  };

  return (
    <>
    {infoMdl && <TodoInfo onClose={setInfoMdl} TodoListIndex={TodoListIndex} TodoListId={TodoListId} myTeam={myTeam} userId={userId} />}
      <div className={classes["todo-app"]}>
        <div className={classes["app-title"]}>
          <h2>{title}</h2>
          <div className={classes.iconBtn}>
            <div onClick={()=>{setInfoMdl(true)}}>
              <IoInformationCircleOutline />
            </div>
            <div className={classes['iconBtn--cancel']} onClick={delteTodoList}>
              <MdOutlineCancel />
            </div>
          </div>
        </div>
        <div className={classes.row}>
          <input
            type="text"
            id={classes["input-box"]}
            placeholder="add your tasks"
            value={task}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => {
              addItem(task);
            }}
          >
            Add
          </button>
        </div>
        {/* <ul id={classes["list-container"]}> */}
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={(newItems) => {
            changeList(newItems);
          }}
        >
          {list.map((item, listIndex) => (
            <Reorder.Item
              className={`${
                item.status === "completed"
                  ? `${classes.checked} ${classes.ulItem}`
                  : classes.ulItem
              }`}
              key={item._id}
              value={item}
              onDoubleClick={() => {
                changeStatus(item._id, listIndex);
              }}
            >
              {item.text}
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  delteItem(item._id, listIndex);
                }}
              >
                x
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </>
  );
}

export default TodoItem;

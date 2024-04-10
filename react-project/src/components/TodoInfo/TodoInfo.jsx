import React from "react";
import classes from "./TodoInfo.module.scss";
import Modal from "../ui/Modal/Modal";

function TodoInfo(props) {
  const { onClose } = props;
  return (
    <>
      <Modal onClose={onClose} />
      <div className={classes.cmtModal}>Hello</div>
    </>
  );
}

export default TodoInfo;

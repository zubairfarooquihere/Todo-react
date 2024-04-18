import React, { useState, useEffect } from "react";
import classes from "./TodoInfo.module.scss";
import Modal from "../ui/Modal/Modal";
import AddTeam from "./AddTeam";
import { gql, useQuery } from "@apollo/client";
import { MdOutlineCancel } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

const getMemberInfo = gql`
  query ($todoId: String!, $userId: String!) {
    getMemberInfo(todoId: $todoId, userId: $userId) {
      owner
      readAndWrite
      readOnly
      ownerName
    }
  }
`;

const getComments = gql`
  query($todoId: String!) {
    getComments(todoId: $todoId) {
      _id comment userId
    }
  }
`;

const addComment = gql`
  mutation($todoId: String!, $comment: String!, $userId: String!) {
    addComment(todoId: $todoId, comment: $comment, userId: $userId) {
      _id comment userId
    }
  }
`

const deleteComment = gql`
  mutation($commentId: String!, $todoId: String!) {
    deleteComment(commentId: $commentId, todoId: $todoId)
  }
`

function TodoInfo(props) {
  const dispatch = useDispatch();
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const { onClose, TodoListIndex, TodoListId, myTeam, userId } = props;
  const [addTeam, setAddTeam] = useState(false);
  const { loading, error, data } = useQuery(getMemberInfo, {
    variables: { todoId: TodoListId, userId: JSON.parse(logIN).userId },
  });
  const { loading: l1, error: e1, data: cmt } = useQuery(getComments, {
    variables: { todoId: TodoListId },
  });
  const [message, setMessage] = useState('');

  if (error) {
    console.log("Error fetching Member Info: " + error);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && message.trim().length !== 0) {
      console.log(message); // This will print the message to the console
      setMessage(''); // Clear the input field after pressing Enter
    }
  };
  //console.log(cmt);
  return (
    <>
      <Modal onClose={onClose} />
      {addTeam && (
        <AddTeam
          myTeams={myTeam}
          TodoListIndex={TodoListIndex}
          TodoListId={TodoListId}
          userId={userId}
          onClose={setAddTeam}
        />
      )}
      <div className={classes.todoinfo}>
        <div className={classes.todoinfo__header}>
          <div className={classes["todoinfo__header--title"]}>
            My List (
            {data && data.getMemberInfo
              ? data.getMemberInfo.owner
                ? "Owner"
                : data.getMemberInfo.readAndWrite
                ? "Read and write"
                : "Read Only"
              : null}
            )
          </div>
          <div className={classes["todoinfo__header--actionbtn"]}>
            <MdOutlineCancel />
          </div>
        </div>
        <div className={classes.linebreak} />
        <div className={classes.details}>
          <div className={classes.details__first}>
            <div className={classes["details__first--owner"]}>
              <div className={classes["details__first--owner--title"]}>
                Owner:
              </div>
              <div className={classes["details__first--owner--name"]}>
                {data && data.getMemberInfo.ownerName}
              </div>
            </div>
            <div className={classes["details__first--team"]}>
              <div className={classes["details__first--team--title"]}>
                Team{" "}
                <div
                  onClick={() => {
                    setAddTeam(true);
                  }}
                >
                  <FaUserPlus />
                </div>
              </div>
              <div className={classes["details__first--team--list"]}>
                {myTeam.map((team) => {
                  return <div key={team._id}>{team.user.name}</div>;
                })}
              </div>
            </div>
            <div className={classes["details__first--notification"]}>
              <div className={classes["details__first--notification--title"]}>
                Notification
              </div>
              <div className={classes["details__first--notification--place"]}>
                <div className={classes["details__first--notification--msg"]}>
                  This is my notification
                </div>
              </div>
            </div>
          </div>
          <div className={classes.details__second}>
          <input
            className={classes.commentBox}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
          />
            <div className={`${classes.comments}`}>
              {cmt && cmt.getComments.map((commentObj) =>{
                if(commentObj.userId === JSON.parse(logIN).userId) {
                  return (<div key={commentObj._id} className={`${classes.comments__comment} ${classes['comments__comment--me']}`}>{commentObj.comment}</div>)
                }else {
                  return (<div key={commentObj._id} className={`${classes.comments__comment} ${classes['comments__comment--sender']}`}>{commentObj.comment}</div>);
                }
              })}
              {/* <div className={`${classes.comments__comment} ${classes['comments__comment--me']}`}>Sender is Me</div>
              <div className={`${classes.comments__comment} ${classes['comments__comment--sender']}`}>Sender is Other</div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoInfo;

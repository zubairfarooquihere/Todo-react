import React, {useState} from "react";
import classes from "./TodoInfo.module.scss";
import Modal from "../ui/Modal/Modal";
import AddTeam from "./AddTeam";
import { gql, useQuery } from "@apollo/client";
import { MdOutlineCancel } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";

const getMemberInfo = gql`
  query ($todoId: String!, $userId: String!) {
    getMemberInfo(todoId: $todoId, userId: $userId) {
      owner readAndWrite readOnly ownerName
    }
  }
`;

function TodoInfo(props) {
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const { onClose, TodoListIndex, TodoListId, myTeam } = props;
  const [addTeam, setAddTeam] = useState(false);
  const { loading, error, data } = useQuery(getMemberInfo, {
    variables: { todoId: TodoListId, userId: JSON.parse(logIN).userId },
  });
  console.log(data);
  return (
    <>
      <Modal onClose={onClose} />
      {addTeam && <AddTeam myTeam={myTeam} TodoListIndex={TodoListIndex} TodoListId={TodoListId} onClose={setAddTeam} />}
      <div className={classes.todoinfo}>
        <div className={classes.todoinfo__header}>
          <div className={classes["todoinfo__header--title"]}>My List ({data && data.getMemberInfo ? (data.getMemberInfo.owner ? 'Owner' : data.getMemberInfo.readAndWrite ? 'Read and write' : 'Read Only' ) : null})</div>
          <div className={classes["todoinfo__header--actionbtn"]}><MdOutlineCancel /></div>
        </div>
        <div className={classes.linebreak} />
        <div className={classes.details}>
          <div className={classes.details__first}>
            <div className={classes['details__first--owner']}>
              <div className={classes['details__first--owner--title']}>Owner:</div>
              <div className={classes['details__first--owner--name']}>{data && data.getMemberInfo.ownerName}</div>
            </div>
            <div className={classes['details__first--team']}>
            <div className={classes['details__first--team--title']}>Team <div onClick={()=>{setAddTeam(true)}}><FaUserPlus /></div></div>
              <div className={classes['details__first--team--list']}>
                {myTeam.map((team) => {
                  return (<div key={team._id}>{team.user.name}</div>)
                })}
              </div>
            </div>
            <div className={classes['details__first--notification']}>
                <div className={classes['details__first--notification--title']}>Notification</div>
                <div className={classes['details__first--notification--place']}>
                  <div className={classes['details__first--notification--msg']}>This is my notification</div>
                </div>
            </div>
          </div>
          <div className={classes.details__second}>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoInfo;

import React, { useState, useEffect } from "react";
import classes from "./AddTeam.module.scss";
import { useDispatch } from "react-redux";
import { gql, useQuery, useMutation } from "@apollo/client";
import { TodoListActions } from "../../store/TodoLists-slice";

import Modal from "../ui/Modal/Modal";

const getUsers = gql`
  query ($email: String!) {
    findUser(email: $email) {
      _id
      email
      name
    }
  }
`;

const addUserToTodoGQL = gql`
  mutation($emails: [String!]!, $todoId: String!) {
    addUserToTodo(emails: $emails, todoId: $todoId) {
      _id readAndWrite readOnly user {
        _id email name
      }
    }
  }
`;

const deleteUserToTodoGQL = gql`
  mutation($email: String!, $todoId: String!) {
    deleteUserToTodo(email: $email, todoId: $todoId) {
      user {
        _id email name
      }
      _id readAndWrite readOnly
    }
  }
`;

function AddTeam(props) {
  const { onClose, TodoListIndex, TodoListId, myTeam } = props;
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [newTeam, setNewTeam] = useState([]);

  // Use useQuery hook to fetch data
  const { loading, error, data } = useQuery(getUsers, {
    skip: !searchValue, // Skip the query if searchValue is falsy
    variables: { email: searchValue },
  });
  const [addUserToTodo, { loading2, error2 }] = useMutation(addUserToTodoGQL);
  const [deleteUserToTodo, { deleteLoading, deleteError }] = useMutation(deleteUserToTodoGQL);

  // Log data and errors
  if (error) {
    console.error("Error fetching data:", error);
  }

  const handleInputChange = (event) => {
    setSearchValue(event.target.value); // Update the searchValue state with the input value
  };

  const addInTeam = (user) => {
    const { email } = user
    setNewTeam((prev) => {
      return [...prev, user];
    });
  };

  function isUserInTeam(user) {
    const res = myTeam.some((teamMember) => teamMember.user._id === user._id);
    const res2 = newTeam.some((teamMember) => teamMember._id === user._id);
    if(res || res2) {
      return true;
    }
    return false;
  }

  const save = () => {
    const teamEmail = newTeam.map((team) => {return team.email})
    console.log(teamEmail);
    addUserToTodo({ variables: { emails: teamEmail, todoId: TodoListId } })
      .then(response => {
        console.log('response response');
        console.log(response);
        dispatch(TodoListActions.addTeam({TodoListIndex, myTeam: [...response.data.addUserToTodo]}));
      })
      .catch(error => {
        console.error('Failed to add user to todo:', error);
      });
    onClose();
  };

  const deleteMyTeam = (email) => {
    deleteUserToTodo({ variables: { email, todoId: TodoListId } })
      .then(response => {
        console.log('response response');
        console.log(response);
        dispatch(TodoListActions.addTeam({TodoListIndex, myTeam: [...response.data.deleteUserToTodo]}));
      })
      .catch(error => {
        console.error('Failed to add user to todo:', error);
      });
  }
 
  return (
    <>
      <Modal onClose={onClose} />
      <div className={classes.layout}>
        <div className={classes.search}>
          <input
            className={classes.search__input}
            type="text"
            id="search"
            placeholder="Search..."
            value={searchValue}
            onChange={handleInputChange}
          />
          {searchValue && (
            <div className={classes.search__result}>
              <ul>
                {data &&
                  data.findUser.map((user) => {
                    // Check if user is not in current team
                    if (!isUserInTeam(user)) {
                      return (
                        <li
                          onClick={() => {
                            addInTeam(user);
                          }}
                          key={user._id}
                        >
                          {user.email}
                        </li>
                      );
                    } else {
                      return null; // Exclude the user from rendering if their ID matches
                    }
                  })}
              </ul>
            </div>
          )}
          <button type="submit">Search</button>
        </div>
        <div className={classes.team}>
          <div className={classes.team__header}>My Team</div>
          <ul className={classes.team__persons}>
            {myTeam.map((team) => {
              return (
                <li
                  className={classes["team__persons--details"]}
                  key={team._id}
                >
                  <div>{team.user.email}</div>
                  <div>
                    <div style={{cursor: 'pointer'}} onClick={()=>{deleteMyTeam(team.user.email)}}>X</div>
                  </div>
                </li>
              );
            })}
            {newTeam.map((team) => {
              return (
                <li
                  className={classes["team__persons--details"]}
                  key={team._id}
                >
                  <div>{team.email}</div>
                  <div>
                    <div>X</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={classes.button}>
          <div
            onClick={() => {
              onClose(false);
            }}
            className={classes.button__cancel}
          >
            Cancel
          </div>
          <div onClick={save} className={classes.button__save}>
            Save
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTeam;

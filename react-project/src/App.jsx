import React, { useState, useEffect } from "react";
import classes from "./App.module.scss";
import TodoLists from "./components/TodoLists";
import Nav from "./components/Nav";
import SignupLogin from "./components/SignupLogin";
import { useSelector } from "react-redux";

// import { gql, useQuery } from "@apollo/client";
// const listAllMovies = gql`
//   query {
//     movies {
//       title
//     }
//   }
// `;
function App() {
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  // const { loading, error, data } = useQuery(listAllMovies);
  // console.log("data");
  // console.log(data);
  // if (loading) return <p>We are loading your movies...</p>;
  // if (error) return <p>Cannot fetch your movies! : {error.message}</p>;
  // if (data.listMovies.length === 0) return <p>Please add some movies first</p>;
  return (
    <>
      <Nav logIN={logIN} />
      {logIN ? <TodoLists /> : <SignupLogin />}
    </>
  );
}

export default App;

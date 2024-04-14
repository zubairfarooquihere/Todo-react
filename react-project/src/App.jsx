//git push -u origin2 main
//https://react-icons.github.io/react-icons/
import React, { useState, useEffect } from "react";
import classes from "./App.module.scss";
import TodoLists from "./components/TodoLists";
import Nav from "./components/Nav";
import SignupLogin from "./components/SignupLogin";
import { useSelector } from "react-redux";

function App() {
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  return (
    <>
      <Nav logIN={logIN} />
      {logIN ? <TodoLists /> : <SignupLogin />}
    </>
  );
}

export default App;

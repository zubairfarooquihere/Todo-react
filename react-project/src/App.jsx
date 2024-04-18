//git push -u origin2 main
//https://react-icons.github.io/react-icons/
import React, { useState, useEffect } from "react";
import "./App.css";
import TodoLists from "./components/TodoLists";
import Nav from "./components/Nav";
import SignupLogin from "./components/SignupLogin";
import { useSelector } from "react-redux";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LoginStateActions } from "./store/LoginState-slice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  
  const authLink = setContext((_, { headers }) => {
    //if (Cookies.get("token")) {
      //console.log(JSON.parse(logIN).token);
      let token = JSON.parse(logIN).token;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    // } else {
    //   dispatch(LoginStateActions.logOut());
    // }
  });

  const httpLink = createHttpLink({
    uri: "http://localhost:8080/graphql", // Your GraphQL endpoint
  });

  // Concatenate the token middleware link with the HTTP link
  const link = authLink.concat(httpLink);

  // Create the Apollo Client instance
  const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  return (
    <>
      <ApolloProvider client={apolloClient}>
        <Nav logIN={logIN} />
        {logIN ? <TodoLists /> : <SignupLogin />}
      </ApolloProvider>
    </>
  );
}

export default App;

import { StrictMode } from "react";

import "./index.css";
import { BrowserRouter } from "react-router";
import PagesContainer from "./pages-container.jsx";
import { createRoot } from "react-dom/client";
import { DarkProvider } from "./hooks/DarkContext.jsx";

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <BrowserRouter>
        <DarkProvider>
          <PagesContainer />
        </DarkProvider>
      </BrowserRouter>
    </StrictMode>
  </ApolloProvider>,
);

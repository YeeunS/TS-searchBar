import React from "react";
import SearchBar from "./components/SearchBar";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Search</h1>
      <SearchBar />
    </div>
  );
};

export default App;

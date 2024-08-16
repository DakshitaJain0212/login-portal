
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/PdfViewerPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Navbar>
    </Router>
  );
};

export default App;

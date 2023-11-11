import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from './pages/Hero';
import './App.css';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      
      <div>
        <Routes>
          <Route path="/" element={< Hero />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          
        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;

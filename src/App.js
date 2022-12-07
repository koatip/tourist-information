import db from './firebase/db'; // eslint-disable-line no-unused-vars
// ↑↑↑ A FENTI SOR(OKA)T NE MÓDOSÍTSD ↑↑↑
import './App.scss';
import React from "react";
import Attractions from "./Attractions";
import Form from "./components/Form"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Attractions />} />
        <Route path="/attraction/new" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

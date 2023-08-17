import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form_User from "./components/Page/Form_User";
import LoginPage from "./components/Page/LoginPage";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" Component={LoginPage} />
        <Route path="/Login" Component={LoginPage} />
        <Route path="/Register" element={<Form_User mode="Register" />} />
        <Route path="/Update" element={<Form_User mode="Update" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

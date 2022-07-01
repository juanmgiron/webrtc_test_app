import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreationPanel from "./components/CreationPanel";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={<CreationPanel/>} />
          <Route exact path="/publisher" element={<Publisher/>} />
          <Route exact path="/subscriber" element={<Subscriber/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

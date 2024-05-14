import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import './globalStyles.css';
import './App.css';
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import ExplorePetition from "./components/ExplorePetition"

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/petition/:id" element={<ExplorePetition />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;

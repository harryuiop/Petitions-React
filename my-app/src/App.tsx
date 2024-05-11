import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import PetitionCard from "./components/PetitionCard";
import './globalStyles.css';
import './App.css';
import PetitionTable from "./components/PetitionTable";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/petition" element={<PetitionTable />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;

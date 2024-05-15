import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import NotFound from "./components/NotFound";
import './globalStyles.css';
import './App.css';
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import ExplorePetition from "./components/ExplorePetition"
import {UserAuth} from "user";
import {userAuthDetailsContext} from "./utils/userAuthContext";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [authUser, setAuthUser] = useState<UserAuth>({
        userId: -1,
        token: "",
        loggedIn: false
    });

    useEffect(() => {
        const userId =  localStorage.getItem("userId");
        const token = localStorage.getItem("token");
            if (userId === null || token === null) {
                setAuthUser({userId: -1, token: "", loggedIn: false})
            } else {
                setLoggedIn(true);
                setAuthUser({userId: parseInt(userId, 10), token: localStorage.getItem("token") as string, loggedIn: true})
            }
    }, [loggedIn]);

    const handleLogin = (user: UserAuth) => {
        setLoggedIn(true);
        setAuthUser(user);
    };

    const handleLogout = () => {
        setAuthUser({userId: -1, token: "", loggedIn: false});
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        setLoggedIn(false);
    }

  return (
      <userAuthDetailsContext.Provider value={{authUser, handleLogin, handleLogout, loggedIn}}>
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/petition/:id" element={<ExplorePetition />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </div>
      </userAuthDetailsContext.Provider>
  );
}

export default App;

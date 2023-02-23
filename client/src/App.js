import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile.jsx"
import Register from "./pages/register/Register";
import {Routes, Route, Link} from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Register />}/>
        <Route path='/login' element={user ? <Link to="/" /> : <Login />}/>
        <Route path='/register' element={user ? <Link to="/" /> : <Link />}/>
        <Route path='/profile/:username' element={<Profile/>}/>
      </Routes>
    </>
    
  )
}

export default App;
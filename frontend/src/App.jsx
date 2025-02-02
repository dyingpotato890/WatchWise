
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login'
import Home from './pages/Home'


const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;

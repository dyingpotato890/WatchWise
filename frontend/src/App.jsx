
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login'
import Home from './pages/home/Home'
import MoodPage from './pages/MoodPage'

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/mood" element={<MoodPage />} />
    </Routes>
  );
};

export default App;

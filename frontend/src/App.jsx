
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login'
import MoodPage from './pages/Mood/Mood'


const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      <Route path="/mood" element={<MoodPage />} />
    </Routes>
  );
};

export default App;

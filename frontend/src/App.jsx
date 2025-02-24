
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login'
import MoodPage from './pages/Mood/Mood'
import Home from './pages/home/Home';
import Chatbot from './pages/chat/Chatbot'


const App = () => {
  return (
    <Routes>

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path ="/" element={<Home />} />
      <Route path ="/chat" element={<Chatbot />} />
       <Route path ="/home" element={<Home />} />
      <Route path="/mood" element={<MoodPage />} />
    </Routes>
  );
};

export default App;

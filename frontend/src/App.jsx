
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/login/Login'
import MoodPage from './pages/Mood/Mood'
import Home from './pages/home/Home';
import Chatbot from './pages/chat/Chatbot'
import Recommendation from "./pages/recommendation/Recommendation";
import Profile from "./pages/profile/Profile"
import Loading from "./components/Loading";




const App = () => {
  return (
    <Routes>

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path ="/" element={<Home />} />
      <Route path ="/chat" element={<Chatbot />} />
      <Route path ="/recommendation" element={<Recommendation />} />
      <Route path ="/profile" element={<Profile />} />
       <Route path ="/home" element={<Home />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/load" element={<Loading />} />
    </Routes>
  );
};

export default App;

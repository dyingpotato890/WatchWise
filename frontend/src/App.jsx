
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login'
import Home from './components/Home'


const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;

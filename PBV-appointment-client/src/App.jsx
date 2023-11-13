// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home"
import LoginButton from '../components/LoginButton';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<LoginButton/>}/>
        <Route path="/home" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
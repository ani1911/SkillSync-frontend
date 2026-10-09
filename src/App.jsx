import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Matches from "./pages/Matches";
import Connections from "./pages/Connections";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="matches" element={<Matches />} />
          <Route path="chat/:userId" element={<Chat />} />
          <Route path="connections" element={<Connections />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
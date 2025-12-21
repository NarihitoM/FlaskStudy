import { BrowserRouter, Routes, Route } from "react-router-dom"
import Mainpage from "./main/mainpage";
import Signup from "./auth/signup";
import Login from "./auth/login";
import Mainrenderpage from "./pages/mainrenderpage";
import Study from "./pages/study";
import Flashcard from "./pages/flashcard";
import Dashboard from "./pages/dashboard";
import Protectedroute from "./routes/protectedroute";
import Subrenderpage from "./pages/subrenderpage";
import Protectedquiz from "./routes/protectedquiz";
import Category from "./pages/category";
import MCQ from "./pages/MCQ";
import Quiz from "./pages/quiz";
import Summary from "./pages/summary";
import History from "./pages/history";

  {/*Route */}
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protectedroute><Mainrenderpage /></Protectedroute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="study" element={<Study />} />
          <Route path="history" element={<History/>} />
        </Route>
        <Route path="/studydetail/:title" element={<Protectedquiz><Subrenderpage /></Protectedquiz>}>
          <Route index element={<Category />} />
          <Route path="card" element={<Flashcard />} />
          <Route path="mcq" element={<MCQ/>} />
          <Route path="quiz" element={<Quiz/>} />
          <Route path="summary" element={<Summary/>} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App;

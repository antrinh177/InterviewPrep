import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionSearchForm from "./pages/forms/QuestionSearchForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/search" element={<QuestionSearchForm />} />
      </Routes>
    </Router>
  );
}

export default App;

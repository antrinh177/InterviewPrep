import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/results" element={<Results />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
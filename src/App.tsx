import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard/Dashboard";
import { Create } from "./Create/Create";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<Create />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

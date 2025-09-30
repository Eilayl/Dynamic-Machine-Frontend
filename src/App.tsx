import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard/Dashboard";
import { Create } from "./Create/Create";
import { Update } from "./Update/Update";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<Create />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
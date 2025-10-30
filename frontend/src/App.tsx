import { Routes, Route } from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
    </Routes>
  );
}

export default App;
  
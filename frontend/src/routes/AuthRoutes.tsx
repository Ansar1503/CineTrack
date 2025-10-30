import Signup from "@/pages/auth/RegisterUserPage";
import { Route, Routes } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

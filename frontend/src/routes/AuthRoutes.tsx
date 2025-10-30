import Login from "@/pages/auth/LoginUserPage";
import Signup from "@/pages/auth/RegisterUserPage";
import { Route, Routes } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

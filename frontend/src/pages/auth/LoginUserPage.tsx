import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, registerSchema } from "@/validators/auth.schema";
import type {
  LoginForm,
  LoginFormKeys,
  SignupFormKeys,
} from "@/types/AuthTypes";

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<LoginFormKeys, string>>>(
    {}
  );
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updated = { ...form, [id]: value };
    setForm(updated);

    const result = loginSchema.safeParse(updated);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === id);
      setErrors((prev) => ({ ...prev, [id]: err?.message }));
    } else setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const formErrors: Partial<Record<SignupFormKeys, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as SignupFormKeys;
        formErrors[field] = issue.message;
      });
      setErrors(formErrors);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(["email", "password"] as LoginFormKeys[]).map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={field}>{field.toUpperCase()}</Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : "email"}
                  value={form[field]}
                  onChange={handleChange}
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs">{errors[field]}</p>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <Link className="text-primary" to="/signup">
              Signup
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { registerSchema } from "@/validators/auth.schema";
import type { SignupForm, SignupFormKeys } from "@/types/AuthTypes";
import { useAppDispatch } from "@/store/hook";
import { AuthService } from "@/services/AuthServices";
import { setCredentials } from "@/store/AuthSlice";

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<SignupFormKeys, string>>>(
    {}
  );
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedForm = { ...form, [id]: value };

    setForm(updatedForm);

    const result = registerSchema.safeParse(updatedForm);
    if (!result.success) {
      const fieldError = result.error.issues.find((i) => i.path[0] === id);
      setErrors((prev) => ({
        ...prev,
        [id]: fieldError?.message,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const data = await AuthService.register(form);

      dispatch(
        setCredentials({
          user: data.user,
          token: data.accessToken,
        })
      );
    } catch (error) {
      console.log("register failed", error);
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Start tracking movies & shows</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(
              [
                "name",
                "email",
                "password",
                "confirmPassword",
              ] as SignupFormKeys[]
            ).map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={field}>
                  {field === "confirmPassword"
                    ? "Confirm Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  type={field.includes("password") ? "password" : field}
                  placeholder={field}
                  value={form[field]}
                  onChange={handleChange}
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs">{errors[field]}</p>
                )}
              </div>
            ))}

            <Button className="w-full" type="submit">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link className="text-primary" to="/">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

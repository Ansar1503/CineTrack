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
import { toast } from "sonner";
import { Film } from "lucide-react";
import { registerSchema } from "@/validators/auth.schema";
import type { SignupForm, SignupFormKeys } from "@/types/AuthTypes";

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.error(firstError || "Invalid form details");
      return;
    }

    toast.success("Account created successfully!");
    navigate("/home");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedForm = { ...form, [id]: value };

    setForm(updatedForm);

    const result = registerSchema.safeParse(updatedForm);
    if (!result.success) {
      const errorForField = result.error.issues.find(
        (issue) => issue.path[0] === id
      );
      if (errorForField) {
        toast.error(errorForField.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-primary/20 via-background to-accent/20 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Film className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Start tracking your favorite movies & TV shows
          </CardDescription>
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
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field === "confirmPassword"
                    ? "Confirm Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  type={field.includes("password") ? "password" : field}
                  placeholder={
                    field === "email"
                      ? "you@example.com"
                      : field === "name"
                      ? "Your name"
                      : "••••••••"
                  }
                  value={form[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

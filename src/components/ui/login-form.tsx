import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useLogin";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function LoginForm({
    className,
    onLogin,
    ...props
}: React.ComponentPropsWithoutRef<"div"> & {
    onLogin?: () => void;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useLogin(() => {
        if (onLogin) onLogin();
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="text-sm underline underline-offset-4 hover:text-primary"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending
                                    ? "Logging in..."
                                    : "Login"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                type="button"
                            >
                                Login with Google
                            </Button>
                        </div>
                        <p className="mt-4 text-center text-sm">
                            Don't have an account?{" "}
                            <a
                                href="#"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Sign up
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

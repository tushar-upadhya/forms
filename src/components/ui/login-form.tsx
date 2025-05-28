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
    const loginMutation = useLogin(onLogin);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        loginMutation.mutate({ email, password });
    };

    return (
        <div
            className={cn("flex flex-col gap-4 sm:gap-6 md:gap-8", className)}
            {...props}
        >
            <Card className="w-full max-w-full sm:max-w-md lg:max-w-lg mx-auto">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-center">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm md:text-base">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="grid gap-2 sm:gap-3">
                            <Label
                                htmlFor="email"
                                className="text-xs sm:text-sm md:text-base"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="text-xs sm:text-sm md:text-base py-2 sm:py-3"
                            />
                        </div>
                        <div className="grid gap-2 sm:gap-3">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-xs sm:text-sm md:text-base"
                                >
                                    Password
                                </Label>
                                <a
                                    href="#"
                                    className="text-xs sm:text-sm underline underline-offset-4 hover:text-primary"
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
                                className="text-xs sm:text-sm md:text-base py-2 sm:py-3"
                            />
                        </div>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <Button
                                type="submit"
                                className="w-full text-xs sm:text-sm md:text-base py-2 sm:py-3"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending
                                    ? "Logging in..."
                                    : "Login"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-xs sm:text-sm md:text-base py-2 sm:py-3"
                                type="button"
                            >
                                Login with Google
                            </Button>
                        </div>
                        {loginMutation.isError && (
                            <p className="text-red-500 text-xs sm:text-sm text-center">
                                Login failed: {loginMutation.error?.message}
                            </p>
                        )}
                        <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
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

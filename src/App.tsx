import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import FormOne from "./components/form-one/FormOne";
import Header from "./components/header/Header";
import { Button } from "./components/ui/button";
import { LoginForm } from "./components/ui/login-form";
import { ThemeProvider } from "./theme-provider";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!sessionStorage.getItem("accessToken")
    );

    useEffect(() => {
        setIsLoggedIn(!!sessionStorage.getItem("accessToken"));
    }, []);

    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                <Toaster position="top-right" richColors />
                <div className="max-w-[1600px] mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
                    {!isLoggedIn ? (
                        <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6">
                            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                                <LoginForm
                                    onLogin={() => setIsLoggedIn(true)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
                            <main className="w-full flex-1">
                                <Header />
                                <FormOne />
                                <Button
                                    variant="outline"
                                    className="mt-4 w-full sm:w-auto text-xs sm:text-sm md:text-base py-2 sm:py-3"
                                    onClick={() => {
                                        sessionStorage.removeItem(
                                            "accessToken"
                                        );
                                        setIsLoggedIn(false);
                                    }}
                                >
                                    Logout
                                </Button>
                            </main>
                        </div>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;

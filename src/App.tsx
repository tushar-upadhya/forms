import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { FormHeader } from "./components/form-header/FormHeader";
import FormOne from "./components/form-one/FormOne";
import { LoginForm } from "./components/ui/login-form";
import { ThemeProvider } from "./theme-provider";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                <Toaster position="top-right" richColors />
                <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {!isLoggedIn ? (
                        <div className="flex min-h-svh w-full items-center justify-center p-6">
                            <div className="w-full max-w-sm">
                                <LoginForm
                                    onLogin={() => setIsLoggedIn(true)}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row gap-6">
                                <main className="w-full flex-1">
                                    <FormHeader />
                                    <FormOne />
                                </main>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;

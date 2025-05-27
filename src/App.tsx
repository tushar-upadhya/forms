import { useState } from "react";
import { FormHeader } from "./components/form-header/FormHeader";
import FormOne from "./components/form-one/FormOne";
import { LoginForm } from "./components/ui/login-form";
import { ThemeProvider } from "./theme-provider";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                <div className="max-w-[1600px] mx-auto py-8 px-4 md:px-6">
                    {!isLoggedIn ? (
                        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                            <div className="w-full max-w-sm">
                                <LoginForm
                                    onLogin={() => setIsLoggedIn(true)}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <FormHeader />
                            <div className="flex flex-col md:flex-row gap-6 mt-6">
                                <div className="order-2 flex-1 w-full">
                                    <FormOne />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;

import { FormHeader } from "./components/form-header/FormHeader";
import FormTwo from "./components/form-two/FormTwo";
import { ThemeProvider } from "./theme-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl animate-in fade-in duration-500">
                    <FormHeader />
                </div>
                {/* <FormOne /> */}
                <FormTwo />
            </div>
        </ThemeProvider>
    );
}

export default App;

import FormOne from "./components/form-one/FormOne";
import { ThemeProvider } from "./theme-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="light">
            <div className="min-h-screen bg-background">
                <FormOne />
            </div>
        </ThemeProvider>
    );
}

export default App;

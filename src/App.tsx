import FormTwo from "./components/form-two/FormTwo";
import { ThemeProvider } from "./theme-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                {/* <FormOne /> */}
                <FormTwo />
            </div>
        </ThemeProvider>
    );
}

export default App;

import { FormHeader } from "./components/form-header/FormHeader";
import FormTwo from "./components/form-two/FormTwo";
import { BentoGrid } from "./components/ui/bento-grid";
import { ThemeProvider } from "./theme-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <FormHeader />

                    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                        <aside className="order-2 md:order-1">
                            <BentoGrid side="left" className="w-full" />
                        </aside>

                        <main className="order-1 md:order-2 max-w-4xl w-full">
                            {/* <FormOne /> */}
                            <FormTwo />
                        </main>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;

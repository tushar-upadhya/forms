import { FormHeader } from "./components/form-header/FormHeader";
import FormOne from "./components/form-one/FormOne";
import { BentoGrid } from "./components/ui/bento-grid";
import { ThemeProvider } from "./theme-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
                <div className="max-w-[1600px] mx-auto py-8 px-4 md:px-6">
                    <FormHeader />
                    <div className="flex flex-col md:flex-row gap-6 mt-6">
                        {/* <div className="hidden md:block flex-none order-1 w-[300px]">
                            <BentoGrid side="left" />
                        </div> */}

                        <div className="order-2 flex-1 w-full">
                            <FormOne />
                            {/* <FormThree /> */}
                            {/* <FormTwo /> */}
                        </div>

                        <div className="hidden md:block flex-none order-3 w-[300px]">
                            <BentoGrid side="right" />
                        </div>

                        {/* <div className="md:hidden order-4 space-y-6 w-full mt-6">
                            <BentoGrid side="left" className="w-full" />
                            <BentoGrid side="right" className="w-full" />
                        </div> */}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EyeIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

const visionOptions = [
    "6/6",
    "6/9",
    "6/12",
    "6/18",
    "6/24",
    "6/36",
    "6/60",
    "CF 1m",
    "CF 2m",
    "CF 3m",
    "HM",
    "PL+",
    "PL-",
    "NPL",
];

const pressureOptions = [
    "Normal (10-21 mmHg)",
    "Elevated (>21 mmHg)",
    "Low (<10 mmHg)",
    "Not Measurable",
];

interface VisionAssessmentSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
}

export default function VisionAssessmentSection({
    form,
}: VisionAssessmentSectionProps) {
    return (
        <Accordion
            type="single"
            defaultValue="vision-assessment"
            collapsible
            className="border rounded-lg overflow-hidden shadow-sm bg-card"
        >
            <AccordionItem value="vision-assessment" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-primary" />
                        <span className="font-medium">Vision Assessment</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="p-4 pt-2">
                        <Form {...form}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm">
                                            Right Eye
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="ucvaRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>UCVA</FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10 w-full">
                                                                <SelectValue placeholder="Select vision" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {visionOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bcvaRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>BCVA</FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10 w-full">
                                                                <SelectValue placeholder="Select vision" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {visionOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="refractionRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Refraction
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Sph/Cyl x Axis"
                                                            className="h-10 w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="iopRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        IOP right
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10 sm:w-full w-[7.5rem]">
                                                                <SelectValue placeholder="Select IOP range" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {pressureOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm">
                                            Left Eye
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="ucvaLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>UCVA</FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10 w-full">
                                                                <SelectValue placeholder="Select vision" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {visionOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bcvaLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>BCVA</FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10 w-full">
                                                                <SelectValue placeholder="Select vision" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {visionOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="refractionLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Refraction
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Sph/Cyl x Axis"
                                                            className="h-10 w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="iopLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        IOP left
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10 sm:w-full w-[7.5rem]">
                                                                <SelectValue placeholder="Select IOP range" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {pressureOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

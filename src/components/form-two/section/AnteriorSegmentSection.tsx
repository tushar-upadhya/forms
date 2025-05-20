import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Microscope } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";

const chamberOptions = ["Normal", "Shallow", "Deep", "Flat", "Irregular"];

const lensOptions = [
    "Clear",
    "Nuclear Sclerosis",
    "Cortical Cataract",
    "PSC",
    "IOL",
    "Aphakic",
];

const acGradingOptions = ["None", "1+", "2+", "3+", "4+"];

interface AnteriorSegmentSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
}

export default function AnteriorSegmentSection({
    form,
}: AnteriorSegmentSectionProps) {
    return (
        <Accordion
            type="single"
            defaultValue="anterior-segment"
            collapsible
            className="border rounded-lg overflow-hidden bg-card"
        >
            <AccordionItem value="anterior-segment" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-2">
                        <Microscope className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                            Anterior Segment Examination
                        </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-muted-foreground mr-4">
                            Detailed examination of the front of the eye
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="p-4 pt-2">
                        <Form {...form}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm">
                                        Right Eye
                                    </h3>

                                    <FormField
                                        control={form.control}
                                        name="lidAdnexaRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Lid and Adnexa
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe lid and adnexa findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="eyeAlignmentRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Eye Alignment
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe eye alignment"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="corneaRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cornea</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe corneal findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="acCellsRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AC Cells</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select grade" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {acGradingOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="acFlareRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AC Flare</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select grade" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {acGradingOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="acDepthRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AC Depth</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select depth" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {chamberOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="irisRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Iris</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe iris findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lensRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lens</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select lens status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {lensOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="anteriorOtherRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Other Findings
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Additional anterior segment findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
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
                                        name="lidAdnexaLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Lid and Adnexa
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe lid and adnexa findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="eyeAlignmentLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Eye Alignment
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe eye alignment"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="corneaLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cornea</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe corneal findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="acCellsLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AC Cells</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select grade" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {acGradingOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="acFlareLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AC Flare</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select grade" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {acGradingOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="acDepthLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AC Depth</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select depth" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {chamberOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="irisLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Iris</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe iris findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lensLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lens</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select lens status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {lensOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
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
                                        name="anteriorOtherLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Other Findings
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Additional anterior segment findings"
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </Form>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

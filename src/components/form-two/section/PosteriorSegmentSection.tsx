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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

const mediaHazeOptions = [
    "Clear",
    "Mild Haze",
    "Moderate Haze",
    "Severe Haze",
    "Dense",
    "Not Visible",
];

interface PosteriorSegmentSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
}

export default function PosteriorSegmentSection({
    form,
}: PosteriorSegmentSectionProps) {
    return (
        <Accordion
            type="single"
            defaultValue="posterior-segment"
            collapsible
            className="border rounded-lg overflow-hidden bg-card"
        >
            <AccordionItem value="posterior-segment" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                            Posterior Segment Evaluation
                        </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-muted-foreground mr-4">
                            Detailed examination of the back of the eye
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
                                        name="vitreousHazeRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Vitreous Cavity Media Haze
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select haze level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mediaHazeOptions.map(
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
                                        name="retinaDiscRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Retina Disc
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe disc findings"
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
                                        name="maculaRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Macula</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe macular findings"
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
                                        name="midPeripheryRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Mid Periphery
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe mid-peripheral findings"
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
                                        name="peripheryRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Periphery</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe peripheral findings"
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
                                        name="posteriorOtherRight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Other Findings
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Additional posterior segment findings"
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
                                        name="vitreousHazeLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Vitreous Cavity Media Haze
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl className="h-10 sm:w-full w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select haze level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mediaHazeOptions.map(
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
                                        name="retinaDiscLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Retina Disc
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe disc findings"
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
                                        name="maculaLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Macula</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe macular findings"
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
                                        name="midPeripheryLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Mid Periphery
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe mid-peripheral findings"
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
                                        name="peripheryLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Periphery</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe peripheral findings"
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
                                        name="posteriorOtherLeft"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Other Findings
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Additional posterior segment findings"
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

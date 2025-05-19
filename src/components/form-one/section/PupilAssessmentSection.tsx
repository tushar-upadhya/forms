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
import { EyeIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

const pupilOptions = [
    "Round",
    "Irregular",
    "Dilated",
    "Constricted",
    "Sluggish",
    "Non-reactive",
];

interface PupilAssessmentSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
}

export default function PupilAssessmentSection({
    form,
}: PupilAssessmentSectionProps) {
    return (
        <Accordion
            type="single"
            defaultValue="pupil-assessment"
            collapsible
            className="border rounded-lg overflow-hidden bg-card"
        >
            <AccordionItem value="pupil-assessment" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-primary" />
                        <span className="font-medium">Pupil Assessment</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="p-4 pt-2">
                        <Form {...form}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Right Eye
                                        </h4>
                                        <FormField
                                            control={form.control}
                                            name="pupilDirectRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Direct Response
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
                                                                <SelectValue placeholder="Select response" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {pupilOptions.map(
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
                                            name="pupilConsensualRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Consensual Response
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
                                                                <SelectValue placeholder="Select response" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {pupilOptions.map(
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
                                            name="rapdRight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>RAPD</FormLabel>
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
                                                                <SelectValue placeholder="Select RAPD" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Present">
                                                                Present
                                                            </SelectItem>
                                                            <SelectItem value="Absent">
                                                                Absent
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Left Eye
                                        </h4>
                                        <FormField
                                            control={form.control}
                                            name="pupilDirectLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Direct Response
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
                                                                <SelectValue placeholder="Select response" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {pupilOptions.map(
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
                                            name="pupilConsensualLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Consensual Response
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
                                                                <SelectValue placeholder="Select response" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {pupilOptions.map(
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
                                            name="rapdLeft"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>RAPD</FormLabel>
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
                                                                <SelectValue placeholder="Select RAPD" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Present">
                                                                Present
                                                            </SelectItem>
                                                            <SelectItem value="Absent">
                                                                Absent
                                                            </SelectItem>
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

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
import { Textarea } from "@/components/ui/textarea";
import { ClipboardIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

interface ClinicalHistorySectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
}

export default function ClinicalHistorySection({
    form,
}: ClinicalHistorySectionProps) {
    return (
        <Accordion
            type="single"
            defaultValue="clinical-history"
            collapsible
            className="border rounded-lg overflow-hidden shadow-sm bg-card"
        >
            <AccordionItem value="clinical-history" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2">
                        <ClipboardIcon className="h-5 w-5 text-primary" />
                        <span className="font-medium">Clinical History</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="p-4 pt-2">
                        <Form {...form}>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="chiefComplaint"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Chief Complaint
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Main reason for visit"
                                                    className="min-h-[100px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="presentIllnessHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                History of Present Illness
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Details of current condition"
                                                    className="min-h-[100px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pastHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Past History</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Previous medical conditions and treatments"
                                                    className="min-h-[100px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="familyHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Family History
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Relevant family medical history"
                                                    className="min-h-[100px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="otherHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Other Relevant History
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Additional important information"
                                                    className="min-h-[100px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Form>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

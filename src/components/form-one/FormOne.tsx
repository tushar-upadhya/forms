import { Button } from "@/components/ui/button";
import type { FormValues } from "@/lib/type/type";
import { useState } from "react";
import AnteriorSegmentSection from "./section/AnteriorSegmentSection";
import ClinicalHistorySection from "./section/ClinicalHistorySection";
import PatientInfoSection from "./section/PatientInfoSection";
import PosteriorSegmentSection from "./section/PosteriorSegmentSection";
import PupilAssessmentSection from "./section/PupilAssessmentSection";
import VisionAssessmentSection from "./section/VisionAssessmentSection";

import { useForm } from "react-hook-form";

export default function FormOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<FormValues>();

    function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Form submitted:", data);
            setIsSubmitting(false);
            form.reset();
        }, 1500);
    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <PatientInfoSection form={form} />
                <ClinicalHistorySection form={form} />
                <VisionAssessmentSection form={form} />
                <PupilAssessmentSection form={form} />
                <AnteriorSegmentSection form={form} />
                <PosteriorSegmentSection form={form} />

                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

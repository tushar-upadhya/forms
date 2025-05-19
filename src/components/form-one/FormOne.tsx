import { Button } from "@/components/ui/button";
import { PatientInfoSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AnteriorSegmentSection from "./section/AnteriorSegmentSection";
import ClinicalHistorySection from "./section/ClinicalHistorySection";
import PatientInfoSection from "./section/PatientInfoSection";
import PupilAssessmentSection from "./section/PupilAssessmentSection";
import VisionAssessmentSection from "./section/VisionAssessmentSection";

type FormValues = z.infer<typeof PatientInfoSchema>;

export default function FormOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(PatientInfoSchema),
        defaultValues: {
            name: "",
            age: "",
            sex: undefined,
            uhid: "",
            chiefComplaint: "",
            presentIllnessHistory: "",
            pastHistory: "",
            familyHistory: "",
            otherHistory: "",
            // Vision Assessment
            ucvaRight: undefined,
            ucvaLeft: undefined,
            bcvaRight: undefined,
            bcvaLeft: undefined,
            refractionRight: "",
            refractionLeft: "",
            iopRight: undefined,
            iopLeft: undefined,
            // Pupil
            pupilDirectRight: undefined,
            pupilDirectLeft: undefined,
            pupilConsensualRight: undefined,
            pupilConsensualLeft: undefined,
            rapdRight: undefined,
            rapdLeft: undefined,
            // Anterior Segment
            lidAdnexaRight: "",
            lidAdnexaLeft: "",
            eyeAlignmentRight: "",
            eyeAlignmentLeft: "",
            corneaRight: "",
            corneaLeft: "",
            acCellsRight: undefined,
            acCellsLeft: undefined,
            acFlareRight: undefined,
            acFlareLeft: undefined,
            acDepthRight: undefined,
            acDepthLeft: undefined,
            irisRight: "",
            irisLeft: "",
            lensRight: undefined,
            lensLeft: undefined,
            anteriorOtherRight: "",
            anteriorOtherLeft: "",
        },
    });

    function onSubmit(data: FormValues) {
        setIsSubmitting(true);

        // Simulate API submission
        setTimeout(() => {
            console.log("Form submitted:", data);
            setIsSubmitting(false);

            form.reset();
        }, 1500);
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl animate-in fade-in duration-500">
            <header className="mb-8 text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <EyeIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">
                        Patient Ophthalmic Evaluation
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    Comprehensive eye examination and treatment planning form.
                </p>
            </header>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <PatientInfoSection form={form} />
                <ClinicalHistorySection form={form} />
                <VisionAssessmentSection form={form} />
                <AnteriorSegmentSection form={form} />
                <PupilAssessmentSection form={form} />

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

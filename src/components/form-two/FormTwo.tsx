import { PatientInfoSchema } from "@/lib/schemas";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AnteriorSegmentSection from "../form-one/section/AnteriorSegmentSection";
import ClinicalHistorySection from "../form-one/section/ClinicalHistorySection";
import PatientInfoSection from "../form-one/section/PatientInfoSection";
import PosteriorSegmentSection from "../form-one/section/PosteriorSegmentSection";
import PupilAssessmentSection from "../form-one/section/PupilAssessmentSection";
import VisionAssessmentSection from "../form-one/section/VisionAssessmentSection";
import { SubmitButton } from "../submit-button/SubmitButton";
import { BreadcrumbNavigation } from "./breadcrumb-navigation/BreadcrumbNavigation";

type FormValues = z.infer<typeof PatientInfoSchema>;

interface Section {
    id: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<{ form: any }>;
}

const sections: Section[] = [
    { id: "patientInfo", label: "Patient Info", component: PatientInfoSection },
    {
        id: "clinicalHistory",
        label: "Clinical History",
        component: ClinicalHistorySection,
    },
    {
        id: "visionAssessment",
        label: "Vision Assessment",
        component: VisionAssessmentSection,
    },
    {
        id: "pupilAssessment",
        label: "Pupil Assessment",
        component: PupilAssessmentSection,
    },
    {
        id: "anteriorSegment",
        label: "Anterior Segment",
        component: AnteriorSegmentSection,
    },
    {
        id: "posteriorSegment",
        label: "Posterior Segment",
        component: PosteriorSegmentSection,
    },
];

export default function FormTwo() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const form = useForm<FormValues>({ defaultValues: {} });

    const onSubmit = useCallback(
        (data: FormValues) => {
            setIsSubmitting(true);
            setTimeout(() => {
                console.log("Form submitted:", data);
                setIsSubmitting(false);
                form.reset();
            }, 1500);
        },
        [form]
    );

    const handleSectionChange = useCallback((sectionId: string) => {
        setActiveSection(sectionId);
    }, []);

    const activeSectionData =
        sections.find((section) => section.id === activeSection) || null;

    return (
        <div
            className={`container mx-auto py-8 px-4 md:px-6 max-w-4xl animate-in fade-in duration-500`}
        >
            {" "}
            <BreadcrumbNavigation
                sections={sections}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
            <SubmitButton
                activeSection={activeSectionData}
                form={form}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
            />
        </div>
    );
}

import AnteriorSegmentSection from "@/components/form-one/section/AnteriorSegmentSection";
import ClinicalHistorySection from "@/components/form-one/section/ClinicalHistorySection";
import PatientInfoSection from "@/components/form-one/section/PatientInfoSection";
import PosteriorSegmentSection from "@/components/form-one/section/PosteriorSegmentSection";
import PupilAssessmentSection from "@/components/form-one/section/PupilAssessmentSection";
import VisionAssessmentSection from "@/components/form-one/section/VisionAssessmentSection";

interface Section {
    id: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<{ form: any }>;
}

export const sections: Section[] = [
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

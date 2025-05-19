import { z } from "zod";

export const PatientInfoSchema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z
        .string()
        .min(1, "Age is required")
        .regex(/^\d+$/, "Age must be a number"),
    sex: z.string().optional(),
    uhid: z.string().min(1, "UHID is required"),
    chiefComplaint: z.string().min(1, "Chief complaint is required"),
    presentIllnessHistory: z
        .string()
        .min(1, "Present illness history is required"),
    pastHistory: z.string().min(1, "Past history is required"),
    familyHistory: z.string().min(1, "Family history is required"),
    otherHistory: z.string().optional(),
    // Vision Assessment
    ucvaRight: z.string().optional(),
    ucvaLeft: z.string().optional(),
    bcvaRight: z.string().optional(),
    bcvaLeft: z.string().optional(),
    refractionRight: z.string().min(1, "Refraction right is required"),
    refractionLeft: z.string().min(1, "Refraction left is required"),
    iopRight: z.string().optional(),
    iopLeft: z.string().optional(),
    // Pupil
    pupilDirectRight: z.string().optional(),
    pupilDirectLeft: z.string().optional(),
    pupilConsensualRight: z.string().optional(),
    pupilConsensualLeft: z.string().optional(),
    rapdRight: z.string().optional(),
    rapdLeft: z.string().optional(),
    // Anterior Segment
    lidAdnexaRight: z.string().min(1, "Lid adnexa right is required"),
    lidAdnexaLeft: z.string().min(1, "Lid adnexa left is required"),
    eyeAlignmentRight: z.string().min(1, "Eye alignment right is required"),
    eyeAlignmentLeft: z.string().min(1, "Eye alignment left is required"),
    corneaRight: z.string().min(1, "Cornea right is required"),
    corneaLeft: z.string().min(1, "Cornea left is required"),
    acCellsRight: z.string().optional(),
    acCellsLeft: z.string().optional(),
    acFlareRight: z.string().optional(),
    acFlareLeft: z.string().optional(),
    acDepthRight: z.string().optional(),
    acDepthLeft: z.string().optional(),
    irisRight: z.string().min(1, "Iris right is required"),
    irisLeft: z.string().min(1, "Iris left is required"),
    lensRight: z.string().optional(),
    lensLeft: z.string().optional(),
    anteriorOtherRight: z.string().min(1, "Anterior other right is required"),
    anteriorOtherLeft: z.string().min(1, "Anterior other left is required"),
    // Posterior Segment
    vitreousHazeRight: z.string().optional(),
    vitreousHazeLeft: z.string().optional(),
    posteriorOtherRight: z.string().min(1, "Posterior other right is required"),
    posteriorOtherLeft: z.string().min(1, "Posterior other left is required"),
    retinaDiscRight: z.string().min(1, "Retina disc right is required"),
    retinaDiscLeft: z.string().min(1, "Retina disc left is required"),
    maculaRight: z.string().min(1, "Macula right is required"),
    maculaLeft: z.string().min(1, "Macula left is required"),
    midPeripheryRight: z.string().min(1, "Mid periphery right is required"),
    midPeripheryLeft: z.string().min(1, "Mid periphery left is required"),
    peripheryRight: z.string().min(1, "Periphery right is required"),
    peripheryLeft: z.string().min(1, "Periphery left is required"),
});

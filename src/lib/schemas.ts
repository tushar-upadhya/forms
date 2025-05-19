import { z } from "zod";

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
] as const;

const pressureOptions = [
    "Normal (10-21 mmHg)",
    "Elevated (>21 mmHg)",
    "Low (<10 mmHg)",
    "Not Measurable",
] as const;

const pupilOptions = [
    "Round",
    "Irregular",
    "Dilated",
    "Constricted",
    "Sluggish",
    "Non-reactive",
] as const;

const chamberOptions = [
    "Normal",
    "Shallow",
    "Deep",
    "Flat",
    "Irregular",
] as const;

const lensOptions = [
    "Clear",
    "Nuclear Sclerosis",
    "Cortical Cataract",
    "PSC",
    "IOL",
    "Aphakic",
] as const;

export const PatientInfoSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100),
    age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Age must be a positive number",
    }),
    sex: z.enum(["male", "female", "other"], {
        required_error: "Please select a gender",
    }),
    uhid: z.string().optional(),
    chiefComplaint: z.string().optional(),
    presentIllnessHistory: z.string().optional(),
    pastHistory: z.string().optional(),
    familyHistory: z.string().optional(),
    otherHistory: z.string().optional(),

    // Vision Assessment
    ucvaRight: z.enum(visionOptions).optional(),
    ucvaLeft: z.enum(visionOptions).optional(),
    bcvaRight: z.enum(visionOptions).optional(),
    bcvaLeft: z.enum(visionOptions).optional(),
    refractionRight: z.string().optional(),
    refractionLeft: z.string().optional(),
    iopRight: z.enum(pressureOptions).optional(),
    iopLeft: z.enum(pressureOptions).optional(),

    // Pupil Assessment
    pupilDirectRight: z.enum(pupilOptions).optional(),
    pupilDirectLeft: z.enum(pupilOptions).optional(),
    pupilConsensualRight: z.enum(pupilOptions).optional(),
    pupilConsensualLeft: z.enum(pupilOptions).optional(),
    rapdRight: z.enum(["Present", "Absent"]).optional(),
    rapdLeft: z.enum(["Present", "Absent"]).optional(),

    // Anterior Segment
    lidAdnexaRight: z.string().optional(),
    lidAdnexaLeft: z.string().optional(),
    eyeAlignmentRight: z.string().optional(),
    eyeAlignmentLeft: z.string().optional(),
    corneaRight: z.string().optional(),
    corneaLeft: z.string().optional(),
    acCellsRight: z.enum(["None", "1+", "2+", "3+", "4+"]).optional(),
    acCellsLeft: z.enum(["None", "1+", "2+", "3+", "4+"]).optional(),
    acFlareRight: z.enum(["None", "1+", "2+", "3+", "4+"]).optional(),
    acFlareLeft: z.enum(["None", "1+", "2+", "3+", "4+"]).optional(),
    acDepthRight: z.enum(chamberOptions).optional(),
    acDepthLeft: z.enum(chamberOptions).optional(),
    irisRight: z.string().optional(),
    irisLeft: z.string().optional(),
    lensRight: z.enum(lensOptions).optional(),
    lensLeft: z.enum(lensOptions).optional(),
    anteriorOtherRight: z.string().optional(),
    anteriorOtherLeft: z.string().optional(),
});

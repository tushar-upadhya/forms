import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { PatientInfoSchema } from "../schemas";

export type FormValues = z.infer<typeof PatientInfoSchema>;

export function usePatientForm() {
    return useForm<FormValues>({
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
            // Posterior Segment
            vitreousHazeRight: undefined,
            vitreousHazeLeft: undefined,
            posteriorOtherRight: "",
            posteriorOtherLeft: "",
            retinaDiscRight: "",
            retinaDiscLeft: "",
            maculaRight: "",
            maculaLeft: "",
            midPeripheryRight: "",
            midPeripheryLeft: "",
            peripheryRight: "",
            peripheryLeft: "",
        },
    });
}

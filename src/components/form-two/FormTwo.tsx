// import { PatientInfoSchema } from "@/lib/schemas";
// import { sections } from "@/lib/section";
// import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { SubmitButton } from "../submit-button/SubmitButton";
// import { BreadcrumbNavigation } from "./breadcrumb-navigation/BreadcrumbNavigation";

// type FormValues = z.infer<typeof PatientInfoSchema>;

// export default function FormTwo() {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [activeSection, setActiveSection] = useState(sections[0].id);
//     const form = useForm<FormValues>({ defaultValues: {} });

//     const onSubmit = useCallback(
//         (data: FormValues) => {
//             setIsSubmitting(true);
//             setTimeout(() => {
//                 console.log("Form submitted:", data);
//                 setIsSubmitting(false);
//                 form.reset();
//             }, 1500);
//         },
//         [form]
//     );

//     const handleSectionChange = useCallback((sectionId: string) => {
//         setActiveSection(sectionId);
//     }, []);

//     const activeSectionData =
//         sections.find((section) => section.id === activeSection) || null;

//     return (
//         <div
//             className={`container mx-auto py-8 px-4 md:px-6 max-w-4xl animate-in fade-in duration-500`}
//         >
//             <BreadcrumbNavigation
//                 sections={sections}
//                 activeSection={activeSection}
//                 onSectionChange={handleSectionChange}
//             />
//             <SubmitButton
//                 activeSection={activeSectionData}
//                 form={form}
//                 isSubmitting={isSubmitting}
//                 onSubmit={onSubmit}
//             />
//         </div>
//     );
// }

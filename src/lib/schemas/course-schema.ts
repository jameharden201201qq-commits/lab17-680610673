import { z } from "zod";
import type { Course } from "@/lib/types";

export const instructorSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
  email: z
    .string()
    .trim()
    .min(1, "ต้องเป็นอีเมล @cmu.ac.th")
    .email("ต้องเป็นอีเมล @cmu.ac.th")
    .refine((val) => val.endsWith("@cmu.ac.th"), {
      message: "ต้องเป็นอีเมล @cmu.ac.th",
    }),
});

export const createCourseFormSchema = (existingCourses: Course[] = []) =>
  z.object({
    courseId: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
      .refine(
        (id) => !existingCourses.some((c) => c.courseId === id),
        "รหัสวิชานี้มีอยู่แล้ว"
      ),
    courseTitle: z
      .string()
      .trim()
      .min(1, "กรอกชื่อวิชา")
      .max(100, "ชื่อวิชาต้องยาวไม่เกิน 100 ตัวอักษร"),
    program: z.enum(["CPE", "ISNE"], {
      message: "เลือกหลักสูตร",
    }),
    semester: z.enum(["1", "2", "3"], {
      message: "เลือกภาคการศึกษา",
    }),
    description: z
      .string()
      .max(100, "รายละเอียดยาวได้ไม่เกิน 100 ตัวอักษร")
      .optional()
      .or(z.literal("")),
    instructors: z
      .array(instructorSchema)
      .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
      .max(3, "มีผู้สอนได้สูงสุด 3 คน")
      .refine(
        (items) => {
          const emails = items
            .map((i) => i.email.trim().toLowerCase())
            .filter(Boolean);
          return new Set(emails).size === emails.length;
        },
        {
          message: "อีเมลผู้สอนซ้ำกัน",
        }
      ),
    notifyByEmail: z.boolean().default(false),
  });

export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;
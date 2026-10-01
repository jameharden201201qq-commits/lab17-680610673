export interface StudentEmail {
  address: string;
}

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  courses?: string[];
  interests?: string[];
  emails?: StudentEmail[];
}

export interface Instructor {
  name: string;
  email: string;
}

export interface Course {
  courseId: string;
  courseTitle: string;
  instructors: Instructor[];
  program?: "CPE" | "ISNE";
  semester?: "1" | "2" | "3";
  description?: string;
  notifyByEmail?: boolean;
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledAt?: string;
}

export interface User {
  username: string;
  password: string;
  studentId?: string | null;
  role: "STUDENT" | "ADMIN";
  tokens?: string[];
}
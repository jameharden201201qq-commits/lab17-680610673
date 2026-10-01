import { ConfirmDeleteButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  const formatSemester = (sem?: string) => {
    switch (sem) {
      case "1":
        return "ภาคการศึกษาที่ 1";
      case "2":
        return "ภาคการศึกษาที่ 2";
      case "3":
        return "ภาคฤดูร้อน";
      default:
        return sem || "-";
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              {/* รหัสวิชา */}
              <TableCell className="font-medium">{course.courseId}</TableCell>

              {/* ชื่อวิชา */}
              <TableCell>{course.courseTitle}</TableCell>

              {/* หลักสูตร (Badge) */}
              <TableCell>
                {course.program ? (
                  <Badge variant="outline">{course.program}</Badge>
                ) : (
                  "-"
                )}
              </TableCell>

              {/* ภาคการศึกษา */}
              <TableCell>{formatSemester(course.semester)}</TableCell>

              {/* รายละเอียด */}
              <TableCell className="max-w-[200px] text-xs text-muted-foreground break-words">
                {course.description || "-"}
              </TableCell>

              {/* ผู้สอน (ชื่อ + อีเมล) */}
              <TableCell>
                {course.instructors && course.instructors.length > 0 ? (
                  <div className="space-y-1.5">
                    {course.instructors.map((instructor, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="font-medium text-foreground">
                          {instructor.name}
                        </div>
                        <div className="text-muted-foreground">
                          {instructor.email}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    ยังไม่มีผู้สอน
                  </span>
                )}
              </TableCell>

              {/* รับข่าวสารทางอีเมล */}
              <TableCell>
                {course.notifyByEmail ? (
                  <Badge className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black">
                    รับ
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">ไม่รับ</span>
                )}
              </TableCell>

              {/* Action */}
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
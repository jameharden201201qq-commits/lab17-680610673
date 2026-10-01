import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, X, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEnrollmentStore } from "@/lib/enrollment-store";
import {
  createCourseFormSchema,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";

const defaultValues: CourseFormValues = {
  courseId: "",
  courseTitle: "",
  program: undefined as unknown as "CPE" | "ISNE",
  semester: undefined as unknown as "1" | "2" | "3",
  description: "",
  instructors: [{ name: "", email: "" }],
  notifyByEmail: false,
};

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

const form = useForm({
    resolver: zodResolver(createCourseFormSchema(courses)),
    mode: "onBlur",
    defaultValues,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructors",
  });

  const descriptionValue = useWatch({
    control,
    name: "description",
    defaultValue: "",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = (values: CourseFormValues) => {
    addCourse({
      courseId: values.courseId.trim(),
      courseTitle: values.courseTitle.trim(),
      program: values.program,
      semester: values.semester,
      description: values.description?.trim() || "",
      instructors: values.instructors,
      notifyByEmail: values.notifyByEmail,
    });
    reset(defaultValues);
    setOpen(false);
  };

  const descLength = descriptionValue ? descriptionValue.length : 0;
  const isDescOver = descLength > 100;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset(defaultValues);
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusCircle className="mr-2 h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว ใส่เมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100 ตัวอักษร แล้วกดบันทึก
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* รหัสวิชา และ ชื่อวิชา */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="courseId" className={errors.courseId ? "text-destructive" : ""}>
                รหัสวิชา
              </Label>
              <Input
                id="courseId"
                placeholder="261305"
                aria-invalid={!!errors.courseId}
                className={errors.courseId ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("courseId")}
              />
              {errors.courseId && (
                <p className="text-xs text-destructive">{errors.courseId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="courseTitle" className={errors.courseTitle ? "text-destructive" : ""}>
                ชื่อวิชา
              </Label>
              <Input
                id="courseTitle"
                placeholder="Mobile Application Development"
                aria-invalid={!!errors.courseTitle}
                className={errors.courseTitle ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("courseTitle")}
              />
              {errors.courseTitle && (
                <p className="text-xs text-destructive">{errors.courseTitle.message}</p>
              )}
            </div>
          </div>

          {/* หลักสูตร */}
          <div className="space-y-1.5">
            <Label className={errors.program ? "text-destructive" : ""}>หลักสูตร</Label>
            <Controller
              control={control}
              name="program"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    aria-invalid={!!errors.program}
                    className={errors.program ? "border-destructive focus:ring-destructive" : ""}
                  >
                    <SelectValue placeholder="เลือกหลักสูตร" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPE">CPE — วิศวกรรมคอมพิวเตอร์</SelectItem>
                    <SelectItem value="ISNE">ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.program && (
              <p className="text-xs text-destructive">{errors.program.message}</p>
            )}
          </div>

          {/* ภาคการศึกษา */}
          <div className="space-y-2">
            <Label className={errors.semester ? "text-destructive" : ""}>ภาคการศึกษา</Label>
            <Controller
              control={control}
              name="semester"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-wrap gap-4 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="sem-1" />
                    <Label htmlFor="sem-1" className="font-normal cursor-pointer">
                      ภาคการศึกษาที่ 1
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="sem-2" />
                    <Label htmlFor="sem-2" className="font-normal cursor-pointer">
                      ภาคการศึกษาที่ 2
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="sem-3" />
                    <Label htmlFor="sem-3" className="font-normal cursor-pointer">
                      ภาคฤดูร้อน
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.semester && (
              <p className="text-xs text-destructive">{errors.semester.message}</p>
            )}
          </div>

          {/* รายละเอียด */}
          <div className="space-y-1.5">
            <Label htmlFor="description">รายละเอียด (ไม่บังคับ)</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="พัฒนาแอปพลิเคชันบนอุปกรณ์เคลื่อนที่ด้วย React Native"
              aria-invalid={!!errors.description || isDescOver}
              className={
                errors.description || isDescOver
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              {...register("description")}
            />
            <div className="flex justify-between items-center text-xs">
              <span className={isDescOver ? "text-destructive font-medium" : "text-muted-foreground"}>
                {descLength}/100 ตัวอักษร
              </span>
            </div>
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* ผู้สอน (Array Fields) */}
          <div className="space-y-3 pt-1">
            <div>
              <Label className="text-sm font-semibold">ผู้สอน</Label>
              <p className="text-xs text-muted-foreground">
                {fields.length}/3 คน — กรอกชื่อผู้สอน และอีเมล name@cmu.ac.th (ห้ามซ้ำกัน)
              </p>
            </div>

            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-4">{index + 1}.</span>
                    <div className="flex-1">
                      <Input
                        placeholder="กรอกชื่อผู้สอน"
                        aria-invalid={!!errors.instructors?.[index]?.name}
                        className={
                          errors.instructors?.[index]?.name
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                        {...register(`instructors.${index}.name` as const)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="name@cmu.ac.th"
                        aria-invalid={!!errors.instructors?.[index]?.email}
                        className={
                          errors.instructors?.[index]?.email
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                        {...register(`instructors.${index}.email` as const)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {(errors.instructors?.[index]?.name || errors.instructors?.[index]?.email) && (
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <p className="text-xs text-destructive">
                        {errors.instructors?.[index]?.name?.message}
                      </p>
                      <p className="text-xs text-destructive">
                        {errors.instructors?.[index]?.email?.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errors.instructors?.root && (
              <p className="text-xs text-destructive">{errors.instructors.root.message}</p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= 3}
              onClick={() => append({ name: "", email: "" })}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              เพิ่มผู้สอน
            </Button>
          </div>

          {/* รับข่าวสารทางอีเมล */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">รับข่าวสารทางอีเมล</Label>
              <p className="text-xs text-muted-foreground">
                แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
              </p>
            </div>
            <Controller
              control={control}
              name="notifyByEmail"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset(defaultValues)}
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
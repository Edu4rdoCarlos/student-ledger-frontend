"use client";

import type { Course } from "@/lib/types/course";
import { CourseCard } from "./course-card";

interface CoursesGridProps {
  courses: Course[];
  onViewDetails: (course: Course) => void;
  onEdit: (course: Course) => void;
  canEditCourse: (course: Course) => boolean;
  title?: string;
}

export function CoursesGrid({
  courses,
  onViewDetails,
  onEdit,
  canEditCourse,
  title,
}: CoursesGridProps) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            canEdit={canEditCourse(course)}
          />
        ))}
      </div>
    </div>
  );
}

import { CourseForm } from "@/components/ui/course/CourseForm";

export function AdminFormCoursePage({ onNavigate, courseId }) {
	return (
		<CourseForm
			courseId={courseId}
			onNavigate={onNavigate}
			userRole="admin"
			backNavigationTarget="admin-manage-courses"
		/>
	);
}

export default AdminFormCoursePage;

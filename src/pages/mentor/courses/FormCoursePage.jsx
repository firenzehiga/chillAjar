import { CourseForm } from "../../../components/course";

export function MentorFormCoursePage({ onNavigate, courseId, userData }) {
	return (
		<CourseForm
			courseId={courseId}
			onNavigate={onNavigate}
			userRole="mentor"
			userData={userData}
			backNavigationTarget="mentor-manage-courses"
		/>
	);
}

export default MentorFormCoursePage;

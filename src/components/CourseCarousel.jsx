import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function CourseCarousel({ courses, onCourseClick }) {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
	};

	return (
		<div className="mb-12 -mx-4 sm:mx-0">
			<Slider {...settings}>
				{courses.map((course) => (
					<div key={course.id} className="px-4">
						<div
							className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
							onClick={() => onCourseClick(course)}>
							<img
								src={course.image}
								alt={course.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
								<h3 className="text-3xl font-bold text-white mb-2">
									{course.title}
								</h3>
								<p className="text-gray-200 mb-4">{course.description}</p>
								<div className="flex items-center justify-between">
									<span className="text-white bg-blue-800 px-4 py-1 rounded-full text-sm">
										{course.category}
									</span>
									<span className="text-white">
										${course.price_per_hour}/hour
									</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
}

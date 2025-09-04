/**
 * BookLoader - Animated book loading component with customizable size
 *
 * @param {string} message - Loading message text (optional)
 * @param {string} size - Predefined size: "small", "medium", "large" (default: "medium")
 * @param {number} width - Custom width in pixels (overrides size)
 * @param {number} height - Custom height in pixels (overrides size)
 *
 * Examples:
 * <BookLoader message="Loading..." /> // Default medium size
 * <BookLoader size="small" message="Loading courses..." />
 * <BookLoader width={150} height={105} message="Custom size" />
 * <BookLoader size="large" />
 */
export function BookLoader({ message = "", size = "medium", width, height }) {
	// Predefined sizes
	const sizes = {
		small: { width: 120, height: 84 },
		medium: { width: 200, height: 140 },
		large: { width: 280, height: 196 },
	};

	// Use custom dimensions if provided, otherwise use predefined size
	const dimensions = {
		width: width || sizes[size]?.width || sizes.medium.width,
		height: height || sizes[size]?.height || sizes.medium.height,
	};

	// Calculate responsive values based on size
	const scale = dimensions.width / 200; // Base scale from medium size
	const svgWidth = Math.round(90 * scale);
	const svgHeight = Math.round(120 * scale);
	const bookPadding = Math.round(10 * scale);

	return (
		<div
			className="relative flex flex-col items-center"
			style={{
				"--background": "linear-gradient(135deg, #fff59d, #ffb300)", // gradasi kuning
				"--shadow": "rgba(255, 152, 0, 0.28)",
				"--text": "#6b4f00",
				"--page": "rgba(255, 255, 255, 0.36)",
				"--page-fold": "rgba(255, 255, 255, 0.52)",
				"--duration": "3s",
			}}>
			{/* Book Animation Container */}
			<div
				className="relative"
				style={{
					width: `${dimensions.width}px`,
					height: `${dimensions.height}px`,
				}}>
				{/* Shadow elements */}
				<div
					className="absolute bottom-2 left-1 transform -rotate-6"
					style={{
						width: `${dimensions.width * 0.6}px`,
						height: `${dimensions.height * 0.2}px`,
						boxShadow: "0 16px 12px var(--shadow)",
						top: "80%",
					}}
				/>
				<div
					className="absolute bottom-2 right-1 transform rotate-6"
					style={{
						width: `${dimensions.width * 0.6}px`,
						height: `${dimensions.height * 0.2}px`,
						boxShadow: "0 16px 12px var(--shadow)",
						top: "80%",
					}}
				/>
				{/* Main book container */}
				<div
					className="w-full h-full rounded-xl relative z-10 shadow-lg"
					style={{
						perspective: "600px",
						backgroundImage: "var(--background)",
						boxShadow: "0 4px 6px var(--shadow)",
					}}>
					<ul className="m-0 p-0 list-none relative">
						{/* Page 1 */}
						<li
							className="absolute block"
							style={{
								top: `${bookPadding}px`,
								left: `${bookPadding}px`,
								transformOrigin: "100% 50%",
								color: "var(--page)",
								opacity: 1,
								transform: "rotateY(0deg)",
							}}>
							<svg
								className="block"
								style={{
									width: `${svgWidth}px`,
									height: `${svgHeight}px`,
								}}
								fill="currentColor"
								viewBox="0 0 90 120">
								<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
							</svg>
						</li>

						{/* Page 2 */}
						<li
							className="absolute block animate-page-2"
							style={{
								top: `${bookPadding}px`,
								left: `${bookPadding}px`,
								transformOrigin: "100% 50%",
								color: "var(--page-fold)",
								opacity: 0,
								transform: "rotateY(180deg)",
								animation: "page-2 var(--duration) ease infinite",
							}}>
							<svg
								className="block"
								style={{
									width: `${svgWidth}px`,
									height: `${svgHeight}px`,
								}}
								fill="currentColor"
								viewBox="0 0 90 120">
								<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
							</svg>
						</li>

						{/* Page 3 */}
						<li
							className="absolute block"
							style={{
								top: `${bookPadding}px`,
								left: `${bookPadding}px`,
								transformOrigin: "100% 50%",
								color: "var(--page-fold)",
								opacity: 0,
								transform: "rotateY(180deg)",
								animation: "page-3 var(--duration) ease infinite",
							}}>
							<svg
								className="block"
								style={{
									width: `${svgWidth}px`,
									height: `${svgHeight}px`,
								}}
								fill="currentColor"
								viewBox="0 0 90 120">
								<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
							</svg>
						</li>

						{/* Page 4 */}
						<li
							className="absolute block"
							style={{
								top: `${bookPadding}px`,
								left: `${bookPadding}px`,
								transformOrigin: "100% 50%",
								color: "var(--page-fold)",
								opacity: 0,
								transform: "rotateY(180deg)",
								animation: "page-4 var(--duration) ease infinite",
							}}>
							<svg
								className="block"
								style={{
									width: `${svgWidth}px`,
									height: `${svgHeight}px`,
								}}
								fill="currentColor"
								viewBox="0 0 90 120">
								<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
							</svg>
						</li>

						{/* Page 5 */}
						<li
							className="absolute block"
							style={{
								top: `${bookPadding}px`,
								left: `${bookPadding}px`,
								transformOrigin: "100% 50%",
								color: "var(--page-fold)",
								opacity: 0,
								transform: "rotateY(180deg)",
								animation: "page-5 var(--duration) ease infinite",
							}}>
							<svg
								className="block"
								style={{
									width: `${svgWidth}px`,
									height: `${svgHeight}px`,
								}}
								fill="currentColor"
								viewBox="0 0 90 120">
								<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
							</svg>
						</li>

						{/* Page 6 (Last page) */}
						<li
							className="absolute block"
							style={{
								top: `${bookPadding}px`,
								left: `${bookPadding}px`,
								transformOrigin: "100% 50%",
								color: "var(--page)",
								opacity: 1,
								transform: "rotateY(180deg)",
							}}>
							<svg
								className="block"
								style={{
									width: `${svgWidth}px`,
									height: `${svgHeight}px`,
								}}
								fill="currentColor"
								viewBox="0 0 90 120">
								<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
							</svg>
						</li>
					</ul>
				</div>
			</div>
			{/* End Book Animation Container */}

			{/* Loading text */}
			{message && (
				<div
					className="text-center"
					style={{
						marginTop: `${Math.round(20 * scale)}px`,
						maxWidth: `${dimensions.width + 60}px`, // Sedikit lebih lebar dari book
					}}>
					<p
						className="animate-pulse font-semibold leading-relaxed break-words"
						style={{
							color: "var(--text)",
							fontSize: `${Math.max(12, Math.round(18 * scale))}px`,
						}}>
						{message}
					</p>
					<div className="flex justify-center gap-1 items-center mt-2">
						<span
							className="bg-yellow-500 rounded-full animate-bounce"
							style={{
								width: `${Math.round(8 * scale)}px`,
								height: `${Math.round(8 * scale)}px`,
								animationDelay: "-0.3s",
							}}></span>
						<span
							className="bg-yellow-500 rounded-full animate-bounce"
							style={{
								width: `${Math.round(8 * scale)}px`,
								height: `${Math.round(8 * scale)}px`,
								animationDelay: "-0.15s",
							}}></span>
						<span
							className="bg-yellow-500 rounded-full animate-bounce"
							style={{
								width: `${Math.round(8 * scale)}px`,
								height: `${Math.round(8 * scale)}px`,
							}}></span>
					</div>
				</div>
			)}
			{/* Custom keyframes styles */}
			<style jsx>{`
				@keyframes page-2 {
					0% {
						transform: rotateY(180deg);
						opacity: 0;
					}
					20% {
						opacity: 1;
					}
					35%,
					100% {
						opacity: 0;
					}
					50%,
					100% {
						transform: rotateY(0deg);
					}
				}

				@keyframes page-3 {
					15% {
						transform: rotateY(180deg);
						opacity: 0;
					}
					35% {
						opacity: 1;
					}
					50%,
					100% {
						opacity: 0;
					}
					65%,
					100% {
						transform: rotateY(0deg);
					}
				}

				@keyframes page-4 {
					30% {
						transform: rotateY(180deg);
						opacity: 0;
					}
					50% {
						opacity: 1;
					}
					65%,
					100% {
						opacity: 0;
					}
					80%,
					100% {
						transform: rotateY(0deg);
					}
				}

				@keyframes page-5 {
					45% {
						transform: rotateY(180deg);
						opacity: 0;
					}
					65% {
						opacity: 1;
					}
					80%,
					100% {
						opacity: 0;
					}
					95%,
					100% {
						transform: rotateY(0deg);
					}
				}
			`}</style>
		</div>
	);
}

export default BookLoader;

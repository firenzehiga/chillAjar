export function BookLoader({ message = "Loading" }) {
	return (
		<div
			className="relative w-[200px] h-[140px]"
			style={{
				"--background": "linear-gradient(135deg, #fff59d, #ffb300)", // gradasi kuning
				"--shadow": "rgba(255, 152, 0, 0.28)",
				"--text": "#6b4f00",
				"--page": "rgba(255, 255, 255, 0.36)",
				"--page-fold": "rgba(255, 255, 255, 0.52)",
				"--duration": "3s",
			}}>
			{/* Shadow elements */}
			<div
				className="absolute bottom-2 left-1 w-[120px] h-[20%] transform -rotate-6"
				style={{
					boxShadow: "0 16px 12px var(--shadow)",
					top: "80%",
				}}
			/>
			<div
				className="absolute bottom-2 right-1 w-[120px] h-[20%] transform rotate-6"
				style={{
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
						className="absolute top-2.5 left-2.5 block"
						style={{
							transformOrigin: "100% 50%",
							color: "var(--page)",
							opacity: 1,
							transform: "rotateY(0deg)",
						}}>
						<svg
							className="w-[90px] h-[120px] block"
							fill="currentColor"
							viewBox="0 0 90 120">
							<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
						</svg>
					</li>

					{/* Page 2 */}
					<li
						className="absolute top-2.5 left-2.5 block animate-page-2"
						style={{
							transformOrigin: "100% 50%",
							color: "var(--page-fold)",
							opacity: 0,
							transform: "rotateY(180deg)",
							animation: "page-2 var(--duration) ease infinite",
						}}>
						<svg
							className="w-[90px] h-[120px] block"
							fill="currentColor"
							viewBox="0 0 90 120">
							<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
						</svg>
					</li>

					{/* Page 3 */}
					<li
						className="absolute top-2.5 left-2.5 block"
						style={{
							transformOrigin: "100% 50%",
							color: "var(--page-fold)",
							opacity: 0,
							transform: "rotateY(180deg)",
							animation: "page-3 var(--duration) ease infinite",
						}}>
						<svg
							className="w-[90px] h-[120px] block"
							fill="currentColor"
							viewBox="0 0 90 120">
							<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
						</svg>
					</li>

					{/* Page 4 */}
					<li
						className="absolute top-2.5 left-2.5 block"
						style={{
							transformOrigin: "100% 50%",
							color: "var(--page-fold)",
							opacity: 0,
							transform: "rotateY(180deg)",
							animation: "page-4 var(--duration) ease infinite",
						}}>
						<svg
							className="w-[90px] h-[120px] block"
							fill="currentColor"
							viewBox="0 0 90 120">
							<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
						</svg>
					</li>

					{/* Page 5 */}
					<li
						className="absolute top-2.5 left-2.5 block"
						style={{
							transformOrigin: "100% 50%",
							color: "var(--page-fold)",
							opacity: 0,
							transform: "rotateY(180deg)",
							animation: "page-5 var(--duration) ease infinite",
						}}>
						<svg
							className="w-[90px] h-[120px] block"
							fill="currentColor"
							viewBox="0 0 90 120">
							<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
						</svg>
					</li>

					{/* Page 6 (Last page) */}
					<li
						className="absolute top-2.5 left-2.5 block"
						style={{
							transformOrigin: "100% 50%",
							color: "var(--page)",
							opacity: 1,
							transform: "rotateY(180deg)",
						}}>
						<svg
							className="w-[90px] h-[120px] block"
							fill="currentColor"
							viewBox="0 0 90 120">
							<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
						</svg>
					</li>
				</ul>
			</div>
			{/* Loading text */}
			<div className="mt-5 flex items-center justify-center gap-2 flex-nowrap">
				<span
					className="text-center animate-pulse min-w-0 truncate font-semibold text-lg"
					style={{
						color: "var(--text)",
					}}>
					{message}
				</span>
				<div className="flex gap-2 items-center mt-1">
					<span
						className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
						style={{ animationDelay: "-0.3s" }}></span>
					<span
						className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
						style={{ animationDelay: "-0.15s" }}></span>
					<span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
				</div>
			</div>
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

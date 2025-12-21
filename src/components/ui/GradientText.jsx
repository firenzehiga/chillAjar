export default function GradientText({
	children,
	className = "",
	colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
	animationSpeed = 8,
	showBorder = false,
}) {
	const gradientStyle = {
		backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
		backgroundSize: "300% 100%",
		animation: `gradient ${animationSpeed}s linear infinite`,
	};

	return (
		<>
			<style>{`
				@keyframes gradient {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
			`}</style>

			<span
				className={`relative inline-flex align-baseline ${className}`}
				style={{ lineHeight: "1.25" }}>
				{showBorder && (
					<span
						className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
						style={gradientStyle}
					/>
				)}

				<span
					className="relative inline-block text-transparent"
					style={{
						...gradientStyle,
						backgroundClip: "text",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}>
					{children}
				</span>
			</span>
		</>
	);
}

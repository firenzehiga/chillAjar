import React from "react";

export function HelpButton({ onClick, ...props }) {
	return (
		<button
			type="button"
			aria-label="Bantuan"
			onClick={onClick}
			className={`
        group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-0 bg-gradient-to-br from-yellow-300 to-yellow-500
        flex items-center justify-center cursor-pointer
        shadow-lg transition-all duration-200
        active:scale-95 focus:outline-none
        hover:scale-110 hover:shadow-2xl
      `}
			{...props}>
			<span
				className={`
          text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]
          transition-all duration-200 select-none
          group-hover:rotate-12 group-active:scale-90
        `}
				style={{ fontFamily: "Arial Black, Arial, sans-serif" }}>
				?
			</span>
			{/* Ring effect on hover */}
			<span className="absolute inset-0 rounded-full ring-2 ring-yellow-200 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none"></span>
		</button>
	);
}

import React from "react";
import {
	GraduationCap,
	Mail,
	Phone,
	MapPin,
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
} from "lucide-react";

export function Footer({ onNavigate, className = "", onShowGuideModal }) {
	return (
		<footer className={`bg-gray-900 text-gray-300 ${className}`}>
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<div className="flex items-center">
							<GraduationCap className="h-8 w-8 text-yellow-500" />
							<h2 className="ml-2 text-xl font-bold text-white">ChillAjar</h2>
						</div>
						<p className="text-sm">
							Empowering students through personalized peer-to-peer learning
							experiences.
						</p>
						<div className="flex space-x-4">
							{/* <a className="text-gray-400 hover:text-white transition-colors duration-300">
								<Facebook className="h-5 w-5" />
							</a>
							<a className="text-gray-400 hover:text-white transition-colors duration-300">
								<Twitter className="h-5 w-5" />
							</a> */}
							<a
								className="text-gray-400 hover:text-white transition-colors duration-300"
								target="_blank"
								rel="noopener noreferrer"
								href="https://www.instagram.com/chill_ajar/">
								<Instagram className="h-5 w-5" />
							</a>
							<a
								className="text-gray-400 hover:text-white transition-colors duration-300"
								target="_blank"
								rel="noopener noreferrer"
								href="https://www.linkedin.com/company/chill-ajar/">
								<Linkedin className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold text-white mb-4">
							Link Cepat
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									onClick={() => onNavigate("courses")}
									className="text-gray-400 hover:text-white transition-colors focus:outline-none duration-300">
									Kursus
								</a>
							</li>
							<li>
								<a
									onClick={() => onNavigate("mentors")}
									className="text-gray-400 hover:text-white transition-colors focus:outline-none duration-300">
									Cari Mentor
								</a>
							</li>
							<li>
								<a
									onClick={() => onNavigate("about")}
									className="text-gray-400 hover:text-white transition-colors focus:outline-none duration-300">
									Tentang Kami
								</a>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="text-lg font-semibold text-white mb-4">Bantuan</h3>
						<ul className="space-y-2">
							<li>
								<button
									className="text-gray-400 hover:text-white transition-colors focus:outline-none duration-300"
									onClick={onShowGuideModal}
									type="button">
									Pusat Bantuan
								</button>
							</li>
							{/* <li>
									<a className="text-gray-400 hover:text-white transition-colors focus:outline-none duration-300">
										Terms of Service
									</a>
								</li>
								<li>
									<a className="text-gray-400 hover:text-white transition-colors focus:outline-none duration-300">
										Privacy Policy
									</a>
								</li> */}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-lg font-semibold text-white mb-4">
							Hubungi Kami
						</h3>
						<ul className="space-y-2">
							<li className="flex items-center">
								<Mail className="h-5 w-5 mr-2 text-yellow-500" />
								<span>chillajar2025@gmail.com</span>
							</li>
							<a
								href="https://wa.me/6283871417229"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none duration-300">
								<li className="flex items-center">
									<Phone className="h-5 w-5 mr-2 text-yellow-500" />
									<span>+62-838-7141-7229</span>
								</li>
							</a>
							<li className="flex items-center">
								<MapPin className="h-5 w-5 mr-2 text-yellow-500" />
								<span>STT Terpadu Nurulfikri, Depok</span>
							</li>
							{/* <li className="items-center">
								<span>Kampus A: Jl. Situ Indah no.116, Cimanggis, Depok</span>
							</li>
							<li className="items-center">
								<span>Kampus B: Jl. Raya Lenteng Agung No.20, Jagakarsa</span>
							</li> */}
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-5 pt-5 -mb-6 text-center text-sm">
					<p>
						&copy; {new Date().getFullYear()} ChillAjar. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
	X,
	Shield,
	FileText,
	Eye,
	Lock,
	Users,
	AlertCircle,
} from "lucide-react";

// Import markdown files
import privacyPolicyMd from "../assets/policies/privacy-policy.md?raw";
import termsConditionsMd from "../assets/policies/terms-conditions.md?raw";

export function PrivacyPolicyModal({ isOpen, onClose }) {
	const [activeTab, setActiveTab] = useState("privacy");

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
				{/* Header */}
				<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white relative overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-0 left-0 w-full h-full">
							<Lock className="absolute top-4 right-20 w-8 h-8 opacity-20" />
							<Shield className="absolute bottom-4 right-32 w-6 h-6 opacity-30" />
							<Users className="absolute top-8 right-8 w-5 h-5 opacity-25" />
						</div>
					</div>

					<div className="flex justify-between items-center relative">
						<div className="flex items-center gap-3">
							<div className="bg-white bg-opacity-20 p-3 rounded-full">
								<Shield className="w-8 h-8" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">
									{activeTab === "privacy"
										? "Kebijakan Privasi"
										: "Syarat & Ketentuan"}
								</h2>
								<p className="text-yellow-100 text-sm font-medium">
									ChillAjar - Platform Pembelajaran
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="p-2 focus:outline-none hover:bg-white/20 rounded-full transition-colors group">
							<X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
						</button>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="border-b border-gray-200 bg-gray-50">
					<div className="flex">
						<button
							onClick={() => setActiveTab("privacy")}
							className={`px-8 focus:outline-none py-4 font-medium transition-all duration-200 relative overflow-hidden group ${
								activeTab === "privacy"
									? "text-yellow-600 bg-white border-b-3 border-yellow-500 shadow-sm"
									: "text-gray-600 hover:text-yellow-600 hover:bg-white/50"
							}`}>
							<div className="flex items-center gap-3 relative z-10">
								<Eye
									className={`w-5 h-5 transition-transform duration-200 ${
										activeTab === "privacy"
											? "scale-110"
											: "group-hover:scale-105"
									}`}
								/>
								<span className="font-semibold">Kebijakan Privasi</span>
							</div>
							{activeTab === "privacy" && (
								<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
							)}
						</button>
						<button
							onClick={() => setActiveTab("terms")}
							className={`px-8 focus:outline-none py-4 font-medium transition-all duration-200 relative overflow-hidden group ${
								activeTab === "terms"
									? "text-yellow-600 bg-white border-b-3 border-yellow-500 shadow-sm"
									: "text-gray-600 hover:text-yellow-600 hover:bg-white/50"
							}`}>
							<div className="flex items-center gap-3 relative z-10">
								<FileText
									className={`w-5 h-5 transition-transform duration-200 ${
										activeTab === "terms"
											? "scale-110"
											: "group-hover:scale-105"
									}`}
								/>
								<span className="font-semibold">Syarat & Ketentuan</span>
							</div>
							{activeTab === "terms" && (
								<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
							)}
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-8 overflow-y-auto max-h-[60vh] bg-gradient-to-b from-white to-gray-50">
					<div className="markdown-content bg-white p-6 rounded-xl shadow-sm border border-gray-100">
						<ReactMarkdown
							components={{
								h1: ({ node, ...props }) => (
									<h1
										className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-yellow-500 flex items-center gap-3"
										{...props}
									/>
								),
								h2: ({ node, ...props }) => (
									<h2
										className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500"
										{...props}
									/>
								),
								h3: ({ node, ...props }) => (
									<h3
										className="text-xl font-medium text-gray-700 mt-6 mb-3 bg-gray-50 p-2 rounded-md"
										{...props}
									/>
								),
								p: ({ node, ...props }) => (
									<p
										className="text-gray-600 mb-4 leading-relaxed text-base"
										{...props}
									/>
								),
								ul: ({ node, ...props }) => (
									<ul
										className="ml-6 mb-6 space-y-3 bg-gray-50 p-4 rounded-lg"
										{...props}
									/>
								),
								li: ({ node, ...props }) => (
									<li className="text-gray-600 relative flex items-start">
										<span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></span>
										<span className="flex-1" {...props} />
									</li>
								),
								strong: ({ node, ...props }) => (
									<strong
										className="font-semibold text-gray-800 bg-yellow-100 px-1 rounded"
										{...props}
									/>
								),
								ol: ({ node, ...props }) => (
									<ol
										className="ml-6 mb-6 space-y-3 list-decimal bg-gray-50 p-4 rounded-lg"
										{...props}
									/>
								),
							}}>
							{activeTab === "privacy" ? privacyPolicyMd : termsConditionsMd}
						</ReactMarkdown>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3 text-sm text-gray-600">
							<div className="bg-yellow-100 p-2 rounded-full">
								<AlertCircle className="w-4 h-4 text-yellow-600" />
							</div>
							<div>
								<p className="font-medium text-gray-700">Terakhir diperbarui</p>
								<p className="text-xs text-gray-500">September 2025</p>
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={onClose}
								className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium">
								Batal
							</button>
							<button
								onClick={onClose}
								className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
								Saya Mengerti
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

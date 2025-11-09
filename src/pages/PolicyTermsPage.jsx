import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Shield, FileText, Eye, AlertCircle, ArrowLeft } from "lucide-react";

import privacyPolicyMd from "@/assets/policies/privacy-policy.md?raw";
import termsConditionsMd from "@/assets/policies/terms-conditions.md?raw";

export function PrivacyPolicyPage({ onNavigate }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-none">
				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => onNavigate("home")}
								className="p-2 hover:bg-white/20 rounded-full transition-colors">
								<ArrowLeft className="w-6 h-6" />
							</button>
							<div className="flex items-center gap-3">
								<div className="bg-white bg-opacity-20 p-3 rounded-full">
									<Shield className="w-8 h-8" />
								</div>
								<div>
									<h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
									<p className="text-blue-100 text-base font-medium">
										ChillAjar - Platform Pembelajaran
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8">
						<div className="markdown-content">
							<ReactMarkdown
								components={{
									h1: ({ node, ...props }) => (
										<h1
											className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500 flex items-center gap-3"
											{...props}
										/>
									),
									h2: ({ node, ...props }) => (
										<h2
											className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500"
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
											<span className="w-2 h-2 bg-chill-blue rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></span>
											<span className="flex-1" {...props} />
										</li>
									),
									strong: ({ node, ...props }) => (
										<strong
											className="font-semibold text-gray-800 bg-blue-100 px-1 rounded"
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
								{privacyPolicyMd}
							</ReactMarkdown>
						</div>
					</div>

					{/* Footer */}
					<div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="bg-blue-100 p-2 rounded-full">
									<AlertCircle className="w-4 h-4 text-blue-600" />
								</div>
								<div>
									<p className="font-medium text-gray-700">
										Terakhir diperbarui
									</p>
									<p className="text-xs text-gray-500">Oktober 2025</p>
								</div>
							</div>
							<div className="flex gap-3">
								<div className="flex gap-3">
									<button
										onClick={() => onNavigate("home")}
										className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
										Kembali ke Beranda
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function TermsConditionsPage({ onNavigate }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => onNavigate("home")}
								className="p-2 hover:bg-white/20 rounded-full transition-colors">
								<ArrowLeft className="w-6 h-6" />
							</button>
							<div className="flex items-center gap-3">
								<div className="bg-white bg-opacity-20 p-3 rounded-full">
									<FileText className="w-8 h-8" />
								</div>
								<div>
									<h1 className="text-3xl font-bold">Syarat & Ketentuan</h1>
									<p className="text-blue-100 text-base font-medium">
										ChillAjar - Platform Pembelajaran
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8">
						<div className="markdown-content">
							<ReactMarkdown
								components={{
									h1: ({ node, ...props }) => (
										<h1
											className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500 flex items-center gap-3"
											{...props}
										/>
									),
									h2: ({ node, ...props }) => (
										<h2
											className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500"
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
											<span className="w-2 h-2 bg-chill-blue rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></span>
											<span className="flex-1" {...props} />
										</li>
									),
									strong: ({ node, ...props }) => (
										<strong
											className="font-semibold text-gray-800 bg-blue-100 px-1 rounded"
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
								{termsConditionsMd}
							</ReactMarkdown>
						</div>
					</div>

					{/* Footer */}
					<div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="bg-blue-100 p-2 rounded-full">
									<AlertCircle className="w-4 h-4 text-blue-600" />
								</div>
								<div>
									<p className="font-medium text-gray-700">
										Terakhir diperbarui
									</p>
									<p className="text-xs text-gray-500">Oktober 2025</p>
								</div>
							</div>
							<div className="flex gap-3">
								<button
									onClick={() => {
										if (onNavigate) {
											onNavigate("home");
										} else {
											window.history.back();
										}
									}}
									className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
									{onNavigate ? "Ke Beranda" : "Kembali"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function PolicyTermsPage({ onNavigate }) {
	const [activeTab, setActiveTab] = useState("privacy");

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{onNavigate && (
								<button
									onClick={() => onNavigate("home")}
									className="p-2 hover:bg-white/20 rounded-full transition-colors">
									<ArrowLeft className="w-6 h-6" />
								</button>
							)}
							<div className="flex items-center gap-3">
								<div className="bg-white bg-opacity-20 p-3 rounded-full">
									<Shield className="w-8 h-8" />
								</div>
								<div>
									<h1 className="text-3xl font-bold">
										{activeTab === "privacy"
											? "Kebijakan Privasi"
											: "Syarat & Ketentuan"}
									</h1>
									<p className="text-blue-100 text-base font-medium">
										ChillAjar - Platform Pembelajaran
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Tab Navigation */}
				<div className="border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
					<div className="flex">
						<button
							onClick={() => setActiveTab("privacy")}
							className={`px-8 py-5 focus:outline-none font-medium transition-all duration-200 relative overflow-hidden group ${
								activeTab === "privacy"
									? "text-blue-600 border-b-3 border-blue-500 bg-white shadow-sm"
									: "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
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
								<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
							)}
						</button>
						<button
							onClick={() => setActiveTab("terms")}
							className={`px-8 py-5 focus:outline-none font-medium transition-all duration-200 relative overflow-hidden group ${
								activeTab === "terms"
									? "text-blue-600 border-b-3 border-blue-500 bg-white shadow-sm"
									: "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
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
								<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
							)}
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8">
						<div className="markdown-content">
							<ReactMarkdown
								components={{
									h1: ({ node, ...props }) => (
										<h1
											className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500 flex items-center gap-3"
											{...props}
										/>
									),
									h2: ({ node, ...props }) => (
										<h2
											className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500"
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
											<span className="w-2 h-2 bg-chill-blue rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></span>
											<span className="flex-1" {...props} />
										</li>
									),
									strong: ({ node, ...props }) => (
										<strong
											className="font-semibold text-gray-800 bg-blue-100 px-1 rounded"
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
								<div className="bg-blue-100 p-2 rounded-full">
									<AlertCircle className="w-4 h-4 text-blue-600" />
								</div>
								<div>
									<p className="font-medium text-gray-700">
										Terakhir diperbarui
									</p>
									<p className="text-xs text-gray-500">September 2025</p>
								</div>
							</div>
							<div className="flex gap-3">
								<button
									onClick={() => onNavigate("home")}
									className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
									Kembali ke Beranda
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

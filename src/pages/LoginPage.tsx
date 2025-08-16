import { ThemeToggle } from "@/components/ThemeToggle";
import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
// Removed ScreenScale to avoid transform-based scaling which causes subpixel blur and misalignment

const LoginPage = () => {
	return (
		<div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
			{/* Dark mode toggle */}
			<div className="absolute top-6 right-6 z-50">
				<ThemeToggle />
			</div>

			{/* Content wrapper */}
			<div className="h-full w-full flex items-start justify-center pt-16 pb-12">
				<div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
					{/* 40/60 split container */}
					<div className="grid grid-cols-1 md:grid-cols-[520px_minmax(0,1fr)] gap-10 md:gap-16 items-start">
							{/* Left: Auth 40% */}
							<div className="w-full md:w-auto h-full flex items-stretch justify-center">
								<div className="w-full max-w-[520px] h-full px-0 md:px-2 pt-1 pb-2 flex flex-col">
									{/* Brand inside left column for perfect left alignment */}
									<div className="select-none mb-6">
										<h1 className="text-[32px] md:text-[36px] leading-none font-extrabold tracking-tight typography-heading">
											<span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">Exight</span>
										</h1>
										<p className="mt-1 text-xs md:text-sm text-muted-foreground typography-body">Insights for your expenses.</p>
									</div>

									{/* Auth card container with depth */}
									<div className="rounded-2xl bg-white/90 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/70 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] p-6 md:p-8">
										<div className="w-full space-y-5">
											<AuthForm />
											<div className="flex items-center gap-3">
												<div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
												<span className="text-[11px] text-gray-500 typography-small tracking-wide">OR</span>
												<div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
											</div>
											<GoogleAuthButton />
											<p className="pt-2 text-[11px] text-gray-500 typography-small text-center leading-tight">
												By signing in, you agree to our <button className="text-emerald-600 hover:text-emerald-700 underline">Terms of Service</button> and <button className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</button>
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Right: Promo 60% */}
							<div className="w-full h-full flex items-start justify-center px-0 md:px-4">
								<div className="w-full max-w-[760px] h-full flex flex-col">
									<div className="mb-4 text-center">
										<h2 className="text-3xl md:text-4xl typography-heading text-foreground">
											Take control of your <span className="gradient-text">financial future</span>
										</h2>
										<p className="mt-3 text-sm md:text-base text-muted-foreground typography-body max-w-2xl mx-auto">
											Join thousands of users who trust Exight to manage their expenses, track EMIs, and gain valuable financial insights.
										</p>
									</div>
									<div className="flex-1">
										<PromotionalFeatures className="h-full" />
									</div>
								</div>
							</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

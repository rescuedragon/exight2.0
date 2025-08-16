import { ThemeToggle } from "@/components/ThemeToggle";
import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
// Removed ScreenScale to avoid transform-based scaling which causes subpixel blur and misalignment

const LoginPage = () => {
	return (
		<div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
			{/* Fixed header bar with logo and theme toggle */}
			<div className="absolute top-0 left-0 right-0 h-32 flex items-center justify-between px-12 z-50">
				{/* Brand at top-left - Much bigger */}
				<div className="select-none pt-4">
					<h1 className="text-[48px] leading-none font-extrabold tracking-tight typography-heading">
						<span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">Exight</span>
					</h1>
					<p className="mt-1 text-base text-muted-foreground typography-body">Insights for your expenses.</p>
				</div>

				{/* Dark mode toggle */}
				<ThemeToggle />
			</div>

			{/* Main content area with fixed layout */}
			<div className="h-full w-full flex items-center justify-center">
				<div className="w-full h-full max-w-[1600px] px-12 pt-32 pb-8 flex items-center">
					{/* Container with 60/40 split - promotional features left, auth right */}
					<div className="w-full h-[calc(100vh-8rem)] max-h-[800px] grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-16 items-center">
						{/* Left: Promotional Features 60% */}
						<div className="hidden lg:flex flex-col justify-center h-full">
							<div className="max-w-[720px] mx-auto w-full">
								{/* Main headline */}
								<div className="mb-10 text-center">
									<h2 className="text-5xl typography-heading text-foreground leading-tight">
										Take control of your <span className="gradient-text">financial future</span>
									</h2>
									<p className="mt-5 text-lg text-muted-foreground typography-body">
										Exight helps you understand and control your money effortlessly.
									</p>
								</div>

								{/* Features grid */}
								<PromotionalFeatures className="h-auto" />
							</div>
						</div>

						{/* Right: Auth Form 40% */}
						<div className="w-full max-w-[520px] mx-auto lg:mx-0 flex items-start justify-center h-full pt-16">
							<div className="w-full max-w-[440px]">
								{/* Auth card container with depth */}
								<div className="rounded-3xl bg-white/90 dark:bg-slate-900/80 dark:backdrop-blur-xl border border-gray-200/80 dark:border-slate-700/50 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-10">
									<div className="w-full space-y-5">
										<AuthForm />
										<div className="flex items-center gap-3">
											<div className="flex-1 border-t border-gray-200 dark:border-slate-700/50"></div>
											<span className="text-[11px] text-gray-500 dark:text-gray-400 typography-small tracking-wide">OR</span>
											<div className="flex-1 border-t border-gray-200 dark:border-slate-700/50"></div>
										</div>
										<GoogleAuthButton />
										<p className="pt-2 text-[11px] text-gray-500 dark:text-gray-400 typography-small text-center leading-tight">
											By signing in, you agree to our <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline">Terms of Service</button> and <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline">Privacy Policy</button>
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Mobile view - show promotional content below auth form */}
						<div className="lg:hidden w-full">
							<div className="mt-8 text-center">
								<h2 className="text-2xl typography-heading text-foreground">
									Take control of your <span className="gradient-text">financial future</span>
								</h2>
								<p className="mt-2 text-sm text-muted-foreground typography-body">
									Exight helps you understand and control your money effortlessly.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

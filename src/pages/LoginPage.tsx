import { ThemeToggle } from "@/components/ThemeToggle";
import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
// Removed ScreenScale to avoid transform-based scaling which causes subpixel blur and misalignment

const LoginPage = () => {
	return (
		<div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
			{/* Fixed header bar with logo and theme toggle */}
			<div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-50">
				{/* Brand at top-left */}
				<div className="select-none">
					<h1 className="text-[28px] leading-none font-extrabold tracking-tight typography-heading">
						<span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">Exight</span>
					</h1>
					<p className="mt-0.5 text-xs text-muted-foreground typography-body">Insights for your expenses.</p>
				</div>

				{/* Dark mode toggle */}
				<ThemeToggle />
			</div>

			{/* Main content area with fixed layout */}
			<div className="h-full w-full flex items-center justify-center">
				<div className="w-full h-full max-w-[1440px] px-8 pt-20 pb-8 flex items-center">
					{/* Container with 60/40 split - promotional features left, auth right */}
					<div className="w-full h-[calc(100vh-7rem)] max-h-[720px] grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-center">
						{/* Left: Promotional Features 60% */}
						<div className="hidden lg:flex flex-col justify-center h-full">
							<div className="max-w-[640px] mx-auto w-full">
								{/* Main headline */}
								<div className="mb-8 text-center">
									<h2 className="text-4xl typography-heading text-foreground leading-tight">
										Take control of your <span className="gradient-text">financial future</span>
									</h2>
									<p className="mt-4 text-base text-muted-foreground typography-body">
										Exight helps you understand and control your money effortlessly.
									</p>
								</div>

								{/* Features grid */}
								<PromotionalFeatures className="h-auto" />
							</div>
						</div>

						{/* Right: Auth Form 40% */}
						<div className="w-full max-w-[480px] mx-auto lg:mx-0 flex items-center justify-center h-full">
							<div className="w-full max-w-[400px]">
								{/* Auth card container with depth */}
								<div className="rounded-2xl bg-white/90 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/70 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] p-8">
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

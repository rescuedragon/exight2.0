import { useState } from "react";
import { BarChart3, Users, TrendingUp, Shield, X, Check, Star, Lock, TrendingDown, Bell, ArrowLeft, Mail, Eye, EyeOff, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

interface PromotionalFeaturesProps {
  className?: string;
  onGetStarted?: () => void;
}

// Auto-detected features from the Exight repository analysis with detailed modal content
const features = [
  {
    id: "emi-tracking",
    icon: BarChart3,
    title: "EMI Tracking",
    subtitle: "Track monthly EMIs and visualize spending patterns with smart reminders and notifications.",
    modalContent: {
      description: "Never miss an EMI payment again with our comprehensive tracking system that monitors all your monthly installments and provides intelligent insights.",
      features: [
        { icon: Bell, text: "Smart payment reminders 3 days before due date" },
        { icon: BarChart3, text: "Visual spending pattern analysis" },
        { icon: TrendingDown, text: "Track payment history and trends" },
        { icon: Star, text: "Credit score impact monitoring" }
      ],
      benefits: [
        "Avoid late payment fees and penalties",
        "Improve your credit score with timely payments",
        "Get insights into your monthly financial commitments",
        "Plan future purchases with EMI capacity analysis"
      ]
    }
  },
  {
    id: "loan-management",
    icon: Users,
    title: "Loan Management", 
    subtitle: "Manage loans given to friends with person-wise history and comprehensive payment tracking.",
    modalContent: {
      description: "Keep track of money lent to friends and family with detailed records, payment schedules, and friendly reminder systems.",
      features: [
        { icon: Users, text: "Person-wise loan categorization" },
        { icon: BarChart3, text: "Payment history and analytics" },
        { icon: Bell, text: "Gentle reminder notifications" },
        { icon: Check, text: "Easy repayment tracking" }
      ],
      benefits: [
        "Maintain healthy relationships with clear records",
        "Never forget who owes you money",
        "Track partial payments and installments",
        "Generate payment summaries and reports"
      ]
    }
  },
  {
    id: "smart-insights",
    icon: TrendingUp,
    title: "Smart Insights",
    subtitle: "Get actionable insights and financial projections to plan your finances much better.",
    modalContent: {
      description: "Leverage AI-powered analytics to understand your spending patterns and get personalized recommendations for better financial health.",
      features: [
        { icon: TrendingUp, text: "Predictive spending analysis" },
        { icon: BarChart3, text: "Monthly financial health reports" },
        { icon: Star, text: "Personalized saving recommendations" },
        { icon: TrendingDown, text: "Expense optimization suggestions" }
      ],
      benefits: [
        "Make informed financial decisions",
        "Identify unnecessary spending patterns",
        "Plan for future financial goals",
        "Receive personalized money-saving tips"
      ]
    }
  },
  {
    id: "bank-security",
    icon: Shield,
    title: "Bank-Level Security",
    subtitle: "Your financial data stays protected with industry-standard bank-level security measures.",
    modalContent: {
      description: "Your financial information is protected with the same level of security used by major banks, ensuring complete privacy and data protection.",
      features: [
        { icon: Lock, text: "256-bit encryption for all data" },
        { icon: Shield, text: "Multi-factor authentication" },
        { icon: Check, text: "Regular security audits" },
        { icon: Star, text: "GDPR compliant data handling" }
      ],
      benefits: [
        "Complete privacy of your financial data",
        "Protection against unauthorized access",
        "Secure cloud storage with daily backups",
        "Compliance with international security standards"
      ]
    }
  }
];

export function PromotionalFeatures({ className, onGetStarted }: PromotionalFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginInModal, setShowLoginInModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const openModal = (feature: typeof features[0]) => {
    console.log('Opening modal for feature:', feature.title);
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowLoginInModal(false);
    setActiveTab('login');
    setFormData({ email: '', password: '', name: '' });
    setTimeout(() => setSelectedFeature(null), 300);
  };

  const handleGetStartedInModal = () => {
    setShowLoginInModal(true);
    if (onGetStarted) onGetStarted();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { authAPI } = await import("@/services/api");
      if (activeTab === 'login') {
        await authAPI.login({ email: formData.email, password: formData.password });
      } else {
        const [firstName, ...rest] = formData.name.split(' ');
        const lastName = rest.join(' ');
        await authAPI.register({ email: formData.email, password: formData.password, firstName, lastName });
      }
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Auth failed', error);
      alert('Authentication failed');
    }
  };

  return (
    <>
      <div className={cn("w-full", className)}>
      {/* Features grid - 2x2 layout optimized for Mac screens */}
      <div className="grid grid-cols-2 gap-5 w-full">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Feature card clicked:', feature.title);
              openModal(feature);
            }}
            className={cn(
              "group relative p-6 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-lg dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]",
              "transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_8px_30px_-8px_rgba(16,185,129,0.2)] hover:-translate-y-1 hover:scale-[1.02]",
              "cursor-pointer h-[180px] flex flex-col text-left",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-300 dark:focus:border-emerald-400"
            )}
          >
            {/* Feature content */}
            <div className="flex items-start gap-4">
              {/* Feature icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-purple-100 dark:from-emerald-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                </div>
              </div>
              
              {/* Text content */}
              <div className="flex-1">
                <h4 className="typography-feature-title text-gray-900 dark:text-gray-100 text-base mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 typography-body text-sm leading-6">
                  {feature.subtitle}
                </p>
              </div>
            </div>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>
      </div>

      {/* Beautiful Horizontal Modal - MacBook Air M1 Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Glassmorphic Blur Overlay */}
          <div 
            className="fixed inset-0 backdrop-blur-2xl bg-black/20 transition-all duration-300"
            onClick={closeModal}
          />
          
          {/* Modal Content - Fixed size for all states */}
          <div className="relative overflow-hidden rounded-[2rem] border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200 transform-gpu origin-center w-[92vw] h-[68vh] max-w-[1240px] md:w-[88vw] md:h-[66vh] md:max-w-[1280px] lg:max-w-[1320px] bg-white dark:bg-slate-950/90 dark:backdrop-blur-xl">
          {selectedFeature && !showLoginInModal && (
            <div className="h-full flex">
              {/* Left Panel - Header & Description */}
              <div className="w-2/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-slate-900 dark:to-slate-900/40">
                {/* Modal Header */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl typography-heading text-gray-900">{selectedFeature.title}</h2>
                    <p className="text-gray-600 typography-body text-base md:text-lg">{selectedFeature.subtitle}</p>
                  </div>

                  {/* Description */}
                  <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-white/20 dark:border-slate-700/40">
                    <p className="text-gray-700 typography-body text-base md:text-lg">{selectedFeature.modalContent.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleGetStartedInModal}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-purple-600 text-white py-2.5 md:py-3 px-5 md:px-6 rounded-2xl typography-button hover:from-emerald-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Get Started
                    </button>
                    <button 
                      onClick={closeModal}
                      className="px-5 md:px-6 py-2.5 md:py-3 border border-gray-200 text-gray-700 rounded-2xl typography-button hover:bg-gray-50 transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel - Features & Benefits */}
              <div className="w-3/5 p-6 md:p-8 lg:p-10 flex flex-col">
                {/* Features Section */}
                <div className="flex-1">
                  <h4 className="text-lg md:text-xl typography-feature-title text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Key Features</h4>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                    {selectedFeature.modalContent.features.map((item, idx) => (
                      <div key={idx} className="p-3 md:p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-900/60 transition-colors duration-200 border border-transparent dark:border-slate-700/40">
                        <span className="text-gray-700 dark:text-gray-300 typography-body text-sm md:text-base">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="flex-1">
                  <h4 className="text-lg md:text-xl typography-feature-title text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Benefits</h4>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {selectedFeature.modalContent.benefits.map((benefit, idx) => (
                      <div key={idx} className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-transparent dark:border-emerald-800/30">
                        <span className="text-gray-700 dark:text-gray-300 typography-body text-sm md:text-base">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Form Content */}
          {showLoginInModal && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Header with Go Back Button, Exight Title, and Close Button */}
              <div className="flex items-center justify-between p-4 pb-2 md:p-5 md:pb-2">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowLoginInModal(false)}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center mr-3"
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <h1 className="text-base md:text-lg typography-heading bg-clip-text text-transparent" style={{
                    backgroundImage: 'linear-gradient(45deg, #059669, #2563eb, #9333ea, #059669)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 8s ease-in-out infinite'
                  }}>
                    Exight
                  </h1>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Login Content - fill available height */}
              <div className="flex-1 flex items-stretch justify-center px-5 md:px-6 pb-4 pt-1 overflow-y-auto">
                <div className="w-full max-w-sm flex flex-col">

                  {/* Auth form - Compact version for fixed modal */}
                  <form onSubmit={handleSubmit} className="w-full flex-1 flex flex-col">
                    <div className="grid w-full grid-cols-2 mb-4 bg-gray-50 dark:bg-slate-900/50 p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className={`rounded-lg py-2 px-3 text-xs typography-button transition-all ${
                          activeTab === 'login' 
                            ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        SIGN IN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className={`rounded-lg py-2 px-3 text-xs typography-button transition-all ${
                          activeTab === 'register' 
                            ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        SIGN UP
                      </button>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      {activeTab === 'register' && (
                        <div className="space-y-1">
                          <label className="text-xs typography-body text-gray-900 dark:text-gray-100">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="w-full pl-8 h-9 border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white rounded-md text-sm typography-body focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <label className="text-xs typography-body text-gray-900 dark:text-gray-100">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-8 h-9 border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white rounded-md text-sm typography-body focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs typography-body text-gray-900 dark:text-gray-100">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder={activeTab === 'register' ? "Create a password" : "Enter your password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full pl-8 pr-8 h-9 border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white rounded-md text-sm typography-body focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200"
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                      
                      {activeTab === 'login' && (
                        <div className="flex items-center justify-end">
                          <button 
                            type="button"
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 typography-small transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}
                      
                      <button 
                        type="submit"
                        className="w-full h-10 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 dark:from-emerald-500 dark:to-purple-500 dark:hover:from-emerald-600 dark:hover:to-purple-600 text-white text-xs typography-button rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {activeTab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                      </button>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center space-x-3 mt-3">
                    <div className="flex-1 border-t border-gray-200 dark:border-slate-800"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 typography-small">or</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-slate-800"></div>
                  </div>

                  {/* Google auth - Compact */}
                  <button className="w-full h-10 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-900 dark:text-gray-100 text-xs typography-button rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    CONTINUE WITH GOOGLE
                  </button>

                  {/* Footer text */}
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 typography-small leading-tight">
                      By signing in, you agree to our{" "}
                      <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline transition-colors">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline transition-colors">
                        Privacy Policy
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Close Button - Only show when not in login mode */}
          {!showLoginInModal && (
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-2 bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
          </div>
        </div>
      )}
    </>
  );
}

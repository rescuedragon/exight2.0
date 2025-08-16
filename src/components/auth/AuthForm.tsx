import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  className?: string;
}

export function AuthForm({ className }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { authAPI } = await import("@/services/api");
      const response = await authAPI.login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      console.log('Login successful:', response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const [firstName, ...rest] = formData.name.split(' ');
      const lastName = rest.join(' ');
      
      const { authAPI } = await import("@/services/api");
      const response = await authAPI.register({ 
        email: formData.email, 
        password: formData.password, 
        firstName, 
        lastName 
      });
      
      console.log('Registration successful:', response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full transition-all duration-700 ease-in-out", className)}>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <Tabs defaultValue="login" className="w-full transition-all duration-700 ease-in-out">
        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 h-12 rounded-3xl bg-gray-100 dark:bg-slate-800/60 border border-black/5 dark:border-slate-700/60 overflow-hidden" role="tablist" aria-label="Authentication mode">
          <TabsTrigger 
            value="login" 
            className="rounded-3xl h-10 flex items-center justify-center text-sm font-semibold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-none"
            role="tab"
            aria-selected={true}
          >
            SIGN IN
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="rounded-3xl h-10 flex items-center justify-center text-sm font-semibold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-none"
            role="tab"
            aria-selected={false}
          >
            SIGN UP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmitLogin} className="space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="space-y-1 transition-all duration-300 ease-out">
              <Label htmlFor="login-email" className="text-sm typography-body text-gray-900 dark:text-gray-100">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-11 h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 typography-body text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 transition-all duration-300 ease-out">
              <Label htmlFor="login-password" className="text-sm typography-body text-gray-900 dark:text-gray-100">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-11 pr-11 h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 typography-body text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 typography-small transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 dark:from-emerald-500 dark:to-purple-500 dark:hover:from-emerald-600 dark:hover:to-purple-600 text-white typography-button text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmitRegister} className="space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="space-y-1 transition-all duration-400 ease-out animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="register-name" className="text-sm typography-body text-gray-900 dark:text-gray-100">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-11 h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 typography-body text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 transition-all duration-300 ease-out">
              <Label htmlFor="register-email" className="text-sm typography-body text-gray-900 dark:text-gray-100">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-11 h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 typography-body text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 transition-all duration-300 ease-out">
              <Label htmlFor="register-password" className="text-sm typography-body text-gray-900 dark:text-gray-100">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-11 pr-11 h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 typography-body text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 dark:from-emerald-500 dark:to-purple-500 dark:hover:from-emerald-600 dark:hover:to-purple-600 text-white typography-button text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

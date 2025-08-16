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
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { authAPI } = await import("@/services/api");
      await authAPI.login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid email or password');
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const [firstName, ...rest] = formData.name.split(' ');
      const lastName = rest.join(' ');
      const { authAPI } = await import("@/services/api");
      await authAPI.register({ email: formData.email, password: formData.password, firstName, lastName });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed');
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-50 p-1.5 rounded-lg" role="tablist" aria-label="Authentication mode">
          <TabsTrigger 
            value="login" 
            className="rounded-md py-3 px-4 text-sm typography-button transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            role="tab"
            aria-selected={true}
          >
            SIGN IN
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="rounded-md py-3 px-4 text-sm typography-button transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            role="tab"
            aria-selected={false}
          >
            SIGN UP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <div className="space-y-1 text-center">
            <h2 className="text-xl typography-heading text-gray-900">Welcome back</h2>
            <p className="text-gray-600 text-sm typography-body">Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="login-email" className="text-sm typography-body text-gray-900">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 typography-body text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="login-password" className="text-sm typography-body text-gray-900">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 typography-body text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 typography-small transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white typography-button text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              SIGN IN
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <div className="space-y-1 text-center">
            <h2 className="text-xl typography-heading text-gray-900">Create account</h2>
            <p className="text-gray-600 text-sm typography-body">Sign up to start managing your finances</p>
          </div>
          
          <form onSubmit={handleSubmitRegister} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="register-name" className="text-sm typography-body text-gray-900">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 typography-body text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="register-email" className="text-sm typography-body text-gray-900">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 typography-body text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="register-password" className="text-sm typography-body text-gray-900">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 typography-body text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white typography-button text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              CREATE ACCOUNT
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

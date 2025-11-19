import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { z } from "zod";
const signupSchema = z.object({
  nickname: z.string().trim().min(1, "Nickname is required").max(50, "Nickname must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    toast
  } = useToast();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") === "login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: ""
  });
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/calendar");
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/calendar");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = signupSchema.parse(formData);
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            nickname: validated.nickname
          },
          emailRedirectTo: `${window.location.origin}/calendar`
        }
      });
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please log in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else if (data.user) {
        toast({
          title: "Success!",
          description: "Your account has been created. Redirecting..."
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = loginSchema.parse(formData);
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border shadow-elegant">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="md" showText={true} />
          </div>
          <CardTitle className="text-2xl gradient-text">
            {isLogin ? "Welcome Back" : "Get Started"}
          </CardTitle>
          <CardDescription className="text-foreground/70">
            {isLogin ? "Log in to access your calendar" : "Create an account to start planning"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input id="nickname" placeholder="Enter your nickname" value={formData.nickname} onChange={e => setFormData({
              ...formData,
              nickname: e.target.value
            })} required={!isLogin} className="bg-background/60 border-border" />
              </div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} required className="bg-background/60 border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={e => setFormData({
              ...formData,
              password: e.target.value
            })} required className="bg-background/60 border-border" />
            </div>
            <Button type="submit" className="w-full shadow-hover transition-smooth bg-gradient-to-r from-[hsl(340,80%,45%)] via-[hsl(350,90%,55%)] to-[hsl(330,100%,70%)] text-white hover:opacity-90 border-0" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="hover:underline font-medium text-red-600">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Auth;
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
const Index = () => {
  const navigate = useNavigate();
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
  return <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          
          
          <div className="flex justify-center">
            <Logo size="lg" showText={true} className="scale-150" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold gradient-text">Organize your days accordingly</h2>
          <p className="text-lg max-w-xl mx-auto font-normal md:text-base text-red-600">An organized daily planner that helps you remember your tasks.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/auth?mode=signup")} size="lg" className="shadow-hover transition-smooth text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-[hsl(340,80%,45%)] via-[hsl(350,90%,55%)] to-[hsl(330,100%,70%)] text-white hover:opacity-90 border-0">
            Get Started
          </Button>
          <Button onClick={() => navigate("/auth?mode=login")} size="lg" variant="outline" className="shadow-hover transition-smooth text-lg px-8 py-6 rounded-xl border-2 bg-gradient-to-r from-[hsl(340,80%,45%)] via-[hsl(350,90%,55%)] to-[hsl(330,100%,70%)] bg-clip-text text-transparent border-[hsl(350,90%,55%)] hover:bg-gradient-to-l">
            Already a user? Log in
          </Button>
        </div>

        <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm">
          
          <div className="flex items-center gap-2 bg-transparent">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-red-600 text-base">Smart Reminders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-red-600 text-base">Easy to Use</span>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;
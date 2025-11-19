import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

interface CalendarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  nickname?: string;
}

const CalendarHeader = ({
  searchQuery,
  onSearchChange,
  nickname,
}: CalendarHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            {nickname && (
              <h1 className="text-lg md:text-xl font-semibold gradient-text">
                {nickname}'s Calendar
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64 bg-background/60 border-border focus:border-primary transition-smooth"
              />
            </div>

            {/* Desktop logout button with text */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden md:inline-flex bg-destructive/10 border-destructive/20 hover:bg-destructive/20 text-destructive transition-smooth"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

            {/* Mobile logout button - icon only */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="md:hidden bg-destructive/10 border-destructive/20 hover:bg-destructive/20 text-destructive transition-smooth"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full bg-background/60 border-border focus:border-primary transition-smooth"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;

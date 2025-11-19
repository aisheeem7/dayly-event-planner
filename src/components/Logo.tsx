import { Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}
const Logo = ({
  className,
  showText = true,
  size = "md"
}: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl"
  };
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6 md:h-7 md:w-7",
    lg: "h-8 w-8 md:h-10 md:w-10"
  };
  return <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center bg-transparent">
        {/* Calendar Icon with float animation and gradient */}
        <div className="relative animate-float">
          <Calendar className={cn(iconSizes[size], "drop-shadow-sm")} strokeWidth={2.5} style={{
            stroke: 'url(#logo-gradient)'
          }} />
        </div>

        {/* Bell Icon with swing animation, positioned slightly overlapping and gradient */}
        <div className="relative -ml-2 animate-swing">
          <Bell className={cn(iconSizes[size], "drop-shadow-sm")} strokeWidth={2.5} style={{
            stroke: 'url(#logo-gradient)'
          }} />
        </div>
        
        {/* SVG gradient definition */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(340, 80%, 45%)" />
              <stop offset="50%" stopColor="hsl(350, 90%, 55%)" />
              <stop offset="100%" stopColor="hsl(330, 100%, 70%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && <h1 className={cn("font-semibold gradient-text", sizeClasses[size])}>
          DayLY
        </h1>}
    </div>;
};
export default Logo;
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  events: Event[];
  onDateClick: (date: Date) => void;
  searchQuery: string;
}

const CalendarGrid = ({
  currentMonth,
  onMonthChange,
  events,
  onDateClick,
  searchQuery,
}: CalendarGridProps) => {
  const today = new Date();
  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const monthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const previousMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const matches = eventDate.toDateString() === date.toDateString();
      if (searchQuery) {
        return (
          matches &&
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return matches;
    });
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card rounded-2xl shadow-soft p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="hover:bg-primary/10 transition-smooth"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="hover:bg-primary/10 transition-smooth"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isToday = day.toDateString() === today.toDateString();
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={index}
              onClick={() => onDateClick(day)}
              className={cn(
                "aspect-square rounded-xl p-2 text-sm md:text-base transition-smooth hover:shadow-hover",
                "flex flex-col items-start justify-start gap-0.5 overflow-hidden",
                isCurrentMonth
                  ? "bg-background hover:bg-primary/10"
                  : "bg-muted/30 text-muted-foreground",
                isToday && "bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
              )}
            >
              <span className="font-medium">{day.getDate()}</span>
              {hasEvents && (
                <div className="w-full space-y-0.5">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-[10px] md:text-xs px-1 py-0.5 rounded truncate"
                      style={{ 
                        backgroundColor: event.color || "#FADADD",
                        color: "#000"
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-muted-foreground px-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;

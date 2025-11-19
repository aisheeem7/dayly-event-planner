import { useEffect } from "react";
import { Event } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export const useNotifications = (events: Event[]) => {
  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check for upcoming events every minute
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const currentDateStr = now.toISOString().split("T")[0];

      events.forEach((event) => {
        if (!event.notificationEnabled) return;

        // Parse event time
        const [hours, minutes] = event.time.split(":").map(Number);
        const eventTime = hours * 60 + minutes;
        const eventDateStr = new Date(event.date).toISOString().split("T")[0];

        // Check if event is today and within the next minute
        if (eventDateStr === currentDateStr && Math.abs(eventTime - currentTime) <= 1) {
          // Show browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("DayLY Reminder", {
              body: `${event.title} is starting now!`,
              icon: "/favicon.ico",
              tag: event.id,
            });
          }

          // Show toast notification
          toast({
            title: "Event Reminder",
            description: `${event.title} is starting now!`,
          });
        }
      });
    };

    // Check immediately and then every minute
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [events]);
};

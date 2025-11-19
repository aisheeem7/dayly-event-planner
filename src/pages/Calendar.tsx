import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventModal from "@/components/calendar/EventModal";
import { Event } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
const Calendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Enable notifications
  useNotifications(events);

  // Fetch events from database
  const fetchEvents = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } else if (data) {
      // Map database fields to Event type
      const mappedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        notes: event.notes,
        notificationEnabled: event.notification_enabled,
        category: event.category,
        color: event.color,
      }));
      setEvents(mappedEvents);
    }
  };

  useEffect(() => {
    // Check authentication and fetch user profile
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } else if (profile) {
        setNickname(profile.nickname);
      }

      // Fetch events
      await fetchEvents();
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = async (event: Omit<Event, "id">) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("events")
      .insert([{ 
        title: event.title,
        date: event.date,
        time: event.time,
        notes: event.notes,
        notification_enabled: event.notificationEnabled,
        category: event.category,
        color: event.color,
        user_id: session.user.id 
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } else {
      const mappedEvent: Event = {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        notes: data.notes,
        notificationEnabled: data.notification_enabled,
        category: data.category,
        color: data.color,
      };
      setEvents([...events, mappedEvent]);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } else {
      setEvents(events.filter((e) => e.id !== eventId));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    const { error } = await supabase
      .from("events")
      .update({
        title: updatedEvent.title,
        date: updatedEvent.date,
        time: updatedEvent.time,
        notes: updatedEvent.notes,
        notification_enabled: updatedEvent.notificationEnabled,
        category: updatedEvent.category,
        color: updatedEvent.color,
      })
      .eq("id", updatedEvent.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    } else {
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <p className="text-lg text-foreground">Loading...</p>
      </div>
    );
  }
  return <div className="min-h-screen gradient-soft">
      <CalendarHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} nickname={nickname} />
      
      <div className="container mx-auto px-4 py-4">
        
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <CalendarGrid currentMonth={currentMonth} onMonthChange={setCurrentMonth} events={events} onDateClick={handleDateClick} searchQuery={searchQuery} />
      </main>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} events={events.filter(e => selectedDate && new Date(e.date).toDateString() === selectedDate.toDateString())} onAddEvent={handleAddEvent} onDeleteEvent={handleDeleteEvent} onUpdateEvent={handleUpdateEvent} />
    </div>;
};
export default Calendar;
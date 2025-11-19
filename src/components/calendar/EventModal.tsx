import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Event } from "@/lib/types";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  events: Event[];
  onAddEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (event: Event) => void;
}

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent,
}: EventModalProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [color, setColor] = useState("#FADADD");

  useEffect(() => {
    if (!isOpen) {
      setIsAdding(false);
      setEditingEvent(null);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setTime("");
    setNotes("");
    setNotificationEnabled(false);
    setColor("#FADADD");
  };

  const handleSave = () => {
    if (!title || !time || !selectedDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const eventData: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title,
      date: selectedDate.toISOString(),
      time,
      notes,
      notificationEnabled,
      color,
    };

    if (editingEvent) {
      onUpdateEvent(eventData);
      toast.success("Event updated successfully");
    } else {
      onAddEvent(eventData);
      toast.success("Event added successfully");
    }

    setIsAdding(false);
    setEditingEvent(null);
    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setTime(event.time);
    setNotes(event.notes || "");
    setNotificationEnabled(event.notificationEnabled);
    setColor(event.color || "#FADADD");
    setIsAdding(true);
  };

  const handleDelete = (eventId: string) => {
    onDeleteEvent(eventId);
    toast.success("Event deleted successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isAdding ? (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No events for this day
                  </p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {event.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                        {event.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(event)}
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event.id)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button
                onClick={() => setIsAdding(true)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  className="bg-background border-border focus:border-primary resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Event Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{color}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
                >
                  {editingEvent ? "Update" : "Save"}
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;

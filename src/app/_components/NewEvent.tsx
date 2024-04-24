"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React, { useState, type ChangeEvent } from "react";

interface EventDetails {
  event: string;
  time: string;
  date: string;
  notes?: string | undefined;
}

interface EventFormProps {
  sessionId: string;
}

const EventForm: React.FC<EventFormProps> = ({ sessionId }) => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    event: "",
    time: "",
    notes: "",
    date: "",
  });
  const router = useRouter();
  // const { data: session } = useSession();
  // console.log(session?.user.id);

  const createEvent = api.calendarEventRouter.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        backgroundColor: "#FED7B7",
        padding: "20px",
        width: "300px",
        borderRadius: "10px",
      }}
    >
      <h3>Add New Event</h3>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createEvent.mutate({
            userId: sessionId,
            event: eventDetails.event,
            time: eventDetails.time,
            date: eventDetails.date,
            notes: eventDetails.notes,
          });
        }}
      >
        <input
          type="text"
          name="event"
          placeholder="Name of event"
          value={eventDetails.event}
          onChange={handleChange}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={eventDetails.date}
          onChange={handleChange}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          type="text"
          name="time"
          placeholder="Time"
          value={eventDetails.time}
          onChange={handleChange}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={eventDetails.notes}
          onChange={handleChange}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            height: "70px",
            boxSizing: "border-box",
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            backgroundColor: "#FFF5E1",
            border: "none",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          ✓ Add Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;

"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    company_name: string;
    type: string;
    link?: string;
  };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/calendar");
        const data = await response.json();

        if (data.success) {
          const calendarEvents: CalendarEvent[] = data.data.map((item: any) => {
            const type = item.extendedProps?.type || "es";
            return {
              id: item.id,
              title: item.title,
              start: item.start,
              backgroundColor: getTypeColor(type),
              extendedProps: item.extendedProps,
            };
          });
          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "es":
        return "#3b82f6"; // blue
      case "honsenkou":
        return "#ef4444"; // red
      case "test_center":
        return "#10b981"; // green
      case "internship":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    const props = event.extendedProps;

    if (props.link) {
      window.open(props.link, "_blank");
    } else {
      alert(`${props.company_name}\n種別: ${props.type}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">カレンダー</h1>
              <p className="text-blue-100 mt-2">締切日をカレンダーで確認</p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              一覧に戻る
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-500"></span>
              <span className="text-sm">ES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500"></span>
              <span className="text-sm">本選考</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span>
              <span className="text-sm">テストセンター</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-500"></span>
              <span className="text-sm">インターン</span>
            </div>
            {loading && <span className="text-sm text-gray-500">読み込み中...</span>}
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,listWeek",
            }}
            locale="ja"
            events={events}
            eventClick={handleEventClick}
            height="auto"
            eventColor="#3b82f6"
          />
        </div>
      </main>
    </div>
  );
}

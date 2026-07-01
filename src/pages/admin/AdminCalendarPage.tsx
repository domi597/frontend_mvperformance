import { useEffect, useMemo, useState } from "react";
import { IAppointment } from "../../interface/IAppointment";
import { AppointmentStatus } from "../../types/AppointmentStatus";
import { getCalendarAppointments } from "../../api/appointmentApi";
import "../../css/calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_LONG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const MONTH_NAMES = [
    "Jänner", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
];


const STATUS_LABELS: { status: AppointmentStatus; label: string; color: string }[] = [
    { status: "NEU", label: "Neu", color: "blue" },
    { status: "AUSSTEHEND", label: "Ausstehend", color: "yellow" },
    { status: "BESTÄTIGT", label: "Bestätigt", color: "green" },
    { status: "ABGESCHLOSSEN", label: "Abgeschlossen", color: "gray" },
];

const HOUR_START = 7;
const HOUR_END = 20;
const HOUR_HEIGHT = 56;
const GRID_MINUTES = (HOUR_END - HOUR_START + 1) * 60;

type ViewMode = "month" | "week" | "day";

function statusColor(status: AppointmentStatus) {
    switch (status) {
        case "NEU":
            return "blue";
        case "AUSSTEHEND":
            return "yellow";
        case "BESTÄTIGT":
            return "green";
        case "ABGELEHNT":
            return "red";
        case "ABGESCHLOSSEN":
            return "gray";
        default:
            return "gray";
    }
}

function startOfWeek(d: Date) {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
}

function addDays(d: Date, n: number) {
    const date = new Date(d);
    date.setDate(date.getDate() + n);
    return date;
}

function toDateKey(d: Date) {
    return d.toLocaleDateString("sv-SE"); 
}

function nowTopOffset() {
    const now = new Date();
    const minutesFromStart = (now.getHours() - HOUR_START) * 60 + now.getMinutes();
    if (minutesFromStart < 0 || minutesFromStart > GRID_MINUTES) return null;
    return (minutesFromStart / 60) * HOUR_HEIGHT;
}

function CalendarSkeletonMonth() {
    return (
        <div className="month-grid">
            {WEEKDAYS.map((d) => (
                <div key={d} className="month-weekday">{d}</div>
            ))}
            {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="month-cell">
                    <div className="skeleton-block skeleton-line" style={{ width: "20px", height: "12px" }} />
                    <div className="skeleton-block skeleton-line" style={{ width: "80%", height: "16px", marginTop: "10px" }} />
                </div>
            ))}
        </div>
    );
}

function CalendarSkeletonGrid({ columns }: { columns: number }) {
    return (
        <div className="week-view">
            <div className="week-header" style={{ gridTemplateColumns: `56px repeat(${columns}, 1fr)` }}>
                <div className="week-time-col" />
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="week-day-header">
                        <div className="skeleton-block skeleton-line" style={{ width: "24px", height: "10px", margin: "0 auto" }} />
                        <div className="skeleton-block skeleton-line" style={{ width: "20px", height: "16px", margin: "6px auto 0" }} />
                    </div>
                ))}
            </div>
            <div className="week-body" style={{ gridTemplateColumns: `56px repeat(${columns}, 1fr)`, height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}>
                <div className="week-time-col">
                    {Array.from({ length: HOUR_END - HOUR_START + 1 }).map((_, i) => (
                        <div key={i} className="week-hour-label" style={{ height: HOUR_HEIGHT }} />
                    ))}
                </div>
                {Array.from({ length: columns }).map((_, colI) => (
                    <div key={colI} className="week-day-col">
                        {Array.from({ length: HOUR_END - HOUR_START + 1 }).map((_, i) => (
                            <div key={i} className="week-hour-line" style={{ height: HOUR_HEIGHT }} />
                        ))}
                        {colI % 2 === 0 && (
                            <div
                                className="skeleton-block"
                                style={{ position: "absolute", top: 90, left: 4, right: 4, height: 40, borderRadius: 6 }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminCalendarPage() {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<ViewMode>("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<{ date: string; items: IAppointment[] } | null>(null);
    const [nowOffset, setNowOffset] = useState(nowTopOffset());

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await getCalendarAppointments();
                setAppointments(data);
            } catch (err) {
                console.error(err);
                setAppointments([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const id = setInterval(() => setNowOffset(nowTopOffset()), 60_000);
        return () => clearInterval(id);
    }, []);

    const visibleAppointments = useMemo(
        () => appointments.filter((a) => a.status !== "ABGELEHNT"),
        [appointments]
    );

    const byDate = useMemo(() => {
        const map = new Map<string, IAppointment[]>();
        visibleAppointments.forEach((a) => {
            const list = map.get(a.date) ?? [];
            list.push(a);
            map.set(a.date, list);
        });
        map.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
        return map;
    }, [visibleAppointments]);

    const goPrev = () => {
        setCurrentDate((prev) => {
            if (view === "month") return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
            if (view === "week") return addDays(prev, -7);
            return addDays(prev, -1);
        });
    };

    const goNext = () => {
        setCurrentDate((prev) => {
            if (view === "month") return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
            if (view === "week") return addDays(prev, 7);
            return addDays(prev, 1);
        });
    };

    const goToday = () => setCurrentDate(new Date());

    const monthLabel = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const monthDays = useMemo(() => {
        if (view !== "month") return [];
        const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const gridStart = startOfWeek(firstOfMonth);
        return Array.from({ length: 42 }).map((_, i) => addDays(gridStart, i));
    }, [currentDate, view]);

    const weekDays = useMemo(() => {
        if (view !== "week") return [];
        const start = startOfWeek(currentDate);
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }, [currentDate, view]);

    const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }).map((_, i) => HOUR_START + i);

    const weekRangeLabel = weekDays.length
        ? `${weekDays[0].toLocaleDateString("de-DE")} – ${weekDays[6].toLocaleDateString("de-DE")}`
        : "";

    const dayLabel = `${WEEKDAYS_LONG[(currentDate.getDay() + 6) % 7]}, ${currentDate.getDate()}. ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const today = toDateKey(new Date());
    const todayKey = toDateKey(currentDate);
    const dayItems = byDate.get(todayKey) ?? [];

    const titleLabel = view === "month" ? monthLabel : view === "week" ? weekRangeLabel : dayLabel;

    return (
        <div className="calendar-page">
            <div className="calendar-toolbar">
                <div className="calendar-nav">
                    <button className="cal-icon-btn" onClick={goPrev} aria-label="Zurück">
                        <ChevronLeft size={18} />
                    </button>
                    <button className="cal-today-btn" onClick={goToday}>
                        Heute
                    </button>
                    <button className="cal-icon-btn" onClick={goNext} aria-label="Weiter">
                        <ChevronRight size={18} />
                    </button>
                    <h2 className="calendar-title">{titleLabel}</h2>
                </div>

                <div className="calendar-view-toggle">
                    <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>
                        Monat
                    </button>
                    <button className={view === "week" ? "active" : ""} onClick={() => setView("week")}>
                        Woche
                    </button>
                    <button className={view === "day" ? "active" : ""} onClick={() => setView("day")}>
                        Tag
                    </button>
                </div>
            </div>

            <div className="calendar-legend">
                {STATUS_LABELS.map((s) => (
                    <div key={s.status} className="calendar-legend-item">
                        <span className={`legend-dot ${s.color}`} />
                        {s.label}
                    </div>
                ))}
            </div>

            {isLoading ? (
                view === "month" ? (
                    <CalendarSkeletonMonth />
                ) : (
                    <CalendarSkeletonGrid columns={view === "week" ? 7 : 1} />
                )
            ) : view === "month" ? (
                <div className="month-grid">
                    {WEEKDAYS.map((d) => (
                        <div key={d} className="month-weekday">{d}</div>
                    ))}
                    {monthDays.map((day) => {
                        const key = toDateKey(day);
                        const items = byDate.get(key) ?? [];
                        const isOtherMonth = day.getMonth() !== currentDate.getMonth();
                        const isToday = key === today;
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        const visible = items.slice(0, 3);
                        const more = items.length - visible.length;

                        return (
                            <div
                                key={key}
                                className={`month-cell ${isOtherMonth ? "other-month" : ""} ${isToday ? "is-today" : ""} ${items.length ? "has-items" : ""} ${isWeekend ? "is-weekend" : ""}`}
                                onClick={() => items.length && setSelectedDay({ date: key, items })}
                            >
                                <span className="month-cell-date">{day.getDate()}</span>
                                <div className="month-cell-items">
                                    {visible.map((a) => (
                                        <div key={a.id} className={`cal-chip ${statusColor(a.status)}`}>
                                            <span className={`cal-chip-dot ${statusColor(a.status)}`} />
                                            <span className="cal-chip-time">{a.time}</span>
                                            <span className="cal-chip-name">{a.customerName}</span>
                                        </div>
                                    ))}
                                    {more > 0 && <div className="cal-more">+{more} mehr</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : view === "week" ? (
                <div className="week-view">
                    <div className="week-header">
                        <div className="week-time-col" />
                        {weekDays.map((day) => {
                            const key = toDateKey(day);
                            const isToday = key === today;
                            return (
                                <div key={key} className={`week-day-header ${isToday ? "is-today" : ""}`}>
                                    <span className="week-day-name">{WEEKDAYS[(day.getDay() + 6) % 7]}</span>
                                    <span className="week-day-num">{day.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="week-body" style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}>
                        <div className="week-time-col">
                            {hours.map((h) => (
                                <div key={h} className="week-hour-label" style={{ height: HOUR_HEIGHT }}>
                                    {String(h).padStart(2, "0")}:00
                                </div>
                            ))}
                        </div>

                        {weekDays.map((day) => {
                            const key = toDateKey(day);
                            const items = byDate.get(key) ?? [];
                            const isToday = key === today;
                            return (
                                <div key={key} className="week-day-col">
                                    {hours.map((h) => (
                                        <div key={h} className="week-hour-line" style={{ height: HOUR_HEIGHT }} />
                                    ))}
                                    {isToday && nowOffset !== null && (
                                        <div className="now-line" style={{ top: nowOffset }}>
                                            <span className="now-dot" />
                                        </div>
                                    )}
                                    {items.map((a) => {
                                        const [h, m] = a.time.split(":").map(Number);
                                        if (Number.isNaN(h) || h < HOUR_START || h > HOUR_END) return null;
                                        const minutesFromStart = (h - HOUR_START) * 60 + (m ?? 0);
                                        const top = (minutesFromStart / 60) * HOUR_HEIGHT;
                                        return (
                                            <div
                                                key={a.id}
                                                className={`week-appointment ${statusColor(a.status)}`}
                                                style={{ top, height: HOUR_HEIGHT * 0.8 }}
                                                title={`${a.customerName} – ${a.serviceType}`}
                                            >
                                                <span className="week-appt-time">{a.time}</span>
                                                <span className="week-appt-name">{a.customerName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="day-view">
                    <div className="day-view-header">
                        <div className="week-time-col" />
                        <div className={`week-day-header day-single-header ${todayKey === today ? "is-today" : ""}`}>
                            <span className="week-day-name">{WEEKDAYS_LONG[(currentDate.getDay() + 6) % 7]}</span>
                            <span className="week-day-num">{currentDate.getDate()}</span>
                        </div>
                    </div>

                    <div className="day-view-body" style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}>
                        <div className="week-time-col">
                            {hours.map((h) => (
                                <div key={h} className="week-hour-label" style={{ height: HOUR_HEIGHT }}>
                                    {String(h).padStart(2, "0")}:00
                                </div>
                            ))}
                        </div>

                        <div className="day-single-col">
                            {hours.map((h) => (
                                <div key={h} className="week-hour-line" style={{ height: HOUR_HEIGHT }} />
                            ))}
                            {todayKey === today && nowOffset !== null && (
                                <div className="now-line" style={{ top: nowOffset }}>
                                    <span className="now-dot" />
                                </div>
                            )}
                            {dayItems.length === 0 && (
                                <div className="day-empty-hint">Keine Termine an diesem Tag.</div>
                            )}
                            {dayItems.map((a) => {
                                const [h, m] = a.time.split(":").map(Number);
                                if (Number.isNaN(h) || h < HOUR_START || h > HOUR_END) return null;
                                const minutesFromStart = (h - HOUR_START) * 60 + (m ?? 0);
                                const top = (minutesFromStart / 60) * HOUR_HEIGHT;
                                return (
                                    <div
                                        key={a.id}
                                        className={`day-appointment ${statusColor(a.status)}`}
                                        style={{ top, minHeight: HOUR_HEIGHT * 0.9 }}
                                    >
                                        <div className="day-appt-time">{a.time}</div>
                                        <div className="day-appt-main">
                                            <p className="day-appt-name">{a.customerName}</p>
                                            <p className="day-appt-sub">
                                                {a.serviceType} — {a.brand} {a.model} ({a.year})
                                            </p>
                                        </div>
                                        <span className={`badge ${statusColor(a.status)}`}>{a.status}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {selectedDay && (
                <div className="calendar-modal-overlay" onClick={() => setSelectedDay(null)}>
                    <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Termine am {selectedDay.date}</h3>
                        <div className="calendar-modal-list">
                            {selectedDay.items.map((a) => (
                                <div key={a.id} className="calendar-modal-item">
                                    <span className={`badge ${statusColor(a.status)}`}>{a.status}</span>
                                    <div>
                                        <p className="cmi-name">{a.time} · {a.customerName}</p>
                                        <p className="cmi-sub">{a.serviceType} — {a.brand} {a.model} ({a.year})</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="calendar-modal-close" onClick={() => setSelectedDay(null)}>
                            Schließen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

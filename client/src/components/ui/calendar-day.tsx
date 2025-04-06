import { CalendarDayState } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  day: CalendarDayState;
  onClick?: (date: Date) => void;
}

export function CalendarDay({ day, onClick }: CalendarDayProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(day.date);
    }
  };

  return (
    <div
      className={cn(
        "calendar-day",
        !day.isCurrentMonth && "text-neutral-400",
        day.isPeriod && "period",
        day.isPredictedPeriod && "period-predicted",
        day.isOvulation && "ovulation",
        day.isFertile && "fertile",
        day.isToday && "font-bold"
      )}
      onClick={handleClick}
    >
      {day.number}
    </div>
  );
}

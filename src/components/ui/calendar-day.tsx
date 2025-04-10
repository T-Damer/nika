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
        "calendar-day aspect-square flex items-center justify-center rounded-full cursor-pointer dark:text-white",
        !day.isCurrentMonth && "text-neutral-400 dark:text-neutral-500",
        day.isPeriod && "bg-primary/20",
        day.isPredictedPeriod && "bg-primary/10",
        day.isOvulation && "!bg-accent/20",
        day.isFertile && !day.isOvulation && "!bg-success/20",
        day.isToday && "border border-primary font-bold"
      )}
      onClick={handleClick}
    >
      {day.number}
    </div>
  );
}

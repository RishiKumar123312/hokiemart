// A small centered label marking the start of a new day's worth of messages
// -- "Today", "Yesterday", a weekday name, or a full date, depending how
// long ago it was (see dayLabel in lib/time.ts for exactly which).
export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-3">
      <span className="label-caps">{label}</span>
    </div>
  );
}

// Two ready-made things people often need to say while arranging a meetup,
// sitting right above the composer so they're one tap away instead of
// having to type them out. In this prototype, tapping a chip sends its text
// immediately -- there's no in-between "drafted but not sent" state.
const QUICK_ACTIONS = [
  { label: "Propose a spot", message: "Want to meet at Squires around 5?" },
  { label: "Still available?", message: "Still available?" },
] as const;

export function QuickActionChips({ onSend }: { onSend: (message: string) => void }) {
  return (
    <div className="flex gap-2 border-t border-rule bg-paper px-5 py-2.5">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => onSend(action.message)}
          className="label-caps min-h-9 cursor-pointer border border-rule px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

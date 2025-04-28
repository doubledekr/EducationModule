interface StreakCounterProps {
  streakDays: number;
}

export default function StreakCounter({ streakDays }: StreakCounterProps) {
  return (
    <div className="flex items-center bg-neutral-100 rounded-full px-2 py-1">
      <span className="material-icons text-accent text-sm">local_fire_department</span>
      <span className="text-xs font-bold ml-1">{streakDays}</span>
    </div>
  );
}

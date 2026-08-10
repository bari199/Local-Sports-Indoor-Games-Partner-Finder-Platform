const PlayerSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-slate-200" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

        <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
};

export default PlayerSkeleton;
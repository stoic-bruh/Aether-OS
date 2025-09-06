export default function SkeletonCard() {
  return (
    <div className="card-container p-4 space-y-3">
      <div className="h-5 w-3/4 rounded-md bg-neutral-800 animate-pulse"></div>
      <div className="h-4 w-1/2 rounded-md bg-neutral-800 animate-pulse"></div>
      <div className="h-4 w-5/6 rounded-md bg-neutral-800 animate-pulse"></div>
    </div>
  );
}

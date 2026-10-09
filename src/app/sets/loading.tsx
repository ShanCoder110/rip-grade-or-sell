export default function SetsLoading() {
  return (
    <div className="page" aria-busy="true" aria-live="polite">
      <div className="skeleton h-9 w-32" />
      <div className="skeleton mt-3 h-4 w-80" />
      <div className="mt-8 space-y-2">
        <div className="skeleton h-14 w-full" />
        <div className="skeleton h-14 w-full" />
      </div>
    </div>
  );
}

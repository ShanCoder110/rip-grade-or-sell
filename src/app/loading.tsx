export default function Loading() {
  return (
    <div className="page" aria-busy="true" aria-live="polite">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton mt-4 h-4 w-full max-w-xl" />
      <div className="skeleton mt-8 h-40 w-full" />
    </div>
  );
}

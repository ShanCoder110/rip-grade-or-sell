export default function SetLoading() {
  return (
    <div className="page" aria-busy="true" aria-live="polite">
      <div className="skeleton h-4 w-40" />
      <div className="skeleton mt-4 h-10 w-2/3" />
      <div className="skeleton mt-8 h-48 w-full" />
    </div>
  );
}
export function DemoLocalBanner() {
  return (
    <p className="mt-2 rounded-xl border border-dashed border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
      Demo mode: data is saved in this browser only (localStorage). It is not synced to an account.
    </p>
  );
}

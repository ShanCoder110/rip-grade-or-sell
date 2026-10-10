import { readDemoCollection, writeDemoCollection } from "@/lib/demo-data/storage";

export type DemoAlertRule = {
  id: string;
  label: string;
  thresholdCents: number;
  createdAt: string;
};

const COLLECTION = "alerts";

export function listDemoAlerts(demoId: string): DemoAlertRule[] {
  return readDemoCollection<DemoAlertRule[]>(demoId, COLLECTION, []);
}

function saveAlerts(demoId: string, rules: DemoAlertRule[]): DemoAlertRule[] {
  writeDemoCollection(demoId, COLLECTION, rules);
  return rules;
}

export function addDemoAlert(
  demoId: string,
  input: { label: string; thresholdCents: number },
): DemoAlertRule[] {
  const rule: DemoAlertRule = {
    id: crypto.randomUUID(),
    label: input.label.trim(),
    thresholdCents: input.thresholdCents,
    createdAt: new Date().toISOString(),
  };
  return saveAlerts(demoId, [rule, ...listDemoAlerts(demoId)]);
}

export function updateDemoAlert(
  demoId: string,
  id: string,
  patch: { label?: string; thresholdCents?: number },
): DemoAlertRule[] {
  const rules = listDemoAlerts(demoId);
  const index = rules.findIndex((r) => r.id === id);
  if (index < 0) return rules;

  const current = rules[index]!;
  const label = patch.label?.trim() || current.label;
  const thresholdCents = patch.thresholdCents ?? current.thresholdCents;
  if (!label || !Number.isFinite(thresholdCents) || thresholdCents <= 0) return rules;

  const updated = rules.map((r) =>
    r.id === id ? { ...r, label, thresholdCents } : r,
  );
  return saveAlerts(demoId, updated);
}

export function removeDemoAlert(demoId: string, id: string): DemoAlertRule[] {
  return saveAlerts(
    demoId,
    listDemoAlerts(demoId).filter((r) => r.id !== id),
  );
}

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
  const updated = [rule, ...listDemoAlerts(demoId)];
  writeDemoCollection(demoId, COLLECTION, updated);
  return updated;
}

export function removeDemoAlert(demoId: string, id: string): DemoAlertRule[] {
  const updated = listDemoAlerts(demoId).filter((r) => r.id !== id);
  writeDemoCollection(demoId, COLLECTION, updated);
  return updated;
}

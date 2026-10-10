"use client";

import { sanitizeDollarInput } from "@/lib/money-input";

type Props = {
  id?: string;
  label: string;
  placeholder: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
};

export function MoneyInput({ id, label, placeholder, hint, value, onChange }: Props) {
  return (
    <label className="field" htmlFor={id}>
      {label}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        enterKeyHint="done"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(sanitizeDollarInput(e.target.value))}
      />
      {hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

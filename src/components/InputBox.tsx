"use client";

import type { InputHTMLAttributes } from "react";

type InputBoxProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  helper?: string;
};

export default function InputBox({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helper,
}: InputBoxProps) {
  return (
    <label className="block space-y-2">
      <span className="text-xs uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-black/40 px-4 py-3 font-mono text-base text-foreground shadow-[0_0_12px_rgba(0,0,0,0.5)] outline-none transition focus:border-accent/70 focus:ring-2 focus:ring-accent/30"
      />
      {helper ? <p className="text-xs text-muted">{helper}</p> : null}
    </label>
  );
}

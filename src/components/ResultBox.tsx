"use client";

type ResultBoxProps = {
  status: "success" | "error" | "info";
  message: string;
};

const statusStyles = {
  success: "border-accent/60 text-accent",
  error: "border-danger/60 text-danger",
  info: "border-accent-2/60 text-accent-2",
};

export default function ResultBox({ status, message }: ResultBoxProps) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm font-medium ${
        statusStyles[status]
      }`}
    >
      {message}
    </div>
  );
}

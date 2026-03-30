"use client";

type ConfirmModalProps = {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmPopup({
  message,
  confirmLabel = "Yes",
  cancelLabel = "Back",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div className="card" style={{ maxWidth: 340, textAlign: "center" }}>
        <p style={{ marginBottom: "1.25rem", fontSize: "1.05rem" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="secondaryButton" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="dangerButton" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

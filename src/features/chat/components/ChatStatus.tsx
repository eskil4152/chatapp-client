type ChatStatusProps = {
  status: "CONNECTING" | "JOINING" | "READY" | "ERROR";
  error: string;
};

export default function ChatStatus({ status, error }: ChatStatusProps) {
  if (status === "READY" && !error) return null;

  return (
    <div className="statusBox">
      {error ? (
        <p>{error}</p>
      ) : (
        <p>{status === "CONNECTING" ? "Connecting..." : "Joining..."}</p>
      )}
    </div>
  );
}

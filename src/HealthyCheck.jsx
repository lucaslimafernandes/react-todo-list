import { useEffect, useMemo, useRef, useState } from "react";

export function HealthCheckButton({
  url = "http://localhost:8000/health",
  intervalMs = 10000,
  timeoutMs = 4000,
}) {
  const [status, setStatus] = useState("unknown");
  const [latencyMs, setLatencyMs] = useState(null);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const inFlightRef = useRef(false);

  const statusStyle = useMemo(() => {
    switch (status) {
      case "healthy":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "unhealthy":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  }, [status]);

  async function checkNow() {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsChecking(true);
    const started = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: { "Accept": "application/json, text/plain, */*" },
      });

      const elapsed = Math.round(performance.now() - started);
      setLatencyMs(elapsed);
      setLastCheckedAt(new Date());

      if (res.ok) {
        setStatus("healthy");
      } else {
        setStatus("unhealthy");
      }
    } catch (err) {
      setStatus("unhealthy");
      setLatencyMs(null);
      setLastCheckedAt(new Date());
    } finally {
      clearTimeout(timeoutId);
      inFlightRef.current = false;
      setIsChecking(false);
    }
  }

  useEffect(() => {
    checkNow();
    const id = setInterval(() => {
      if (!inFlightRef.current) {
        checkNow();
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [url, intervalMs, timeoutMs]);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={checkNow}
        disabled={isChecking}
        className={`px-4 py-2 rounded-2xl shadow-sm transition ${statusStyle} disabled:opacity-60`}
        aria-live="polite"
        title={status === "healthy" ? "Status: healthy" : status === "unhealthy" ? "Status: unhealthy" : "Status: unknown"}
      >
        {isChecking ? "checando..." : status === "healthy" ? "status: healthy" : status === "unhealthy" ? "status: unhealthy" : "status: unknown"}
      </button>

      <div className="text-sm text-gray-700">
        <div>
          <strong>Endpoint:</strong> <code className="bg-gray-100 px-1 rounded">{url}</code>
        </div>
        <div className="mt-0.5">
          <strong>Intervalo:</strong> {Math.round(intervalMs / 1000)}s
        </div>
        <div className="mt-0.5">
          <strong>Latency:</strong> {latencyMs !== null ? `${latencyMs} ms` : "—"}
        </div>
        <div className="mt-0.5">
          <strong>Última checagem:</strong> {lastCheckedAt ? lastCheckedAt.toLocaleTimeString() : "—"}
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Global error boundary — the last resort if the root layout itself throws.
 * Must render its own <html>/<body>. Kept minimal + dependency-free so it works
 * even when everything else is broken.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f4ee",
          color: "#1a1714",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#4a453e", marginTop: "0.75rem" }}>
            Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              background: "#1b4965",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 1.25rem",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

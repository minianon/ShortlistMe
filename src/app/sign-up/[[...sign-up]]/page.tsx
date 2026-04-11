import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        background: "var(--surface)",
      }}
    >
      {/* Left brand panel */}
      <div
        className="hidden md:flex"
        style={{
          width: "45%",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem 3rem",
          background: "linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ position: "relative" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#fff",
              margin: "0 0 3rem",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              display: "block",
            }}
          >
            ShortlistMe
          </Link>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "#fff",
              margin: "0 0 1rem",
              lineHeight: 1.15,
            }}
          >
            Your resume. Supercharged.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
            Join thousands of professionals who get shortlisted faster with AI-powered portfolios.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              "Resume parsed instantly — no manual forms",
              "AI tailors your portfolio per job description",
              "Public link shareable in one click",
            ].map((f) => (
              <div key={f} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: "#fff", fontWeight: 700, marginTop: 2 }}>✓</span>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "0.9375rem" }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
        }}
      >
        <Link
          href="/"
          className="md:hidden"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "var(--primary-container)",
            marginBottom: "1.5rem",
            textDecoration: "none",
          }}
        >
          ShortlistMe
        </Link>

        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              color: "var(--on-surface)",
              margin: "0 0 0.5rem",
            }}
          >
            Create your account
          </h2>
          <p style={{ margin: "0 0 2rem", color: "var(--on-surface-variant)", fontSize: "0.9375rem" }}>
            Free forever. No credit card required.
          </p>

          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#178163",
                colorBackground: "#ffffff",
                colorInputBackground: "#e0e3e5",
                fontFamily: "var(--font-body)",
                borderRadius: "0.5rem",
              },
            }}
          />
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--on-surface-variant)", textAlign: "center" }}>
          © 2026 ShortlistMe.{" "}
          <a href="#" style={{ color: "var(--on-surface-variant)" }}>Privacy</a> ·{" "}
          <a href="#" style={{ color: "var(--on-surface-variant)" }}>Terms</a>
        </p>
      </div>
    </div>
  );
}

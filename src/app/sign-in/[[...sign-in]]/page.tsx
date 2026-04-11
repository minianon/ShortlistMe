import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
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
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <div style={{ position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#fff",
              margin: "0 0 3rem",
              letterSpacing: "-0.02em",
            }}
          >
            ShortlistMe
          </p>

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
            Elevate your selection process
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
            Upload your resume once and get a stunning, AI-powered portfolio that gets you shortlisted.
          </p>

          {/* Testimonial */}
          <div
            style={{
              marginTop: "3rem",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "1rem",
              padding: "1.25rem",
              backdropFilter: "blur(8px)",
            }}
          >
            <p style={{ margin: "0 0 0.75rem", color: "#fff", fontSize: "0.9375rem", lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;I got 3× more interview callbacks after switching to ShortlistMe.&rdquo;
            </p>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              — Alex Rivera, Product Designer
            </p>
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
        {/* Mobile logo */}
        <p
          className="md:hidden"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "var(--primary-container)",
            marginBottom: "1.5rem",
          }}
        >
          ShortlistMe
        </p>

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
            Welcome back
          </h2>
          <p style={{ margin: "0 0 2rem", color: "var(--on-surface-variant)", fontSize: "0.9375rem" }}>
            Please enter your details to sign in.
          </p>

          <SignIn
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

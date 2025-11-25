// src/pages/auth/LoginPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, BadgeCheck, LockKeyhole } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const loginPageStyles = `
  :root {
    --bg-body: #020617;
    --bg-card: #020617;
    --bg-card-soft: #020617;
    --border-soft: rgba(148, 163, 184, 0.3);
    --accent: #6366f1;
    --accent-soft: rgba(99, 102, 241, 0.12);
    --accent-strong: rgba(129, 140, 248, 0.16);
    --text-main: #e5e7eb;
    --text-muted: #9ca3af;
    --text-subtle: #6b7280;
    --text-strong: #f9fafb;
    --radius-lg: 18px;
    --radius-md: 12px;
    --shadow-soft: 0 24px 80px rgba(15, 23, 42, 0.85);
    --shadow-subtle: 0 18px 60px rgba(15, 23, 42, 0.7);
    --input-bg: rgba(15, 23, 42, 0.9);
  }

  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background: radial-gradient(circle at top, #1f2937 0, #020617 50%, #000 100%);
    color: var(--text-main);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
      "Segoe UI", sans-serif;
  }

  .auth-shell {
    width: 100%;
    max-width: 1040px;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 32px;
    border-radius: 28px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(148, 163, 184, 0.25);
    box-shadow: var(--shadow-soft);
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .auth-shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .auth-aside {
      display: none;
    }
  }

  .auth-card {
    padding: 32px 32px 28px;
    background: radial-gradient(circle at top left, #020617 0, #020617 45%);
  }

  @media (min-width: 1024px) {
    .auth-card {
      padding: 40px 40px 32px;
    }
  }

  .auth-logo-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .auth-logo-badge {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    background: linear-gradient(135deg, #f97316, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 35px rgba(30, 64, 175, 0.6);
  }

  .auth-logo-icon {
    font-size: 22px;
  }

  .auth-logo-sub {
    font-size: 11px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 2px;
  }

  .auth-logo-title {
    font-size: 26px;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: var(--text-strong);
    margin: 0;
  }

  @media (min-width: 768px) {
    .auth-logo-title {
      font-size: 30px;
    }
  }

  .auth-subtitle {
    margin: 6px 0 24px;
    font-size: 13px;
    color: var(--text-subtle);
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .auth-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #9ca3af;
  }

  .auth-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .auth-input-icon {
    position: absolute;
    left: 10px;
    color: #6b7280;
  }

  .auth-input {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--border-soft);
    background: var(--input-bg);
    padding: 9px 12px 9px 32px;
    font-size: 13px;
    color: var(--text-strong);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease,
      background 0.15s ease;
  }

  .auth-input::placeholder {
    color: #6b7280;
  }

  .auth-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4);
    background: #020617;
  }

  .auth-password-toggle {
    position: absolute;
    right: 9px;
    border: none;
    background: transparent;
    padding: 4px;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .auth-password-toggle:hover {
    background: rgba(148, 163, 184, 0.1);
    color: var(--accent);
  }

  .auth-row-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
  }

  @media (max-width: 480px) {
    .auth-row-between {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .auth-remember {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .auth-remember input {
    width: 14px;
    height: 14px;
    accent-color: var(--accent);
  }

  .auth-submit-btn {
    margin-top: 8px;
    width: 100%;
    border-radius: 999px;
    border: none;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 14px 40px rgba(55, 48, 163, 0.75);
    transition: transform 0.12s ease, box-shadow 0.12s ease,
      filter 0.12s ease, opacity 0.12s ease;
  }

  .auth-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow: 0 18px 55px rgba(55, 48, 163, 0.9);
  }

  .auth-submit-btn:disabled {
    opacity: 0.65;
    cursor: default;
    box-shadow: none;
  }

  .auth-spinner {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid rgba(248, 250, 252, 0.4);
    border-top-color: white;
    animation: auth-spin 0.7s linear infinite;
  }

  @keyframes auth-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .auth-link,
  .auth-link-ghost {
    font-size: 12px;
    color: var(--accent);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
  }

  .auth-link:hover,
  .auth-link-ghost:hover {
    text-decoration: underline;
  }

  .auth-link-ghost {
    color: #c4b5fd;
  }

  .auth-footer-text {
    margin-top: 10px;
    font-size: 12px;
    text-align: center;
    color: var(--text-subtle);
  }

  .auth-error {
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 11px;
    color: #fecaca;
    border: 1px solid rgba(248, 113, 113, 0.4);
    background: rgba(248, 113, 113, 0.12);
  }

  .auth-aside {
    position: relative;
    padding: 28px 30px;
    background: radial-gradient(circle at top right, #4f46e5 0, #020617 55%);
    border-left: 1px solid rgba(148, 163, 184, 0.4);
    box-shadow: var(--shadow-subtle);
  }

  @media (min-width: 1024px) {
    .auth-aside {
      padding: 34px 36px;
    }
  }

  .auth-aside-content {
    position: relative;
    z-index: 1;
  }

  .auth-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(191, 219, 254, 0.3);
    color: #e0f2fe;
  }

  .auth-aside-title {
    margin: 16px 0 6px;
    font-size: 20px;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: #f9fafb;
  }

  .auth-aside-subtitle {
    margin: 0 0 18px;
    font-size: 13px;
    color: #e5e7eb;
  }

  .auth-feature-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .auth-feature-list li {
    display: flex;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.35);
    backdrop-filter: blur(14px);
  }

  .auth-feature-list svg {
    margin-top: 4px;
    color: #a5b4fc;
  }

  .auth-feature-title {
    margin: 0;
    font-size: 13px;
    color: #e5e7eb;
  }

  .auth-feature-desc {
    margin: 2px 0 0;
    font-size: 12px;
    color: #cbd5f5;
  }

  .auth-aside-footnote {
    margin-top: 18px;
    font-size: 11px;
    color: #e5e7eb;
    opacity: 0.9;
  }

  .auth-aside-footnote span {
    color: #e0f2fe;
    font-weight: 500;
  }
`;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* inject CSS sekali di halaman ini */}
      <style>{loginPageStyles}</style>

      <div className="auth-page">
        <div className="auth-shell">
          {/* Kiri: form login */}
          <div className="auth-card">
            <div className="auth-logo-row">
              <div className="auth-logo-badge">
                <span className="auth-logo-icon">⚡</span>
              </div>
              <div>
                <p className="auth-logo-sub">Blockchain Bootcamp</p>
                <h1 className="auth-logo-title">Sign in to Bootcamp</h1>
              </div>
            </div>

            <p className="auth-subtitle">
              Access your blockchain-enabled courses and on-chain certificates.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p className="auth-error">{error}</p>}

              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <div className="auth-input-wrap">
                  <Mail className="auth-input-icon" size={16} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock className="auth-input-icon" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-row-between">
                <label className="auth-remember">
                  <input type="checkbox" defaultChecked />
                  <span>Keep me signed in on this device</span>
                </label>
                <button type="button" className="auth-link-ghost">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="auth-spinner" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <p className="auth-footer-text">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="auth-link">
                  Register
                </Link>
              </p>
            </form>
          </div>

          {/* Kanan: highlight */}
          <div className="auth-aside">
            <div className="auth-aside-content">
              <p className="auth-badge">Blockchain ready</p>
              <h2 className="auth-aside-title">
                Verifiable certificates, directly on-chain.
              </h2>
              <p className="auth-aside-subtitle">
                Every course completion can be minted as a certificate to your
                blockchain wallet. Portable, tamper-proof, and easy to verify.
              </p>

              <ul className="auth-feature-list">
                <li>
                  <ShieldCheck size={18} />
                  <div>
                    <p className="auth-feature-title">
                      Own your learning record
                    </p>
                    <p className="auth-feature-desc">
                      Certificates are issued to your address, not locked in our
                      database.
                    </p>
                  </div>
                </li>
                <li>
                  <BadgeCheck size={18} />
                  <div>
                    <p className="auth-feature-title">
                      Instant certificate verification
                    </p>
                    <p className="auth-feature-desc">
                      Recruiters and partners can verify with a single hash.
                    </p>
                  </div>
                </li>
                <li>
                  <LockKeyhole size={18} />
                  <div>
                    <p className="auth-feature-title">Secure by design</p>
                    <p className="auth-feature-desc">
                      Backed by smart contracts and auditable transactions.
                    </p>
                  </div>
                </li>
              </ul>

              <p className="auth-aside-footnote">
                Powered by <span>Quiz-Chain Certificate Registry</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

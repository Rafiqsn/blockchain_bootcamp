// src/pages/auth/RegisterPage.tsx
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../hooks/useAuth";


const registerPageStyles = `
  .register-root {
    width: 100%;
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 40px;
    box-sizing: border-box;
  }

  .register-shell {
    width: 100%;
    max-width: 1120px;
    border-radius: 28px;
    padding: 1px;
    background-image: linear-gradient(135deg, #4f46e5, #8b5cf6, #22d3ee);
    box-shadow:
      0 32px 80px rgba(15, 23, 42, 0.9),
      0 0 0 1px rgba(15, 23, 42, 0.9);
  }

  .register-card {
    border-radius: 26px;
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2.6fr);
    overflow: hidden;
    background: radial-gradient(circle at top left, #020617 0, #020617 40%, #020617 100%);
  }

  @media (max-width: 900px) {
    .register-card {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  /* LEFT: FORM */
  .register-left {
    background: radial-gradient(circle at top left, #020617 0, #020617 60%, #020617 100%);
    padding: 36px 40px 32px;
    color: #e5e7eb;
  }

  .register-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .register-logo-icon {
    height: 32px;
    width: 32px;
    border-radius: 14px;
    background: radial-gradient(circle at 30% 0%, #f97316 0, #f97316 35%, #0ea5e9 70%, #4f46e5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f9fafb;
    font-weight: 700;
    font-size: 18px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.9);
  }

  .register-logo-text {
    display: flex;
    flex-direction: column;
  }

  .register-badge {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #9ca3af;
  }

  .register-title {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: #f9fafb;
  }

  .register-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin-bottom: 22px;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .register-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .register-label {
    font-size: 11px;
    font-weight: 500;
    color: #d1d5db;
  }

  .register-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    border-radius: 12px;
    background: radial-gradient(circle at top left, #020617 0, #020617 60%, #020617 100%);
    border: 1px solid rgba(55, 65, 81, 0.9);
    box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.05);
  }

  .register-input-wrap:focus-within {
    border-color: rgba(129, 140, 248, 0.9);
    box-shadow:
      0 0 0 1px rgba(129, 140, 248, 0.7),
      0 12px 35px rgba(17, 24, 39, 1);
  }

  .register-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #f9fafb;
    font-size: 13px;
  }

  .register-input::placeholder {
    color: #6b7280;
  }

  .register-icon {
    font-size: 14px;
    color: #6b7280;
  }

  .register-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }

  .register-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #9ca3af;
    cursor: pointer;
  }

  .register-checkbox {
    width: 13px;
    height: 13px;
    border-radius: 4px;
    border: 1px solid #4b5563;
    accent-color: #6366f1;
  }

  .register-small-link {
    font-size: 11px;
    color: #a5b4fc;
    text-decoration: none;
  }

  .register-small-link:hover {
    color: #c7d2fe;
    text-decoration: underline;
  }

  .register-error {
    font-size: 11px;
    border-radius: 10px;
    border: 1px solid rgba(248, 113, 113, 0.8);
    background: rgba(127, 29, 29, 0.7);
    color: #fee2e2;
    padding: 6px 10px;
  }

  .register-button {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    border: none;
    border-radius: 999px;
    padding: 10px 16px;
    background: linear-gradient(90deg, #4f46e5, #8b5cf6, #22d3ee);
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow:
      0 18px 40px rgba(88, 28, 135, 0.8),
      0 0 0 1px rgba(37, 99, 235, 0.4);
    transition: transform 0.12s ease-out, box-shadow 0.12s ease-out,
      filter 0.12s ease-out;
  }

  .register-button:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
    box-shadow:
      0 22px 55px rgba(88, 28, 135, 0.9),
      0 0 0 1px rgba(129, 140, 248, 0.7);
  }

  .register-button:active {
    transform: translateY(0);
    box-shadow:
      0 14px 30px rgba(15, 23, 42, 0.9),
      0 0 0 1px rgba(37, 99, 235, 0.5);
  }

  .register-button:disabled {
    opacity: 0.65;
    cursor: default;
    box-shadow:
      0 14px 30px rgba(15, 23, 42, 0.8),
      0 0 0 1px rgba(55, 65, 81, 0.8);
  }

  .register-button-glow {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #facc15;
    box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.35);
  }

  .register-footer-text {
    margin-top: 12px;
    font-size: 11px;
    color: #9ca3af;
    text-align: center;
  }

  .register-footer-text a {
    color: #a5b4fc;
    text-decoration: none;
    font-weight: 500;
  }

  .register-footer-text a:hover {
    color: #c7d2fe;
    text-decoration: underline;
  }

  /* RIGHT: INFO */
  .register-right {
    padding: 32px 34px 30px;
    background: radial-gradient(circle at top, #4c1d95 0, #312e81 40%, #020617 100%);
    color: #e5e7eb;
    border-left: 1px solid rgba(129, 140, 248, 0.35);
    position: relative;
    overflow: hidden;
  }

  .register-right-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(129, 140, 248, 0.5);
    margin-bottom: 14px;
  }

  .register-right-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .register-right-subtitle {
    font-size: 12px;
    color: #c7d2fe;
    margin-bottom: 18px;
  }

  .register-feature-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .register-feature-card {
    border-radius: 14px;
    padding: 11px 12px;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.4);
    display: flex;
    gap: 10px;
  }

  .register-feature-icon {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background: radial-gradient(circle at 30% 0%, #22c55e 0, #16a34a 40%, #22c55e 80%);
    box-shadow: 0 10px 24px rgba(34, 197, 94, 0.65);
    flex-shrink: 0;
  }

  .register-feature-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .register-feature-title {
    font-size: 12px;
    font-weight: 600;
    color: #e5e7eb;
  }

  .register-feature-desc {
    font-size: 11px;
    color: #cbd5f5;
  }

  .register-right-footer {
    margin-top: 18px;
    font-size: 10px;
    color: #9ca3af;
  }

  .register-right-footer span {
    color: #c4b5fd;
  }

  @media (max-width: 900px) {
    .register-right {
      border-left: none;
      border-top: 1px solid rgba(55, 65, 81, 0.9);
    }
  }
`;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Password confirmation doesn't match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout  title="Create your account"
    subtitle="Enroll in courses and mint verifiable certificates directly to your blockchain wallet."
  >
      {/* inject page-specific CSS */}
      <style>{registerPageStyles}</style>

      <div className="register-root">
        <div className="register-shell">
          <div className="register-card">
            {/* LEFT: FORM */}
            <section className="register-left">
              <div className="register-logo-row">
                <div className="register-logo-icon">⚡</div>
                <div className="register-logo-text">
                  <span className="register-badge">BLOCKCHAIN BOOTCAMP</span>
                  <span className="register-title">Create your account</span>
                </div>
              </div>

              <p className="register-subtitle">
                Enroll in courses and mint verifiable certificates directly to your
                blockchain wallet.
              </p>

              <form className="register-form" onSubmit={handleSubmit}>
                {error && <p className="register-error">{error}</p>}

                <div className="register-field">
                  <label className="register-label">Username</label>
                  <div className="register-input-wrap">
                    <span className="register-icon">👤</span>
                    <input
                      className="register-input"
                      placeholder="bootcamp-ninja"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="register-field">
                  <label className="register-label">Email address</label>
                  <div className="register-input-wrap">
                    <span className="register-icon">📧</span>
                    <input
                      type="email"
                      className="register-input"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="register-field">
                  <label className="register-label">Password</label>
                  <div className="register-input-wrap">
                    <span className="register-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="register-input"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="register-small-link"
                      style={{ border: "none", background: "transparent", padding: 0 }}
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="register-field">
                  <label className="register-label">Confirm password</label>
                  <div className="register-input-wrap">
                    <span className="register-icon">✅</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="register-input"
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="register-meta-row">
                  <label className="register-checkbox-label">
                    <input
                      type="checkbox"
                      className="register-checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    I agree to the quiz & certificate terms.
                  </label>
                </div>

                <button type="submit" disabled={loading} className="register-button">
                  <span className="register-button-glow" />
                  <span>{loading ? "Creating account..." : "Create account"}</span>
                </button>

                <p className="register-footer-text">
                  Already have an account?{" "}
                  <Link to="/login">Sign in</Link>
                </p>
              </form>
            </section>

            {/* RIGHT: INFO */}
            <section className="register-right">
              <div className="register-right-badge">
                <span>●</span>
                <span>WHY REGISTER</span>
              </div>

              <h2 className="register-right-title">
                Your learning, secured on-chain from day one.
              </h2>
              <p className="register-right-subtitle">
                Register once, then every completed module can be minted as a
                verifiable NFT-style certificate.
              </p>

              <div className="register-feature-list">
                <div className="register-feature-card">
                  <div className="register-feature-icon">🎓</div>
                  <div className="register-feature-main">
                    <div className="register-feature-title">
                      Track progress across all bootcamps
                    </div>
                    <div className="register-feature-desc">
                      See courses, chapters, and on-chain certificates in a single
                      dashboard.
                    </div>
                  </div>
                </div>

                <div className="register-feature-card">
                  <div className="register-feature-icon">🧱</div>
                  <div className="register-feature-main">
                    <div className="register-feature-title">
                      Ready for blockchain verification
                    </div>
                    <div className="register-feature-desc">
                      Each certificate links to a smart contract entry that anyone can
                      verify.
                    </div>
                  </div>
                </div>

                <div className="register-feature-card">
                  <div className="register-feature-icon">🌐</div>
                  <div className="register-feature-main">
                    <div className="register-feature-title">
                      Use with your existing wallet
                    </div>
                    <div className="register-feature-desc">
                      Connect your wallet later to claim certificates without losing
                      history.
                    </div>
                  </div>
                </div>
              </div>

              <div className="register-right-footer">
                Powered by <span>Quiz-Chain Certificate Registry</span>.
              </div>
            </section>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

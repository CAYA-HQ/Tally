import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import "../styles/pages/VerifyCode.css";

const CODE_LENGTH = 6;

export default function VerifyPage() {
  const [digits, setDigits]     = useState(Array(CODE_LENGTH).fill(""));
  const [status, setStatus]     = useState("idle"); // idle | success
  const [cooldown, setCooldown] = useState(0);
  const [toast, setToast]       = useState({ msg: "", icon: null, show: false });
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── Toast helper ───────────────────────────────────────────────
  function showToast(msg, icon = null) {
    setToast({ msg, icon, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2800);
  }

  // ── Input handlers ─────────────────────────────────────────────
  function handleChange(i, val) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    setStatus("idle");
    if (char && i < CODE_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft"  && i > 0)               inputRefs.current[i - 1]?.focus();
    else if   (e.key === "ArrowRight" && i < CODE_LENGTH - 1)  inputRefs.current[i + 1]?.focus();
  }

//   function handlePaste(e) {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
//     const next = [...digits];
//     pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
//     setDigits(next);
//     inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
//   }

  // ── Ripple effect ──────────────────────────────────────────────
  function addRipple(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x    = e.clientX - rect.left  - size / 2;
    const y    = e.clientY - rect.top   - size / 2;
    const el   = document.createElement("span");
    el.className = "ripple";
    el.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  // ── Verify handler ─────────────────────────────────────────────
  function handleVerify(e) {
    addRipple(e);
    const code = digits.join("");

    if (code.length < CODE_LENGTH) {
      digits.forEach((d, i) => {
        if (!d) {
          const el = inputRefs.current[i];
          el?.classList.add("shake");
          setTimeout(() => el?.classList.remove("shake"), 400);
        }
      });
      showToast("Please fill in all 6 digits", <MdErrorOutline size={16} />);
      return;
    }

    setStatus("success");
    showToast("Code verified successfully!", <BsCheckCircleFill size={14} />);
  }

  // ── Resend handler ─────────────────────────────────────────────
  function handleResend(e) {
    e.preventDefault();
    if (cooldown > 0) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setStatus("idle");
    setCooldown(30);
    showToast("A new code has been sent to your email", <RiSendPlaneLine size={15} />);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="vc-root">

      <div className="vc-card">

        {/* Email icon badge */}
        <div className="vc-icon-badge">
          <MdEmail size={30} />
        </div>

        <h1 className="vc-title">Verify Code</h1>
        <p className="vc-subtitle">
          Please enter the 6-digit code we sent to your email.
        </p>

        {/* OTP digit inputs */}
        <div className="vc-inputs">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => (inputRefs.current[i] = el)}
              className={`vc-input${d ? " filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              // onPaste={handlePaste}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          className={`vc-btn${status === "success" ? " success" : ""}`}
          onClick={handleVerify}
        >
          {status === "success" ? (
            <>
              <IoShieldCheckmark size={18} />
              Verified!
            </>
          ) : (
            <>
              <IoShieldCheckmark size={18} />
              Verify Now
            </>
          )}
        </button>

        {/* Resend row */}
        <p className={`vc-resend${cooldown > 0 ? " cooldown" : ""}`}>
          <RiSendPlaneLine size={13} />
          Didn&apos;t get the code?&nbsp;
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : <a onClick={handleResend}>Resend code</a>
          }
        </p>
      </div>

      {/* Toast notification */}
      <div className={`vc-toast${toast.show ? " show" : ""}`}>
        {toast.icon}
        {toast.msg}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Bot, X } from "lucide-react";
import api from "../utils/axios";
import { addUser } from "../store/userSlice";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PremiumModal = ({ isOpen, onClose }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your connection.");
      }

      const orderRes = await api.post("/payment/create-order");
      const { orderId, amount, currency, keyId, isMock } = orderRes.data;

      if (isMock) {
        const verifyRes = await api.post("/payment/verify", {
          razorpay_order_id: orderId,
          razorpay_payment_id: "pay_test_" + Date.now(),
          razorpay_signature: "sig_test",
        });

        dispatch(addUser(verifyRes.data.user));
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: "SkillSync",
        description: "SkillSync Pro Membership",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            dispatch(addUser(verifyRes.data.user));
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              onClose();
            }, 1500);
          } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName || ""}`.trim(),
          email: user.emailId,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        setError(response.error?.description || "Payment failed");
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl shadow-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">SkillSync Pro</h3>
            <p className="text-xs text-white/60">Unlock Premium Developer Capabilities</p>
          </div>
        </div>

        {success ? (
          <div className="my-8 py-8 text-center bg-success/10 border border-success/30 rounded-2xl">
            <CheckCircle2 size={48} className="mx-auto text-success mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-success">Payment Verified!</h4>
            <p className="text-sm text-white/70 mt-1">Welcome to SkillSync Pro Membership.</p>
          </div>
        ) : (
          <>
            <div className="my-6 p-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 rounded-2xl border border-indigo-500/20 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white">₹99</span>
                <span className="text-xs text-white/60 ml-2">Lifetime Access</span>
              </div>
              <span className="badge badge-warning text-[10px] font-black uppercase text-black">
                One-Time Pass
              </span>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-3 text-white/90">
                <ShieldCheck size={18} className="text-amber-400 shrink-0" />
                <span>Verified Pro Developer Badge on Feed & Profile</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Zap size={18} className="text-indigo-400 shrink-0" />
                <span>Priority Feed Ranking to discover matches faster</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Bot size={18} className="text-emerald-400 shrink-0" />
                <span>Unlimited Gemini 3.8 Flash @ai In-Chat Mentorship</span>
              </div>
            </div>

            {error && (
              <div className="alert alert-error text-xs py-2 px-3 mb-4 rounded-xl">
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full btn animated-gradient-btn border-0 text-white font-bold text-base py-3 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing Order...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Pay with Razorpay
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-white/40 mt-3">
              Secured with HMAC-SHA256 Cryptographic Verification
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumModal;

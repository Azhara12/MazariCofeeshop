import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  MapPin,
  CreditCard,
  Banknote,
  Coffee,
  Clock,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import Modal from "../ui/Modal";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { generateOrderId } from "../../utils/helpers";
import Button from "../ui/Button";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { orderAPI } from "../../services/api";

const CheckoutModal = ({ isOpen, onClose, setActiveTab }) => {
  const {
    cart,
    clearCart,
    subtotal,
    shippingFee,
    taxAmount,
    discountAmount,
    totalPrice,
  } = useCart();
  const { user, logout } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    deliveryMethod: "Home Delivery",
    address: "",
    city: "",
    instructions: "",
    paymentMethod: "Credit/Debit Card",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsProcessing(true);
      setPaymentError(null);

      try {
        const generatedId = generateOrderId();
        const orderData = {
          orderId: generatedId,
          customerDetails: {
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          orderItems: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.customization?.size,
            milk: item.customization?.milk,
            extraShots: item.customization?.extraShots,
            image: item.image,
          })),
          deliveryMethod: formData.deliveryMethod,
          deliveryAddress: {
            address: formData.address,
            city: formData.city,
            instructions: formData.instructions,
          },
          paymentMethod:
            formData.paymentMethod === "Credit/Debit Card" ? "Card" : "COD",
          pricing: {
            subtotal,
            tax: taxAmount,
            shippingFee,
            discount: discountAmount,
            totalAmount: totalPrice,
          },
        };

        if (formData.paymentMethod === "Credit/Debit Card") {
          if (!stripe || !elements) {
            throw new Error("Stripe is not initialized");
          }

          const { data } = await orderAPI.createPaymentIntent(totalPrice);
          const clientSecret = data.clientSecret;

          const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: formData.name,
                email: formData.email,
              },
            },
          });

          if (paymentResult.error) {
            throw new Error(paymentResult.error.message);
          } else {
            if (paymentResult.paymentIntent.status === "succeeded") {
              orderData.stripePaymentIntentId = paymentResult.paymentIntent.id;
              await orderAPI.createOrder(orderData);
              setOrderId(generatedId);
              setCurrentStep(4);
            }
          }
        } else {
          // Cash on Delivery
          await orderAPI.createOrder(orderData);
          setOrderId(generatedId);
          setCurrentStep(4);
        }
      } catch (err) {
        // Detect expired/invalid session (401) and handle gracefully
        const status = err.response?.status;
        if (status === 401) {
          // Clear stale auth data and force re-login
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          logout();
          setSessionExpired(true);
          setIsProcessing(false);
          return;
        }
        setPaymentError(
          err.response?.data?.message || err.message || "Payment failed"
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setPaymentError(null);
        setSessionExpired(false);
      }, 300);
    }
  }, [isOpen]);

  const handleFinishAndNavigate = () => {
    clearCart();
    onClose();
    if (setActiveTab) {
      setActiveTab("orders");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={currentStep === 4 ? handleFinishAndNavigate : onClose}
      size="lg"
      title={sessionExpired ? "Session Expired" : currentStep === 4 ? "Order Confirmed" : "Secure Checkout"}
    >
      <div className="p-6">
        {/* Session Expired Screen */}
        {sessionExpired && (
          <div className="text-center py-8 space-y-5">
            <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#3D2817] mb-2">
                Session Expired
              </h3>
              <p className="text-stone-500 text-sm max-w-xs mx-auto">
                Your login session is no longer valid. Please log in again to
                place your order — your cart items are still saved.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="w-full max-w-xs mx-auto"
            >
              Log In Again
            </Button>
          </div>
        )}

        {!sessionExpired && currentStep < 4 && (
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 -z-10" />
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  s === currentStep
                    ? "bg-[#C68B45] text-white ring-4 ring-[#C68B45]/20"
                    : s < currentStep
                    ? "bg-[#3D2817] text-white"
                    : "bg-white border-2 border-stone-200 text-stone-400"
                }`}
              >
                {s < currentStep ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-serif font-bold text-[#3D2817] mb-4">
                Customer Details
              </h3>
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
              <div className="flex justify-end pt-4">
                <Button type="submit">Continue to Delivery</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xl font-serif font-bold text-[#3D2817] mb-4">
                Delivery Options
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {["Dine-in", "Takeaway", "Home Delivery"].map((m) => (
                  <label
                    key={m}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.deliveryMethod === m
                        ? "border-[#C68B45] bg-[#C68B45]/5 text-[#C68B45]"
                        : "border-stone-200 text-stone-500 hover:border-[#C68B45]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={m}
                      checked={formData.deliveryMethod === m}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {m === "Home Delivery" ? (
                      <MapPin className="w-6 h-6" />
                    ) : m === "Takeaway" ? (
                      <ShoppingBag className="w-6 h-6" />
                    ) : (
                      <Coffee className="w-6 h-6" />
                    )}
                    <span className="text-xs font-bold text-center leading-tight">
                      {m}
                    </span>
                  </label>
                ))}
              </div>
              {formData.deliveryMethod === "Home Delivery" && (
                <div className="space-y-4 pt-2">
                  <textarea
                    name="address"
                    required
                    placeholder="Delivery Address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="input-field"
                  ></textarea>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="instructions"
                    placeholder="Special Instructions (e.g. Leave at door)"
                    value={formData.instructions}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              )}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Back
                </Button>
                <Button type="submit">Continue to Payment</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-serif font-bold text-[#3D2817] mb-4">
                Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { id: "Credit/Debit Card", icon: CreditCard },
                  { id: "Cash on Delivery", icon: Banknote },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === m.id
                        ? "border-[#C68B45] bg-[#C68B45]/5"
                        : "border-stone-200 hover:border-[#C68B45]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={formData.paymentMethod === m.id}
                      onChange={handleChange}
                      className="custom-radio"
                    />
                    <m.icon
                      className={`w-6 h-6 ${
                        formData.paymentMethod === m.id
                          ? "text-[#C68B45]"
                          : "text-stone-400"
                      }`}
                    />
                    <span className="font-semibold text-[#3D2817]">{m.id}</span>
                  </label>
                ))}
              </div>

              {formData.paymentMethod === "Credit/Debit Card" && (
                <div className="p-4 border-2 border-stone-200 rounded-xl bg-white">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#3D2817",
                          "::placeholder": { color: "#a8a29e" },
                        },
                      },
                    }}
                  />
                </div>
              )}

              {paymentError && (
                <div className="text-red-500 text-sm font-semibold p-3 bg-red-50 rounded-xl border border-red-200">
                  {paymentError}
                </div>
              )}

              <div className="bg-stone-50 p-4 rounded-xl space-y-2 text-sm border border-stone-200">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Tax (8%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between font-bold text-lg text-[#3D2817]">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isProcessing}
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={isProcessing}
                  className="flex-1 ml-4 bg-[#10B981] hover:bg-[#059669]"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Confirm Order - $${totalPrice.toFixed(2)}`}
                </Button>
              </div>
            </div>
          )}
        </form>

        {currentStep === 4 && (
          <div className="text-center py-8 space-y-6 animate-scaleIn">
            <div className="relative w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-emerald-500 check-circle"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <path d="M22 4L12 14.01l-3-3"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#3D2817] mb-2">
                Order Confirmed!
              </h2>
              <p className="text-stone-500">
                Thank you, {formData.name}. Your order has been saved to your
                account.
              </p>
            </div>

            <div className="bg-white border border-amber-900/10 p-6 rounded-2xl inline-block text-left shadow-sm w-full max-w-xs">
              <p className="text-sm text-stone-500 mb-1">Order ID</p>
              <p className="text-xl font-bold font-mono text-[#C68B45] mb-4">
                {orderId}
              </p>

              <div className="flex items-center gap-3 text-[#3D2817]">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-sm font-semibold">
                    Estimated Delivery Time
                  </p>
                  <p className="text-xs text-stone-500">20 - 25 Minutes</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button onClick={handleFinishAndNavigate} className="w-full">
                View My Orders
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CheckoutModal;
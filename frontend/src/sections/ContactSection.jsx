import React, { useState } from "react";
import Button from "../components/ui/Button";
import { useToast } from "../hooks/useToast";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import SectionTitle from "../components/cards/SectionTitle";
import { getStoreStatus } from "../utils/helpers";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storeStatus = getStoreStatus();

  // Sadiqabad, Faisal Town Exact Location
  const locationAddress = "Faisal Town, Sadiqabad, Punjab, Pakistan";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: "", email: "", message: "" });
        toast.success("Message sent! We'll get back to you shortly.");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Server error. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto bg-white transition-colors duration-300">
      <SectionTitle
        title="Get in Touch"
        subtitle="Have a question or want to book a table? We'd love to hear from you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        {/* Contact Information & Interactive Map */}
        <div className="space-y-8 animate-fadeInLeft">
          <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm transition-colors duration-300">
            <h3 className="text-2xl font-bold text-[#3D2817] mb-6 font-serif">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 shadow-sm flex items-center justify-center flex-shrink-0 text-[#C68B45]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#3D2817] ">Location</p>
                  <p className="text-sm text-stone-600 mt-0.5">
                    {locationAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 shadow-sm flex items-center justify-center flex-shrink-0 text-[#C68B45]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#3D2817] ">Email Us</p>
                  <p className="text-sm text-stone-600 mt-0.5">
                    hello@mazarics.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 shadow-sm flex items-center justify-center flex-shrink-0 text-[#C68B45]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#3D2817] ">Call Us</p>
                  <p className="text-sm text-stone-600 mt-0.5">
                    +92 (300) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-stone-200 ">
                <div className="w-10 h-10 rounded-full bg-amber-50 shadow-sm flex items-center justify-center flex-shrink-0 text-[#C68B45]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#3D2817] ">Store Hours</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        storeStatus.open
                          ? "bg-emerald-100 text-emerald-700 "
                          : "bg-red-100 text-red-700 "
                      }`}
                    >
                      {storeStatus.label}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 mt-1">
                    Mon-Fri: 8AM - 10PM
                  </p>
                  <p className="text-sm text-stone-600 ">Sat-Sun: 9AM - 11PM</p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    {storeStatus.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview with Google Directions Link */}
          <div className="rounded-[2rem] overflow-hidden shadow-sm h-[220px] relative bg-stone-200 group border border-stone-200 ">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800"
              alt="Map"
              className="w-full h-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center flex-col bg-black/10 ">
              <MapPin className="w-10 h-10 text-red-500 drop-shadow-md mb-2 animate-bounce" />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#C68B45] hover:bg-[#a87337] text-white text-xs font-bold rounded-full shadow-md transition-all transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-200 animate-fadeInRight h-fit transition-colors duration-300">
          <h3 className="text-2xl font-bold text-[#3D2817] mb-6 font-serif">
            Send a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#C68B45] transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#C68B45] transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Message
              </label>
              <textarea
                required
                rows="5"
                value={formData.message}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, message: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#C68B45] resize-none transition-colors"
                placeholder="How can we help you today?"
              ></textarea>
            </div>
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full group"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && (
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
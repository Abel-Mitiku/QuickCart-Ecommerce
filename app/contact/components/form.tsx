"use client";
import { Send } from "lucide-react";

export function ContactForm() {
  return (
    <div className="bh-white w-full">
      {/* Contact Form */}
      <div className="bg-white p-8 shadow-md flex flex-col items-center">
        <form className="w-[70%]">
          <div className="mb-6">
            <label className="block text-slate-800 mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-800 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-800 mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How can we help?"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-800 mb-2">Message</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Your message..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { sendMessage } from "@/app/actions/contact";

/* Inline SVG icons for brand logos (not available in lucide-react v1.31+) */
function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Email",
    href: "mailto:khare.parth2112@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/parthkhare12",
    icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/khare-parth12",
    icon: GitHubIcon,
  },
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await sendMessage(formData);
    
    if (result.success) {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Failed to send message.");
    }
  };

  return (
    <footer
      id="contact"
      className="relative flex h-screen w-full flex-col justify-center border-t border-white/5 pt-24"
    >
      {/* Gradient strip at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column (The Form) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-panel-bg backdrop-blur-xl border border-panel-border rounded-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Message Me</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-muted">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="bg-background/50 border border-panel-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-muted">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="bg-background/50 border border-panel-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-muted">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="How can I help you?"
                    className="bg-background/50 border border-panel-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                  />
                </div>
                
                {status === "success" && (
                  <p className="text-sm text-green-400">Message sent successfully!</p>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-400">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-accent text-background font-medium py-3 rounded-lg hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column (Existing Content) */}
          <div className="flex flex-col items-start lg:items-center lg:text-center">
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:flex lg:flex-col lg:items-center"
            >
              <p className="font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
                Get In Touch
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Let&rsquo;s Connect
              </h2>
              <p className="mt-3 max-w-md text-base text-muted text-left lg:text-center">
                Have a project in mind, want to collaborate, or just want to say
                hi? I&rsquo;d love to hear from you.
              </p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-4 lg:justify-center"
            >
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-panel-border bg-panel-bg px-5 py-3 text-sm font-medium text-foreground/70 backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:bg-panel-bg/80 hover:text-foreground hover:shadow-lg hover:shadow-accent/10 active:scale-95"
                >
                  <link.icon size={18} />
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-muted/60 sm:flex-row">
          <span className="text-center">&copy; {new Date().getFullYear()} Parth Khare</span>
          {/* <span>Built with Next.js &amp; ❤️</span> */}
        </div>
      </div>
    </footer>
  );
}

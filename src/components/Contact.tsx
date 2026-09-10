"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

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
    href: "mailto:khareparth12@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/khareparth12",
    icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/khare-parth12",
    icon: GitHubIcon,
  },
];

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative flex h-screen w-full snap-start flex-col justify-center border-t border-white/5 pt-24"
    >
      {/* Gradient strip at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
              Get In Touch
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Let&rsquo;s Connect
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-muted">
              Have a project in mind, want to collaborate, or just want to say
              hi? I&rsquo;d love to hear from you.
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex items-center gap-4"
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

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-muted/60 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Parth Khare</span>
          <span>Built with Next.js &amp; ❤️</span>
        </div>
      </div>
    </footer>
  );
}

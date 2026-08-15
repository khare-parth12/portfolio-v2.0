import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <Hero />
        <ProjectGrid />

        {/* Experience placeholder section */}
        <section
          id="experience"
          className="mx-auto max-w-6xl px-6 py-28"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Career
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Experience
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-500">
            This section is coming soon — add your work history, internships,
            and education here.
          </p>
        </section>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-400">
          <span>&copy; {new Date().getFullYear()} Parth Khare</span>
          <span>Built with Next.js &amp; ❤️</span>
        </div>
      </footer>
    </>
  );
}

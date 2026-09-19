import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-(--background) text-(--text)">
      <Navbar />

      <section
        id="home"
        className="
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          justify-center
          px-5
          py-16
          sm:px-6
          lg:px-8
        "
      >
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-(--primary)">
            FitCore Coaching
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-(--text) sm:text-5xl">
            Navbar Ready
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-(--text-secondary) sm:text-base">
            The FitCore navigation system is now connected and responsive.
          </p>
        </div>
      </section>
    </main>
  );
}
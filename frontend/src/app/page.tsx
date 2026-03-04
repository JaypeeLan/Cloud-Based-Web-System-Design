import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="page landing-page">
      <header className="landing-topbar">
        <p className="brand">LocalSpot Booker</p>
        <nav className="landing-links">
          <Link href="/discover">Discover</Link>
          <Link href="/reservations">Reservations</Link>
          <Link href="/host">Host</Link>
        </nav>
        <Link href="/auth" className="cta-btn">
          Sign in
        </Link>
      </header>

      <section className="landing-hero fade-up">
        <div>
          <p className="eyebrow">City Lifestyle Platform</p>
          <h1>Find premium salons, eateries, and events by area.</h1>
          <p className="subtitle">
            A professional booking workflow from discovery to reservation confirmation with role-based
            dashboards.
          </p>
          <div className="row">
            <Link href="/discover" className="cta-btn">
              Start discovering
            </Link>
            <Link href="/auth" className="ghost-link">
              Create account
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-grid slide-in">
        <article className="feature-card">
          <h3>Smart discovery</h3>
          <p>Filter by area and category with clean listing cards and focused details pages.</p>
        </article>
        <article className="feature-card">
          <h3>Booking clarity</h3>
          <p>Reservations happen on dedicated listing pages, not mixed with search interactions.</p>
        </article>
        <article className="feature-card">
          <h3>Host operations</h3>
          <p>Create and manage listings with a structured dashboard and profile management tools.</p>
        </article>
      </section>
    </main>
  );
}

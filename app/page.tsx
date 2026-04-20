import Link from "next/link";

const features = [
  {
    title: "Enterprise Security",
    desc: "SOC 2 Type II compliant infrastructure with end-to-end encryption, role-based access controls, and automated threat detection.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Analytics",
    desc: "Gain actionable insights with live dashboards, custom reports, and intelligent alerting across your entire operation.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Global Infrastructure",
    desc: "Deploy across 20+ regions with 99.99% uptime SLA, automatic failover, and edge caching for sub-50ms response times.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Team Collaboration",
    desc: "Invite unlimited teammates, assign granular permissions, and keep everyone aligned with shared workspaces and audit logs.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "API-First Design",
    desc: "REST and GraphQL APIs with comprehensive SDKs for 12 languages, webhooks, and seamless integration with your existing stack.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Compliance Ready",
    desc: "GDPR, HIPAA, and CCPA compliance built-in. Automated data retention policies, consent management, and audit trails.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "12,000+", label: "Customers worldwide" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "180+", label: "Countries served" },
  { value: "4.9/5", label: "Average rating" },
];

const testimonials = [
  {
    quote: "Demo cut our deployment time by 70% and gave our security team the visibility they always needed. It is the backbone of our infrastructure now.",
    name: "Sarah Chen",
    title: "CTO, Meridian Finance",
  },
  {
    quote: "We evaluated eight platforms before choosing Demo. The compliance tooling alone saved us months of engineering work and two full-time headcount.",
    name: "Marcus Williams",
    title: "Head of Engineering, HealthBridge",
  },
  {
    quote: "From onboarding to production in under a week. The documentation is outstanding and the support team is exceptionally responsive.",
    name: "Priya Nair",
    title: "VP Engineering, Logistify",
  },
];

const howItWorks = [
  { step: "01", title: "Create your account", desc: "Sign up in under two minutes. No credit card required for the 14-day trial." },
  { step: "02", title: "Connect your stack", desc: "Use our guided setup wizard to integrate with your existing tools and data sources." },
  { step: "03", title: "Invite your team", desc: "Add teammates with role-based permissions and start collaborating immediately." },
  { step: "04", title: "Scale with confidence", desc: "As you grow, Demo scales automatically with transparent, usage-based pricing." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-500/30 uppercase tracking-wide">
              Enterprise Platform
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              The infrastructure your team{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                can trust
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
              Demo gives engineering and operations teams a single platform to build, deploy, and monitor
              business-critical applications — with security and compliance baked in from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors duration-200 text-center">
                Start Free Trial
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/15 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 transition-colors duration-200 text-center">
                Talk to Sales
              </Link>
            </div>
            <p className="text-slate-400 text-sm mt-4">No credit card required. 14-day free trial.</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="rgb(249 250 251)" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-1">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything your team needs</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            From development to production, Demo provides the tools that modern engineering teams rely on.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, desc, icon }) => (
            <div key={title} className="card hover:shadow-md transition-shadow duration-200 group">
              <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 transition-colors">
                {icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A streamlined onboarding experience designed for teams that cannot afford downtime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <span className="text-5xl font-black text-blue-500/30 block mb-3">{step}</span>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by engineering teams</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Hear from the teams that use Demo to power their most critical systems.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, name, title }) => (
            <div key={name} className="card flex flex-col">
              <svg className="w-8 h-8 text-blue-200 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-700 text-sm leading-relaxed flex-1">{quote}</p>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto text-lg">
            Join over 12,000 companies that rely on Demo to power their critical operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3.5 px-8 rounded-lg transition-colors duration-200">
              Start Free Trial
            </Link>
            <Link href="/careers" className="border border-white/40 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors duration-200">
              Explore Careers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

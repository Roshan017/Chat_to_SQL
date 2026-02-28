import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="bg-background-dark text-text-primary min-h-screen flex flex-col font-display">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-border-dark bg-surface-dark/50 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg
              className="w-full h-full drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <Link href="/">
            <h1 className="font-display text-xl font-bold tracking-tight text-text-primary">
              DataSage
            </h1>
          </Link>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
            DOCS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link
              className="text-white border-b-2 border-primary py-1 transition-colors"
              href="/docs"
            >
              Documentation
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-[800px] relative z-10 flex flex-col gap-8">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              DataSage Documentation
            </h2>
            <p className="text-text-secondary text-lg">
              Everything you need to know to harness the power of your database
              with AI-driven schema orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-6 shadow-xl hover:border-primary/50 transition-colors">
              <div className="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">
                  rocket_launch
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Getting Started
              </h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                Learn how to connect your PostgreSQL or MySQL database to
                DataSage securely, without exposing your actual data.
              </p>
              <Link
                href="#"
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              >
                Read Quickstart
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-6 shadow-xl hover:border-cyber-cyan/50 transition-colors">
              <div className="size-10 rounded-lg bg-cyber-cyan/20 text-cyber-cyan flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">
                  schema
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Schema Architect
              </h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                Understand how DataSage extracts your physical tables and
                translates them into AI-friendly logical views in real-time.
              </p>
              <Link
                href="#"
                className="text-cyber-cyan text-sm font-medium hover:underline flex items-center gap-1"
              >
                Explore Core Concepts
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-6 shadow-xl hover:border-emerald-flux/50 transition-colors">
              <div className="size-10 rounded-lg bg-emerald-flux/20 text-emerald-flux flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">
                  chat
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Chat to SQL</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                Master the Command Center. Write complex queries, run analyses,
                and design tables using natural language.
              </p>
              <Link
                href="#"
                className="text-emerald-flux text-sm font-medium hover:underline flex items-center gap-1"
              >
                View Prompt Guides
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-6 shadow-xl hover:border-accent-pink/50 transition-colors">
              <div className="size-10 rounded-lg bg-accent-pink/20 text-accent-pink flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">
                  security
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Security & Privacy
              </h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                DataSage never trains on your queries or stores your rows. Learn
                about our end-to-end encryption architecture.
              </p>
              <Link
                href="#"
                className="text-accent-pink text-sm font-medium hover:underline flex items-center gap-1"
              >
                Read Security Paper
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

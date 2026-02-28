"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "./context/AppContext";

export default function LandingPage() {
  const router = useRouter();
  const { state, updateState } = useAppContext();

  const [dbId, setDbId] = useState("");
  const [schemaName, setSchemaName] = useState("public");
  const [dbConnString, setDbConnString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!dbId || !schemaName || !dbConnString) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        user_id: state.userId,
        db_id: dbId,
        schema_name: schemaName,
        db_conn_string: dbConnString,
      };

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/load_schema`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to connect (Status: ${res.status})`);
      }

      const data = await res.json();

      // Update our global context with the credentials and the resultant schema mapping
      updateState({
        dbId,
        schemaName,
        dbConnString,
        schemaData: data,
      });

      // Redirect to the schema UI
      router.push("/schema");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while connecting.";
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-dark text-text-primary min-h-screen flex flex-col">
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
          <h1 className="font-display text-xl font-bold tracking-tight text-text-primary">
            DataSage
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link className="hover:text-primary transition-colors" href="/docs">
              Documentation
            </Link>
          </nav>
          <div className="h-6 w-px bg-border-dark hidden md:block"></div>
          <div className="flex items-center gap-3">
            <button className="size-8 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-text-secondary text-[20px]">
                notifications
              </span>
            </button>
            <div
              className="size-8 rounded-full bg-cover bg-center border border-border-dark"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcoKkBnzx8pJl2lRd8oOClzguhRjtcCq7lNMpkxbAXZs82MipaypgxT_ZSxScouUp0SXRXAJaUYBgA2Lz8OqVvcOa3u1saQzy6RArBIHoloaMQgzNGj1F4seo-SVRyOiAQg5mP7QOhKTpPk_H259JwM3OExx93UwlwZPI6k3zsoR7_cfgVjrdGP19_wsNV_IjRy40kX7JVHn-fPzk8pk5J6UEYqBeTLecDJcmb8esTfHVjfy2J3t5CdH7s52zPMFrT_Zy5Hy9_e5uz")',
              }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="w-full max-w-[560px] relative z-10 flex flex-col gap-6">
          {/* Header Text */}
          <div className="text-center mb-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Connect to Database
            </h2>
            <p className="text-text-secondary text-sm md:text-base">
              Configure your data source to initialize the DataSage schema
              orchestrator.
            </p>
          </div>

          {/* Connection Card */}
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 md:p-8 shadow-2xl">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Database Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    database
                  </span>
                  Database Name
                </label>
                <input
                  required
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary/50 font-mono"
                  placeholder="e.g. production_db_v2"
                  type="text"
                  value={dbId}
                  onChange={(e) => setDbId(e.target.value)}
                />
              </div>

              {/* Schema Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    schema
                  </span>
                  Schema Name
                </label>
                <div className="relative group">
                  <input
                    required
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary/50 font-mono"
                    placeholder="e.g. public"
                    type="text"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    {schemaName === "public" && (
                      <span className="text-xs text-text-secondary bg-surface-dark px-2 py-0.5 rounded border border-border-dark">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Connection String Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">
                      link
                    </span>
                    Connection String
                  </div>
                  <span className="text-[10px] text-primary cursor-pointer hover:underline">
                    Where do I find this?
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    required
                    className="w-full bg-background-dark border border-border-dark rounded-lg pl-4 pr-12 py-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary/50 font-mono tracking-widest"
                    type="password"
                    placeholder="postgresql://user:password@localhost:5432/dbname"
                    value={dbConnString}
                    onChange={(e) => setDbConnString(e.target.value)}
                  />
                  <button
                    className="absolute right-3 text-text-secondary hover:text-primary transition-colors p-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility_off
                    </span>
                  </button>
                </div>
                {errorMsg ? (
                  <p className="text-[12px] text-red-400 mt-1 flex items-start gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] mt-px">
                      error
                    </span>
                    {errorMsg}
                  </p>
                ) : (
                  <p className="text-[11px] text-text-secondary mt-1 flex items-start gap-1">
                    <span className="material-symbols-outlined text-[14px] mt-px">
                      lock
                    </span>
                    Credentials are encrypted end-to-end and never stored in
                    plain text.
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border-dark my-2"></div>

              {/* Action Button */}
              <button
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white transition-all duration-200 ${isLoading ? "bg-obsidian-border cursor-not-allowed text-text-secondary" : "bg-primary hover:bg-primary-hover shadow-glow"}`}
                type="submit"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin">
                      sync
                    </span>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined group-hover:animate-pulse">
                        bolt
                      </span>
                    </span>
                    Initialize DataSage
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center gap-6 text-xs text-text-secondary">
            <Link
              className="hover:text-text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              className="hover:text-text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              className="hover:text-text-primary transition-colors"
              href="#"
            >
              Help Center
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

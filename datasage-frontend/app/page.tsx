"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SchemaViewer } from "@/components/SchemaViewer";
import { Database, Loader2, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemaData, setSchemaData] = useState<any>(null);

  const [formData, setFormData] = useState({
    db_id: "",
    schema_name: "",
    db_conn_string: "",
  });

  const generateUserId = () => {
    return "user_" + Math.random().toString(36).substr(2, 9);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSchemaData(null);

    try {
      let userId = localStorage.getItem("datasage_user_id");
      if (!userId) {
        userId = generateUserId();
        localStorage.setItem("datasage_user_id", userId);
      }
      localStorage.setItem("datasage_db_id", formData.db_id);

      const res = await fetch("http://127.0.0.1:8000/load_schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to connect to database");
      }

      const data = await res.json();
      setSchemaData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const proceedToChat = () => {
    router.push("/chat");
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-20 px-6 font-[family-name:var(--font-sans)]">
      <RevealOnScroll className="w-full max-w-xl text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-glass mb-6">
          <Database className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-4">
          DataSage
        </h1>
        <p className="text-lg sm:text-xl text-white/60 font-medium">
          Talk to your SQL database natively. Connect to understand.
        </p>
      </RevealOnScroll>

      {!schemaData ? (
        <RevealOnScroll delay={0.2} className="w-full max-w-md">
          <GlassCard className="p-8">
            <form onSubmit={handleConnect} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 pl-1">
                  Database Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder:text-white/30"
                  placeholder="e.g. tenant_analytics"
                  value={formData.db_id}
                  onChange={(e) =>
                    setFormData({ ...formData, db_id: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 pl-1">
                  Schema Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder:text-white/30"
                  placeholder="e.g. public"
                  value={formData.schema_name}
                  onChange={(e) =>
                    setFormData({ ...formData, schema_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 pl-1">
                  Connection String
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder:text-white/30 font-mono text-sm"
                  placeholder="postgresql://user:pass@host:5432/db"
                  value={formData.db_conn_string}
                  onChange={(e) =>
                    setFormData({ ...formData, db_conn_string: e.target.value })
                  }
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all flex justify-center items-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Connect Database"
                )}
              </button>
            </form>
          </GlassCard>
        </RevealOnScroll>
      ) : (
        <RevealOnScroll className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-white/90">
              Schema Extracted
            </h2>
            <button
              onClick={proceedToChat}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              Proceed to Chat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-white/50 w-full mb-6">
            Found {Object.keys(schemaData.tables).length} tables in your
            database.
          </p>

          <SchemaViewer schema={schemaData} />
        </RevealOnScroll>
      )}
    </main>
  );
}

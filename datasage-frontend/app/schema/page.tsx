"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function SchemaPage() {
  const router = useRouter();
  const { state } = useAppContext();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Protect route if no schema data is loaded
  if (!state.schemaData && typeof window !== "undefined") {
    // Wait a frame to push router, otherwise it can conflict with rendering
    setTimeout(() => router.push("/"), 0);
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">
            sync
          </span>
          <p className="font-mono text-sm">
            Redirecting to Connection Portal...
          </p>
        </div>
      </div>
    );
  }

  // Transform backend table structures into our UI format
  const schemaTables = state.schemaData?.tables || {};
  const mappedTables = Object.entries(schemaTables).map(
    ([name, table]: [
      string,
      {
        columns?: Record<string, string>;
        primary_key?: string | string[];
        foreign_keys?: Record<string, string>;
      },
    ]) => {
      // Map columns securely
      const columns = Object.entries(table.columns || {}).map(
        ([colName, type]) => {
          let refersTo = null;
          if (table.foreign_keys && table.foreign_keys[colName]) {
            // FKs often look like 'table_name.column_name'
            refersTo = table.foreign_keys[colName].split(".")[0];
          }
          return {
            name: colName,
            type: type as string,
            isPk:
              table.primary_key === colName ||
              (table.primary_key?.includes(colName) ?? false),
            refersTo: refersTo,
          };
        },
      );

      return {
        name,
        desc: "Physical Table",
        icon: "table_chart",
        iconColor: "text-primary bg-primary/20",
        hoverBorder: "hover:border-primary/50",
        indexes: table.primary_key ? 1 : 0,
        rows: "Unknown", // No row count from basic schema dump yet
        columns,
      };
    },
  );

  const filteredTables = mappedTables.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.columns.some((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Logical Views mapping
  const logicalViews = state.schemaData?.logical_to_physical || {};
  const logicalEntries = Object.entries(logicalViews);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-text-primary font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-obsidian-border bg-obsidian-card px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="size-8 text-primary">
              <svg
                className="h-full w-full drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
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
              <h2 className="text-white text-xl font-bold tracking-tight">
                DataSage
              </h2>
            </Link>
          </div>
          <div className="hidden md:flex w-full max-w-sm items-center rounded-lg bg-background-dark border border-obsidian-border focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-text-secondary pl-3">
              search
            </span>
            <input
              className="w-full bg-transparent border-none text-sm text-white placeholder-text-secondary focus:ring-0 py-2 px-3 outline-none"
              placeholder="Search tables, columns, or views..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="text-xs text-text-secondary font-mono pr-3">
              ⌘K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              className="text-white text-sm font-medium transition-colors border-b-2 border-primary py-1"
              href="/schema"
            >
              Schema
            </Link>
            <Link
              className="text-text-secondary hover:text-white text-sm font-medium transition-colors"
              href="/chat"
            >
              Queries
            </Link>
          </nav>
          <div className="flex gap-3">
            <button className="flex items-center justify-center size-9 rounded-lg hover:bg-obsidian-border text-text-secondary hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
            </button>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-obsidian-border"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcoKkBnzx8pJl2lRd8oOClzguhRjtcCq7lNMpkxbAXZs82MipaypgxT_ZSxScouUp0SXRXAJaUYBgA2Lz8OqVvcOa3u1saQzy6RArBIHoloaMQgzNGj1F4seo-SVRyOiAQg5mP7QOhKTpPk_H259JwM3OExx93UwlwZPI6k3zsoR7_cfgVjrdGP19_wsNV_IjRy40kX7JVHn-fPzk8pk5J6UEYqBeTLecDJcmb8esTfHVjfy2J3t5CdH7s52zPMFrT_Zy5Hy9_e5uz")',
              }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto p-6 md:p-8 z-10">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                Schema Architect
              </h1>
              <p className="text-text-secondary text-base max-w-2xl flex items-center gap-2">
                Orchestrating structure for database:
                <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded text-sm border border-primary/20">
                  {state.dbId || "unknown"}
                </span>
                <span className="font-mono text-emerald-flux bg-emerald-flux/10 px-1 py-0.5 rounded text-sm border border-emerald-flux/20">
                  {state.schemaName || "public"}
                </span>
              </p>
            </div>
            <div className="flex gap-3"></div>
          </div>
        </div>

        {/* Tables Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                table_view
              </span>
              Physical Tables
              <span className="bg-obsidian-card border border-obsidian-border text-text-secondary text-xs px-2 py-0.5 rounded-full ml-2 font-mono">
                {filteredTables.length} / {mappedTables.length}
              </span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "text-white bg-obsidian-card border border-obsidian-border" : "text-text-secondary hover:text-white bg-transparent hover:bg-obsidian-border"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  grid_view
                </span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "text-white bg-obsidian-card border border-obsidian-border" : "text-text-secondary hover:text-white bg-transparent hover:bg-obsidian-border"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  list
                </span>
              </button>
            </div>
          </div>

          {filteredTables.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-obsidian-border rounded-xl bg-obsidian-card/20">
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50">
                search_off
              </span>
              <p>No tables match your search &quot;{searchQuery}&quot;.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary text-sm mt-3 hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredTables.map((table) =>
                viewMode === "grid" ? (
                  /* Grid Card */
                  <div
                    key={table.name}
                    className={`group bg-obsidian-card border border-obsidian-border ${table.hoverBorder} rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-black/40`}
                  >
                    <div className="p-4 border-b border-obsidian-border bg-[#1A1F2B] group-hover:bg-[#1e2433] transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8 rounded ${table.iconColor} flex items-center justify-center`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {table.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base leading-tight font-mono">
                            {table.name}
                          </h4>
                          <span className="text-xs text-text-secondary">
                            {table.desc}
                          </span>
                        </div>
                      </div>
                      <button className="text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col gap-3 font-mono text-sm max-h-64 overflow-y-auto custom-scrollbar">
                      {table.columns.map(
                        (col: {
                          name: string;
                          isPk: boolean;
                          refersTo: string | null;
                          type: string;
                        }) => (
                          <div
                            key={col.name}
                            className="flex justify-between items-center group/row"
                          >
                            <div
                              className={`flex items-center gap-2 ${col.isPk ? "text-white" : "text-text-secondary group-hover/row:text-white transition-colors"}`}
                            >
                              <span
                                className={`material-symbols-outlined text-[14px] ${col.isPk ? "text-cyber-cyan" : col.refersTo ? "text-emerald-flux rotate-90" : "opacity-0"}`}
                              >
                                {col.refersTo ? "login" : "key"}
                              </span>
                              <span>{col.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {col.isPk && (
                                <span className="text-cyber-cyan bg-cyber-cyan/10 px-1.5 py-0.5 rounded text-[10px] font-bold border border-cyber-cyan/20">
                                  PK
                                </span>
                              )}
                              {col.refersTo && (
                                <span className="text-emerald-flux bg-emerald-flux/10 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-flux/20 flex items-center gap-1">
                                  FK{" "}
                                  <span className="opacity-50 text-[8px]">
                                    -&gt; {col.refersTo}
                                  </span>
                                </span>
                              )}
                              <span className="text-text-secondary text-xs opacity-75">
                                {col.type}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  /* List Card */
                  <div
                    key={table.name}
                    className={`group bg-obsidian-card border border-obsidian-border ${table.hoverBorder} rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/40 gap-4`}
                  >
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div
                        className={`size-10 rounded-lg ${table.iconColor} flex items-center justify-center border border-obsidian-border`}
                      >
                        <span className="material-symbols-outlined shadow-lg">
                          {table.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight font-mono">
                          {table.name}
                        </h4>
                        <span className="text-sm text-text-secondary">
                          {table.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-12 font-mono text-sm overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="text-text-secondary text-[10px] uppercase tracking-wider">
                          Columns
                        </span>
                        <span className="text-white font-medium">
                          {table.columns.length} columns
                        </span>
                      </div>
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="text-text-secondary text-[10px] uppercase tracking-wider">
                          Primary Key
                        </span>
                        <span className="text-white font-medium">
                          {table.indexes > 0 ? "Yes" : "No"}
                        </span>
                      </div>

                      <button className="text-text-secondary hover:text-white px-3 py-1.5 border border-obsidian-border rounded-lg bg-background-darker/50 hover:bg-obsidian-border transition-colors text-sm font-medium flex items-center gap-2 shrink-0 ml-auto">
                        <span className="material-symbols-outlined text-[16px]">
                          visibility
                        </span>
                        View Data
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        {/* Logical Views Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">
                schema
              </span>
              Logical Views
              <span className="bg-obsidian-card border border-obsidian-border text-text-secondary text-xs px-2 py-0.5 rounded-full ml-2 font-mono">
                {logicalEntries.length}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {logicalEntries.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-obsidian-border rounded-xl">
                <span className="material-symbols-outlined text-4xl mb-4 opacity-50">
                  account_tree
                </span>
                <p>No logical views configured yet.</p>
                <p className="text-xs opacity-70 mt-1">
                  Use the Orchestrator Chat to generate logical views.
                </p>
              </div>
            ) : (
              logicalEntries.map(
                ([viewName, physicalTables]: [string, string[]]) => (
                  <div
                    key={viewName}
                    className="bg-obsidian-card border border-obsidian-border hover:border-purple-400/50 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <div className="p-4 border-b border-obsidian-border bg-[#1A1F2B] flex items-center gap-3">
                      <div className="size-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">
                          account_tree
                        </span>
                      </div>
                      <h4 className="text-white font-bold leading-tight font-mono">
                        {viewName}
                      </h4>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-text-secondary text-xs uppercase font-mono tracking-wider">
                        Maps To Physical Tables
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {physicalTables.map((table: string) => (
                          <span
                            key={table}
                            className="bg-background-darker border border-border-dark px-2 py-1 rounded text-xs font-mono text-white flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              table_chart
                            </span>
                            {table}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </section>
      </main>

      {/* Background Decor (Abstract) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-flux/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Key, Link as LinkIcon, TableProperties } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface SchemaViewerProps {
  schema: {
    tables: Record<
      string,
      {
        columns: Record<string, string>;
        primary_key: string[];
        foreign_keys: {
          column: string;
          references: { table: string; column: string };
        }[];
      }
    >;
    logical_to_physical?: Record<string, string[]>;
  };
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
  if (!schema || !schema.tables) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
        {Object.entries(schema.tables).map(([tableName, tableDetails], idx) => (
          <RevealOnScroll key={tableName} delay={idx * 0.1}>
            <GlassCard variant="light" className="p-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <TableProperties className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-lg text-white/90">
                  {tableName}
                </h3>
              </div>

              <div className="flex-1 space-y-2 text-sm text-white/70 overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                {Object.entries(tableDetails.columns).map(
                  ([colName, colType]) => {
                    const isPk = tableDetails.primary_key.includes(colName);
                    const fkInfo = tableDetails.foreign_keys.find(
                      (fk) => fk.column === colName,
                    );

                    return (
                      <div
                        key={colName}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white/80">
                            {colName}
                          </span>
                          {isPk && (
                            <Key className="w-3 h-3 text-amber-400/80" />
                          )}
                          {fkInfo && (
                            <LinkIcon className="w-3 h-3 text-blue-400/80" />
                          )}
                        </div>
                        <span className="text-xs font-mono text-white/50">
                          {colType}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
              {tableDetails.foreign_keys.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/50 space-y-1">
                  {tableDetails.foreign_keys.map((fk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 line-clamp-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>
                        {fk.column} → {fk.references.table}.
                        {fk.references.column}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </RevealOnScroll>
        ))}
      </div>

      {/* Logical to Physical Mappings */}
      {schema.logical_to_physical &&
        Object.keys(schema.logical_to_physical).length > 0 && (
          <div className="mt-12 w-full">
            <h2 className="text-2xl font-semibold text-white/90 mb-2">
              Logical Mappings
            </h2>
            <p className="text-white/50 w-full mb-6">
              Virtual tables that aggregate data across multiple physical
              shards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {Object.entries(schema.logical_to_physical).map(
                ([logicalName, physicalTables], idx) => (
                  <RevealOnScroll key={logicalName} delay={idx * 0.1}>
                    <GlassCard
                      variant="colored"
                      className="p-5 h-full flex flex-col border-indigo-500/30"
                    >
                      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20">
                          <TableProperties className="w-5 h-5 text-indigo-300" />
                        </div>
                        <h3 className="font-semibold text-lg text-white/90">
                          {logicalName}
                        </h3>
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
                          Maps to {physicalTables.length} tables:
                        </p>
                        <div className="space-y-2 overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                          {physicalTables.map((pt) => (
                            <div
                              key={pt}
                              className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                              <span className="text-sm text-white/80 font-mono truncate">
                                {pt}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </RevealOnScroll>
                ),
              )}
            </div>
          </div>
        )}
    </>
  );
}

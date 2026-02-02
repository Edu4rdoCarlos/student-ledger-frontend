"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/primitives/input";

interface DefensesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function DefensesSearch({ value, onChange }: DefensesSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar defesas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-white dark:bg-gray-800"
      />
    </div>
  );
}

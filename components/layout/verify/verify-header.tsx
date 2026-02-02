"use client";

import { Shield } from "lucide-react";

export function VerifyHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/30">
        <Shield className="h-10 w-10 text-primary-foreground" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-4xl font-bold text-primary">
            Verificar Autenticidade
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Verifique a autenticidade de um documento através do hash SHA-256
        </p>
      </div>
    </div>
  );
}

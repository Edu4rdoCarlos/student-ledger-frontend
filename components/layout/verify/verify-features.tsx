"use client";

import { Lock, Shield, Sparkles } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: "primary" | "emerald";
}

function FeatureCard({ icon, title, description, variant }: FeatureCardProps) {
  const styles = {
    primary: {
      container: "bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/30",
      title: "text-primary",
      description: "text-primary/80",
    },
    emerald: {
      container: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200/50 dark:border-emerald-800/30",
      title: "text-emerald-900 dark:text-emerald-100",
      description: "text-emerald-700 dark:text-emerald-300",
    },
  };

  const style = styles[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${style.container}`}>
      {icon}
      <div>
        <p className={`text-xs font-semibold ${style.title}`}>{title}</p>
        <p className={`text-[10px] ${style.description} mt-0.5`}>{description}</p>
      </div>
    </div>
  );
}

export function VerifyFeatures() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FeatureCard
        icon={<Lock className="h-5 w-5 text-primary mt-0.5" />}
        title="Imutável"
        description="Blockchain garante integridade"
        variant="primary"
      />
      <FeatureCard
        icon={<Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />}
        title="Seguro"
        description="Criptografia SHA-256"
        variant="emerald"
      />
      <FeatureCard
        icon={<Sparkles className="h-5 w-5 text-primary mt-0.5" />}
        title="Rastreável"
        description="Auditoria completa"
        variant="primary"
      />
    </div>
  );
}

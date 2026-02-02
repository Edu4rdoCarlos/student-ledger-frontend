const ROLE_LABELS: Record<string, string> = {
  COORDINATOR: "Coordenador",
  ADVISOR: "Orientador",
  STUDENT: "Aluno",
  ADMIN: "Administrador",
};

export function getRoleLabelFromArray(roles: string[]): string {
  const hasCoordinator = roles.includes("COORDINATOR");
  const hasAdvisor = roles.includes("ADVISOR");
  const hasStudent = roles.includes("STUDENT");

  if (hasCoordinator && hasAdvisor) return "Coordenador e Orientador";
  if (hasCoordinator) return "Coordenador";
  if (hasAdvisor) return "Orientador";
  if (hasStudent) return "Aluno";

  return roles.map((role) => ROLE_LABELS[role] || role).join(", ");
}

export function getRoleLabel(role: string, isCoordinatorAlsoAdvisor = false): string {
  if (role === "COORDINATOR" && isCoordinatorAlsoAdvisor) {
    return "Coordenador e Orientador";
  }

  return ROLE_LABELS[role] || role;
}

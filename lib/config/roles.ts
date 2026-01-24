import type { UserRole } from "@/lib/types"

export interface RoleConfig {
  title: string
  description: string
  permissions: string[]
  color: string
  icon: string
}

export const ROLE_DESCRIPTIONS: Record<UserRole, RoleConfig> = {
  STUDENT: {
    title: "Estudante",
    description:
      "Visualiza suas defesas, aprova documentos e acompanha o processo de aprovação do TCC.",
    permissions: [
      "Visualizar suas próprias defesas",
      "Aprovar ou rejeitar documentos",
      "Fazer download de documentos",
      "Verificar autenticidade de documentos",
      "Acompanhar status de aprovações",
      "Visualizar informações do curso",
    ],
    color: "#3B82F6",
    icon: "student",
  },

  ADVISOR: {
    title: "Orientador",
    description: "Participa como orientador em defesas e aprova documentos dos estudantes que orienta.",
    permissions: [
      "Visualizar defesas que participa",
      "Aprovar ou rejeitar documentos",
      "Fazer download de documentos",
      "Verificar autenticidade de documentos",
      "Acompanhar status de aprovações",
      "Visualizar informações do curso",
    ],
    color: "#8B5CF6",
    icon: "advisor",
  },

  COORDINATOR: {
    title: "Coordenador",
    description: "Gerencia defesas, estudantes e orientadores do curso que coordena.",
    permissions: [
      "Criar e gerenciar defesas do curso",
      "Cadastrar e editar estudantes",
      "Cadastrar e editar orientadores",
      "Submeter resultados de defesas",
      "Cancelar e reagendar defesas",
      "Criar versões de documentos",
      "Visualizar todas as aprovações",
      "Gerenciar departamentos",
    ],
    color: "#10B981",
    icon: "coordinator",
  },

  ADMIN: {
    title: "Administrador",
    description: "Cadastra coordenadores e cursos no sistema.",
    permissions: [
      "Cadastrar coordenadores",
      "Cadastrar cursos",
    ],
    color: "#EF4444",
    icon: "admin",
  },
}

export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLE_DESCRIPTIONS[role]
}

export function getRoleTitle(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role].title
}

export function getRoleColor(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role].color
}

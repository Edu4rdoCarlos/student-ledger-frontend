import type { User } from "@/lib/types"
import { isStudent, isAdvisor, isCoordinator, isAdmin } from "@/lib/types"

export interface NavigationItem {
  label: string
  href: string
  icon: string
  description?: string
}

export function getNavigationItems(user: User): NavigationItem[] {
  if (isStudent(user)) {
    return [
      {
        label: "Minhas Defesas",
        href: "/defenses",
        icon: "presentation",
        description: "Acompanhe suas defesas de TCC",
      },
      {
        label: "Aprovações",
        href: "/signatures",
        icon: "file",
        description: "Aprovar ou rejeitar documentos",
      },
      {
        label: "Verificar Documentos",
        href: "/verify",
        icon: "shield",
        description: "Verificar autenticidade de documentos",
      },
      {
        label: "Cursos",
        href: "/course",
        icon: "book",
        description: "Informações do seu curso",
      },
    ]
  }

  const baseItems: NavigationItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "home",
      description: "Visão geral do sistema",
    },
  ]

  if (isAdvisor(user)) {
    return [
      {
        label: "Defesas",
        href: "/defenses",
        icon: "presentation",
        description: "Defesas que você participa",
      },
      {
        label: "Aprovações",
        href: "/signatures",
        icon: "file",
        description: "Gerenciar aprovações de documentos",
      },
      {
        label: "Verificar Documentos",
        href: "/verify",
        icon: "shield",
        description: "Verificar autenticidade de documentos",
      },
      {
        label: "Cursos",
        href: "/course",
        icon: "book",
        description: "Informações do curso",
      },
    ]
  }

  if (isCoordinator(user)) {
    return [
      ...baseItems,
      {
        label: "Defesas",
        href: "/defenses",
        icon: "presentation",
        description: "Gerenciar defesas do curso",
      },
      {
        label: "Aprovações",
        href: "/signatures",
        icon: "file",
        description: "Gerenciar aprovações de documentos",
      },
      {
        label: "Estudantes",
        href: "/students",
        icon: "users",
        description: "Gerenciar estudantes",
      },
      {
        label: "Orientadores",
        href: "/advisors",
        icon: "user-check",
        description: "Gerenciar orientadores",
      },
      {
        label: "Verificar Documentos",
        href: "/verify",
        icon: "shield",
        description: "Verificar autenticidade de documentos",
      },
      {
        label: "Curso",
        href: "/course",
        icon: "book",
        description: "Gerenciar informações do curso",
      },
    ]
  }

  if (isAdmin(user)) {
    return [
      {
        label: "Cursos",
        href: "/course",
        icon: "book",
        description: "Cadastrar cursos",
      },
      {
        label: "Coordenadores",
        href: "/coordinators",
        icon: "shield",
        description: "Cadastrar coordenadores",
      },
    ]
  }

  return baseItems
}

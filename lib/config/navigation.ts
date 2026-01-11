import type { User } from "@/lib/types"
import { isStudent, isAdvisor, isCoordinator, isAdmin } from "@/lib/types"

export interface NavigationItem {
  label: string
  href: string
  icon: string
  description?: string
}

export function getNavigationItems(user: User): NavigationItem[] {
  const baseItems: NavigationItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "home",
      description: "Visão geral do sistema",
    },
  ]

  if (isStudent(user)) {
    return [
      ...baseItems,
      {
        label: "Minhas Defesas",
        href: "/defenses",
        icon: "presentation",
        description: "Acompanhe suas defesas de TCC",
      },
      {
        label: "Documentos",
        href: "/documents",
        icon: "file",
        description: "Envie e gerencie seus documentos",
      },
      {
        label: "Meu Curso",
        href: "/course",
        icon: "book",
        description: "Informações do seu curso",
      },
    ]
  }

  if (isAdvisor(user)) {
    return [
      ...baseItems,
      {
        label: "Defesas",
        href: "/defenses",
        icon: "presentation",
        description: "Defesas que você participa",
      },
      {
        label: "Documentos",
        href: "/documents",
        icon: "file",
        description: "Documentos para aprovação",
      },
      {
        label: "Estudantes",
        href: "/students",
        icon: "users",
        description: "Estudantes que você orienta",
      },
      {
        label: "Departamento",
        href: "/department",
        icon: "building",
        description: "Informações do departamento",
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
        label: "Documentos",
        href: "/documents",
        icon: "file",
        description: "Todos os documentos do curso",
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
      ...baseItems,
      {
        label: "Defesas",
        href: "/defenses",
        icon: "presentation",
        description: "Todas as defesas",
      },
      {
        label: "Cursos",
        href: "/courses",
        icon: "book",
        description: "Gerenciar cursos",
      },
      {
        label: "Departamentos",
        href: "/departments",
        icon: "building",
        description: "Gerenciar departamentos",
      },
      {
        label: "Coordenadores",
        href: "/coordinators",
        icon: "shield",
        description: "Gerenciar coordenadores",
      },
      {
        label: "Orientadores",
        href: "/advisors",
        icon: "user-check",
        description: "Gerenciar orientadores",
      },
      {
        label: "Estudantes",
        href: "/students",
        icon: "users",
        description: "Gerenciar estudantes",
      },
      {
        label: "Documentos",
        href: "/documents",
        icon: "file",
        description: "Todos os documentos",
      },
    ]
  }

  return baseItems
}

export function getQuickActions(user: User): NavigationItem[] {
  if (isStudent(user)) {
    return [
      {
        label: "Enviar Documento",
        href: "/documents/upload",
        icon: "upload",
        description: "Envie uma nova versão do documento",
      },
      {
        label: "Ver Status",
        href: "/defenses/status",
        icon: "info",
        description: "Acompanhe o status da sua defesa",
      },
    ]
  }

  if (isAdvisor(user)) {
    return [
      {
        label: "Documentos Pendentes",
        href: "/documents/pending",
        icon: "clock",
        description: "Documentos aguardando aprovação",
      },
      {
        label: "Próximas Defesas",
        href: "/defenses/upcoming",
        icon: "calendar",
        description: "Suas próximas bancas",
      },
    ]
  }

  if (isCoordinator(user)) {
    return [
      {
        label: "Nova Defesa",
        href: "/defenses/new",
        icon: "plus",
        description: "Criar nova defesa",
      },
      {
        label: "Novo Estudante",
        href: "/students/new",
        icon: "user-plus",
        description: "Cadastrar estudante",
      },
      {
        label: "Submeter Resultado",
        href: "/defenses/results",
        icon: "check-circle",
        description: "Submeter resultado de defesa",
      },
    ]
  }

  if (isAdmin(user)) {
    return [
      {
        label: "Novo Curso",
        href: "/courses/new",
        icon: "plus",
        description: "Criar novo curso",
      },
      {
        label: "Novo Departamento",
        href: "/departments/new",
        icon: "building",
        description: "Criar novo departamento",
      },
      {
        label: "Novo Coordenador",
        href: "/coordinators/new",
        icon: "shield",
        description: "Cadastrar coordenador",
      },
    ]
  }

  return []
}

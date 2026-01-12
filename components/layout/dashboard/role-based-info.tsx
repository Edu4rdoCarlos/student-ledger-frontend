"use client"

import { useUserRole } from "@/lib/hooks/use-user-role"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"

export function RoleBasedInfo() {
  const { user, roleConfig, userInfo, capabilities, isStudent, isAdvisor, isCoordinator } =
    useUserRole()

  if (!user || !roleConfig || !userInfo) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: roleConfig.color }}
            />
            {roleConfig.title}
          </CardTitle>
          <CardDescription>{roleConfig.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Suas Permissões</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {roleConfig.permissions.map((permission, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isStudent && userInfo.type === "student" && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Informações do Estudante</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Matrícula:</span>{" "}
                    <span className="font-medium">{userInfo.registration}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Curso:</span>{" "}
                    <span className="font-medium">{userInfo.course?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Departamento:</span>{" "}
                    <span className="font-medium">{userInfo.course?.department.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Defesas:</span>{" "}
                    <span className="font-medium">{userInfo.defenses.length}</span>
                  </p>
                </div>
              </div>
            )}

            {isAdvisor && userInfo.type === "advisor" && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Informações do Orientador</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Especialização:</span>{" "}
                    <span className="font-medium">{userInfo.specialization}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Departamento:</span>{" "}
                    <span className="font-medium">{userInfo.department?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Curso:</span>{" "}
                    <span className="font-medium">{userInfo.course?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Orientações Ativas:</span>{" "}
                    <span className="font-medium">{userInfo.defenses.length}</span>
                  </p>
                </div>
              </div>
            )}

            {isCoordinator && userInfo.type === "coordinator" && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Informações do Coordenador</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <span className="font-medium">
                      {userInfo.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Curso:</span>{" "}
                    <span className="font-medium">{userInfo.course?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Código do Curso:</span>{" "}
                    <span className="font-medium">{userInfo.course?.code}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Departamento:</span>{" "}
                    <span className="font-medium">{userInfo.department?.name}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {capabilities && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Disponíveis</CardTitle>
            <CardDescription>Funcionalidades que você pode acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${capabilities.canViewDefenses ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span>Visualizar Defesas</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${capabilities.canCreateDefense ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span>Criar Defesa</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${capabilities.canUploadDocument ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span>Enviar Documento</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${capabilities.canApproveDocument ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span>Aprovar Documento</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${capabilities.canManageStudents ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span>Gerenciar Estudantes</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${capabilities.canManageAdvisors ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span>Gerenciar Orientadores</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

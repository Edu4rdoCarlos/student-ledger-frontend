"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card"
import { Badge } from "@/components/primitives/badge"
import { Book, GraduationCap, Users, MapPin, Mail, Phone, Globe, Calendar } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user-role"
import { isStudent } from "@/lib/types"
import type { Course } from "@/lib/types/course"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function CoursePage() {
  const { user } = useUser()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && isStudent(user)) {
      setCourse(user.metadata.student.course)
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando informações do curso...</p>
        </div>
      </div>
    )
  }

  if (!user || !isStudent(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Você não tem permissão para visualizar esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Meu Curso</h1>
            <p className="text-muted-foreground">
              Informações sobre seu curso
            </p>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Não foi possível carregar as informações do seu curso.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{course.name}</h1>
            <p className="text-muted-foreground">
              Informações detalhadas sobre seu curso
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <GraduationCap className="h-4 w-4 mr-1" />
            Graduação
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nome do Curso</p>
                <p className="font-medium">{course.name}</p>
              </div>

              {course.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm">{course.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Código do Curso</p>
                <p className="font-mono text-sm">{course.code}</p>
              </div>

              {course.duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="text-sm font-medium">{course.duration} semestres</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Coordenação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.coordinator ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coordenador(a)</p>
                    <p className="font-medium">{course.coordinator.name}</p>
                  </div>

                  {course.coordinator.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${course.coordinator.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {course.coordinator.email}
                      </a>
                    </div>
                  )}

                  {course.coordinator.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${course.coordinator.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {course.coordinator.phone}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Coordenador não informado
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Departamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.department ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nome</p>
                    <p className="font-medium">{course.department.name}</p>
                  </div>

                  {course.department.code && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Código</p>
                      <p className="font-mono text-sm">{course.department.code}</p>
                    </div>
                  )}

                  {course.department.contact && (
                    <>
                      {course.department.contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${course.department.contact.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {course.department.contact.email}
                          </a>
                        </div>
                      )}

                      {course.department.contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${course.department.contact.phone}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {course.department.contact.phone}
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {course.department.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{course.department.location}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Departamento não informado
                </p>
              )}
            </CardContent>
          </Card>

          {course.website && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Website
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={course.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                >
                  {course.website}
                  <Globe className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

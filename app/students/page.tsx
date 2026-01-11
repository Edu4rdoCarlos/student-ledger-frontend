"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Plus, GraduationCap, Eye, FileText, User } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { useStudents } from "@/hooks/use-students"
import Link from "next/link"
import { Card } from "@/components/shared/card"

export default function StudentsPage() {
  const { students, loading } = useStudents()

  const columns = [
    {
      key: "matricula",
      label: "Matrícula",
      render: (student: any) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
          {student.matricula}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nome",
      render: (student: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{student.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (student: any) => (
        <span className="text-sm text-muted-foreground">{student.email}</span>
      ),
    },
    {
      key: "course",
      label: "Curso",
      render: (student: any) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{student.course}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (student: any) => (
        <div className="flex gap-2">
          <Link href={`/students/${student.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary cursor-pointer">
              <Eye className="h-4 w-4" />
              Ver perfil
            </Button>
          </Link>
          <Link href={`/documents?student=${student.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary cursor-pointer">
              <FileText className="h-4 w-4" />
              Documentos
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">
                Alunos
              </h1>
            </div>
            <p className="text-muted-foreground">Gerencie os alunos cadastrados no sistema</p>
          </div>
          <Link href="/students/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer">
              <Plus className="h-4 w-4" />
              Novo Aluno
            </Button>
          </Link>
        </div>

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable data={students} columns={columns} loading={loading} emptyMessage="Nenhum aluno encontrado" />
        </Card>
      </div>
    </DashboardLayout>
  )
}

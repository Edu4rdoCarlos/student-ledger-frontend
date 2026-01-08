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
        <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          {student.matricula}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nome",
      render: (student: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
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
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 cursor-pointer">
              <Eye className="h-4 w-4" />
              Ver perfil
            </Button>
          </Link>
          <Link href={`/documents?student=${student.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 cursor-pointer">
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
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Alunos
              </h1>
            </div>
            <p className="text-muted-foreground">Gerencie os alunos cadastrados no sistema</p>
          </div>
          <Link href="/students/new">
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 cursor-pointer">
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

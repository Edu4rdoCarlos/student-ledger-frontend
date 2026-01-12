"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Plus, GraduationCap, Eye, User, CheckCircle2, XCircle, Clock, Trophy } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { TablePagination } from "@/components/shared/table-pagination"
import { StudentDetailsModal } from "@/components/layout/students/student-details-modal"
import { useStudents } from "@/hooks/use-students"
import Link from "next/link"
import { Card } from "@/components/shared/card"
import type { Student, PaginationMetadata } from "@/lib/types"
import { useState } from "react"

const getDefenseStatusBadge = (student: Student) => {
  if (!student.defenses || student.defenses.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400" title="Nenhuma defesa cadastrada">
        <Clock className="h-3 w-3" />
        Sem defesa
      </span>
    )
  }

  const lastDefense = student.defenses[0]

  if (lastDefense.result === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400" title={`Aprovado com nota ${lastDefense.finalGrade}`}>
        <CheckCircle2 className="h-3 w-3" />
        Aprovado
      </span>
    )
  }

  if (lastDefense.result === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400" title={`Reprovado com nota ${lastDefense.finalGrade}`}>
        <XCircle className="h-3 w-3" />
        Reprovado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400" title="Defesa pendente">
      <Clock className="h-3 w-3" />
      Pendente
    </span>
  )
}

export default function StudentsPage() {
  const { students, loading } = useStudents()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mockMetadata: PaginationMetadata = {
    page: currentPage,
    perPage: 10,
    total: 100,
    totalPages: 10,
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleUpdateStudent = async (studentId: string, data: { name: string; courseId: string }) => {
    try {
      console.log("Atualizando estudante:", studentId, data)
      alert("Estudante atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar estudante:", error)
      alert("Erro ao atualizar estudante")
      throw error
    }
  }

  const columns = [
    {
      key: "matricula",
      label: "Matrícula",
      render: (student: Student) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
          {student.registration || student.matricula}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nome",
      render: (student: Student) => (
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
      render: (student: Student) => (
        <span className="text-sm text-muted-foreground">{student.email}</span>
      ),
    },
    {
      key: "course",
      label: "Curso",
      render: (student: Student) => {
        const courseDisplay = typeof student.course === 'string'
          ? student.course
          : `${student.course.name} (${student.course.code})`

        return (
          <div className="flex items-center gap-2" title={courseDisplay}>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {typeof student.course === 'string' ? student.course : student.course.name}
              </span>
              {typeof student.course !== 'string' && (
                <span className="text-xs text-muted-foreground">{student.course.code}</span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: "defenses",
      label: "Defesas",
      render: (student: Student) => {
        const defensesCount = student.defenses?.length || 0
        const lastDefense = student.defenses?.[0]

        return (
          <div className="flex items-center gap-2" title={defensesCount > 0 ? `${defensesCount} defesa(s) registrada(s)` : 'Nenhuma defesa'}>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{defensesCount}</span>
            </div>
            {lastDefense && (
              <span className="text-xs text-muted-foreground" title={`Nota: ${lastDefense.finalGrade}`}>
                ({lastDefense.finalGrade})
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: "status",
      label: "Status",
      render: (student: Student) => getDefenseStatusBadge(student),
    },
    {
      key: "actions",
      label: "Ações",
      render: (student: Student) => (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleViewDetails(student)}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-sm cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
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
          <TablePagination
            metadata={mockMetadata}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </Card>
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateStudent={handleUpdateStudent}
      />
    </DashboardLayout>
  )
}

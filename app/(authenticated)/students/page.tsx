"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Plus, GraduationCap, Eye, User, CheckCircle2, XCircle, Clock, Trophy } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { TablePagination } from "@/components/shared/table-pagination"
import { useStudents } from "@/hooks/use-students"
import { Card } from "@/components/shared/card"
import type { Student } from "@/lib/types"
import { useState } from "react"
import { StudentDetailsModal } from "@/components/layout/students/student-details-modal"
import { AddStudentDialog } from "@/components/layout/students/add-student-dialog"
import { studentService } from "@/lib/services/student-service"

const getDefenseStatusBadge = (student: Student) => {
  const defensesCount = student.defensesCount ?? student.defenseIds?.length ?? 0
  const defenseStatus = student.defenseStatus

  if (!defenseStatus || defensesCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400" title="Nenhuma defesa cadastrada">
        <Clock className="h-3 w-3" />
        Sem defesa
      </span>
    )
  }

  if (defenseStatus === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400" title="Defesa concluída">
        <CheckCircle2 className="h-3 w-3" />
        Concluída
      </span>
    )
  }

  if (defenseStatus === "CANCELED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400" title="Defesa cancelada">
        <XCircle className="h-3 w-3" />
        Cancelada
      </span>
    )
  }

  if (defenseStatus === "SCHEDULED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400" title="Defesa agendada">
        <Clock className="h-3 w-3" />
        Agendada
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400" title="Status desconhecido">
      <Clock className="h-3 w-3" />
      Desconhecido
    </span>
  )
}

export default function StudentsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const { students, metadata, loading, refetch } = useStudents(currentPage, 10)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewDetails = async (student: Student) => {
    try {
      setLoadingDetails(true)
      setIsModalOpen(true)

      const registration = student.registration || student.matricula
      if (!registration) {
        console.error("Estudante sem matrícula")
        setSelectedStudent(student)
        return
      }

      const fullStudentData = await studentService.getStudentByRegistration(registration)
      setSelectedStudent(fullStudentData)
    } catch (error) {
      console.error("Erro ao buscar detalhes do estudante:", error)
      setSelectedStudent(student)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUpdateStudent = async (registration: string, data: { name: string; courseId: string }) => {
    try {
      await studentService.updateStudent(registration, data)
      const updatedStudent = await studentService.getStudentByRegistration(registration)
      setSelectedStudent(updatedStudent)
      await refetch(currentPage, 10)
    } catch (error) {
      console.error("Erro ao atualizar estudante:", error)
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
        const defensesCount = student.defensesCount ?? student.defenseIds?.length ?? 0

        return (
          <div className="flex items-center gap-2" title={defensesCount > 0 ? `${defensesCount} defesa(s) registrada(s)` : 'Nenhuma defesa'}>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{defensesCount}</span>
            </div>
          </div>
        )
      },
    },
    {
      key: "status",
      label: "Status do TCC",
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
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable data={students} columns={columns} loading={loading} emptyMessage="Nenhum aluno encontrado" />
          {metadata && (
            <TablePagination
              metadata={metadata}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}
        </Card>
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateStudent={handleUpdateStudent}
        loading={loadingDetails}
      />

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => refetch(currentPage, 10)}
      />
    </DashboardLayout>
  )
}

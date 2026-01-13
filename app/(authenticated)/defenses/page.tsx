"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/primitives/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card"
import { Input } from "@/components/primitives/input"
import { Calendar, MapPin, CheckCircle2, Clock, XCircle, Eye, Search, Plus } from "lucide-react"
import type { Defense } from "@/lib/types/defense"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { defenseService } from "@/lib/services/defense-service"
import { DefenseDetailsModal } from "@/components/layout/defenses/defense-details-modal"
import { useUser } from "@/lib/hooks/use-user-role"

export default function DefensesPage() {
  const { user } = useUser()
  const [defenses, setDefenses] = useState<Defense[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const userDefenseIds = useMemo(() => {
    if (!user?.metadata) return []

    if (user.metadata.student?.defenseIds) {
      return user.metadata.student.defenseIds
    }

    if (user.metadata.advisor?.defenseIds) {
      return user.metadata.advisor.defenseIds
    }

    return []
  }, [user])

  const { myDefenses, otherDefenses } = useMemo(() => {
    const my = defenses.filter(d => userDefenseIds.includes(d.id))
    const other = defenses.filter(d => !userDefenseIds.includes(d.id))
    return { myDefenses: my, otherDefenses: other }
  }, [defenses, userDefenseIds])

  useEffect(() => {
    const fetchDefenses = async () => {
      try {
        setLoading(true)
        const response = await defenseService.getAllDefenses(1, 100, "desc", searchQuery)
        setDefenses(response.data)
      } catch (error) {
        console.error("Error fetching defenses:", error)
        setDefenses([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchDefenses()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleViewDetails = async (defense: Defense) => {
    try {
      setLoadingDetails(true)
      setIsModalOpen(true)

      const fullDefenseData = await defenseService.getDefenseById(defense.id)
      setSelectedDefense(fullDefenseData)
    } catch (error) {
      console.error("Erro ao buscar detalhes da defesa:", error)
      setSelectedDefense(defense)
    } finally {
      setLoadingDetails(false)
    }
  }

  const renderDefenseCard = (defense: Defense) => (
    <Card key={defense.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{defense.title}</CardTitle>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {defense.status === "SCHEDULED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
              <Clock className="h-3 w-3" />
              Agendada
            </span>
          )}
          {defense.status === "COMPLETED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              Concluída
            </span>
          )}
          {defense.status === "CANCELED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
              <XCircle className="h-3 w-3" />
              Cancelada
            </span>
          )}
          {defense.result === "APPROVED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              Aprovado
            </span>
          )}
          {defense.result === "FAILED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
              <XCircle className="h-3 w-3" />
              Reprovado
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {new Date(defense.defenseDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {defense.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{defense.location}</span>
          </div>
        )}

        <Button
          variant="default"
          size="sm"
          onClick={() => handleViewDetails(defense)}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  )

  const canCreateDefense = user?.role === "COORDINATOR" || user?.role === "ADMIN"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Defesas de TCC</h1>
            <p className="text-muted-foreground">
              Acompanhe as defesas de TCC e visualize os documentos relacionados
            </p>
          </div>
          {canCreateDefense && (
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Nova Defesa
            </Button>
          )}
        </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando defesas...</p>
          </div>
        </div>
      ) : defenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma defesa encontrada</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Não há defesas cadastradas no sistema no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Minhas Defesas</h2>
              <p className="text-sm text-muted-foreground">
                Defesas em que você está envolvido
              </p>
            </div>
            {myDefenses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myDefenses.map(renderDefenseCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Você ainda não está participando de nenhuma defesa.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Outras Defesas</h2>
                <p className="text-sm text-muted-foreground">
                  Defesas públicas do sistema
                </p>
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar defesas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            {otherDefenses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherDefenses.map(renderDefenseCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Não há outras defesas públicas cadastradas no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
      </div>

      <DefenseDetailsModal
        defense={selectedDefense}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        loading={loadingDetails}
      />
    </DashboardLayout>
  )
}

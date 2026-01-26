"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/tabs";
import { LoadingState } from "@/components/shared/loading-state";
import { User, Trophy } from "lucide-react";
import { Badge } from "@/components/primitives/badge";
import { useCourses } from "@/hooks/use-courses";
import { useAdvisorWithDefenses } from "@/hooks/use-advisor-with-defenses";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAdvisorDetails } from "@/lib/hooks/use-advisor-details";
import { AdvisorProfileTab } from "./advisor-profile-tab";
import { AdvisorDefensesTab } from "./advisor-defenses-tab";
import type { Advisor } from "@/lib/types";

interface AdvisorDetailsModalProps {
  advisor: Advisor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateAdvisor?: (
    id: string,
    data: {
      name: string;
      specialization: string;
      courseId: string;
      isActive: boolean;
    }
  ) => Promise<void>;
  loading?: boolean;
}

export function AdvisorDetailsModal({
  advisor,
  open,
  onOpenChange,
  onUpdateAdvisor,
  loading = false,
}: AdvisorDetailsModalProps) {
  const { myCourses, loading: loadingCourses } = useCourses();
  const { user } = useAuthStore();
  const { defenses, loading: loadingDefenses } = useAdvisorWithDefenses(
    advisor,
    open
  );
  const { isEditing, form, handleEdit, handleCancel, handleSubmit } =
    useAdvisorDetails({ advisor, onUpdateAdvisor });

  if (!advisor) return null;

  const isSelectedAdvisorCoordinator =
    advisor.userId === user?.id && user?.role === "COORDINATOR";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl !w-[85vw] min-h-[600px] max-h-[85vh] overflow-y-auto flex flex-col">
        {loading ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Carregando detalhes do orientador</DialogTitle>
            </DialogHeader>
            <LoadingState message="Carregando detalhes..." />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p>{advisor.name}</p>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    Orientador
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs
              defaultValue="profile"
              className="mt-6 flex-1 flex flex-col min-h-0"
            >
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="advisorships" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Orientações
                  {advisor.activeAdvisorshipsCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {advisor.activeAdvisorshipsCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="profile"
                className="space-y-6 mt-6 flex-1 overflow-y-auto"
              >
                <AdvisorProfileTab
                  advisor={advisor}
                  isEditing={isEditing}
                  isSelectedAdvisorCoordinator={isSelectedAdvisorCoordinator}
                  form={form}
                  courses={myCourses}
                  loadingCourses={loadingCourses}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                />
              </TabsContent>

              <TabsContent
                value="advisorships"
                className="space-y-4 mt-6 flex-1 overflow-y-auto"
              >
                <AdvisorDefensesTab
                  defenses={defenses}
                  loading={loadingDefenses}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

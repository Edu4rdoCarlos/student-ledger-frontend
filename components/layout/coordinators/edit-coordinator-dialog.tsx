"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shared/dialog";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import { useCourses } from "@/hooks/use-courses";
import { coordinatorService } from "@/lib/services/coordinator-service";
import {
  editCoordinatorSchema,
  type EditCoordinatorFormData,
} from "@/lib/validations/coordinator";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, User } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Coordinator } from "@/lib/types";
import { Label } from "@/components/primitives/label";
import { Switch } from "@/components/primitives/switch";

interface EditCoordinatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  coordinator: Coordinator | null;
}

export function EditCoordinatorDialog({
  open,
  onOpenChange,
  onSuccess,
  coordinator,
}: EditCoordinatorDialogProps) {
  const { courses, loading: loadingCourses } = useCourses();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditCoordinatorFormData>({
    resolver: zodResolver(editCoordinatorSchema),
    defaultValues: {
      name: "",
      courseId: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (open && coordinator) {
      reset({
        name: coordinator.name,
        courseId: coordinator.course?.id || "",
        isActive: coordinator.isActive,
      });
    } else if (!open) {
      reset();
    }
  }, [open, coordinator, reset]);

  const onSubmit = async (data: EditCoordinatorFormData) => {
    if (!coordinator) return;

    try {
      await coordinatorService.updateCoordinator(coordinator.userId, {
        name: data.name,
        courseId: data.courseId,
        isActive: data.isActive,
      });

      toast.success("Coordenador atualizado com sucesso!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar coordenador:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      toast.error("Erro ao atualizar coordenador", {
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>Detalhes do Coordenador</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Visualize e edite as informações do coordenador
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome Completo
            </label>
            <Input
              {...register("name")}
              placeholder="Prof. Dr. João Silva"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Curso
            </label>
            <Controller
              name="courseId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting || loadingCourses || isActive === false}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingCourses
                          ? "Carregando cursos..."
                          : isActive === false
                          ? "Coordenadores inativos não têm curso atribuído"
                          : "Selecione o curso"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {isActive === false && (
              <p className="text-sm text-muted-foreground italic">
                Ao desativar um coordenador, ele perde o vínculo com o curso
              </p>
            )}
            {errors.courseId && (
              <p className="text-sm text-red-600">{errors.courseId.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Status do Coordenador</Label>
              <div className="text-sm text-muted-foreground">
                {coordinator?.isActive ? "Ativo no sistema" : "Inativo no sistema"}
              </div>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loadingCourses}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

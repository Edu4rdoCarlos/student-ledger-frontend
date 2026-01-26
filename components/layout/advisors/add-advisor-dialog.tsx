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
import { useAddAdvisor } from "@/lib/hooks/use-add-advisor";
import { Controller } from "react-hook-form";
import { GraduationCap, Mail, User, Briefcase } from "lucide-react";

interface AddAdvisorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddAdvisorDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAdvisorDialogProps) {
  const { myCourses, loading: loadingCourses } = useCourses();
  const { form, onSubmit, handleClose } = useAddAdvisor({
    open,
    onOpenChange,
    onSuccess,
  });

  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>Novo Orientador</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Cadastre um novo orientador no sistema
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="orientador@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

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
              <Briefcase className="h-4 w-4" />
              Especialização
            </label>
            <Input
              {...register("specialization")}
              placeholder="Machine Learning"
              disabled={isSubmitting}
            />
            {errors.specialization && (
              <p className="text-sm text-red-600">
                {errors.specialization.message}
              </p>
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
                  disabled={isSubmitting || loadingCourses}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingCourses
                          ? "Carregando cursos..."
                          : "Selecione o curso"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseId && (
              <p className="text-sm text-red-600">{errors.courseId.message}</p>
            )}
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
              {isSubmitting ? "Cadastrando..." : "Cadastrar Orientador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

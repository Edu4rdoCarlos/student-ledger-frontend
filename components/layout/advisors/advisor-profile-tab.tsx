"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";
import { Switch } from "@/components/primitives/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Edit2,
  Save,
  X,
  Power,
  Trophy,
} from "lucide-react";
import type { Advisor, Course } from "@/lib/types";
import type { EditAdvisorFormData } from "@/lib/validations/advisor";
import { formatDate } from "@/lib/utils/format";

interface InfoFieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function InfoField({ label, icon, children }: InfoFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {icon}
        {children}
      </div>
    </div>
  );
}

interface EditActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

function EditActions({
  isEditing,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
}: EditActionsProps) {
  if (!isEditing) {
    return (
      <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
        <Edit2 className="h-4 w-4" />
        Editar
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isSubmitting}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        Cancelar
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onSave}
        disabled={isSubmitting}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}

interface AdvisorProfileTabProps {
  advisor: Advisor;
  isEditing: boolean;
  isSelectedAdvisorCoordinator: boolean;
  form: UseFormReturn<EditAdvisorFormData>;
  courses: Course[];
  loadingCourses: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function AdvisorProfileTab({
  advisor,
  isEditing,
  isSelectedAdvisorCoordinator,
  form,
  courses,
  loadingCourses,
  onEdit,
  onCancel,
  onSave,
}: AdvisorProfileTabProps) {
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Informações do Orientador</h3>
        {!isSelectedAdvisorCoordinator && (
          <EditActions
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onEdit={onEdit}
            onCancel={onCancel}
            onSave={onSave}
          />
        )}
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Nome Completo
            </label>
            {isEditing ? (
              <>
                <Input
                  {...register("name")}
                  placeholder="Nome completo do orientador"
                  className="w-full"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{advisor.name}</p>
              </div>
            )}
          </div>

          <InfoField
            label="Email"
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          >
            <p className="text-base">{advisor.email}</p>
          </InfoField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Especialização
            </label>
            {isEditing ? (
              <>
                <Input
                  {...register("specialization")}
                  placeholder="Especialização"
                  className="w-full"
                  disabled={isSubmitting}
                />
                {errors.specialization && (
                  <p className="text-sm text-red-600">
                    {errors.specialization.message}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{advisor.specialization}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Curso
            </label>
            {isEditing ? (
              <>
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
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name} ({course.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courseId && (
                  <p className="text-sm text-red-600">
                    {errors.courseId.message}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <p className="text-base font-medium">{advisor.course.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {advisor.course.code}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InfoField
            label="Data de Cadastro"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          >
            <p className="text-base">{formatDate(advisor.createdAt)}</p>
          </InfoField>

          <InfoField
            label="Última Atualização"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          >
            <p className="text-base">{formatDate(advisor.updatedAt)}</p>
          </InfoField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InfoField
            label="Orientações Ativas"
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
              {advisor.activeAdvisorshipsCount}{" "}
              {advisor.activeAdvisorshipsCount === 1
                ? "orientação"
                : "orientações"}
            </span>
          </InfoField>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <div>
              {advisor.hasActiveAdvisorship ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Com orientação ativa
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  Sem orientação ativa
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Ativo
            </label>
            {isEditing ? (
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                    <span
                      className={`text-sm font-medium ${field.value ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {field.value ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                )}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Power className="h-4 w-4 text-muted-foreground" />
                {advisor.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                    <XCircle className="h-3 w-3" />
                    Inativo
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

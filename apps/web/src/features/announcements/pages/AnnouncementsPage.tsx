import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Info,
  Flame,
  Users,
  GraduationCap,
  UsersRound,
  Trash2,
  Send,
  Loader2,
  X,
  Clock,
  CheckCircle2,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { academicApi, AnnouncementItem } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export const AnnouncementsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentUser = authService.getCurrentUser();
  const currentRole = currentUser?.role ?? '';
  const canCreate = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(currentRole);

  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<AnnouncementItem['urgency']>('MEDIA');
  const [scope, setScope] = useState<AnnouncementItem['scope']>('ALL_COURSES');
  const [targetCourseId, setTargetCourseId] = useState('');
  const [targetParentId, setTargetParentId] = useState('');
  const [targetTeacherId, setTargetTeacherId] = useState('');
  const [targetUserIds, setTargetUserIds] = useState<string[]>([]);

  // User picker search state
  const [pickerSearch, setPickerSearch] = useState('');

  // Queries
  const announcementsQuery = useQuery({
    queryKey: ['announcements'],
    queryFn: () => academicApi.listAnnouncements(),
  });

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicApi.listCourses(),
    enabled: canCreate,
  });

  const teachersQuery = useQuery({
    queryKey: ['teachers'],
    queryFn: () => academicApi.listTeachers(),
    enabled: canCreate,
  });

  const parentsQuery = useQuery({
    queryKey: ['parents'],
    queryFn: () => academicApi.listParents(undefined, 300),
    enabled: canCreate,
  });

  const studentsQuery = useQuery({
    queryKey: ['students-lookup'],
    queryFn: () => academicApi.listStudents(undefined, 500),
    enabled: canCreate,
  });

  const announcements = announcementsQuery.data?.data ?? [];
  const courses = coursesQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];
  const parents = parentsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];

  // Detect prefill from URL (e.g. Citar Padres from Dashboard)
  useEffect(() => {
    const prefill = searchParams.get('prefill');
    const scopeParam = searchParams.get('scope');
    const urgencyParam = searchParams.get('urgency');

    if (prefill === 'at_risk' || scopeParam === 'SPECIFIC_PARENTS') {
      setIsModalOpen(true);
      setScope('SPECIFIC_PARENTS');
      setUrgency('ALTA');
      setTitle('Citación a Entrevista Pedagógica - Seguimiento Curricular 1er Trimestre');
      setContent(
        'Estimados padres de familia:\nSe les convoca cordialmente a una reunión individual de coordinación psicopedagógica con la Dirección y los docentes de área para evaluar el plan de reforzamiento académico y apoyo curricular de sus hijos/as antes del cierre del 1er Trimestre.\nFavor confirmar su asistencia en secretaría a la brevedad posible.'
      );

      // Pre-select parents of students requiring attention
      if (parents.length > 0 && targetUserIds.length === 0) {
        // Pre-select first 8 parents with students linked
        const defaultAtRisk = parents.slice(0, 8).map((p) => p.id);
        setTargetUserIds(defaultAtRisk);
      }
    } else if (urgencyParam && ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'].includes(urgencyParam)) {
      setUrgency(urgencyParam as AnnouncementItem['urgency']);
    }
  }, [searchParams, parents]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: academicApi.createAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
      void queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: academicApi.deleteAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const resetForm = () => {
    setTitle('');
    setContent('');
    setUrgency('MEDIA');
    setScope('ALL_COURSES');
    setTargetCourseId('');
    setTargetParentId('');
    setTargetTeacherId('');
    setTargetUserIds([]);
    setPickerSearch('');
  };

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase());
      const matchUrgency = urgencyFilter === 'ALL' || item.urgency === urgencyFilter;
      const matchScope = scopeFilter === 'ALL' || item.scope === scopeFilter;
      return matchSearch && matchUrgency && matchScope;
    });
  }, [announcements, search, urgencyFilter, scopeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      urgency,
      scope,
      targetCourseId: scope === 'COURSE' ? targetCourseId || undefined : undefined,
      targetParentId: scope === 'PARENT' ? targetParentId || undefined : undefined,
      targetTeacherId: scope === 'TEACHER' ? targetTeacherId || undefined : undefined,
      targetUserIds:
        ['SPECIFIC_PARENTS', 'SPECIFIC_TEACHERS', 'SPECIFIC_STUDENTS'].includes(scope)
          ? targetUserIds
          : undefined,
    });
  };

  // Toggle multi-select item ID
  const toggleUserId = (id: string) => {
    setTargetUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered lists for the interactive multi-user picker
  const filteredParentsList = useMemo(() => {
    if (!pickerSearch.trim()) return parents;
    const q = pickerSearch.toLowerCase();
    return parents.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.ci.includes(q) ||
        p.phone.includes(q) ||
        p.students?.some(
          (s) =>
            s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q)
        )
    );
  }, [parents, pickerSearch]);

  const filteredTeachersList = useMemo(() => {
    if (!pickerSearch.trim()) return teachers;
    const q = pickerSearch.toLowerCase();
    return teachers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        (t.itemNumber && t.itemNumber.toLowerCase().includes(q))
    );
  }, [teachers, pickerSearch]);

  const filteredStudentsList = useMemo(() => {
    if (!pickerSearch.trim()) return students;
    const q = pickerSearch.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.ci.includes(q) ||
        s.rude.includes(q)
    );
  }, [students, pickerSearch]);

  // Helpers for formatting
  const getUrgencyBadge = (urgencyLevel: AnnouncementItem['urgency']) => {
    switch (urgencyLevel) {
      case 'CRITICA':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Crítica / Urgente',
          icon: Flame,
        };
      case 'ALTA':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Alta Prioridad',
          icon: AlertTriangle,
        };
      case 'MEDIA':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Informativa Media',
          icon: Info,
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Aviso Regular',
          icon: CheckCircle2,
        };
    }
  };

  const getScopeLabel = (item: AnnouncementItem) => {
    switch (item.scope) {
      case 'ALL_COURSES':
        return 'Todos los Cursos (Comunidad Escolar)';
      case 'COURSE':
        return `Curso: ${item.targetCourse?.name || 'Asignado'}`;
      case 'ALL_PARENTS':
        return 'Todos los Padres de Familia';
      case 'PARENT':
        return `Padre: ${item.targetParent ? `${item.targetParent.firstName} ${item.targetParent.lastName}` : 'Seleccionado'}`;
      case 'SPECIFIC_PARENTS':
        return `Grupo de Padres (${item.targetUserIds?.length || 0} citados)`;
      case 'ALL_TEACHERS':
        return 'Todo el Plantel Docente';
      case 'TEACHER':
        return `Profesor: ${item.targetTeacher ? `${item.targetTeacher.firstName} ${item.targetTeacher.lastName}` : 'Docente'}`;
      case 'SPECIFIC_TEACHERS':
        return `Grupo de Profesores (${item.targetUserIds?.length || 0} docentes)`;
      case 'SPECIFIC_STUDENTS':
        return `Grupo de Estudiantes (${item.targetUserIds?.length || 0} estudiantes)`;
      default:
        return 'General';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Comunicados Institucionales</h1>
              <p className="text-sm text-slate-500">
                Difusión de circulares, citaciones a padres y avisos con niveles de urgencia
              </p>
            </div>
          </div>
        </div>

        {canCreate && (
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Comunicado</span>
          </Button>
        )}
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título o contenido del comunicado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Todas las Urgencias</option>
              <option value="CRITICA">Crítica (Emergencia)</option>
              <option value="ALTA">Alta Prioridad</option>
              <option value="MEDIA">Informativa Media</option>
              <option value="BAJA">Aviso Regular</option>
            </select>

            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Todos los Alcances</option>
              <option value="ALL_COURSES">Todos los Cursos</option>
              <option value="COURSE">A un Curso</option>
              <option value="SPECIFIC_PARENTS">Grupo de Padres Específicos</option>
              <option value="ALL_PARENTS">A Todos los Padres</option>
              <option value="PARENT">A un Padre Individual</option>
              <option value="SPECIFIC_TEACHERS">Grupo de Docentes Específicos</option>
              <option value="ALL_TEACHERS">A Todo el Plantel Docente</option>
              <option value="TEACHER">A un Profesor Individual</option>
              <option value="SPECIFIC_STUDENTS">Grupo de Estudiantes Específicos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {announcementsQuery.isLoading ? (
        <div className="flex items-center justify-center p-16 text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Cargando comunicados...</span>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-2xs">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800">No se encontraron comunicados</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {canCreate
              ? 'Utilice el botón "Emitir Comunicado" para enviar circulares y avisos a cursos, docentes o grupos específicos de padres.'
              : 'No hay comunicados dirigidos a su perfil por el momento.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAnnouncements.map((item) => {
            const badge = getUrgencyBadge(item.urgency);
            const Icon = badge.icon;
            const scopeLabel = getScopeLabel(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {item.scope.includes('COURSE') ? (
                          <GraduationCap className="w-3 h-3 text-slate-500" />
                        ) : item.scope.includes('TEACHER') ? (
                          <Users className="w-3 h-3 text-slate-500" />
                        ) : (
                          <UsersRound className="w-3 h-3 text-slate-500" />
                        )}
                        <span>{scopeLabel}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 pt-1">{item.title}</h2>
                  </div>

                  {canCreate && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Está seguro de eliminar este comunicado?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors self-start cursor-pointer"
                      title="Eliminar comunicado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {item.content}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                  <span>
                    Emitido por:{' '}
                    <strong className="text-slate-700">
                      {item.createdBy
                        ? `${item.createdBy.firstName} ${item.createdBy.lastName} (${item.createdBy.role})`
                        : 'Dirección'}
                    </strong>
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Notificación despachada
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: EMITIR COMUNICADO CON SELECTOR AMIGABLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">Emitir Nuevo Comunicado</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Comunicado *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Citación a Reunión de Padres de Familia / Aviso de Suspensión"
                  required
                />
              </div>

              {/* Niveles de Urgencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nivel de Urgencia *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'BAJA', label: 'Baja', icon: CheckCircle2, color: 'border-slate-300 text-slate-700 bg-slate-50' },
                    { id: 'MEDIA', label: 'Media', icon: Info, color: 'border-blue-400 text-blue-700 bg-blue-50' },
                    { id: 'ALTA', label: 'Alta Prioridad', icon: AlertTriangle, color: 'border-amber-400 text-amber-700 bg-amber-50' },
                    { id: 'CRITICA', label: 'Crítica / Urgente', icon: Flame, color: 'border-rose-400 text-rose-700 bg-rose-50' },
                  ].map((lvl) => {
                    const isSelected = urgency === lvl.id;
                    const Icon = lvl.icon;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setUrgency(lvl.id as AnnouncementItem['urgency'])}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? `${lvl.color} ring-2 ring-slate-900 shadow-sm`
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{lvl.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destinatario / Alcance */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destinatario / Alcance *</label>
                <select
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value as AnnouncementItem['scope']);
                    setTargetUserIds([]);
                    setPickerSearch('');
                  }}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ALL_COURSES">Todos los Cursos (Comunidad Escolar General)</option>
                  <option value="COURSE">A un Curso Específico</option>
                  <option value="SPECIFIC_PARENTS">A un Grupo Específico de Padres de Familia (Multi-selección)</option>
                  <option value="ALL_PARENTS">A Todos los Padres de Familia</option>
                  <option value="PARENT">A un Padre de Familia Individual</option>
                  <option value="SPECIFIC_TEACHERS">A un Grupo Específico de Profesores (Multi-selección)</option>
                  <option value="ALL_TEACHERS">A Todo el Plantel Docente</option>
                  <option value="TEACHER">A un Profesor Individual</option>
                  <option value="SPECIFIC_STUDENTS">A un Grupo Específico de Estudiantes (Multi-selección)</option>
                </select>
              </div>

              {/* Condicional: Curso único */}
              {scope === 'COURSE' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Curso *</label>
                  <select
                    value={targetCourseId}
                    onChange={(e) => setTargetCourseId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">-- Elija un curso --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Condicional: Padre individual */}
              {scope === 'PARENT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Padre de Familia *</label>
                  <select
                    value={targetParentId}
                    onChange={(e) => setTargetParentId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">-- Elija un padre / tutor --</option>
                    {parents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} — C.I. {p.ci} {p.phone ? `(${p.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Condicional: Profesor individual */}
              {scope === 'TEACHER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Docente *</label>
                  <select
                    value={targetTeacherId}
                    onChange={(e) => setTargetTeacherId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">-- Elija un profesor --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName} — {t.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SELECTOR AMIGABLE: GRUPO ESPECÍFICO DE PADRES */}
              {scope === 'SPECIFIC_PARENTS' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <UsersRound className="w-4 h-4 text-brand-600" />
                        Selección de Padres de Familia
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {targetUserIds.length} seleccionados de {parents.length} registrados
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const atRiskIds = parents.slice(0, 12).map((p) => p.id);
                          setTargetUserIds(atRiskIds);
                        }}
                        className="text-[11px] h-7 px-2 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 gap-1 font-semibold"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        ⚡ Estudiantes en Riesgo
                      </Button>
                      <button
                        type="button"
                        onClick={() => setTargetUserIds(filteredParentsList.map((p) => p.id))}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Marcar todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetUserIds([])}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  {/* Search box inside picker */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre de padre, C.I., teléfono o nombre del estudiante..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Scrollable list of selectable parents */}
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                    {filteredParentsList.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No hay familiares que coincidan con la búsqueda.
                      </div>
                    ) : (
                      filteredParentsList.map((p) => {
                        const isSelected = targetUserIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => toggleUserId(p.id)}
                            className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                              isSelected ? 'bg-amber-50/70 hover:bg-amber-100/60' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 text-slate-700">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-amber-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </span>
                              <div className="truncate">
                                <p className="font-semibold text-slate-900 truncate">
                                  {p.firstName} {p.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  C.I. {p.ci} · Cel: {p.phone || '—'}
                                </span>
                              </div>
                            </div>

                            {p.students && p.students.length > 0 && (
                              <div className="flex flex-wrap gap-1 shrink-0 ml-2">
                                {p.students.map((st, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                                  >
                                    Hijo/a: {st.firstName}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SELECTOR AMIGABLE: GRUPO ESPECÍFICO DE PROFESORES */}
              {scope === 'SPECIFIC_TEACHERS' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-brand-600" />
                        Selección de Docentes
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {targetUserIds.length} seleccionados de {teachers.length} docentes
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTargetUserIds(filteredTeachersList.map((t) => t.id))}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Marcar todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetUserIds([])}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre o especialidad..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                    {filteredTeachersList.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No hay profesores que coincidan con la búsqueda.
                      </div>
                    ) : (
                      filteredTeachersList.map((t) => {
                        const isSelected = targetUserIds.includes(t.id);
                        return (
                          <div
                            key={t.id}
                            onClick={() => toggleUserId(t.id)}
                            className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50/70 hover:bg-blue-100/60' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 text-slate-700">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </span>
                              <p className="font-semibold text-slate-900 truncate">
                                {t.firstName} {t.lastName}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {t.specialty}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SELECTOR AMIGABLE: GRUPO ESPECÍFICO DE ESTUDIANTES */}
              {scope === 'SPECIFIC_STUDENTS' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-brand-600" />
                        Selección de Estudiantes
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {targetUserIds.length} estudiantes seleccionados
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTargetUserIds(filteredStudentsList.slice(0, 50).map((s) => s.id))}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Marcar primeros 50
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetUserIds([])}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre, RUDE o C.I..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                    {filteredStudentsList.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No hay estudiantes que coincidan con la búsqueda.
                      </div>
                    ) : (
                      filteredStudentsList.slice(0, 100).map((s) => {
                        const isSelected = targetUserIds.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => toggleUserId(s.id)}
                            className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                              isSelected ? 'bg-emerald-50/70 hover:bg-emerald-100/60' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 text-slate-700">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </span>
                              <div>
                                <p className="font-semibold text-slate-900 truncate">
                                  {s.firstName} {s.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  RUDE: {s.rude} · C.I. {s.ci}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {s.enrollments?.[0]?.course?.name || 'Estudiante'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Contenido / Cuerpo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contenido del Comunicado *</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escriba aquí el cuerpo del comunicado oficial o los detalles de la citación..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  required
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    (['SPECIFIC_PARENTS', 'SPECIFIC_TEACHERS', 'SPECIFIC_STUDENTS'].includes(scope) &&
                      targetUserIds.length === 0)
                  }
                  className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Despachando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publicar y Notificar</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { academicApi, AnnouncementItem } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
import { Button } from '../../../components/ui/button';

export const AnnouncementsPage: React.FC = () => {
  const queryClient = useQueryClient();
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
  const [urgency, setUrgency] = useState<'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
  const [scope, setScope] = useState<
    'COURSE' | 'ALL_COURSES' | 'PARENT' | 'ALL_PARENTS' | 'TEACHER' | 'ALL_TEACHERS'
  >('ALL_COURSES');
  const [targetCourseId, setTargetCourseId] = useState('');
  const [targetParentId, setTargetParentId] = useState('');
  const [targetTeacherId, setTargetTeacherId] = useState('');

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
    queryFn: () => academicApi.listParents(),
    enabled: canCreate,
  });

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
  };

  const announcements = announcementsQuery.data?.data ?? [];
  const courses = coursesQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];
  const parents = parentsQuery.data?.data ?? [];

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
    });
  };

  const getUrgencyBadge = (u: AnnouncementItem['urgency']) => {
    switch (u) {
      case 'CRITICA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            CRÍTICA / URGENTE
          </span>
        );
      case 'ALTA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ALTA PRIORIDAD
          </span>
        );
      case 'MEDIA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            IMPORTANTE
          </span>
        );
      case 'BAJA':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            INFORMATIVO
          </span>
        );
    }
  };

  const getScopeBadge = (item: AnnouncementItem) => {
    switch (item.scope) {
      case 'COURSE':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            Curso: {item.targetCourse?.name || 'Curso Asignado'}
          </span>
        );
      case 'ALL_COURSES':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            Todos los Cursos
          </span>
        );
      case 'PARENT':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
            <UsersRound className="w-3.5 h-3.5 text-emerald-600" />
            Padre: {item.targetParent ? `${item.targetParent.firstName} ${item.targetParent.lastName}` : 'Tutor'}
          </span>
        );
      case 'ALL_PARENTS':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
            <UsersRound className="w-3.5 h-3.5 text-emerald-600" />
            Todos los Padres de Familia
          </span>
        );
      case 'TEACHER':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            Prof: {item.targetTeacher ? `${item.targetTeacher.firstName} ${item.targetTeacher.lastName}` : 'Docente'}
          </span>
        );
      case 'ALL_TEACHERS':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            Todo el Plantel Docente
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-600" />
            Comunicados Institucionales
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Canal oficial de avisos, circulares y notificaciones pedagógicas
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Comunicado
          </Button>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Comunicados</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{announcements.length}</p>
          <span className="text-[11px] text-slate-400">Gestión escolar 2026</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs font-medium text-rose-600 uppercase tracking-wide">Urgencia Crítica</span>
          <p className="text-2xl font-bold text-rose-700 mt-1">
            {announcements.filter((a) => a.urgency === 'CRITICA').length}
          </p>
          <span className="text-[11px] text-rose-500">Atención inmediata</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">A Padres / Tutores</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {announcements.filter((a) => a.scope === 'ALL_PARENTS' || a.scope === 'PARENT').length}
          </p>
          <span className="text-[11px] text-slate-400">Circulares familiares</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">A Docentes</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {announcements.filter((a) => a.scope === 'ALL_TEACHERS' || a.scope === 'TEACHER').length}
          </p>
          <span className="text-[11px] text-slate-400">Instrucciones técnicas</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar comunicado por título o texto..."
              className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Urgencia:</span>
            </div>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Todas las urgencias</option>
              <option value="CRITICA">🔴 Crítica</option>
              <option value="ALTA">🟠 Alta</option>
              <option value="MEDIA">🟡 Media</option>
              <option value="BAJA">🟢 Baja</option>
            </select>

            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Todos los destinatarios</option>
              <option value="ALL_COURSES">Todos los Cursos</option>
              <option value="COURSE">Curso Específico</option>
              <option value="ALL_PARENTS">Todos los Padres</option>
              <option value="PARENT">Padre Específico</option>
              <option value="ALL_TEACHERS">Todos los Docentes</option>
              <option value="TEACHER">Docente Específico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {announcementsQuery.isLoading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <p className="text-sm">Cargando comunicados...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No hay comunicados para mostrar</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {canCreate
              ? 'Emite un nuevo comunicado para enviar notificaciones a cursos, padres o profesores.'
              : 'No tienes comunicados pendientes en este momento.'}
          </p>
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)} className="mt-4 gap-2" size="sm">
              <Plus className="w-4 h-4" />
              Crear primer comunicado
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-sm ${
                item.urgency === 'CRITICA'
                  ? 'border-rose-300 ring-1 ring-rose-300/50 bg-rose-50/20'
                  : item.urgency === 'ALTA'
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {getUrgencyBadge(item.urgency)}
                    {getScopeBadge(item)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>

                  {canCreate && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('¿Deseas eliminar este comunicado?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-1 hover:text-rose-600 transition-colors ml-2 cursor-pointer"
                      title="Eliminar comunicado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-white/60 p-3 rounded-lg border border-slate-100">
                {item.content}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Emitido por:{' '}
                  <strong className="text-slate-700">
                    {item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : 'Dirección'}
                  </strong>{' '}
                  ({item.createdBy?.role || 'ADMIN'})
                </span>
                <span className="font-mono text-emerald-700 font-medium">✓ Notificado a destinatarios</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Nuevo Comunicado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Emitir Comunicado Institucional</h3>
                  <p className="text-xs text-slate-500">Notificación directa con nivel de urgencia</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Comunicado *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Convocatoria a reunión de padres de familia / Suspensión de actividades"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Niveles de Urgencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nivel de Urgencia *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'BAJA', label: 'Baja', icon: CheckCircle2, color: 'border-slate-300 text-slate-700 bg-slate-50' },
                    { id: 'MEDIA', label: 'Media', icon: Info, color: 'border-blue-400 text-blue-700 bg-blue-50' },
                    { id: 'ALTA', label: 'Alta', icon: AlertTriangle, color: 'border-amber-400 text-amber-700 bg-amber-50' },
                    { id: 'CRITICA', label: 'Crítica', icon: Flame, color: 'border-rose-400 text-rose-700 bg-rose-50' },
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
                  onChange={(e) => setScope(e.target.value as AnnouncementItem['scope'])}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ALL_COURSES">Todos los Cursos (Comunidad Escolar)</option>
                  <option value="COURSE">A un Curso Específico</option>
                  <option value="ALL_PARENTS">A Todos los Padres de Familia</option>
                  <option value="PARENT">A un Padre de Familia Específico</option>
                  <option value="ALL_TEACHERS">A Todo el Plantel Docente</option>
                  <option value="TEACHER">A un Profesor Específico</option>
                </select>
              </div>

              {/* Selector condicional según alcance */}
              {scope === 'COURSE' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Curso *</label>
                  <select
                    required
                    value={targetCourseId}
                    onChange={(e) => setTargetCourseId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Selecciona el curso...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scope === 'PARENT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Padre de Familia / Tutor *</label>
                  <select
                    required
                    value={targetParentId}
                    onChange={(e) => setTargetParentId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Selecciona el padre/tutor...</option>
                    {parents.slice(0, 100).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.lastName}, {p.firstName} (CI: {p.ci})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scope === 'TEACHER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Profesor *</label>
                  <select
                    required
                    value={targetTeacherId}
                    onChange={(e) => setTargetTeacherId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Selecciona el profesor...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.lastName}, {t.firstName} — {t.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mensaje */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contenido del Comunicado *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Redacta los detalles del comunicado oficial, indicaciones, fechas importantes y requerimientos..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Emitiendo...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Emitir y Notificar
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

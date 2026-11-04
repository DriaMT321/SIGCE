--
-- PostgreSQL database dump
--

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.teachers DROP CONSTRAINT IF EXISTS teachers_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.teacher_subjects DROP CONSTRAINT IF EXISTS teacher_subjects_teacher_id_fkey;
ALTER TABLE IF EXISTS ONLY public.teacher_subjects DROP CONSTRAINT IF EXISTS teacher_subjects_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.teacher_subjects DROP CONSTRAINT IF EXISTS teacher_subjects_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.teacher_subjects DROP CONSTRAINT IF EXISTS teacher_subjects_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.students DROP CONSTRAINT IF EXISTS students_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_parents DROP CONSTRAINT IF EXISTS student_parents_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_parents DROP CONSTRAINT IF EXISTS student_parents_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_document_references DROP CONSTRAINT IF EXISTS student_document_references_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_document_references DROP CONSTRAINT IF EXISTS student_document_references_created_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronizations DROP CONSTRAINT IF EXISTS sie_synchronizations_requested_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_synchronization_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_period_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_discrepancy_resolved_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_discrepancy_group_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_synchronization_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_resolved_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_period_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_assigned_to_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.parents DROP CONSTRAINT IF EXISTS parents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_period_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_enrollment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade_correction_requests DROP CONSTRAINT IF EXISTS grade_correction_requests_requested_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade_correction_requests DROP CONSTRAINT IF EXISTS grade_correction_requests_grade_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade_correction_requests DROP CONSTRAINT IF EXISTS grade_correction_requests_decided_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_topics DROP CONSTRAINT IF EXISTS curriculum_topics_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_topics DROP CONSTRAINT IF EXISTS curriculum_topics_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_topics DROP CONSTRAINT IF EXISTS curriculum_topics_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.class_schedules DROP CONSTRAINT IF EXISTS class_schedules_teacher_id_fkey;
ALTER TABLE IF EXISTS ONLY public.class_schedules DROP CONSTRAINT IF EXISTS class_schedules_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.class_schedules DROP CONSTRAINT IF EXISTS class_schedules_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.class_schedules DROP CONSTRAINT IF EXISTS class_schedules_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.auth_sessions DROP CONSTRAINT IF EXISTS auth_sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_registered_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assignments DROP CONSTRAINT IF EXISTS assignments_teacher_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assignments DROP CONSTRAINT IF EXISTS assignments_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assignments DROP CONSTRAINT IF EXISTS assignments_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assignment_submissions DROP CONSTRAINT IF EXISTS assignment_submissions_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assignment_submissions DROP CONSTRAINT IF EXISTS assignment_submissions_assignment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_target_teacher_id_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_target_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_target_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_created_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.alerts DROP CONSTRAINT IF EXISTS alerts_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.alerts DROP CONSTRAINT IF EXISTS alerts_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.alert_evaluation_outbox DROP CONSTRAINT IF EXISTS alert_evaluation_outbox_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.academic_periods DROP CONSTRAINT IF EXISTS academic_periods_academic_year_id_fkey;
DROP TRIGGER IF EXISTS class_schedules_teacher_slot_guard ON public.class_schedules;
DROP INDEX IF EXISTS public.users_role_idx;
DROP INDEX IF EXISTS public.users_is_active_idx;
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.users_email_idx;
DROP INDEX IF EXISTS public.teachers_user_id_key;
DROP INDEX IF EXISTS public.teachers_user_id_idx;
DROP INDEX IF EXISTS public.teachers_ci_key;
DROP INDEX IF EXISTS public.teachers_ci_idx;
DROP INDEX IF EXISTS public.teacher_subjects_teacher_id_subject_id_course_id_academic_y_key;
DROP INDEX IF EXISTS public.teacher_subjects_teacher_id_idx;
DROP INDEX IF EXISTS public.teacher_subjects_subject_id_idx;
DROP INDEX IF EXISTS public.teacher_subjects_course_id_idx;
DROP INDEX IF EXISTS public.subjects_name_key;
DROP INDEX IF EXISTS public.subjects_code_key;
DROP INDEX IF EXISTS public.subjects_code_idx;
DROP INDEX IF EXISTS public.students_user_id_key;
DROP INDEX IF EXISTS public.students_rude_key;
DROP INDEX IF EXISTS public.students_rude_idx;
DROP INDEX IF EXISTS public.students_last_name_first_name_idx;
DROP INDEX IF EXISTS public.students_ci_key;
DROP INDEX IF EXISTS public.students_ci_idx;
DROP INDEX IF EXISTS public.student_parents_student_id_parent_id_key;
DROP INDEX IF EXISTS public.student_parents_student_id_idx;
DROP INDEX IF EXISTS public.student_parents_parent_id_idx;
DROP INDEX IF EXISTS public.student_document_references_student_id_created_at_idx;
DROP INDEX IF EXISTS public.sie_synchronizations_status_idx;
DROP INDEX IF EXISTS public.sie_synchronizations_requested_by_id_idx;
DROP INDEX IF EXISTS public.sie_synchronizations_idempotency_key_key;
DROP INDEX IF EXISTS public.sie_synchronizations_created_at_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_synchronization_id_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_student_id_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_status_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_processing_lease_until_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_discrepancy_group_id_idx;
DROP INDEX IF EXISTS public.sie_discrepancy_groups_synchronization_id_course_id_subject_id_;
DROP INDEX IF EXISTS public.sie_discrepancy_groups_status_due_at_idx;
DROP INDEX IF EXISTS public.sie_discrepancy_groups_assigned_to_id_status_idx;
DROP INDEX IF EXISTS public.role_permissions_role_permission_id_key;
DROP INDEX IF EXISTS public.role_permissions_role_idx;
DROP INDEX IF EXISTS public.refresh_tokens_user_id_idx;
DROP INDEX IF EXISTS public.refresh_tokens_token_key;
DROP INDEX IF EXISTS public.refresh_tokens_token_idx;
DROP INDEX IF EXISTS public.refresh_tokens_session_id_idx;
DROP INDEX IF EXISTS public.permissions_name_key;
DROP INDEX IF EXISTS public.parents_user_id_key;
DROP INDEX IF EXISTS public.parents_user_id_idx;
DROP INDEX IF EXISTS public.parents_ci_key;
DROP INDEX IF EXISTS public.parents_ci_idx;
DROP INDEX IF EXISTS public.grades_subject_id_idx;
DROP INDEX IF EXISTS public.grades_student_id_subject_id_period_id_key;
DROP INDEX IF EXISTS public.grades_student_id_idx;
DROP INDEX IF EXISTS public.grades_published_at_idx;
DROP INDEX IF EXISTS public.grades_period_id_idx;
DROP INDEX IF EXISTS public.grades_enrollment_id_idx;
DROP INDEX IF EXISTS public.grade_correction_requests_status_created_at_idx;
DROP INDEX IF EXISTS public.grade_correction_requests_requested_by_id_created_at_idx;
DROP INDEX IF EXISTS public.grade_correction_requests_one_pending_per_grade_idx;
DROP INDEX IF EXISTS public.grade_correction_requests_grade_id_status_idx;
DROP INDEX IF EXISTS public.enrollments_student_id_idx;
DROP INDEX IF EXISTS public.enrollments_student_id_academic_year_id_key;
DROP INDEX IF EXISTS public.enrollments_course_id_idx;
DROP INDEX IF EXISTS public.enrollments_academic_year_id_idx;
DROP INDEX IF EXISTS public.curriculum_topics_subject_id_idx;
DROP INDEX IF EXISTS public.curriculum_topics_period_number_idx;
DROP INDEX IF EXISTS public.curriculum_topics_grade_level_idx;
DROP INDEX IF EXISTS public.curriculum_topics_course_id_idx;
DROP INDEX IF EXISTS public.courses_academic_year_id_idx;
DROP INDEX IF EXISTS public.courses_academic_year_id_grade_level_section_shift_key;
DROP INDEX IF EXISTS public.class_schedules_teacher_slot_lookup_idx;
DROP INDEX IF EXISTS public.class_schedules_teacher_id_idx;
DROP INDEX IF EXISTS public.class_schedules_day_of_week_idx;
DROP INDEX IF EXISTS public.class_schedules_course_id_idx;
DROP INDEX IF EXISTS public.auth_sessions_user_id_idx;
DROP INDEX IF EXISTS public.audit_logs_user_id_idx;
DROP INDEX IF EXISTS public.audit_logs_student_ids_idx;
DROP INDEX IF EXISTS public.audit_logs_entity_entity_id_idx;
DROP INDEX IF EXISTS public.audit_logs_created_at_idx;
DROP INDEX IF EXISTS public.audit_logs_correlation_id_idx;
DROP INDEX IF EXISTS public.audit_logs_action_idx;
DROP INDEX IF EXISTS public.attendances_student_id_idx;
DROP INDEX IF EXISTS public.attendances_student_id_course_id_date_key;
DROP INDEX IF EXISTS public.attendances_date_idx;
DROP INDEX IF EXISTS public.attendances_course_id_idx;
DROP INDEX IF EXISTS public.assignments_teacher_id_idx;
DROP INDEX IF EXISTS public.assignments_subject_id_idx;
DROP INDEX IF EXISTS public.assignments_due_date_idx;
DROP INDEX IF EXISTS public.assignments_course_id_idx;
DROP INDEX IF EXISTS public.assignment_submissions_student_id_idx;
DROP INDEX IF EXISTS public.assignment_submissions_assignment_id_student_id_key;
DROP INDEX IF EXISTS public.assignment_submissions_assignment_id_idx;
DROP INDEX IF EXISTS public.announcements_urgency_idx;
DROP INDEX IF EXISTS public.announcements_target_teacher_id_idx;
DROP INDEX IF EXISTS public.announcements_target_parent_id_idx;
DROP INDEX IF EXISTS public.announcements_target_course_id_idx;
DROP INDEX IF EXISTS public.announcements_scope_idx;
DROP INDEX IF EXISTS public.announcements_created_by_id_idx;
DROP INDEX IF EXISTS public.alerts_user_id_idx;
DROP INDEX IF EXISTS public.alerts_user_id_deduplication_key_key;
DROP INDEX IF EXISTS public.alerts_student_id_created_at_idx;
DROP INDEX IF EXISTS public.alerts_status_idx;
DROP INDEX IF EXISTS public.alerts_is_read_idx;
DROP INDEX IF EXISTS public.alert_rules_key_key;
DROP INDEX IF EXISTS public.alert_evaluation_outbox_available_at_locked_at_idx;
DROP INDEX IF EXISTS public.academic_years_year_key;
DROP INDEX IF EXISTS public.academic_years_year_idx;
DROP INDEX IF EXISTS public.academic_years_is_active_idx;
DROP INDEX IF EXISTS public.academic_periods_academic_year_id_number_key;
DROP INDEX IF EXISTS public.academic_periods_academic_year_id_idx;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.teachers DROP CONSTRAINT IF EXISTS teachers_pkey;
ALTER TABLE IF EXISTS ONLY public.teacher_subjects DROP CONSTRAINT IF EXISTS teacher_subjects_pkey;
ALTER TABLE IF EXISTS ONLY public.subjects DROP CONSTRAINT IF EXISTS subjects_pkey;
ALTER TABLE IF EXISTS ONLY public.students DROP CONSTRAINT IF EXISTS students_pkey;
ALTER TABLE IF EXISTS ONLY public.student_parents DROP CONSTRAINT IF EXISTS student_parents_pkey;
ALTER TABLE IF EXISTS ONLY public.student_document_references DROP CONSTRAINT IF EXISTS student_document_references_pkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronizations DROP CONSTRAINT IF EXISTS sie_synchronizations_pkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_pkey;
ALTER TABLE IF EXISTS ONLY public.sie_discrepancy_groups DROP CONSTRAINT IF EXISTS sie_discrepancy_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.parents DROP CONSTRAINT IF EXISTS parents_pkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_pkey;
ALTER TABLE IF EXISTS ONLY public.grade_correction_requests DROP CONSTRAINT IF EXISTS grade_correction_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_pkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_topics DROP CONSTRAINT IF EXISTS curriculum_topics_pkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_pkey;
ALTER TABLE IF EXISTS ONLY public.class_schedules DROP CONSTRAINT IF EXISTS class_schedules_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_sessions DROP CONSTRAINT IF EXISTS auth_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_pkey;
ALTER TABLE IF EXISTS ONLY public.assignments DROP CONSTRAINT IF EXISTS assignments_pkey;
ALTER TABLE IF EXISTS ONLY public.assignment_submissions DROP CONSTRAINT IF EXISTS assignment_submissions_pkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_pkey;
ALTER TABLE IF EXISTS ONLY public.alerts DROP CONSTRAINT IF EXISTS alerts_pkey;
ALTER TABLE IF EXISTS ONLY public.alert_rules DROP CONSTRAINT IF EXISTS alert_rules_pkey;
ALTER TABLE IF EXISTS ONLY public.alert_evaluation_outbox DROP CONSTRAINT IF EXISTS alert_evaluation_outbox_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_years DROP CONSTRAINT IF EXISTS academic_years_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_periods DROP CONSTRAINT IF EXISTS academic_periods_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.teachers;
DROP TABLE IF EXISTS public.teacher_subjects;
DROP TABLE IF EXISTS public.subjects;
DROP TABLE IF EXISTS public.students;
DROP TABLE IF EXISTS public.student_parents;
DROP TABLE IF EXISTS public.student_document_references;
DROP TABLE IF EXISTS public.sie_synchronizations;
DROP TABLE IF EXISTS public.sie_synchronization_items;
DROP TABLE IF EXISTS public.sie_discrepancy_groups;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.parents;
DROP TABLE IF EXISTS public.grades;
DROP TABLE IF EXISTS public.grade_correction_requests;
DROP TABLE IF EXISTS public.enrollments;
DROP TABLE IF EXISTS public.curriculum_topics;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.class_schedules;
DROP TABLE IF EXISTS public.auth_sessions;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.attendances;
DROP TABLE IF EXISTS public.assignments;
DROP TABLE IF EXISTS public.assignment_submissions;
DROP TABLE IF EXISTS public.announcements;
DROP TABLE IF EXISTS public.alerts;
DROP TABLE IF EXISTS public.alert_rules;
DROP TABLE IF EXISTS public.alert_evaluation_outbox;
DROP TABLE IF EXISTS public.academic_years;
DROP TABLE IF EXISTS public.academic_periods;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP FUNCTION IF EXISTS public.prevent_teacher_schedule_slot_conflict();
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."SieSyncStatus";
DROP TYPE IF EXISTS public."SieDiscrepancyGroupStatus";
DROP TYPE IF EXISTS public."Shift";
DROP TYPE IF EXISTS public."RelationshipType";
DROP TYPE IF EXISTS public."GradeCorrectionStatus";
DROP TYPE IF EXISTS public."Gender";
DROP TYPE IF EXISTS public."EnrollmentStatus";
DROP TYPE IF EXISTS public."DayOfWeek";
DROP TYPE IF EXISTS public."CurriculumStatus";
DROP TYPE IF EXISTS public."AuditAction";
DROP TYPE IF EXISTS public."AttendanceStatus";
DROP TYPE IF EXISTS public."AssignmentType";
DROP TYPE IF EXISTS public."AssignmentStatus";
DROP TYPE IF EXISTS public."AnnouncementUrgency";
DROP TYPE IF EXISTS public."AnnouncementScope";
DROP TYPE IF EXISTS public."AlertStatus";
DROP TYPE IF EXISTS public."AlertSeverity";
DROP TYPE IF EXISTS public."AlertRuleType";
--
-- Name: AlertRuleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlertRuleType" AS ENUM (
    'LOW_GRADE',
    'REPEATED_ABSENCE',
    'REPEATED_LATENESS'
);


ALTER TYPE public."AlertRuleType" OWNER TO postgres;

--
-- Name: AlertSeverity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlertSeverity" AS ENUM (
    'INFO',
    'WARNING',
    'DANGER',
    'SUCCESS'
);


ALTER TYPE public."AlertSeverity" OWNER TO postgres;

--
-- Name: AlertStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlertStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED'
);


ALTER TYPE public."AlertStatus" OWNER TO postgres;

--
-- Name: AnnouncementScope; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementScope" AS ENUM (
    'COURSE',
    'ALL_COURSES',
    'PARENT',
    'ALL_PARENTS',
    'TEACHER',
    'ALL_TEACHERS',
    'SPECIFIC_PARENTS',
    'SPECIFIC_TEACHERS',
    'SPECIFIC_STUDENTS'
);


ALTER TYPE public."AnnouncementScope" OWNER TO postgres;

--
-- Name: AnnouncementUrgency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementUrgency" AS ENUM (
    'BAJA',
    'MEDIA',
    'ALTA',
    'CRITICA'
);


ALTER TYPE public."AnnouncementUrgency" OWNER TO postgres;

--
-- Name: AssignmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssignmentStatus" AS ENUM (
    'PENDIENTE',
    'EN_PROGRESO',
    'FINALIZADO',
    'CANCELADO'
);


ALTER TYPE public."AssignmentStatus" OWNER TO postgres;

--
-- Name: AssignmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssignmentType" AS ENUM (
    'TAREA',
    'EXAMEN',
    'TRABAJO_PRACTICO',
    'PROYECTO',
    'CONTROL_LECTURA'
);


ALTER TYPE public."AssignmentType" OWNER TO postgres;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'JUSTIFIED'
);


ALTER TYPE public."AttendanceStatus" OWNER TO postgres;

--
-- Name: AuditAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuditAction" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'SYNC_SIE',
    'VERIFY_SIE'
);


ALTER TYPE public."AuditAction" OWNER TO postgres;

--
-- Name: CurriculumStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CurriculumStatus" AS ENUM (
    'PLANIFICADO',
    'EN_DESARROLLO',
    'COMPLETADO'
);


ALTER TYPE public."CurriculumStatus" OWNER TO postgres;

--
-- Name: DayOfWeek; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DayOfWeek" AS ENUM (
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO'
);


ALTER TYPE public."DayOfWeek" OWNER TO postgres;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'TRANSFERRED',
    'GRADUATED',
    'WITHDRAWN'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'UNSPECIFIED'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: GradeCorrectionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GradeCorrectionStatus" AS ENUM (
    'PENDING',
    'EXECUTED',
    'REJECTED'
);


ALTER TYPE public."GradeCorrectionStatus" OWNER TO postgres;

--
-- Name: RelationshipType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RelationshipType" AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'TUTOR',
    'OTHER'
);


ALTER TYPE public."RelationshipType" OWNER TO postgres;

--
-- Name: Shift; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Shift" AS ENUM (
    'MORNING',
    'AFTERNOON',
    'EVENING'
);


ALTER TYPE public."Shift" OWNER TO postgres;

--
-- Name: SieDiscrepancyGroupStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SieDiscrepancyGroupStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED'
);


ALTER TYPE public."SieDiscrepancyGroupStatus" OWNER TO postgres;

--
-- Name: SieSyncStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SieSyncStatus" AS ENUM (
    'PENDING',
    'QUEUED',
    'PROCESSING',
    'VERIFIED',
    'FAILED',
    'CANCELLED',
    'DISCREPANCY',
    'PAUSED',
    'AUTH_REQUIRED'
);


ALTER TYPE public."SieSyncStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMINISTRATIVE',
    'SECRETARY',
    'TEACHER',
    'PARENT',
    'STUDENT'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: prevent_teacher_schedule_slot_conflict(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_teacher_schedule_slot_conflict() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_advisory_xact_lock(
        hashtext(NEW."teacher_id"),
        hashtext(
            NEW."academic_year_id" || ':' ||
            NEW."day_of_week"::text || ':' ||
            NEW."period_index"::text
        )
    );

    IF EXISTS (
        SELECT 1
        FROM "class_schedules" AS existente
        WHERE existente."teacher_id" = NEW."teacher_id"
          AND existente."academic_year_id" = NEW."academic_year_id"
          AND existente."day_of_week" = NEW."day_of_week"
          AND existente."period_index" = NEW."period_index"
          AND existente."id" IS DISTINCT FROM NEW."id"
    ) THEN
        RAISE EXCEPTION 'El docente ya tiene una sesión en ese bloque horario.'
            USING ERRCODE = '23505',
                  CONSTRAINT = 'class_schedules_teacher_slot_unique';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_teacher_schedule_slot_conflict() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: academic_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_periods (
    id text NOT NULL,
    academic_year_id text NOT NULL,
    name text NOT NULL,
    number integer NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.academic_periods OWNER TO postgres;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_years (
    id text NOT NULL,
    year integer NOT NULL,
    name text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.academic_years OWNER TO postgres;

--
-- Name: alert_evaluation_outbox; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alert_evaluation_outbox (
    id text NOT NULL,
    student_id text NOT NULL,
    available_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    locked_at timestamp(3) without time zone,
    last_error text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.alert_evaluation_outbox OWNER TO postgres;

--
-- Name: alert_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alert_rules (
    id text NOT NULL,
    key public."AlertRuleType" NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    severity public."AlertSeverity" DEFAULT 'WARNING'::public."AlertSeverity" NOT NULL,
    grade_threshold double precision,
    absence_threshold integer,
    absence_window_days integer,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.alert_rules OWNER TO postgres;

--
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    severity public."AlertSeverity" DEFAULT 'INFO'::public."AlertSeverity" NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    link text,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."AlertStatus" DEFAULT 'OPEN'::public."AlertStatus" NOT NULL,
    student_id text,
    rule_key public."AlertRuleType",
    deduplication_key text
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    urgency public."AnnouncementUrgency" DEFAULT 'MEDIA'::public."AnnouncementUrgency" NOT NULL,
    scope public."AnnouncementScope" NOT NULL,
    target_course_id text,
    target_parent_id text,
    target_teacher_id text,
    target_user_ids text[] DEFAULT ARRAY[]::text[],
    created_by_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_submissions (
    id text NOT NULL,
    assignment_id text NOT NULL,
    student_id text NOT NULL,
    score double precision,
    feedback text,
    status text DEFAULT 'PENDIENTE'::text NOT NULL,
    graded_at timestamp(3) without time zone,
    graded_by_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.assignment_submissions OWNER TO postgres;

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignments (
    id text NOT NULL,
    title text NOT NULL,
    type public."AssignmentType" DEFAULT 'TAREA'::public."AssignmentType" NOT NULL,
    description text,
    due_date timestamp(3) without time zone NOT NULL,
    max_score double precision DEFAULT 100,
    status public."AssignmentStatus" DEFAULT 'PENDIENTE'::public."AssignmentStatus" NOT NULL,
    course_id text NOT NULL,
    subject_id text NOT NULL,
    teacher_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.assignments OWNER TO postgres;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendances (
    id text NOT NULL,
    student_id text NOT NULL,
    course_id text NOT NULL,
    registered_by_id text NOT NULL,
    date date NOT NULL,
    status public."AttendanceStatus" DEFAULT 'PRESENT'::public."AttendanceStatus" NOT NULL,
    justification text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.attendances OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    user_id text,
    action public."AuditAction" NOT NULL,
    entity text NOT NULL,
    entity_id text NOT NULL,
    previous_value jsonb,
    new_value jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    correlation_id text,
    reason text,
    student_ids text[] DEFAULT ARRAY[]::text[] NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: auth_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_sessions (
    id text NOT NULL,
    user_id text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    revoked_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.auth_sessions OWNER TO postgres;

--
-- Name: class_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_schedules (
    id text NOT NULL,
    course_id text NOT NULL,
    subject_id text NOT NULL,
    teacher_id text NOT NULL,
    academic_year_id text NOT NULL,
    day_of_week public."DayOfWeek" NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    period_index integer DEFAULT 1 NOT NULL,
    classroom text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.class_schedules OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    academic_year_id text NOT NULL,
    name text NOT NULL,
    grade_level integer NOT NULL,
    section text NOT NULL,
    shift public."Shift" DEFAULT 'MORNING'::public."Shift" NOT NULL,
    max_capacity integer DEFAULT 35 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    CONSTRAINT courses_grade_level_regular_range CHECK (((grade_level >= 1) AND (grade_level <= 14)))
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: curriculum_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculum_topics (
    id text NOT NULL,
    subject_id text NOT NULL,
    course_id text,
    academic_year_id text NOT NULL,
    period_number integer NOT NULL,
    grade_level integer NOT NULL,
    campo text NOT NULL,
    unit_title text NOT NULL,
    title text NOT NULL,
    description text,
    progress_percent integer DEFAULT 0 NOT NULL,
    status public."CurriculumStatus" DEFAULT 'PLANIFICADO'::public."CurriculumStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    CONSTRAINT curriculum_topics_grade_level_regular_range CHECK (((grade_level >= 1) AND (grade_level <= 14)))
);


ALTER TABLE public.curriculum_topics OWNER TO postgres;

--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id text NOT NULL,
    student_id text NOT NULL,
    course_id text NOT NULL,
    academic_year_id text NOT NULL,
    enrollment_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ACTIVE'::public."EnrollmentStatus" NOT NULL,
    remarks text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: grade_correction_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grade_correction_requests (
    id text NOT NULL,
    grade_id text NOT NULL,
    requested_by_id text NOT NULL,
    decided_by_id text,
    previous_value double precision NOT NULL,
    proposed_value double precision NOT NULL,
    reason text NOT NULL,
    evidence_reference text NOT NULL,
    decision_reason text,
    status public."GradeCorrectionStatus" DEFAULT 'PENDING'::public."GradeCorrectionStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    decided_at timestamp(3) without time zone,
    executed_at timestamp(3) without time zone
);


ALTER TABLE public.grade_correction_requests OWNER TO postgres;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id text NOT NULL,
    enrollment_id text NOT NULL,
    student_id text NOT NULL,
    subject_id text NOT NULL,
    period_id text NOT NULL,
    value double precision NOT NULL,
    remarks text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    published_at timestamp(3) without time zone,
    published_by_id text
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: parents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parents (
    id text NOT NULL,
    user_id text NOT NULL,
    ci text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    email text,
    address text,
    occupation text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.parents OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    module text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    revoked_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session_id text
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id text NOT NULL,
    role public."UserRole" NOT NULL,
    permission_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: sie_discrepancy_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sie_discrepancy_groups (
    id text NOT NULL,
    synchronization_id text NOT NULL,
    course_id text NOT NULL,
    subject_id text NOT NULL,
    period_id text NOT NULL,
    assigned_to_id text NOT NULL,
    status public."SieDiscrepancyGroupStatus" DEFAULT 'OPEN'::public."SieDiscrepancyGroupStatus" NOT NULL,
    due_at timestamp(3) without time zone NOT NULL,
    resolved_by_id text,
    resolved_at timestamp(3) without time zone,
    resolution_reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sie_discrepancy_groups OWNER TO postgres;

--
-- Name: sie_synchronization_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sie_synchronization_items (
    id text NOT NULL,
    synchronization_id text NOT NULL,
    student_id text NOT NULL,
    subject_id text NOT NULL,
    period_id text NOT NULL,
    local_value double precision NOT NULL,
    sie_value double precision,
    status public."SieSyncStatus" DEFAULT 'PENDING'::public."SieSyncStatus" NOT NULL,
    error_message text,
    retry_count integer DEFAULT 0 NOT NULL,
    verified_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    discrepancy_resolved_by_id text,
    discrepancy_resolved_at timestamp(3) without time zone,
    discrepancy_resolution_reason text,
    discrepancy_decision text,
    discrepancy_group_id text,
    processing_token text,
    processing_lease_until timestamp(3) without time zone
);


ALTER TABLE public.sie_synchronization_items OWNER TO postgres;

--
-- Name: sie_synchronizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sie_synchronizations (
    id text NOT NULL,
    requested_by_id text NOT NULL,
    status public."SieSyncStatus" DEFAULT 'PENDING'::public."SieSyncStatus" NOT NULL,
    sync_type text DEFAULT 'GRADES'::text NOT NULL,
    total_items integer DEFAULT 0 NOT NULL,
    processed_items integer DEFAULT 0 NOT NULL,
    error_count integer DEFAULT 0 NOT NULL,
    started_at timestamp(3) without time zone,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    discrepancy_count integer DEFAULT 0 NOT NULL,
    paused_at timestamp(3) without time zone,
    paused_reason text,
    idempotency_key text
);


ALTER TABLE public.sie_synchronizations OWNER TO postgres;

--
-- Name: student_document_references; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_document_references (
    id text NOT NULL,
    student_id text NOT NULL,
    document_type text NOT NULL,
    reference text NOT NULL,
    notes text,
    created_by_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.student_document_references OWNER TO postgres;

--
-- Name: student_parents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_parents (
    id text NOT NULL,
    student_id text NOT NULL,
    parent_id text NOT NULL,
    relationship public."RelationshipType" DEFAULT 'TUTOR'::public."RelationshipType" NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    can_pickup boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.student_parents OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id text NOT NULL,
    user_id text,
    rude text NOT NULL,
    ci text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birth_date timestamp(3) without time zone NOT NULL,
    gender public."Gender" NOT NULL,
    address text,
    phone text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    documents jsonb
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    area text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Name: teacher_subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_subjects (
    id text NOT NULL,
    teacher_id text NOT NULL,
    subject_id text NOT NULL,
    course_id text NOT NULL,
    academic_year_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    weekly_periods integer
);


ALTER TABLE public.teacher_subjects OWNER TO postgres;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    user_id text NOT NULL,
    ci text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    specialty text NOT NULL,
    phone text,
    item_number text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role public."UserRole" DEFAULT 'PARENT'::public."UserRole" NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    password_setup_token_hash text,
    password_setup_expires_at timestamp(3) without time zone,
    password_setup_required boolean DEFAULT false NOT NULL,
    credential_version integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
08b9d95c-f5a8-4fcc-9a6d-bf03629e6bbb	b7552974de94db3f4f226526e8897ec073e6acdfe67c6ac9d31c516767ecd61d	2026-11-03 02:29:32.361092+00	20261022200000_group_sie_discrepancies_and_pause_batches	\N	\N	2026-11-03 02:29:32.32971+00	1
f8872bb0-2c42-4ca5-8d5f-0d5ac2fa679a	6549229e332786a38f6e50325f95fee0323b65b3bcfcf5ebb797ae3031f00a34	2026-11-03 02:29:32.057988+00	20260812162004_initial_schema	\N	\N	2026-11-03 02:29:31.665144+00	1
fe2447ce-d7af-4ff7-a844-a1b0db0f289c	58d2e549dc7e9b249fc0f0677106cc083b6a8a4e1ef91dbcedb373ba6d94aa5d	2026-11-03 02:29:32.169477+00	20261015120000_align_schema	\N	\N	2026-11-03 02:29:32.059522+00	1
41d93821-afd7-4de4-abfc-c5e2d4fec480	819e3e20c21aa5f6371e0b57f92f284271f2d8b0aa70dcffc03b35f1c7a7ef27	2026-11-03 02:29:32.428039+00	20261031030000_alert_rules_permission	\N	\N	2026-11-03 02:29:32.423248+00	1
b9495321-3502-45b0-a360-456cf85ebe48	24b762104cc3b7dbac5bd505be755cad0d248ad0d913815a90734c3f2d3ff9c3	2026-11-03 02:29:32.175567+00	20261022150000_add_sie_discrepancy_status	\N	\N	2026-11-03 02:29:32.170897+00	1
ee520006-52cf-4e94-ac09-c468404928e7	b809975661bef6f7670680b3ae734f49533ef33187f865a8d514c43907cd43a4	2026-11-03 02:29:32.366628+00	20261022210000_handle_sie_authentication_required	\N	\N	2026-11-03 02:29:32.362347+00	1
8e1e40a3-2d55-4a14-8b80-ea8f6a271657	c6f2eb7b3cb327b06a8e4f77906527acd958470fc89efccd8afef2ef71843716	2026-11-03 02:29:32.182715+00	20261022150100_track_sie_discrepancy_counts	\N	\N	2026-11-03 02:29:32.17691+00	1
6df3b560-52e1-43c8-a002-8b9d867a0fc2	1f2445326e96517fb3d267de9d157f55077dd8efc979a2b2303d17bc1c407399	2026-11-03 02:29:32.188416+00	20261022162000_student_account_activation	\N	\N	2026-11-03 02:29:32.18401+00	1
925edbfb-47f6-4fae-8f1e-971cf6f7e2f1	7fc4fe694738cc15f2ca80602fd1f353fc37d9706cc3b49d45e4f368889a98b1	2026-11-03 02:29:32.194244+00	20261022162100_lock_legacy_student_accounts	\N	\N	2026-11-03 02:29:32.189783+00	1
ff791662-096f-4992-b817-8b28007193f8	daee4fe86690be8534c4c61611d5a0ff1684af77811d0ec5ec77953fc4a26a8b	2026-11-03 02:29:32.372312+00	20261023100000_align_linked_student_login_roles	\N	\N	2026-11-03 02:29:32.368257+00	1
e2c443a6-ad10-4805-bff2-404037babab9	cdce876d6e18a1a63826334b11fd8d4ffecf32219ae6d5bb92e309bc596c7b59	2026-11-03 02:29:32.202211+00	20261022162200_normalize_regular_education_grades	\N	\N	2026-11-03 02:29:32.195695+00	1
13e18522-0595-4d6c-ad1c-99f4b30f5345	1f0abbfb2a8e14d2001448af714b8b8b8faeef80a8125d8c8d3a098a82c1b08c	2026-11-03 02:29:32.231866+00	20261022162300_grade_correction_approval	\N	\N	2026-11-03 02:29:32.203516+00	1
0ec2a022-3e2c-4cd9-aa96-3d9550a92e4b	3101ade24cf54bc69cb37769acce45b234fc98f4b9881dc5b2b909ce783659b0	2026-11-03 02:29:32.237731+00	20261022162400_invalidate_old_access_tokens	\N	\N	2026-11-03 02:29:32.233255+00	1
378429d8-136b-4c8c-9cf9-740a33fbb072	58b220eb1e217e1dfb6d0db5433019e23e5c9e52f23c957010b9df02ea06a0dd	2026-11-03 02:29:32.388895+00	20261023220000_alert_evaluation_outbox	\N	\N	2026-11-03 02:29:32.373601+00	1
146559f9-0a3b-4b0e-9af3-e9925de02fc8	d3b3403d7655b9efbb4416af2e3428cd6fa61490fab39451fa8f32cb055c39b6	2026-11-03 02:29:32.265973+00	20261022162500_early_warning_alerts_audit_student_filter	\N	\N	2026-11-03 02:29:32.23933+00	1
e05cc8db-a9b8-46bc-b0d9-25b607fbf132	b90ddcba951c5b7d1cbd28f6a537fc995d342b0e3bdfbe73512b718b15251cc8	2026-11-03 02:29:32.309639+00	20261022180000_unify_administrative_role	\N	\N	2026-11-03 02:29:32.267328+00	1
fab2a8dc-d715-4c96-9469-726b183c1bd1	1a9350d998b42dc75a3386858ad2a712ff31455657b9ba9d09d031c8813d65e5	2026-11-03 02:29:32.433671+00	20261101090000_add_teacher_subject_weekly_periods	\N	\N	2026-11-03 02:29:32.429288+00	1
15bdd066-4a26-4b09-a161-77451eea1187	ad91e21389dde71c462afa4f63af4a6255cd23f52756740d28920b73afd6d19f	2026-11-03 02:29:32.328341+00	20261022190000_track_manual_reviews_and_student_documents	\N	\N	2026-11-03 02:29:32.311004+00	1
78cb98ee-83e4-4938-be62-79f13c5935c3	ff26c532552445e9270d1941a193ca418ad0ef46a960e5fcb8806ec58ff43744	2026-11-03 02:29:32.398353+00	20261023230000_guard_teacher_schedule_slot	\N	\N	2026-11-03 02:29:32.390392+00	1
3a135719-919f-46e5-a81e-79ba5aed16eb	8826da6df7ee795e5176332c23ce2342ab37f666d66b1215252cc19a603c4b62	2026-11-03 02:29:32.48152+00	20261103100100_configure_lateness_alert	\N	\N	2026-11-03 02:29:32.476727+00	1
38d14e71-3d05-4ac6-962f-a38c4c0adefa	c0d1d54508b9b237e250750a518af77383f72b7c9b46c4881dd6103280bb9482	2026-11-03 02:29:32.407758+00	20261024120000_sie_sync_idempotency	\N	\N	2026-11-03 02:29:32.399696+00	1
36b9d418-e5a9-4254-941f-f0c83bbdd271	220ebb5ab782b47910e4805c5877d0b1d0c19fb4364c78e4a9a9ef4c05cba15c	2026-11-03 02:29:32.440017+00	20261102120000_academic_management_permissions	\N	\N	2026-11-03 02:29:32.434962+00	1
1d6ae8a4-e74e-4aec-a9e4-90e7ae54acc2	cc495146fc7072da0b0ed4c95892356b10cfb252dfb27d5a5a839bdddd2fb683	2026-11-03 02:29:32.416714+00	20261024150000_sie_item_processing_lease	\N	\N	2026-11-03 02:29:32.409076+00	1
8be9e180-8780-42b4-a909-0dcd5b1198fd	f6d34488958aa2b7f7255d3d2e6386504f45f83e042776b64e8562cc07bacdd3	2026-11-03 02:29:32.421967+00	20261024160000_add_unspecified_student_gender	\N	\N	2026-11-03 02:29:32.417965+00	1
603f118a-ff26-47de-b7b3-5323ecaecb69	45e19999d148d333b14fb7a7a49c65b83c2eb1cdd7ecfe1af4578c8ef2d1c06d	2026-11-03 02:29:32.449566+00	20261102130000_grade_publication	\N	\N	2026-11-03 02:29:32.441329+00	1
e92e6d6a-86c6-4686-9241-a042bc9dbd89	fc441829cf66e3323b9e864feef5931eb04a1644cd12c5f3b3f200417dbc56b0	2026-11-03 02:29:32.470006+00	20261102160000_session_scoped_logout	\N	\N	2026-11-03 02:29:32.450833+00	1
e9f8e357-e1b0-494c-8af6-a2de6f6cc43d	89d476fa3f703b05e8a19fa2c58fdb82038b3c55b8135982f180528996cf731b	2026-11-03 02:29:32.475384+00	20261103100000_add_lateness_alert_type	\N	\N	2026-11-03 02:29:32.471338+00	1
\.


--
-- Data for Name: academic_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_periods (id, academic_year_id, name, number, start_date, end_date, is_closed, created_at, updated_at) FROM stdin;
6a37f125-c4c1-4813-bfaa-8ce98777c58c	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	1er Trimestre	1	2026-02-01 00:00:00	2026-05-15 23:59:59	f	2026-11-03 02:29:45.033	2026-11-03 02:29:45.033
85efdaaa-0a7c-416c-b3f2-72e8b260bf78	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2do Trimestre	2	2026-05-16 00:00:00	2026-08-31 23:59:59	f	2026-11-03 02:29:45.035	2026-11-03 02:29:45.035
183652eb-3545-4e62-97cb-462ae024ee1f	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	3er Trimestre	3	2026-09-01 00:00:00	2026-11-30 23:59:59	f	2026-11-03 02:29:45.037	2026-11-03 02:29:45.037
\.


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_years (id, year, name, start_date, end_date, is_active, is_closed, created_at, updated_at) FROM stdin;
f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026	Gestión Académica 2026	2026-02-01 00:00:00	2026-11-30 23:59:59	t	f	2026-11-03 02:29:45.03	2026-11-03 02:29:45.03
\.


--
-- Data for Name: alert_evaluation_outbox; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alert_evaluation_outbox (id, student_id, available_at, attempts, locked_at, last_error, created_at) FROM stdin;
\.


--
-- Data for Name: alert_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alert_rules (id, key, enabled, severity, grade_threshold, absence_threshold, absence_window_days, updated_at) FROM stdin;
LOW_GRADE	LOW_GRADE	t	WARNING	51	\N	\N	2026-11-03 02:29:32.241
REPEATED_ABSENCE	REPEATED_ABSENCE	t	WARNING	\N	3	7	2026-11-03 02:29:32.241
REPEATED_LATENESS	REPEATED_LATENESS	f	WARNING	\N	3	7	2026-11-03 02:29:32.478
\.


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (id, user_id, title, message, severity, is_read, link, metadata, created_at, status, student_id, rule_key, deduplication_key) FROM stdin;
7227a761-cc53-4fb7-bfcb-f1f9b5597a6a	9c1704cc-77c6-4c76-b355-50d4734c508f	Registro de Atraso Registrado	Se registró un atraso para Mateo Fernández el 03/03/2026 a las 08:10. Motivo registrado: Lluvia intensa.	INFO	t	\N	\N	2026-11-03 03:48:39.246	RESOLVED	25320a19-d024-4fdf-9149-10a2620b89eb	\N	\N
fc2d1349-2d1f-4cc6-a635-0514c50cf022	46da26a9-56a6-4f64-8c0c-573f60aaccee	Cierre del 2do Trimestre Próximo	Recordatorio: La fecha límite para la consolidación de notas del 2do Trimestre en el sistema vence en 15 días.	WARNING	f	\N	\N	2026-11-03 03:48:39.246	OPEN	\N	\N	\N
f2c06faa-3520-4d42-a288-e23e09ab786c	f18b8eec-37fe-40ad-a270-51e3f748e51e	Nueva Tarea Asignada en Matemática	El Prof. Carlos Mendoza ha publicado la Práctica de Derivadas con entrega para pasado mañana.	INFO	f	\N	\N	2026-11-03 03:48:39.246	OPEN	25320a19-d024-4fdf-9149-10a2620b89eb	\N	\N
6291d37d-1352-467a-9ea0-979eac7feccf	9c1704cc-77c6-4c76-b355-50d4734c508f	[Comunicado CRITICA] Esto es una pruebita	Esto es una pruebita	DANGER	f	/dashboard/announcements	{"scope": "ALL_PARENTS", "urgency": "CRITICA", "announcementId": "2489caf5-7d5e-43b9-9c38-2d18dd6ee8c5"}	2026-11-03 05:54:07.025	OPEN	\N	\N	\N
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (id, title, content, urgency, scope, target_course_id, target_parent_id, target_teacher_id, target_user_ids, created_by_id, created_at, updated_at) FROM stdin;
2c011976-7897-4a78-9eab-52f0c0f417f8	Convocatoria: Primera Reunión General de Padres y Tutores de Familia	Se convoca a todos los padres de familia a la asamblea informativa del primer trimestre que se llevará a cabo el viernes a las 18:30 en el coliseo institucional. Su puntual asistencia es de suma importancia para el seguimiento de la gestión.	ALTA	ALL_PARENTS	\N	\N	\N	{}	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-03 03:48:39.236	2026-11-03 03:48:39.236
e3d3ebc2-4f0c-4ec3-a80a-d47ad1963e40	Feria Científica y Tecnológica 2026: Inscripción de Proyectos de Aula	Se invita a todos los estudiantes de nivel secundaria a conformar sus grupos de trabajo para la presentación de experimentos y prototipos tecnológicos en las áreas de Física, Química y Robótica.	MEDIA	ALL_COURSES	\N	\N	\N	{}	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-03 03:48:39.236	2026-11-03 03:48:39.236
2b9aa077-f789-42fc-9b73-89cda9543cc1	Práctica evaluada de Derivadas y Límites (6to de Secundaria A)	Estimados estudiantes, recuerden que la entrega de la práctica formativa de cálculo diferencial vence impostergablemente este jueves a primera hora.	MEDIA	COURSE	f445e026-fca3-434e-a7bb-593ca4138100	\N	\N	{}	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-03 03:48:39.236	2026-11-03 03:48:39.236
2489caf5-7d5e-43b9-9c38-2d18dd6ee8c5	Esto es una pruebita	Esto es una pruebita	CRITICA	ALL_PARENTS	\N	\N	\N	{}	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-03 05:54:07.022	2026-11-03 05:54:07.022
\.


--
-- Data for Name: assignment_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment_submissions (id, assignment_id, student_id, score, feedback, status, graded_at, graded_by_id, created_at, updated_at, deleted_at) FROM stdin;
e06ed024-2ead-4f1b-a9a7-e93b94aa36af	444af142-f3e9-4fc0-bca7-fe3db9fc7c62	25320a19-d024-4fdf-9149-10a2620b89eb	67	\N	CALIFICADO	2026-11-03 13:34:43.522	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	2026-11-03 13:34:43.523	2026-11-03 13:34:43.523	\N
\.


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignments (id, title, type, description, due_date, max_score, status, course_id, subject_id, teacher_id, created_at, updated_at, deleted_at) FROM stdin;
444af142-f3e9-4fc0-bca7-fe3db9fc7c62	Práctica de Derivadas y Regla de la Cadena	TRABAJO_PRACTICO	Resolver los ejercicios 1 al 25 de la guía entregada en clase.	2026-11-05 03:48:39.011	100	PENDIENTE	f445e026-fca3-434e-a7bb-593ca4138100	83f9322f-ae95-4a62-a24b-999c310836da	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	2026-11-03 03:48:39.012	2026-11-03 03:48:39.012	\N
05d529dd-3586-452d-b8e6-df948b689453	Informe de Laboratorio: Prensa Hidráulica	TAREA	Redactar informe en formato APA con datos y gráficas experimentales.	2026-11-10 03:48:39.011	100	PENDIENTE	f445e026-fca3-434e-a7bb-593ca4138100	ad8815eb-99c8-439a-ba90-3eb48b3d9600	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	2026-11-03 03:48:39.012	2026-11-03 03:48:39.012	\N
6d972e1a-1dbb-426e-97b1-5783e9ebd118	Ensayo Crítico: Literatura Contemporánea Boliviana	PROYECTO	Análisis de la obra "Raza de Bronce" y su contexto histórico.	2026-11-10 03:48:39.011	100	PENDIENTE	f445e026-fca3-434e-a7bb-593ca4138100	d3b90c62-05bb-4744-ab63-82d553dfc185	94756c34-bd8f-48e5-a531-b82ecfcc0b1f	2026-11-03 03:48:39.012	2026-11-03 03:48:39.012	\N
\.


--
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendances (id, student_id, course_id, registered_by_id, date, status, justification, created_at, updated_at) FROM stdin;
8446897c-34ec-46e9-a2bf-d2880844f949	25320a19-d024-4fdf-9149-10a2620b89eb	f445e026-fca3-434e-a7bb-593ca4138100	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-03-02	PRESENT	\N	2026-11-03 03:48:39.23	2026-11-03 03:48:39.23
b5c29f9f-2c24-4eba-9e2b-b16de0a0b400	25320a19-d024-4fdf-9149-10a2620b89eb	f445e026-fca3-434e-a7bb-593ca4138100	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-03-03	LATE	Atraso de 10 min por lluvia intensa, justificado por dirección.	2026-11-03 03:48:39.23	2026-11-03 03:48:39.23
9b98e0a5-97cb-4b0c-8560-d95420fe4492	25320a19-d024-4fdf-9149-10a2620b89eb	f445e026-fca3-434e-a7bb-593ca4138100	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-03-04	PRESENT	\N	2026-11-03 03:48:39.23	2026-11-03 03:48:39.23
20865717-ec08-434e-82ef-da5bfb18115d	2f6a5ab2-a478-4ba4-a343-b76d2516c3a4	3b19feef-b3cd-44cd-89af-ad89ed7a2119	80de1a36-e1b9-4c20-a692-9a55a90bfae0	2026-03-02	PRESENT	\N	2026-11-03 03:48:39.23	2026-11-03 03:48:39.23
0c9bd79f-933f-44cb-890a-e07ea7a5702f	2f6a5ab2-a478-4ba4-a343-b76d2516c3a4	3b19feef-b3cd-44cd-89af-ad89ed7a2119	80de1a36-e1b9-4c20-a692-9a55a90bfae0	2026-03-03	PRESENT	\N	2026-11-03 03:48:39.23	2026-11-03 03:48:39.23
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity, entity_id, previous_value, new_value, ip_address, user_agent, created_at, correlation_id, reason, student_ids) FROM stdin;
3ae97329-0770-4056-a36e-11e5bfd5209f	11b483b4-2d64-447c-98eb-787fd9767760	CREATE	SystemBootstrap	11b483b4-2d64-447c-98eb-787fd9767760	\N	{"event": "DATABASE_INITIALIZED_AND_SEEDED", "timestamp": "2026-11-03T02:29:45.086Z"}	127.0.0.1	PrismaSeed/1.0	2026-11-03 02:29:45.087	\N	\N	{}
346b6ae4-031c-4ba6-ae94-340c880144ff	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat"}	172.64.222.205	Mozilla/5.0	2026-11-03 02:38:15.495	\N	\N	{}
a139e69c-23e0-4043-828d-4a9db4520b06	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.69.90.86	Mozilla/5.0	2026-11-03 02:42:52.33	\N	\N	{}
02d2d777-98b0-42b8-bc0b-d94afccbdaed	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:13:07.691	\N	\N	{}
2c844ba1-cd90-4b96-bb4a-6df4ca1cccde	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:13:08.277	\N	\N	{}
c1ae75fc-510f-4a8a-b46c-eb63a87f6c9c	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.68.14.177	Mozilla/5.0	2026-11-03 03:13:09.117	\N	\N	{}
13718f3e-2245-433b-9b2a-87a915fa4fcf	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:13:09.732	\N	\N	{}
4cf27776-ff34-4049-854b-474026f519f7	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.70.140.109	Mozilla/5.0	2026-11-03 03:13:10.776	\N	\N	{}
9c5cdabb-aaaa-407a-bcfc-eb4ccf9388d9	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:13:11.351	\N	\N	{}
302d198e-579d-465f-9b11-e681a6018869	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.69.90.87	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 03:23:06.993	\N	\N	{}
be934bed-33ea-4b0b-aa40-f28f83a8b344	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.69.90.87	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 03:24:34.626	\N	\N	{}
ec9b3957-cc56-47e8-b134-683ae34990bb	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.69.90.87	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 03:25:02.425	\N	\N	{}
225e49a4-3c82-43f6-9a5c-9167fbb99aaa	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.86	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 03:25:29.194	\N	\N	{}
5846016a-29d2-4ac3-a3c9-4fce091983c3	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.64.222.204	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 03:35:29.735	\N	\N	{}
45b0c74f-91bc-4cc1-8afe-a77ca5d110e3	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:49:26.595	\N	\N	{}
5010e848-3d1c-45a7-b16c-ba486d3b4c9f	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:49:27.178	\N	\N	{}
ced23da4-254f-4d3a-b311-3cefdbccb5c4	80de1a36-e1b9-4c20-a692-9a55a90bfae0	LOGIN	User	80de1a36-e1b9-4c20-a692-9a55a90bfae0	null	{"role": "TEACHER", "email": "elena.quispe@sigce.lat", "loginRole": "TEACHER"}	172.70.140.108	Mozilla/5.0	2026-11-03 03:49:27.995	\N	\N	{}
57cfe236-3ec9-4962-aa7d-6cee6282db33	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.64.222.204	Mozilla/5.0	2026-11-03 03:49:28.543	\N	\N	{}
877ecc37-d817-4396-9fec-4381ae968aff	d454c0ed-dc30-427d-90c3-2888f78ac5a4	LOGIN	User	d454c0ed-dc30-427d-90c3-2888f78ac5a4	null	{"role": "STUDENT", "email": "luciana@sigce.lat", "loginRole": "STUDENT"}	172.70.140.108	Mozilla/5.0	2026-11-03 03:49:29.097	\N	\N	{}
d01a4bfe-9ed7-43ac-a947-dd833053d0a1	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.86	Mozilla/5.0	2026-11-03 03:49:29.894	\N	\N	{}
278995f3-672a-42c0-ae82-3fc1ebcd2fb0	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.87	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 03:51:24.137	\N	\N	{}
f33d2c19-9c4f-4c3f-be31-cb23c8369605	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.86	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 04:02:45.37	\N	\N	{}
c886950f-bb18-42a1-9c7c-6304daa8d657	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.69.90.225	Dart/3.13 (dart:io)	2026-11-03 04:19:45.615	\N	\N	{}
e67065dc-b7ac-487c-b5b8-575775dd7a1e	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.68.14.177	Dart/3.13 (dart:io)	2026-11-03 04:21:55.417	\N	\N	{}
2f2e5232-b8f9-408f-bc7a-c3435644aeab	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.64.222.204	Dart/3.13 (dart:io)	2026-11-03 04:24:56.384	\N	\N	{}
b9b78816-9d6a-4f0a-8ead-42ac7bca82ad	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.70.140.109	node	2026-11-03 04:56:03.016	\N	\N	{}
f41e4c4b-3daf-45eb-a8a6-9221349892dd	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.70.140.109	node	2026-11-03 04:56:03.389	\N	\N	{}
a389edf3-66dc-4e20-af5f-7be3ab02970f	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.70.140.109	node	2026-11-03 04:56:03.787	\N	\N	{}
7c1dd006-4043-4d0e-9629-fa3992c88af8	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.68.14.176	node	2026-11-03 04:56:16.533	\N	\N	{}
0343f113-af61-423e-86d7-02ab3192983f	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.64.222.205	node	2026-11-03 04:56:28.445	\N	\N	{}
6f2af88f-fd48-49ef-a415-389e65af7821	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.87	Dart/3.13 (dart:io)	2026-11-03 04:59:43.857	\N	\N	{}
aca70cd5-0bd2-4eeb-b652-d866ca9c0818	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.64.222.205	Dart/3.13 (dart:io)	2026-11-03 05:02:08.276	\N	\N	{}
df5b1efc-dd1d-4306-958a-a3edf7d8ae6e	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.64.222.204	Dart/3.13 (dart:io)	2026-11-03 05:06:04.472	\N	\N	{}
eeb1bc68-e082-465e-be4a-0ea3bbcda798	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat"}	172.68.14.176	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.19041.6456	2026-11-03 05:26:23.562	\N	\N	{}
8946de9f-edca-4b63-a32c-c5a31ad84a0d	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.68.14.176	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.19041.6456	2026-11-03 05:26:30.353	\N	\N	{}
a3252926-d415-4a6a-9658-9983f3e0cf63	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.64.222.204	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.19041.6456	2026-11-03 05:26:39.724	\N	\N	{}
c7ea146c-2c57-4a33-9489-0a8d59d84007	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.64.222.204	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.19041.6456	2026-11-03 05:26:48.212	\N	\N	{}
2f2be85f-ed38-42a6-93df-6cd28c7621e4	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.68.14.176	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.19041.6456	2026-11-03 05:26:55.538	\N	\N	{}
5301775f-a77d-4748-92d7-5fe55edf9ea4	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.68.14.176	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.19041.6456	2026-11-03 05:27:01.988	\N	\N	{}
ac67e340-4393-4d09-adf1-a9390af2def4	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.68.14.176	Dart/3.13 (dart:io)	2026-11-03 05:34:22.84	\N	\N	{}
d5b53619-b2eb-4e07-9c3a-90bc883f3674	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.64.222.205	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 05:53:13.878	\N	\N	{}
c583170d-67f0-4d9e-8f7d-97cfd4229359	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.87	Dart/3.13 (dart:io)	2026-11-03 05:54:58.636	\N	\N	{}
19b9f177-c676-4e20-91fe-5491a2b5cbfc	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.64.222.205	Dart/3.13 (dart:io)	2026-11-03 05:58:04.586	\N	\N	{}
7e84e81d-a7c9-47e2-8fe6-ac25b06f7047	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.64.222.204	Mozilla/5.0	2026-11-03 06:27:20.11	\N	\N	{}
fe3393bb-7d47-4465-a6e5-a547ecaac325	11b483b4-2d64-447c-98eb-787fd9767760	LOGIN	User	11b483b4-2d64-447c-98eb-787fd9767760	null	{"role": "ADMINISTRATIVE", "email": "admin@sigce.lat", "loginRole": "ADMINISTRATIVE"}	172.69.90.87	Mozilla/5.0	2026-11-03 06:28:21.83	\N	\N	{}
a51c6388-4c83-4aa4-97cc-5cca0033adcc	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.69.90.87	Mozilla/5.0	2026-11-03 06:28:22.385	\N	\N	{}
3c37d9a2-3f23-4168-b5ef-6d83b08a61b1	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.64.222.204	Mozilla/5.0	2026-11-03 06:28:22.942	\N	\N	{}
9aa2c6f9-11b5-47d3-8800-c0c8f30e34ad	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.70.140.108	Mozilla/5.0	2026-11-03 06:28:24.209	\N	\N	{}
dff48adc-0f38-4e4c-b044-029abbf6577c	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.69.90.87	Mozilla/5.0	2026-11-03 06:28:24.771	\N	\N	{}
897eb1a8-15cb-4e94-8497-b4ac1c70ca46	9c1704cc-77c6-4c76-b355-50d4734c508f	LOGIN	User	9c1704cc-77c6-4c76-b355-50d4734c508f	null	{"role": "PARENT", "email": "familia@sigce.lat", "loginRole": "FAMILY"}	172.64.222.204	Mozilla/5.0	2026-11-03 06:28:25.324	\N	\N	{}
fb29a3e5-31fe-4fba-be3d-b28ae7900da2	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.68.14.176	Mozilla/5.0	2026-11-03 06:28:25.884	\N	\N	{}
23a638ab-2b11-4b08-8d73-edc9ec2d50cf	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.69.90.87	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 06:30:56.455	\N	\N	{}
cbc918e3-7aaf-4545-a923-9dfad4f32968	46da26a9-56a6-4f64-8c0c-573f60aaccee	UPDATE	GradePublication	f445e026-fca3-434e-a7bb-593ca4138100_ad8815eb-99c8-439a-ba90-3eb48b3d9600_6a37f125-c4c1-4813-bfaa-8ce98777c58c	{"gradeIds": ["a2be2455-f9c3-4c49-8381-eeba8182a16c"], "published": false}	{"gradeIds": ["a2be2455-f9c3-4c49-8381-eeba8182a16c"], "published": true, "publishedAt": "2026-11-03T06:32:09.550Z"}	172.69.90.87	\N	2026-11-03 06:32:09.553	fae1b221-c857-4992-899e-65b1b8fc15e2	\N	{25320a19-d024-4fdf-9149-10a2620b89eb}
76031f5a-b2e7-4160-8147-27e9c725f065	46da26a9-56a6-4f64-8c0c-573f60aaccee	LOGIN	User	46da26a9-56a6-4f64-8c0c-573f60aaccee	null	{"role": "TEACHER", "email": "docente@sigce.lat", "loginRole": "TEACHER"}	172.68.14.176	Mozilla/5.0	2026-11-03 07:01:49.246	\N	\N	{}
3ad5bbcd-bca4-4be0-8343-c4c0aff156de	f18b8eec-37fe-40ad-a270-51e3f748e51e	LOGIN	User	f18b8eec-37fe-40ad-a270-51e3f748e51e	null	{"role": "STUDENT", "email": "estudiante@sigce.lat", "loginRole": "STUDENT"}	172.69.90.86	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-03 13:35:32.103	\N	\N	{}
\.


--
-- Data for Name: auth_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_sessions (id, user_id, expires_at, revoked_at, created_at) FROM stdin;
41a2f0db-f15c-4b65-bd54-23be6e454a95	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 02:38:15	\N	2026-11-03 02:38:15.488
d2a5c439-2388-4244-94b1-89dacc36b755	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 02:42:52	\N	2026-11-03 02:42:52.325
dbdeb601-d450-4074-af8c-89ecf2915647	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 03:13:07	\N	2026-11-03 03:13:07.684
7f36cdb6-b220-4344-a067-d02ff9bfe9df	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 03:13:08	\N	2026-11-03 03:13:08.269
23598b4d-b7f6-4227-9c06-f65156e5bfb7	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 03:13:09	\N	2026-11-03 03:13:09.108
24da29a4-099a-46f1-95d1-c0be07452eb3	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 03:13:09	\N	2026-11-03 03:13:09.726
b0d33ff3-fb25-42a4-b3ba-76e9b7e237b2	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 03:13:10	\N	2026-11-03 03:13:10.77
cce7cb2f-3f91-4815-a4a9-fddfc0bad499	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 03:13:11	\N	2026-11-03 03:13:11.345
14dc0f9b-142e-48dd-9b0c-3ec6651dc967	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 05:31:49	2026-11-03 05:32:12.401	2026-11-03 05:06:04.462
37eb173f-7d05-4759-8b6a-f76827b1fd64	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 03:23:15	2026-11-03 03:24:10.464	2026-11-03 03:23:06.988
85f825e4-0cbe-4cc2-9ea8-eb6874a904a7	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 03:24:34	2026-11-03 03:24:45.063	2026-11-03 03:24:34.622
6ef84520-e1f3-40b2-8519-ccfe76a7a80f	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 03:25:02	2026-11-03 03:25:10.074	2026-11-03 03:25:02.42
ebde592b-cbc6-4ee9-9fb8-3baa88881e81	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 03:25:29	2026-11-03 03:35:05.68	2026-11-03 03:25:29.19
f9a5d26b-9117-4762-b7de-422f79f26c56	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 03:49:26	\N	2026-11-03 03:49:26.589
d1681a3c-925a-44f7-993c-bb69fbfaebf1	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 03:49:27	\N	2026-11-03 03:49:27.174
de610f8f-e2f7-418e-8086-446bc4d4b59d	80de1a36-e1b9-4c20-a692-9a55a90bfae0	2026-11-10 03:49:27	\N	2026-11-03 03:49:27.992
75ac8f3f-3dcf-4626-8f87-91af17f0f953	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 03:49:28	\N	2026-11-03 03:49:28.54
212d7663-2bb9-406f-908c-914d3608f1c3	d454c0ed-dc30-427d-90c3-2888f78ac5a4	2026-11-10 03:49:29	\N	2026-11-03 03:49:29.093
2e46dc97-ac68-4a89-ac2c-604c68db4725	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 03:49:29	\N	2026-11-03 03:49:29.89
b69ba9c4-43be-4509-8c49-955836f1fde5	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 05:25:43	2026-11-03 05:35:30.629	2026-11-03 04:02:45.356
a4f0ff73-d0f2-476e-a790-b042d8658071	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 05:34:22	2026-11-03 05:38:06.518	2026-11-03 05:34:22.835
d1303402-3db4-409e-bbc4-1d42a4e408ac	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 03:51:08	2026-11-03 03:51:10.588	2026-11-03 03:35:29.73
6210260c-2408-4518-803b-009cd6070896	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 03:51:24	2026-11-03 03:51:43.492	2026-11-03 03:51:24.133
f37732f3-00a9-471a-a43e-4c4e1ab53cc6	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 04:19:45	2026-11-03 04:20:40.929	2026-11-03 04:19:45.596
f11d7541-234c-4f05-b4bd-a22752fe4727	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 04:21:55	2026-11-03 04:22:25.04	2026-11-03 04:21:55.413
a8709d92-cb6a-4118-82ab-e8ef31ed78b9	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 04:56:03	\N	2026-11-03 04:56:03.004
53956d86-2b95-4f22-818f-13f13533ffcc	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 04:56:03	\N	2026-11-03 04:56:03.38
1c8a9749-fbf9-4d95-b6bc-4e54a1e94643	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 04:56:03	\N	2026-11-03 04:56:03.77
c39f1928-7017-4051-9014-a4d9196aaa28	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 04:56:16	\N	2026-11-03 04:56:16.524
9c7a526c-1929-48a8-91ec-31691cf2d903	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 04:56:28	\N	2026-11-03 04:56:28.439
2c8fdd0c-f2b9-4b0e-b9d5-b19d96b80f41	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 04:58:54	2026-11-03 04:58:58.41	2026-11-03 04:24:56.364
ee640a03-e4cd-4207-bc6e-6d8a9dfed840	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 04:59:43	2026-11-03 05:01:22.952	2026-11-03 04:59:43.853
2bfaed07-9a84-4827-a2af-e012f34eee7a	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 05:02:08	2026-11-03 05:05:29.056	2026-11-03 05:02:08.271
8f4571d6-4d30-44fc-b517-ffac969ed9da	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 05:54:58	2026-11-03 05:55:53.24	2026-11-03 05:54:58.631
d79154a3-a466-4285-b59e-47ddccc1bfd5	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 07:01:49	\N	2026-11-03 07:01:49.239
b29f0d38-09c0-4dae-9fcb-ad693f3a90ef	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 05:26:23	\N	2026-11-03 05:26:23.549
845a0a4f-dd71-40c3-a94c-9c999650a812	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 05:26:30	\N	2026-11-03 05:26:30.346
63436026-a8ec-4546-8280-ee69a72e692f	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 05:26:39	\N	2026-11-03 05:26:39.72
02e6cc20-a8ec-46c2-ba84-5e9202e42c5b	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 05:26:48	\N	2026-11-03 05:26:48.208
149c04d6-d1c6-425e-82e1-df3bffbaad96	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 05:26:55	\N	2026-11-03 05:26:55.533
bbd1e7e6-27f5-4450-af4a-319cb6dd7df4	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 05:27:01	\N	2026-11-03 05:27:01.983
feed0f2b-ad32-43c8-99fd-45ab39531848	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 05:58:04	\N	2026-11-03 05:58:04.581
436ee3c5-a016-44bc-9074-042862a1ea03	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-11 00:38:24	\N	2026-11-03 13:35:32.099
9572f520-800b-49f1-bc48-72fe5dcf0164	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 13:34:35	2026-11-03 13:34:51.884	2026-11-03 06:30:56.449
9db1089f-794f-4811-937f-13ece96874a2	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 06:26:37	2026-11-03 06:26:37.992	2026-11-03 05:53:13.872
9fd0a37e-fe12-4e06-8ce6-63517af6c711	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 06:27:20	\N	2026-11-03 06:27:20.106
2098ad96-bced-4bcf-915f-f5463e94af20	11b483b4-2d64-447c-98eb-787fd9767760	2026-11-10 06:28:21	\N	2026-11-03 06:28:21.825
f88a7203-b810-4ab1-a698-b72d782db1fe	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 06:28:22	\N	2026-11-03 06:28:22.381
6bf590c8-62af-47e2-b5d6-a524e21e4207	46da26a9-56a6-4f64-8c0c-573f60aaccee	2026-11-10 06:28:22	\N	2026-11-03 06:28:22.939
9e1367ac-1f13-4053-8571-297a544e5f81	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 06:28:24	\N	2026-11-03 06:28:24.205
1232d374-a41a-4e7c-9316-1da2b3d270dd	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 06:28:24	\N	2026-11-03 06:28:24.766
72765593-6e38-44eb-9433-9a470ec59b4d	9c1704cc-77c6-4c76-b355-50d4734c508f	2026-11-10 06:28:25	\N	2026-11-03 06:28:25.321
67c3968e-91dc-4dc1-8efb-304d5626bb2a	f18b8eec-37fe-40ad-a270-51e3f748e51e	2026-11-10 06:28:25	\N	2026-11-03 06:28:25.88
\.


--
-- Data for Name: class_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_schedules (id, course_id, subject_id, teacher_id, academic_year_id, day_of_week, start_time, end_time, period_index, classroom, created_at, updated_at) FROM stdin;
ec45e3a3-eaa2-4ed5-a780-6c0368e61ed9	f445e026-fca3-434e-a7bb-593ca4138100	83f9322f-ae95-4a62-a24b-999c310836da	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	LUNES	08:00	09:30	1	Aula 6-A	2026-11-03 03:48:38.984	2026-11-03 03:48:38.984
7e26ddaf-ffdb-4465-9c73-6e86893d11ad	f445e026-fca3-434e-a7bb-593ca4138100	ad8815eb-99c8-439a-ba90-3eb48b3d9600	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	MARTES	08:00	09:30	1	Laboratorio de Ciencias	2026-11-03 03:48:38.989	2026-11-03 03:48:38.989
2940d566-f11c-41cb-b15e-d07f8270148a	f445e026-fca3-434e-a7bb-593ca4138100	d3b90c62-05bb-4744-ab63-82d553dfc185	94756c34-bd8f-48e5-a531-b82ecfcc0b1f	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	MIERCOLES	08:00	09:30	1	Aula 6-A	2026-11-03 03:48:38.993	2026-11-03 03:48:38.993
3cafe1ce-5318-4866-989d-84ea5a96d8a1	f445e026-fca3-434e-a7bb-593ca4138100	83f9322f-ae95-4a62-a24b-999c310836da	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	JUEVES	09:45	11:15	2	Aula 6-A	2026-11-03 03:48:38.995	2026-11-03 03:48:38.995
3719fb10-66e6-4f65-aaba-3245be05078a	f445e026-fca3-434e-a7bb-593ca4138100	ad8815eb-99c8-439a-ba90-3eb48b3d9600	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	VIERNES	09:45	11:15	2	Aula 6-A	2026-11-03 03:48:38.998	2026-11-03 03:48:38.998
deff6c57-973f-4767-b4de-e17ebd9138f6	3b19feef-b3cd-44cd-89af-ad89ed7a2119	d3b90c62-05bb-4744-ab63-82d553dfc185	94756c34-bd8f-48e5-a531-b82ecfcc0b1f	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	LUNES	09:45	11:15	2	Aula 1-B	2026-11-03 03:48:39.001	2026-11-03 03:48:39.001
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at) FROM stdin;
f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	6to de Secundaria A	14	A	MORNING	40	2026-11-03 03:09:03.434	2026-11-03 03:48:38.826
3b19feef-b3cd-44cd-89af-ad89ed7a2119	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	1ro de Secundaria B	9	B	MORNING	35	2026-11-03 03:48:38.831	2026-11-03 03:48:38.831
\.


--
-- Data for Name: curriculum_topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curriculum_topics (id, subject_id, course_id, academic_year_id, period_number, grade_level, campo, unit_title, title, description, progress_percent, status, created_at, updated_at) FROM stdin;
5f7b4609-fab4-4dab-8d50-2f0f6b72e523	83f9322f-ae95-4a62-a24b-999c310836da	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	1	14	Ciencia, Tecnología y Producción	Unidad 1: Geometría Analítica	La Recta, Parábola y Elipse en el plano cartesiano	Ecuaciones fundamentales y resolución de problemas aplicados.	100	COMPLETADO	2026-11-03 03:48:39.006	2026-11-03 03:48:39.006
b1c4f293-9cc1-4504-a4b9-c14a950ea7ab	83f9322f-ae95-4a62-a24b-999c310836da	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2	14	Ciencia, Tecnología y Producción	Unidad 2: Cálculo Diferencial	Límites, Continuidad y Reglas de Derivación	Cálculo de derivadas directas y por definición.	75	EN_DESARROLLO	2026-11-03 03:48:39.006	2026-11-03 03:48:39.006
c19ba2e8-2864-46c2-8a88-a0435a8c9c33	83f9322f-ae95-4a62-a24b-999c310836da	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	3	14	Ciencia, Tecnología y Producción	Unidad 3: Cálculo Integral	Integrales Indefinidas y Métodos de Sustitución	Aplicación en cálculo de áreas bajo la curva.	0	PLANIFICADO	2026-11-03 03:48:39.006	2026-11-03 03:48:39.006
59c93853-c2fd-4365-b5f9-185abf3c3f06	ad8815eb-99c8-439a-ba90-3eb48b3d9600	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	1	14	Ciencia, Tecnología y Producción	Unidad 1: Mecánica de Fluidos	Presión Hidrostática y Principio de Arquímedes	Laboratorio de fluidos y empuje.	100	COMPLETADO	2026-11-03 03:48:39.006	2026-11-03 03:48:39.006
2fee0892-dfde-477f-8a24-774ea3fcb201	ad8815eb-99c8-439a-ba90-3eb48b3d9600	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2	14	Ciencia, Tecnología y Producción	Unidad 2: Termodinámica	Primera Ley de la Termodinámica y Máquinas Térmicas	Transformaciones isotérmicas, isobáricas y adiabáticas.	60	EN_DESARROLLO	2026-11-03 03:48:39.006	2026-11-03 03:48:39.006
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, student_id, course_id, academic_year_id, enrollment_date, status, remarks, created_at, updated_at) FROM stdin;
3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:10:03.128	ACTIVE	\N	2026-11-03 03:10:03.128	2026-11-03 03:48:39.193
02d7e3d0-b15b-4a3d-9599-a3059abcb6c6	2f6a5ab2-a478-4ba4-a343-b76d2516c3a4	3b19feef-b3cd-44cd-89af-ad89ed7a2119	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:48:39.204	ACTIVE	\N	2026-11-03 03:48:39.204	2026-11-03 03:48:39.204
\.


--
-- Data for Name: grade_correction_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grade_correction_requests (id, grade_id, requested_by_id, decided_by_id, previous_value, proposed_value, reason, evidence_reference, decision_reason, status, created_at, decided_at, executed_at) FROM stdin;
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, enrollment_id, student_id, subject_id, period_id, value, remarks, created_at, updated_at, published_at, published_by_id) FROM stdin;
18ddebf7-da31-4d4c-a7ef-98415456ff44	3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	434bf818-2262-4374-a75a-71b9ea0e08d1	6a37f125-c4c1-4813-bfaa-8ce98777c58c	88	Excelente desempeño y participación	2026-11-03 03:10:03.131	2026-11-03 03:11:42.125	2026-11-03 03:11:42.124	\N
3dc0d48f-8687-4059-ba49-9684080a6bfa	3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	e331d570-20b5-4264-bb73-07e560657b8b	6a37f125-c4c1-4813-bfaa-8ce98777c58c	92	Sobresaliente en comprensión lectora	2026-11-03 03:10:03.135	2026-11-03 03:11:42.137	2026-11-03 03:11:42.136	\N
ecb46356-0033-4131-86ed-691661f721da	3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	83f9322f-ae95-4a62-a24b-999c310836da	6a37f125-c4c1-4813-bfaa-8ce98777c58c	88	Excelente comprensión de funciones	2026-11-03 03:48:39.212	2026-11-03 03:48:39.212	2026-11-03 03:48:39.211	\N
8c059786-f042-43ea-80e7-23e73cd32262	3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	83f9322f-ae95-4a62-a24b-999c310836da	85efdaaa-0a7c-416c-b3f2-72e8b260bf78	85	Buen desempeño en cálculo de límites	2026-11-03 03:48:39.215	2026-11-03 03:48:39.215	2026-11-03 03:48:39.211	\N
629f0270-4949-4766-a3e8-a3fe02029730	3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	d3b90c62-05bb-4744-ab63-82d553dfc185	6a37f125-c4c1-4813-bfaa-8ce98777c58c	92	Habilidad destacada en redacción	2026-11-03 03:48:39.221	2026-11-03 03:48:39.221	2026-11-03 03:48:39.211	\N
d7e0ce17-7507-4fb9-a565-a3f6673eee8b	02d7e3d0-b15b-4a3d-9599-a3059abcb6c6	2f6a5ab2-a478-4ba4-a343-b76d2516c3a4	d3b90c62-05bb-4744-ab63-82d553dfc185	6a37f125-c4c1-4813-bfaa-8ce98777c58c	96	Excelente ortografía y lectura fluida	2026-11-03 03:48:39.224	2026-11-03 03:48:39.224	2026-11-03 03:48:39.211	\N
a2be2455-f9c3-4c49-8381-eeba8182a16c	3764c6cd-d262-4a80-affa-74c8edc28ed2	25320a19-d024-4fdf-9149-10a2620b89eb	ad8815eb-99c8-439a-ba90-3eb48b3d9600	6a37f125-c4c1-4813-bfaa-8ce98777c58c	91	Sobresaliente en laboratorio	2026-11-03 03:48:39.218	2026-11-03 06:32:09.551	2026-11-03 06:32:09.55	46da26a9-56a6-4f64-8c0c-573f60aaccee
\.


--
-- Data for Name: parents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parents (id, user_id, ci, first_name, last_name, phone, email, address, occupation, created_at, updated_at, deleted_at) FROM stdin;
bc61d95c-ee02-4e65-9efc-3f4a3ed44f3a	9c1704cc-77c6-4c76-b355-50d4734c508f	4567890	Roberto	Fernández	71234567	\N	Av. Las Américas #123, Santa Cruz	Ingeniero Civil	2026-11-03 03:11:42.254	2026-11-03 03:48:39.179	\N
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, description, module, created_at) FROM stdin;
1df151df-1f6c-4624-b5b4-76ece8565cef	users:read	Ver usuarios	users	2026-11-03 02:29:44.604
c83125de-1ca7-4957-aa3b-def9f98631b9	users:create	Crear usuarios	users	2026-11-03 02:29:44.632
6d6fde8c-6e22-44a8-89b8-f9acbc812b16	users:update	Editar usuarios	users	2026-11-03 02:29:44.634
d8903f30-0920-49fc-95a3-b449a12e52ac	users:delete	Eliminar usuarios	users	2026-11-03 02:29:44.636
6968717b-4651-4abe-9ea1-1195e6941086	academic-years:read	Ver gestiones académicas	academic-years	2026-11-03 02:29:44.638
academic-years-create-permission	academic-years:create	Crear gestiones académicas	academic-years	2026-11-03 02:29:32.437
academic-years-update-permission	academic-years:update	Actualizar gestiones académicas	academic-years	2026-11-03 02:29:32.437
academic-years-delete-permission	academic-years:delete	Eliminar gestiones académicas	academic-years	2026-11-03 02:29:32.437
3f4bcb55-88ae-496c-977f-3e278df6b1f7	periods:read	Ver periodos académicos	periods	2026-11-03 02:29:44.645
periods-create-permission	periods:create	Crear periodos académicos	periods	2026-11-03 02:29:32.437
5dcb4ff3-44a4-446c-86ef-2369385e2bce	periods:update	Actualizar y cerrar periodos académicos	periods	2026-11-03 02:29:44.654
54061bd7-f552-41f0-bee3-253243574d1b	subjects:read	Ver materias	subjects	2026-11-03 02:29:44.657
subjects-create-permission	subjects:create	Crear materias	subjects	2026-11-03 02:29:32.437
subjects-update-permission	subjects:update	Actualizar materias	subjects	2026-11-03 02:29:32.437
subjects-delete-permission	subjects:delete	Eliminar materias	subjects	2026-11-03 02:29:32.437
4979c762-3d81-4225-a0f2-1a9f49f33bed	courses:read	Ver cursos	courses	2026-11-03 02:29:44.664
9d3fe17d-b113-402b-846e-6307ee0ad019	courses:create	Crear cursos	courses	2026-11-03 02:29:44.666
dae1a7d7-c8ae-48ad-bae7-5a37dbaf80bd	courses:update	Editar cursos	courses	2026-11-03 02:29:44.668
282039bc-f999-4ac4-8693-d054d608dc8b	courses:delete	Eliminar cursos	courses	2026-11-03 02:29:44.67
556ab81d-fd40-4c93-bd26-baed80627008	enrollments:read	Ver matrículas	enrollments	2026-11-03 02:29:44.671
51f0e8aa-2562-44c9-8a80-73af006d710e	enrollments:create	Crear matrículas	enrollments	2026-11-03 02:29:44.673
1b1358b4-9a00-4538-92d2-cd36107ebd11	enrollments:update	Editar matrículas	enrollments	2026-11-03 02:29:44.675
3c16d8a4-260b-44c5-9510-2a855faf34d3	alerts:read	Ver alertas	alerts	2026-11-03 02:29:44.677
351bbafb-6915-448b-8f20-1bb38bc29a82	alerts:update	Marcar alertas como leídas	alerts	2026-11-03 02:29:44.678
alerts-configure-permission	alerts:configure	Configurar reglas de alertas tempranas	alerts	2026-11-03 02:29:32.425
8d9a3078-ba4b-4365-848c-4e7964c7d1da	parents:read	Ver familiares	parents	2026-11-03 02:29:44.682
2334d385-92fd-434a-8f2f-fbccf02161b6	parents:create	Registrar familiares	parents	2026-11-03 02:29:44.683
c4295838-fbbf-4ee7-9918-56a7baeb022d	parents:update	Actualizar familiares	parents	2026-11-03 02:29:44.685
6bbd623b-1d18-4c41-b2bd-5ac1125caabf	teachers:read	Ver docentes	teachers	2026-11-03 02:29:44.686
f876e67d-1e18-40a9-abbe-78b62fcec7d3	teachers:create	Registrar docentes	teachers	2026-11-03 02:29:44.688
ef59bf11-adf1-4214-a616-59a21bbc0de7	teachers:update	Actualizar docentes	teachers	2026-11-03 02:29:44.69
2b6536d5-0c97-45c6-a6d2-01ed817a4ebf	students:read	Ver estudiantes	students	2026-11-03 02:29:44.692
f15085b3-fbae-447e-a939-03cc8ad322bc	students:create	Registrar estudiantes	students	2026-11-03 02:29:44.693
712bb408-389e-4f4c-9d26-94a038906433	students:update	Actualizar estudiantes	students	2026-11-03 02:29:44.695
b0a1c84d-5335-4334-9bc1-66769c353249	students:delete	Eliminar estudiantes	students	2026-11-03 02:29:44.697
5cae2573-8b3d-46b2-895e-0546359303ab	grades:read	Ver calificaciones	grades	2026-11-03 02:29:44.698
7434c528-f54e-4aef-8f83-c6c1e4983ee6	grades:create	Registrar calificaciones	grades	2026-11-03 02:29:44.7
f9398452-1745-4361-a27f-6b094e89d1f9	grades:update	Modificar calificaciones	grades	2026-11-03 02:29:44.701
grades-publish-permission	grades:publish	Publicar calificaciones para familias y estudiantes	grades	2026-11-03 02:29:32.443
b7b95526-d21e-4cc4-ae41-b1c8e27fac55	attendance:read	Ver asistencia	attendance	2026-11-03 02:29:44.705
eefe73e8-4262-4820-941f-3170434a2869	attendance:create	Registrar asistencia	attendance	2026-11-03 02:29:44.706
fa2d951a-3da9-42ef-b850-96d9fc8280f4	attendance:update	Modificar asistencia	attendance	2026-11-03 02:29:44.708
47dd5715-5835-4e32-b9f7-38f4f1902147	audit:read	Ver bitácora de auditoría	audit	2026-11-03 02:29:44.71
e9d490b3-865a-4cdf-8c24-f5f0a3860a2d	sie:read	Ver estado de sincronizaciones SIE	sie-sync	2026-11-03 02:29:44.711
dcf7c5c6-848b-4264-aa7d-d6255798f3fd	sie:execute	Ejecutar sincronización con el SIE	sie-sync	2026-11-03 02:29:44.713
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token, expires_at, revoked_at, created_at, session_id) FROM stdin;
9abbcb98-cac3-4915-af91-ae8ca6bbe7a5	11b483b4-2d64-447c-98eb-787fd9767760	3a55d33408043da4c9e2e5f21dfae7119aa39c72c5b57634650d8231a0906b90	2026-11-10 02:38:15	\N	2026-11-03 02:38:15.491	41a2f0db-f15c-4b65-bd54-23be6e454a95
1080f992-735f-474d-8dbd-bb9cc91f150a	11b483b4-2d64-447c-98eb-787fd9767760	efe7946f8a03186c32916971975ec6f5ac8f2771a3f5a8996db8631eb1724f1d	2026-11-10 02:42:52	\N	2026-11-03 02:42:52.327	d2a5c439-2388-4244-94b1-89dacc36b755
a8fe8847-d981-4f11-ac7b-1b3beb1a0620	11b483b4-2d64-447c-98eb-787fd9767760	1fdbe9dc5d731811de06a6b86f21ec9a30106187fc9effe41d71c9fbe7b8c7f9	2026-11-10 03:13:07	\N	2026-11-03 03:13:07.687	dbdeb601-d450-4074-af8c-89ecf2915647
737676ae-83ae-49cd-b26c-ad55369fd878	46da26a9-56a6-4f64-8c0c-573f60aaccee	2100d721969cd3fdca9022e8ccecbb0abda5235e4e9c2c3bac3d207b2186f09d	2026-11-10 03:13:08	\N	2026-11-03 03:13:08.271	7f36cdb6-b220-4344-a067-d02ff9bfe9df
c8cbe4c9-fff6-4501-bad1-434af2fd3252	46da26a9-56a6-4f64-8c0c-573f60aaccee	a2c5c0ed347cf5bf6f1ad18007d89acdf5bd317d47da3957ed199931cd3d5d53	2026-11-10 03:13:09	\N	2026-11-03 03:13:09.109	23598b4d-b7f6-4227-9c06-f65156e5bfb7
037aa6a1-25b5-44a4-90c3-c5946fb781be	f18b8eec-37fe-40ad-a270-51e3f748e51e	314fe2f54730dafac7569948e05633abb37cd565d5180832bb46fc6f083b974b	2026-11-10 03:13:09	\N	2026-11-03 03:13:09.728	24da29a4-099a-46f1-95d1-c0be07452eb3
fd24e6d1-6f9c-4fd1-9188-c09741b72139	f18b8eec-37fe-40ad-a270-51e3f748e51e	8ecc04eb6fc411878ec1e80eda53c614991e3e04d5903e8c8b8ecbc740a9cb55	2026-11-10 03:13:10	\N	2026-11-03 03:13:10.771	b0d33ff3-fb25-42a4-b3ba-76e9b7e237b2
e819254a-1c6b-404d-acb5-65f958d47931	9c1704cc-77c6-4c76-b355-50d4734c508f	3eb26fc2334d5ed3d8549925a5e2a835aa811478214e54fd414f9ab433aec698	2026-11-10 03:13:11	\N	2026-11-03 03:13:11.347	cce7cb2f-3f91-4815-a4a9-fddfc0bad499
aef5e270-d1c4-4ec9-8057-241d36231e33	11b483b4-2d64-447c-98eb-787fd9767760	f1becd4b4f427ea57c6a9a38a7ecde1724d443acd5a48333dbab08ea6437018a	2026-11-10 03:23:06	2026-11-03 03:23:15.482	2026-11-03 03:23:06.99	37eb173f-7d05-4759-8b6a-f76827b1fd64
49be671a-08b7-4c22-b380-0a68ce14c1ae	11b483b4-2d64-447c-98eb-787fd9767760	43b94ed674f84a77c5c4cb857544a6e07a2ad39d09856a9e2cf76f560235a092	2026-11-10 03:23:15	2026-11-03 03:24:10.464	2026-11-03 03:23:15.487	37eb173f-7d05-4759-8b6a-f76827b1fd64
2063a2b5-9c41-4237-8944-c0a1f243716e	46da26a9-56a6-4f64-8c0c-573f60aaccee	d53906f5f6a96893a3517a6431f0f49252552020fd701c59f99a0fd7d5bf1cb3	2026-11-10 03:24:34	2026-11-03 03:24:45.063	2026-11-03 03:24:34.623	85f825e4-0cbe-4cc2-9ea8-eb6874a904a7
7c1b8718-76ae-47dd-92bb-b1880ee0cba2	f18b8eec-37fe-40ad-a270-51e3f748e51e	3c6da607a8b2f393f68ea357ce0c05ddc1a90bc88adba61413280f43b6382647	2026-11-10 03:25:02	2026-11-03 03:25:10.074	2026-11-03 03:25:02.422	6ef84520-e1f3-40b2-8519-ccfe76a7a80f
1936bc83-4bb9-44a0-878e-f0fe8af42300	9c1704cc-77c6-4c76-b355-50d4734c508f	a375e0998c70faccaa6e81d51c4cf97562d9fd8bca563add52ecd2087142f5a5	2026-11-10 03:25:29	2026-11-03 03:35:05.68	2026-11-03 03:25:29.192	ebde592b-cbc6-4ee9-9fb8-3baa88881e81
bb1bf1a5-296f-4c8c-9e58-3bb7d9577d27	11b483b4-2d64-447c-98eb-787fd9767760	e995a81f533985030ad7caa5a3e4c09167076178230341b5efc8ee3d2fa11baf	2026-11-10 03:49:26	\N	2026-11-03 03:49:26.591	f9a5d26b-9117-4762-b7de-422f79f26c56
4cc88053-774c-4c04-95b4-f0067f1f0e92	46da26a9-56a6-4f64-8c0c-573f60aaccee	95ddeee35263b9db9675dd2c95bc47bdb0de3b1e03d9ab19901fda2e288fa2ff	2026-11-10 03:49:27	\N	2026-11-03 03:49:27.176	d1681a3c-925a-44f7-993c-bb69fbfaebf1
60664c07-b704-4514-838e-89c8fe52084a	80de1a36-e1b9-4c20-a692-9a55a90bfae0	f9351e9c415ffe4633b87d892ef7156c1c0dadb912f7d9c9a996127fa91c928f	2026-11-10 03:49:27	\N	2026-11-03 03:49:27.993	de610f8f-e2f7-418e-8086-446bc4d4b59d
d05637cc-6f99-46d7-aff4-b7dba5ee9834	f18b8eec-37fe-40ad-a270-51e3f748e51e	f6346de7b98d3d44784e1ec99f20927befacb9c941ba4280b02e836a01879b26	2026-11-10 03:49:28	\N	2026-11-03 03:49:28.541	75ac8f3f-3dcf-4626-8f87-91af17f0f953
6a07aa89-5eee-47ac-8df3-3ccd242d2e3b	d454c0ed-dc30-427d-90c3-2888f78ac5a4	6766a91096461b4a79e54e7884db3c9aa2e20c73b7fa113d1d180c836730218f	2026-11-10 03:49:29	\N	2026-11-03 03:49:29.094	212d7663-2bb9-406f-908c-914d3608f1c3
faeb0929-94f5-46c3-9a20-049ecb9d9f5d	9c1704cc-77c6-4c76-b355-50d4734c508f	4442ec8b9ca256d3549f93651e48b737bd02f8882daea412b60be2b0261eeea1	2026-11-10 03:49:29	\N	2026-11-03 03:49:29.891	2e46dc97-ac68-4a89-ac2c-604c68db4725
7505460c-2e45-49f7-93a5-275253b040ae	11b483b4-2d64-447c-98eb-787fd9767760	db39ec4b75d3d8a3e194797f9bcbfa16f3c1d140f6f564e70550e32d20ba898f	2026-11-10 03:35:29	2026-11-03 03:51:08.759	2026-11-03 03:35:29.732	d1303402-3db4-409e-bbc4-1d42a4e408ac
ff136492-1673-4ccc-9591-d8df3e10c3fe	11b483b4-2d64-447c-98eb-787fd9767760	34d68c209644210ec2fca2bea7162f44669ed1dd7cc8a44f61599bc51da5037c	2026-11-10 03:51:08	2026-11-03 03:51:10.588	2026-11-03 03:51:08.764	d1303402-3db4-409e-bbc4-1d42a4e408ac
1a761a7c-5fc1-4081-9026-5e074200f545	9c1704cc-77c6-4c76-b355-50d4734c508f	c6049e39bb209168acabdd0b8d9b6fafc5d00a893122d4aaf13779ca6cc23e60	2026-11-10 03:51:24	2026-11-03 03:51:43.492	2026-11-03 03:51:24.134	6210260c-2408-4518-803b-009cd6070896
c399d7b9-c4cf-414c-9380-ff41445e5f12	f18b8eec-37fe-40ad-a270-51e3f748e51e	611f36f48dac3a329a99bbe5bd181ce93d8286e9ad0e4842313ab411f87d0f73	2026-11-10 04:19:45	2026-11-03 04:20:40.929	2026-11-03 04:19:45.599	f37732f3-00a9-471a-a43e-4c4e1ab53cc6
74c88297-8335-4145-a307-3b035439c326	46da26a9-56a6-4f64-8c0c-573f60aaccee	ba2b46e0895a7c846f551051e63ae45d1d3d4c6905b869bc918af1dfe793843a	2026-11-10 04:21:55	2026-11-03 04:22:25.04	2026-11-03 04:21:55.414	f11d7541-234c-4f05-b4bd-a22752fe4727
ce06eaa5-e782-4ef6-bfb1-deb317e56f8d	9c1704cc-77c6-4c76-b355-50d4734c508f	5c1e19eb64e1deba8a32954ce360eaae62c9afd2c8a9c002ee36c8e2ccb410a1	2026-11-10 04:56:03	\N	2026-11-03 04:56:03.008	a8709d92-cb6a-4118-82ab-e8ef31ed78b9
4e87d2d0-dbb8-4d11-b1fe-9f74ace057c6	f18b8eec-37fe-40ad-a270-51e3f748e51e	938188cd5be7afb9f5fb4f24485d3aaadf9ac1ec7d96a7c0ae01bc82edcd676f	2026-11-10 04:56:03	\N	2026-11-03 04:56:03.382	53956d86-2b95-4f22-818f-13f13533ffcc
76e8402f-0af1-4e00-9d96-b9ecaed5e1ee	46da26a9-56a6-4f64-8c0c-573f60aaccee	276e4812e9680f2e6071688100a14a49e210954c6760093c8cbf11dfd770f0e9	2026-11-10 04:56:03	\N	2026-11-03 04:56:03.776	1c8a9749-fbf9-4d95-b6bc-4e54a1e94643
f91baa39-0f09-4063-8380-eea200a4e9bc	9c1704cc-77c6-4c76-b355-50d4734c508f	034c303711a9dd6b2d9786f10f134b4f610408a42247ac614d25ff94f2711368	2026-11-10 04:56:16	\N	2026-11-03 04:56:16.527	c39f1928-7017-4051-9014-a4d9196aaa28
d806c56e-5dfb-419d-8351-3faabba1dcc4	f18b8eec-37fe-40ad-a270-51e3f748e51e	6650dc7b1f7d26bd1a1d2f1aedb99bd60ea3f708fc47a2437a44baa0afff147e	2026-11-10 04:56:28	\N	2026-11-03 04:56:28.441	9c7a526c-1929-48a8-91ec-31691cf2d903
5c6b4248-aa27-4017-86cd-d38847210123	11b483b4-2d64-447c-98eb-787fd9767760	a44a6ba49da61cdfe62f83ef647a92cd71faadb3ce77d6bcb72b98fd4264c00f	2026-11-10 04:24:56	2026-11-03 04:58:54.854	2026-11-03 04:24:56.366	2c8fdd0c-f2b9-4b0e-b9d5-b19d96b80f41
bccd52cc-16e3-4b85-a1a5-6fc6f5ccdd81	11b483b4-2d64-447c-98eb-787fd9767760	54d6e869e5ad10ad05d425007ab3a8dcc962ccdea501b17f01bf3db0889b29db	2026-11-10 04:58:54	2026-11-03 04:58:58.41	2026-11-03 04:58:54.859	2c8fdd0c-f2b9-4b0e-b9d5-b19d96b80f41
001099ce-961f-4d58-9bc5-7aaa1749e2f4	9c1704cc-77c6-4c76-b355-50d4734c508f	98efaf437fcffff6fd0fe7bcbcd46f4bf2445e2011b80a2bee2ef01544eac794	2026-11-10 04:59:43	2026-11-03 05:01:22.952	2026-11-03 04:59:43.854	ee640a03-e4cd-4207-bc6e-6d8a9dfed840
914b7aec-b774-4873-83e9-f6bb3b792db5	46da26a9-56a6-4f64-8c0c-573f60aaccee	890694937034b07c98dcb3ca6c7717af27948d73a1f7ef8f921a83988c7e19d7	2026-11-10 05:02:08	2026-11-03 05:05:29.056	2026-11-03 05:02:08.273	2bfaed07-9a84-4827-a2af-e012f34eee7a
21ec5e7a-c571-4802-ba08-46ad548fda43	9c1704cc-77c6-4c76-b355-50d4734c508f	ef8c220a3257faa76080aacadeef7cfecc32026a72afbdf8e5cab9a54a22b54f	2026-11-10 04:02:45	2026-11-03 05:25:43.337	2026-11-03 04:02:45.361	b69ba9c4-43be-4509-8c49-955836f1fde5
328499f2-f1b1-4663-9588-a77ef8927791	11b483b4-2d64-447c-98eb-787fd9767760	5e8bddb7e5a81061929f4f4c26357f6e702fcb5c5166a4bdbb3ffda71226c211	2026-11-10 05:26:23	\N	2026-11-03 05:26:23.558	b29f0d38-09c0-4dae-9fcb-ad693f3a90ef
bf636f1a-23a0-4df6-9d74-4e323d650f53	46da26a9-56a6-4f64-8c0c-573f60aaccee	8a00f2ea8a3faf92111cf6c4272c4f74771c9f496aab243c06ed0d958474f3b7	2026-11-10 05:26:30	\N	2026-11-03 05:26:30.348	845a0a4f-dd71-40c3-a94c-9c999650a812
ed698c8e-8db4-44a9-9928-7bea5d24b695	46da26a9-56a6-4f64-8c0c-573f60aaccee	5ab01f2f6183bde903df34241adbdad09a4fae0fed8a13c54913d54c578f4d54	2026-11-10 05:26:39	\N	2026-11-03 05:26:39.721	63436026-a8ec-4546-8280-ee69a72e692f
23eac0eb-5f1d-4b71-a694-4d8400820a42	9c1704cc-77c6-4c76-b355-50d4734c508f	9345c20d5add564adb7d41235080be8a9b15bef451f08a80e2ce588bfbcb17fb	2026-11-10 05:26:48	\N	2026-11-03 05:26:48.209	02e6cc20-a8ec-46c2-ba84-5e9202e42c5b
ed7f1837-7363-4459-b07f-4a9683a08a34	f18b8eec-37fe-40ad-a270-51e3f748e51e	1953f20d1bc0ee7e24ac8aea14ebe8f788b5789966a779b80fa3beacf9c4d839	2026-11-10 05:26:55	\N	2026-11-03 05:26:55.535	149c04d6-d1c6-425e-82e1-df3bffbaad96
cd060df4-5104-4161-9721-8059fdaea403	f18b8eec-37fe-40ad-a270-51e3f748e51e	aca8d615740e6faae18c8db5d0dc5cde53dccf3fcf032935dafc9651175652ab	2026-11-10 05:27:01	\N	2026-11-03 05:27:01.985	bbd1e7e6-27f5-4450-af4a-319cb6dd7df4
0e9838ad-89d2-4431-a973-8af4f344d3ed	11b483b4-2d64-447c-98eb-787fd9767760	4ae652a65b443ca48a9ebd42ad86305f6e80a1167ab8dabc2cf420b8fa7d5c69	2026-11-10 05:06:04	2026-11-03 05:31:49.285	2026-11-03 05:06:04.464	14dc0f9b-142e-48dd-9b0c-3ec6651dc967
f85fa7d5-b4d9-45c6-ab9c-9336e677857a	11b483b4-2d64-447c-98eb-787fd9767760	a80db635507c7e29f2917b0d42d800cd665e7d8445dca713145fce4ef6c0eb24	2026-11-10 05:31:49	2026-11-03 05:32:12.401	2026-11-03 05:31:49.29	14dc0f9b-142e-48dd-9b0c-3ec6651dc967
c5556d3e-80cc-4ba8-ba21-e20cfc2dfb91	9c1704cc-77c6-4c76-b355-50d4734c508f	885c0347ff8a49a491a337b6a5f335782218a7fd0a224ab37c28eb25bdf5be48	2026-11-10 05:25:43	2026-11-03 05:35:30.629	2026-11-03 05:25:43.342	b69ba9c4-43be-4509-8c49-955836f1fde5
e171582f-c943-4a30-9cb7-4cbb6e513435	9c1704cc-77c6-4c76-b355-50d4734c508f	ebe5136ba18b36385a186c104bd49393100b60f3f3cbc05c397c0c991f8abdc2	2026-11-10 05:34:22	2026-11-03 05:38:06.518	2026-11-03 05:34:22.837	a4f0ff73-d0f2-476e-a790-b042d8658071
f11bb73b-2a6d-4ff9-b847-3267cadfbaa1	9c1704cc-77c6-4c76-b355-50d4734c508f	7ee9aca7306b30caaf50ab4b6432b61dc3bc8dcd0a1725e40b6567de9270364d	2026-11-10 05:54:58	2026-11-03 05:55:53.24	2026-11-03 05:54:58.633	8f4571d6-4d30-44fc-b517-ffac969ed9da
79cde128-59f0-463a-931f-4f2fb094f5bc	f18b8eec-37fe-40ad-a270-51e3f748e51e	833e2397e44e0a4685fae92a0a572f691524e77ea3d656ea7e5129de88840329	2026-11-10 05:58:04	\N	2026-11-03 05:58:04.582	feed0f2b-ad32-43c8-99fd-45ab39531848
78731a14-f7a2-4d9f-8b40-0b2b6b3b5cec	11b483b4-2d64-447c-98eb-787fd9767760	c9ed2ab69a70afcfc31158b224fbc18826fd7eaeb57c4c4543c6566596c238c5	2026-11-10 05:53:13	2026-11-03 06:26:37.52	2026-11-03 05:53:13.874	9db1089f-794f-4811-937f-13ece96874a2
798d71c0-70a4-4f03-bd11-a5c3be38cdb6	11b483b4-2d64-447c-98eb-787fd9767760	bf2b6b58d724aabd8838cb5f64eb099ca9bbc8bada01122512a97894336dccd3	2026-11-10 06:26:37	2026-11-03 06:26:37.992	2026-11-03 06:26:37.524	9db1089f-794f-4811-937f-13ece96874a2
be48dc83-8eff-4ea9-b4c6-8fab6ff37f1d	f18b8eec-37fe-40ad-a270-51e3f748e51e	f7c0924de3ad38df75f674e38556444307208ad038600b1405b026d2e51911d9	2026-11-10 06:27:20	\N	2026-11-03 06:27:20.107	9fd0a37e-fe12-4e06-8ce6-63517af6c711
2b3ec03c-d0cd-438f-90d4-a997a11c7c34	11b483b4-2d64-447c-98eb-787fd9767760	7431653c500fce975a26295878426f2b2237ec154c878052c6df1d792855a7b1	2026-11-10 06:28:21	\N	2026-11-03 06:28:21.827	2098ad96-bced-4bcf-915f-f5463e94af20
467b831e-1e8b-474a-83f5-78d2dd9f8c78	46da26a9-56a6-4f64-8c0c-573f60aaccee	97505bcf1a00ea947c148dd7d221cd096ca94fe63abb058bceadfd9ac9744d93	2026-11-10 06:28:22	\N	2026-11-03 06:28:22.382	f88a7203-b810-4ab1-a698-b72d782db1fe
efa91b7f-040a-42fd-804d-cd4046960e73	46da26a9-56a6-4f64-8c0c-573f60aaccee	d2f2dfc84fb1ca522fe3b067a532540c7f0c5362e39fe3523ab9573d877c4d82	2026-11-10 06:28:22	\N	2026-11-03 06:28:22.94	6bf590c8-62af-47e2-b5d6-a524e21e4207
7bc23bae-f704-4348-b8c7-0dc47ef4f81e	f18b8eec-37fe-40ad-a270-51e3f748e51e	6d02024d5b9463e3f8ffaeeb2313f6c5b9028a6c3d7404e45719578310ff3a81	2026-11-10 06:28:24	\N	2026-11-03 06:28:24.206	9e1367ac-1f13-4053-8571-297a544e5f81
df174193-1d3b-42f5-b92b-21b0822e9e98	9c1704cc-77c6-4c76-b355-50d4734c508f	b03230ff3dde6ad84d82213ce8c50d909635f327089ce2630dcfd4be9b7b06e6	2026-11-10 06:28:24	\N	2026-11-03 06:28:24.768	1232d374-a41a-4e7c-9316-1da2b3d270dd
bd9f3b21-ed28-407f-914d-aa8252a97cf9	9c1704cc-77c6-4c76-b355-50d4734c508f	6c4b65c49c9040033be72d8f98faadf28b20b8d96a598ba0b7e9e2705461006c	2026-11-10 06:28:25	\N	2026-11-03 06:28:25.322	72765593-6e38-44eb-9433-9a470ec59b4d
250b82f1-7736-4eb9-a224-f43ead807a5e	f18b8eec-37fe-40ad-a270-51e3f748e51e	fe68c05218b2f28e49d27ce659bd88f517c951b21d19413b34da8d2709317ee7	2026-11-10 06:28:25	\N	2026-11-03 06:28:25.881	67c3968e-91dc-4dc1-8efb-304d5626bb2a
f991ebf4-923c-4bd7-b3cd-009ce6300cf3	46da26a9-56a6-4f64-8c0c-573f60aaccee	d721a47b81372ade6cf750994d22c2f78b2cc1afe13e63a28c067d070d52e341	2026-11-10 07:01:49	\N	2026-11-03 07:01:49.242	d79154a3-a466-4285-b59e-47ddccc1bfd5
83cbe9fb-f88c-4e3d-aaa7-c8d0d0e0cfb3	46da26a9-56a6-4f64-8c0c-573f60aaccee	ac94e7a4175f796bba9fe206988d1c622a5c7445e2543aeb7104e8828f19f5c2	2026-11-10 06:30:56	2026-11-03 07:02:16.425	2026-11-03 06:30:56.451	9572f520-800b-49f1-bc48-72fe5dcf0164
901dc630-a9bd-4d02-8507-50af0bef3a79	46da26a9-56a6-4f64-8c0c-573f60aaccee	fdbbc5c7b57ef6d9804e7929e2b8128170cc2bd46e041672506ffc87af40193f	2026-11-10 07:02:16	2026-11-03 13:32:57.044	2026-11-03 07:02:16.433	9572f520-800b-49f1-bc48-72fe5dcf0164
de2b3873-d6a6-4e38-badb-77fd3d020afd	46da26a9-56a6-4f64-8c0c-573f60aaccee	57d20e5a7b5a514593b9104b93bd51ffe5552cbe88f29a5426d1c29bb1eb29ec	2026-11-10 13:32:57	2026-11-03 13:34:14.086	2026-11-03 13:32:57.05	9572f520-800b-49f1-bc48-72fe5dcf0164
7080eb2d-3208-4dba-8a46-f527b0883b3c	46da26a9-56a6-4f64-8c0c-573f60aaccee	c49a52850539b9b96f5a39f6ffe3ac16fce39eb25e1fe02240e2d12e31dd26fd	2026-11-10 13:34:14	2026-11-03 13:34:35.663	2026-11-03 13:34:14.089	9572f520-800b-49f1-bc48-72fe5dcf0164
afb8a0b1-a1d5-431f-abb6-d2fa4c4bbda0	46da26a9-56a6-4f64-8c0c-573f60aaccee	52961b52a6dc66d51b776268f8fd617e50fe6beaf5de3880ff04387c8ed4f07e	2026-11-10 13:34:35	2026-11-03 13:34:51.884	2026-11-03 13:34:35.666	9572f520-800b-49f1-bc48-72fe5dcf0164
bbf5b992-32e7-48cb-8dcd-02c6ab4e99f5	f18b8eec-37fe-40ad-a270-51e3f748e51e	f48a6aa6e9e512ac1f8c79e58b89b09d11c3f3e879e11bd6b0e67395179fc8f8	2026-11-10 13:35:32	2026-11-03 13:52:21.018	2026-11-03 13:35:32.1	436ee3c5-a016-44bc-9074-042862a1ea03
698f9202-2322-460a-adeb-32b4e9c4d600	f18b8eec-37fe-40ad-a270-51e3f748e51e	2382e3282c982b93ace04b90b75a5f1c2443a2618d8f3d6f82ed8ff8a21f78a5	2026-11-10 13:52:21	2026-11-03 13:52:27.478	2026-11-03 13:52:21.022	436ee3c5-a016-44bc-9074-042862a1ea03
bb2db83f-1081-45b4-81b8-0a984c2470f5	f18b8eec-37fe-40ad-a270-51e3f748e51e	4cad26add4f21ffa5a802ea8b30a4c1158f78dd62973c28534ddd20b75b0fc1d	2026-11-10 13:52:27	2026-11-03 14:19:43.43	2026-11-03 13:52:27.481	436ee3c5-a016-44bc-9074-042862a1ea03
0b2c0011-22c3-4d1f-b3be-6225606d05bf	f18b8eec-37fe-40ad-a270-51e3f748e51e	353d15067bd37b6f9bdd8c011f527af0092677e6a3a51f642130c68750b6cb48	2026-11-10 14:19:43	2026-11-04 00:38:24.541	2026-11-03 14:19:43.435	436ee3c5-a016-44bc-9074-042862a1ea03
8b7db89b-081e-43d8-b821-60b70bd8bf15	f18b8eec-37fe-40ad-a270-51e3f748e51e	10c2f114fd6e10e4e1de8f6b103eed548cacf1ae5974e6fc23f3eb4f1c5611a7	2026-11-11 00:38:24	\N	2026-11-04 00:38:24.548	436ee3c5-a016-44bc-9074-042862a1ea03
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, role, permission_id, created_at) FROM stdin;
alerts-configure-admin	ADMINISTRATIVE	alerts-configure-permission	2026-11-03 02:29:32.425
academic-management-academic-years-create-administrative	ADMINISTRATIVE	academic-years-create-permission	2026-11-03 02:29:32.437
academic-management-academic-years-create-secretary	SECRETARY	academic-years-create-permission	2026-11-03 02:29:32.437
academic-management-academic-years-update-administrative	ADMINISTRATIVE	academic-years-update-permission	2026-11-03 02:29:32.437
academic-management-academic-years-update-secretary	SECRETARY	academic-years-update-permission	2026-11-03 02:29:32.437
academic-management-periods-create-administrative	ADMINISTRATIVE	periods-create-permission	2026-11-03 02:29:32.437
academic-management-periods-create-secretary	SECRETARY	periods-create-permission	2026-11-03 02:29:32.437
academic-management-subjects-create-administrative	ADMINISTRATIVE	subjects-create-permission	2026-11-03 02:29:32.437
academic-management-subjects-create-secretary	SECRETARY	subjects-create-permission	2026-11-03 02:29:32.437
academic-management-subjects-update-administrative	ADMINISTRATIVE	subjects-update-permission	2026-11-03 02:29:32.437
academic-management-subjects-update-secretary	SECRETARY	subjects-update-permission	2026-11-03 02:29:32.437
academic-years-delete-admin	ADMINISTRATIVE	academic-years-delete-permission	2026-11-03 02:29:32.437
subjects-delete-admin	ADMINISTRATIVE	subjects-delete-permission	2026-11-03 02:29:32.437
grades-publish-administrative	ADMINISTRATIVE	grades-publish-permission	2026-11-03 02:29:32.443
grades-publish-secretary	SECRETARY	grades-publish-permission	2026-11-03 02:29:32.443
grades-publish-teacher	TEACHER	grades-publish-permission	2026-11-03 02:29:32.443
3d853686-e76a-4c53-b2d0-9cbc43c881fd	ADMINISTRATIVE	1df151df-1f6c-4624-b5b4-76ece8565cef	2026-11-03 02:29:44.719
97f63213-25fb-4499-b900-b7a36682b3b9	ADMINISTRATIVE	c83125de-1ca7-4957-aa3b-def9f98631b9	2026-11-03 02:29:44.724
da08cfe6-8f6e-496f-9419-90281c31e977	ADMINISTRATIVE	6d6fde8c-6e22-44a8-89b8-f9acbc812b16	2026-11-03 02:29:44.726
3e3bc5b3-9d0d-4308-bcd0-300bee437de3	ADMINISTRATIVE	d8903f30-0920-49fc-95a3-b449a12e52ac	2026-11-03 02:29:44.729
450ba213-55be-4d40-8414-02ca0befa197	ADMINISTRATIVE	6968717b-4651-4abe-9ea1-1195e6941086	2026-11-03 02:29:44.731
9bd13826-c22a-4ec2-a58b-036f5e8348fc	ADMINISTRATIVE	3f4bcb55-88ae-496c-977f-3e278df6b1f7	2026-11-03 02:29:44.737
18471b70-8fa6-4490-8073-7da41dae2569	ADMINISTRATIVE	5dcb4ff3-44a4-446c-86ef-2369385e2bce	2026-11-03 02:29:44.74
35931d60-6d33-4254-8958-67056ddbc655	ADMINISTRATIVE	54061bd7-f552-41f0-bee3-253243574d1b	2026-11-03 02:29:44.743
73594c0e-f89b-4cab-b459-9b4790b62303	ADMINISTRATIVE	4979c762-3d81-4225-a0f2-1a9f49f33bed	2026-11-03 02:29:44.748
47c40c9a-f897-4ef7-a086-119f8dc3ae68	ADMINISTRATIVE	9d3fe17d-b113-402b-846e-6307ee0ad019	2026-11-03 02:29:44.751
de5d180b-1a9c-4efb-82e4-bf1fe07e00bf	ADMINISTRATIVE	dae1a7d7-c8ae-48ad-bae7-5a37dbaf80bd	2026-11-03 02:29:44.753
7d3b6919-1f43-46f9-b8f0-986bf2146efc	ADMINISTRATIVE	282039bc-f999-4ac4-8693-d054d608dc8b	2026-11-03 02:29:44.755
7e3a3955-5cf7-491e-aedc-99af9c3bffa2	ADMINISTRATIVE	556ab81d-fd40-4c93-bd26-baed80627008	2026-11-03 02:29:44.757
ae9deb79-1577-4d4d-8fcb-2a93e95a5481	ADMINISTRATIVE	51f0e8aa-2562-44c9-8a80-73af006d710e	2026-11-03 02:29:44.759
61b7d12a-d0a2-4d27-93a6-721a28cfe1af	ADMINISTRATIVE	1b1358b4-9a00-4538-92d2-cd36107ebd11	2026-11-03 02:29:44.761
a0e60cd8-c07c-411a-9c0b-0f22dce20a4d	ADMINISTRATIVE	3c16d8a4-260b-44c5-9510-2a855faf34d3	2026-11-03 02:29:44.763
996b30cf-6128-4d76-9214-b4e09907db25	ADMINISTRATIVE	351bbafb-6915-448b-8f20-1bb38bc29a82	2026-11-03 02:29:44.766
019891bc-a8e3-43ea-943c-db65559df207	ADMINISTRATIVE	8d9a3078-ba4b-4365-848c-4e7964c7d1da	2026-11-03 02:29:44.769
2e3324c5-099d-403c-871b-416c13b77bc3	ADMINISTRATIVE	2334d385-92fd-434a-8f2f-fbccf02161b6	2026-11-03 02:29:44.771
1e883802-a27d-449b-be62-380bee8d3f10	ADMINISTRATIVE	c4295838-fbbf-4ee7-9918-56a7baeb022d	2026-11-03 02:29:44.773
48216980-f179-40de-bea3-8ebb66da048b	ADMINISTRATIVE	6bbd623b-1d18-4c41-b2bd-5ac1125caabf	2026-11-03 02:29:44.775
c62e92cd-a312-475d-bccd-6a1d67ceb014	ADMINISTRATIVE	f876e67d-1e18-40a9-abbe-78b62fcec7d3	2026-11-03 02:29:44.778
c23ecb5f-7478-4d89-a673-e5917c818cf8	ADMINISTRATIVE	ef59bf11-adf1-4214-a616-59a21bbc0de7	2026-11-03 02:29:44.78
64a28ee7-770a-49b2-ab03-8a8106a1384f	ADMINISTRATIVE	2b6536d5-0c97-45c6-a6d2-01ed817a4ebf	2026-11-03 02:29:44.782
927b26b1-4db6-430b-9a91-563e6fbef536	ADMINISTRATIVE	f15085b3-fbae-447e-a939-03cc8ad322bc	2026-11-03 02:29:44.784
3586bef7-c14b-43ad-b494-3592b26ed768	ADMINISTRATIVE	712bb408-389e-4f4c-9d26-94a038906433	2026-11-03 02:29:44.786
f1c21f87-7129-4348-8e60-31b65c72178d	ADMINISTRATIVE	b0a1c84d-5335-4334-9bc1-66769c353249	2026-11-03 02:29:44.789
9f051c5e-df2d-4948-b626-5e8649eff4de	ADMINISTRATIVE	5cae2573-8b3d-46b2-895e-0546359303ab	2026-11-03 02:29:44.791
b40dbbd7-e446-4f7c-b63d-2c8786d94365	ADMINISTRATIVE	7434c528-f54e-4aef-8f83-c6c1e4983ee6	2026-11-03 02:29:44.793
adb18fa4-ca25-4985-b693-f42d5035490b	ADMINISTRATIVE	f9398452-1745-4361-a27f-6b094e89d1f9	2026-11-03 02:29:44.795
e62f2d93-fc63-401d-b9c3-563c83da396b	ADMINISTRATIVE	b7b95526-d21e-4cc4-ae41-b1c8e27fac55	2026-11-03 02:29:44.799
fc0de768-6516-4f79-a3b4-858feac3867e	ADMINISTRATIVE	eefe73e8-4262-4820-941f-3170434a2869	2026-11-03 02:29:44.801
4619e1da-8a12-47fb-992d-476de4c5379b	ADMINISTRATIVE	fa2d951a-3da9-42ef-b850-96d9fc8280f4	2026-11-03 02:29:44.803
ddb2ce16-cd94-43c1-98ab-1cac2eefdd27	ADMINISTRATIVE	47dd5715-5835-4e32-b9f7-38f4f1902147	2026-11-03 02:29:44.805
767d8d60-b13d-481d-a04b-680251cc147f	ADMINISTRATIVE	e9d490b3-865a-4cdf-8c24-f5f0a3860a2d	2026-11-03 02:29:44.807
c844709e-2132-4139-9b0d-429901d0b364	ADMINISTRATIVE	dcf7c5c6-848b-4264-aa7d-d6255798f3fd	2026-11-03 02:29:44.809
d35674c3-cfe3-44f3-9033-9e0970a41042	SECRETARY	1df151df-1f6c-4624-b5b4-76ece8565cef	2026-11-03 02:29:44.811
5e709f57-eb4c-4d5f-abed-3ec6ecea95c8	SECRETARY	6968717b-4651-4abe-9ea1-1195e6941086	2026-11-03 02:29:44.813
0436b8ff-d129-42b0-a50a-1e1e3d75a918	SECRETARY	3f4bcb55-88ae-496c-977f-3e278df6b1f7	2026-11-03 02:29:44.818
fb77fda7-27d6-4a85-876f-08fb0f7b6407	SECRETARY	5dcb4ff3-44a4-446c-86ef-2369385e2bce	2026-11-03 02:29:44.821
b26529bd-0fac-482e-9d01-1a5220718733	SECRETARY	54061bd7-f552-41f0-bee3-253243574d1b	2026-11-03 02:29:44.823
7be38672-b4e3-419f-a64c-a8f857088402	SECRETARY	4979c762-3d81-4225-a0f2-1a9f49f33bed	2026-11-03 02:29:44.828
575d88ba-07ce-4d12-b260-08d65f7c7ca1	SECRETARY	9d3fe17d-b113-402b-846e-6307ee0ad019	2026-11-03 02:29:44.83
68da6fe8-4993-4135-96dd-ae0cb2be517e	SECRETARY	dae1a7d7-c8ae-48ad-bae7-5a37dbaf80bd	2026-11-03 02:29:44.832
b04fdcae-50cb-4c62-adeb-956df615939c	SECRETARY	556ab81d-fd40-4c93-bd26-baed80627008	2026-11-03 02:29:44.834
3bd86c4e-a8e9-4466-b708-7f1a190998d6	SECRETARY	51f0e8aa-2562-44c9-8a80-73af006d710e	2026-11-03 02:29:44.837
cefa6c64-9456-477a-b4de-19f2ede1cbd6	SECRETARY	1b1358b4-9a00-4538-92d2-cd36107ebd11	2026-11-03 02:29:44.839
d43896b0-58c0-47de-aa64-00f2e3023a22	SECRETARY	3c16d8a4-260b-44c5-9510-2a855faf34d3	2026-11-03 02:29:44.841
3d4bf429-7a6f-488a-9ab3-699b62af851e	SECRETARY	351bbafb-6915-448b-8f20-1bb38bc29a82	2026-11-03 02:29:44.843
70ddb194-357c-4f81-8fc1-7a80b2c82c02	SECRETARY	8d9a3078-ba4b-4365-848c-4e7964c7d1da	2026-11-03 02:29:44.845
be2f0126-7c3a-41f3-bd19-edd472f10533	SECRETARY	2334d385-92fd-434a-8f2f-fbccf02161b6	2026-11-03 02:29:44.847
067ebd85-398f-4d92-bfa9-17164cd63fca	SECRETARY	c4295838-fbbf-4ee7-9918-56a7baeb022d	2026-11-03 02:29:44.849
a615238b-c0ae-410b-b8df-9b8582b6d477	SECRETARY	6bbd623b-1d18-4c41-b2bd-5ac1125caabf	2026-11-03 02:29:44.851
aae6fbc5-4925-4aa3-a2a8-f419d67f9909	SECRETARY	f876e67d-1e18-40a9-abbe-78b62fcec7d3	2026-11-03 02:29:44.854
1f6f0cf0-ff68-46ba-aaf8-a1c75010f2e4	SECRETARY	ef59bf11-adf1-4214-a616-59a21bbc0de7	2026-11-03 02:29:44.856
fe2d465b-8c38-4c55-b500-183f05ba9d57	SECRETARY	2b6536d5-0c97-45c6-a6d2-01ed817a4ebf	2026-11-03 02:29:44.858
e9b64e96-4708-4450-a9e5-a4ce886170d7	SECRETARY	f15085b3-fbae-447e-a939-03cc8ad322bc	2026-11-03 02:29:44.86
a0980932-87ab-4e7d-be06-c5bc46338835	SECRETARY	712bb408-389e-4f4c-9d26-94a038906433	2026-11-03 02:29:44.862
101867ae-729d-4a33-9d5f-89a16b402a66	SECRETARY	5cae2573-8b3d-46b2-895e-0546359303ab	2026-11-03 02:29:44.864
03002d91-144a-49c5-a66b-f8769f01800d	SECRETARY	7434c528-f54e-4aef-8f83-c6c1e4983ee6	2026-11-03 02:29:44.866
ba5f66ee-dba1-4f34-b075-f5b1cdb60c56	SECRETARY	f9398452-1745-4361-a27f-6b094e89d1f9	2026-11-03 02:29:44.868
d67fc14c-ac91-4a04-857e-a2fdf5d322aa	SECRETARY	e9d490b3-865a-4cdf-8c24-f5f0a3860a2d	2026-11-03 02:29:44.872
50a78c5b-2d48-4bf5-846e-2426e4172e9a	SECRETARY	dcf7c5c6-848b-4264-aa7d-d6255798f3fd	2026-11-03 02:29:44.874
80d5c049-99b8-4e6e-975e-35fb329bfaf3	TEACHER	6968717b-4651-4abe-9ea1-1195e6941086	2026-11-03 02:29:44.876
ea81600f-0b6a-4f46-939e-a093ab7f1a1f	TEACHER	3f4bcb55-88ae-496c-977f-3e278df6b1f7	2026-11-03 02:29:44.878
ecd9d6cf-51d5-4707-92f3-5ddac3af74ea	TEACHER	54061bd7-f552-41f0-bee3-253243574d1b	2026-11-03 02:29:44.88
e12c4875-3ceb-4798-b53f-db4653cf6776	TEACHER	4979c762-3d81-4225-a0f2-1a9f49f33bed	2026-11-03 02:29:44.883
c2d40e23-4820-4884-ac27-730392f64307	TEACHER	556ab81d-fd40-4c93-bd26-baed80627008	2026-11-03 02:29:44.885
0b05a00f-ad76-458a-b782-62680239bc40	TEACHER	3c16d8a4-260b-44c5-9510-2a855faf34d3	2026-11-03 02:29:44.887
1e485c37-a6f7-4479-a9f9-5d14f67575f4	TEACHER	351bbafb-6915-448b-8f20-1bb38bc29a82	2026-11-03 02:29:44.889
80397d87-930b-4754-b31c-1e51364a24ff	TEACHER	6bbd623b-1d18-4c41-b2bd-5ac1125caabf	2026-11-03 02:29:44.891
9fadec5a-927a-44fa-a157-43f9151965e4	TEACHER	2b6536d5-0c97-45c6-a6d2-01ed817a4ebf	2026-11-03 02:29:44.893
483d02cc-530e-4c0a-93be-da5e479f5860	TEACHER	5cae2573-8b3d-46b2-895e-0546359303ab	2026-11-03 02:29:44.895
46d0b030-34cb-4d3c-857b-d97c8e7cda9a	TEACHER	7434c528-f54e-4aef-8f83-c6c1e4983ee6	2026-11-03 02:29:44.898
df7bf5ec-2a67-4ae7-a282-8c1a6aa0cf27	TEACHER	f9398452-1745-4361-a27f-6b094e89d1f9	2026-11-03 02:29:44.9
89629f59-9439-46af-b812-66a40deff533	TEACHER	b7b95526-d21e-4cc4-ae41-b1c8e27fac55	2026-11-03 02:29:44.903
1a21034a-223b-4d7c-84e6-b6bcd0a6ab69	TEACHER	eefe73e8-4262-4820-941f-3170434a2869	2026-11-03 02:29:44.905
d3348711-15e7-4537-b21c-5005896bcb30	TEACHER	fa2d951a-3da9-42ef-b850-96d9fc8280f4	2026-11-03 02:29:44.907
2be04a37-cb84-4ebc-abd0-6d3622888f52	TEACHER	e9d490b3-865a-4cdf-8c24-f5f0a3860a2d	2026-11-03 02:29:44.91
edacfcba-9a87-453c-94e8-ca6e59a017de	PARENT	6968717b-4651-4abe-9ea1-1195e6941086	2026-11-03 02:29:44.912
9ceee8bb-d23a-479b-afff-99ee75fadd04	PARENT	3f4bcb55-88ae-496c-977f-3e278df6b1f7	2026-11-03 02:29:44.914
dda86fc9-b5b1-4294-a7ca-dedb79cb31ed	PARENT	54061bd7-f552-41f0-bee3-253243574d1b	2026-11-03 02:29:44.916
e3a397d9-daf6-46c5-8fe5-ad469aa2871b	PARENT	556ab81d-fd40-4c93-bd26-baed80627008	2026-11-03 02:29:44.918
6e8be928-ff36-483c-a7f9-1d0aaec476ef	PARENT	3c16d8a4-260b-44c5-9510-2a855faf34d3	2026-11-03 02:29:44.92
f263187a-016d-414f-a198-2f3dd24ff23a	PARENT	351bbafb-6915-448b-8f20-1bb38bc29a82	2026-11-03 02:29:44.922
657c8121-9142-4d34-add0-8a43c547fd20	PARENT	2b6536d5-0c97-45c6-a6d2-01ed817a4ebf	2026-11-03 02:29:44.925
48c6f892-97e6-4eb9-bd9e-dc16698f72d7	PARENT	5cae2573-8b3d-46b2-895e-0546359303ab	2026-11-03 02:29:44.927
0d2ff30d-fb2b-46bb-9edc-b97a1e1ea9a1	PARENT	b7b95526-d21e-4cc4-ae41-b1c8e27fac55	2026-11-03 02:29:44.929
14be5478-4e6c-4ba0-ab45-c1f45ce37bdb	STUDENT	6968717b-4651-4abe-9ea1-1195e6941086	2026-11-03 02:29:44.931
1426345a-1818-4e48-bf1c-1b52c7f728b0	STUDENT	3f4bcb55-88ae-496c-977f-3e278df6b1f7	2026-11-03 02:29:44.933
7ea18556-e344-4c9e-824b-9191fa966abc	STUDENT	54061bd7-f552-41f0-bee3-253243574d1b	2026-11-03 02:29:44.935
40b9f0a6-0932-4ca3-9c16-df7f37bf9cad	STUDENT	556ab81d-fd40-4c93-bd26-baed80627008	2026-11-03 02:29:44.937
8a9ff17a-505c-4c0f-9e51-dab6cee4aafb	STUDENT	3c16d8a4-260b-44c5-9510-2a855faf34d3	2026-11-03 02:29:44.939
f8278880-03e0-42ac-a13d-78af597e3c5c	STUDENT	351bbafb-6915-448b-8f20-1bb38bc29a82	2026-11-03 02:29:44.941
2f60fbf3-2c24-4153-a7ef-b3ea0e6d5bd1	STUDENT	2b6536d5-0c97-45c6-a6d2-01ed817a4ebf	2026-11-03 02:29:44.944
323d6671-6d99-449f-902b-27a188f030a5	STUDENT	5cae2573-8b3d-46b2-895e-0546359303ab	2026-11-03 02:29:44.946
78a5b6e8-b5a3-4f1e-bfee-6140fd3a24e9	STUDENT	b7b95526-d21e-4cc4-ae41-b1c8e27fac55	2026-11-03 02:29:44.948
\.


--
-- Data for Name: sie_discrepancy_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sie_discrepancy_groups (id, synchronization_id, course_id, subject_id, period_id, assigned_to_id, status, due_at, resolved_by_id, resolved_at, resolution_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sie_synchronization_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sie_synchronization_items (id, synchronization_id, student_id, subject_id, period_id, local_value, sie_value, status, error_message, retry_count, verified_at, created_at, updated_at, discrepancy_resolved_by_id, discrepancy_resolved_at, discrepancy_resolution_reason, discrepancy_decision, discrepancy_group_id, processing_token, processing_lease_until) FROM stdin;
\.


--
-- Data for Name: sie_synchronizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sie_synchronizations (id, requested_by_id, status, sync_type, total_items, processed_items, error_count, started_at, completed_at, created_at, updated_at, discrepancy_count, paused_at, paused_reason, idempotency_key) FROM stdin;
\.


--
-- Data for Name: student_document_references; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_document_references (id, student_id, document_type, reference, notes, created_by_id, created_at) FROM stdin;
\.


--
-- Data for Name: student_parents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_parents (id, student_id, parent_id, relationship, is_primary, can_pickup, created_at) FROM stdin;
feb52204-06e7-4309-a0a1-58242bcc116a	25320a19-d024-4fdf-9149-10a2620b89eb	bc61d95c-ee02-4e65-9efc-3f4a3ed44f3a	FATHER	t	t	2026-11-03 03:11:42.262
b26f50c9-ebe7-4b98-b0b5-122a56cff101	2f6a5ab2-a478-4ba4-a343-b76d2516c3a4	bc61d95c-ee02-4e65-9efc-3f4a3ed44f3a	FATHER	t	t	2026-11-03 03:48:39.208
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, user_id, rude, ci, first_name, last_name, birth_date, gender, address, phone, is_active, created_at, updated_at, deleted_at, documents) FROM stdin;
25320a19-d024-4fdf-9149-10a2620b89eb	f18b8eec-37fe-40ad-a270-51e3f748e51e	807300012026001	10234567	Mateo	Fernández	2008-05-14 00:00:00	MALE	Av. Las Américas #123, Santa Cruz	71234567	t	2026-11-03 03:10:03.124	2026-11-03 03:48:39.188	\N	\N
2f6a5ab2-a478-4ba4-a343-b76d2516c3a4	d454c0ed-dc30-427d-90c3-2888f78ac5a4	807300012026002	10234568	Luciana	Fernández	2013-09-22 00:00:00	FEMALE	Av. Las Américas #123, Santa Cruz	71234567	t	2026-11-03 03:48:39.201	2026-11-03 03:48:39.201	\N	\N
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, code, description, area, created_at, updated_at) FROM stdin;
75023422-a30a-491a-890b-55679175b8a3	Desarrollo Integral Infantil	DII	\N	Desarrollo Infantil	2026-11-03 02:29:45.039	2026-11-03 02:29:45.039
434bf818-2262-4374-a75a-71b9ea0e08d1	Matemática (Primaria)	MAT	\N	Ciencia, Tecnología y Producción	2026-11-03 02:29:45.041	2026-11-03 02:29:45.041
e331d570-20b5-4264-bb73-07e560657b8b	Lengua Castellana (Primaria)	LC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.043	2026-11-03 02:29:45.043
b5bb1055-ce79-44c1-bf37-55aa0188f8cf	Lengua Originaria (Primaria)	LO	\N	Comunidad y Sociedad	2026-11-03 02:29:45.045	2026-11-03 02:29:45.045
9b5339d7-922c-4a2d-876c-8c4426d4acc5	Lengua Extranjera (Primaria)	LEX	\N	Comunidad y Sociedad	2026-11-03 02:29:45.047	2026-11-03 02:29:45.047
6694972d-2395-4c56-9052-c68cbd5bfc31	Ciencias Sociales (Primaria)	CSO	\N	Comunidad y Sociedad	2026-11-03 02:29:45.048	2026-11-03 02:29:45.048
8fdf3d02-bf2a-4ed1-885f-4b0c4c66d18b	Ciencias Naturales (Primaria)	CNA	\N	Vida Tierra Territorio	2026-11-03 02:29:45.05	2026-11-03 02:29:45.05
d637ca3d-48df-4723-8860-29347021676b	Artes Plásticas y Visuales (Primaria)	APV	\N	Comunidad y Sociedad	2026-11-03 02:29:45.052	2026-11-03 02:29:45.052
a7ee1889-e051-4693-88e2-f0ae11b1d742	Educación Musical (Primaria)	EMU	\N	Comunidad y Sociedad	2026-11-03 02:29:45.053	2026-11-03 02:29:45.053
698e3847-4aaf-4562-b3b4-45543892ec27	Educación Física y Deportes (Primaria)	EFD	\N	Comunidad y Sociedad	2026-11-03 02:29:45.055	2026-11-03 02:29:45.055
8cbfca70-fb98-4b4c-9f97-5f287b358d0b	Técnica Tecnológica General (Primaria)	TTG	\N	Ciencia, Tecnología y Producción	2026-11-03 02:29:45.057	2026-11-03 02:29:45.057
8de2f364-c88d-4827-b391-d744bf0da8aa	Valores, Espiritualidades y Religiones (Primaria)	VER	\N	Cosmos y Pensamiento	2026-11-03 02:29:45.058	2026-11-03 02:29:45.058
336ac347-48e1-4571-b203-2f2239bf5fef	Ciencias Naturales: Biología – Geografía	BIO-SEC	\N	Vida Tierra Territorio	2026-11-03 02:29:45.06	2026-11-03 02:29:45.06
ad8815eb-99c8-439a-ba90-3eb48b3d9600	Ciencias Naturales: Física	FIS-SEC	\N	Vida Tierra Territorio	2026-11-03 02:29:45.062	2026-11-03 02:29:45.062
e68b0d8e-35fb-446f-b8fd-15db50b9d17e	Ciencias Naturales: Química	QUI-SEC	\N	Vida Tierra Territorio	2026-11-03 02:29:45.064	2026-11-03 02:29:45.064
83f9322f-ae95-4a62-a24b-999c310836da	Matemática	MAT-SEC	\N	Ciencia, Tecnología y Producción	2026-11-03 02:29:45.065	2026-11-03 02:29:45.065
04b5dcf8-ed04-452e-8526-31dbdc756ec7	Técnica Tecnológica General	TTG-SEC	\N	Ciencia, Tecnología y Producción	2026-11-03 02:29:45.067	2026-11-03 02:29:45.067
d3b90c62-05bb-4744-ab63-82d553dfc185	Comunicación y Lenguajes: Lengua Castellana	LEN-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.069	2026-11-03 02:29:45.069
2d2c1b03-ecd9-43f7-a989-83109132e324	Comunicación y Lenguajes: Lengua Originaria	LO-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.071	2026-11-03 02:29:45.071
335ff39b-ab64-4f8a-8b73-588fbcecb7cc	Lengua Extranjera	ING-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.072	2026-11-03 02:29:45.072
ce8319ed-dc26-480a-9378-ea16156dce3f	Ciencias Sociales	HIS-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.074	2026-11-03 02:29:45.074
3fab28aa-da56-4486-85b6-6c7657beaab3	Artes Plásticas y Visuales	APV-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.076	2026-11-03 02:29:45.076
c798bd7c-7219-4ca9-a027-7fbc1adb7a94	Educación Musical	EMU-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.078	2026-11-03 02:29:45.078
4b066027-8964-4159-b34f-9d8dd6fd4869	Educación Física y Deportes	EFD-SEC	\N	Comunidad y Sociedad	2026-11-03 02:29:45.08	2026-11-03 02:29:45.08
b64fde79-353c-4c26-8b39-9f90b71f0f75	Cosmovisiones Filosofía y Sicología	CFS-SEC	\N	Cosmos y Pensamiento	2026-11-03 02:29:45.081	2026-11-03 02:29:45.081
19d996bd-18b0-4ac5-8843-a5080c905c91	Valores Espiritualidad y Religiones	VER-SEC	\N	Cosmos y Pensamiento	2026-11-03 02:29:45.083	2026-11-03 02:29:45.083
\.


--
-- Data for Name: teacher_subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_subjects (id, teacher_id, subject_id, course_id, academic_year_id, created_at, weekly_periods) FROM stdin;
7c28e663-10e2-4bdf-96e9-b0607077d225	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	434bf818-2262-4374-a75a-71b9ea0e08d1	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:09:03.561	5
5a8daa76-a8f1-4fbd-b678-2af86ed4cbc3	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	83f9322f-ae95-4a62-a24b-999c310836da	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:48:38.955	5
2a080096-e276-4048-a54c-9491e606dcf5	ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	ad8815eb-99c8-439a-ba90-3eb48b3d9600	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:48:38.96	4
7993c781-6158-462b-88a1-b3c16b727939	94756c34-bd8f-48e5-a531-b82ecfcc0b1f	d3b90c62-05bb-4744-ab63-82d553dfc185	f445e026-fca3-434e-a7bb-593ca4138100	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:48:38.972	4
51fd65cc-2773-43a7-acea-7d833d258b63	94756c34-bd8f-48e5-a531-b82ecfcc0b1f	d3b90c62-05bb-4744-ab63-82d553dfc185	3b19feef-b3cd-44cd-89af-ad89ed7a2119	f9d20a0b-98fa-4305-bda9-d0e61411bfe1	2026-11-03 03:48:38.977	5
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, user_id, ci, first_name, last_name, specialty, phone, item_number, created_at, updated_at, deleted_at) FROM stdin;
ce4b6f5b-ebf1-4fc2-90f9-11d70676e502	46da26a9-56a6-4f64-8c0c-573f60aaccee	6789012	Carlos	Mendoza	Matemática y Física	70011223	DOC-2026	2026-11-03 03:09:03.551	2026-11-03 03:48:38.951	\N
94756c34-bd8f-48e5-a531-b82ecfcc0b1f	80de1a36-e1b9-4c20-a692-9a55a90bfae0	6789013	Elena	Quispe	Lenguaje y Literatura	70011224	DOC-2027	2026-11-03 03:48:38.967	2026-11-03 03:48:38.967	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at, deleted_at, password_setup_token_hash, password_setup_expires_at, password_setup_required, credential_version) FROM stdin;
11b483b4-2d64-447c-98eb-787fd9767760	admin@sigce.lat	$2b$10$kamKZb3QiCDcnGU/TufoBOiVpXr93hiEqNiG3w1FHRjesId9ZBuwS	Administrador	General	ADMINISTRATIVE	t	2026-11-03 02:29:45.027	2026-11-03 02:29:45.027	\N	\N	\N	f	0
46da26a9-56a6-4f64-8c0c-573f60aaccee	docente@sigce.lat	$2b$10$5xi/J7dtWWpaLxqRWSbcweIimJ9TCWJWnRNHjZHGUf9Ly9Kw5sWxS	Carlos	Mendoza	TEACHER	t	2026-11-03 03:09:03.538	2026-11-03 03:48:38.947	\N	\N	\N	f	0
80de1a36-e1b9-4c20-a692-9a55a90bfae0	elena.quispe@sigce.lat	$2b$10$5xi/J7dtWWpaLxqRWSbcweIimJ9TCWJWnRNHjZHGUf9Ly9Kw5sWxS	Elena	Quispe	TEACHER	t	2026-11-03 03:48:38.963	2026-11-03 03:48:38.963	\N	\N	\N	f	0
9c1704cc-77c6-4c76-b355-50d4734c508f	familia@sigce.lat	$2b$10$GaPW/S3QdOammo3VGgEHb.LmyGHEVlWJo9L7yrxEQyclCDshdGf46	Roberto	Fernández	PARENT	t	2026-11-03 03:11:42.25	2026-11-03 03:48:39.175	\N	\N	\N	f	0
f18b8eec-37fe-40ad-a270-51e3f748e51e	estudiante@sigce.lat	$2b$10$tLOjOVXMyxR2dUOtT.jRBuYc0a9Zb6HpgH2YaJX6c2yki7NBIwura	Mateo	Fernández	STUDENT	t	2026-11-03 03:10:03.121	2026-11-03 03:48:39.185	\N	\N	\N	f	0
d454c0ed-dc30-427d-90c3-2888f78ac5a4	luciana@sigce.lat	$2b$10$tLOjOVXMyxR2dUOtT.jRBuYc0a9Zb6HpgH2YaJX6c2yki7NBIwura	Luciana	Fernández	STUDENT	t	2026-11-03 03:48:39.198	2026-11-03 03:48:39.198	\N	\N	\N	f	0
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_periods academic_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_periods
    ADD CONSTRAINT academic_periods_pkey PRIMARY KEY (id);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: alert_evaluation_outbox alert_evaluation_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_evaluation_outbox
    ADD CONSTRAINT alert_evaluation_outbox_pkey PRIMARY KEY (id);


--
-- Name: alert_rules alert_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_rules
    ADD CONSTRAINT alert_rules_pkey PRIMARY KEY (id);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: assignment_submissions assignment_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: auth_sessions auth_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_pkey PRIMARY KEY (id);


--
-- Name: class_schedules class_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: curriculum_topics curriculum_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum_topics
    ADD CONSTRAINT curriculum_topics_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: grade_correction_requests grade_correction_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_correction_requests
    ADD CONSTRAINT grade_correction_requests_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_pkey PRIMARY KEY (id);


--
-- Name: sie_synchronization_items sie_synchronization_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_pkey PRIMARY KEY (id);


--
-- Name: sie_synchronizations sie_synchronizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronizations
    ADD CONSTRAINT sie_synchronizations_pkey PRIMARY KEY (id);


--
-- Name: student_document_references student_document_references_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_document_references
    ADD CONSTRAINT student_document_references_pkey PRIMARY KEY (id);


--
-- Name: student_parents student_parents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_subjects teacher_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: academic_periods_academic_year_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX academic_periods_academic_year_id_idx ON public.academic_periods USING btree (academic_year_id);


--
-- Name: academic_periods_academic_year_id_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX academic_periods_academic_year_id_number_key ON public.academic_periods USING btree (academic_year_id, number);


--
-- Name: academic_years_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX academic_years_is_active_idx ON public.academic_years USING btree (is_active);


--
-- Name: academic_years_year_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX academic_years_year_idx ON public.academic_years USING btree (year);


--
-- Name: academic_years_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX academic_years_year_key ON public.academic_years USING btree (year);


--
-- Name: alert_evaluation_outbox_available_at_locked_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX alert_evaluation_outbox_available_at_locked_at_idx ON public.alert_evaluation_outbox USING btree (available_at, locked_at);


--
-- Name: alert_rules_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX alert_rules_key_key ON public.alert_rules USING btree (key);


--
-- Name: alerts_is_read_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX alerts_is_read_idx ON public.alerts USING btree (is_read);


--
-- Name: alerts_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX alerts_status_idx ON public.alerts USING btree (status);


--
-- Name: alerts_student_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX alerts_student_id_created_at_idx ON public.alerts USING btree (student_id, created_at);


--
-- Name: alerts_user_id_deduplication_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX alerts_user_id_deduplication_key_key ON public.alerts USING btree (user_id, deduplication_key);


--
-- Name: alerts_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX alerts_user_id_idx ON public.alerts USING btree (user_id);


--
-- Name: announcements_created_by_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX announcements_created_by_id_idx ON public.announcements USING btree (created_by_id);


--
-- Name: announcements_scope_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX announcements_scope_idx ON public.announcements USING btree (scope);


--
-- Name: announcements_target_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX announcements_target_course_id_idx ON public.announcements USING btree (target_course_id);


--
-- Name: announcements_target_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX announcements_target_parent_id_idx ON public.announcements USING btree (target_parent_id);


--
-- Name: announcements_target_teacher_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX announcements_target_teacher_id_idx ON public.announcements USING btree (target_teacher_id);


--
-- Name: announcements_urgency_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX announcements_urgency_idx ON public.announcements USING btree (urgency);


--
-- Name: assignment_submissions_assignment_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assignment_submissions_assignment_id_idx ON public.assignment_submissions USING btree (assignment_id);


--
-- Name: assignment_submissions_assignment_id_student_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX assignment_submissions_assignment_id_student_id_key ON public.assignment_submissions USING btree (assignment_id, student_id);


--
-- Name: assignment_submissions_student_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assignment_submissions_student_id_idx ON public.assignment_submissions USING btree (student_id);


--
-- Name: assignments_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assignments_course_id_idx ON public.assignments USING btree (course_id);


--
-- Name: assignments_due_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assignments_due_date_idx ON public.assignments USING btree (due_date);


--
-- Name: assignments_subject_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assignments_subject_id_idx ON public.assignments USING btree (subject_id);


--
-- Name: assignments_teacher_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assignments_teacher_id_idx ON public.assignments USING btree (teacher_id);


--
-- Name: attendances_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX attendances_course_id_idx ON public.attendances USING btree (course_id);


--
-- Name: attendances_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX attendances_date_idx ON public.attendances USING btree (date);


--
-- Name: attendances_student_id_course_id_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX attendances_student_id_course_id_date_key ON public.attendances USING btree (student_id, course_id, date);


--
-- Name: attendances_student_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX attendances_student_id_idx ON public.attendances USING btree (student_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_correlation_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_correlation_id_idx ON public.audit_logs USING btree (correlation_id);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_entity_entity_id_idx ON public.audit_logs USING btree (entity, entity_id);


--
-- Name: audit_logs_student_ids_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_student_ids_idx ON public.audit_logs USING gin (student_ids);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: auth_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_sessions_user_id_idx ON public.auth_sessions USING btree (user_id);


--
-- Name: class_schedules_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX class_schedules_course_id_idx ON public.class_schedules USING btree (course_id);


--
-- Name: class_schedules_day_of_week_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX class_schedules_day_of_week_idx ON public.class_schedules USING btree (day_of_week);


--
-- Name: class_schedules_teacher_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX class_schedules_teacher_id_idx ON public.class_schedules USING btree (teacher_id);


--
-- Name: class_schedules_teacher_slot_lookup_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX class_schedules_teacher_slot_lookup_idx ON public.class_schedules USING btree (teacher_id, academic_year_id, day_of_week, period_index);


--
-- Name: courses_academic_year_id_grade_level_section_shift_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX courses_academic_year_id_grade_level_section_shift_key ON public.courses USING btree (academic_year_id, grade_level, section, shift);


--
-- Name: courses_academic_year_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courses_academic_year_id_idx ON public.courses USING btree (academic_year_id);


--
-- Name: curriculum_topics_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculum_topics_course_id_idx ON public.curriculum_topics USING btree (course_id);


--
-- Name: curriculum_topics_grade_level_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculum_topics_grade_level_idx ON public.curriculum_topics USING btree (grade_level);


--
-- Name: curriculum_topics_period_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculum_topics_period_number_idx ON public.curriculum_topics USING btree (period_number);


--
-- Name: curriculum_topics_subject_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculum_topics_subject_id_idx ON public.curriculum_topics USING btree (subject_id);


--
-- Name: enrollments_academic_year_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX enrollments_academic_year_id_idx ON public.enrollments USING btree (academic_year_id);


--
-- Name: enrollments_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX enrollments_course_id_idx ON public.enrollments USING btree (course_id);


--
-- Name: enrollments_student_id_academic_year_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX enrollments_student_id_academic_year_id_key ON public.enrollments USING btree (student_id, academic_year_id);


--
-- Name: enrollments_student_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX enrollments_student_id_idx ON public.enrollments USING btree (student_id);


--
-- Name: grade_correction_requests_grade_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grade_correction_requests_grade_id_status_idx ON public.grade_correction_requests USING btree (grade_id, status);


--
-- Name: grade_correction_requests_one_pending_per_grade_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX grade_correction_requests_one_pending_per_grade_idx ON public.grade_correction_requests USING btree (grade_id) WHERE (status = 'PENDING'::public."GradeCorrectionStatus");


--
-- Name: grade_correction_requests_requested_by_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grade_correction_requests_requested_by_id_created_at_idx ON public.grade_correction_requests USING btree (requested_by_id, created_at);


--
-- Name: grade_correction_requests_status_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grade_correction_requests_status_created_at_idx ON public.grade_correction_requests USING btree (status, created_at);


--
-- Name: grades_enrollment_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grades_enrollment_id_idx ON public.grades USING btree (enrollment_id);


--
-- Name: grades_period_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grades_period_id_idx ON public.grades USING btree (period_id);


--
-- Name: grades_published_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grades_published_at_idx ON public.grades USING btree (published_at);


--
-- Name: grades_student_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grades_student_id_idx ON public.grades USING btree (student_id);


--
-- Name: grades_student_id_subject_id_period_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX grades_student_id_subject_id_period_id_key ON public.grades USING btree (student_id, subject_id, period_id);


--
-- Name: grades_subject_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX grades_subject_id_idx ON public.grades USING btree (subject_id);


--
-- Name: parents_ci_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parents_ci_idx ON public.parents USING btree (ci);


--
-- Name: parents_ci_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX parents_ci_key ON public.parents USING btree (ci);


--
-- Name: parents_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parents_user_id_idx ON public.parents USING btree (user_id);


--
-- Name: parents_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX parents_user_id_key ON public.parents USING btree (user_id);


--
-- Name: permissions_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_name_key ON public.permissions USING btree (name);


--
-- Name: refresh_tokens_session_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_session_id_idx ON public.refresh_tokens USING btree (session_id);


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_token_idx ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);


--
-- Name: role_permissions_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX role_permissions_role_idx ON public.role_permissions USING btree (role);


--
-- Name: role_permissions_role_permission_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX role_permissions_role_permission_id_key ON public.role_permissions USING btree (role, permission_id);


--
-- Name: sie_discrepancy_groups_assigned_to_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_discrepancy_groups_assigned_to_id_status_idx ON public.sie_discrepancy_groups USING btree (assigned_to_id, status);


--
-- Name: sie_discrepancy_groups_status_due_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_discrepancy_groups_status_due_at_idx ON public.sie_discrepancy_groups USING btree (status, due_at);


--
-- Name: sie_discrepancy_groups_synchronization_id_course_id_subject_id_; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sie_discrepancy_groups_synchronization_id_course_id_subject_id_ ON public.sie_discrepancy_groups USING btree (synchronization_id, course_id, subject_id, period_id);


--
-- Name: sie_synchronization_items_discrepancy_group_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronization_items_discrepancy_group_id_idx ON public.sie_synchronization_items USING btree (discrepancy_group_id);


--
-- Name: sie_synchronization_items_processing_lease_until_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronization_items_processing_lease_until_idx ON public.sie_synchronization_items USING btree (processing_lease_until);


--
-- Name: sie_synchronization_items_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronization_items_status_idx ON public.sie_synchronization_items USING btree (status);


--
-- Name: sie_synchronization_items_student_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronization_items_student_id_idx ON public.sie_synchronization_items USING btree (student_id);


--
-- Name: sie_synchronization_items_synchronization_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronization_items_synchronization_id_idx ON public.sie_synchronization_items USING btree (synchronization_id);


--
-- Name: sie_synchronizations_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronizations_created_at_idx ON public.sie_synchronizations USING btree (created_at);


--
-- Name: sie_synchronizations_idempotency_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sie_synchronizations_idempotency_key_key ON public.sie_synchronizations USING btree (idempotency_key);


--
-- Name: sie_synchronizations_requested_by_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronizations_requested_by_id_idx ON public.sie_synchronizations USING btree (requested_by_id);


--
-- Name: sie_synchronizations_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sie_synchronizations_status_idx ON public.sie_synchronizations USING btree (status);


--
-- Name: student_document_references_student_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX student_document_references_student_id_created_at_idx ON public.student_document_references USING btree (student_id, created_at);


--
-- Name: student_parents_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX student_parents_parent_id_idx ON public.student_parents USING btree (parent_id);


--
-- Name: student_parents_student_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX student_parents_student_id_idx ON public.student_parents USING btree (student_id);


--
-- Name: student_parents_student_id_parent_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX student_parents_student_id_parent_id_key ON public.student_parents USING btree (student_id, parent_id);


--
-- Name: students_ci_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX students_ci_idx ON public.students USING btree (ci);


--
-- Name: students_ci_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_ci_key ON public.students USING btree (ci);


--
-- Name: students_last_name_first_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX students_last_name_first_name_idx ON public.students USING btree (last_name, first_name);


--
-- Name: students_rude_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX students_rude_idx ON public.students USING btree (rude);


--
-- Name: students_rude_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_rude_key ON public.students USING btree (rude);


--
-- Name: students_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_user_id_key ON public.students USING btree (user_id);


--
-- Name: subjects_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX subjects_code_idx ON public.subjects USING btree (code);


--
-- Name: subjects_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX subjects_code_key ON public.subjects USING btree (code);


--
-- Name: subjects_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX subjects_name_key ON public.subjects USING btree (name);


--
-- Name: teacher_subjects_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX teacher_subjects_course_id_idx ON public.teacher_subjects USING btree (course_id);


--
-- Name: teacher_subjects_subject_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX teacher_subjects_subject_id_idx ON public.teacher_subjects USING btree (subject_id);


--
-- Name: teacher_subjects_teacher_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX teacher_subjects_teacher_id_idx ON public.teacher_subjects USING btree (teacher_id);


--
-- Name: teacher_subjects_teacher_id_subject_id_course_id_academic_y_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teacher_subjects_teacher_id_subject_id_course_id_academic_y_key ON public.teacher_subjects USING btree (teacher_id, subject_id, course_id, academic_year_id);


--
-- Name: teachers_ci_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX teachers_ci_idx ON public.teachers USING btree (ci);


--
-- Name: teachers_ci_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teachers_ci_key ON public.teachers USING btree (ci);


--
-- Name: teachers_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX teachers_user_id_idx ON public.teachers USING btree (user_id);


--
-- Name: teachers_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teachers_user_id_key ON public.teachers USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_is_active_idx ON public.users USING btree (is_active);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: class_schedules class_schedules_teacher_slot_guard; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER class_schedules_teacher_slot_guard BEFORE INSERT OR UPDATE OF teacher_id, academic_year_id, day_of_week, period_index ON public.class_schedules FOR EACH ROW EXECUTE FUNCTION public.prevent_teacher_schedule_slot_conflict();


--
-- Name: academic_periods academic_periods_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_periods
    ADD CONSTRAINT academic_periods_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alert_evaluation_outbox alert_evaluation_outbox_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_evaluation_outbox
    ADD CONSTRAINT alert_evaluation_outbox_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alerts alerts_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alerts alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_target_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_target_course_id_fkey FOREIGN KEY (target_course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: announcements announcements_target_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_target_parent_id_fkey FOREIGN KEY (target_parent_id) REFERENCES public.parents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: announcements announcements_target_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_target_teacher_id_fkey FOREIGN KEY (target_teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assignment_submissions assignment_submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignment_submissions assignment_submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignments assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignments assignments_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignments assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendances attendances_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendances attendances_registered_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_registered_by_id_fkey FOREIGN KEY (registered_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: auth_sessions auth_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_schedules class_schedules_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_schedules class_schedules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_schedules class_schedules_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_schedules class_schedules_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: courses courses_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: curriculum_topics curriculum_topics_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum_topics
    ADD CONSTRAINT curriculum_topics_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: curriculum_topics curriculum_topics_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum_topics
    ADD CONSTRAINT curriculum_topics_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: curriculum_topics curriculum_topics_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum_topics
    ADD CONSTRAINT curriculum_topics_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grade_correction_requests grade_correction_requests_decided_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_correction_requests
    ADD CONSTRAINT grade_correction_requests_decided_by_id_fkey FOREIGN KEY (decided_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: grade_correction_requests grade_correction_requests_grade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_correction_requests
    ADD CONSTRAINT grade_correction_requests_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.grades(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grade_correction_requests grade_correction_requests_requested_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_correction_requests
    ADD CONSTRAINT grade_correction_requests_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grades grades_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.academic_periods(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parents parents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.auth_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_assigned_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_assigned_to_id_fkey FOREIGN KEY (assigned_to_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.academic_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_resolved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_resolved_by_id_fkey FOREIGN KEY (resolved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sie_discrepancy_groups sie_discrepancy_groups_synchronization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_discrepancy_groups
    ADD CONSTRAINT sie_discrepancy_groups_synchronization_id_fkey FOREIGN KEY (synchronization_id) REFERENCES public.sie_synchronizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_discrepancy_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_discrepancy_group_id_fkey FOREIGN KEY (discrepancy_group_id) REFERENCES public.sie_discrepancy_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sie_synchronization_items sie_synchronization_items_discrepancy_resolved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_discrepancy_resolved_by_id_fkey FOREIGN KEY (discrepancy_resolved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sie_synchronization_items sie_synchronization_items_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.academic_periods(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_synchronization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_synchronization_id_fkey FOREIGN KEY (synchronization_id) REFERENCES public.sie_synchronizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronizations sie_synchronizations_requested_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sie_synchronizations
    ADD CONSTRAINT sie_synchronizations_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_document_references student_document_references_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_document_references
    ADD CONSTRAINT student_document_references_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_document_references student_document_references_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_document_references
    ADD CONSTRAINT student_document_references_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_parents student_parents_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_parents student_parents_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_subjects teacher_subjects_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict zVij645Nnh9Y4HpVZ5wcBLx4BoENDCaPVqX4MK52kww6SGIwjuaMbVp7d1En2cQ


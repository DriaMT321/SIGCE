--
-- PostgreSQL database dump
--

\restrict 6LvHNEPe0XKQxkwPx9NOMOFXLOZrGx9DjJidi74KkvFqjaWDsTQfcmFOF3qeK8R

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
ALTER TABLE IF EXISTS ONLY public.sie_synchronizations DROP CONSTRAINT IF EXISTS sie_synchronizations_requested_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_synchronization_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_period_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.parents DROP CONSTRAINT IF EXISTS parents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_subject_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_period_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_enrollment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_registered_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.alerts DROP CONSTRAINT IF EXISTS alerts_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.academic_periods DROP CONSTRAINT IF EXISTS academic_periods_academic_year_id_fkey;
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
DROP INDEX IF EXISTS public.sie_synchronizations_status_idx;
DROP INDEX IF EXISTS public.sie_synchronizations_requested_by_id_idx;
DROP INDEX IF EXISTS public.sie_synchronizations_created_at_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_synchronization_id_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_student_id_idx;
DROP INDEX IF EXISTS public.sie_synchronization_items_status_idx;
DROP INDEX IF EXISTS public.role_permissions_role_permission_id_key;
DROP INDEX IF EXISTS public.role_permissions_role_idx;
DROP INDEX IF EXISTS public.refresh_tokens_user_id_idx;
DROP INDEX IF EXISTS public.refresh_tokens_token_key;
DROP INDEX IF EXISTS public.refresh_tokens_token_idx;
DROP INDEX IF EXISTS public.permissions_name_key;
DROP INDEX IF EXISTS public.parents_user_id_key;
DROP INDEX IF EXISTS public.parents_user_id_idx;
DROP INDEX IF EXISTS public.parents_ci_key;
DROP INDEX IF EXISTS public.parents_ci_idx;
DROP INDEX IF EXISTS public.grades_subject_id_idx;
DROP INDEX IF EXISTS public.grades_student_id_subject_id_period_id_key;
DROP INDEX IF EXISTS public.grades_student_id_idx;
DROP INDEX IF EXISTS public.grades_period_id_idx;
DROP INDEX IF EXISTS public.grades_enrollment_id_idx;
DROP INDEX IF EXISTS public.enrollments_student_id_idx;
DROP INDEX IF EXISTS public.enrollments_student_id_academic_year_id_key;
DROP INDEX IF EXISTS public.enrollments_course_id_idx;
DROP INDEX IF EXISTS public.enrollments_academic_year_id_idx;
DROP INDEX IF EXISTS public.courses_academic_year_id_idx;
DROP INDEX IF EXISTS public.courses_academic_year_id_grade_level_section_shift_key;
DROP INDEX IF EXISTS public.audit_logs_user_id_idx;
DROP INDEX IF EXISTS public.audit_logs_entity_entity_id_idx;
DROP INDEX IF EXISTS public.audit_logs_created_at_idx;
DROP INDEX IF EXISTS public.audit_logs_action_idx;
DROP INDEX IF EXISTS public.attendances_student_id_idx;
DROP INDEX IF EXISTS public.attendances_student_id_course_id_date_key;
DROP INDEX IF EXISTS public.attendances_date_idx;
DROP INDEX IF EXISTS public.attendances_course_id_idx;
DROP INDEX IF EXISTS public.alerts_user_id_idx;
DROP INDEX IF EXISTS public.alerts_is_read_idx;
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
ALTER TABLE IF EXISTS ONLY public.sie_synchronizations DROP CONSTRAINT IF EXISTS sie_synchronizations_pkey;
ALTER TABLE IF EXISTS ONLY public.sie_synchronization_items DROP CONSTRAINT IF EXISTS sie_synchronization_items_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.parents DROP CONSTRAINT IF EXISTS parents_pkey;
ALTER TABLE IF EXISTS ONLY public.grades DROP CONSTRAINT IF EXISTS grades_pkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_pkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.attendances DROP CONSTRAINT IF EXISTS attendances_pkey;
ALTER TABLE IF EXISTS ONLY public.alerts DROP CONSTRAINT IF EXISTS alerts_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_years DROP CONSTRAINT IF EXISTS academic_years_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_periods DROP CONSTRAINT IF EXISTS academic_periods_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.teachers;
DROP TABLE IF EXISTS public.teacher_subjects;
DROP TABLE IF EXISTS public.subjects;
DROP TABLE IF EXISTS public.students;
DROP TABLE IF EXISTS public.student_parents;
DROP TABLE IF EXISTS public.sie_synchronizations;
DROP TABLE IF EXISTS public.sie_synchronization_items;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.parents;
DROP TABLE IF EXISTS public.grades;
DROP TABLE IF EXISTS public.enrollments;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.attendances;
DROP TABLE IF EXISTS public.alerts;
DROP TABLE IF EXISTS public.academic_years;
DROP TABLE IF EXISTS public.academic_periods;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."SieSyncStatus";
DROP TYPE IF EXISTS public."Shift";
DROP TYPE IF EXISTS public."RelationshipType";
DROP TYPE IF EXISTS public."Gender";
DROP TYPE IF EXISTS public."EnrollmentStatus";
DROP TYPE IF EXISTS public."AuditAction";
DROP TYPE IF EXISTS public."AttendanceStatus";
DROP TYPE IF EXISTS public."AlertSeverity";
--
-- Name: AlertSeverity; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."AlertSeverity" AS ENUM (
    'INFO',
    'WARNING',
    'DANGER',
    'SUCCESS'
);


ALTER TYPE public."AlertSeverity" OWNER TO academic_admin;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'JUSTIFIED'
);


ALTER TYPE public."AttendanceStatus" OWNER TO academic_admin;

--
-- Name: AuditAction; Type: TYPE; Schema: public; Owner: academic_admin
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


ALTER TYPE public."AuditAction" OWNER TO academic_admin;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'TRANSFERRED',
    'GRADUATED',
    'WITHDRAWN'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO academic_admin;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."Gender" OWNER TO academic_admin;

--
-- Name: RelationshipType; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."RelationshipType" AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'TUTOR',
    'OTHER'
);


ALTER TYPE public."RelationshipType" OWNER TO academic_admin;

--
-- Name: Shift; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."Shift" AS ENUM (
    'MORNING',
    'AFTERNOON',
    'EVENING'
);


ALTER TYPE public."Shift" OWNER TO academic_admin;

--
-- Name: SieSyncStatus; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."SieSyncStatus" AS ENUM (
    'PENDING',
    'QUEUED',
    'PROCESSING',
    'VERIFIED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."SieSyncStatus" OWNER TO academic_admin;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: academic_admin
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'DIRECTOR',
    'SECRETARY',
    'TEACHER',
    'PARENT'
);


ALTER TYPE public."UserRole" OWNER TO academic_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public._prisma_migrations OWNER TO academic_admin;

--
-- Name: academic_periods; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.academic_periods OWNER TO academic_admin;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.academic_years OWNER TO academic_admin;

--
-- Name: alerts; Type: TABLE; Schema: public; Owner: academic_admin
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
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.alerts OWNER TO academic_admin;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.attendances OWNER TO academic_admin;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: academic_admin
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
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO academic_admin;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: academic_admin
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
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO academic_admin;

--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.enrollments OWNER TO academic_admin;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: academic_admin
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
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.grades OWNER TO academic_admin;

--
-- Name: parents; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.parents OWNER TO academic_admin;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: academic_admin
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    module text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permissions OWNER TO academic_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: academic_admin
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    revoked_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO academic_admin;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: academic_admin
--

CREATE TABLE public.role_permissions (
    id text NOT NULL,
    role public."UserRole" NOT NULL,
    permission_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO academic_admin;

--
-- Name: sie_synchronization_items; Type: TABLE; Schema: public; Owner: academic_admin
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
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sie_synchronization_items OWNER TO academic_admin;

--
-- Name: sie_synchronizations; Type: TABLE; Schema: public; Owner: academic_admin
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
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sie_synchronizations OWNER TO academic_admin;

--
-- Name: student_parents; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.student_parents OWNER TO academic_admin;

--
-- Name: students; Type: TABLE; Schema: public; Owner: academic_admin
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
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.students OWNER TO academic_admin;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.subjects OWNER TO academic_admin;

--
-- Name: teacher_subjects; Type: TABLE; Schema: public; Owner: academic_admin
--

CREATE TABLE public.teacher_subjects (
    id text NOT NULL,
    teacher_id text NOT NULL,
    subject_id text NOT NULL,
    course_id text NOT NULL,
    academic_year_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.teacher_subjects OWNER TO academic_admin;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: academic_admin
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


ALTER TABLE public.teachers OWNER TO academic_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: academic_admin
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
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO academic_admin;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
96f4622a-a122-490c-affd-2bf46130b6ce	ba284091e6e5da536d81f588201de9510e0b776aeb58e595dd851c597dab4aa2	2026-09-13 13:00:53.989465-04	20260812162004_initial_schema	\N	\N	2026-09-13 13:00:53.821381-04	1
\.


--
-- Data for Name: academic_periods; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.academic_periods (id, academic_year_id, name, number, start_date, end_date, is_closed, created_at, updated_at) FROM stdin;
92d3a5fa-d9d6-41e5-96a6-9b1792e0a5cf	4460ad11-06f9-4708-ae5d-27c7f640aa85	1er Trimestre	1	2026-02-01 00:00:00	2026-05-15 23:59:59	f	2026-09-13 17:00:55.642	2026-09-13 17:00:55.642
0f666d88-09f0-4519-8c22-b683f4af7381	4460ad11-06f9-4708-ae5d-27c7f640aa85	2do Trimestre	2	2026-05-16 00:00:00	2026-08-31 23:59:59	f	2026-09-13 17:00:55.645	2026-09-13 17:00:55.645
6b80bb31-d430-439e-bb7d-00c6e044ef0e	4460ad11-06f9-4708-ae5d-27c7f640aa85	3er Trimestre	3	2026-09-01 00:00:00	2026-11-30 23:59:59	f	2026-09-13 17:00:55.646	2026-09-13 17:00:55.646
\.


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.academic_years (id, year, name, start_date, end_date, is_active, is_closed, created_at, updated_at) FROM stdin;
4460ad11-06f9-4708-ae5d-27c7f640aa85	2026	Gestión Académica 2026	2026-02-01 00:00:00	2026-11-30 23:59:59	t	f	2026-09-13 17:00:55.639	2026-09-13 17:00:55.639
\.


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.alerts (id, user_id, title, message, severity, is_read, link, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.attendances (id, student_id, course_id, registered_by_id, date, status, justification, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.audit_logs (id, user_id, action, entity, entity_id, previous_value, new_value, ip_address, user_agent, created_at) FROM stdin;
5efddcd7-2bae-436a-b9a4-3dca4906b38b	3360123b-4d74-454d-ba3e-03f073d0c142	CREATE	SystemBootstrap	3360123b-4d74-454d-ba3e-03f073d0c142	\N	{"event": "DATABASE_INITIALIZED_AND_SEEDED", "timestamp": "2026-09-13T17:00:55.659Z"}	127.0.0.1	PrismaSeed/1.0	2026-09-13 17:00:55.66
38a41061-0434-413b-b551-b687b971fbe7	3360123b-4d74-454d-ba3e-03f073d0c142	LOGIN	User	3360123b-4d74-454d-ba3e-03f073d0c142	null	{"role": "ADMIN", "email": "admin@example.local"}	::1	curl/8.21.0	2026-09-13 17:02:47.078
01068c01-f11f-4990-9aff-01f7cc51b911	3360123b-4d74-454d-ba3e-03f073d0c142	LOGIN	User	3360123b-4d74-454d-ba3e-03f073d0c142	null	{"role": "ADMIN", "email": "admin@example.local", "loginRole": "ADMINISTRATIVE"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-13 17:03:46.168
9cea3192-2687-4c15-b5fc-b42cb3a5d911	3360123b-4d74-454d-ba3e-03f073d0c142	LOGIN	User	3360123b-4d74-454d-ba3e-03f073d0c142	null	{"role": "ADMIN", "email": "admin@example.local"}	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.26100.9444	2026-09-13 20:10:31.547
0d35cd91-5b4d-43e2-ac7b-e420eab54fb9	3360123b-4d74-454d-ba3e-03f073d0c142	LOGIN	User	3360123b-4d74-454d-ba3e-03f073d0c142	null	{"role": "ADMIN", "email": "admin@example.local", "loginRole": "ADMINISTRATIVE"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-09-13 20:16:00.738
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.enrollments (id, student_id, course_id, academic_year_id, enrollment_date, status, remarks, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.grades (id, enrollment_id, student_id, subject_id, period_id, value, remarks, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: parents; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.parents (id, user_id, ci, first_name, last_name, phone, email, address, occupation, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.permissions (id, name, description, module, created_at) FROM stdin;
c196fc38-50e2-4ff1-a4de-c405f61f89c5	users:read	Ver usuarios	users	2026-09-13 17:00:55.406
f267e6d0-5d66-400d-8592-a966a5ec4501	users:create	Crear usuarios	users	2026-09-13 17:00:55.41
886ace46-0f1a-48c6-9456-6230fd3fa8e2	users:update	Editar usuarios	users	2026-09-13 17:00:55.411
8c12aa07-6b64-4c19-bee3-1f314098e8e4	users:delete	Eliminar usuarios	users	2026-09-13 17:00:55.411
9c9588c8-0882-4312-a645-5c15a3ee6c14	academic-years:read	Ver gestiones académicas	academic-years	2026-09-13 17:00:55.412
676f5608-a29f-499a-90fb-9ccf74236573	periods:read	Ver periodos académicos	periods	2026-09-13 17:00:55.413
cc182f79-7a77-4d2a-81b8-9793e324fe4d	subjects:read	Ver materias	subjects	2026-09-13 17:00:55.415
418246f6-fa33-4658-b5fe-955db71c6a46	courses:read	Ver cursos	courses	2026-09-13 17:00:55.416
5a3f15cb-fb67-4cbd-8ef6-e2d67c510e62	courses:create	Crear cursos	courses	2026-09-13 17:00:55.418
ab6406ec-1d6a-498a-b781-f07b8b00f5e4	courses:update	Editar cursos	courses	2026-09-13 17:00:55.418
00d33787-fca4-4436-b7d5-bfd81d3e85b2	courses:delete	Eliminar cursos	courses	2026-09-13 17:00:55.419
c8a3a82b-3ebd-42d9-b53f-f1efeccb1eaa	enrollments:read	Ver matrículas	enrollments	2026-09-13 17:00:55.42
ed6a5606-9796-44db-8d01-b4d99a3a437b	enrollments:create	Crear matrículas	enrollments	2026-09-13 17:00:55.42
43050a12-936a-4e4c-a61f-7296ed2e7a70	enrollments:update	Editar matrículas	enrollments	2026-09-13 17:00:55.421
b4152a5d-0378-440c-ba09-a4dc3beb321e	alerts:read	Ver alertas	alerts	2026-09-13 17:00:55.421
27de61b3-2929-4fab-8466-c245d17f346b	alerts:update	Marcar alertas como leídas	alerts	2026-09-13 17:00:55.422
fba22151-8f2f-4081-b063-090a39b5c653	parents:read	Ver familiares	parents	2026-09-13 17:00:55.422
3cf8e1ec-a6f9-41a3-b87d-3f59c540e832	parents:create	Registrar familiares	parents	2026-09-13 17:00:55.423
9e298714-9cd9-45b0-b5d5-bbe71ed8862b	parents:update	Actualizar familiares	parents	2026-09-13 17:00:55.423
257e6701-fc5d-4a24-a78c-1d92c45890b4	teachers:read	Ver docentes	teachers	2026-09-13 17:00:55.424
f0369aca-bee3-41e5-b7e8-0f7afdeb30fc	teachers:create	Registrar docentes	teachers	2026-09-13 17:00:55.424
6d403969-1bd9-4d09-8ff3-d0b849659df2	teachers:update	Actualizar docentes	teachers	2026-09-13 17:00:55.424
883c621a-da09-4eb3-b938-84c0ce185934	students:read	Ver estudiantes	students	2026-09-13 17:00:55.425
88bd02c2-5800-4afb-838f-39fae8d2b8fc	students:create	Registrar estudiantes	students	2026-09-13 17:00:55.425
39276412-26f6-47b6-9076-c8adc7fd0249	students:update	Actualizar estudiantes	students	2026-09-13 17:00:55.426
efb377f7-4543-4b30-acc5-c486bdacdbe7	students:delete	Eliminar estudiantes	students	2026-09-13 17:00:55.426
a1df8d47-456b-4b10-965a-f5aec3b9f86a	grades:read	Ver calificaciones	grades	2026-09-13 17:00:55.426
542a7fc4-299d-4228-9e78-86909519968a	grades:create	Registrar calificaciones	grades	2026-09-13 17:00:55.427
978a9657-3169-4e45-97f7-d6e35197c5b8	grades:update	Modificar calificaciones	grades	2026-09-13 17:00:55.427
84f43f99-4b0b-4f7d-a17a-d2cbd1484f38	attendance:read	Ver asistencia	attendance	2026-09-13 17:00:55.428
443640e2-a272-4b68-b2cc-e389a5f6e3b6	attendance:create	Registrar asistencia	attendance	2026-09-13 17:00:55.428
0a3047f7-b84a-47eb-b889-6a06ca4e9bc1	attendance:update	Modificar asistencia	attendance	2026-09-13 17:00:55.428
483a32a4-d199-4c5e-9e0f-8d896bbbf0ce	audit:read	Ver bitácora de auditoría	audit	2026-09-13 17:00:55.429
6d13ceac-263c-4780-9405-de0cd6ccf9df	sie:read	Ver estado de sincronizaciones SIE	sie-sync	2026-09-13 17:00:55.429
915cc8ad-d32e-416f-8881-d41d53d6743a	sie:execute	Ejecutar sincronización con el SIE	sie-sync	2026-09-13 17:00:55.43
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.refresh_tokens (id, user_id, token, expires_at, revoked_at, created_at) FROM stdin;
64abdb32-18d3-4d59-9447-13f846017c1f	3360123b-4d74-454d-ba3e-03f073d0c142	f9dee1de73a68391e6340b7c84994ad2f8c7389fc8b7bb8a7bebb856b5651553	2026-09-20 17:02:47.073	\N	2026-09-13 17:02:47.074
0cf72543-d015-4a48-9e87-4ac16e12cffc	3360123b-4d74-454d-ba3e-03f073d0c142	44b370a39c9018e3be6d3c70c415dfed51af4de52d48267495edbd463f547540	2026-09-20 17:03:46.166	\N	2026-09-13 17:03:46.167
6976d20f-1282-463a-89a0-32ecd89c0022	3360123b-4d74-454d-ba3e-03f073d0c142	62af34d66c9268fe074df4ba541ec48211f35040dfb7cbb80881f63b32bcee02	2026-09-20 20:10:31.533	\N	2026-09-13 20:10:31.535
1675b73f-c849-492a-a43b-efa87543bbae	3360123b-4d74-454d-ba3e-03f073d0c142	930573247f42a5375e6219926f602fdb0d85b28408b899ca68e888f3a1665963	2026-09-20 20:16:00.733	\N	2026-09-13 20:16:00.735
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.role_permissions (id, role, permission_id, created_at) FROM stdin;
dd1c8821-a192-43a3-9732-4a30cc0b9fec	ADMIN	c196fc38-50e2-4ff1-a4de-c405f61f89c5	2026-09-13 17:00:55.431
20a53579-b6ff-47ef-827a-c6e8b6c859cc	ADMIN	f267e6d0-5d66-400d-8592-a966a5ec4501	2026-09-13 17:00:55.435
dff39ac6-9f2a-4af0-a6df-978a8668c980	ADMIN	886ace46-0f1a-48c6-9456-6230fd3fa8e2	2026-09-13 17:00:55.437
299366b2-c577-4375-870a-630f1e08a686	ADMIN	8c12aa07-6b64-4c19-bee3-1f314098e8e4	2026-09-13 17:00:55.441
4690742e-a07a-467d-acea-4326691fbe7b	ADMIN	9c9588c8-0882-4312-a645-5c15a3ee6c14	2026-09-13 17:00:55.442
d3010c2d-7fb9-4fd4-a4f6-0a9cc9d0adfc	ADMIN	676f5608-a29f-499a-90fb-9ccf74236573	2026-09-13 17:00:55.443
8493cef9-ef8b-400b-858d-d06737b3498b	ADMIN	cc182f79-7a77-4d2a-81b8-9793e324fe4d	2026-09-13 17:00:55.445
800265a9-bf8a-486e-b61d-8ddca1ee75e0	ADMIN	418246f6-fa33-4658-b5fe-955db71c6a46	2026-09-13 17:00:55.447
f13a6ff9-3682-440c-9eca-062dd4659a21	ADMIN	5a3f15cb-fb67-4cbd-8ef6-e2d67c510e62	2026-09-13 17:00:55.448
52982175-b907-4f48-a174-48f672d2df93	ADMIN	ab6406ec-1d6a-498a-b781-f07b8b00f5e4	2026-09-13 17:00:55.449
7fe79c1f-3275-4822-82ac-9e981c884b51	ADMIN	00d33787-fca4-4436-b7d5-bfd81d3e85b2	2026-09-13 17:00:55.45
bb0e9d72-0139-40bb-8731-948bcf76eb87	ADMIN	c8a3a82b-3ebd-42d9-b53f-f1efeccb1eaa	2026-09-13 17:00:55.451
5cf92a1e-cb71-4761-8da8-490ede7c70ba	ADMIN	ed6a5606-9796-44db-8d01-b4d99a3a437b	2026-09-13 17:00:55.452
bf6c79d4-cb97-43d9-a65c-18a0e42bb70b	ADMIN	43050a12-936a-4e4c-a61f-7296ed2e7a70	2026-09-13 17:00:55.452
a40d0c0a-411f-41c4-a3fc-8466f14c979f	ADMIN	b4152a5d-0378-440c-ba09-a4dc3beb321e	2026-09-13 17:00:55.453
9f9526b4-0b03-479e-9f82-2db953efd367	ADMIN	27de61b3-2929-4fab-8466-c245d17f346b	2026-09-13 17:00:55.454
4ec4bf55-f581-4f0c-bc31-44c2548364b2	ADMIN	fba22151-8f2f-4081-b063-090a39b5c653	2026-09-13 17:00:55.455
a6059b8f-17ec-42e7-aa67-1336fcad14c1	ADMIN	3cf8e1ec-a6f9-41a3-b87d-3f59c540e832	2026-09-13 17:00:55.456
f70585ee-4ed4-4bf1-b657-e158e3f0601c	ADMIN	9e298714-9cd9-45b0-b5d5-bbe71ed8862b	2026-09-13 17:00:55.456
a928f3d9-3d87-45bc-b72a-57f7aec70536	ADMIN	257e6701-fc5d-4a24-a78c-1d92c45890b4	2026-09-13 17:00:55.457
d15334f4-c839-461e-8c45-34cdc145eb3d	ADMIN	f0369aca-bee3-41e5-b7e8-0f7afdeb30fc	2026-09-13 17:00:55.458
583f843a-d2e8-4ed1-b679-a65bc3faaa17	ADMIN	6d403969-1bd9-4d09-8ff3-d0b849659df2	2026-09-13 17:00:55.459
1f774328-c9bf-4f9e-8f8d-c96dcfc6ea26	ADMIN	883c621a-da09-4eb3-b938-84c0ce185934	2026-09-13 17:00:55.46
4ffbc485-5f46-469a-8994-52fe42399898	ADMIN	88bd02c2-5800-4afb-838f-39fae8d2b8fc	2026-09-13 17:00:55.464
71657805-d207-41bc-b2e9-cea31925f110	ADMIN	39276412-26f6-47b6-9076-c8adc7fd0249	2026-09-13 17:00:55.466
d4fa568d-6338-4157-afa8-e1378b950930	ADMIN	efb377f7-4543-4b30-acc5-c486bdacdbe7	2026-09-13 17:00:55.467
daf6d304-e63f-4fc9-9765-d1439a636724	ADMIN	a1df8d47-456b-4b10-965a-f5aec3b9f86a	2026-09-13 17:00:55.469
d5c42e17-18c5-44b6-94a2-659a31ab8ea0	ADMIN	542a7fc4-299d-4228-9e78-86909519968a	2026-09-13 17:00:55.471
9ab6321e-fded-40c8-836b-7e25516f4a07	ADMIN	978a9657-3169-4e45-97f7-d6e35197c5b8	2026-09-13 17:00:55.472
b12e85d2-369a-475a-9ef5-99336b8e7fdc	ADMIN	84f43f99-4b0b-4f7d-a17a-d2cbd1484f38	2026-09-13 17:00:55.473
9d8e769d-0ac3-4a49-98af-0c61f5ca486e	ADMIN	443640e2-a272-4b68-b2cc-e389a5f6e3b6	2026-09-13 17:00:55.474
af673020-5de8-434b-b111-16ec63d90a8d	ADMIN	0a3047f7-b84a-47eb-b889-6a06ca4e9bc1	2026-09-13 17:00:55.475
05dd6fce-8983-41ca-b23f-6040a65fbc69	ADMIN	483a32a4-d199-4c5e-9e0f-8d896bbbf0ce	2026-09-13 17:00:55.476
ce5ce24b-d786-40ac-bf01-730b9df85a9f	ADMIN	6d13ceac-263c-4780-9405-de0cd6ccf9df	2026-09-13 17:00:55.477
80dee6a0-4a9f-4493-97f6-7374932569ca	ADMIN	915cc8ad-d32e-416f-8881-d41d53d6743a	2026-09-13 17:00:55.478
4ad3da2e-af0d-4f24-b179-15916e03dc66	DIRECTOR	c196fc38-50e2-4ff1-a4de-c405f61f89c5	2026-09-13 17:00:55.479
c9fb05d7-481e-4ca5-81cb-03c2166777c1	DIRECTOR	9c9588c8-0882-4312-a645-5c15a3ee6c14	2026-09-13 17:00:55.48
82b1793e-a91c-49ef-88a5-ff05907d58dd	DIRECTOR	676f5608-a29f-499a-90fb-9ccf74236573	2026-09-13 17:00:55.481
ed79541f-b06c-425f-8967-31e0bba079a4	DIRECTOR	cc182f79-7a77-4d2a-81b8-9793e324fe4d	2026-09-13 17:00:55.482
d635f9c8-3302-4d27-a78e-c8ca33d57b8d	DIRECTOR	418246f6-fa33-4658-b5fe-955db71c6a46	2026-09-13 17:00:55.483
18901ba2-cdba-4ebf-a19a-46d36e173801	DIRECTOR	5a3f15cb-fb67-4cbd-8ef6-e2d67c510e62	2026-09-13 17:00:55.484
9adec74a-1cd6-41ff-ac82-ac029562cab2	DIRECTOR	ab6406ec-1d6a-498a-b781-f07b8b00f5e4	2026-09-13 17:00:55.487
a0e689c9-9dda-42d4-a724-b5bc42b80dd5	DIRECTOR	00d33787-fca4-4436-b7d5-bfd81d3e85b2	2026-09-13 17:00:55.489
6c758ef2-63a9-400a-95eb-43d34e7d2fdf	DIRECTOR	c8a3a82b-3ebd-42d9-b53f-f1efeccb1eaa	2026-09-13 17:00:55.49
b7e24047-2589-4f59-90f6-65647a8d6aa5	DIRECTOR	ed6a5606-9796-44db-8d01-b4d99a3a437b	2026-09-13 17:00:55.492
a5a4a799-e584-4ebf-960d-f1f2fe5f724e	DIRECTOR	43050a12-936a-4e4c-a61f-7296ed2e7a70	2026-09-13 17:00:55.493
b536e572-6029-4ad7-bcce-52223410c08f	DIRECTOR	b4152a5d-0378-440c-ba09-a4dc3beb321e	2026-09-13 17:00:55.494
e88c7134-2e63-4406-9828-f2e4eea45241	DIRECTOR	27de61b3-2929-4fab-8466-c245d17f346b	2026-09-13 17:00:55.495
7bc2d90c-23a8-4b48-948c-6bda80d63737	DIRECTOR	fba22151-8f2f-4081-b063-090a39b5c653	2026-09-13 17:00:55.495
6cae2bb0-5e9a-4de4-bdab-a7f380ef4a69	DIRECTOR	3cf8e1ec-a6f9-41a3-b87d-3f59c540e832	2026-09-13 17:00:55.496
5be2f958-b2ca-4e0b-9ccf-bcf7c7c8a835	DIRECTOR	9e298714-9cd9-45b0-b5d5-bbe71ed8862b	2026-09-13 17:00:55.497
e16c3b05-43f8-4b7e-94b7-51d2b309a881	DIRECTOR	257e6701-fc5d-4a24-a78c-1d92c45890b4	2026-09-13 17:00:55.498
ba15b542-f3d9-4ca5-bc74-640908c31862	DIRECTOR	f0369aca-bee3-41e5-b7e8-0f7afdeb30fc	2026-09-13 17:00:55.499
73b47c59-7138-4a1e-9fb1-e291713fa9e2	DIRECTOR	6d403969-1bd9-4d09-8ff3-d0b849659df2	2026-09-13 17:00:55.499
f9851092-e4bb-4b45-ba48-0eac6210659f	DIRECTOR	883c621a-da09-4eb3-b938-84c0ce185934	2026-09-13 17:00:55.5
1b3c5e97-91f1-45fb-8bc7-86d8593a02dc	DIRECTOR	39276412-26f6-47b6-9076-c8adc7fd0249	2026-09-13 17:00:55.501
85340508-e4ad-4c36-8178-ec33e91c13e1	DIRECTOR	a1df8d47-456b-4b10-965a-f5aec3b9f86a	2026-09-13 17:00:55.502
c2656e66-45cf-4003-88a4-18bc005d6d29	DIRECTOR	84f43f99-4b0b-4f7d-a17a-d2cbd1484f38	2026-09-13 17:00:55.502
3e952a28-b148-4cd9-a346-32bca7fd0903	DIRECTOR	483a32a4-d199-4c5e-9e0f-8d896bbbf0ce	2026-09-13 17:00:55.503
2fe5a4b9-d800-460c-81eb-77a9f7c9f46f	DIRECTOR	6d13ceac-263c-4780-9405-de0cd6ccf9df	2026-09-13 17:00:55.504
98e3eae6-2bef-48ac-afac-9a5fb4325577	DIRECTOR	915cc8ad-d32e-416f-8881-d41d53d6743a	2026-09-13 17:00:55.505
df12b030-4d12-473a-bc08-986f7fd0e963	SECRETARY	c196fc38-50e2-4ff1-a4de-c405f61f89c5	2026-09-13 17:00:55.506
1ebf9e64-8624-44e6-91a9-edae726eac13	SECRETARY	9c9588c8-0882-4312-a645-5c15a3ee6c14	2026-09-13 17:00:55.506
cbb935f8-9341-4a13-9706-c7f34e5f927a	SECRETARY	676f5608-a29f-499a-90fb-9ccf74236573	2026-09-13 17:00:55.508
40a328f0-e202-4941-b80a-b11c332fa36e	SECRETARY	cc182f79-7a77-4d2a-81b8-9793e324fe4d	2026-09-13 17:00:55.51
00faeff8-4f65-4ed9-9d5d-3ed9bf707ae9	SECRETARY	418246f6-fa33-4658-b5fe-955db71c6a46	2026-09-13 17:00:55.512
442caf2c-ab45-4df5-a852-151740a34219	SECRETARY	5a3f15cb-fb67-4cbd-8ef6-e2d67c510e62	2026-09-13 17:00:55.514
1517dba1-863a-46b8-b84a-865f4165c3c0	SECRETARY	ab6406ec-1d6a-498a-b781-f07b8b00f5e4	2026-09-13 17:00:55.515
a5895a46-28de-4d93-963c-2e07c486a569	SECRETARY	c8a3a82b-3ebd-42d9-b53f-f1efeccb1eaa	2026-09-13 17:00:55.516
49384060-e67b-470d-862e-a1fe0fe8f84b	SECRETARY	ed6a5606-9796-44db-8d01-b4d99a3a437b	2026-09-13 17:00:55.517
52cb96d0-14ce-45fe-97be-41be373a0284	SECRETARY	43050a12-936a-4e4c-a61f-7296ed2e7a70	2026-09-13 17:00:55.518
2d780a1a-fbec-401c-acc7-dfb0cb58febe	SECRETARY	b4152a5d-0378-440c-ba09-a4dc3beb321e	2026-09-13 17:00:55.518
1ebd96d8-49ff-4ae5-8919-33f109bca4ae	SECRETARY	27de61b3-2929-4fab-8466-c245d17f346b	2026-09-13 17:00:55.519
910ab176-df1c-42d0-93b1-7d42ac91d74d	SECRETARY	fba22151-8f2f-4081-b063-090a39b5c653	2026-09-13 17:00:55.52
96c04a18-8758-4dfd-8456-8488c8bd5c5e	SECRETARY	3cf8e1ec-a6f9-41a3-b87d-3f59c540e832	2026-09-13 17:00:55.521
2ab55dee-bcfd-4c74-a02d-db6c90176722	SECRETARY	9e298714-9cd9-45b0-b5d5-bbe71ed8862b	2026-09-13 17:00:55.522
f8bb270d-5ccd-4d8f-a62f-8481545d59e7	SECRETARY	257e6701-fc5d-4a24-a78c-1d92c45890b4	2026-09-13 17:00:55.522
cc401247-4c22-4214-a6bf-725aa38639c3	SECRETARY	f0369aca-bee3-41e5-b7e8-0f7afdeb30fc	2026-09-13 17:00:55.523
b6ec68b1-3844-4409-a906-6e3b97670cb8	SECRETARY	6d403969-1bd9-4d09-8ff3-d0b849659df2	2026-09-13 17:00:55.524
047af270-0063-4142-90d7-01a43cd06b9c	SECRETARY	883c621a-da09-4eb3-b938-84c0ce185934	2026-09-13 17:00:55.525
5423c3fb-1815-4ec3-be2f-202d7b9115d3	SECRETARY	88bd02c2-5800-4afb-838f-39fae8d2b8fc	2026-09-13 17:00:55.526
421c418d-746f-483a-b6fb-1e49f45da1ec	SECRETARY	39276412-26f6-47b6-9076-c8adc7fd0249	2026-09-13 17:00:55.526
72d921d5-777f-480b-aaba-8fd0fe1ade78	SECRETARY	6d13ceac-263c-4780-9405-de0cd6ccf9df	2026-09-13 17:00:55.527
d0e43483-2772-49db-8c4d-a60491f1181d	SECRETARY	915cc8ad-d32e-416f-8881-d41d53d6743a	2026-09-13 17:00:55.528
73e28447-0916-4d5a-b7c5-4ee832870467	TEACHER	9c9588c8-0882-4312-a645-5c15a3ee6c14	2026-09-13 17:00:55.529
99a0f777-9124-4fd4-8ce3-ef6f88074e0d	TEACHER	676f5608-a29f-499a-90fb-9ccf74236573	2026-09-13 17:00:55.53
189b7636-794c-4a83-80b6-1a69675bc55b	TEACHER	cc182f79-7a77-4d2a-81b8-9793e324fe4d	2026-09-13 17:00:55.532
3686d792-b677-407e-87a7-c8364bde1c90	TEACHER	418246f6-fa33-4658-b5fe-955db71c6a46	2026-09-13 17:00:55.534
e8e75f21-e96a-4877-b3f3-15ff6b44f1d6	TEACHER	c8a3a82b-3ebd-42d9-b53f-f1efeccb1eaa	2026-09-13 17:00:55.536
477b2b77-9ad2-4382-9b36-f4f1390ef329	TEACHER	b4152a5d-0378-440c-ba09-a4dc3beb321e	2026-09-13 17:00:55.537
6498ff37-7f26-403f-b174-d830291030b1	TEACHER	27de61b3-2929-4fab-8466-c245d17f346b	2026-09-13 17:00:55.538
a9479a38-6c45-49e5-b6ad-0959d32fba3a	TEACHER	257e6701-fc5d-4a24-a78c-1d92c45890b4	2026-09-13 17:00:55.539
a8048edd-ae33-4777-bee2-c0f0b881976b	TEACHER	883c621a-da09-4eb3-b938-84c0ce185934	2026-09-13 17:00:55.54
54764669-5287-450d-b275-c7ea22c57477	TEACHER	a1df8d47-456b-4b10-965a-f5aec3b9f86a	2026-09-13 17:00:55.541
266e9fc3-1ce5-4791-9735-2d6673621ba0	TEACHER	542a7fc4-299d-4228-9e78-86909519968a	2026-09-13 17:00:55.542
9b90390a-2597-45d3-b1db-c93af6489586	TEACHER	978a9657-3169-4e45-97f7-d6e35197c5b8	2026-09-13 17:00:55.543
5bf95e8a-59c4-47d8-bb66-87d7e52419d0	TEACHER	84f43f99-4b0b-4f7d-a17a-d2cbd1484f38	2026-09-13 17:00:55.543
d241f024-b9e2-4fcb-b6fa-5764bf700298	TEACHER	443640e2-a272-4b68-b2cc-e389a5f6e3b6	2026-09-13 17:00:55.544
8aedd31f-ad18-400f-83d5-be32919f7d49	TEACHER	0a3047f7-b84a-47eb-b889-6a06ca4e9bc1	2026-09-13 17:00:55.545
3ab9e58b-abd6-4fb6-8ab8-333c1e008e03	TEACHER	6d13ceac-263c-4780-9405-de0cd6ccf9df	2026-09-13 17:00:55.546
1b7ad917-dc15-43cb-be69-e2c93873ebaa	PARENT	9c9588c8-0882-4312-a645-5c15a3ee6c14	2026-09-13 17:00:55.547
a01c8dbf-25d7-4611-8018-fe764a8cac13	PARENT	676f5608-a29f-499a-90fb-9ccf74236573	2026-09-13 17:00:55.547
c98efc4a-d8a6-4213-97a2-f73622a681d2	PARENT	cc182f79-7a77-4d2a-81b8-9793e324fe4d	2026-09-13 17:00:55.548
de06cd96-b0af-44a5-9633-1e3d7418bd2c	PARENT	c8a3a82b-3ebd-42d9-b53f-f1efeccb1eaa	2026-09-13 17:00:55.549
68995116-99c1-40ff-88a6-6a8ff443c37c	PARENT	b4152a5d-0378-440c-ba09-a4dc3beb321e	2026-09-13 17:00:55.55
b1495779-85c3-4a8d-8287-6e6258656f6d	PARENT	27de61b3-2929-4fab-8466-c245d17f346b	2026-09-13 17:00:55.551
0250987a-f9ad-43ab-a8cc-8f81147c29a4	PARENT	883c621a-da09-4eb3-b938-84c0ce185934	2026-09-13 17:00:55.551
6ad765f3-2169-408f-9317-0d900d2563ab	PARENT	a1df8d47-456b-4b10-965a-f5aec3b9f86a	2026-09-13 17:00:55.552
29d9059e-242e-46a2-9c96-0bfe6bbb01cf	PARENT	84f43f99-4b0b-4f7d-a17a-d2cbd1484f38	2026-09-13 17:00:55.553
\.


--
-- Data for Name: sie_synchronization_items; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.sie_synchronization_items (id, synchronization_id, student_id, subject_id, period_id, local_value, sie_value, status, error_message, retry_count, verified_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sie_synchronizations; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.sie_synchronizations (id, requested_by_id, status, sync_type, total_items, processed_items, error_count, started_at, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: student_parents; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.student_parents (id, student_id, parent_id, relationship, is_primary, can_pickup, created_at) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.students (id, user_id, rude, ci, first_name, last_name, birth_date, gender, address, phone, is_active, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.subjects (id, name, code, description, area, created_at, updated_at) FROM stdin;
1fee1347-eda7-467b-ad5b-a71fe17792c4	Matemática	MAT-SEC	\N	Ciencia y Tecnología	2026-09-13 17:00:55.647	2026-09-13 17:00:55.647
9a2673d0-c402-470a-9365-fc13aad2ce15	Lenguaje y Comunicación	LEN-SEC	\N	Humanidades	2026-09-13 17:00:55.652	2026-09-13 17:00:55.652
3bb47867-45ef-4462-b5d1-ab3e1608f564	Ciencias Naturales: Física	FIS-SEC	\N	Ciencia y Tecnología	2026-09-13 17:00:55.654	2026-09-13 17:00:55.654
51b44804-28c8-46c7-a66b-c09a94e22b39	Ciencias Naturales: Química	QUI-SEC	\N	Ciencia y Tecnología	2026-09-13 17:00:55.655	2026-09-13 17:00:55.655
77ea1041-c7a8-4ccd-aa26-6ea76022f90f	Ciencias Sociales: Historia	HIS-SEC	\N	Ciencias Sociales	2026-09-13 17:00:55.655	2026-09-13 17:00:55.655
0f4aaf4f-c7a1-4f70-9525-694f4494457d	Lengua Extranjera: Inglés	ING-SEC	\N	Humanidades	2026-09-13 17:00:55.656	2026-09-13 17:00:55.656
c70f46c9-cc39-4646-940c-2053acbd6c02	Educación Física y Deportes	EFD-SEC	\N	Deportes	2026-09-13 17:00:55.656	2026-09-13 17:00:55.656
\.


--
-- Data for Name: teacher_subjects; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.teacher_subjects (id, teacher_id, subject_id, course_id, academic_year_id, created_at) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.teachers (id, user_id, ci, first_name, last_name, specialty, phone, item_number, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at, deleted_at) FROM stdin;
3360123b-4d74-454d-ba3e-03f073d0c142	admin@example.local	$2b$10$xRS02ezD/WcSi/Jnk3Agp./p1S2PWiXbjeVM/69xB.HodnGnkTGKO	Administrador	General	ADMIN	t	2026-09-13 17:00:55.634	2026-09-13 17:00:55.634	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_periods academic_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.academic_periods
    ADD CONSTRAINT academic_periods_pkey PRIMARY KEY (id);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: sie_synchronization_items sie_synchronization_items_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_pkey PRIMARY KEY (id);


--
-- Name: sie_synchronizations sie_synchronizations_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronizations
    ADD CONSTRAINT sie_synchronizations_pkey PRIMARY KEY (id);


--
-- Name: student_parents student_parents_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_subjects teacher_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: academic_periods_academic_year_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX academic_periods_academic_year_id_idx ON public.academic_periods USING btree (academic_year_id);


--
-- Name: academic_periods_academic_year_id_number_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX academic_periods_academic_year_id_number_key ON public.academic_periods USING btree (academic_year_id, number);


--
-- Name: academic_years_is_active_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX academic_years_is_active_idx ON public.academic_years USING btree (is_active);


--
-- Name: academic_years_year_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX academic_years_year_idx ON public.academic_years USING btree (year);


--
-- Name: academic_years_year_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX academic_years_year_key ON public.academic_years USING btree (year);


--
-- Name: alerts_is_read_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX alerts_is_read_idx ON public.alerts USING btree (is_read);


--
-- Name: alerts_user_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX alerts_user_id_idx ON public.alerts USING btree (user_id);


--
-- Name: attendances_course_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX attendances_course_id_idx ON public.attendances USING btree (course_id);


--
-- Name: attendances_date_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX attendances_date_idx ON public.attendances USING btree (date);


--
-- Name: attendances_student_id_course_id_date_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX attendances_student_id_course_id_date_key ON public.attendances USING btree (student_id, course_id, date);


--
-- Name: attendances_student_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX attendances_student_id_idx ON public.attendances USING btree (student_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_entity_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX audit_logs_entity_entity_id_idx ON public.audit_logs USING btree (entity, entity_id);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: courses_academic_year_id_grade_level_section_shift_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX courses_academic_year_id_grade_level_section_shift_key ON public.courses USING btree (academic_year_id, grade_level, section, shift);


--
-- Name: courses_academic_year_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX courses_academic_year_id_idx ON public.courses USING btree (academic_year_id);


--
-- Name: enrollments_academic_year_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX enrollments_academic_year_id_idx ON public.enrollments USING btree (academic_year_id);


--
-- Name: enrollments_course_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX enrollments_course_id_idx ON public.enrollments USING btree (course_id);


--
-- Name: enrollments_student_id_academic_year_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX enrollments_student_id_academic_year_id_key ON public.enrollments USING btree (student_id, academic_year_id);


--
-- Name: enrollments_student_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX enrollments_student_id_idx ON public.enrollments USING btree (student_id);


--
-- Name: grades_enrollment_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX grades_enrollment_id_idx ON public.grades USING btree (enrollment_id);


--
-- Name: grades_period_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX grades_period_id_idx ON public.grades USING btree (period_id);


--
-- Name: grades_student_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX grades_student_id_idx ON public.grades USING btree (student_id);


--
-- Name: grades_student_id_subject_id_period_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX grades_student_id_subject_id_period_id_key ON public.grades USING btree (student_id, subject_id, period_id);


--
-- Name: grades_subject_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX grades_subject_id_idx ON public.grades USING btree (subject_id);


--
-- Name: parents_ci_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX parents_ci_idx ON public.parents USING btree (ci);


--
-- Name: parents_ci_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX parents_ci_key ON public.parents USING btree (ci);


--
-- Name: parents_user_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX parents_user_id_idx ON public.parents USING btree (user_id);


--
-- Name: parents_user_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX parents_user_id_key ON public.parents USING btree (user_id);


--
-- Name: permissions_name_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX permissions_name_key ON public.permissions USING btree (name);


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX refresh_tokens_token_idx ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);


--
-- Name: role_permissions_role_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX role_permissions_role_idx ON public.role_permissions USING btree (role);


--
-- Name: role_permissions_role_permission_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX role_permissions_role_permission_id_key ON public.role_permissions USING btree (role, permission_id);


--
-- Name: sie_synchronization_items_status_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX sie_synchronization_items_status_idx ON public.sie_synchronization_items USING btree (status);


--
-- Name: sie_synchronization_items_student_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX sie_synchronization_items_student_id_idx ON public.sie_synchronization_items USING btree (student_id);


--
-- Name: sie_synchronization_items_synchronization_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX sie_synchronization_items_synchronization_id_idx ON public.sie_synchronization_items USING btree (synchronization_id);


--
-- Name: sie_synchronizations_created_at_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX sie_synchronizations_created_at_idx ON public.sie_synchronizations USING btree (created_at);


--
-- Name: sie_synchronizations_requested_by_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX sie_synchronizations_requested_by_id_idx ON public.sie_synchronizations USING btree (requested_by_id);


--
-- Name: sie_synchronizations_status_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX sie_synchronizations_status_idx ON public.sie_synchronizations USING btree (status);


--
-- Name: student_parents_parent_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX student_parents_parent_id_idx ON public.student_parents USING btree (parent_id);


--
-- Name: student_parents_student_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX student_parents_student_id_idx ON public.student_parents USING btree (student_id);


--
-- Name: student_parents_student_id_parent_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX student_parents_student_id_parent_id_key ON public.student_parents USING btree (student_id, parent_id);


--
-- Name: students_ci_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX students_ci_idx ON public.students USING btree (ci);


--
-- Name: students_ci_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX students_ci_key ON public.students USING btree (ci);


--
-- Name: students_last_name_first_name_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX students_last_name_first_name_idx ON public.students USING btree (last_name, first_name);


--
-- Name: students_rude_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX students_rude_idx ON public.students USING btree (rude);


--
-- Name: students_rude_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX students_rude_key ON public.students USING btree (rude);


--
-- Name: students_user_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX students_user_id_key ON public.students USING btree (user_id);


--
-- Name: subjects_code_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX subjects_code_idx ON public.subjects USING btree (code);


--
-- Name: subjects_code_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX subjects_code_key ON public.subjects USING btree (code);


--
-- Name: subjects_name_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX subjects_name_key ON public.subjects USING btree (name);


--
-- Name: teacher_subjects_course_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX teacher_subjects_course_id_idx ON public.teacher_subjects USING btree (course_id);


--
-- Name: teacher_subjects_subject_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX teacher_subjects_subject_id_idx ON public.teacher_subjects USING btree (subject_id);


--
-- Name: teacher_subjects_teacher_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX teacher_subjects_teacher_id_idx ON public.teacher_subjects USING btree (teacher_id);


--
-- Name: teacher_subjects_teacher_id_subject_id_course_id_academic_y_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX teacher_subjects_teacher_id_subject_id_course_id_academic_y_key ON public.teacher_subjects USING btree (teacher_id, subject_id, course_id, academic_year_id);


--
-- Name: teachers_ci_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX teachers_ci_idx ON public.teachers USING btree (ci);


--
-- Name: teachers_ci_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX teachers_ci_key ON public.teachers USING btree (ci);


--
-- Name: teachers_user_id_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX teachers_user_id_idx ON public.teachers USING btree (user_id);


--
-- Name: teachers_user_id_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX teachers_user_id_key ON public.teachers USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_is_active_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX users_is_active_idx ON public.users USING btree (is_active);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: academic_admin
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: academic_periods academic_periods_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.academic_periods
    ADD CONSTRAINT academic_periods_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alerts alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendances attendances_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendances attendances_registered_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_registered_by_id_fkey FOREIGN KEY (registered_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: courses courses_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.academic_periods(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parents parents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.academic_periods(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronization_items sie_synchronization_items_synchronization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronization_items
    ADD CONSTRAINT sie_synchronization_items_synchronization_id_fkey FOREIGN KEY (synchronization_id) REFERENCES public.sie_synchronizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sie_synchronizations sie_synchronizations_requested_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.sie_synchronizations
    ADD CONSTRAINT sie_synchronizations_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_parents student_parents_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_parents student_parents_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_subjects teacher_subjects_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academic_admin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6LvHNEPe0XKQxkwPx9NOMOFXLOZrGx9DjJidi74KkvFqjaWDsTQfcmFOF3qeK8R


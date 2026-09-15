--
-- PostgreSQL database dump
--

\restrict QMK6y3saH6D9wVdrZkNQhrrbg4YmDtuBASp9b2rCxzZI5WWiz61LwSjSOfGQyDS

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
452972df-1392-4521-9b2c-99eab5e6cf29	3360123b-4d74-454d-ba3e-03f073d0c142	LOGIN	User	3360123b-4d74-454d-ba3e-03f073d0c142	null	{"role": "ADMIN", "email": "admin@example.local"}	::1	node	2026-09-13 20:45:15.421
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at) FROM stdin;
51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	Inicial en Familia Comunitaria - Primero A	1	A	MORNING	45	2026-09-13 20:44:56.919	2026-09-13 20:44:56.919
cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	Inicial en Familia Comunitaria - Primero B	1	B	MORNING	45	2026-09-13 20:44:56.93	2026-09-13 20:44:56.93
423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	Inicial en Familia Comunitaria - Primero C	1	C	MORNING	45	2026-09-13 20:44:56.931	2026-09-13 20:44:56.931
73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	Inicial en Familia Comunitaria - Segundo A	2	A	MORNING	45	2026-09-13 20:44:56.932	2026-09-13 20:44:56.932
52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	Inicial en Familia Comunitaria - Segundo B	2	B	MORNING	45	2026-09-13 20:44:56.932	2026-09-13 20:44:56.932
a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Primero A	3	A	MORNING	45	2026-09-13 20:44:56.933	2026-09-13 20:44:56.933
4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Primero B	3	B	MORNING	45	2026-09-13 20:44:56.934	2026-09-13 20:44:56.934
266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Segundo A	4	A	MORNING	45	2026-09-13 20:44:56.935	2026-09-13 20:44:56.935
1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Segundo B	4	B	MORNING	45	2026-09-13 20:44:56.936	2026-09-13 20:44:56.936
8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Tercero A	5	A	MORNING	45	2026-09-13 20:44:56.937	2026-09-13 20:44:56.937
50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Tercero B	5	B	MORNING	45	2026-09-13 20:44:56.938	2026-09-13 20:44:56.938
ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Cuarto A	6	A	MORNING	45	2026-09-13 20:44:56.939	2026-09-13 20:44:56.939
7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Cuarto B	6	B	MORNING	45	2026-09-13 20:44:56.939	2026-09-13 20:44:56.939
9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Quinto A	7	A	MORNING	45	2026-09-13 20:44:56.94	2026-09-13 20:44:56.94
b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Quinto B	7	B	MORNING	45	2026-09-13 20:44:56.941	2026-09-13 20:44:56.941
34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Sexto A	8	A	MORNING	45	2026-09-13 20:44:56.942	2026-09-13 20:44:56.942
a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	Primaria Comunitaria Vocacional - Sexto B	8	B	MORNING	45	2026-09-13 20:44:56.943	2026-09-13 20:44:56.943
ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Primero A	9	A	MORNING	45	2026-09-13 20:44:56.944	2026-09-13 20:44:56.944
ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Primero B	9	B	MORNING	45	2026-09-13 20:44:56.945	2026-09-13 20:44:56.945
f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Segundo A	10	A	MORNING	45	2026-09-13 20:44:56.945	2026-09-13 20:44:56.945
46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Segundo B	10	B	MORNING	45	2026-09-13 20:44:56.946	2026-09-13 20:44:56.946
092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Tercero A	11	A	MORNING	45	2026-09-13 20:44:56.947	2026-09-13 20:44:56.947
0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Tercero B	11	B	MORNING	45	2026-09-13 20:44:56.948	2026-09-13 20:44:56.948
122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Cuarto A	12	A	MORNING	45	2026-09-13 20:44:56.949	2026-09-13 20:44:56.949
b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Cuarto B	12	B	MORNING	45	2026-09-13 20:44:56.949	2026-09-13 20:44:56.949
ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Cuarto C	12	C	MORNING	45	2026-09-13 20:44:56.95	2026-09-13 20:44:56.95
7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Quinto A	13	A	MORNING	45	2026-09-13 20:44:56.951	2026-09-13 20:44:56.951
fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Quinto B	13	B	MORNING	45	2026-09-13 20:44:56.951	2026-09-13 20:44:56.951
2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Sexto A	14	A	MORNING	45	2026-09-13 20:44:56.952	2026-09-13 20:44:56.952
73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	Secundaria Comunitaria Productiva - Sexto B	14	B	MORNING	45	2026-09-13 20:44:56.953	2026-09-13 20:44:56.953
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.enrollments (id, student_id, course_id, academic_year_id, enrollment_date, status, remarks, created_at, updated_at) FROM stdin;
db422642-da0a-4367-9016-e2ca46d8abd9	231b3836-e162-475f-9479-dbded29f4dac	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.095	ACTIVE	\N	2026-09-13 20:44:57.095	2026-09-13 20:44:57.095
4c8c9723-ddf7-4ef6-bde1-d4e5f4369373	10fb0d9a-7007-4a3c-9c14-95abb69972bb	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.1	ACTIVE	\N	2026-09-13 20:44:57.1	2026-09-13 20:44:57.1
40828ed7-cff4-47fc-b9bd-97e972b62a12	7f0c4e0d-697b-4938-b424-d187ddfd844f	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.101	ACTIVE	\N	2026-09-13 20:44:57.101	2026-09-13 20:44:57.101
89e38a22-7a58-4c80-b34b-576d2258941b	5a695350-65d1-4138-b8fa-52d529f3ca19	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.103	ACTIVE	\N	2026-09-13 20:44:57.103	2026-09-13 20:44:57.103
330055de-ed33-40aa-bff7-2a08ae508dcd	3b712863-e2c2-4283-83ae-64ad71ec7eee	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.105	ACTIVE	\N	2026-09-13 20:44:57.105	2026-09-13 20:44:57.105
596d7a88-9bae-45d3-a7b5-d8f815b34b7a	4e34ef79-59ff-440b-a8c3-2f4e50e1e336	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.106	ACTIVE	\N	2026-09-13 20:44:57.106	2026-09-13 20:44:57.106
cfa8a470-a6d8-4ccb-a7ca-481d15f50c11	69ca9f4e-2c36-420a-9051-ef2583761f3b	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.109	ACTIVE	\N	2026-09-13 20:44:57.109	2026-09-13 20:44:57.109
b605b352-f341-4744-a5a4-3f0ea69c9b0d	a2737e10-7601-457c-a24a-0428996d0df3	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.111	ACTIVE	\N	2026-09-13 20:44:57.111	2026-09-13 20:44:57.111
3c383dd0-c596-478d-961a-fb18917baf9a	a3862bc9-2919-491d-8deb-644de8a1b1b3	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.112	ACTIVE	\N	2026-09-13 20:44:57.112	2026-09-13 20:44:57.112
af042369-751d-46b1-9fee-f190a14a4301	5e12751f-3275-42d0-94b6-377b799574c6	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.114	ACTIVE	\N	2026-09-13 20:44:57.114	2026-09-13 20:44:57.114
eb67f7e8-80ce-42f5-a5cb-f9363252949a	553cd6a8-557c-47cd-b28e-d1d97f5ba15e	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.115	ACTIVE	\N	2026-09-13 20:44:57.115	2026-09-13 20:44:57.115
447de97b-31e4-47da-bda8-197ce701c347	bab70ab3-1a4b-4e44-ac04-89c506cac618	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.117	ACTIVE	\N	2026-09-13 20:44:57.117	2026-09-13 20:44:57.117
9f77a9ee-fb63-4595-80da-7b74aada4f43	1e007d12-f809-4d70-8063-82c973f58afb	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.119	ACTIVE	\N	2026-09-13 20:44:57.119	2026-09-13 20:44:57.119
9ac4ddf2-3a01-463a-90c5-418715309985	76f69430-3089-4680-a9ad-c74a2886bf5b	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.12	ACTIVE	\N	2026-09-13 20:44:57.12	2026-09-13 20:44:57.12
3d261508-2945-44d0-a1d8-99b9f133166d	206a3aee-f5d5-4bd7-b5fb-e1b60f3114db	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.122	ACTIVE	\N	2026-09-13 20:44:57.122	2026-09-13 20:44:57.122
5d7feba7-d3ec-4bc3-b1ef-cc079a57b724	cede877b-4a3b-41ea-b081-511ca434ef67	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.123	ACTIVE	\N	2026-09-13 20:44:57.123	2026-09-13 20:44:57.123
ff221354-b1a2-4144-abce-3f475fff6368	f44ca548-d78b-4342-96d0-ea36c6c1d678	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.124	ACTIVE	\N	2026-09-13 20:44:57.124	2026-09-13 20:44:57.124
c1affdca-2d9c-406a-96a7-9b44bbbdf5d7	1c511c8d-4fdf-4496-b526-6b7ae4b6dc09	51c61848-ac76-418d-8879-9684ac6c2eab	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.127	ACTIVE	\N	2026-09-13 20:44:57.127	2026-09-13 20:44:57.127
7f1815ec-6e41-4adf-88cf-edbc40a7f100	74dba220-28a9-43fd-bc18-e9fb41dc5c2a	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.128	ACTIVE	\N	2026-09-13 20:44:57.128	2026-09-13 20:44:57.128
8031541b-335d-4877-8d2f-24af696f09fb	ca2820e5-2d63-4dcb-a3b1-276bcc8f47e1	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.13	ACTIVE	\N	2026-09-13 20:44:57.13	2026-09-13 20:44:57.13
34f5fc79-1e1e-4caf-8669-63d133a6d31f	c7dd8b96-dfbf-46e3-98eb-c122df74118f	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.131	ACTIVE	\N	2026-09-13 20:44:57.131	2026-09-13 20:44:57.131
208d7ac7-715c-4d2f-81dc-f3bd7a65b30d	4f28750a-331c-43d4-98fd-4da6f8fa8c8d	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.132	ACTIVE	\N	2026-09-13 20:44:57.132	2026-09-13 20:44:57.132
469348ce-9fdc-430e-9324-fa0ccc4bee0b	cf9e1447-63b7-449f-be28-527161f259c0	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.133	ACTIVE	\N	2026-09-13 20:44:57.133	2026-09-13 20:44:57.133
2f52daa6-1e25-4cba-8469-f0b9baaf742e	2121fcac-a9bc-44bf-89ae-9d865ef7e589	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.135	ACTIVE	\N	2026-09-13 20:44:57.135	2026-09-13 20:44:57.135
2eaf20c7-adc7-470a-9e33-036597de23bf	b8ea5359-0672-4ac9-9d11-2b3d2ed1499f	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.136	ACTIVE	\N	2026-09-13 20:44:57.136	2026-09-13 20:44:57.136
45afe007-f61f-4ffa-bc33-641ba3a77944	2a03e291-0059-4973-a317-adf9dad9a899	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.138	ACTIVE	\N	2026-09-13 20:44:57.138	2026-09-13 20:44:57.138
53b89d3b-d126-43ed-a3cf-b054a6fbdeba	3c6a5f9b-1140-4d39-b4fc-cbafdb2df5d5	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.139	ACTIVE	\N	2026-09-13 20:44:57.139	2026-09-13 20:44:57.139
8a1b1f6f-d2bb-4b62-bb97-f65dcac1a3a7	381e996c-ebd4-4441-9a63-902fc084ea88	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.14	ACTIVE	\N	2026-09-13 20:44:57.14	2026-09-13 20:44:57.14
f09eb95b-0360-4dc5-b32f-bdd942453a5c	e56c86f5-4e2b-4894-b213-edc6568e2e6e	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.142	ACTIVE	\N	2026-09-13 20:44:57.142	2026-09-13 20:44:57.142
d46e746e-f772-470f-9592-4605b34df28d	b198f661-6d0d-4d7f-aff9-59d1faaa4159	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.144	ACTIVE	\N	2026-09-13 20:44:57.144	2026-09-13 20:44:57.144
9699715b-3aa8-499a-8d63-718a215b549a	df55b221-fba0-4602-957d-dc44c20c9590	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.145	ACTIVE	\N	2026-09-13 20:44:57.145	2026-09-13 20:44:57.145
5fe331e4-b60f-4ae6-90d1-674429986c4f	d7420623-e91f-43fe-ab9b-55f1e021cb22	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.147	ACTIVE	\N	2026-09-13 20:44:57.147	2026-09-13 20:44:57.147
730d4429-d2d4-4d06-9df7-27c497e79694	92453427-20ea-4cde-8e50-a3baee39035e	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.148	ACTIVE	\N	2026-09-13 20:44:57.148	2026-09-13 20:44:57.148
6fe68390-5a97-4e1b-ab36-11a05226827e	8163343f-cd96-47f8-863b-be07e3638bac	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.15	ACTIVE	\N	2026-09-13 20:44:57.15	2026-09-13 20:44:57.15
275727d9-96b7-4ed8-a49c-d4882ef6e6af	c19b1a69-f586-4017-9c16-a9dc8d57532b	cedff30c-a074-426c-a048-dc9ce45c5357	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.151	ACTIVE	\N	2026-09-13 20:44:57.151	2026-09-13 20:44:57.151
86c4e916-b41b-40f9-bb2a-1ecd9f247c0d	94acd090-3ae2-4566-b1e2-616d53e67871	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.153	ACTIVE	\N	2026-09-13 20:44:57.153	2026-09-13 20:44:57.153
12b43464-cc79-4025-ba5a-9908584531f7	7fb007c5-2872-474d-89a1-d3e8ab8eb35a	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.154	ACTIVE	\N	2026-09-13 20:44:57.154	2026-09-13 20:44:57.154
1bf60dcc-5b48-47ae-ab65-34bd4fa30313	bcb98044-debe-4726-a476-8caae8727d37	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.156	ACTIVE	\N	2026-09-13 20:44:57.156	2026-09-13 20:44:57.156
c0f448c3-49d2-4bea-95a2-30e01ec9c381	2014ef74-bbd6-47a1-b84d-a578d8bcd47c	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.158	ACTIVE	\N	2026-09-13 20:44:57.158	2026-09-13 20:44:57.158
82bd4fbf-1ece-49a4-a4a5-eeaeba6fb7a3	692d8eb1-ea20-4344-8b64-c96905772fe0	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.161	ACTIVE	\N	2026-09-13 20:44:57.161	2026-09-13 20:44:57.161
c4bdc91d-6774-429e-b6a6-ef208c019a7f	603c682f-5767-4398-be37-475a43ae69ca	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.163	ACTIVE	\N	2026-09-13 20:44:57.163	2026-09-13 20:44:57.163
8bd52adf-fd31-4d67-9064-9a0794a9da32	2050a6fe-5d19-4ee9-8c6d-b645cf0e570d	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.164	ACTIVE	\N	2026-09-13 20:44:57.164	2026-09-13 20:44:57.164
234918c6-c35c-4453-89c9-7c13ae754596	e462fc82-630e-4f8d-8c26-f1118bc19d56	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.165	ACTIVE	\N	2026-09-13 20:44:57.165	2026-09-13 20:44:57.165
6b3db458-f889-4dc0-94da-9811d2b3a52f	946d5bcd-2cdf-440a-af0c-508c3522263c	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.167	ACTIVE	\N	2026-09-13 20:44:57.167	2026-09-13 20:44:57.167
fb2e9966-2982-469d-a95d-dd9181997838	dcdc6cb0-c72b-4693-a60f-b88bc55aa7c2	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.168	ACTIVE	\N	2026-09-13 20:44:57.168	2026-09-13 20:44:57.168
340c5f00-e492-42c6-b95f-9985eae67e24	8c0ee726-cf01-4e25-ad36-56b12a8ab3f0	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.17	ACTIVE	\N	2026-09-13 20:44:57.17	2026-09-13 20:44:57.17
d41bbb26-f8db-478a-8394-2d5483d866c4	eb1f9ea0-8354-4b78-9d04-f89382209c2c	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.172	ACTIVE	\N	2026-09-13 20:44:57.172	2026-09-13 20:44:57.172
f6a3c7e7-e3f3-4870-a8ec-933c3a9d933a	f4683b04-784a-4f21-ae4b-c9331887cd80	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.173	ACTIVE	\N	2026-09-13 20:44:57.173	2026-09-13 20:44:57.173
02300340-880c-4c7c-b564-283669a3968b	8b2b45bd-2335-46c4-80b3-77c86af4a227	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.175	ACTIVE	\N	2026-09-13 20:44:57.175	2026-09-13 20:44:57.175
48135ffe-28dd-4abe-b156-261efd48ef83	b343a2d9-c21f-44cf-a8e6-62aebe5062fb	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.177	ACTIVE	\N	2026-09-13 20:44:57.177	2026-09-13 20:44:57.177
36c2da21-aa97-4313-a0e7-c0ef0f277580	02e0a794-7bf2-4aca-ae34-11c26b347b31	423cfae7-4fac-488c-afbb-0eadc5bf5d8f	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.179	ACTIVE	\N	2026-09-13 20:44:57.179	2026-09-13 20:44:57.179
a2ca6544-5ba6-4477-b071-5a437c918f86	d5f3d12d-0358-46f6-8fe9-86314bf732f6	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.181	ACTIVE	\N	2026-09-13 20:44:57.181	2026-09-13 20:44:57.181
84941242-86f7-4a5d-bd97-8602ad4e1b74	85e04d47-6d81-49f2-9d25-3d31dd38949b	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.182	ACTIVE	\N	2026-09-13 20:44:57.182	2026-09-13 20:44:57.182
66edbe1a-b99c-496d-931d-0ff1b7add50d	dbcd00f6-2738-410f-b552-57d652c5fd34	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.184	ACTIVE	\N	2026-09-13 20:44:57.184	2026-09-13 20:44:57.184
ee3568cb-94bb-4c21-a9dc-e8c62509ef8a	c3df281a-f8d3-4f47-8a60-1e3d1b21e07e	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.185	ACTIVE	\N	2026-09-13 20:44:57.185	2026-09-13 20:44:57.185
762018d9-f2f5-448e-9988-0637c15c433a	d22aac34-2710-47b3-a61e-21e7027ff996	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.187	ACTIVE	\N	2026-09-13 20:44:57.187	2026-09-13 20:44:57.187
5db92f9a-afe8-4a3f-b02c-ebdae246acc3	18781baf-9968-46af-9214-e1673afb12f1	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.188	ACTIVE	\N	2026-09-13 20:44:57.188	2026-09-13 20:44:57.188
2a29868d-e011-46df-8a47-0d8a01aca8cf	da3274f2-0434-4111-897c-503653bbd4ce	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.189	ACTIVE	\N	2026-09-13 20:44:57.189	2026-09-13 20:44:57.189
92728418-0f30-48c6-805e-08fa097678b8	41a5e10a-6614-4117-a675-560cc0720e74	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.191	ACTIVE	\N	2026-09-13 20:44:57.191	2026-09-13 20:44:57.191
fc06d26f-f54e-4006-a333-1e3d3bfabeef	c6ca07ad-c502-4b56-82ab-d02a0af5058e	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.193	ACTIVE	\N	2026-09-13 20:44:57.193	2026-09-13 20:44:57.193
f515ee59-3a21-465a-8aeb-ba1f2a662bfe	c05db867-aec8-4fdb-8261-4ed5d7aa21c6	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.195	ACTIVE	\N	2026-09-13 20:44:57.195	2026-09-13 20:44:57.195
f233e0fb-643b-4781-8dc0-d32697679d15	72ab6692-afe6-4626-b259-bac71ed69bc5	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.196	ACTIVE	\N	2026-09-13 20:44:57.196	2026-09-13 20:44:57.196
1c7e5c50-63a4-40ca-85cc-50949b322a44	4ad25e1d-3e3a-4ac3-9b79-85576865675b	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.198	ACTIVE	\N	2026-09-13 20:44:57.198	2026-09-13 20:44:57.198
ff57e708-6cf9-41c9-ba33-12053e98fbba	74c8c59c-8379-43b8-907e-6a032bc2c062	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.199	ACTIVE	\N	2026-09-13 20:44:57.199	2026-09-13 20:44:57.199
80260f1e-c026-4dc1-8dbc-1f8455e73089	57870af6-3476-4f2d-a583-a77ba07f3dce	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.201	ACTIVE	\N	2026-09-13 20:44:57.201	2026-09-13 20:44:57.201
7d1de35b-013b-4a39-a42b-e6a43e2c834d	9cea0542-58c4-4dc8-9e4d-bcf29562a08b	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.202	ACTIVE	\N	2026-09-13 20:44:57.202	2026-09-13 20:44:57.202
a79db2d5-1715-4910-b478-1181618faaf8	078bd4bb-7d19-4661-8b61-31b470069242	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.203	ACTIVE	\N	2026-09-13 20:44:57.203	2026-09-13 20:44:57.203
2708f157-37f9-4934-b234-8e009a341cb3	4ba22598-409c-40e9-a66f-90503cc900b6	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.205	ACTIVE	\N	2026-09-13 20:44:57.205	2026-09-13 20:44:57.205
8334a400-42ab-426b-868c-ac22945a1c8b	71870e8f-e555-48f9-883e-319bb494ae2c	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.206	ACTIVE	\N	2026-09-13 20:44:57.206	2026-09-13 20:44:57.206
223138c5-6acc-4b20-b84c-4c0b71a8050e	aa9060a1-57d7-41bb-aaa8-e3a7e3cbb7a8	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.208	ACTIVE	\N	2026-09-13 20:44:57.208	2026-09-13 20:44:57.208
2dd74390-1e0c-4634-9a9e-dfa7a5279ebb	3c2dfc78-2e48-4d41-b0d0-acebf2e3c2c2	73f6d746-bb5f-4f66-96df-5a51fd3e7aba	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.211	ACTIVE	\N	2026-09-13 20:44:57.211	2026-09-13 20:44:57.211
f0b42582-2be8-40eb-a117-221e89c1e36d	5ef2cd09-effc-43cb-97f2-17f555a4b65f	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.212	ACTIVE	\N	2026-09-13 20:44:57.212	2026-09-13 20:44:57.212
d5256997-8902-4f35-abb8-b4c9e0e765e8	15c5e826-dd9f-4dd5-aba9-9f06677fcfd5	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.214	ACTIVE	\N	2026-09-13 20:44:57.214	2026-09-13 20:44:57.214
64d7168a-d6d1-49e0-8d9f-e39afd18da72	5785b82e-d2a6-4522-b831-6c15c2c3abb0	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.215	ACTIVE	\N	2026-09-13 20:44:57.215	2026-09-13 20:44:57.215
d97423c9-d43a-4bc2-8392-333e17e55bc7	5c7ed4e6-b5cd-4cb6-a1ea-f8aa5ca28026	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.216	ACTIVE	\N	2026-09-13 20:44:57.216	2026-09-13 20:44:57.216
67bbc322-66c3-4d73-8270-ebf73247d5dd	61246cbb-0a6a-4c0a-8ac6-59cc2864dec9	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.218	ACTIVE	\N	2026-09-13 20:44:57.218	2026-09-13 20:44:57.218
c20d0fc7-d41e-4cee-af51-c117f4786e52	e17932bb-e637-45a7-b77b-ac130aa8cfce	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.219	ACTIVE	\N	2026-09-13 20:44:57.219	2026-09-13 20:44:57.219
a97735db-e896-4632-9d24-773cfc772c26	41155da9-4e7e-4f08-9b67-4ee646e07eab	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.22	ACTIVE	\N	2026-09-13 20:44:57.22	2026-09-13 20:44:57.22
115d2d02-4d3b-4c0d-ac0f-cd0312e0e5ce	955ff372-4de2-4ba6-bc18-958cd147e125	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.222	ACTIVE	\N	2026-09-13 20:44:57.222	2026-09-13 20:44:57.222
58535f57-731e-493d-a82a-fe21d2a97b22	0c03ef3e-0370-4451-a730-b3ac17e27a9d	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.223	ACTIVE	\N	2026-09-13 20:44:57.223	2026-09-13 20:44:57.223
eb0f4d89-fdb8-4eb0-9d40-528a41ff2908	e9935d71-3799-4a43-98e6-4a4fa4395835	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.226	ACTIVE	\N	2026-09-13 20:44:57.226	2026-09-13 20:44:57.226
dfd4f56a-c96c-4f0d-b2cd-858aab5fcb76	98876ad1-5895-417c-b8e0-26ccd5c381f4	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.228	ACTIVE	\N	2026-09-13 20:44:57.228	2026-09-13 20:44:57.228
ddc30e09-f648-416a-863f-7d63f47cc6c2	33ae4346-ee59-4fcb-b2f3-fd980c51d7c8	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.229	ACTIVE	\N	2026-09-13 20:44:57.229	2026-09-13 20:44:57.229
43991f4a-7bff-498d-9cc4-5632d9469a76	c72486b1-ca10-495c-88e8-afab1bf874f3	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.231	ACTIVE	\N	2026-09-13 20:44:57.231	2026-09-13 20:44:57.231
cda6c03c-adc7-4c4d-ba16-58b38f8d6b7f	a61cf03e-8aea-41c3-ba79-1f0193aa17b3	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.232	ACTIVE	\N	2026-09-13 20:44:57.232	2026-09-13 20:44:57.232
03367df1-f15d-4286-932f-ca6f53c932b5	313bdc46-e52d-4800-ba27-f6cf19114e6e	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.233	ACTIVE	\N	2026-09-13 20:44:57.233	2026-09-13 20:44:57.233
7821fcd4-e6f5-44d6-8fce-2212e8c81042	bb61222b-7a4b-4789-a666-81f11aeaf0fd	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.235	ACTIVE	\N	2026-09-13 20:44:57.235	2026-09-13 20:44:57.235
eb9846a4-5d0e-4225-a5ab-bff71ce7d4cc	8a31d3f1-0721-4762-b32d-d5edaa7047d5	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.236	ACTIVE	\N	2026-09-13 20:44:57.236	2026-09-13 20:44:57.236
322cb663-3735-4ed9-ac1d-c5420c0183a2	465228f3-92a3-46c1-83ac-ebdcecb7b5ce	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.237	ACTIVE	\N	2026-09-13 20:44:57.237	2026-09-13 20:44:57.237
46d4dbab-e33a-4228-8703-a7cfdc6554bd	7567f5bb-be6a-4d0f-b7ac-a1d82c1ed6d2	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.239	ACTIVE	\N	2026-09-13 20:44:57.239	2026-09-13 20:44:57.239
913b8e72-171d-4b20-87e7-8bc7b596df57	8d062c07-1a0f-4339-a668-7765c113f593	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.241	ACTIVE	\N	2026-09-13 20:44:57.241	2026-09-13 20:44:57.241
a9e0f769-301d-4be5-9d6c-fa67a3e12d4e	9b5e5e3b-cff2-4b50-9791-412019e91e87	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.243	ACTIVE	\N	2026-09-13 20:44:57.243	2026-09-13 20:44:57.243
2a8d7145-ec3a-4592-829b-4c7b31342287	42e672c6-95ec-42b5-8894-a6eeb9a46f70	52778afb-7cfe-4518-a3f3-9a2fb90f6cf2	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.245	ACTIVE	\N	2026-09-13 20:44:57.245	2026-09-13 20:44:57.245
6031b9d4-7bec-4bc7-8726-f9f3b4c61aa2	62b529c8-fcb7-4aa2-97a3-6da5af723440	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.248	ACTIVE	\N	2026-09-13 20:44:57.248	2026-09-13 20:44:57.248
86b65fcd-0d04-4c49-9368-2af103d21971	73ac3bba-bb93-4cd7-a6f2-fe5839b7e5fa	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.25	ACTIVE	\N	2026-09-13 20:44:57.25	2026-09-13 20:44:57.25
e9954661-aafa-49b4-97b2-8d9a5445933b	caca954a-d5a3-4872-b298-d3fb01777513	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.253	ACTIVE	\N	2026-09-13 20:44:57.253	2026-09-13 20:44:57.253
69bf80e0-8d4c-477e-9c60-5fe7ac2d9b55	1c48ec2f-b281-4465-8fd3-6d41e7f15fee	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.256	ACTIVE	\N	2026-09-13 20:44:57.256	2026-09-13 20:44:57.256
2734748a-bc89-4c71-a280-055cabc9bb5d	ac153d49-8099-45c4-aa6f-4a64b205a0ff	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.258	ACTIVE	\N	2026-09-13 20:44:57.258	2026-09-13 20:44:57.258
d1e31d84-ffa7-42fe-8d8e-6a07020e9578	d937cd60-a402-4346-b477-60569dab09ab	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.261	ACTIVE	\N	2026-09-13 20:44:57.261	2026-09-13 20:44:57.261
bf9a74f7-e5ef-4800-ac46-ce800d69727a	725fa8bf-6b11-4008-956f-9faf85c484c5	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.262	ACTIVE	\N	2026-09-13 20:44:57.262	2026-09-13 20:44:57.262
561bd51e-6abd-4289-a773-734cf4a622b7	8356e45c-46ab-4577-aa0d-eee139352b63	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.264	ACTIVE	\N	2026-09-13 20:44:57.264	2026-09-13 20:44:57.264
b3ddfaad-5795-4dca-a140-ed064122262a	adadba3f-40a4-45a4-9ca8-7c3cd7983bf9	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.265	ACTIVE	\N	2026-09-13 20:44:57.265	2026-09-13 20:44:57.265
8319f2c0-44c0-4dbc-9c40-50e412bd5791	f3f4c706-af3f-46ef-8d8d-36239934ad2a	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.266	ACTIVE	\N	2026-09-13 20:44:57.266	2026-09-13 20:44:57.266
990c0fde-4a58-4de1-8fc7-adb619f9d202	9c6cf345-88e6-496c-b288-95f62cd27af9	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.268	ACTIVE	\N	2026-09-13 20:44:57.268	2026-09-13 20:44:57.268
5a1a7aa4-00ee-4e75-b0c2-4cae2cd50c4b	c78e794c-03d9-4e7e-925e-c291cd83a8e0	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.269	ACTIVE	\N	2026-09-13 20:44:57.269	2026-09-13 20:44:57.269
87d17e88-b760-474f-b6e7-b2cc2d947ae1	c2bad235-d42e-452e-b697-c19f3762a756	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.27	ACTIVE	\N	2026-09-13 20:44:57.27	2026-09-13 20:44:57.27
9a45b633-b056-49c6-b209-111aeb03777a	b0873bee-db46-49ca-9cac-ae305ded11bf	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.272	ACTIVE	\N	2026-09-13 20:44:57.272	2026-09-13 20:44:57.272
924ad84a-0974-4950-a3b1-09872afa547b	06ffcd75-5229-418c-a275-b5a431cda5e1	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.273	ACTIVE	\N	2026-09-13 20:44:57.273	2026-09-13 20:44:57.273
42b22e13-1dac-403c-b5dc-5012cd496265	cc07f503-00ea-460d-9a62-a334633f4f20	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.274	ACTIVE	\N	2026-09-13 20:44:57.274	2026-09-13 20:44:57.274
42bca313-a20b-41ee-ba20-f0f3059251d0	65b72e88-6964-4795-9257-ac5c3c4bca97	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.277	ACTIVE	\N	2026-09-13 20:44:57.277	2026-09-13 20:44:57.277
3d69f04b-7a0f-4da1-9f78-5479cd4bad67	f0f17d8d-4154-4b75-a1d0-7cf9bdec3c3c	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.278	ACTIVE	\N	2026-09-13 20:44:57.278	2026-09-13 20:44:57.278
cbc2cb9a-962c-4727-aaaa-f9399bd9fc8b	55e37c60-c3a7-469f-86db-cd90ccee1fb7	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.28	ACTIVE	\N	2026-09-13 20:44:57.28	2026-09-13 20:44:57.28
86427229-ec0c-4bc1-acd1-e9564a6b0372	f9875070-bba0-4f72-9e4c-22148d39550d	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.281	ACTIVE	\N	2026-09-13 20:44:57.281	2026-09-13 20:44:57.281
89954ed7-9292-4630-a661-d2fee9b81308	3cba3942-09d9-479e-960a-0cc6995abcc1	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.283	ACTIVE	\N	2026-09-13 20:44:57.283	2026-09-13 20:44:57.283
9ff9e51f-49b9-40a3-9842-9721145954bc	06e71927-56ab-42bb-8469-8a6986c3d9e0	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.284	ACTIVE	\N	2026-09-13 20:44:57.284	2026-09-13 20:44:57.284
78939b80-ab0d-4781-8cbd-cb9a322aa884	5ec78741-aa4b-4114-b540-92ddf5e85a80	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.286	ACTIVE	\N	2026-09-13 20:44:57.286	2026-09-13 20:44:57.286
70bca1b4-f853-4a5e-8927-7d28b408870f	be698c3a-4758-4d63-9678-aea2d0362a8a	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.287	ACTIVE	\N	2026-09-13 20:44:57.287	2026-09-13 20:44:57.287
66704516-0344-45f1-ba92-876df507c3a6	61f9bad7-72a0-46db-8f47-9c0b2fbce433	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.288	ACTIVE	\N	2026-09-13 20:44:57.288	2026-09-13 20:44:57.288
1a0b77ae-3f09-430a-a7d6-462325259d9e	73e23929-0afb-4b3c-95dd-834860eb7c27	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.29	ACTIVE	\N	2026-09-13 20:44:57.29	2026-09-13 20:44:57.29
3a599fe4-f7a3-4a64-9327-fd12f3d41434	321fb559-dc84-4087-aa3b-5a01dad60b80	a9fa4622-8d09-41cf-ab03-670716694959	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.292	ACTIVE	\N	2026-09-13 20:44:57.292	2026-09-13 20:44:57.292
2ad4e9d1-b732-4bb7-bbea-4b36f177e14c	4414e7fe-ea83-4c41-86c3-94177ba8f89d	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.295	ACTIVE	\N	2026-09-13 20:44:57.295	2026-09-13 20:44:57.295
9d49952b-5883-47ed-8322-84a2ed45b43f	cb0f60a9-3b9c-498e-97db-0e8774c236fb	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.296	ACTIVE	\N	2026-09-13 20:44:57.296	2026-09-13 20:44:57.296
1169159f-8660-47ea-a536-a9653cd71490	ad3ceea3-b4f4-45e2-8749-96bd430cee65	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.297	ACTIVE	\N	2026-09-13 20:44:57.297	2026-09-13 20:44:57.297
72cf4d05-ed13-44fb-865f-d05aedff4b4c	acffbec7-d8f8-48b9-9bf9-57202ecb3c19	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.299	ACTIVE	\N	2026-09-13 20:44:57.299	2026-09-13 20:44:57.299
271b8f1e-9af2-4a45-842c-14fcc6c04301	f1e97255-5f3b-47bf-9789-7e8f5583da8d	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.3	ACTIVE	\N	2026-09-13 20:44:57.3	2026-09-13 20:44:57.3
57065132-7645-4b4e-a6f0-867c1692624a	ad14c99f-fdec-4640-8dbb-bef039be0503	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.301	ACTIVE	\N	2026-09-13 20:44:57.301	2026-09-13 20:44:57.301
44bcfd1d-f7f0-4ae1-8adc-2179ad7d3d18	4b3d4ad2-b3e0-4c6d-8602-9393c8cc88e7	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.303	ACTIVE	\N	2026-09-13 20:44:57.303	2026-09-13 20:44:57.303
a867771d-54dc-4292-b343-e5a6e024ab4e	5bf50b63-be5f-4ebc-a117-fa3b1ce03ab7	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.304	ACTIVE	\N	2026-09-13 20:44:57.304	2026-09-13 20:44:57.304
0c8a1b83-eaa6-4653-aa25-c52af9df9d85	79ee9515-87e1-4971-bd24-a327ffcc84d8	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.305	ACTIVE	\N	2026-09-13 20:44:57.305	2026-09-13 20:44:57.305
0879332f-9820-4b33-888b-062147a807b8	1a516bf2-1621-484f-aaa5-ca1c95cf6647	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.307	ACTIVE	\N	2026-09-13 20:44:57.307	2026-09-13 20:44:57.307
45e68c4b-3736-4d72-bdd7-4cd301ff8dc9	658b7858-2d9a-4880-8251-16dc76f1201e	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.308	ACTIVE	\N	2026-09-13 20:44:57.308	2026-09-13 20:44:57.308
fe1840de-b2c1-4136-9829-ca7ba156e533	7d86bf29-e8f9-4280-9cee-950ed9ab895e	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.31	ACTIVE	\N	2026-09-13 20:44:57.31	2026-09-13 20:44:57.31
1749004f-cfff-46f2-a922-fc76dfc30b98	0cb1efe7-ceea-4cc1-85f5-24d7c0c8baf7	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.312	ACTIVE	\N	2026-09-13 20:44:57.312	2026-09-13 20:44:57.312
00cfeb57-8b6b-4e5b-96da-8169a986f109	041eda94-7e8d-41f1-ae5f-d959e6a65287	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.313	ACTIVE	\N	2026-09-13 20:44:57.313	2026-09-13 20:44:57.313
68c1ab03-1bb1-4142-8a3d-88d8c433eb55	d4470620-e4b4-4105-8d66-761982aea07b	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.315	ACTIVE	\N	2026-09-13 20:44:57.315	2026-09-13 20:44:57.315
0a75a95a-c76d-404f-b6f1-ca699630ff2e	ec25b06d-e445-4c42-a8af-3a556ed1647b	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.316	ACTIVE	\N	2026-09-13 20:44:57.316	2026-09-13 20:44:57.316
72aa17ab-138f-4bc7-8ab5-7fc1e88ed72c	8eb01c14-c4dc-473b-81d1-cdbdfd652270	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.317	ACTIVE	\N	2026-09-13 20:44:57.317	2026-09-13 20:44:57.317
29e60312-3b26-4587-8554-44c45c37fdfa	a4a10ad9-db76-4d1c-8876-0cd09cf18ac9	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.319	ACTIVE	\N	2026-09-13 20:44:57.319	2026-09-13 20:44:57.319
ac955b1a-c0f0-47ef-bd18-d5da52d714d7	ce0b4ebe-ae73-41dc-bbf2-f9d3e55238d9	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.32	ACTIVE	\N	2026-09-13 20:44:57.32	2026-09-13 20:44:57.32
ba255116-75aa-4791-9cbf-735c1c0f9c47	8a522cab-6946-4511-8359-d84aa47a721a	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.322	ACTIVE	\N	2026-09-13 20:44:57.322	2026-09-13 20:44:57.322
fb86604b-f94d-4e9c-9778-d1be4667c33b	dbd0e1ef-b3b8-4e38-8b65-1953d6811578	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.324	ACTIVE	\N	2026-09-13 20:44:57.324	2026-09-13 20:44:57.324
0b41b8c3-3dcc-4576-bff8-860c59eae420	b47c0541-61c5-43ee-8080-41e28a68509f	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.326	ACTIVE	\N	2026-09-13 20:44:57.326	2026-09-13 20:44:57.326
8e8f5f08-f361-4f4a-a3bd-51d474583232	e66ef1e7-e34d-415c-a694-892ffe6bb92d	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.328	ACTIVE	\N	2026-09-13 20:44:57.328	2026-09-13 20:44:57.328
7abed14e-4a25-4d3b-a021-594bd3708538	0998d38f-d612-442f-843c-6e9f12a0b0eb	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.33	ACTIVE	\N	2026-09-13 20:44:57.33	2026-09-13 20:44:57.33
1ab2e4fb-4898-4b1f-8912-f4a6f100ffaa	34a7291e-c16a-4a8f-8044-6ac54830cef0	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.331	ACTIVE	\N	2026-09-13 20:44:57.331	2026-09-13 20:44:57.331
43f4424d-92f8-4277-9c6d-6b37eb6cfe8a	67b75e9f-50d6-4d79-a2e6-e87a7a3baaf4	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.333	ACTIVE	\N	2026-09-13 20:44:57.333	2026-09-13 20:44:57.333
fc5d00ff-8acb-4297-ae1c-60eed2f6db1d	cca1dad3-1879-4a83-814e-8f28e74db969	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.334	ACTIVE	\N	2026-09-13 20:44:57.334	2026-09-13 20:44:57.334
d89daa0b-2137-4c17-be90-b647b4791cad	1751a186-565b-423e-a34f-5d05109e6ecb	4b66355c-da73-48da-83c0-717e1d796284	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.336	ACTIVE	\N	2026-09-13 20:44:57.336	2026-09-13 20:44:57.336
7d045444-e2d7-4859-a434-eae3cf6c0696	2802b8cb-a51b-42e7-89b6-02220a26aa86	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.337	ACTIVE	\N	2026-09-13 20:44:57.337	2026-09-13 20:44:57.337
15c4db39-0065-4894-99c6-05cb02b5c1c7	996ac263-a46f-4a5b-a6fd-d777434084cb	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.339	ACTIVE	\N	2026-09-13 20:44:57.339	2026-09-13 20:44:57.339
f9d8eeca-069e-4d6d-8f85-4261bcd12e08	e3ca141c-1890-4050-b30b-9c8e67034c24	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.34	ACTIVE	\N	2026-09-13 20:44:57.34	2026-09-13 20:44:57.34
5419ca4a-dfe4-4ee2-a7b3-7d3e2208d11f	f0f50069-1f3b-4da6-a850-d9159a4b58b4	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.341	ACTIVE	\N	2026-09-13 20:44:57.341	2026-09-13 20:44:57.341
5f0c4d53-25e5-499f-b1d9-ec6c3e9470ae	c264ffe0-dbad-4012-804e-ad4702de5c4d	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.344	ACTIVE	\N	2026-09-13 20:44:57.344	2026-09-13 20:44:57.344
8d0a9321-3857-42eb-b0d7-49556d9da26a	07bbb38d-7f4b-42b1-b315-3ed18b38068d	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.345	ACTIVE	\N	2026-09-13 20:44:57.345	2026-09-13 20:44:57.345
8b338818-89cf-4a9c-9039-8c287be3fd4f	a5640f38-cfab-40a6-901c-e1df2f445071	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.347	ACTIVE	\N	2026-09-13 20:44:57.347	2026-09-13 20:44:57.347
8705223e-de1d-4a22-bcc3-6424a8ed9eb0	24a702b9-02ea-4a13-9c93-f9a93535230d	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.348	ACTIVE	\N	2026-09-13 20:44:57.348	2026-09-13 20:44:57.348
80130090-74f5-48df-9c46-96d1b7c8a37b	eb6b9615-6d80-4615-8d24-8d545973f13c	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.35	ACTIVE	\N	2026-09-13 20:44:57.35	2026-09-13 20:44:57.35
8df6b719-3a05-4829-a19e-cea9d4623860	b530b9b4-2090-4a16-b8bb-9cf9bb6a620e	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.351	ACTIVE	\N	2026-09-13 20:44:57.351	2026-09-13 20:44:57.351
84bb59f5-1962-4e19-a785-4cf421d17797	d635da53-5843-45ee-a6b8-bddc4c33006e	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.353	ACTIVE	\N	2026-09-13 20:44:57.353	2026-09-13 20:44:57.353
393b9d19-56af-4146-936d-af1c784e0709	b8710f09-5382-437d-a334-b7c4c5a6d9a0	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.354	ACTIVE	\N	2026-09-13 20:44:57.354	2026-09-13 20:44:57.354
af47ee24-36ff-4eb2-8633-ec3056bd6892	007bd16a-b0f2-4fbf-abc2-f4bc3569a8e4	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.356	ACTIVE	\N	2026-09-13 20:44:57.356	2026-09-13 20:44:57.356
83e1f650-f347-4d6f-b465-ff845fad6ca0	19b131a2-216e-4660-a850-afc9698a4099	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.357	ACTIVE	\N	2026-09-13 20:44:57.357	2026-09-13 20:44:57.357
703ca888-4076-4616-902f-2adc1ac6a4b9	49113de2-56a8-4afc-bf4f-dcdd46e8ea07	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.359	ACTIVE	\N	2026-09-13 20:44:57.359	2026-09-13 20:44:57.359
b186ed38-3df2-40fa-9d20-e10c57c79138	cccc8e36-9473-41c6-ad79-a212f64b74c6	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.361	ACTIVE	\N	2026-09-13 20:44:57.361	2026-09-13 20:44:57.361
72d0a88f-8ae4-40f3-bbeb-1f10312fd8c0	ac482c4b-2016-4b0b-ba4d-c8131c4dbbb8	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.363	ACTIVE	\N	2026-09-13 20:44:57.363	2026-09-13 20:44:57.363
4e40978d-7138-48af-9577-0f8b719b015e	824fa6b3-71f3-4d12-a47d-a69fbc73c909	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.364	ACTIVE	\N	2026-09-13 20:44:57.364	2026-09-13 20:44:57.364
5378d72e-63a8-4ce9-b383-809d3e3390df	2846b9ae-3c06-443b-abf6-4a0685ef1c10	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.365	ACTIVE	\N	2026-09-13 20:44:57.365	2026-09-13 20:44:57.365
7b432d86-df59-461a-99c7-9888bb4b349a	a1aa8ff2-3ce6-40b7-8933-53954a16d83a	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.367	ACTIVE	\N	2026-09-13 20:44:57.367	2026-09-13 20:44:57.367
c11ee638-2d19-43cd-88c9-10f4cb6d22af	6ffaccaa-0058-437b-9821-5fa106af3b23	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.368	ACTIVE	\N	2026-09-13 20:44:57.368	2026-09-13 20:44:57.368
f45ddaa1-b62c-4dde-b243-0869701006e0	bcda57c2-87b1-4090-b013-88898a1c7b81	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.37	ACTIVE	\N	2026-09-13 20:44:57.37	2026-09-13 20:44:57.37
802b0dc0-aabb-4f5f-bade-9ee46ead621a	a92c642d-a82c-4061-9c07-26d78946f2aa	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.371	ACTIVE	\N	2026-09-13 20:44:57.371	2026-09-13 20:44:57.371
a217b778-6909-4007-b070-3795acf2e46c	03c69a48-a4cb-4dca-861f-556a5f6f93d0	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.372	ACTIVE	\N	2026-09-13 20:44:57.372	2026-09-13 20:44:57.372
6447cf85-777a-4114-a65f-6d3f6087cc62	d63e7422-764d-491a-80cd-020db25e0838	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.374	ACTIVE	\N	2026-09-13 20:44:57.374	2026-09-13 20:44:57.374
27163fda-23ed-42e2-a2c9-631bb3c8fb8a	fb29ac55-04e1-47b1-91bc-da2d30aa4a24	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.376	ACTIVE	\N	2026-09-13 20:44:57.376	2026-09-13 20:44:57.376
306dbb2f-1816-40a4-af74-8567911b4200	03a02aa1-53b9-43cd-8035-7f371dfe8e6f	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.378	ACTIVE	\N	2026-09-13 20:44:57.378	2026-09-13 20:44:57.378
dbe052aa-be55-4820-a836-3814eda7f7f2	0e3541d6-c08a-41bb-8b73-55e0750606f3	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.379	ACTIVE	\N	2026-09-13 20:44:57.379	2026-09-13 20:44:57.379
08cb72e8-0bff-4723-9927-e400b90f6c3b	235129e6-dc30-47e6-bd50-36eed17805a6	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.381	ACTIVE	\N	2026-09-13 20:44:57.381	2026-09-13 20:44:57.381
b7c4b46a-922a-49df-a6d4-9d72ab21f177	e6dbed86-b4c1-4c02-8e14-edae6c4fd29a	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.382	ACTIVE	\N	2026-09-13 20:44:57.382	2026-09-13 20:44:57.382
f5993ed2-72d3-4beb-8bc5-fc7503a24140	ca03d57a-ded5-4276-a4e0-c2c36e4150f7	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.384	ACTIVE	\N	2026-09-13 20:44:57.384	2026-09-13 20:44:57.384
220bc5e4-06ec-4d12-9d86-471740183073	7af56852-0774-47b7-bfa4-160acfd63578	266bfbc9-a4cd-4754-b1c4-252a3661bb37	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.385	ACTIVE	\N	2026-09-13 20:44:57.385	2026-09-13 20:44:57.385
74dd360d-c134-4c55-bceb-fc566ddda876	ca2f45d9-2a9a-4775-8cbe-d53aa9db9c63	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.386	ACTIVE	\N	2026-09-13 20:44:57.386	2026-09-13 20:44:57.386
2aa31250-a55b-43d5-add6-850cf6d0e143	a8924d03-fbdb-49be-aabe-a600993ca271	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.388	ACTIVE	\N	2026-09-13 20:44:57.388	2026-09-13 20:44:57.388
a5b0b200-f3b5-405b-b495-35d50f1ad280	c4aa1d7b-f8da-4d17-94ba-1a6a165f3d5d	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.389	ACTIVE	\N	2026-09-13 20:44:57.389	2026-09-13 20:44:57.389
c30099e7-4156-4e2b-bb7c-59e99bef61af	86dfd43b-1d9b-4a2b-a512-eeb33e5a8f04	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.39	ACTIVE	\N	2026-09-13 20:44:57.39	2026-09-13 20:44:57.39
85b3b4a4-b87a-4049-8741-2d80a15d3a94	5bb58c9d-a0d5-477c-a420-2526769be2d1	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.393	ACTIVE	\N	2026-09-13 20:44:57.393	2026-09-13 20:44:57.393
a275c8c1-2e42-4d4c-a35a-2773d1b6809d	6958b5fe-2f4a-4e80-8dce-8cd209a1389f	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.395	ACTIVE	\N	2026-09-13 20:44:57.395	2026-09-13 20:44:57.395
203a277f-7f82-4708-96fa-cd3c1441c0e8	7093a512-72cb-472c-8c92-79cbdd9b903f	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.396	ACTIVE	\N	2026-09-13 20:44:57.396	2026-09-13 20:44:57.396
b72338be-10ca-4ce3-a60b-7a2673a0f16d	9260b51b-545f-4443-8a44-756082453b1a	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.398	ACTIVE	\N	2026-09-13 20:44:57.398	2026-09-13 20:44:57.398
415583ef-2473-44a7-8aac-4b687c59166b	05ab5d2d-f659-45c3-b6bf-893fe653a752	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.4	ACTIVE	\N	2026-09-13 20:44:57.4	2026-09-13 20:44:57.4
ccce1263-8727-4e49-a8f7-90bd52e54d3a	fddbf028-5b34-46f4-b2b4-4562fc9055a6	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.401	ACTIVE	\N	2026-09-13 20:44:57.401	2026-09-13 20:44:57.401
d9dd53e0-6fca-4e93-b7aa-82ece716fa57	c8b23479-ebdc-4a8c-82cd-f099fc57dd9c	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.403	ACTIVE	\N	2026-09-13 20:44:57.403	2026-09-13 20:44:57.403
c94a0dec-bef7-49fa-a9c0-05e898453cb2	531a9951-03ab-495e-acae-774dc95a906e	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.404	ACTIVE	\N	2026-09-13 20:44:57.404	2026-09-13 20:44:57.404
4c26d1c7-1a48-4805-8693-89c31455d871	52b9c7d5-d184-4a94-866e-687b10a8a514	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.405	ACTIVE	\N	2026-09-13 20:44:57.405	2026-09-13 20:44:57.405
f0e5171b-c94a-44c3-a701-af0682e1664a	5560ba9c-7043-43c1-95a7-2bed89dbf94f	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.407	ACTIVE	\N	2026-09-13 20:44:57.407	2026-09-13 20:44:57.407
31431ca0-e63f-4773-8fd7-27c6b2b65d66	cb23ce9d-236d-46f3-a359-18938909b19e	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.408	ACTIVE	\N	2026-09-13 20:44:57.408	2026-09-13 20:44:57.408
579acea2-d083-49eb-9c68-4576e64c443c	b4725fa6-bbd2-4e47-9aaa-5d4584472acd	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.411	ACTIVE	\N	2026-09-13 20:44:57.411	2026-09-13 20:44:57.411
8d9adbf0-1576-4a53-89aa-9dff3932ac35	ff646027-349d-4191-81ad-52c80eac9cad	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.412	ACTIVE	\N	2026-09-13 20:44:57.412	2026-09-13 20:44:57.412
784047ad-4712-46e1-af65-8ccd59c90cb6	3c47a01a-87ed-4572-9eb3-927109f3b083	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.414	ACTIVE	\N	2026-09-13 20:44:57.414	2026-09-13 20:44:57.414
04984d0d-c19d-46a9-a6fc-88e95c9e4a31	c25ee0a2-b4d3-4754-a91d-9b28aeea917b	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.415	ACTIVE	\N	2026-09-13 20:44:57.415	2026-09-13 20:44:57.415
17d06e21-019c-4513-a470-578fa20957f4	1fb3b622-858e-46e2-959b-6fa1f0e52032	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.417	ACTIVE	\N	2026-09-13 20:44:57.417	2026-09-13 20:44:57.417
048b864e-da02-491b-88c1-663b80ca948a	e4f6e04d-e7e8-4f4a-9105-29d5c1925f0c	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.418	ACTIVE	\N	2026-09-13 20:44:57.418	2026-09-13 20:44:57.418
a0fbf206-f32c-4c6f-b15d-9cb2fb146340	0e04e726-3a01-458c-baac-de4a2809ba14	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.42	ACTIVE	\N	2026-09-13 20:44:57.42	2026-09-13 20:44:57.42
9f304106-8d50-4c3a-9e03-ed651c1e6e11	ea77e9c0-b251-4d32-a66b-28fee41e26c3	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.421	ACTIVE	\N	2026-09-13 20:44:57.421	2026-09-13 20:44:57.421
4b1a7cd0-44b8-4969-b149-d343ebf62f3e	a02b88d7-c23d-4487-ba8f-8e9a6f64a156	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.422	ACTIVE	\N	2026-09-13 20:44:57.422	2026-09-13 20:44:57.422
61dbe511-5e12-454d-a85a-577097b72634	d07338c5-1658-4907-b2d3-37b0250e35e2	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.424	ACTIVE	\N	2026-09-13 20:44:57.424	2026-09-13 20:44:57.424
67dcdd8e-b256-4181-a369-5948ef2c0353	3f4e953b-e3b8-4ed6-a65f-9057069ec845	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.426	ACTIVE	\N	2026-09-13 20:44:57.426	2026-09-13 20:44:57.426
374fa581-88e5-45a9-b188-bb57debc80f7	a8e2a42a-1e12-44bf-a801-104c40a5b9b7	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.428	ACTIVE	\N	2026-09-13 20:44:57.428	2026-09-13 20:44:57.428
599fc6e0-74b9-42c7-b638-df5c5074d5c7	dd8e1925-cf0b-4983-bddd-95ca33b05232	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.429	ACTIVE	\N	2026-09-13 20:44:57.429	2026-09-13 20:44:57.429
70095f44-1ded-4e75-b62a-079e549cf07d	adc94853-dcbc-44a3-8a3a-085ecdd51a7b	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.431	ACTIVE	\N	2026-09-13 20:44:57.431	2026-09-13 20:44:57.431
10399632-2733-440a-9f68-3523baf7c7fb	5b1fb2a8-b0c7-4c13-8ab0-f23734def076	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.432	ACTIVE	\N	2026-09-13 20:44:57.432	2026-09-13 20:44:57.432
3a43da5b-c7fb-4ba1-a41f-fb3be1889452	340a3fda-5c38-48c5-b6ef-65085df5f65d	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.434	ACTIVE	\N	2026-09-13 20:44:57.434	2026-09-13 20:44:57.434
31b266cd-08d8-4355-b874-616040faca21	04a15712-f950-417b-816f-9a1813423b2e	1a959f08-c027-4c1f-ba04-fe5b472ebfb4	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.435	ACTIVE	\N	2026-09-13 20:44:57.435	2026-09-13 20:44:57.435
7963d6fe-aba0-42b4-b860-b36bd94f9207	3d4add20-0970-479a-8410-4ddaa6b6ee76	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.436	ACTIVE	\N	2026-09-13 20:44:57.436	2026-09-13 20:44:57.436
cf76b288-0960-4a24-95d6-0eaa795b85d8	3030d67d-2e2f-461e-a809-76d576862266	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.437	ACTIVE	\N	2026-09-13 20:44:57.437	2026-09-13 20:44:57.437
c1ce214f-5b3d-477f-bd80-76e0cbcee4c9	42d9c436-0120-4fcf-8914-870a671b5f0b	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.439	ACTIVE	\N	2026-09-13 20:44:57.439	2026-09-13 20:44:57.439
f0355c5c-cc40-4295-8029-68a34fb18ddc	c5221b24-8175-4080-890e-3b8e6bb5a656	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.44	ACTIVE	\N	2026-09-13 20:44:57.44	2026-09-13 20:44:57.44
22b618e7-d70a-44fd-a1ea-9ab130602f88	ab84ea37-7028-48a8-b953-669582e44081	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.442	ACTIVE	\N	2026-09-13 20:44:57.442	2026-09-13 20:44:57.442
dcdb8c8e-a514-47f6-a480-0bb27efe23ab	0c9a33e7-3046-40a8-81db-d4e2797b1e79	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.444	ACTIVE	\N	2026-09-13 20:44:57.444	2026-09-13 20:44:57.444
aaa7ab29-72e0-49b9-bc31-9359cbecd854	b03f074c-fd73-46a6-9c93-78283202622b	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.445	ACTIVE	\N	2026-09-13 20:44:57.445	2026-09-13 20:44:57.445
d22079c3-364e-4f3c-ae05-ac51db363655	e969f398-4570-4b0a-bcbb-cb842d5e6488	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.447	ACTIVE	\N	2026-09-13 20:44:57.447	2026-09-13 20:44:57.447
bd523c11-1a0b-443f-aced-cc5244b48ec3	dd7914a0-2909-4a28-ab8d-aa00480ad180	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.448	ACTIVE	\N	2026-09-13 20:44:57.448	2026-09-13 20:44:57.448
c00e0ea6-4d38-4640-a899-aaf54d725be5	70d1dc11-5b10-46df-9a95-1cb703440628	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.45	ACTIVE	\N	2026-09-13 20:44:57.45	2026-09-13 20:44:57.45
02537522-980f-483a-af47-1fc64c87294b	dd50103a-8c5e-4b7b-9c30-6d0dca5b9133	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.451	ACTIVE	\N	2026-09-13 20:44:57.451	2026-09-13 20:44:57.451
e1aeec82-3aab-4a90-acb6-a0005cd54db0	bb428375-ccbd-4e89-8ce9-f7b38efff032	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.452	ACTIVE	\N	2026-09-13 20:44:57.452	2026-09-13 20:44:57.452
7d547496-6252-4035-8b19-f862ebf70fc1	59b5063a-978f-4412-8792-2d6875599704	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.454	ACTIVE	\N	2026-09-13 20:44:57.454	2026-09-13 20:44:57.454
cf147d30-3315-444b-8506-0ac7a3d8cefc	fcca9d98-8aa3-4191-a9b7-928a37e93df2	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.455	ACTIVE	\N	2026-09-13 20:44:57.455	2026-09-13 20:44:57.455
d24d05ae-6299-423e-825b-4ab223fa8886	db4a74f7-2d2a-466f-890f-13fef56b5b2b	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.457	ACTIVE	\N	2026-09-13 20:44:57.457	2026-09-13 20:44:57.457
f5c534b9-950f-47db-9b2a-9cfb307790e4	79846a0d-b660-4d21-b81b-0f02822a47e6	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.46	ACTIVE	\N	2026-09-13 20:44:57.46	2026-09-13 20:44:57.46
4fb4366b-8f1d-43c1-a211-0e0e8e697409	e03357f0-abd6-4ec5-adee-0d878c052be6	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.462	ACTIVE	\N	2026-09-13 20:44:57.462	2026-09-13 20:44:57.462
79c09aee-ac3c-43cb-aca7-f8801dcfe77b	d8d0aa6a-f3c1-45f5-b0c4-6ecd141f169f	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.463	ACTIVE	\N	2026-09-13 20:44:57.463	2026-09-13 20:44:57.463
46b23896-8381-4fec-a844-1198b87e3430	f6d8e28c-47da-4c5c-9fa9-1e6730eb9add	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.466	ACTIVE	\N	2026-09-13 20:44:57.466	2026-09-13 20:44:57.466
c1493715-9a34-4d27-ad8f-94e7b36afe14	b86617ba-b078-4fce-9fc0-75ed0b961bc9	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.467	ACTIVE	\N	2026-09-13 20:44:57.467	2026-09-13 20:44:57.467
1d8d239d-d02c-41ff-b378-18f7c29c1937	6250b5d4-b93b-493c-aab9-c369621d6d8d	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.469	ACTIVE	\N	2026-09-13 20:44:57.469	2026-09-13 20:44:57.469
9c0d899d-6475-45f7-a23a-bfdfde162a7e	f94be951-0abb-4b14-9515-a1e2dc7e5948	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.471	ACTIVE	\N	2026-09-13 20:44:57.471	2026-09-13 20:44:57.471
54becf3c-854b-42b6-b863-7f1632ef45b7	da5e8ebb-457e-44d7-b308-34cda614e8a2	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.473	ACTIVE	\N	2026-09-13 20:44:57.473	2026-09-13 20:44:57.473
45d29fe0-bfec-4ee2-befb-2e856b0bbd54	971b97f8-8c73-4110-a51f-5a6da2aea706	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.475	ACTIVE	\N	2026-09-13 20:44:57.475	2026-09-13 20:44:57.475
ca8282cb-fc61-450c-bcfd-71f8a6a5bfb5	ba35d5ea-43a2-4609-b27a-5df84e76e047	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.479	ACTIVE	\N	2026-09-13 20:44:57.479	2026-09-13 20:44:57.479
08325a51-22c8-48b8-adfa-cd6d5ca116c9	d4c86102-d29c-4303-8866-44adc91cc97d	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.481	ACTIVE	\N	2026-09-13 20:44:57.481	2026-09-13 20:44:57.481
e1272a36-400f-4f40-bfa2-f703473d45c8	f2468a97-f6e3-4919-9bdf-b9b57bf2ad6b	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.483	ACTIVE	\N	2026-09-13 20:44:57.483	2026-09-13 20:44:57.483
810a7ae3-34ee-41b7-9e61-789ed06cd0e6	598ca0cf-2add-4bb1-87b8-be970c7a94b0	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.485	ACTIVE	\N	2026-09-13 20:44:57.485	2026-09-13 20:44:57.485
050d4f24-02b5-4f77-8847-0e3e1cd1d21c	e1476052-109c-4fa2-8ab8-20f707b549ae	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.488	ACTIVE	\N	2026-09-13 20:44:57.488	2026-09-13 20:44:57.488
8a952026-d6fa-479b-8b62-442ed9c91962	1e9d7f8b-2fe9-4d43-b03e-1bc250c54f32	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.491	ACTIVE	\N	2026-09-13 20:44:57.491	2026-09-13 20:44:57.491
ecb6e0fd-8e8e-48d7-a5f4-6ee8bbbb790d	688358cd-5b43-44ff-8386-6305f07177c6	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.495	ACTIVE	\N	2026-09-13 20:44:57.495	2026-09-13 20:44:57.495
4634aced-06f1-415a-b536-4793bd2a6421	d5c4752f-ebfb-4ce0-8ad5-6c3295816027	8b0a3aa7-0e5e-40ec-8501-1508e674519e	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.497	ACTIVE	\N	2026-09-13 20:44:57.497	2026-09-13 20:44:57.497
847f362b-dcee-4a36-b0e0-6e4efe1934f6	1d749c4a-9c6e-4189-ac19-083fe358640d	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.498	ACTIVE	\N	2026-09-13 20:44:57.498	2026-09-13 20:44:57.498
8f187c60-2497-4baf-a38e-4c8f9fd2e9e0	e2e4f8ce-6db2-4af6-af19-f6ea2e124a24	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.5	ACTIVE	\N	2026-09-13 20:44:57.5	2026-09-13 20:44:57.5
0f562bd6-310d-4666-99bf-08d491b573ca	655276c5-e99a-483d-9f61-5413146758a0	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.501	ACTIVE	\N	2026-09-13 20:44:57.501	2026-09-13 20:44:57.501
927bf5d8-ec0c-4211-846c-994a47b1f4f2	d65288d5-ed5d-4882-979b-c6f03e39e80b	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.503	ACTIVE	\N	2026-09-13 20:44:57.503	2026-09-13 20:44:57.503
e72f2f75-1753-4097-83e2-2023cfe2c40b	3474426e-9691-4b5e-9424-49547c792113	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.504	ACTIVE	\N	2026-09-13 20:44:57.504	2026-09-13 20:44:57.504
c700a471-5bb5-42b2-a38a-530fb71e3e41	a92ee2bb-bca4-411f-b1d3-0c605f430989	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.506	ACTIVE	\N	2026-09-13 20:44:57.506	2026-09-13 20:44:57.506
bf38b02b-2dec-422a-b261-56766ac5bd43	7536942c-1666-4293-b896-8423d92ce3c3	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.507	ACTIVE	\N	2026-09-13 20:44:57.507	2026-09-13 20:44:57.507
ef089b05-2305-4b02-83e0-f859ca86322a	b4412550-16be-466f-bcf2-ecebda0de850	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.509	ACTIVE	\N	2026-09-13 20:44:57.509	2026-09-13 20:44:57.509
41123e28-f2ec-4ec6-975b-2ee8fe8cc132	db8fb97e-fd05-4948-a4ee-c0102ea13831	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.511	ACTIVE	\N	2026-09-13 20:44:57.511	2026-09-13 20:44:57.511
aedbaa02-fd27-440b-a94a-0f6f90e26e3f	8ba96824-94f9-4ebb-b5b3-04dd31f3c828	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.512	ACTIVE	\N	2026-09-13 20:44:57.512	2026-09-13 20:44:57.512
aff197e8-c414-4f20-a188-d7fe4e45fa75	89cf7cc1-0b3a-4d41-b6ec-ea912c505ac4	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.514	ACTIVE	\N	2026-09-13 20:44:57.514	2026-09-13 20:44:57.514
99cf8805-6a6f-4a91-b51d-3dea459a17a3	ea832579-ea25-4fd3-8406-a361de6edd24	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.515	ACTIVE	\N	2026-09-13 20:44:57.515	2026-09-13 20:44:57.515
11f58c42-2f43-457d-a37d-d6326c43bdef	2e7fadca-358d-4518-9a97-1854feba9498	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.517	ACTIVE	\N	2026-09-13 20:44:57.517	2026-09-13 20:44:57.517
a0f874d1-80fd-44bd-90f2-9726a6a2075e	67c997b0-49d0-4feb-a99f-94bd3e67d50b	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.519	ACTIVE	\N	2026-09-13 20:44:57.519	2026-09-13 20:44:57.519
c22c71a6-6287-4f95-85b9-5a68eca124f4	37269b9c-c508-4b30-8856-4cc7d9b64444	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.52	ACTIVE	\N	2026-09-13 20:44:57.52	2026-09-13 20:44:57.52
fe261f29-c4f0-486b-ae10-29fa1ec3acfe	856a0f8a-dac9-491a-bb1a-61932516369c	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.521	ACTIVE	\N	2026-09-13 20:44:57.521	2026-09-13 20:44:57.521
c5365dd6-58ae-47da-a352-2f0d9a345310	70972e3a-a3de-4360-83c8-89a1e22c8f47	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.523	ACTIVE	\N	2026-09-13 20:44:57.523	2026-09-13 20:44:57.523
cf5a1895-5ad9-41c8-90c8-95dbde869b1f	af18df35-b3b0-4de1-aa9d-4c7e7d816331	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.524	ACTIVE	\N	2026-09-13 20:44:57.524	2026-09-13 20:44:57.524
2c73f411-421b-4121-8356-ae8e3e9abddd	f6262aaa-9b29-4739-a624-2f97617e064c	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.527	ACTIVE	\N	2026-09-13 20:44:57.527	2026-09-13 20:44:57.527
d9d6f38f-eebc-4679-9058-cc2e79498af3	29d28078-e17a-4a82-813b-64a337b55990	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.528	ACTIVE	\N	2026-09-13 20:44:57.528	2026-09-13 20:44:57.528
4a3456bc-4b71-4a8d-9739-61ec6c8fc74c	eba9ae24-e495-4541-8271-d2ee00b3736f	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.53	ACTIVE	\N	2026-09-13 20:44:57.53	2026-09-13 20:44:57.53
7a71106c-ff6b-4342-a08d-76b807e8b3b0	fff968d3-e1a8-45e3-80a4-940fcce33cbe	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.531	ACTIVE	\N	2026-09-13 20:44:57.531	2026-09-13 20:44:57.531
7e5d183d-7e41-4fac-9430-b85b2a30e439	5668e48a-bc8b-442c-b55c-0c2d6d1f653f	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.533	ACTIVE	\N	2026-09-13 20:44:57.533	2026-09-13 20:44:57.533
93d4847d-5d0b-4d98-a6c9-ce6f37a7ecc1	588e094a-f6ce-4d7d-b732-5e2e41027255	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.534	ACTIVE	\N	2026-09-13 20:44:57.534	2026-09-13 20:44:57.534
69a9dbc0-3e99-4a47-8ade-922462c66ba1	1e619ea7-f590-43d7-ba25-ad416b8caf8a	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.536	ACTIVE	\N	2026-09-13 20:44:57.536	2026-09-13 20:44:57.536
64c2e1c2-334a-4fda-9ff4-04e7c6037e8b	cc35ed2f-970c-4971-9ab2-42cbec1ef023	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.537	ACTIVE	\N	2026-09-13 20:44:57.537	2026-09-13 20:44:57.537
735bc4da-ebaf-43c5-85a4-b7191cb926c8	acd583db-dc5d-47fc-9569-fdc45ae1bc58	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.538	ACTIVE	\N	2026-09-13 20:44:57.538	2026-09-13 20:44:57.538
6c7b505f-0fee-44ee-b3c1-d48103e28b64	631d702c-31e3-4148-a252-dd5a3bda2014	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.54	ACTIVE	\N	2026-09-13 20:44:57.54	2026-09-13 20:44:57.54
aedde366-e647-40cf-a28b-a22de5f58e8e	791a1050-d1cd-4b0b-8b47-a37b79e269f8	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.541	ACTIVE	\N	2026-09-13 20:44:57.541	2026-09-13 20:44:57.541
02f87691-bb8e-49be-a4d9-d19406b43d75	63edb15c-f141-4a32-89be-25e7dc79330e	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.544	ACTIVE	\N	2026-09-13 20:44:57.544	2026-09-13 20:44:57.544
c5d6a8c1-5700-47ba-8349-ab4b99e7ebd6	5dae6e29-b169-4c39-b04a-d8d9c460e4e2	50c6da01-38aa-4988-a864-e2a0ccf69360	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.545	ACTIVE	\N	2026-09-13 20:44:57.545	2026-09-13 20:44:57.545
a49f2200-82c3-41b9-b694-f0ef73da9b67	332d9aaf-f0f9-4a52-80bb-a13d28d104f2	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.547	ACTIVE	\N	2026-09-13 20:44:57.547	2026-09-13 20:44:57.547
181a24be-153c-4b24-8e51-e2145a9a2e56	bcfe0b8f-0725-4482-8841-ca1dad9c978b	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.548	ACTIVE	\N	2026-09-13 20:44:57.548	2026-09-13 20:44:57.548
8d0c89f2-2a9b-437b-b9fe-ba22c42d3caa	2f5978b3-1568-439f-9aa5-2cded8847405	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.549	ACTIVE	\N	2026-09-13 20:44:57.549	2026-09-13 20:44:57.549
d646906a-6ce8-47ae-8a92-7024fb331bd8	19b14625-dec2-4ba1-86fb-d555a7641355	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.551	ACTIVE	\N	2026-09-13 20:44:57.551	2026-09-13 20:44:57.551
3ac89c6b-aece-4cd1-8c05-25f3df6ee68a	568be396-1559-4258-95fc-3ce7f565fc32	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.552	ACTIVE	\N	2026-09-13 20:44:57.552	2026-09-13 20:44:57.552
0c8363f9-b4ef-4386-8459-6b151028ee2d	3a504253-0c00-429f-b263-cd1fd990d67c	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.554	ACTIVE	\N	2026-09-13 20:44:57.554	2026-09-13 20:44:57.554
84f6d586-9a76-4cdb-9546-adc0543e6686	b3b56d32-fd55-42e4-b698-3c19dbe3b423	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.555	ACTIVE	\N	2026-09-13 20:44:57.555	2026-09-13 20:44:57.555
c1d9ca5d-81e8-49b4-9b99-d9e1abbf7309	f11b1844-11b6-461a-a355-a6bbfb2ea653	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.556	ACTIVE	\N	2026-09-13 20:44:57.556	2026-09-13 20:44:57.556
d29fc4ee-d566-4cc9-91f0-8cb461875ca9	231255f8-8c0f-4a55-965a-771d294e2fae	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.558	ACTIVE	\N	2026-09-13 20:44:57.558	2026-09-13 20:44:57.558
c2c8f7e6-5c42-4f43-87df-fa3e19efb01c	555c3991-92e6-45d5-a053-461476a53b0f	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.56	ACTIVE	\N	2026-09-13 20:44:57.56	2026-09-13 20:44:57.56
be7c08ba-edd8-4756-80de-3847715c1e36	099d7d50-faf6-4ff2-b327-e79b67ae07e4	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.562	ACTIVE	\N	2026-09-13 20:44:57.562	2026-09-13 20:44:57.562
046e6722-9f43-4756-9137-c784b0173dc3	10c2661f-56fb-46ba-a738-31a6ba6abea7	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.563	ACTIVE	\N	2026-09-13 20:44:57.563	2026-09-13 20:44:57.563
985c5e4b-02df-4c52-b7d2-65ce8719d4bc	29f54026-fc3a-463b-8901-4a293882338b	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.565	ACTIVE	\N	2026-09-13 20:44:57.565	2026-09-13 20:44:57.565
15a7742a-20a7-41ff-988e-0be6d73ee57f	234ead59-346d-442a-ad7e-cd1eda186fe4	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.566	ACTIVE	\N	2026-09-13 20:44:57.566	2026-09-13 20:44:57.566
0884ebec-3872-4bf5-a75c-bb30a35299f9	6210f0b6-04c8-4cce-aa19-c7598a109028	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.568	ACTIVE	\N	2026-09-13 20:44:57.568	2026-09-13 20:44:57.568
0d7284db-821c-411b-9010-133ee42e3510	36032e83-a946-40bf-83ec-e3ba7898da71	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.569	ACTIVE	\N	2026-09-13 20:44:57.569	2026-09-13 20:44:57.569
e90ee884-9aa1-4ae8-8ea1-a307dfa8bbe7	58a63b09-46b2-4591-9564-975a1e02be12	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.571	ACTIVE	\N	2026-09-13 20:44:57.571	2026-09-13 20:44:57.571
eb3f4842-5c24-4658-9fa7-9792c1f53427	d4a5f093-0326-48aa-8c59-5fc8550d2f97	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.572	ACTIVE	\N	2026-09-13 20:44:57.572	2026-09-13 20:44:57.572
ef6c1055-e3ca-4d83-aeb9-016b2bcaa54f	e246333b-3556-4119-8515-e19b8c9086db	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.574	ACTIVE	\N	2026-09-13 20:44:57.574	2026-09-13 20:44:57.574
34d6f03b-9c21-4abc-8f96-62d315a4302e	41dfa627-6549-4aac-89d5-902bb9fecf01	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.575	ACTIVE	\N	2026-09-13 20:44:57.575	2026-09-13 20:44:57.575
cc95b64b-9f82-4c81-8857-2e4034ba357d	78815367-2823-417b-ba31-9b954fa19d77	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.578	ACTIVE	\N	2026-09-13 20:44:57.578	2026-09-13 20:44:57.578
e259e1bc-98d6-44da-9a91-f5bd6d44ffd8	865315e4-49e3-4e5f-bffe-ee9ef54bab30	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.579	ACTIVE	\N	2026-09-13 20:44:57.579	2026-09-13 20:44:57.579
15f027e4-7002-4e81-89f7-2d7644b29c55	cb967836-97fa-4ea1-983b-08de8fa39ec4	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.581	ACTIVE	\N	2026-09-13 20:44:57.581	2026-09-13 20:44:57.581
424c320f-6666-4c23-9f00-6c76a1450dcd	831cf55a-ff46-41ba-9a6c-ed814dfeff73	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.582	ACTIVE	\N	2026-09-13 20:44:57.582	2026-09-13 20:44:57.582
9577d0d3-86e6-462b-a5b2-9f2c1e82152a	3cc2fe81-01be-487b-94f4-9d40fc7b6b23	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.583	ACTIVE	\N	2026-09-13 20:44:57.583	2026-09-13 20:44:57.583
f813f374-e836-48ca-bec7-8d106f9f5fae	8317129b-13fe-472c-b831-52ec67a73f89	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.585	ACTIVE	\N	2026-09-13 20:44:57.585	2026-09-13 20:44:57.585
d097c3cb-3755-4ac2-a32b-2ac1deff0afb	3899c9a3-daad-4271-a831-a42d86dea313	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.586	ACTIVE	\N	2026-09-13 20:44:57.586	2026-09-13 20:44:57.586
5b8798b0-e004-4973-ace2-5a1ce51ab402	54abe713-5ea6-409e-92bb-f582a7acaaed	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.587	ACTIVE	\N	2026-09-13 20:44:57.587	2026-09-13 20:44:57.587
0a1b1a4d-4cb9-4310-a27d-a5972d099ab8	3fdbcafc-956c-4436-bf39-19aef960b271	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.589	ACTIVE	\N	2026-09-13 20:44:57.589	2026-09-13 20:44:57.589
64044904-301b-4c04-b84b-ad75d0b67678	481e32b7-3a6d-4ffd-b4ec-fdcd0c48b6bd	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.59	ACTIVE	\N	2026-09-13 20:44:57.59	2026-09-13 20:44:57.59
3888b2b4-cf50-4f9e-9492-15ab3f625967	ea71259f-0381-4648-add0-6476bedac602	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.592	ACTIVE	\N	2026-09-13 20:44:57.592	2026-09-13 20:44:57.592
fdb8c0b7-e1fb-41b6-9547-15c35a7a78aa	83b4b079-782e-4d38-8551-d2f228721069	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.594	ACTIVE	\N	2026-09-13 20:44:57.594	2026-09-13 20:44:57.594
5f34d624-e941-4362-84b2-276f0cba0d4b	29d97043-6786-464a-82a2-29a56440f89b	ca4ffb8c-3192-446d-afa7-978f0cd7e059	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.596	ACTIVE	\N	2026-09-13 20:44:57.596	2026-09-13 20:44:57.596
352f6afc-1a0f-416c-a757-bf4510627792	48311ae6-ed22-4b29-9c70-2db95e6f60db	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.597	ACTIVE	\N	2026-09-13 20:44:57.597	2026-09-13 20:44:57.597
ebc11da8-0459-4a60-aafe-855e6ab85a31	1f7b3b02-9644-4ff0-8092-f1183d0d7a4c	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.598	ACTIVE	\N	2026-09-13 20:44:57.598	2026-09-13 20:44:57.598
a3133967-abfd-4ea3-94ae-41e09b61e73a	1190a124-f255-4fb6-a92e-390d37be2b6f	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.6	ACTIVE	\N	2026-09-13 20:44:57.6	2026-09-13 20:44:57.6
65aa5f15-4283-4157-b665-c35f1bf47b09	ecf5ec5e-2305-4871-a67c-bcf751f9cff6	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.601	ACTIVE	\N	2026-09-13 20:44:57.601	2026-09-13 20:44:57.601
6f83ef69-ba74-4917-8fdf-27514d3c124c	5a448581-d857-4949-9e8e-93b15ecce6cd	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.603	ACTIVE	\N	2026-09-13 20:44:57.603	2026-09-13 20:44:57.603
29fd6b5c-5601-4d62-93e1-5d29f5e87d58	8a3adffa-5350-4452-8aeb-7387a610bfa3	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.604	ACTIVE	\N	2026-09-13 20:44:57.604	2026-09-13 20:44:57.604
218f8b64-7633-42cc-b15d-73f52ac212bf	729a9aa0-096b-4709-8087-99b157f477bc	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.605	ACTIVE	\N	2026-09-13 20:44:57.605	2026-09-13 20:44:57.605
9f05c546-ccbe-4db4-88cf-b4d133115227	be46ebb4-e856-4abc-9d48-882e6f60d338	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.607	ACTIVE	\N	2026-09-13 20:44:57.607	2026-09-13 20:44:57.607
1b206e87-8a72-4596-aa72-88415af1217c	8fa1c263-76ab-4275-ae8d-ce65e4880be7	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.608	ACTIVE	\N	2026-09-13 20:44:57.608	2026-09-13 20:44:57.608
9e35e16a-c80e-4c1b-b7a6-0f0463a67b65	f16047fa-3896-453f-b1bb-9ae76fc02b56	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.611	ACTIVE	\N	2026-09-13 20:44:57.611	2026-09-13 20:44:57.611
22a67fec-1025-478f-b0f3-c40589a70aab	c21b1887-4ae1-4976-a753-63e09044a2fd	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.612	ACTIVE	\N	2026-09-13 20:44:57.612	2026-09-13 20:44:57.612
a64929a8-e809-4999-a4fc-1016bca7a8d8	354c935b-2683-4621-bf93-72923750f5e8	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.614	ACTIVE	\N	2026-09-13 20:44:57.614	2026-09-13 20:44:57.614
3c17fdcb-0608-416a-9b3e-97036bae2b8f	b3b83982-e5b7-42c4-8ece-cb8343aa0630	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.615	ACTIVE	\N	2026-09-13 20:44:57.615	2026-09-13 20:44:57.615
bb211b7b-d8ff-4da0-83b4-8ecbf8e3e5a1	aaadffa4-1f0b-455a-b5c8-fedf5afbf458	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.617	ACTIVE	\N	2026-09-13 20:44:57.617	2026-09-13 20:44:57.617
4ae7987b-05c9-4b09-9c35-7c1bbd7274c4	4f4d2f89-a9a0-4bca-b54f-25d0049e2683	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.618	ACTIVE	\N	2026-09-13 20:44:57.618	2026-09-13 20:44:57.618
8c08c770-6478-4863-a6e4-27b46339c8c1	3df4580d-9003-4081-892b-b8e2026218c5	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.619	ACTIVE	\N	2026-09-13 20:44:57.619	2026-09-13 20:44:57.619
d55d85ec-f77a-4f0a-b2dc-b6d173279a67	4171177c-ade0-4667-be2f-29794d4d3c18	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.621	ACTIVE	\N	2026-09-13 20:44:57.621	2026-09-13 20:44:57.621
0e03268b-be87-4092-9727-2596e26b7454	605bfb75-bd15-4e17-89ac-7b2def10ad20	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.622	ACTIVE	\N	2026-09-13 20:44:57.622	2026-09-13 20:44:57.622
0e913972-c780-4793-930e-bb16257fbeea	3757598b-0567-48e0-ae91-e29576651c4c	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.623	ACTIVE	\N	2026-09-13 20:44:57.623	2026-09-13 20:44:57.623
c16b2f12-2234-4ef8-ac12-e47fc97dfa14	790d82cc-2522-466e-9c6f-462ec9180432	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.625	ACTIVE	\N	2026-09-13 20:44:57.625	2026-09-13 20:44:57.625
5084241b-22b9-49b1-a20a-8d4c2a585b9d	9a3e7416-873c-46aa-87e7-2719e8f1b763	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.627	ACTIVE	\N	2026-09-13 20:44:57.627	2026-09-13 20:44:57.627
6e5f881e-b895-4a6e-b5eb-e7cdff005b38	76ccb9cd-fa30-4003-91a4-11782dba8882	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.629	ACTIVE	\N	2026-09-13 20:44:57.629	2026-09-13 20:44:57.629
08a762e1-cb01-4e83-b0ab-e2c1aa71f77f	636e953a-f989-43b9-bc46-86771525b66e	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.63	ACTIVE	\N	2026-09-13 20:44:57.63	2026-09-13 20:44:57.63
1c1705ec-fbc4-4d01-828b-20924bbfeed7	db78800b-99aa-4882-9914-c683e3d6f311	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.632	ACTIVE	\N	2026-09-13 20:44:57.632	2026-09-13 20:44:57.632
287721b4-b9be-41f9-96a6-03bfa46acaa6	d8670d3d-ca00-4b95-9038-59bb28372202	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.633	ACTIVE	\N	2026-09-13 20:44:57.633	2026-09-13 20:44:57.633
b7e2c36e-aa98-450c-8769-10c54f38ae6e	9c4652c5-a4ae-4ea4-adf2-6ece927a1cb7	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.634	ACTIVE	\N	2026-09-13 20:44:57.634	2026-09-13 20:44:57.634
d41cbada-5da2-4cd6-a76f-c6a76f233ce8	2c417cbd-7b1c-4728-967f-50b9e4308944	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.636	ACTIVE	\N	2026-09-13 20:44:57.636	2026-09-13 20:44:57.636
4ede27af-5290-4f8a-9b68-cf7275469a32	f7829be9-1192-47d6-9e36-ec2d140337f7	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.637	ACTIVE	\N	2026-09-13 20:44:57.637	2026-09-13 20:44:57.637
b02eb0a1-666f-4a5d-91f5-0016e64f7866	369bb540-880a-41ed-96b2-c490f515a12e	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.639	ACTIVE	\N	2026-09-13 20:44:57.639	2026-09-13 20:44:57.639
a9b41dad-19d8-42c4-babe-7d0b4c22f661	a1eec824-41e1-49f6-894d-2345f8ebed5f	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.64	ACTIVE	\N	2026-09-13 20:44:57.64	2026-09-13 20:44:57.64
13d408a5-e565-4b3b-94fb-49308b9f6c31	b4d27c37-991d-43b8-a4b7-23fd3b91d9a8	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.641	ACTIVE	\N	2026-09-13 20:44:57.641	2026-09-13 20:44:57.641
6a3cf240-79e1-48ce-8c19-727cd394cd2b	4c1a0cfb-a588-43a5-b94b-b18eede77bab	7dccf2a9-2bcd-49cc-982c-b68d408d365c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.644	ACTIVE	\N	2026-09-13 20:44:57.644	2026-09-13 20:44:57.644
a116dc51-2546-4fd9-9caf-87dda82bda33	545afd34-61d1-4ffb-8018-e8c29bf255b6	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.645	ACTIVE	\N	2026-09-13 20:44:57.645	2026-09-13 20:44:57.645
4772b2ee-22ad-4a1e-9052-2214d272dece	58390e30-8e88-43b3-934d-c7e3320f7113	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.646	ACTIVE	\N	2026-09-13 20:44:57.646	2026-09-13 20:44:57.646
7e7d524c-fd4b-4b59-930f-902efd4cd153	c3443927-da9a-4ff7-84ae-c9c4299bd1ad	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.648	ACTIVE	\N	2026-09-13 20:44:57.648	2026-09-13 20:44:57.648
ca17ac17-06dc-41c3-999d-910d8596aafc	291b80d6-f3e1-4374-8902-f4913657ab60	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.65	ACTIVE	\N	2026-09-13 20:44:57.65	2026-09-13 20:44:57.65
de7cfce7-84ff-4c4b-8e6a-dfe9792f3f39	9cca88a6-238b-4812-8860-97cbb3eb5bce	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.653	ACTIVE	\N	2026-09-13 20:44:57.653	2026-09-13 20:44:57.653
c7fdbe99-b566-42c2-a607-383fa258f12a	da12afa9-729d-4556-a250-92db83ff86b8	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.655	ACTIVE	\N	2026-09-13 20:44:57.655	2026-09-13 20:44:57.655
416c1e7e-d848-4b92-ab12-68601c29c994	5d817a33-5c27-4ea8-93a7-43788e83b897	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.657	ACTIVE	\N	2026-09-13 20:44:57.657	2026-09-13 20:44:57.657
d61bf8d7-8e91-4130-b948-3196a76af546	bbcdeded-c0dd-4a41-90b8-42a622f4dcf9	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.659	ACTIVE	\N	2026-09-13 20:44:57.659	2026-09-13 20:44:57.659
5337e942-333c-4e49-ae4c-8e6b12ee18d6	5d78af6b-0ba1-4225-881f-9d09ae9808d9	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.661	ACTIVE	\N	2026-09-13 20:44:57.661	2026-09-13 20:44:57.661
d7ef13c3-caca-47cd-8b14-10ecf0f1c0af	e5586701-83af-4a19-a4c0-6faca2448d15	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.663	ACTIVE	\N	2026-09-13 20:44:57.663	2026-09-13 20:44:57.663
7d3143c1-03bf-4ed4-b51e-d5ace517278c	9b9b1e70-396c-4fdb-b9eb-b686781215c4	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.665	ACTIVE	\N	2026-09-13 20:44:57.665	2026-09-13 20:44:57.665
88a0dff0-c142-4019-ab42-07f0bf50f453	be9e963d-af8d-4d59-b264-d914e197928b	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.666	ACTIVE	\N	2026-09-13 20:44:57.666	2026-09-13 20:44:57.666
187b87a9-01b9-407c-9545-945bf9ba87ab	d013137b-9d8f-460f-8c83-5f7c7024c98d	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.668	ACTIVE	\N	2026-09-13 20:44:57.668	2026-09-13 20:44:57.668
ed3726ca-4de8-4918-a48c-a3cd3690193b	be0e4f07-df6a-4420-bf64-bd115d2a3efe	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.669	ACTIVE	\N	2026-09-13 20:44:57.669	2026-09-13 20:44:57.669
3e4ba652-6f28-4c01-b093-3710aa6c5b91	f9c54e92-7b68-4011-937c-c5df96ca45ec	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.671	ACTIVE	\N	2026-09-13 20:44:57.671	2026-09-13 20:44:57.671
970bb2a5-8e6c-4d51-a7b3-0d2db3c8cce8	fea0dc71-1eff-4481-8299-a7489efdb22c	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.672	ACTIVE	\N	2026-09-13 20:44:57.672	2026-09-13 20:44:57.672
456e4764-2adb-4f96-a4cb-0e60f61be764	cbe8a31a-2563-4bb8-9105-03890c196dac	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.674	ACTIVE	\N	2026-09-13 20:44:57.674	2026-09-13 20:44:57.674
86b24f06-ebb7-4694-a132-1d4d29051d29	b28ac651-c527-4088-b3b6-6cd78149c6ea	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.675	ACTIVE	\N	2026-09-13 20:44:57.675	2026-09-13 20:44:57.675
c6e28c67-4749-4916-8a1b-ea3221a80864	fa53599d-1c31-48da-ba77-3e81928f3cf6	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.678	ACTIVE	\N	2026-09-13 20:44:57.678	2026-09-13 20:44:57.678
1e76292c-8aca-4115-8bcc-cbf0e3867814	d480e876-6633-4511-9ce7-dfb2882520f6	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.68	ACTIVE	\N	2026-09-13 20:44:57.68	2026-09-13 20:44:57.68
159036e3-1eaf-4eb7-8e1f-252eebd281e4	c421d758-e8e2-4bb1-97fb-e420fc49a60c	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.681	ACTIVE	\N	2026-09-13 20:44:57.681	2026-09-13 20:44:57.681
200b61e5-c9c4-478d-8f0a-998cca6d1b38	eb504caa-ebd3-401b-899d-239123e069fc	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.683	ACTIVE	\N	2026-09-13 20:44:57.683	2026-09-13 20:44:57.683
a8aa7357-6a44-4231-8c87-12866fc14fa0	2f012e25-265f-4861-a0e4-583235608034	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.684	ACTIVE	\N	2026-09-13 20:44:57.684	2026-09-13 20:44:57.684
e6f4eb5c-717e-4e4f-931e-10533a9ca93a	13c7f5b1-746c-4324-9b74-660ff66cfb9a	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.685	ACTIVE	\N	2026-09-13 20:44:57.685	2026-09-13 20:44:57.685
d180c011-e941-4d4f-9567-dcad30d4cf81	ee7cc9f8-f8b8-4cbb-a557-570e69aba05b	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.687	ACTIVE	\N	2026-09-13 20:44:57.687	2026-09-13 20:44:57.687
7cfc707f-3556-4d02-9940-61e71baf09f8	c8e9745d-934a-4d05-bdea-60d00f1cad11	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.688	ACTIVE	\N	2026-09-13 20:44:57.688	2026-09-13 20:44:57.688
c96bed3f-0bed-4b42-ab91-41b15aac37d5	31055de6-0c1a-48ff-85a5-d9c64298a1e1	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.69	ACTIVE	\N	2026-09-13 20:44:57.69	2026-09-13 20:44:57.69
e6032a41-d44a-4f8b-9f27-322492f028b2	c9f3464b-0b0f-4449-8d78-4e04bfef7b2e	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.691	ACTIVE	\N	2026-09-13 20:44:57.691	2026-09-13 20:44:57.691
4c38c726-622c-406b-acd9-1e47750d751c	33649d4b-29a1-4543-b92b-8ade3818667c	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.693	ACTIVE	\N	2026-09-13 20:44:57.693	2026-09-13 20:44:57.693
502d03d5-dae9-4b79-bc5d-045f4cafe9d1	4eb406b5-a8ba-4de0-88fd-1b38a8277106	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.695	ACTIVE	\N	2026-09-13 20:44:57.695	2026-09-13 20:44:57.695
451de513-c1d2-481c-8f18-1730f6daee2e	35418ee6-3131-41e6-881b-65c4e601e9f5	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.697	ACTIVE	\N	2026-09-13 20:44:57.697	2026-09-13 20:44:57.697
a4b21e4b-cf5b-4ff4-a5e1-302091bcc501	bd6cbe75-90c9-43cc-92f0-c5b73b613db6	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.698	ACTIVE	\N	2026-09-13 20:44:57.698	2026-09-13 20:44:57.698
8e80e628-59a6-49ff-8f1c-aca689552da9	54a9a653-8770-43f8-801f-c8bafc84f67a	9ff9db65-59b7-4961-aa32-7ef1f926afb8	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.699	ACTIVE	\N	2026-09-13 20:44:57.699	2026-09-13 20:44:57.699
dba40142-a935-45f5-925e-bd292c271728	7cca7829-8358-4ac9-9e83-c55c43be7f1d	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.701	ACTIVE	\N	2026-09-13 20:44:57.701	2026-09-13 20:44:57.701
b33c7be4-6af7-4be4-ad5b-e7d57c904d99	6105ff55-8cb4-4490-bc4b-75eb616fc72d	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.702	ACTIVE	\N	2026-09-13 20:44:57.702	2026-09-13 20:44:57.702
57c16092-321f-40a6-8754-b4e06d58960f	eae11bdf-d8d4-41e0-8740-3eb39ef08436	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.703	ACTIVE	\N	2026-09-13 20:44:57.703	2026-09-13 20:44:57.703
a665ee47-c908-4347-912a-14f662f6d5e2	1df0b1fd-017d-4ad7-8d9c-31c5656b471c	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.705	ACTIVE	\N	2026-09-13 20:44:57.705	2026-09-13 20:44:57.705
80ebe5e0-0d1d-4afa-be1c-eebe942e250f	9251ecc9-fc9f-4d32-800a-f0554aa7e31c	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.706	ACTIVE	\N	2026-09-13 20:44:57.706	2026-09-13 20:44:57.706
ae32a28b-055b-46a2-aa78-4a08dc0c23ba	d443c585-d8da-4cb4-b9c1-f760db74da7b	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.708	ACTIVE	\N	2026-09-13 20:44:57.708	2026-09-13 20:44:57.708
83118b43-55a6-48c7-af47-10f1c9b82bd1	470edd5f-57e5-4878-869d-679dd2673500	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.71	ACTIVE	\N	2026-09-13 20:44:57.71	2026-09-13 20:44:57.71
fb689388-af3d-414a-bf5a-e4ef3b9a2024	ac7af626-abaa-4572-86af-90007c2b7ad6	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.712	ACTIVE	\N	2026-09-13 20:44:57.712	2026-09-13 20:44:57.712
f1e3ae00-daa5-4a36-91a0-fdf8bd6c94d0	b59ce17c-48f6-4aa4-9bd4-e7b3d71e6cad	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.713	ACTIVE	\N	2026-09-13 20:44:57.713	2026-09-13 20:44:57.713
ee1063dc-f20d-479e-bf03-03507ab0603c	61fe3bb6-2f07-4726-9343-c138cb701c85	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.715	ACTIVE	\N	2026-09-13 20:44:57.715	2026-09-13 20:44:57.715
e431bc41-8155-402d-ba00-5ae9321c6913	57b08512-cc1c-4e77-addf-202b8690baf2	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.716	ACTIVE	\N	2026-09-13 20:44:57.716	2026-09-13 20:44:57.716
dae45cd7-9978-4e81-9cd8-0f1f3d486142	90565292-fec0-4b25-abfc-17e9eae51b42	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.718	ACTIVE	\N	2026-09-13 20:44:57.718	2026-09-13 20:44:57.718
0d4c7364-72d7-45b7-92b5-275001c3c670	ac2ee8de-ee2e-41ea-92f9-1af3e0e212e1	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.719	ACTIVE	\N	2026-09-13 20:44:57.719	2026-09-13 20:44:57.719
e5925afb-a2e1-422a-bd13-14c21a2287c8	c957f262-7c65-4e8b-9e43-5fc66464e08d	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.721	ACTIVE	\N	2026-09-13 20:44:57.721	2026-09-13 20:44:57.721
16deb88d-9734-4c76-a0f0-089500b6e649	6a475e8f-6166-4fee-99ec-3398403610f8	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.722	ACTIVE	\N	2026-09-13 20:44:57.722	2026-09-13 20:44:57.722
125fdea7-7816-4f6b-97ec-ca519dc3cdd8	f95eb84b-c1bc-458b-9060-e8ec692a091c	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.724	ACTIVE	\N	2026-09-13 20:44:57.724	2026-09-13 20:44:57.724
1919295d-4d1d-47d6-887b-0f62487609cb	af66403d-0ec5-4cd5-83e7-29a714938b02	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.726	ACTIVE	\N	2026-09-13 20:44:57.726	2026-09-13 20:44:57.726
50509cab-419e-4705-9c57-5d63a0f9c551	dad90ceb-1811-453c-b047-9c6bc064e450	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.728	ACTIVE	\N	2026-09-13 20:44:57.728	2026-09-13 20:44:57.728
85a45de1-4889-43c2-bf58-e9713f0e3d5b	b824fdc7-73ba-43da-862f-d8c9ec0dc42c	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.73	ACTIVE	\N	2026-09-13 20:44:57.73	2026-09-13 20:44:57.73
e4697f93-6e65-486c-bbcf-735b1827afdb	9be3fba8-e56a-4a1f-a6dc-7b85aec07153	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.731	ACTIVE	\N	2026-09-13 20:44:57.731	2026-09-13 20:44:57.731
d0590620-767f-4eeb-8706-41651bae4437	0904ce9a-e8f2-477d-8468-7d1ebeb883dd	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.732	ACTIVE	\N	2026-09-13 20:44:57.732	2026-09-13 20:44:57.732
63ebaada-633f-475f-9359-5f51a248c83e	b6c15720-f35e-4de3-be3c-652023ed37a2	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.734	ACTIVE	\N	2026-09-13 20:44:57.734	2026-09-13 20:44:57.734
a0777b28-c50d-404e-9701-26146f826539	c80eb055-afa9-49c8-81ee-7e4af2c22c3d	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.735	ACTIVE	\N	2026-09-13 20:44:57.735	2026-09-13 20:44:57.735
c9210d7c-a4f4-45aa-a8dc-f2f079400469	513096be-5bde-4040-a6ce-c8c757311410	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.736	ACTIVE	\N	2026-09-13 20:44:57.736	2026-09-13 20:44:57.736
3a253085-061c-4dfd-9af8-85b4f6bfddda	3f428560-755f-422b-9bc2-7e2b68576463	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.738	ACTIVE	\N	2026-09-13 20:44:57.738	2026-09-13 20:44:57.738
13986bae-9b84-4b68-bbe2-7eaade0a0d3c	4065ab7d-f63d-4d70-9f21-349834a662f6	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.739	ACTIVE	\N	2026-09-13 20:44:57.739	2026-09-13 20:44:57.739
eaaa93fb-5658-4ebd-baf0-3f6f35053ae2	0fa76439-36ab-452a-affe-92a8636f2cf4	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.741	ACTIVE	\N	2026-09-13 20:44:57.741	2026-09-13 20:44:57.741
dc8a9047-fd27-4d80-9da2-bd82a0d7df6b	1ea918ec-2b6b-4304-978b-106eea76c326	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.743	ACTIVE	\N	2026-09-13 20:44:57.743	2026-09-13 20:44:57.743
fe21b1c6-f666-43f4-9cd6-504f73260624	25c9184a-41cc-4315-baf5-efd1b9e622ef	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.745	ACTIVE	\N	2026-09-13 20:44:57.745	2026-09-13 20:44:57.745
1448cfc0-6c12-4370-8648-f09ab4db4d41	ad60fe8f-63c7-44c4-9205-d15d9f65ee88	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.746	ACTIVE	\N	2026-09-13 20:44:57.746	2026-09-13 20:44:57.746
02f380de-8a6b-42cc-a0c9-62ac366e464a	1395249c-4044-4a2b-8f34-9987caf43b34	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.747	ACTIVE	\N	2026-09-13 20:44:57.747	2026-09-13 20:44:57.747
508126ea-e23d-4daa-8fbd-b18548ed28b7	8e40e7b4-9369-4498-83ff-801c298142d7	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.749	ACTIVE	\N	2026-09-13 20:44:57.749	2026-09-13 20:44:57.749
2548ad37-e6aa-46cf-aeb6-6a7f14b4c110	c7d26dbb-d831-4551-b7e8-cc4e95395424	b177b351-d4da-4045-b4fa-e98801ebd47a	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.75	ACTIVE	\N	2026-09-13 20:44:57.75	2026-09-13 20:44:57.75
c4dc0669-0269-4322-ba85-c212ff5a9394	53bdd0f0-8983-494e-80d9-5bb50a97a6d0	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.752	ACTIVE	\N	2026-09-13 20:44:57.752	2026-09-13 20:44:57.752
86c7ed09-ffb0-425a-9923-4fa08fbfae8d	6723afa6-af66-4881-8e24-390b7ddd3cee	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.753	ACTIVE	\N	2026-09-13 20:44:57.753	2026-09-13 20:44:57.753
b407a520-6480-4d0e-84ad-ce3980e76fc6	b1095869-72f3-4eac-9630-085f418d1a6d	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.754	ACTIVE	\N	2026-09-13 20:44:57.754	2026-09-13 20:44:57.754
a7eb73b3-e15b-4e26-a232-f9b4350dc84d	5c08ed21-70ab-43f5-a55a-64376e702948	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.756	ACTIVE	\N	2026-09-13 20:44:57.756	2026-09-13 20:44:57.756
e4aa809b-071c-4093-b6db-a8d86c76760d	006d9dc1-83a2-4638-b49e-b7211197eb03	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.757	ACTIVE	\N	2026-09-13 20:44:57.757	2026-09-13 20:44:57.757
cf4ed041-66f0-48c5-9307-74d22d946bd7	5618ed54-fd7c-4ce2-9f53-5607fe62b3f3	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.758	ACTIVE	\N	2026-09-13 20:44:57.758	2026-09-13 20:44:57.758
6d53247f-8459-4612-9f32-dfec277e4560	595a780c-520f-43c5-be48-590f06be4a77	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.761	ACTIVE	\N	2026-09-13 20:44:57.761	2026-09-13 20:44:57.761
ae095434-6fbf-4f4d-9845-9ff33c04d54d	589d5611-423e-4658-9f7f-faeb6bd66bd1	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.762	ACTIVE	\N	2026-09-13 20:44:57.762	2026-09-13 20:44:57.762
d0fcc16b-2267-4f93-9a82-efc70a2f6f45	d85687f4-fa4c-4951-9c50-3479a6cc5f68	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.763	ACTIVE	\N	2026-09-13 20:44:57.763	2026-09-13 20:44:57.763
32b1f87a-6774-400c-95fb-c20bfe485866	2cb0fcd7-0d93-42d9-995f-7b5052ffa034	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.765	ACTIVE	\N	2026-09-13 20:44:57.765	2026-09-13 20:44:57.765
bd443783-aae2-4ef7-8033-b5d01291fe8d	1d6d07cc-16e8-4dba-854b-980542e574e2	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.766	ACTIVE	\N	2026-09-13 20:44:57.766	2026-09-13 20:44:57.766
b0b365b4-6558-489f-93d7-320f2b51c4ec	6d4b118c-3c0d-4693-ac4f-3b0220358466	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.767	ACTIVE	\N	2026-09-13 20:44:57.767	2026-09-13 20:44:57.767
1e15b933-2e3d-409a-a737-368cfa2d8bb1	91f7a403-cc7c-4bee-9284-f6199e62f0b2	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.769	ACTIVE	\N	2026-09-13 20:44:57.769	2026-09-13 20:44:57.769
2ab8da7c-6d65-4185-ad8e-736802a55952	7f016b6b-41cb-4eac-809c-a1a3d2e63a16	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.77	ACTIVE	\N	2026-09-13 20:44:57.77	2026-09-13 20:44:57.77
508c33b2-88b4-48b1-a213-85929960dc5b	e91b1ee1-735a-4501-a4f8-1caec833522e	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.771	ACTIVE	\N	2026-09-13 20:44:57.771	2026-09-13 20:44:57.771
a275ded8-5767-4b62-936a-950123b432ca	42b6cdef-2ea0-4209-a686-001616036996	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.773	ACTIVE	\N	2026-09-13 20:44:57.773	2026-09-13 20:44:57.773
0cfd3a23-2a9d-477d-bd5b-f95067f9b033	0598cf64-ba0c-4cd2-a2fc-e94e725d1162	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.775	ACTIVE	\N	2026-09-13 20:44:57.775	2026-09-13 20:44:57.775
73f5f2f3-9310-4998-b023-4dbc8b4157fa	4f1a4405-16ab-4bde-9e44-e76407d18b2d	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.777	ACTIVE	\N	2026-09-13 20:44:57.777	2026-09-13 20:44:57.777
72480d36-91be-4651-a193-3fc3028ab3ed	c5e3c9cc-0fb5-4ed8-8614-934ff9766944	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.779	ACTIVE	\N	2026-09-13 20:44:57.779	2026-09-13 20:44:57.779
ebe9bbf2-ecfc-428a-8f26-9ca4c88bc5b7	8e2df95f-d108-4c31-9e84-7363d01591bf	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.78	ACTIVE	\N	2026-09-13 20:44:57.78	2026-09-13 20:44:57.78
24871835-19ec-4698-acfb-2c2eacd28b9a	28ecd380-96c1-4f19-9acf-94e101e3f493	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.781	ACTIVE	\N	2026-09-13 20:44:57.781	2026-09-13 20:44:57.781
48f6d599-7ef4-4b49-a883-f2c31d3a7c08	5e5ae243-d9eb-4d9a-8421-30892193f881	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.783	ACTIVE	\N	2026-09-13 20:44:57.783	2026-09-13 20:44:57.783
c35f3c40-c407-43e4-84bb-e8d4a60288f4	937409f3-1dc7-4f78-8d21-a90048f2e86a	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.784	ACTIVE	\N	2026-09-13 20:44:57.784	2026-09-13 20:44:57.784
5e94cd8d-51cd-4170-8f14-c2f29b029767	8b0ead23-ef2a-4077-bac9-bd5c0567f10a	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.785	ACTIVE	\N	2026-09-13 20:44:57.785	2026-09-13 20:44:57.785
8ccdad16-d59a-4c91-9ac7-fa9dfebd0238	7e32bcdf-3b76-4168-8372-251a496f0c1c	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.787	ACTIVE	\N	2026-09-13 20:44:57.787	2026-09-13 20:44:57.787
f221c6d0-47b4-44b0-8e87-f008b945e13f	c88f45d2-af9c-4e06-abca-ec5e4b65cc2a	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.788	ACTIVE	\N	2026-09-13 20:44:57.788	2026-09-13 20:44:57.788
f340b35b-f1ec-4340-9408-8c46a07f5e4c	a659583a-6f88-480e-b80b-7ff9d18eac25	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.789	ACTIVE	\N	2026-09-13 20:44:57.789	2026-09-13 20:44:57.789
9db2248c-987d-4be7-a859-8e7c2040403d	7e1e996d-a500-4561-82c4-bbab4a384a17	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.791	ACTIVE	\N	2026-09-13 20:44:57.791	2026-09-13 20:44:57.791
bea08e5d-8451-4de7-b76a-5851360159ce	2977f0ec-7faf-422c-86b2-d476107bfb4c	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.793	ACTIVE	\N	2026-09-13 20:44:57.793	2026-09-13 20:44:57.793
f4286f8b-30cc-4db6-b0bc-89c11cdf937d	4976ee35-d9f2-41ef-bd05-9b4ba1a4917a	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.795	ACTIVE	\N	2026-09-13 20:44:57.795	2026-09-13 20:44:57.795
360b771a-8334-482e-97b2-d3fd769ce5ea	cdf0ed76-16d6-4546-8b85-3ee02200cd5a	34732587-bbd9-4b56-9f54-f81a4c22ab75	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.796	ACTIVE	\N	2026-09-13 20:44:57.796	2026-09-13 20:44:57.796
a2d8053a-3ce4-4eed-ba38-ef2f78549db0	33e3d059-ed45-481f-9357-9a71e43a5ef6	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.798	ACTIVE	\N	2026-09-13 20:44:57.798	2026-09-13 20:44:57.798
e1befdb4-9a2d-47e2-a6f9-09a09f412d37	3b493ebd-03d6-4293-bf52-48c20a5916a0	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.799	ACTIVE	\N	2026-09-13 20:44:57.799	2026-09-13 20:44:57.799
00356293-a2e4-4d8a-86de-941228ac527a	f102f8c2-89d5-41b2-9335-efe07d47e0ae	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.801	ACTIVE	\N	2026-09-13 20:44:57.801	2026-09-13 20:44:57.801
7a2eb21b-f7af-4767-8a44-539626887844	3bc593ef-c763-4073-a21c-8c93aa442b62	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.802	ACTIVE	\N	2026-09-13 20:44:57.802	2026-09-13 20:44:57.802
82f995db-862a-4bb7-b9fb-17901802dfbf	ef30db7c-63b7-4a7d-9889-b3688a5a31d7	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.804	ACTIVE	\N	2026-09-13 20:44:57.804	2026-09-13 20:44:57.804
a2b62997-88eb-497b-ae11-0de916fd1330	5b9ac2dc-4180-45b4-a567-7aca90fe13dc	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.805	ACTIVE	\N	2026-09-13 20:44:57.805	2026-09-13 20:44:57.805
da0d8dd8-5ff4-4a4d-b1f3-f29e73ee2270	bbffe19c-20c1-42a4-968c-8a117fef12b3	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.807	ACTIVE	\N	2026-09-13 20:44:57.807	2026-09-13 20:44:57.807
0f59de25-d9e3-4b22-9c8b-b2377492e033	e64af6a3-e07f-4b17-b698-f699cb112c69	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.808	ACTIVE	\N	2026-09-13 20:44:57.808	2026-09-13 20:44:57.808
3f6763c9-a404-4230-9464-9785067cce11	4a94e5d2-44b4-4b53-89b8-25be15b68688	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.81	ACTIVE	\N	2026-09-13 20:44:57.81	2026-09-13 20:44:57.81
c40b831c-a530-4dd9-af38-81589e21932c	97e4ebef-75d8-4ae1-82c7-846a89335475	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.812	ACTIVE	\N	2026-09-13 20:44:57.812	2026-09-13 20:44:57.812
01fe51e0-3f0b-40fc-bb41-384222cfe3dd	1f5ee723-fd06-40b1-a894-537cc6588cfd	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.813	ACTIVE	\N	2026-09-13 20:44:57.813	2026-09-13 20:44:57.813
ee4fe648-35c8-40d2-a049-9ead7d43118c	d4f50e0a-0d6d-4771-81ee-5733e6a4e524	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.814	ACTIVE	\N	2026-09-13 20:44:57.814	2026-09-13 20:44:57.814
06a8505f-b467-41bc-a34d-d6d2c112b784	5e56c935-17fb-4b86-928b-5866081b25b0	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.816	ACTIVE	\N	2026-09-13 20:44:57.816	2026-09-13 20:44:57.816
7a0dd8a5-4b34-49e2-a310-a9f26f459285	390769a1-852a-4376-ab27-c20b934da1a2	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.817	ACTIVE	\N	2026-09-13 20:44:57.817	2026-09-13 20:44:57.817
299d4b88-48a7-4a98-9ccd-8b32d5056d81	54005066-2a81-4400-a8d4-91851b7b957f	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.818	ACTIVE	\N	2026-09-13 20:44:57.818	2026-09-13 20:44:57.818
ed45e0f3-2f8f-4d33-bc83-6d23cd9ab98b	a1705437-d88c-4b2d-9b74-7a8716a8e56e	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.82	ACTIVE	\N	2026-09-13 20:44:57.82	2026-09-13 20:44:57.82
9c04896e-f267-4aa5-8cd4-ceabfeea020f	e07896ff-432a-4116-b6e8-5646ae93b9a6	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.821	ACTIVE	\N	2026-09-13 20:44:57.821	2026-09-13 20:44:57.821
31083608-246d-42be-993a-51e00aa13a3e	1acef56d-5214-424e-9fe0-5e4e79fc847d	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.823	ACTIVE	\N	2026-09-13 20:44:57.823	2026-09-13 20:44:57.823
80a61299-cf56-42e0-b016-1a861c9d5f62	77ee6d6e-d31e-4b4e-9ea4-f2dba6c7ccbb	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.824	ACTIVE	\N	2026-09-13 20:44:57.824	2026-09-13 20:44:57.824
4a16cfe4-13c8-48cc-8a19-36d626e9000f	912c6256-fca6-4bfa-8da6-c889eeedce13	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.825	ACTIVE	\N	2026-09-13 20:44:57.825	2026-09-13 20:44:57.825
6d44ec49-1ad0-4452-9a9a-3ffc8334f50c	56e92556-08ac-4c14-bddb-acafee984777	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.828	ACTIVE	\N	2026-09-13 20:44:57.828	2026-09-13 20:44:57.828
005dc2aa-29f0-40a6-b1de-55273fa52819	5370462a-4001-44dd-8055-ba1be84d3a59	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.829	ACTIVE	\N	2026-09-13 20:44:57.829	2026-09-13 20:44:57.829
dea5528e-3454-460a-9a55-f826f6779cfb	071a7ca8-5d8f-4671-95fe-5fbaad2392ed	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.831	ACTIVE	\N	2026-09-13 20:44:57.831	2026-09-13 20:44:57.831
8a826196-ef1c-4e97-b3c7-931c20ac0fd0	72b77d5a-2d61-4dfc-bc89-39af54309df7	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.832	ACTIVE	\N	2026-09-13 20:44:57.832	2026-09-13 20:44:57.832
b941646f-7259-4038-b633-2452ffdd0409	9c18c5b9-550a-480e-ad9e-9e5cd2141ed8	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.833	ACTIVE	\N	2026-09-13 20:44:57.833	2026-09-13 20:44:57.833
c11f8a78-d2ba-475b-9f80-14631871e01e	f9e07b6b-ea12-41b6-be18-f329b1ac6ff9	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.835	ACTIVE	\N	2026-09-13 20:44:57.835	2026-09-13 20:44:57.835
2be3bc51-dc19-49f5-8a4a-77eb68fb8662	0566182f-d409-400b-a6b1-83690d9114cb	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.836	ACTIVE	\N	2026-09-13 20:44:57.836	2026-09-13 20:44:57.836
94095b77-536a-4f08-98a6-0e453fda6316	e843d230-29e4-402e-941a-41039268f828	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.837	ACTIVE	\N	2026-09-13 20:44:57.837	2026-09-13 20:44:57.837
7c8914fa-b6f4-4f07-8812-15f32aca5259	57ab4fd4-094e-43fe-9978-9d632a6e9c90	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.839	ACTIVE	\N	2026-09-13 20:44:57.839	2026-09-13 20:44:57.839
3f414e33-2b8e-444f-8b14-b155a8e5a47d	edaa1019-8f16-468f-9db5-1cd3f8fa1920	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.84	ACTIVE	\N	2026-09-13 20:44:57.84	2026-09-13 20:44:57.84
efd55eae-e329-4344-a2db-b0cbf62d015a	955ca492-3471-4f9c-81b7-e2d7b7160263	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.842	ACTIVE	\N	2026-09-13 20:44:57.842	2026-09-13 20:44:57.842
9377cd42-67fb-462d-8ddd-53d5be5f2db4	61bb5f5e-2a9b-4420-84a2-8b09881b07e7	a2b3429f-eabd-4c92-b108-41d16aae7126	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.844	ACTIVE	\N	2026-09-13 20:44:57.844	2026-09-13 20:44:57.844
21a70df0-1d76-4d0d-994b-8661cf9e5e86	7a2f3624-bf15-42e2-b670-661ac64aee1b	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.846	ACTIVE	\N	2026-09-13 20:44:57.846	2026-09-13 20:44:57.846
4d628e97-d60b-4141-9724-54467ced2ddb	b59d1c34-df52-4d1e-8208-c4d99056cf37	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.847	ACTIVE	\N	2026-09-13 20:44:57.847	2026-09-13 20:44:57.847
c5404d95-367b-403f-aff9-e584c1b10c45	9fd868f3-69c5-4ed1-b929-1778d6c9cd04	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.849	ACTIVE	\N	2026-09-13 20:44:57.849	2026-09-13 20:44:57.849
ba97a98d-4120-48e5-b008-8cc005744ae6	51467732-5172-4e39-8f9f-3a9ec6e52498	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.85	ACTIVE	\N	2026-09-13 20:44:57.85	2026-09-13 20:44:57.85
dee1b78b-1120-4064-82af-4f34198ef19e	27a1d273-bca1-41b7-bb00-100e3792e67c	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.851	ACTIVE	\N	2026-09-13 20:44:57.851	2026-09-13 20:44:57.851
f162a666-d54e-4d36-b022-310507376f3f	d9cf5853-3727-4495-a66c-c863802451f3	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.852	ACTIVE	\N	2026-09-13 20:44:57.852	2026-09-13 20:44:57.852
d99dc1ea-b868-4692-8138-cfeacf24f79a	3b4b411c-7c4a-46ce-987b-28457f7c2f77	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.854	ACTIVE	\N	2026-09-13 20:44:57.854	2026-09-13 20:44:57.854
66206df0-bb7d-470f-bbf5-0d614db4f17d	159cd16a-09fb-46b6-86b6-4a27f30ef06a	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.855	ACTIVE	\N	2026-09-13 20:44:57.855	2026-09-13 20:44:57.855
8cec6ba0-fa5f-4b2d-aacb-9133d4c02d61	cd8e4a89-c9db-4a3d-9fda-5b8ecbabb3c6	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.856	ACTIVE	\N	2026-09-13 20:44:57.856	2026-09-13 20:44:57.856
6809f5b8-6ff6-4db7-8c89-38a16f9629f0	fa590189-59dd-49b2-b807-0e33ad475963	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.858	ACTIVE	\N	2026-09-13 20:44:57.858	2026-09-13 20:44:57.858
94906439-f3cf-4ffa-8e74-933f3c8950b7	ecdeb3e2-90a4-4ae1-a8d7-0a73e76bd7e8	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.86	ACTIVE	\N	2026-09-13 20:44:57.86	2026-09-13 20:44:57.86
65157bee-73c0-4f54-a8e4-d9211c68acfe	4ae63fff-0c02-47f8-9138-e1caf669d7f0	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.862	ACTIVE	\N	2026-09-13 20:44:57.862	2026-09-13 20:44:57.862
6c587005-be75-47bd-9210-fc60622ab0af	380ee44d-0e34-4852-9d00-08f1f9f48d9d	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.863	ACTIVE	\N	2026-09-13 20:44:57.863	2026-09-13 20:44:57.863
342a4540-2495-435f-acbd-f96b84815b6f	b2bc2378-60b2-485a-afb7-9bf06a206ddf	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.864	ACTIVE	\N	2026-09-13 20:44:57.864	2026-09-13 20:44:57.864
cff7f554-961d-407e-bd01-d8fb2b477248	ad880258-161c-4585-b2df-1fbf0fbb8099	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.866	ACTIVE	\N	2026-09-13 20:44:57.866	2026-09-13 20:44:57.866
30b6a1f1-858a-4162-886b-9b23f8fd55b2	f8fc90e6-5c66-4607-8438-d3456f39617c	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.867	ACTIVE	\N	2026-09-13 20:44:57.867	2026-09-13 20:44:57.867
4877647c-7175-4db9-8b2c-c7ee7c474154	cc2a673f-bb20-4d0d-b5db-ca0185c1f207	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.868	ACTIVE	\N	2026-09-13 20:44:57.868	2026-09-13 20:44:57.868
7437e763-a0d9-49a6-9d60-810d6e65e0d1	dbb35dd6-bc94-4a9a-93cf-ad9fc5f9235f	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.87	ACTIVE	\N	2026-09-13 20:44:57.87	2026-09-13 20:44:57.87
e6eea481-ca81-4742-8491-db1839bc3554	45b11111-57ff-42f7-b122-2f43e5f08a92	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.871	ACTIVE	\N	2026-09-13 20:44:57.871	2026-09-13 20:44:57.871
52e950e6-8256-43a7-8b53-2f6b1c48ba52	8ba5d770-e467-469d-ba1a-987ac688e874	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.872	ACTIVE	\N	2026-09-13 20:44:57.872	2026-09-13 20:44:57.872
e602990a-5a78-4a47-9984-0373ffe0fc90	e55e0525-b56e-4e3b-844e-93db103bd133	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.874	ACTIVE	\N	2026-09-13 20:44:57.874	2026-09-13 20:44:57.874
f4e9c1fd-40d9-402b-bc59-ea27c9f982ce	a28d3aa0-9e96-448a-83f7-0a794d510f1b	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.875	ACTIVE	\N	2026-09-13 20:44:57.875	2026-09-13 20:44:57.875
0a6312fd-bf82-4e28-a67d-f2e3a31da2a4	a58cd8dc-2474-4f32-a5a1-a624cc49272b	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.878	ACTIVE	\N	2026-09-13 20:44:57.878	2026-09-13 20:44:57.878
47171b79-3291-4eb9-ba99-4aeac53e9ff8	2e16bb49-1645-4c89-a923-f14bc5e142ac	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.879	ACTIVE	\N	2026-09-13 20:44:57.879	2026-09-13 20:44:57.879
26492226-c0c0-4255-a4a4-3c0069848bd7	713e1133-747d-48b7-a795-7af540a71c2f	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.881	ACTIVE	\N	2026-09-13 20:44:57.881	2026-09-13 20:44:57.881
5269b217-48d6-4ee4-884d-8aa0079404cd	b3a529d9-8369-4626-8a0d-a7bd8bbcf3b0	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.882	ACTIVE	\N	2026-09-13 20:44:57.882	2026-09-13 20:44:57.882
7978b781-6d49-417b-aa03-8a21cc0de54c	60a2f67b-6a9e-42d7-8e19-85d28937cbd2	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.883	ACTIVE	\N	2026-09-13 20:44:57.883	2026-09-13 20:44:57.883
989c89dc-95f0-4a00-8bd2-a3d1343c1d98	a767da6b-c4de-4218-b351-a8fc345cb7b1	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.885	ACTIVE	\N	2026-09-13 20:44:57.885	2026-09-13 20:44:57.885
72227176-a587-4632-ac87-662479ad78a1	56f01adb-25b8-4ff2-a919-fd0d8e94ee30	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.886	ACTIVE	\N	2026-09-13 20:44:57.886	2026-09-13 20:44:57.886
b6ff3830-1629-4bd8-9367-d652aa4ce868	59835218-40b7-4735-9502-ef7dfc0d6ea6	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.887	ACTIVE	\N	2026-09-13 20:44:57.887	2026-09-13 20:44:57.887
0adc3373-8e8a-4330-914f-a5cbe9085729	adfe1aa4-f238-4571-893f-8a04f1da6f6a	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.889	ACTIVE	\N	2026-09-13 20:44:57.889	2026-09-13 20:44:57.889
245e27b3-492c-40e3-8809-50d669fd9346	8b21da2a-66c1-4b3e-bdad-d024b6bc7151	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.89	ACTIVE	\N	2026-09-13 20:44:57.89	2026-09-13 20:44:57.89
70fdd778-8e3d-44f6-ad24-28de6675df60	1ddb6bd4-6276-4205-864e-bb5ee4e6992b	ce8bb925-8557-4512-a998-9f809efc8203	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.891	ACTIVE	\N	2026-09-13 20:44:57.891	2026-09-13 20:44:57.891
ce90aa50-40a9-48e4-be84-ddb3896830d7	6c84b46d-2281-4474-83d8-ec23678b0dac	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.894	ACTIVE	\N	2026-09-13 20:44:57.894	2026-09-13 20:44:57.894
9ca6dada-5463-49aa-8bc2-55de9c501b77	4c4863fb-26e3-4765-a170-aa6c82b3d9ba	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.895	ACTIVE	\N	2026-09-13 20:44:57.895	2026-09-13 20:44:57.895
44550d76-4c52-4136-b5ff-f3c7da5080bf	4986a581-bc7a-4b75-8af6-da4bbd88a3e5	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.897	ACTIVE	\N	2026-09-13 20:44:57.897	2026-09-13 20:44:57.897
e9a08397-f7b6-4d57-9a53-9819bc6349c2	5c38b253-e3e6-4f95-90ed-84ed1a333392	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.899	ACTIVE	\N	2026-09-13 20:44:57.899	2026-09-13 20:44:57.899
e9415083-3f46-461d-919a-03c9a3dd6019	29e6f608-ca3f-46d8-821f-23d24fd0d7de	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.9	ACTIVE	\N	2026-09-13 20:44:57.9	2026-09-13 20:44:57.9
10c5105b-496e-4655-81ce-c9e0700daca2	7202693a-ba85-46af-9144-5ae3cbdff6a0	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.902	ACTIVE	\N	2026-09-13 20:44:57.902	2026-09-13 20:44:57.902
36a53f70-70a8-4b4b-9151-79c79e2a9e5f	a24342c1-97da-4d00-a6ef-fb22977334de	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.903	ACTIVE	\N	2026-09-13 20:44:57.903	2026-09-13 20:44:57.903
5ec61660-8aa8-47dd-9a16-63a71dbfb3d2	c94e11e2-9982-4989-8990-582cea7c0c86	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.905	ACTIVE	\N	2026-09-13 20:44:57.905	2026-09-13 20:44:57.905
2cc99823-3788-4aa9-acbf-05ef91e3ffda	5c56c00a-8e2a-4896-8112-4404d56911e8	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.906	ACTIVE	\N	2026-09-13 20:44:57.906	2026-09-13 20:44:57.906
5c0316dd-7315-4e07-b86e-3d9990d31144	b57655fe-197a-4a77-8514-24f6610de4a2	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.907	ACTIVE	\N	2026-09-13 20:44:57.907	2026-09-13 20:44:57.907
998e7507-bba7-46ee-a057-2edaa12a7e69	f07604a2-cdc3-4367-9eb5-feb2d746b3b2	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.909	ACTIVE	\N	2026-09-13 20:44:57.909	2026-09-13 20:44:57.909
3db064e4-d7d6-428a-ba30-928f3672f448	ae21acbd-29f6-4ffd-a1da-822bc9d81069	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.911	ACTIVE	\N	2026-09-13 20:44:57.911	2026-09-13 20:44:57.911
32c648b9-666a-4e1f-8150-bfa18e38c35c	54e24dcc-66fd-43c6-ab58-1cffd956eff7	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.913	ACTIVE	\N	2026-09-13 20:44:57.913	2026-09-13 20:44:57.913
83afa05d-8efd-4e60-8e6d-24a16d323791	a758a4b0-4631-46b8-b4c6-0627b9830ffc	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.914	ACTIVE	\N	2026-09-13 20:44:57.914	2026-09-13 20:44:57.914
486aabff-e558-4fdc-be6c-37d9f07bcb16	3fd4f152-7319-41ba-85cd-4fc5ceef7c43	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.915	ACTIVE	\N	2026-09-13 20:44:57.915	2026-09-13 20:44:57.915
075ba25c-d346-459f-8e00-24a22e19da31	325de075-675e-475e-8f52-bc6ca5762a11	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.917	ACTIVE	\N	2026-09-13 20:44:57.917	2026-09-13 20:44:57.917
64f052dd-16b7-438b-b9cd-07866dd52d6e	2c265d26-e8d3-4e82-9a4a-7273a46d26a7	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.918	ACTIVE	\N	2026-09-13 20:44:57.918	2026-09-13 20:44:57.918
5ed042c9-9971-408d-aafd-a6864661e381	54cf7e90-f1b6-4e8f-96f8-98e250f96174	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.919	ACTIVE	\N	2026-09-13 20:44:57.919	2026-09-13 20:44:57.919
303cf085-a29a-4a01-a43e-a1fecb188d11	a890a608-9965-4d0e-b07f-9ad3dfc0c782	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.921	ACTIVE	\N	2026-09-13 20:44:57.921	2026-09-13 20:44:57.921
798528c2-f4f4-4258-9905-038b2181a5e9	4485b8f4-2b7e-40e8-962b-f4b35347c9a7	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.922	ACTIVE	\N	2026-09-13 20:44:57.922	2026-09-13 20:44:57.922
7b49e09d-6ecb-4db9-a93b-c9cd39d81b9d	af31366b-786f-4d43-b856-bf19f451218f	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.923	ACTIVE	\N	2026-09-13 20:44:57.923	2026-09-13 20:44:57.923
da44e33a-218d-4712-8044-d0967373622f	377228d0-ff7f-4103-aa68-de15f576275e	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.925	ACTIVE	\N	2026-09-13 20:44:57.925	2026-09-13 20:44:57.925
57049c41-d7d8-4499-954f-d74f134e1086	dbd7fef2-c165-4a35-ae06-11337d04f58e	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.927	ACTIVE	\N	2026-09-13 20:44:57.927	2026-09-13 20:44:57.927
6cccc3ae-d314-4408-ae62-5e033713b723	8fbfe726-e9ce-46ae-8900-606b8897a6e7	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.929	ACTIVE	\N	2026-09-13 20:44:57.929	2026-09-13 20:44:57.929
097b3bc0-4747-40af-8a21-de2e822fa2de	72565323-5cb6-41a8-b6d7-6adc1c8f403c	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.93	ACTIVE	\N	2026-09-13 20:44:57.93	2026-09-13 20:44:57.93
524dd648-63e6-47df-8ab2-08191d30764c	cdf85e82-153a-4bf5-9df6-9a3dbd695236	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.931	ACTIVE	\N	2026-09-13 20:44:57.931	2026-09-13 20:44:57.931
87992e52-409c-4b5c-b396-1c1367849e5a	edfd5e8a-7d01-459f-82a2-224c8bc63765	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.933	ACTIVE	\N	2026-09-13 20:44:57.933	2026-09-13 20:44:57.933
5282eb42-2a93-430c-a893-3a37e4067f5c	05548622-0a49-4447-8c64-df95263e9a01	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.934	ACTIVE	\N	2026-09-13 20:44:57.934	2026-09-13 20:44:57.934
9a06b266-5e71-4d18-95e4-2421a16a7eeb	04be5280-174a-4d46-93de-0d876dc7a6ba	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.935	ACTIVE	\N	2026-09-13 20:44:57.935	2026-09-13 20:44:57.935
2c180a9c-37e7-46ce-ad2b-19ee2193eb0f	0628496b-ea48-4b3a-bdff-293e13b30a25	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.936	ACTIVE	\N	2026-09-13 20:44:57.936	2026-09-13 20:44:57.936
fc6bd937-ecfd-468c-8f53-3cf6fbfebf40	7e79f204-7853-4dbb-a710-40012aff9207	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.938	ACTIVE	\N	2026-09-13 20:44:57.938	2026-09-13 20:44:57.938
f72ee216-1dc1-4b81-b223-2d846229b02c	7e0dd76f-8cbe-4a2e-8168-faac87c1f1ad	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.939	ACTIVE	\N	2026-09-13 20:44:57.939	2026-09-13 20:44:57.939
af3b35fc-b2ec-42a7-b168-5539034a3d41	583e6bfe-6f58-4fe1-847d-30822380a452	ff42bd2a-b0fc-4fc6-bccd-6695b00cd804	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.94	ACTIVE	\N	2026-09-13 20:44:57.94	2026-09-13 20:44:57.94
9be466cd-7b32-44ba-ae82-493535b0aa1f	03e5641a-5d4b-4f9a-9d26-042a26302e53	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.942	ACTIVE	\N	2026-09-13 20:44:57.942	2026-09-13 20:44:57.942
890beb78-2173-450e-87af-d5fe3438d613	61bbe3b5-3923-492e-8656-cf8fd054f7ac	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.944	ACTIVE	\N	2026-09-13 20:44:57.944	2026-09-13 20:44:57.944
bed6d4c4-4081-4eb2-8a1a-7fd3811275de	dbdc809a-b0af-4a1b-8e45-613860524904	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.946	ACTIVE	\N	2026-09-13 20:44:57.946	2026-09-13 20:44:57.946
c09befd0-bc5d-4fb3-a00c-a750a279fa3a	9692cf22-16c3-4793-9b57-1cef9b8ea122	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.947	ACTIVE	\N	2026-09-13 20:44:57.947	2026-09-13 20:44:57.947
d599235a-9e2a-410a-bad6-e4ce28d23a77	7c30d097-fd68-4c8d-8976-bc1b29f5559f	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.948	ACTIVE	\N	2026-09-13 20:44:57.948	2026-09-13 20:44:57.948
9b3fdcb6-e6ed-4a35-9b88-603f4e753c96	7b3fef16-c748-4690-abc8-b905b8a506f0	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.95	ACTIVE	\N	2026-09-13 20:44:57.95	2026-09-13 20:44:57.95
64832586-7a05-4256-82ef-f7b47c23bdeb	73e18686-580a-49d7-9b9d-0b3708f04464	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.951	ACTIVE	\N	2026-09-13 20:44:57.951	2026-09-13 20:44:57.951
550d2b54-4047-4d84-96a5-0687b07de398	93efbf0d-5722-463c-920e-3f6cde6dafb3	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.953	ACTIVE	\N	2026-09-13 20:44:57.953	2026-09-13 20:44:57.953
059c0a88-94cb-47ec-ab2a-f622e4a45f1d	063b26ee-2306-45fc-97bb-0ae96431397e	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.954	ACTIVE	\N	2026-09-13 20:44:57.954	2026-09-13 20:44:57.954
039d5fea-6c70-4893-95d8-187636adfc58	fc032dd7-67a6-4d19-a9c9-0055a37ccb0d	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.955	ACTIVE	\N	2026-09-13 20:44:57.955	2026-09-13 20:44:57.955
a47f9239-86ec-4f1a-8936-ba51df80cf26	83095788-b897-4177-90de-46b08398c73c	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.957	ACTIVE	\N	2026-09-13 20:44:57.957	2026-09-13 20:44:57.957
7099ec50-adcb-4141-b7a9-21f0033d6564	08bb6ad5-78ce-428b-bb32-c914dae62cae	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.958	ACTIVE	\N	2026-09-13 20:44:57.958	2026-09-13 20:44:57.958
e7de6df5-9329-458f-a554-34c8fa1af39a	fcd7cf73-24f0-4bd3-ac03-8bf6fa94a44b	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.961	ACTIVE	\N	2026-09-13 20:44:57.961	2026-09-13 20:44:57.961
35e115fd-fbb2-437a-8ca7-70099f40e285	5469d803-f18e-408a-bcb5-a48dcbcecd5f	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.962	ACTIVE	\N	2026-09-13 20:44:57.962	2026-09-13 20:44:57.962
f26b4783-fdaa-4f32-8c58-36eeb60725d7	ff51e1cb-67de-49e8-b912-1d5083257032	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.964	ACTIVE	\N	2026-09-13 20:44:57.964	2026-09-13 20:44:57.964
74176527-9a25-4f27-b291-9f55f9bf8604	e6e5b06e-0d92-4ec2-8126-d4deed635dd0	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.965	ACTIVE	\N	2026-09-13 20:44:57.965	2026-09-13 20:44:57.965
292b46c0-c14d-4fa8-9c5a-b0cc20abdb00	2ea1ed74-1447-4bd0-8166-af1df8505695	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.966	ACTIVE	\N	2026-09-13 20:44:57.966	2026-09-13 20:44:57.966
dd8462ff-141e-4121-86b8-b8c068f06322	434d80bb-880d-4d9b-a341-f28f4ea36123	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.968	ACTIVE	\N	2026-09-13 20:44:57.968	2026-09-13 20:44:57.968
f4c1f3ca-0c34-4996-ba0a-0a04ca1e62c0	61b8f944-1aaa-4fa3-96f4-ac2f1465d898	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.969	ACTIVE	\N	2026-09-13 20:44:57.969	2026-09-13 20:44:57.969
ccb9fd2e-30d8-4ddf-8bb0-e5a297620732	24171877-80e7-48c8-aac3-2354afe69002	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.97	ACTIVE	\N	2026-09-13 20:44:57.97	2026-09-13 20:44:57.97
4456b9cb-17ff-4b9e-8041-f35e861fcb10	805f4689-e9cc-4fa0-b6ba-07f10fd80a7a	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.972	ACTIVE	\N	2026-09-13 20:44:57.972	2026-09-13 20:44:57.972
3fb67113-f7cc-4c6b-ae14-af6e19883b3d	7c297376-0e37-462c-808b-9de55c7a79b5	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.973	ACTIVE	\N	2026-09-13 20:44:57.973	2026-09-13 20:44:57.973
157b93a0-586d-4c29-b08a-d7210c2636d1	f4abba4a-617c-4392-a4aa-8cfb8093642a	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.974	ACTIVE	\N	2026-09-13 20:44:57.974	2026-09-13 20:44:57.974
e2418df0-7611-4fd7-a959-afdfa3c8b463	ed89db4a-528b-46be-82b0-b8208937a205	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.976	ACTIVE	\N	2026-09-13 20:44:57.976	2026-09-13 20:44:57.976
386d3b3d-d2a1-452e-a4f9-eab0fe493579	83e7aa66-e9dd-4c2a-a267-45ecc8abe183	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.978	ACTIVE	\N	2026-09-13 20:44:57.978	2026-09-13 20:44:57.978
7889cb8b-6e27-4335-a3bb-55c257fb8590	6be872a4-e732-4d7a-b3df-b73d421f9e7a	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.98	ACTIVE	\N	2026-09-13 20:44:57.98	2026-09-13 20:44:57.98
7b8b36a5-1d54-4baf-bc71-9b66fa207c44	a61542af-d244-4187-966b-322a9bad42a0	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.981	ACTIVE	\N	2026-09-13 20:44:57.981	2026-09-13 20:44:57.981
1e3d5b33-7597-4910-9540-08699adae1fe	2cf16cbf-eaa3-469b-94fb-289438e37ed1	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.982	ACTIVE	\N	2026-09-13 20:44:57.982	2026-09-13 20:44:57.982
b3ce3e0d-1ba4-48f5-bf3c-7a336c4c0e29	aedc1909-bdd1-450e-80bd-29e0f47c323d	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.984	ACTIVE	\N	2026-09-13 20:44:57.984	2026-09-13 20:44:57.984
51f922be-49fe-4700-8fc1-9b723eb4f730	26b82c1d-4cf0-4258-8ef8-3b0d62434258	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.985	ACTIVE	\N	2026-09-13 20:44:57.985	2026-09-13 20:44:57.985
537fe6b8-73c1-44f2-b323-c94583c4a5ce	ffda5bfd-8231-4864-a249-775c2bf9be3d	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.987	ACTIVE	\N	2026-09-13 20:44:57.987	2026-09-13 20:44:57.987
d0081b26-0d3a-40aa-b505-a222195ba5b6	802a86f0-1b21-40e7-8fe2-117892a46c08	f4461422-bd1d-4b15-9d5c-632a70e03a91	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.988	ACTIVE	\N	2026-09-13 20:44:57.988	2026-09-13 20:44:57.988
e2852dd2-86ce-4417-92f7-6c16afbbaa46	fe8d241e-e561-4f9c-8b1f-fa3328403d98	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.989	ACTIVE	\N	2026-09-13 20:44:57.989	2026-09-13 20:44:57.989
530b347f-a86a-45a4-ab06-4fa57646229c	904c6a73-27a6-41d8-b148-c34e406e54d5	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.991	ACTIVE	\N	2026-09-13 20:44:57.991	2026-09-13 20:44:57.991
355ba1b4-7184-4985-9787-c6cc2f2e6cf7	eb762a84-fe59-4fc5-b018-5c9d7e155b65	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.992	ACTIVE	\N	2026-09-13 20:44:57.992	2026-09-13 20:44:57.992
b41818fe-0d0f-4a31-b0db-aa46c0c30525	3148136c-09c6-46e1-a7e5-3e237882ee7c	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.995	ACTIVE	\N	2026-09-13 20:44:57.995	2026-09-13 20:44:57.995
eb81c815-3dba-4705-abd8-98f32ee51d4d	e9a4e7bc-7ecf-4444-8f0f-9278de4e69eb	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.996	ACTIVE	\N	2026-09-13 20:44:57.996	2026-09-13 20:44:57.996
9abba45e-628d-42db-b215-f3f03fb14be9	74beb92c-7527-4d93-997d-10cea4bffae5	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.997	ACTIVE	\N	2026-09-13 20:44:57.997	2026-09-13 20:44:57.997
23eac85d-4c77-499c-b538-08ff7d4dbd0d	2b62d3fb-4e37-4267-9f92-1cabc2246d98	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:57.999	ACTIVE	\N	2026-09-13 20:44:57.999	2026-09-13 20:44:57.999
3732dcda-6e1c-4736-bc10-2b692f7087a8	4dab460f-e6a6-4741-8f55-d9e6ba12e410	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58	ACTIVE	\N	2026-09-13 20:44:58	2026-09-13 20:44:58
66130c84-b908-42f1-ab1b-120163a5bb97	8e40d5c5-bb76-43d2-ab3e-ea21d15c0597	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.001	ACTIVE	\N	2026-09-13 20:44:58.001	2026-09-13 20:44:58.001
1a9c3770-f21f-48e9-98d8-6d21f3dc5f37	7af7c0ef-1cbd-4332-a0a5-150a6384669a	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.003	ACTIVE	\N	2026-09-13 20:44:58.003	2026-09-13 20:44:58.003
be4a57c6-80a4-4973-a6e8-7b72730ee91e	114eaf1a-98f7-41de-a063-c2fa33b42748	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.004	ACTIVE	\N	2026-09-13 20:44:58.004	2026-09-13 20:44:58.004
f1935873-3288-49be-b605-be6d9014977a	81c33f7b-34f6-4ca4-a113-c827bba8f7d8	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.005	ACTIVE	\N	2026-09-13 20:44:58.005	2026-09-13 20:44:58.005
2e4a13ba-1d2c-4161-b1e0-14c3283f73ac	7feae5ec-fabf-42fa-b97c-d9d9b67d9d13	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.007	ACTIVE	\N	2026-09-13 20:44:58.007	2026-09-13 20:44:58.007
412af1cf-afed-4639-a329-bcccff3c8a81	210ad422-de50-49bb-ad06-2c1514889b18	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.008	ACTIVE	\N	2026-09-13 20:44:58.008	2026-09-13 20:44:58.008
446bd495-d038-4727-bde5-0de6db1771b0	c98364c3-6195-4afe-81b7-d290a4497ec1	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.011	ACTIVE	\N	2026-09-13 20:44:58.011	2026-09-13 20:44:58.011
e3d1713d-8af7-4d0a-b40d-4ac8efd4164b	924565ce-18e7-4bb0-8c79-163af22eba76	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.012	ACTIVE	\N	2026-09-13 20:44:58.012	2026-09-13 20:44:58.012
9cdd2f42-d53c-4da4-9c13-695dcbbc82a3	1c91d9aa-032a-4f2b-a1f1-c3f1662e0ac7	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.013	ACTIVE	\N	2026-09-13 20:44:58.013	2026-09-13 20:44:58.013
43cc2de4-48ad-4d20-b6e3-179c408bf151	d149ba3b-c5eb-47ed-a4e2-385ae235e086	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.015	ACTIVE	\N	2026-09-13 20:44:58.015	2026-09-13 20:44:58.015
7bcfee2f-2d19-4c4b-943b-4ad1b3f8dd17	85bec907-07ce-45fe-acfb-4fd5be44d452	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.016	ACTIVE	\N	2026-09-13 20:44:58.016	2026-09-13 20:44:58.016
08b9fabb-d149-4f5d-adb5-204af1dd18c4	af9770cd-20ca-42ea-bc63-3022e790490a	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.018	ACTIVE	\N	2026-09-13 20:44:58.018	2026-09-13 20:44:58.018
bd1983fb-b17e-4bbd-bcc3-32eeb2d1899c	b13b1030-a24c-4eff-881b-03ef375989e2	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.019	ACTIVE	\N	2026-09-13 20:44:58.019	2026-09-13 20:44:58.019
c44d968b-0522-4484-abd6-798491dbfc1e	3b599119-358f-4ec3-9c1e-5952dfbd7c30	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.02	ACTIVE	\N	2026-09-13 20:44:58.02	2026-09-13 20:44:58.02
b5cdaa3d-d01a-4e61-8c87-1f946f069d8c	2968a3a7-b8c7-4c18-9db0-82cf851c8172	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.022	ACTIVE	\N	2026-09-13 20:44:58.022	2026-09-13 20:44:58.022
e7cebe4c-4595-4a4e-ace9-b21a26d1d911	dc744523-b1ef-4050-8474-88db0e699600	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.023	ACTIVE	\N	2026-09-13 20:44:58.023	2026-09-13 20:44:58.023
3104f4fd-f88f-46e8-914d-20cf8d687b0e	51e0f092-ddaf-4288-8a8f-a771cb31136a	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.024	ACTIVE	\N	2026-09-13 20:44:58.024	2026-09-13 20:44:58.024
a6542602-cc0a-403e-962f-0414dbf078fe	51793da2-caf2-4385-b7c5-f1c8a790c3aa	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.026	ACTIVE	\N	2026-09-13 20:44:58.026	2026-09-13 20:44:58.026
4f0309f4-5494-4f1a-998d-106a2d9cd9de	d55e7a63-48cf-4914-a6c6-bd9814f80c50	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.028	ACTIVE	\N	2026-09-13 20:44:58.028	2026-09-13 20:44:58.028
961e8aad-fd8d-43ff-a6db-722dd3df0996	f0a06e77-b897-4397-8853-d4319d840d12	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.03	ACTIVE	\N	2026-09-13 20:44:58.03	2026-09-13 20:44:58.03
61bd48ff-c175-454c-b4ac-55e9c063bc9c	90c9a231-4d00-47c0-b3c3-4de63e4699b7	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.031	ACTIVE	\N	2026-09-13 20:44:58.031	2026-09-13 20:44:58.031
321fb4ae-014c-4fce-ae89-c0dd7d51ff14	67f8646b-c1a7-4643-825a-767929cdc629	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.032	ACTIVE	\N	2026-09-13 20:44:58.032	2026-09-13 20:44:58.032
b4999f29-ff26-4974-84b6-d543c2c3e107	8d81b3f7-5a4d-490d-969a-34c4a5fee100	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.034	ACTIVE	\N	2026-09-13 20:44:58.034	2026-09-13 20:44:58.034
a896d193-20c0-4691-a8af-3af4d2b24a71	a9313553-0b35-42e3-ae7c-79b1574fe949	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.035	ACTIVE	\N	2026-09-13 20:44:58.035	2026-09-13 20:44:58.035
59a3dc99-c605-40aa-a8c0-35a2253c820b	917200de-45d2-43b6-968c-2d6b5c341637	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.036	ACTIVE	\N	2026-09-13 20:44:58.036	2026-09-13 20:44:58.036
52a38706-b452-4dd9-8f6c-ff5a168073c5	11f8a439-aeaf-442b-983f-1840e865e91b	46ed53e9-0a85-4dc6-a0ee-e77e06103412	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.038	ACTIVE	\N	2026-09-13 20:44:58.038	2026-09-13 20:44:58.038
9ae784d1-fca0-461c-8ffd-1bbaad28a291	fa9035cd-6be0-4e65-8712-f220cfb6d13a	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.039	ACTIVE	\N	2026-09-13 20:44:58.039	2026-09-13 20:44:58.039
2306db23-c9de-45bb-bc7a-33cdb896c4ca	be6ca030-8c44-4e7f-80d6-57e4fc64fc05	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.041	ACTIVE	\N	2026-09-13 20:44:58.041	2026-09-13 20:44:58.041
6bfba9da-ddc0-42c8-90fa-aad12facf575	472a5f35-6723-45ad-8046-75dac28e69fb	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.042	ACTIVE	\N	2026-09-13 20:44:58.042	2026-09-13 20:44:58.042
4c645fbd-4bc0-42ca-a032-676eccdd8a95	37fba44e-68f8-4e03-9a16-d60aa2c57783	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.044	ACTIVE	\N	2026-09-13 20:44:58.044	2026-09-13 20:44:58.044
96fe7157-0bd7-44fe-9381-61271d68ef72	2cf05db4-7273-4d13-9521-68c7117c718b	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.046	ACTIVE	\N	2026-09-13 20:44:58.046	2026-09-13 20:44:58.046
3d972c95-7565-4fc3-b802-d261a040d742	41200b14-9800-4ee2-8ce6-efb702589497	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.047	ACTIVE	\N	2026-09-13 20:44:58.047	2026-09-13 20:44:58.047
679c18cd-7271-4830-bd2d-623123935743	c3db6be0-020c-40b1-9bb8-a8106b141176	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.049	ACTIVE	\N	2026-09-13 20:44:58.049	2026-09-13 20:44:58.049
05bb3856-f7cd-4b3e-b49f-e6db4f80d50a	9a0d9310-f7cd-4cdc-9b2d-a188bf66c776	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.05	ACTIVE	\N	2026-09-13 20:44:58.05	2026-09-13 20:44:58.05
c80ec9d9-81e9-4d0a-b04b-65f33514e851	b8935819-70c1-4769-ba6d-38c8558cc6a4	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.051	ACTIVE	\N	2026-09-13 20:44:58.051	2026-09-13 20:44:58.051
e4a66df1-f086-4735-a478-ce8c791a0ae4	140770fc-a109-4aad-90a6-3e1f7891f1a4	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.053	ACTIVE	\N	2026-09-13 20:44:58.053	2026-09-13 20:44:58.053
25df8936-5ede-4d02-909f-0d2dc9774972	2ff0469d-531e-424c-b9e5-858fef5ed245	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.055	ACTIVE	\N	2026-09-13 20:44:58.055	2026-09-13 20:44:58.055
145da778-a0e5-4473-b6a9-9a04cc670af1	9e5a7847-30ee-4368-838a-910e06eba130	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.056	ACTIVE	\N	2026-09-13 20:44:58.056	2026-09-13 20:44:58.056
05a02f85-177a-4cc6-a43f-0952b93659c0	1cc3be73-3717-48b6-9bce-06db0b00f47b	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.057	ACTIVE	\N	2026-09-13 20:44:58.057	2026-09-13 20:44:58.057
00614281-2cdf-4716-8d75-175d261bc62e	c0af3290-4650-4b41-b8d1-a7ce94c6737c	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.059	ACTIVE	\N	2026-09-13 20:44:58.059	2026-09-13 20:44:58.059
a51e1a98-7ca6-4283-ba9a-08dd6c8388f6	9bc5b534-0024-4029-b039-03a28cc8b615	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.061	ACTIVE	\N	2026-09-13 20:44:58.061	2026-09-13 20:44:58.061
b6b789ae-eb15-429b-bf93-95e9f1bae74f	8a902d37-9553-44e0-a50d-a17ea72d545b	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.063	ACTIVE	\N	2026-09-13 20:44:58.063	2026-09-13 20:44:58.063
49421259-0714-4c31-b442-fe170411d9f4	a5f804dd-a8e2-4716-bfed-23ebe7b9628b	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.064	ACTIVE	\N	2026-09-13 20:44:58.064	2026-09-13 20:44:58.064
bd4f3f68-eac4-4932-a1b2-fd642e294ab4	1cb503af-5228-4f5d-b174-06b83fac378c	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.066	ACTIVE	\N	2026-09-13 20:44:58.066	2026-09-13 20:44:58.066
26ee9845-486a-487d-9e93-82f87ef5e732	206fcf53-9202-454f-9fe9-b74b514126cf	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.067	ACTIVE	\N	2026-09-13 20:44:58.067	2026-09-13 20:44:58.067
032d92f9-90d7-4a9c-bb29-1ba1def72e26	b1c0a69c-ce3a-4109-b6ce-f1facda1f231	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.069	ACTIVE	\N	2026-09-13 20:44:58.069	2026-09-13 20:44:58.069
a00866fe-fd33-4f04-a304-d079a6cb5821	1199abf4-839f-42bc-97bd-fa2ff154be56	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.07	ACTIVE	\N	2026-09-13 20:44:58.07	2026-09-13 20:44:58.07
e5983631-13c6-4c30-8f8a-1a67abc662b7	d3016866-85e8-43b5-89f5-0d7f1989d04d	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.072	ACTIVE	\N	2026-09-13 20:44:58.072	2026-09-13 20:44:58.072
64a8edbf-45e4-484b-b784-4e7de2d8d43f	6496d613-3704-496d-941f-6cb1423256dd	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.073	ACTIVE	\N	2026-09-13 20:44:58.073	2026-09-13 20:44:58.073
9d02ba86-7ec2-404b-b2e8-3b6103ab7f33	01cdc6c4-65a7-4063-8886-b6d4acabb1b7	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.074	ACTIVE	\N	2026-09-13 20:44:58.074	2026-09-13 20:44:58.074
d491e097-8fda-4bb7-b48c-c6674eaeadbd	f3b5e066-1343-4d79-b90b-4ba673228066	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.076	ACTIVE	\N	2026-09-13 20:44:58.076	2026-09-13 20:44:58.076
60db0a6e-b494-455c-b428-5a52700ccb65	daeef27c-d1d9-4e7c-92ab-33b15f4d9e3b	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.078	ACTIVE	\N	2026-09-13 20:44:58.078	2026-09-13 20:44:58.078
ff78ab20-59b6-43b8-9549-e095f80e3fb4	087acdc7-5d66-45b0-9831-cb025c02953d	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.08	ACTIVE	\N	2026-09-13 20:44:58.08	2026-09-13 20:44:58.08
51da2c75-086e-4de0-b2b1-6eb593323e0c	f6fd40c1-eb76-41a4-a007-fcfdaddf5a9e	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.081	ACTIVE	\N	2026-09-13 20:44:58.081	2026-09-13 20:44:58.081
b9e4587a-5037-4907-a79e-02b3e63a87c4	f6d64921-9e8f-44dd-b518-66d7d68b351f	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.082	ACTIVE	\N	2026-09-13 20:44:58.082	2026-09-13 20:44:58.082
6d8b367b-a88b-4325-8f99-5a37f272163b	e87605c6-e2d5-42f7-90b0-4bac5b508379	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.084	ACTIVE	\N	2026-09-13 20:44:58.084	2026-09-13 20:44:58.084
700bc967-62bb-4cf1-b164-1d03a508e245	9e2cbc76-60f1-482e-8b36-bbfe7996a220	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.085	ACTIVE	\N	2026-09-13 20:44:58.085	2026-09-13 20:44:58.085
ebc82ba2-0abc-4312-8089-9abfd08290fe	f21b473a-6607-4d05-8e70-a031dfd55a3e	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.086	ACTIVE	\N	2026-09-13 20:44:58.086	2026-09-13 20:44:58.086
7aa13204-1b25-4a75-801d-e1c7eda3ad7b	e014e93b-85ce-4642-a7b0-5caff29bb533	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.088	ACTIVE	\N	2026-09-13 20:44:58.088	2026-09-13 20:44:58.088
ec4f9e28-63a5-46ac-b0e4-786bd8b02f67	2a2a7f20-69ce-4987-a77b-b59a6fc33730	092356cd-370b-4efd-977b-81e7c079cc9c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.089	ACTIVE	\N	2026-09-13 20:44:58.089	2026-09-13 20:44:58.089
ff53c493-2d20-486c-a2cc-ae8ea38d49dc	c7ef286b-9bff-4d4b-bbf5-c3226a15858a	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.091	ACTIVE	\N	2026-09-13 20:44:58.091	2026-09-13 20:44:58.091
e3f71a35-2ffe-404d-8e56-415a94afee69	0c84c1e0-4a77-4524-8beb-3b6c132c19c7	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.092	ACTIVE	\N	2026-09-13 20:44:58.092	2026-09-13 20:44:58.092
d7c54995-422f-4c53-8638-e4e05b58e981	a2a1a504-3b8f-4c03-aa80-4b1cab767ad1	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.094	ACTIVE	\N	2026-09-13 20:44:58.094	2026-09-13 20:44:58.094
88029bfa-0970-4929-9a64-b0f1a283e8fd	a40306a3-40d6-4a00-9b33-96a27666ad82	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.096	ACTIVE	\N	2026-09-13 20:44:58.096	2026-09-13 20:44:58.096
b876f32b-acac-439d-8479-310896adb645	e14c68a9-be4b-4590-8dcd-9bf4ffb16f09	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.097	ACTIVE	\N	2026-09-13 20:44:58.097	2026-09-13 20:44:58.097
6b1f2f64-e011-4b09-b6f4-636fba83c2b4	b423fd1c-069b-4a2a-bea1-3d2a81b2203e	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.099	ACTIVE	\N	2026-09-13 20:44:58.099	2026-09-13 20:44:58.099
52558fd9-8562-405c-99c7-ad7a301f8b47	8118e53d-f790-49ec-9692-6224b6434a1e	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.1	ACTIVE	\N	2026-09-13 20:44:58.1	2026-09-13 20:44:58.1
480a87ee-1ee0-4728-9c75-d5ce4d5d5fa5	29cbadfd-8914-4b7f-9ff3-954b0ff6b0d7	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.101	ACTIVE	\N	2026-09-13 20:44:58.101	2026-09-13 20:44:58.101
c5f24689-546e-4728-aed6-c0a8b1c5e586	6a3b66d4-03fc-4b08-b4da-02899e7ea9b5	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.103	ACTIVE	\N	2026-09-13 20:44:58.103	2026-09-13 20:44:58.103
e31b080a-d668-4037-93bb-d52b6cf7a947	dc0e91f2-037f-4b6e-a6bf-32a84dfcd51b	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.104	ACTIVE	\N	2026-09-13 20:44:58.104	2026-09-13 20:44:58.104
3f6618aa-6c6f-47a5-93e7-f75a50e26d5b	1267245c-2f03-4041-adcc-625210bc69d5	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.105	ACTIVE	\N	2026-09-13 20:44:58.105	2026-09-13 20:44:58.105
2f0ed86d-d2a7-48a5-9097-e29dc5d48d07	95d73d73-b1f3-4920-aab3-0b181965ff03	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.107	ACTIVE	\N	2026-09-13 20:44:58.107	2026-09-13 20:44:58.107
9a94a794-5de0-4d25-917e-9d8a54876d53	f3ddea98-8538-4e9b-a0c2-35e8e7b5c431	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.108	ACTIVE	\N	2026-09-13 20:44:58.108	2026-09-13 20:44:58.108
a6a7697d-02dc-416a-b8bd-f1b6a33d286d	b4c305c7-f133-489f-87a5-01d919c6997a	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.11	ACTIVE	\N	2026-09-13 20:44:58.11	2026-09-13 20:44:58.11
a8cde0ca-ce46-4301-8f92-def75da64093	4cba09f7-1ef9-4e99-8718-1d48856d5307	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.112	ACTIVE	\N	2026-09-13 20:44:58.112	2026-09-13 20:44:58.112
ab35343c-f1f2-485e-a664-f7764262f81a	dab123e4-a6bf-43d6-95b7-d4b9d271658f	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.113	ACTIVE	\N	2026-09-13 20:44:58.113	2026-09-13 20:44:58.113
836fb065-0655-4441-ba6f-484f13f4ca99	bf483289-0eac-4170-a112-c737cc90ecd9	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.114	ACTIVE	\N	2026-09-13 20:44:58.114	2026-09-13 20:44:58.114
32c4098e-6be3-4719-ae9f-2b8bff04a13e	d30d5077-cf89-4126-a200-2fef1824692b	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.116	ACTIVE	\N	2026-09-13 20:44:58.116	2026-09-13 20:44:58.116
b51cf4da-1f8a-435e-9af1-14a09dd3e061	9bf6d443-f13f-4b66-b145-eb6b33f4cfe8	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.117	ACTIVE	\N	2026-09-13 20:44:58.117	2026-09-13 20:44:58.117
a282696d-15b9-498f-bbe8-3b55dd875e5f	62dfc8e6-33e8-40e5-babb-764953751340	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.118	ACTIVE	\N	2026-09-13 20:44:58.118	2026-09-13 20:44:58.118
190bd8b6-fc23-4679-a71d-23b7cab63479	81281743-f834-43e7-8151-63da97616637	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.12	ACTIVE	\N	2026-09-13 20:44:58.12	2026-09-13 20:44:58.12
516726a7-a887-49a1-a9bd-b178cbf43eaf	852b8232-7710-437e-aadf-07bfcae2c4d4	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.121	ACTIVE	\N	2026-09-13 20:44:58.121	2026-09-13 20:44:58.121
8eeaa0c5-ceeb-4a1e-b1b6-64218017e1ce	43c413c2-82e8-452d-bf35-955b65809386	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.123	ACTIVE	\N	2026-09-13 20:44:58.123	2026-09-13 20:44:58.123
f83b2fc9-5ad7-4e57-8740-a0c6024cd3db	6430d572-bea5-40fb-8ab3-bad4ba2fd74a	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.124	ACTIVE	\N	2026-09-13 20:44:58.124	2026-09-13 20:44:58.124
a0cabb56-9b36-4430-a950-04d0443ecfb9	9e2fd8dd-a2a9-4469-a9dd-670f34221f52	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.125	ACTIVE	\N	2026-09-13 20:44:58.125	2026-09-13 20:44:58.125
e773c634-25ac-4564-b711-325a592edc51	ebdb8c48-4e23-4d64-b12c-4a2664de4934	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.128	ACTIVE	\N	2026-09-13 20:44:58.128	2026-09-13 20:44:58.128
9aad2699-50d8-4ee1-982f-7b5a4e4a67c5	8b16d104-ed5a-4d1d-b8f6-cdcdc06e7ef2	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.129	ACTIVE	\N	2026-09-13 20:44:58.129	2026-09-13 20:44:58.129
acf0791e-00b1-4695-86f9-58291a5ded71	a19003e7-5f00-47cd-9c48-def13934488e	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.131	ACTIVE	\N	2026-09-13 20:44:58.131	2026-09-13 20:44:58.131
3f22ff69-f2bf-4583-b0e9-2f6020c2ec72	7c4bbd43-da92-4df3-b9b0-aebf1a31607f	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.132	ACTIVE	\N	2026-09-13 20:44:58.132	2026-09-13 20:44:58.132
df5ea536-7e88-4823-8b4a-c03871a2082f	77bca337-b59b-4913-93d2-f6ba9dcb9844	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.134	ACTIVE	\N	2026-09-13 20:44:58.134	2026-09-13 20:44:58.134
02ff345e-653e-426e-8955-5cf051c87bcd	1a564573-b33e-4a88-9ff3-f5154ea11973	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.135	ACTIVE	\N	2026-09-13 20:44:58.135	2026-09-13 20:44:58.135
3d414678-d77b-48d7-b007-586f5301f1d2	c96a15b8-45a6-4712-ab4c-66aec73b94db	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.136	ACTIVE	\N	2026-09-13 20:44:58.136	2026-09-13 20:44:58.136
21609f6f-eb44-4404-b9f2-093b1a046906	cf29247b-28d7-43b5-ad4f-c5d77b80b71b	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.137	ACTIVE	\N	2026-09-13 20:44:58.137	2026-09-13 20:44:58.137
0d24b09d-9d95-4b8c-a2a2-19c9a8963262	067cc675-01de-4ee3-8604-707c2d8ce6bd	0cdca144-b4e2-4f48-a7ce-b3689bb68312	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.139	ACTIVE	\N	2026-09-13 20:44:58.139	2026-09-13 20:44:58.139
e1ca9b20-8869-44b9-acb6-2f53457c69aa	c0e5e489-9d0a-4166-b587-479c5d22d87c	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.14	ACTIVE	\N	2026-09-13 20:44:58.14	2026-09-13 20:44:58.14
4f9cc654-2837-405c-bd9a-40183570328e	9017f017-f6e2-4d87-9499-3c7e88a6560c	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.141	ACTIVE	\N	2026-09-13 20:44:58.141	2026-09-13 20:44:58.141
6562703f-48ad-4c93-a6f1-ca864cd116de	c4ba888f-e9c7-452d-926e-d8dffb93ad14	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.144	ACTIVE	\N	2026-09-13 20:44:58.144	2026-09-13 20:44:58.144
808d3196-380f-4117-9635-d93ccbeab55b	5ad2055a-af69-49f7-a476-362c019770b1	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.145	ACTIVE	\N	2026-09-13 20:44:58.145	2026-09-13 20:44:58.145
d196345d-c732-439e-ad68-860cceb19d13	511dc581-94bf-4250-8e48-d51470c28b22	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.147	ACTIVE	\N	2026-09-13 20:44:58.147	2026-09-13 20:44:58.147
9098de7d-c252-4555-abb0-8377425e4ac1	da79cbd5-7da2-4f6c-979e-45f89d4c525c	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.148	ACTIVE	\N	2026-09-13 20:44:58.148	2026-09-13 20:44:58.148
f716ad70-0220-465a-af02-6b8283f651db	3b81c4e7-e1bf-4015-b44d-7b64ec1e3847	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.149	ACTIVE	\N	2026-09-13 20:44:58.149	2026-09-13 20:44:58.149
8f9fbafb-ebc7-4139-9ba2-c7aa2acdae64	8ac607d3-ffac-4c69-aded-9b1bfc7aecd6	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.151	ACTIVE	\N	2026-09-13 20:44:58.151	2026-09-13 20:44:58.151
197fed66-448d-4914-8ba1-73b75aa709d3	791e121e-a803-4e62-b024-4c146bcfefaa	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.152	ACTIVE	\N	2026-09-13 20:44:58.152	2026-09-13 20:44:58.152
d645fb19-8c5a-495f-b11a-f02e0d311a15	a150fe9b-8bab-48e3-8186-7b81b8399ff9	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.153	ACTIVE	\N	2026-09-13 20:44:58.153	2026-09-13 20:44:58.153
5d02162e-3b4b-4c1c-8150-1136544d7ad8	b09975b7-8238-45f7-a99a-d7316cad1969	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.155	ACTIVE	\N	2026-09-13 20:44:58.155	2026-09-13 20:44:58.155
dfb64da1-e9ce-4b33-92a5-719bdfe41988	4afb9e89-8fca-4bb8-8adc-7a835ffc3e00	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.156	ACTIVE	\N	2026-09-13 20:44:58.156	2026-09-13 20:44:58.156
9d70e749-1ce3-48ec-9438-dc115ef25e8e	07a58695-e8f4-4ec7-97b1-04a9996ee820	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.158	ACTIVE	\N	2026-09-13 20:44:58.158	2026-09-13 20:44:58.158
d070ebea-5908-40a3-b4e3-53c654d9a32e	01bfa2c4-d6e5-4a70-b009-1296dcb39323	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.16	ACTIVE	\N	2026-09-13 20:44:58.16	2026-09-13 20:44:58.16
31d266d8-4d91-47df-86c6-6a7cff3ad321	f0411034-fbdf-4c69-add1-d9496d7b5230	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.162	ACTIVE	\N	2026-09-13 20:44:58.162	2026-09-13 20:44:58.162
8d336849-15a0-46ec-a618-5e1634b3ea6d	3b8acf7a-fd91-4238-8dec-063994d777e9	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.163	ACTIVE	\N	2026-09-13 20:44:58.163	2026-09-13 20:44:58.163
b06e287a-4adb-4843-b98f-d09ded117044	fce15e1a-0635-41d1-8c91-b93fc11bec03	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.164	ACTIVE	\N	2026-09-13 20:44:58.164	2026-09-13 20:44:58.164
98b1409a-cf61-42e1-a35e-958518eb80ed	0d7db132-c33e-40fa-ab42-b90d249e56c5	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.166	ACTIVE	\N	2026-09-13 20:44:58.166	2026-09-13 20:44:58.166
37081ad8-4ad6-4920-971f-e92910680ffe	edb18c4d-e1a1-4a1e-969a-4fbbd33781b5	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.167	ACTIVE	\N	2026-09-13 20:44:58.167	2026-09-13 20:44:58.167
05429fdc-c7f2-45ce-bfae-13d7c23b10b0	fcc629fa-293e-4ddd-a2fc-6da72fbb7557	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.169	ACTIVE	\N	2026-09-13 20:44:58.169	2026-09-13 20:44:58.169
54d0166e-7a30-4ab1-b9e4-5f6facaace97	d651d7bf-f7a8-41f9-a02e-193350d4cd12	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.17	ACTIVE	\N	2026-09-13 20:44:58.17	2026-09-13 20:44:58.17
cd712fb8-5e70-4484-ba76-b6ec2f4cde23	60d5adff-a3fb-40e7-838f-9bc1746b91a8	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.171	ACTIVE	\N	2026-09-13 20:44:58.171	2026-09-13 20:44:58.171
ebd12c80-96f8-4622-a4ed-908f58633d37	286e0dca-c1b3-48dc-be40-03afd48f1462	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.173	ACTIVE	\N	2026-09-13 20:44:58.173	2026-09-13 20:44:58.173
9f848f97-d187-4948-827f-8d32183006b2	821a7098-3471-47cd-a0d4-2bda25a0341a	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.174	ACTIVE	\N	2026-09-13 20:44:58.174	2026-09-13 20:44:58.174
15c98607-c3b0-422f-a19e-493b328097f3	2a368447-5b9e-4b90-b083-78d68f4ef6d1	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.175	ACTIVE	\N	2026-09-13 20:44:58.175	2026-09-13 20:44:58.175
60757402-610a-4f9e-9144-cb89e86c5173	be2b6978-a8a5-4ffd-9aaf-753c4dd7b811	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.178	ACTIVE	\N	2026-09-13 20:44:58.178	2026-09-13 20:44:58.178
9c12d5a5-0b3a-4263-9b44-910d5bad1922	29956806-dacf-4b4c-8b43-7ecaaa6cbda5	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.18	ACTIVE	\N	2026-09-13 20:44:58.18	2026-09-13 20:44:58.18
6f2972c2-17e8-4dad-9147-fbee68e94363	5f6f409d-8833-48d7-ab50-eba23b589e2b	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.181	ACTIVE	\N	2026-09-13 20:44:58.181	2026-09-13 20:44:58.181
c6f9e86a-3f3d-44a5-8ec9-a52d6d8a1e2f	ebd998e1-51f7-43d1-9ebe-194364be5b19	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.183	ACTIVE	\N	2026-09-13 20:44:58.183	2026-09-13 20:44:58.183
93f4c904-ed7f-445f-b945-e4e771936a80	966d866c-4960-4175-9130-3fc50fed60c5	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.184	ACTIVE	\N	2026-09-13 20:44:58.184	2026-09-13 20:44:58.184
ca9fdf49-9408-40e9-880a-22d134767617	e610e128-f303-4df1-af98-a4f81276bc21	122df19b-51b0-41f5-89b1-173aba6537b1	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.186	ACTIVE	\N	2026-09-13 20:44:58.186	2026-09-13 20:44:58.186
780763bd-1c98-45a6-bebc-62ed99b94138	e447e70b-973d-442f-850b-ad7b3aa50629	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.187	ACTIVE	\N	2026-09-13 20:44:58.187	2026-09-13 20:44:58.187
7dc18856-73fb-4cb5-9405-c72c45887444	2d3ea941-f1f8-420e-bffa-ea64ca985735	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.188	ACTIVE	\N	2026-09-13 20:44:58.188	2026-09-13 20:44:58.188
ea63192f-21d7-481d-a9a4-64ad9ff35f75	0edaac4a-0a5b-4548-8d1f-3643db34415f	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.19	ACTIVE	\N	2026-09-13 20:44:58.19	2026-09-13 20:44:58.19
55a93d5d-df68-41be-9ca5-b04f442ac371	0c7fe13d-20aa-4532-8ad6-b8f13a9c1938	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.192	ACTIVE	\N	2026-09-13 20:44:58.192	2026-09-13 20:44:58.192
23b9e90c-9b30-49b8-8a95-699b08d785e5	b57dca02-26ec-4b27-a426-e9ef40bb1a6f	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.195	ACTIVE	\N	2026-09-13 20:44:58.195	2026-09-13 20:44:58.195
c369658c-7167-49fa-9dbf-47ab09ef9bed	52949bbd-4f0c-4d8f-b17e-4fe97cf6c1e5	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.197	ACTIVE	\N	2026-09-13 20:44:58.197	2026-09-13 20:44:58.197
dffb4eb8-d29f-4798-a647-12a6aee90466	9a8edced-1fa9-443d-b499-d4577882e9d0	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.198	ACTIVE	\N	2026-09-13 20:44:58.198	2026-09-13 20:44:58.198
b6f12a59-be2f-44b1-a1a3-f5341593cb06	523595db-cc72-4fc5-a124-d5af9e256c5b	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.199	ACTIVE	\N	2026-09-13 20:44:58.199	2026-09-13 20:44:58.199
ca293f9d-84a6-4eba-ac53-f842fe363087	846e4f8c-cb20-4914-af52-5e1b11fa51d0	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.201	ACTIVE	\N	2026-09-13 20:44:58.201	2026-09-13 20:44:58.201
71341273-ee2b-4a66-91d3-744b54f79a49	418f44ba-8bae-4c90-b918-19daa9f6d180	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.202	ACTIVE	\N	2026-09-13 20:44:58.202	2026-09-13 20:44:58.202
f1f8fbbb-95f3-408d-b0b5-11b2472d6bf6	7f30f24a-0489-44c1-ab73-1e3af30d523e	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.203	ACTIVE	\N	2026-09-13 20:44:58.203	2026-09-13 20:44:58.203
30243c4a-f9ec-43a4-95fb-0ebc93c4694d	bd495110-96ed-414e-ac9b-a45f65c855af	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.205	ACTIVE	\N	2026-09-13 20:44:58.205	2026-09-13 20:44:58.205
452fbecc-c056-4960-af88-aa884c17bf5e	5a6af662-e760-47c0-be18-61c9430775d8	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.206	ACTIVE	\N	2026-09-13 20:44:58.206	2026-09-13 20:44:58.206
5fab19ef-94c6-49a2-822c-9b7c9030b0b5	36aa5c85-1a50-4883-83ea-8c71b29772d7	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.207	ACTIVE	\N	2026-09-13 20:44:58.207	2026-09-13 20:44:58.207
7355a038-35bf-4100-adc6-4193631e8215	02558cb2-e7c1-4e41-92f0-49210b9790c5	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.209	ACTIVE	\N	2026-09-13 20:44:58.209	2026-09-13 20:44:58.209
3219ff15-03a8-43bd-a89f-f684b32e65bd	262ab8e6-48c5-4e10-8f76-11073748ca73	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.212	ACTIVE	\N	2026-09-13 20:44:58.212	2026-09-13 20:44:58.212
a1d3f58e-897e-439e-b63b-c21c5cb92fe9	f55ef774-b039-442e-bfd4-5cba00a6375d	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.213	ACTIVE	\N	2026-09-13 20:44:58.213	2026-09-13 20:44:58.213
6813e2d9-ca2b-4d32-ad1d-70b9d0cdfc12	921c578e-5f39-442e-8532-a542ee042e82	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.215	ACTIVE	\N	2026-09-13 20:44:58.215	2026-09-13 20:44:58.215
dca2ae2c-f563-4ec5-9cec-e06c8c88f6a9	ca9b9394-c449-48da-bf99-47927ab2d861	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.216	ACTIVE	\N	2026-09-13 20:44:58.216	2026-09-13 20:44:58.216
9e254ef6-3d05-467d-9a35-24d8e14efe9c	766e6bdf-d272-4d8e-817b-76e75c79c728	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.217	ACTIVE	\N	2026-09-13 20:44:58.217	2026-09-13 20:44:58.217
50e5c268-aaa7-4f9d-8984-e7828fec4151	28492db9-3dda-4a2c-90dd-57c70f79509e	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.219	ACTIVE	\N	2026-09-13 20:44:58.219	2026-09-13 20:44:58.219
af008ccb-6df1-49cf-b9a2-3f857449cf11	b6d63970-4b49-4c6a-b075-94344fa4eae9	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.22	ACTIVE	\N	2026-09-13 20:44:58.22	2026-09-13 20:44:58.22
d736c62a-ce38-40d8-bb0c-8c60af7702d6	15e744e0-094f-4d63-9586-288f64dbeadc	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.221	ACTIVE	\N	2026-09-13 20:44:58.221	2026-09-13 20:44:58.221
94969846-3316-4b6c-9f14-22cf12182e55	351319bb-1579-4e1a-b5de-9cf4daabddc8	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.223	ACTIVE	\N	2026-09-13 20:44:58.223	2026-09-13 20:44:58.223
a243dbd6-acfb-4c45-8a2d-2458a1f4b382	bdd39621-8876-4567-b495-e838b78f6d82	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.224	ACTIVE	\N	2026-09-13 20:44:58.224	2026-09-13 20:44:58.224
fd251afc-79b9-42cd-b99f-c15a7dbc244f	619ace34-d213-4c24-a921-5eb47769b876	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.225	ACTIVE	\N	2026-09-13 20:44:58.225	2026-09-13 20:44:58.225
e4f9f261-26e8-4680-88e2-098853d9f0c2	c1991970-2d6c-4fbb-a50b-a7eb9c5cab97	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.228	ACTIVE	\N	2026-09-13 20:44:58.228	2026-09-13 20:44:58.228
7b35eabb-83e7-4dfb-a9f5-254e36d7af23	5ac89434-f8a3-4dee-aafe-6288181f3b83	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.229	ACTIVE	\N	2026-09-13 20:44:58.229	2026-09-13 20:44:58.229
cf1f203e-d2da-4a01-bd73-88caddf9fd5c	fe418874-2e16-43d9-a461-fe2c0d7810c1	b4b7a6f1-835d-43e8-9d95-4fb977ebbb16	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.231	ACTIVE	\N	2026-09-13 20:44:58.231	2026-09-13 20:44:58.231
26bc8b87-288c-4c96-979c-73d30f2990cb	58e6c0aa-4e0f-4701-aab7-8c0aad878259	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.232	ACTIVE	\N	2026-09-13 20:44:58.232	2026-09-13 20:44:58.232
d2b603ce-d016-46d1-a4aa-b02caeed9393	e3ed413b-8e22-4403-b85b-9f7acf6505a4	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.234	ACTIVE	\N	2026-09-13 20:44:58.234	2026-09-13 20:44:58.234
05299f8c-ba50-42dc-9520-3c23a187a78a	02301c64-0a23-473b-95d8-9a0989b58960	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.235	ACTIVE	\N	2026-09-13 20:44:58.235	2026-09-13 20:44:58.235
0f15e577-43b5-45ab-acd6-51ffe3e5dc5d	cad6ad35-0eb0-4794-b307-13c6cb3e178c	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.236	ACTIVE	\N	2026-09-13 20:44:58.236	2026-09-13 20:44:58.236
594c0296-c4a1-4ea1-9f63-c815c5fdb441	ad2ebebc-d650-4391-afef-d8714033205a	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.238	ACTIVE	\N	2026-09-13 20:44:58.238	2026-09-13 20:44:58.238
141df527-e37d-4668-91f2-eb7c0247ab40	77b085a2-02bb-43f4-978d-650785bd524a	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.239	ACTIVE	\N	2026-09-13 20:44:58.239	2026-09-13 20:44:58.239
13ee4779-0507-43d0-9e34-5f7953f79e58	3d47293b-7b82-463f-a8b7-16cfcc1cb14a	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.24	ACTIVE	\N	2026-09-13 20:44:58.24	2026-09-13 20:44:58.24
220297dc-bb2c-4175-8dcc-22733d549b1d	9c82226a-86ab-45ed-ad5d-40a0c197d88d	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.242	ACTIVE	\N	2026-09-13 20:44:58.242	2026-09-13 20:44:58.242
da9dbf1c-865a-4c24-980d-b4375990a123	722240a0-9166-4a87-ad6e-3f1d75af9de6	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.244	ACTIVE	\N	2026-09-13 20:44:58.244	2026-09-13 20:44:58.244
ebe2fec1-ebbd-423f-b376-04acabafcaaf	59a0857f-0042-416f-b1bc-363ab4605457	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.245	ACTIVE	\N	2026-09-13 20:44:58.245	2026-09-13 20:44:58.245
20a40fb1-4138-4488-b1cc-745ec6b73471	b9f8b784-4871-481c-9a54-09b2277c4529	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.247	ACTIVE	\N	2026-09-13 20:44:58.247	2026-09-13 20:44:58.247
034917ba-13e5-4199-956b-3c85b31820c7	ce43f8a6-845f-4fe2-807b-2c6b2658fbae	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.249	ACTIVE	\N	2026-09-13 20:44:58.249	2026-09-13 20:44:58.249
e5f7506a-1052-4732-bb4f-ce42ae09ca65	d8d1d698-4b90-4542-a2e3-e98e2caab017	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.25	ACTIVE	\N	2026-09-13 20:44:58.25	2026-09-13 20:44:58.25
3f08a85d-26fd-42eb-a82c-4d1f3c9ea8ad	21f66f77-a701-4e25-a5fa-c530e7727644	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.251	ACTIVE	\N	2026-09-13 20:44:58.251	2026-09-13 20:44:58.251
ba082cff-1048-4db7-8b8a-e4d0a6b0588b	e30fb004-39f7-47c6-9080-657acd33ed2f	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.253	ACTIVE	\N	2026-09-13 20:44:58.253	2026-09-13 20:44:58.253
9195ae91-6828-4db6-b12f-514fb27b26b6	ba3f68cc-c845-4a2a-8eb9-63e8000bddbe	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.254	ACTIVE	\N	2026-09-13 20:44:58.254	2026-09-13 20:44:58.254
7aa6b267-d545-49f1-889a-08d8b9aa8289	59b3d399-6558-4577-aa80-c612400f6108	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.255	ACTIVE	\N	2026-09-13 20:44:58.255	2026-09-13 20:44:58.255
ca763034-b898-4f41-9fe4-634387e5ad8d	b8aff508-998c-4ab3-9c31-25d000e53c6c	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.257	ACTIVE	\N	2026-09-13 20:44:58.257	2026-09-13 20:44:58.257
2c53dfe5-93f1-475e-a21e-64a7cb571e1e	7cc1037a-0fd7-4fa1-9462-fa3ebca36891	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.258	ACTIVE	\N	2026-09-13 20:44:58.258	2026-09-13 20:44:58.258
8dd50b37-590f-4bb8-aa67-a71745cb006d	758fc4ac-c146-4e1f-a623-f0a5b65dd3b8	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.26	ACTIVE	\N	2026-09-13 20:44:58.26	2026-09-13 20:44:58.26
55b6ee37-ffaf-4308-a2df-4f65f28d273b	e44647e0-ff1f-4beb-bfb4-ed29b62ec606	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.262	ACTIVE	\N	2026-09-13 20:44:58.262	2026-09-13 20:44:58.262
0a648332-2daf-421f-b121-627b061104cc	395f0c63-1ecb-4a0b-ae78-e647759ba1bc	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.263	ACTIVE	\N	2026-09-13 20:44:58.263	2026-09-13 20:44:58.263
c5112286-f529-48b4-927a-0d87abb835e6	669c65e2-5cf7-4cff-861f-7a5b3ca0cedb	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.265	ACTIVE	\N	2026-09-13 20:44:58.265	2026-09-13 20:44:58.265
fc19a884-cc25-42b1-b101-0854e2e918b4	5c04b9c6-b9ba-4892-86fc-a56a78541095	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.266	ACTIVE	\N	2026-09-13 20:44:58.266	2026-09-13 20:44:58.266
867ca323-f6ba-4a69-9dad-b62b8f2e1867	424f8668-554d-4441-a5f2-56cd14d089ab	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.267	ACTIVE	\N	2026-09-13 20:44:58.267	2026-09-13 20:44:58.267
dfb01e0e-9c32-4d2e-9470-68e5c03d6923	43c5382d-470e-4a9b-ba5d-d02e82dd0877	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.269	ACTIVE	\N	2026-09-13 20:44:58.269	2026-09-13 20:44:58.269
e0fea7d7-515f-42ff-b644-47b212682ed5	74d6b00e-5ca7-42f7-baa6-fbcdb677bdbc	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.27	ACTIVE	\N	2026-09-13 20:44:58.27	2026-09-13 20:44:58.27
8799d052-09ed-46a9-80d2-bedbff15fe6d	2700e0ef-5640-42a9-aa40-628d56c70732	ac4c579b-8c62-46cf-bb7b-2e2b2240f299	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.271	ACTIVE	\N	2026-09-13 20:44:58.271	2026-09-13 20:44:58.271
6b5e3e56-16c3-4ab6-bdb8-57728589b24a	a01d0403-c8ec-4652-8615-38b4bf06e94b	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.273	ACTIVE	\N	2026-09-13 20:44:58.273	2026-09-13 20:44:58.273
261ab3ca-3fb0-4aba-a210-512913df64de	9dee391a-f247-413a-a89a-82cea94b8cdb	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.274	ACTIVE	\N	2026-09-13 20:44:58.274	2026-09-13 20:44:58.274
ad5f8d7c-729f-410c-8c8b-97183bf5d43c	28fa7308-2e01-4ee4-8548-31b38a8a5871	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.275	ACTIVE	\N	2026-09-13 20:44:58.275	2026-09-13 20:44:58.275
c2fe9905-640e-4f95-a90b-19fbd760dd60	c97eab28-ff4f-4b50-80d1-2bb76150aaa5	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.278	ACTIVE	\N	2026-09-13 20:44:58.278	2026-09-13 20:44:58.278
68c939cb-b8da-49f3-802a-8fca92927527	3a4152c3-a12e-4e99-9d04-6a5e704346b2	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.279	ACTIVE	\N	2026-09-13 20:44:58.279	2026-09-13 20:44:58.279
ee8a067f-1102-475b-b185-6ea9ab3c2194	c190915d-8e09-4ddc-980b-561d6f4b021a	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.281	ACTIVE	\N	2026-09-13 20:44:58.281	2026-09-13 20:44:58.281
3040ae00-898e-414e-a898-346b4a20b79f	fbf3ec95-d88c-45af-94a8-ccd6e344569b	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.282	ACTIVE	\N	2026-09-13 20:44:58.282	2026-09-13 20:44:58.282
952d4464-10de-4f15-bf60-8cae44f45d5e	65059b5c-0b02-4a43-ad01-e476722df430	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.284	ACTIVE	\N	2026-09-13 20:44:58.284	2026-09-13 20:44:58.284
2fee6f20-1132-4bc2-8d46-ceab1a48d019	16a4c38a-d8e9-494f-b8ac-201d1a83b9fe	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.285	ACTIVE	\N	2026-09-13 20:44:58.285	2026-09-13 20:44:58.285
d2df67f8-1142-43c3-a954-bcb294780f65	69c61af0-f44c-4bda-9622-b6ed8f3a70f6	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.286	ACTIVE	\N	2026-09-13 20:44:58.286	2026-09-13 20:44:58.286
c9319fbd-a10d-4a9a-a0c9-a8d5e736ee58	97d63a55-a58e-4eb5-ae57-615a41825971	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.288	ACTIVE	\N	2026-09-13 20:44:58.288	2026-09-13 20:44:58.288
753c0331-3146-4b74-8f8a-b4fd75de5ce4	21cee03f-a621-43b3-9b1b-389b226afbc8	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.289	ACTIVE	\N	2026-09-13 20:44:58.289	2026-09-13 20:44:58.289
c7ce67ab-ea12-44b1-9121-3af0cd4f37af	f8048b26-d3c8-4432-95e1-9d95b76ebc7f	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.29	ACTIVE	\N	2026-09-13 20:44:58.29	2026-09-13 20:44:58.29
6307ac78-e101-4bee-865c-5b99e74c2af9	ccc759c9-afec-4e55-81b1-d88f8aacb985	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.292	ACTIVE	\N	2026-09-13 20:44:58.292	2026-09-13 20:44:58.292
2a0432fe-979e-4207-97ed-72c5e977a552	f788a259-9e8e-45eb-80b1-ae4e2d03af95	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.295	ACTIVE	\N	2026-09-13 20:44:58.295	2026-09-13 20:44:58.295
4e20471d-8b81-44d1-ae1c-db70caf6537c	589eee32-de0d-4509-ae42-6ad41834b1e4	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.297	ACTIVE	\N	2026-09-13 20:44:58.297	2026-09-13 20:44:58.297
8fa1ef89-2252-4617-aa46-c0318985ecd7	24931acd-bd50-44d2-9162-2de0a5a9467a	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.298	ACTIVE	\N	2026-09-13 20:44:58.298	2026-09-13 20:44:58.298
f7ebb9d6-86f4-497a-ac19-eb99122ba7dc	439db0dd-7664-482d-aaff-aeb8c14f0f50	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.299	ACTIVE	\N	2026-09-13 20:44:58.299	2026-09-13 20:44:58.299
8e05eae4-cbe9-4c6d-a65f-b94e1170cfa3	7947e4fc-4e7b-44b0-89d7-f4f6594c209d	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.301	ACTIVE	\N	2026-09-13 20:44:58.301	2026-09-13 20:44:58.301
d03b09a7-0170-4ea0-8ed1-a6881d26eea6	4360e8b5-ed7c-4dec-acf3-705f87d61425	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.303	ACTIVE	\N	2026-09-13 20:44:58.303	2026-09-13 20:44:58.303
823ca2bc-62ec-4981-8234-eca27bf1b36c	cdc131da-bd78-4263-af52-d8c4e7f5d40b	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.304	ACTIVE	\N	2026-09-13 20:44:58.304	2026-09-13 20:44:58.304
e21eb1d0-45ac-4e46-ae8a-b618c1109883	37b90c0a-e003-46d9-a152-ffeda7935b3b	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.305	ACTIVE	\N	2026-09-13 20:44:58.305	2026-09-13 20:44:58.305
6ae1441b-f5bf-49a6-a378-a031fc35ee87	55458d38-5138-4145-b925-bd24093782b0	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.307	ACTIVE	\N	2026-09-13 20:44:58.307	2026-09-13 20:44:58.307
dbef169d-9ad8-493d-85c4-b890cc6e17bd	68ba8d6a-c2f1-488d-8975-d774013caf84	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.308	ACTIVE	\N	2026-09-13 20:44:58.308	2026-09-13 20:44:58.308
5c050fb8-ed49-4eec-905a-2f315de1fb48	04e8e588-8ebe-45ef-9dee-9653084525f6	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.311	ACTIVE	\N	2026-09-13 20:44:58.311	2026-09-13 20:44:58.311
ac8f94d2-da94-42fa-9e54-48373dca13ad	16523cfd-d8fa-46ee-be5a-1139288e24f1	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.312	ACTIVE	\N	2026-09-13 20:44:58.312	2026-09-13 20:44:58.312
e72884c1-3365-452e-a22d-479c7b0a7fa9	5edfc6d0-6193-42f3-b535-837f2321f8a0	7e635c97-8419-47c0-adad-bc035990e870	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.314	ACTIVE	\N	2026-09-13 20:44:58.314	2026-09-13 20:44:58.314
39935449-8597-4cb8-b38d-3222aa1d8b28	357671c1-5727-4ab4-a999-b4885b662600	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.315	ACTIVE	\N	2026-09-13 20:44:58.315	2026-09-13 20:44:58.315
c7eec8bf-bb9a-4db6-9ca7-585a4875ea53	19e1fa73-5111-4438-a4a0-9c799264052a	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.316	ACTIVE	\N	2026-09-13 20:44:58.316	2026-09-13 20:44:58.316
d33c37eb-a7af-43bf-a8c5-f88a9d068312	40d616c8-f389-438e-b906-db5627168896	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.318	ACTIVE	\N	2026-09-13 20:44:58.318	2026-09-13 20:44:58.318
78b11955-c0dc-4f23-a145-7ad7811f130d	2e9ad790-9a81-46ff-902f-7121d495ed00	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.319	ACTIVE	\N	2026-09-13 20:44:58.319	2026-09-13 20:44:58.319
0b8628b4-0da0-4996-880b-632a8682a4c1	bc6fc2dd-a240-47b8-a5a0-84df59b6bfbc	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.321	ACTIVE	\N	2026-09-13 20:44:58.321	2026-09-13 20:44:58.321
8ffb0992-caea-401a-bc92-f83e87eca7c8	b39b8d85-2bbd-4ade-9747-5dadf38c88e5	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.322	ACTIVE	\N	2026-09-13 20:44:58.322	2026-09-13 20:44:58.322
1e32a3e9-e51f-44de-b00c-f99b4ef4ec9a	cc08512c-8950-4ca6-82d5-596bcbdb9d44	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.323	ACTIVE	\N	2026-09-13 20:44:58.323	2026-09-13 20:44:58.323
f3f6d06c-659a-4c78-9b9d-bc9a34b55b78	90eede5c-19c7-4483-a517-e7a4efe5cb99	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.325	ACTIVE	\N	2026-09-13 20:44:58.325	2026-09-13 20:44:58.325
a28ce6a1-d7b6-4cff-8fa0-906b5479d10b	1422c8a6-60c7-400a-b2cd-f31399fb4af7	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.327	ACTIVE	\N	2026-09-13 20:44:58.327	2026-09-13 20:44:58.327
2c0a86f2-987f-4e54-8780-fcaa9c70b513	b1054161-9807-46f6-b0e8-746d615ead6b	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.33	ACTIVE	\N	2026-09-13 20:44:58.33	2026-09-13 20:44:58.33
6a67eb9b-677e-4a5b-8698-28973b240a06	fac91184-8f83-44ff-9e81-f97fafef0b53	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.331	ACTIVE	\N	2026-09-13 20:44:58.331	2026-09-13 20:44:58.331
fe98e31f-65d2-4dd3-88e2-ee49ade05627	1a2f18c9-602f-400b-92fd-10f773079e6a	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.332	ACTIVE	\N	2026-09-13 20:44:58.332	2026-09-13 20:44:58.332
dc23b28a-c445-4362-8b9c-6be440ef77fb	df82c5e6-107c-4cf5-acc5-a712b2b44b74	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.334	ACTIVE	\N	2026-09-13 20:44:58.334	2026-09-13 20:44:58.334
4b90489b-d184-42de-8c2a-35e2e9419a25	d303023c-3d52-4c1b-b084-3c5bef669a22	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.335	ACTIVE	\N	2026-09-13 20:44:58.335	2026-09-13 20:44:58.335
4340cd6d-f3d6-411b-8099-7c83714f88cb	1795b8f1-37ba-4568-acce-909bd5b6d7a3	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.337	ACTIVE	\N	2026-09-13 20:44:58.337	2026-09-13 20:44:58.337
bec2ad47-6050-4194-bb01-21f49962f0ff	8eaec05c-8a1c-4401-9ba7-70e868d7e23e	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.338	ACTIVE	\N	2026-09-13 20:44:58.338	2026-09-13 20:44:58.338
b3b34942-b910-446f-9fd9-fd69f8d5298c	43b9e83e-e043-49b7-8e9b-4a8b6793423d	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.339	ACTIVE	\N	2026-09-13 20:44:58.339	2026-09-13 20:44:58.339
6b086c11-a558-4f45-8998-324c854483bc	3831928e-c51e-4f28-8c0c-59bda08679d1	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.341	ACTIVE	\N	2026-09-13 20:44:58.341	2026-09-13 20:44:58.341
3efbe2e5-86d8-4ac2-8f39-1b6740d33c67	82901312-3fdc-4e72-82bc-b4704c4f9dc4	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.342	ACTIVE	\N	2026-09-13 20:44:58.342	2026-09-13 20:44:58.342
860ae870-dd95-45b1-80cb-aa1571f6b727	e46951ec-5a70-449d-8be5-bafee4aba3d7	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.345	ACTIVE	\N	2026-09-13 20:44:58.345	2026-09-13 20:44:58.345
d34fda94-5c53-462e-b7c1-3473cb38a003	b5b60303-611e-4529-a3b2-e1f4909e0d17	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.347	ACTIVE	\N	2026-09-13 20:44:58.347	2026-09-13 20:44:58.347
062adcfe-6a7f-45e4-af47-d6bba039615c	2b80af13-d48c-4958-b9a5-827ed06a0b2f	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.348	ACTIVE	\N	2026-09-13 20:44:58.348	2026-09-13 20:44:58.348
d3492afd-d776-4d8e-b722-dd4d1885a433	716879a2-c059-483a-9db7-a19b4658c9f8	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.349	ACTIVE	\N	2026-09-13 20:44:58.349	2026-09-13 20:44:58.349
f8171431-87c7-4603-b671-58fdb6a6696d	2ed78b13-51fd-4e43-9ca9-50991740ec26	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.351	ACTIVE	\N	2026-09-13 20:44:58.351	2026-09-13 20:44:58.351
cd406cf0-123a-4647-b00c-52350e67945f	f66b608e-f0f7-49d7-b2a4-0d1c97a0305d	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.352	ACTIVE	\N	2026-09-13 20:44:58.352	2026-09-13 20:44:58.352
4d3b14d1-16f3-4245-8df4-91517aa906fb	04213e37-3ed3-41f2-abf2-203942b24023	fbc3fb89-b7cd-441d-869b-e9c0bc06ab8b	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.354	ACTIVE	\N	2026-09-13 20:44:58.354	2026-09-13 20:44:58.354
32de4ba5-f12c-4361-9e20-2f8f3ba706c2	eaf48ca9-11a6-4811-8eab-3ade6b199035	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.355	ACTIVE	\N	2026-09-13 20:44:58.355	2026-09-13 20:44:58.355
4a8e3184-200d-4083-a2c4-09c42b0130b5	896174b1-e6db-49d1-a240-9fd4d36ea6e7	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.356	ACTIVE	\N	2026-09-13 20:44:58.356	2026-09-13 20:44:58.356
e09a429e-4fd8-4278-8498-453193cd753b	0a3e14a5-5347-476b-bc25-594156112236	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.358	ACTIVE	\N	2026-09-13 20:44:58.358	2026-09-13 20:44:58.358
b9101e0e-d232-4684-a9db-640aa9b9f243	e9eb4ec9-1b91-485f-b938-f46b598962b6	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.36	ACTIVE	\N	2026-09-13 20:44:58.36	2026-09-13 20:44:58.36
de057f97-3f6f-463e-bcd6-18e2de3f8905	dfbdacbe-74c6-4503-9927-6b825bec0ae5	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.362	ACTIVE	\N	2026-09-13 20:44:58.362	2026-09-13 20:44:58.362
e9a4c606-9364-43e3-a880-4b194af95944	08b5fc56-014a-4a41-8be6-6c7a07d10b6b	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.363	ACTIVE	\N	2026-09-13 20:44:58.363	2026-09-13 20:44:58.363
76dfc336-f746-4282-9cfc-62b01a6cb9c5	5c8ac4aa-b50e-4e08-af1e-698cdba2902a	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.365	ACTIVE	\N	2026-09-13 20:44:58.365	2026-09-13 20:44:58.365
6616f1a5-8fa2-4b96-86cf-a71c4ca18920	74044bfd-8fff-4e5c-abc7-97eeb3e7c0dc	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.366	ACTIVE	\N	2026-09-13 20:44:58.366	2026-09-13 20:44:58.366
da1ed9c3-688f-4ff5-8457-3bf1a7a5f2bc	22d2f976-1df3-47e6-8c15-96b90b114906	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.367	ACTIVE	\N	2026-09-13 20:44:58.367	2026-09-13 20:44:58.367
2518cc13-c4d3-4acc-afe2-ab2c295f9ecb	36c9c5bc-b466-4e9d-9c66-d9c75401dd44	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.369	ACTIVE	\N	2026-09-13 20:44:58.369	2026-09-13 20:44:58.369
6eeb5746-1c5b-40f8-8c36-f84df04c50f3	1d8eed30-3357-4a7a-9dad-1da9e2740b56	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.37	ACTIVE	\N	2026-09-13 20:44:58.37	2026-09-13 20:44:58.37
7199b40d-fe91-40c8-bf3b-5a08afa74be6	7b540380-3cb2-4ac2-8437-8348e8a72836	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.371	ACTIVE	\N	2026-09-13 20:44:58.371	2026-09-13 20:44:58.371
35fc90c9-97b2-4123-8c13-69671a31dcdc	8e6a6645-4393-40bd-9da3-113e9047475a	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.373	ACTIVE	\N	2026-09-13 20:44:58.373	2026-09-13 20:44:58.373
f1fed6fb-076b-4ce7-a550-bf81fcb7fff0	7d9c01c4-e838-431c-b860-5c6078a5c61c	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.374	ACTIVE	\N	2026-09-13 20:44:58.374	2026-09-13 20:44:58.374
eacf1a0a-97f6-4089-994e-4b737cc25600	e0f1b433-f13b-4ce1-952c-bc483990da99	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.375	ACTIVE	\N	2026-09-13 20:44:58.375	2026-09-13 20:44:58.375
19731c1b-559c-421e-adbb-63971ef55ed7	f50dabdb-f54f-49f5-895d-8c86b4f27ff7	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.378	ACTIVE	\N	2026-09-13 20:44:58.378	2026-09-13 20:44:58.378
8ffe935b-5586-4e9c-8724-9ad06099485d	c1be9e20-8251-436a-9edd-c557368fd7f0	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.38	ACTIVE	\N	2026-09-13 20:44:58.38	2026-09-13 20:44:58.38
3918fd28-8b50-4d21-8705-9a220b16be1f	5812fece-984c-4e04-b376-a4a823a63966	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.381	ACTIVE	\N	2026-09-13 20:44:58.381	2026-09-13 20:44:58.381
4e812371-3535-47c6-a078-0ce83e5ad267	0c28e5b5-a4db-4a0c-aba5-eb40c9645f6c	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.382	ACTIVE	\N	2026-09-13 20:44:58.382	2026-09-13 20:44:58.382
856cffd6-93a6-404d-b685-695f4f20969b	50163dd8-1ff0-489d-b3a1-535a84ad5ea9	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.384	ACTIVE	\N	2026-09-13 20:44:58.384	2026-09-13 20:44:58.384
e5f6974b-34fe-44e4-bc59-d02b54ae11a9	81c3a03f-2a57-49b7-b1ef-1bbc64feadb7	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.385	ACTIVE	\N	2026-09-13 20:44:58.385	2026-09-13 20:44:58.385
7aa590d3-dc86-4990-9a01-be0b6de3a611	9eddb95a-f25d-48cd-a07d-f61b3bb76af8	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.386	ACTIVE	\N	2026-09-13 20:44:58.386	2026-09-13 20:44:58.386
d102203e-32ed-4154-8b6e-c660127efb8d	d1e9a72b-fe3c-4882-8b0e-87ba3e1f8cbe	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.388	ACTIVE	\N	2026-09-13 20:44:58.388	2026-09-13 20:44:58.388
7f9a32e8-1eb7-4852-8580-fe3d70707cf3	cf7f149e-04b1-4def-b040-e844c3d5e87d	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.389	ACTIVE	\N	2026-09-13 20:44:58.389	2026-09-13 20:44:58.389
4e53b594-5e23-4992-a7cd-02798b9dd178	f622685d-feda-4cd9-a395-98f1cba83a20	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.39	ACTIVE	\N	2026-09-13 20:44:58.39	2026-09-13 20:44:58.39
d6b5d069-14b6-416f-8479-e719d5a15f1d	037756d2-8ec7-4d66-b978-50047e1b5608	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.392	ACTIVE	\N	2026-09-13 20:44:58.392	2026-09-13 20:44:58.392
827cd8aa-e3db-4037-9617-c730e2feeec1	277205d3-358a-416b-85e0-6737b3028977	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.394	ACTIVE	\N	2026-09-13 20:44:58.394	2026-09-13 20:44:58.394
3616d477-2473-4466-86a6-9cd18ac7e3d4	77b17341-2c87-4c02-afad-a0d7237aebd7	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.396	ACTIVE	\N	2026-09-13 20:44:58.396	2026-09-13 20:44:58.396
26ff638f-6c4d-47bd-860b-5cb74c77ccbb	f61de4be-8bba-440b-8da8-bf2a55339b55	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.397	ACTIVE	\N	2026-09-13 20:44:58.397	2026-09-13 20:44:58.397
878e1f36-5be8-4a3f-af98-7f05dd7584a4	d508e796-4a4f-4ec9-964a-db9b92c93821	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.399	ACTIVE	\N	2026-09-13 20:44:58.399	2026-09-13 20:44:58.399
c73a5a02-a0b0-4c2f-b3df-ca6d2232d092	8412ac30-dae1-4899-bdf7-0e5a33634b08	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.4	ACTIVE	\N	2026-09-13 20:44:58.4	2026-09-13 20:44:58.4
08a7ecf8-ce5b-4112-9a0e-f445ad8e5a45	378a3738-24df-4d92-ad3c-d43db2f96075	2f599623-8440-45f0-939d-7975f885156c	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.401	ACTIVE	\N	2026-09-13 20:44:58.401	2026-09-13 20:44:58.401
d6aafd29-4087-4212-8bce-d8ab801c7b81	f85d61c8-258b-43d9-ab72-67446852f52e	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.403	ACTIVE	\N	2026-09-13 20:44:58.403	2026-09-13 20:44:58.403
e871c05f-9615-41a5-b22f-60c4663be7cf	37aa4422-9fa4-426b-a3a7-4b55ff3a0f80	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.404	ACTIVE	\N	2026-09-13 20:44:58.404	2026-09-13 20:44:58.404
0f3449d1-fcc5-490c-85f5-7c2e042a3016	9f90ca64-2a5f-489f-9b5b-9ea890a3430f	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.406	ACTIVE	\N	2026-09-13 20:44:58.406	2026-09-13 20:44:58.406
c75f0c20-85cc-4a57-863f-caa47ea1974e	90495062-89e6-4988-8e01-ce8c1e2e810f	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.407	ACTIVE	\N	2026-09-13 20:44:58.407	2026-09-13 20:44:58.407
21ffd89c-641b-4c92-937b-3e2d5a83cfd0	e0546960-bb0c-40b9-a4f6-627da7bc73bb	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.409	ACTIVE	\N	2026-09-13 20:44:58.409	2026-09-13 20:44:58.409
b5f2e09c-c889-439a-afa2-afb52e99f4d9	c64275b0-f8bc-4a8a-a51c-34bbae8bf5ef	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.411	ACTIVE	\N	2026-09-13 20:44:58.411	2026-09-13 20:44:58.411
0ea6ae4c-646c-4031-9d48-36eb90a0a741	07dc9fec-b0ef-4fd0-8c01-3b008761c90e	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.413	ACTIVE	\N	2026-09-13 20:44:58.413	2026-09-13 20:44:58.413
594419d6-7782-41ef-b454-56f52cdaf7a3	8d83859a-2a19-4908-8425-2ddf153cc87d	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.414	ACTIVE	\N	2026-09-13 20:44:58.414	2026-09-13 20:44:58.414
ee6400cb-9017-48cc-8d5d-786582d90394	23f0659c-4123-47bc-adaf-5dd963516d9b	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.416	ACTIVE	\N	2026-09-13 20:44:58.416	2026-09-13 20:44:58.416
9d8183b3-8724-4d05-858f-924b7fcf2a5b	d38cf281-2f66-4fd2-9800-5350973e7c70	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.418	ACTIVE	\N	2026-09-13 20:44:58.418	2026-09-13 20:44:58.418
4d6a1eb8-b3a3-4c61-a9c2-75d9f70bd227	238f854d-0472-493d-9358-3bf102c379a3	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.419	ACTIVE	\N	2026-09-13 20:44:58.419	2026-09-13 20:44:58.419
d2da098d-37ac-4ba8-85d2-57f08668fe6a	518e1229-2785-43d6-8e73-12135db529f0	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.421	ACTIVE	\N	2026-09-13 20:44:58.421	2026-09-13 20:44:58.421
12a814c5-07bc-473b-83c4-e7bf56498325	cbfd683e-c16b-4632-bd7c-30a30009be58	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.422	ACTIVE	\N	2026-09-13 20:44:58.422	2026-09-13 20:44:58.422
f5156f8b-b183-4f23-add8-0717f467c3c0	a8f1c06d-8148-4aa5-a553-349b826bf804	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.424	ACTIVE	\N	2026-09-13 20:44:58.424	2026-09-13 20:44:58.424
ba5538dc-1a33-4d48-b643-36a440be364f	5da9feb4-6aaa-42e8-acdb-53810deb5596	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.425	ACTIVE	\N	2026-09-13 20:44:58.425	2026-09-13 20:44:58.425
f48ffc15-82ef-4861-a9f2-eb6d08e59831	5655d4eb-4c16-46ae-815a-6b52b4449297	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.427	ACTIVE	\N	2026-09-13 20:44:58.427	2026-09-13 20:44:58.427
dc82983d-e030-4a23-ac16-eb0b4a098762	dac5a353-dff3-41f4-b525-558900fc83d7	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.429	ACTIVE	\N	2026-09-13 20:44:58.429	2026-09-13 20:44:58.429
a6e70e50-b0e8-4b1f-b02b-26ef506e3510	427a988d-b3d9-49af-8bdd-1da7e0ca9ab6	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.431	ACTIVE	\N	2026-09-13 20:44:58.431	2026-09-13 20:44:58.431
b2f41c1d-e0b0-4327-acc2-150262241f7b	6977f562-d717-4c27-ac38-26776478432a	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.432	ACTIVE	\N	2026-09-13 20:44:58.432	2026-09-13 20:44:58.432
cd259baa-a86b-47a2-ba9d-add204c6a95d	a695ba28-4b94-4926-b41e-b1621b77312a	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.434	ACTIVE	\N	2026-09-13 20:44:58.434	2026-09-13 20:44:58.434
1db8ccb0-187b-4e28-aa56-196c25e8a27f	f23b1f0a-7a1c-4216-9246-8d214256e83a	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.435	ACTIVE	\N	2026-09-13 20:44:58.435	2026-09-13 20:44:58.435
5321cf26-2ecb-4cc5-a4ab-bb4b4fd50a0f	d357cf94-42d1-4313-8bc6-ea0c5d3eb6fb	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.436	ACTIVE	\N	2026-09-13 20:44:58.436	2026-09-13 20:44:58.436
107cecfb-2381-4adf-95e1-eac84fb19de6	51f31dda-5644-48c6-a8ed-f5878609871b	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.438	ACTIVE	\N	2026-09-13 20:44:58.438	2026-09-13 20:44:58.438
664d7b12-6bc1-4f28-941d-a8070a7e30f8	bb84d85b-593f-41ee-b9bc-79fd65927a56	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.439	ACTIVE	\N	2026-09-13 20:44:58.439	2026-09-13 20:44:58.439
da96435d-7d4f-4d09-8024-ca697f4dc050	01a8987d-d8fc-4cf8-9ca7-c6ebb11b11c7	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.44	ACTIVE	\N	2026-09-13 20:44:58.44	2026-09-13 20:44:58.44
270706d7-3f76-4228-b0b6-226a9cb99a6a	26bed60e-7b83-4dfa-a242-cd71d4b41473	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.442	ACTIVE	\N	2026-09-13 20:44:58.442	2026-09-13 20:44:58.442
47a1cde5-f4c5-4d1f-aa1e-3573186a7d39	e21c043d-6496-4f02-8e60-78def70c17a5	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.446	ACTIVE	\N	2026-09-13 20:44:58.446	2026-09-13 20:44:58.446
e8d3c0d1-38c6-43a8-9296-1f735856d1e1	025f2f14-d2f3-47a0-88a7-2d9918c4bbf7	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.448	ACTIVE	\N	2026-09-13 20:44:58.448	2026-09-13 20:44:58.448
2189bdbc-0953-4159-83c2-8b2d16810328	64618d2e-529d-459f-a080-fef62fd97e9e	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.449	ACTIVE	\N	2026-09-13 20:44:58.449	2026-09-13 20:44:58.449
2a2e6f04-b981-4f94-9b3e-3f31ae4b5e7e	3c22b28b-1db6-49d4-b53c-9af50bcdf522	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.451	ACTIVE	\N	2026-09-13 20:44:58.451	2026-09-13 20:44:58.451
fc5f9ac1-1971-44ef-86a9-37c71cf684ab	dceacbcf-f96a-4b11-a2e4-cece0cbf87af	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.452	ACTIVE	\N	2026-09-13 20:44:58.452	2026-09-13 20:44:58.452
71002434-495f-4269-ad7c-5ec563e00897	967c0e70-d9c1-4929-8efe-0d8dc07291f5	73c218e5-1b33-4640-86fd-a12c8f94fb3d	4460ad11-06f9-4708-ae5d-27c7f640aa85	2026-09-13 20:44:58.453	ACTIVE	\N	2026-09-13 20:44:58.453	2026-09-13 20:44:58.453
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
9a780713-4de1-43c3-9ca3-b5fa22f500b4	3360123b-4d74-454d-ba3e-03f073d0c142	dad47e975dda0ea52938dad97620dad46014ec3aa2045b1fc5c0f374cd04425b	2026-09-20 20:45:15.416	\N	2026-09-13 20:45:15.418
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
231b3836-e162-475f-9479-dbded29f4dac	\N	819811912026504A	16982273	ALEJANDRO	ALMANZA IBAÑEZ	2021-10-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.09	2026-09-13 20:44:57.09	\N
10fb0d9a-7007-4a3c-9c14-95abb69972bb	\N	8198119120261475	16982282	LUCIA	ALMANZA IBAÑEZ	2021-10-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.099	2026-09-13 20:44:57.099	\N
7f0c4e0d-697b-4938-b424-d187ddfd844f	\N	819811912026997	16852692	AXA	ANDRADE RAMOS	2021-07-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.1	2026-09-13 20:44:57.1	\N
5a695350-65d1-4138-b8fa-52d529f3ca19	\N	819811912026305A	17134573	SAMIR	AÑEZ ORTEGA	2022-04-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.102	2026-09-13 20:44:57.102	\N
3b712863-e2c2-4283-83ae-64ad71ec7eee	\N	8198119120267873	17202504	EMANUEL	ARIAS OLMOS	2021-12-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.104	2026-09-13 20:44:57.104	\N
4e34ef79-59ff-440b-a8c3-2f4e50e1e336	\N	819811912026204	17015806	JOSE MARIO	CALLEJAS PAEZ	2021-09-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.106	2026-09-13 20:44:57.106	\N
69ca9f4e-2c36-420a-9051-ef2583761f3b	\N	8198119120266304	17892185	ABRAHAM	COLQUE SACA	2022-01-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.107	2026-09-13 20:44:57.107	\N
a2737e10-7601-457c-a24a-0428996d0df3	\N	8198119120263380	16850369	DANNY MAXIMILIANO	FLORES YAMPARA	2021-07-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.11	2026-09-13 20:44:57.11	\N
a3862bc9-2919-491d-8deb-644de8a1b1b3	\N	8198119120265831	17418685	ABRIL	HERRERA RIVERO	2022-04-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.112	2026-09-13 20:44:57.112	\N
5e12751f-3275-42d0-94b6-377b799574c6	\N	8198119120268317	17115660	ANDRES	HUASACE SANDOVAL	2021-10-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.113	2026-09-13 20:44:57.113	\N
553cd6a8-557c-47cd-b28e-d1d97f5ba15e	\N	8198119120267747	17413257	ABDIEL	JATACO CORDERO	2021-10-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.115	2026-09-13 20:44:57.115	\N
bab70ab3-1a4b-4e44-ac04-89c506cac618	\N	8198119120265763	17580129	EMILIA SOFÍA	OSINAGA SUAREZ	2022-04-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.116	2026-09-13 20:44:57.116	\N
1e007d12-f809-4d70-8063-82c973f58afb	\N	8198119120265364	17472557	LUCAS JOSE	PARRAGA TITO	2022-05-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.118	2026-09-13 20:44:57.118	\N
76f69430-3089-4680-a9ad-c74a2886bf5b	\N	8198119120266612	17534148	DYLAN MARIO	REYNOLDS SARAVIA	2022-04-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.119	2026-09-13 20:44:57.119	\N
206a3aee-f5d5-4bd7-b5fb-e1b60f3114db	\N	8198119120265478	16967068	CHRISTIANE	RIBERA AGUILERA	2021-10-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.121	2026-09-13 20:44:57.121	\N
cede877b-4a3b-41ea-b081-511ca434ef67	\N	819811912026496	17151231	DANIELA MASSIEL	RODRIGUEZ DORFELT	2022-05-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.122	2026-09-13 20:44:57.122	\N
f44ca548-d78b-4342-96d0-ea36c6c1d678	\N	8198119120261150	16838231	IRINA	ROJAS ARIAS	2021-07-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.124	2026-09-13 20:44:57.124	\N
1c511c8d-4fdf-4496-b526-6b7ae4b6dc09	\N	8198119120261293	17127337	LUIS EDUARDO	ZAMBRANA PARADA	2021-08-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.126	2026-09-13 20:44:57.126	\N
74dba220-28a9-43fd-bc18-e9fb41dc5c2a	\N	8198119120261880	17159293	KEYNI	ARRAZOLA GONZALES	2021-09-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.128	2026-09-13 20:44:57.128	\N
ca2820e5-2d63-4dcb-a3b1-276bcc8f47e1	\N	8198119120267234	17510185	LUNET ALEXANDRA	AVILA PADILLA	2022-05-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.129	2026-09-13 20:44:57.129	\N
c7dd8b96-dfbf-46e3-98eb-c122df74118f	\N	819811912026678	17230906	JOSIAS	CHOQUE GARABITO	2022-06-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.13	2026-09-13 20:44:57.13	\N
4f28750a-331c-43d4-98fd-4da6f8fa8c8d	\N	8198119120261138	17807178	DASHA ISABELLA	CUELLAR VILLARROEL	2022-03-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.132	2026-09-13 20:44:57.132	\N
cf9e1447-63b7-449f-be28-527161f259c0	\N	819811912026484A	17300232	SARA GALEY	ESPINOZA CAÑARI	2022-01-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.133	2026-09-13 20:44:57.133	\N
2121fcac-a9bc-44bf-89ae-9d865ef7e589	\N	8198119120268563	17221653	ZOE RENATA	FALDIN VACA	2022-04-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.134	2026-09-13 20:44:57.134	\N
b8ea5359-0672-4ac9-9d11-2b3d2ed1499f	\N	8198119120269224	16995862	RAFAEL	HURTADO AYALA	2021-11-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.136	2026-09-13 20:44:57.136	\N
2a03e291-0059-4973-a317-adf9dad9a899	\N	8198119120263260	17579196	LEONARDO	HURTADO GARCIA	2022-02-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.137	2026-09-13 20:44:57.137	\N
3c6a5f9b-1140-4d39-b4fc-cbafdb2df5d5	\N	8198119120263556	17590484	SOFÍA VALENTINA	LAIME MEDINA	2021-08-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.138	2026-09-13 20:44:57.138	\N
381e996c-ebd4-4441-9a63-902fc084ea88	\N	8198119120268631	17151560	CHLOE ADHARA	LEYTON TORREZ	2022-02-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.14	2026-09-13 20:44:57.14	\N
e56c86f5-4e2b-4894-b213-edc6568e2e6e	\N	8198119120264058	17135769	HAZARD YARCKO	MENDOZA TORREZ	2021-12-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.141	2026-09-13 20:44:57.141	\N
b198f661-6d0d-4d7f-aff9-59d1faaa4159	\N	8198119120263157	17425568	EITHAN CIRO	MERCADO VACA	2022-05-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.143	2026-09-13 20:44:57.143	\N
df55b221-fba0-4602-957d-dc44c20c9590	\N	8198119120266778	17396185	CAMILO	PEREIRA QUINTEROS	2021-11-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.145	2026-09-13 20:44:57.145	\N
d7420623-e91f-43fe-ab9b-55f1e021cb22	\N	81981191202698A	16891893	MAXIMILIANO	ROCHA CABRERA	2021-08-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.146	2026-09-13 20:44:57.146	\N
92453427-20ea-4cde-8e50-a3baee39035e	\N	819811912026609A	16946577	VALENTINA	RODRIGUEZ BERRIOS	2021-09-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.148	2026-09-13 20:44:57.148	\N
8163343f-cd96-47f8-863b-be07e3638bac	\N	8198119120266207	17315961	BRUNA AGUSTINA	RUIZ ROCHA	2021-12-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.149	2026-09-13 20:44:57.149	\N
c19b1a69-f586-4017-9c16-a9dc8d57532b	\N	81981191202676	18033481	FARAH	SALAZAR RODAS	2022-01-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.15	2026-09-13 20:44:57.15	\N
94acd090-3ae2-4566-b1e2-616d53e67871	\N	8198119120262558	17402134	ISABEL CELESTE	ARIAS GALLARDO	2022-02-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.152	2026-09-13 20:44:57.152	\N
7fb007c5-2872-474d-89a1-d3e8ab8eb35a	\N	8198119120265461	17205117	ANYHELO MATTEO	BUSTOS RODRIGUEZ	2022-01-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.154	2026-09-13 20:44:57.154	\N
bcb98044-debe-4726-a476-8caae8727d37	\N	8198119120268871	17514638	RANDY EDISON	CARDONA COSTALEITE	2021-11-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.155	2026-09-13 20:44:57.155	\N
2014ef74-bbd6-47a1-b84d-a578d8bcd47c	\N	8198119120269503	17142026	ISAIAS	CHARUPA ROBLES	2021-08-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.157	2026-09-13 20:44:57.157	\N
692d8eb1-ea20-4344-8b64-c96905772fe0	\N	8198119120265517	17313104	KHALED ADALID	ESCALANTE CESPEDES	2022-06-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.16	2026-09-13 20:44:57.16	\N
603c682f-5767-4398-be37-475a43ae69ca	\N	8198119120265387	17814737	OLIVIA	GONZALES LINARES	2021-07-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.162	2026-09-13 20:44:57.162	\N
2050a6fe-5d19-4ee9-8c6d-b645cf0e570d	\N	819811912026998	17214657	MONSERRAT	HAYES ALMENDRAS	2022-06-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.163	2026-09-13 20:44:57.163	\N
e462fc82-630e-4f8d-8c26-f1118bc19d56	\N	8198119120263579	17833447	SEBASTIAN ADRIEL	JIMENEZ RIBERA	2021-12-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.165	2026-09-13 20:44:57.165	\N
946d5bcd-2cdf-440a-af0c-508c3522263c	\N	819811912026607	17298539	ZOE ANTONELLA	LEAÑOS ALVAREZ	2021-12-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.166	2026-09-13 20:44:57.166	\N
dcdc6cb0-c72b-4693-a60f-b88bc55aa7c2	\N	8198119120267302	18034799	MATEO GABRIEL	MENDOZA CORTEZ	2022-02-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.168	2026-09-13 20:44:57.168	\N
8c0ee726-cf01-4e25-ad36-56b12a8ab3f0	\N	8198119120262107	17255876	MATIAS	OLIVA SUAREZ	2022-02-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.169	2026-09-13 20:44:57.169	\N
eb1f9ea0-8354-4b78-9d04-f89382209c2c	\N	819811912026999	17299946	LUKA SANTIAGO	ORELLANA CARRASCO	2022-06-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.171	2026-09-13 20:44:57.171	\N
f4683b04-784a-4f21-ae4b-c9331887cd80	\N	8198119120265176	17535896	DANNA LUCIANA	PEÑA GUAZACE	2022-03-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.172	2026-09-13 20:44:57.172	\N
8b2b45bd-2335-46c4-80b3-77c86af4a227	\N	8198119120265740	17437367	MADDY	RIBERA OVANDO	2022-04-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.174	2026-09-13 20:44:57.174	\N
b343a2d9-c21f-44cf-a8e6-62aebe5062fb	\N	8198119120266658	17222565	DANNA	RIVAS TERCEROS	2022-06-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.177	2026-09-13 20:44:57.177	\N
02e0a794-7bf2-4aca-ae34-11c26b347b31	\N	8198119120264486	17118387	LIA DENISSE	SANCHEZ ALVAREZ	2021-10-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.178	2026-09-13 20:44:57.178	\N
d5f3d12d-0358-46f6-8fe9-86314bf732f6	\N	819811912025172	16464017	EDSON JARED	AGUILAR FLORES	2020-07-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.18	2026-09-13 20:44:57.18	\N
85e04d47-6d81-49f2-9d25-3d31dd38949b	\N	8198166920257092	16481069	MIA ISABELLA	CESPEDES REBOLLO	2020-08-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.182	2026-09-13 20:44:57.182	\N
dbcd00f6-2738-410f-b552-57d652c5fd34	\N	8198119120255986	16469303	MATTHEW	CHOI BUCETA	2020-07-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.183	2026-09-13 20:44:57.183	\N
c3df281a-f8d3-4f47-8a60-1e3d1b21e07e	\N	819811912025725	16723004	ROLY JAIRO	CHOQUE CAMPOS	2021-03-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.185	2026-09-13 20:44:57.185	\N
d22aac34-2710-47b3-a61e-21e7027ff996	\N	8198112120255624	16498651	LAURA BELEN	CRUZ VACA	2020-09-21 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.186	2026-09-13 20:44:57.186	\N
18781baf-9968-46af-9214-e1673afb12f1	\N	8198119120256618	16596928	LUCIANA	DURI NAURO	2020-12-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.187	2026-09-13 20:44:57.187	\N
da3274f2-0434-4111-897c-503653bbd4ce	\N	8198026120255650	S/CI-8198026120255650	ISAAC	LEON BLANCO	2020-07-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.189	2026-09-13 20:44:57.189	\N
41a5e10a-6614-4117-a675-560cc0720e74	\N	8198119120253431	17227070	CAMILA MICHELLE	LLANQUE TAPIA	2021-04-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.19	2026-09-13 20:44:57.19	\N
c6ca07ad-c502-4b56-82ab-d02a0af5058e	\N	8198119120269720	16696012	EUNICE	MELCHOR PALACHAY	2021-02-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.192	2026-09-13 20:44:57.192	\N
c05db867-aec8-4fdb-8261-4ed5d7aa21c6	\N	8198119120256014	16815613	VICTORIA	MOLINA FERNANDEZ	2021-05-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.194	2026-09-13 20:44:57.194	\N
72ab6692-afe6-4626-b259-bac71ed69bc5	\N	8198119120255113	16767265	DEREK JACOB	MORALES MAMANI	2021-04-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.196	2026-09-13 20:44:57.196	\N
4ad25e1d-3e3a-4ac3-9b79-85576865675b	\N	8198119120259019	16855001	THIAGO ZAID	OLMOS JATACO	2021-05-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.197	2026-09-13 20:44:57.197	\N
74c8c59c-8379-43b8-907e-6a032bc2c062	\N	8198023220256008	17101672	SOPHIA	PANIAGUA ROJO	2021-04-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.198	2026-09-13 20:44:57.198	\N
57870af6-3476-4f2d-a583-a77ba07f3dce	\N	8198119120259817	16469252	SUSAN	POQUECHOQUE AGREDA	2020-07-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.2	2026-09-13 20:44:57.2	\N
9cea0542-58c4-4dc8-9e4d-bcf29562a08b	\N	8198101620258830	16785258	DAFFNE	RODRIGUEZ MICO	2021-04-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.201	2026-09-13 20:44:57.201	\N
078bd4bb-7d19-4661-8b61-31b470069242	\N	8198119120259418	16473485	NEHEMIAS MIGUEL	ROSALES BARRIOS	2020-07-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.203	2026-09-13 20:44:57.203	\N
4ba22598-409c-40e9-a66f-90503cc900b6	\N	8198119120269617	17508257	YEIKO	RUIZ RICALDIS	2021-04-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.204	2026-09-13 20:44:57.204	\N
71870e8f-e555-48f9-883e-319bb494ae2c	\N	819811912025512A	16536543	THIAGO	STIPANCICH BRUZZO CASTRO	2020-11-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.206	2026-09-13 20:44:57.206	\N
aa9060a1-57d7-41bb-aaa8-e3a7e3cbb7a8	\N	8198119120254109	17192200	ALICE ARLET	TISCO ROJAS	2021-04-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.207	2026-09-13 20:44:57.207	\N
3c2dfc78-2e48-4d41-b0d0-acebf2e3c2c2	\N	8198119120265426	16790253	ALEJANDRO	TORREZ MENDEZ	2021-05-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.21	2026-09-13 20:44:57.21	\N
5ef2cd09-effc-43cb-97f2-17f555a4b65f	\N	8198119120256978	16713802	FLAVIA FIORELA	ANGELO ZAPATA	2021-03-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.211	2026-09-13 20:44:57.211	\N
15c5e826-dd9f-4dd5-aba9-9f06677fcfd5	\N	8198119120256277	16645379	ELEAZAR	BRAVO VEGA	2021-01-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.213	2026-09-13 20:44:57.213	\N
5785b82e-d2a6-4522-b831-6c15c2c3abb0	\N	819811912026610A	16645249	LIAM ARTURO	CUELLAR ARENAS	2021-01-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.214	2026-09-13 20:44:57.214	\N
5c7ed4e6-b5cd-4cb6-a1ea-f8aa5ca28026	\N	8198119120252524	16794076	JARED	GONZALES BACHO	2020-11-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.216	2026-09-13 20:44:57.216	\N
61246cbb-0a6a-4c0a-8ac6-59cc2864dec9	\N	8198119120254543	16627582	JESSICA BELEN	GUTIERREZ BARRIGA	2021-01-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.217	2026-09-13 20:44:57.217	\N
e17932bb-e637-45a7-b77b-ac130aa8cfce	\N	8198119120261000	16508186	ZOE DANIELA	GUTIERREZ COSTAS	2020-10-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.218	2026-09-13 20:44:57.218	\N
41155da9-4e7e-4f08-9b67-4ee646e07eab	\N	8198119120252365	16742074	FABRICIO	KILE LEON	2021-03-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.22	2026-09-13 20:44:57.22	\N
955ff372-4de2-4ba6-bc18-958cd147e125	\N	8198119120259180	16854996	ALYSSA	MARQUEZ MONTERO	2021-04-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.221	2026-09-13 20:44:57.221	\N
0c03ef3e-0370-4451-a730-b3ac17e27a9d	\N	819811912025809	16707082	PABLO MATEO	MENDOZA TERCEROS	2021-02-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.223	2026-09-13 20:44:57.223	\N
e9935d71-3799-4a43-98e6-4a4fa4395835	\N	8198119120255347	16471645	ALIZ ROUSY	MERCADO VACA	2020-07-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.224	2026-09-13 20:44:57.224	\N
98876ad1-5895-417c-b8e0-26ccd5c381f4	\N	8198119120255690	16507838	IAN GABRIEL	MIRANDA CORTEZ	2020-10-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.227	2026-09-13 20:44:57.227	\N
33ae4346-ee59-4fcb-b2f3-fd980c51d7c8	\N	8198149220251731	16723191	ESTER	QUITON REJAS	2021-03-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.228	2026-09-13 20:44:57.228	\N
c72486b1-ca10-495c-88e8-afab1bf874f3	\N	8198119120258403	16603192	JAZIEL	ROCHA GUTIERREZ RAMIREZ	2020-12-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.23	2026-09-13 20:44:57.23	\N
a61cf03e-8aea-41c3-ba79-1f0193aa17b3	\N	8198119120266914	16728683	YOSSER AMIR	SALVATIERRA NOE	2021-03-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.231	2026-09-13 20:44:57.231	\N
313bdc46-e52d-4800-ba27-f6cf19114e6e	\N	8198119120256192	16766985	VICTOR BENJAMIN	SALVATIERRA SARAVIA	2021-04-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.233	2026-09-13 20:44:57.233	\N
bb61222b-7a4b-4789-a666-81f11aeaf0fd	\N	8198119120264560	16699339	RENATO	SAUCEDO SANDOVAL	2021-02-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.234	2026-09-13 20:44:57.234	\N
8a31d3f1-0721-4762-b32d-d5edaa7047d5	\N	8198119120254595	16759975	ANTONELLA	UNZUETA VARGAS	2021-04-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.235	2026-09-13 20:44:57.235	\N
465228f3-92a3-46c1-83ac-ebdcecb7b5ce	\N	819811912025789	16466460	JOSEPH ALEXANDER	URQUIZU LOPEZ	2020-07-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.237	2026-09-13 20:44:57.237	\N
7567f5bb-be6a-4d0f-b7ac-a1d82c1ed6d2	\N	8198119120269795	16614103	AITANA	VACA VARGAS	2020-12-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.238	2026-09-13 20:44:57.238	\N
8d062c07-1a0f-4339-a668-7765c113f593	\N	8198119120268284	16463746	YANINA	VACA VILLAGOMEZ	2020-07-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.24	2026-09-13 20:44:57.24	\N
9b5e5e3b-cff2-4b50-9791-412019e91e87	\N	819811912025939	16733912	SAMUEL ANDRES	VERDUGUEZ GONZALES	2021-03-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.242	2026-09-13 20:44:57.242	\N
42e672c6-95ec-42b5-8894-a6eeb9a46f70	\N	819811912025946A	17734399	ALONSO YAHIR	ZORRILLA ORTUSTE	2021-05-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.244	2026-09-13 20:44:57.244	\N
62b529c8-fcb7-4aa2-97a3-6da5af723440	\N	8198119120242594	16193166	ALINA	ARIAS OLMOS	2019-10-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.247	2026-09-13 20:44:57.247	\N
73ac3bba-bb93-4cd7-a6f2-fe5839b7e5fa	\N	8198119120244828	16427827	CRISTIAN HASSAN	BALTAZAR TAPIA	2020-03-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.249	2026-09-13 20:44:57.249	\N
caca954a-d5a3-4872-b298-d3fb01777513	\N	8198119120257064	16242280	NEITAN ALEXANDER	BAÑON GUZMAN	2019-11-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.252	2026-09-13 20:44:57.252	\N
1c48ec2f-b281-4465-8fd3-6d41e7f15fee	\N	8198160320245647	16120554	DANIEL LIEZER	CAMACHO CARDENAS	2019-09-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.254	2026-09-13 20:44:57.254	\N
ac153d49-8099-45c4-aa6f-4a64b205a0ff	\N	819810372025220	16039524	EYTAN EMANUEL	CASTRO HURTADO	2019-07-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.257	2026-09-13 20:44:57.257	\N
d937cd60-a402-4346-b477-60569dab09ab	\N	8198119120249225	16886902	EMILIANO	COIMBRA GUARDIA	2019-12-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.26	2026-09-13 20:44:57.26	\N
725fa8bf-6b11-4008-956f-9faf85c484c5	\N	8198025520246578	16532020	ROLANDO DAVID	CONDORI ORTIZ	2019-09-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.262	2026-09-13 20:44:57.262	\N
8356e45c-46ab-4577-aa0d-eee139352b63	\N	8198113420249251	16899168	ISABELLA	CUELLAR MELGAR	2019-09-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.263	2026-09-13 20:44:57.263	\N
adadba3f-40a4-45a4-9ca8-7c3cd7983bf9	\N	8198119120244396	16165437	JOSUE MARCELO	GUTIERREZ GIRONDA	2019-07-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.264	2026-09-13 20:44:57.264	\N
f3f4c706-af3f-46ef-8d8d-36239934ad2a	\N	8198119120242292	17178155	ELIETTE NETANIA	MEDINA GONZALEZ	2020-01-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.266	2026-09-13 20:44:57.266	\N
9c6cf345-88e6-496c-b288-95f62cd27af9	\N	8198119120241920	16879015	DYLAN MISAEL	MEJIA MUJICA	2019-07-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.267	2026-09-13 20:44:57.267	\N
c78e794c-03d9-4e7e-925e-c291cd83a8e0	\N	8198119120242662	16223639	LUCIANA	RIBERA AGUILERA	2019-10-28 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.268	2026-09-13 20:44:57.268	\N
c2bad235-d42e-452e-b697-c19f3762a756	\N	8198119120243619	16836434	NAHIARA	RODAS RIVERO	2019-12-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.27	2026-09-13 20:44:57.27	\N
b0873bee-db46-49ca-9cac-ae305ded11bf	\N	8198119120245644	16051022	ELISA	ROMERO CALLAO	2019-08-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.271	2026-09-13 20:44:57.271	\N
06ffcd75-5229-418c-a275-b5a431cda5e1	\N	81980260202421A	16072178	ABIGAIL	ROMERO VELASQUEZ	2019-08-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.272	2026-09-13 20:44:57.272	\N
cc07f503-00ea-460d-9a62-a334633f4f20	\N	8198119120247628	16237035	EMILIANA	RUIZ MONTAÑO	2019-11-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.274	2026-09-13 20:44:57.274	\N
65b72e88-6964-4795-9257-ac5c3c4bca97	\N	8198119120244925	16428940	BRUNO	RUIZ SEJAS	2020-03-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.276	2026-09-13 20:44:57.276	\N
f0f17d8d-4154-4b75-a1d0-7cf9bdec3c3c	\N	8198119120257788	16301697	ZOE ANGELINA	SANCHEZ USEDA	2020-01-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.278	2026-09-13 20:44:57.278	\N
55e37c60-c3a7-469f-86db-cd90ccee1fb7	\N	819811912024930A	16017406	JOAQUIN SANTIAGO	SARDINA CASIA	2019-07-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.279	2026-09-13 20:44:57.279	\N
f9875070-bba0-4f72-9e4c-22148d39550d	\N	8198165920248689	16237680	LUANA	SOLETO MENDEZ	2019-11-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.281	2026-09-13 20:44:57.281	\N
3cba3942-09d9-479e-960a-0cc6995abcc1	\N	8198119120248204	16809341	SAMARA	SUAREZ AGUILERA	2019-09-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.283	2026-09-13 20:44:57.283	\N
06e71927-56ab-42bb-8469-8a6986c3d9e0	\N	819811912024686A	16070870	ESTHER	SUAREZ MELGAR	2019-08-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.284	2026-09-13 20:44:57.284	\N
5ec78741-aa4b-4114-b540-92ddf5e85a80	\N	8198144020244726	16186551	ISABELLA ALESSANDRA	TORREZ DELGADILLO	2019-10-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.285	2026-09-13 20:44:57.285	\N
be698c3a-4758-4d63-9678-aea2d0362a8a	\N	8198119120249871	16463069	VALERIA	TORREZ ROMERO	2020-06-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.286	2026-09-13 20:44:57.286	\N
61f9bad7-72a0-46db-8f47-9c0b2fbce433	\N	8198144020243916	16042828	LUCIANA	VARGAS ZEBALLOS	2019-07-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.288	2026-09-13 20:44:57.288	\N
73e23929-0afb-4b3c-95dd-834860eb7c27	\N	8198119120247481	16303180	ELENA	VELASCO SOTO	2020-01-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.289	2026-09-13 20:44:57.289	\N
321fb559-dc84-4087-aa3b-5a01dad60b80	\N	8198119120242383	17364784	JOSUE MIGUEL	ZUÑIGA RAMIREZ	2020-04-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.291	2026-09-13 20:44:57.291	\N
4414e7fe-ea83-4c41-86c3-94177ba8f89d	\N	8198026820247939	16374000	FABRICIO JEZIEL	ALI CALDERON	2020-02-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.294	2026-09-13 20:44:57.294	\N
cb0f60a9-3b9c-498e-97db-0e8774c236fb	\N	8198119120244464	16042441	RAFAELLA SARA	ANGELO ZAPATA	2019-07-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.295	2026-09-13 20:44:57.295	\N
ad3ceea3-b4f4-45e2-8749-96bd430cee65	\N	8198119120249202	16257865	RAPHAELA SARAHI	ANGLARILL FIGUEROA	2019-12-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.297	2026-09-13 20:44:57.297	\N
acffbec7-d8f8-48b9-9bf9-57202ecb3c19	\N	8198023920248464	17276027	OSCAR	BELTRE RUA	2019-08-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.298	2026-09-13 20:44:57.298	\N
f1e97255-5f3b-47bf-9789-7e8f5583da8d	\N	8198144020245724	16834801	LIAM ISAAC	BORDA URGEL	2020-01-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.299	2026-09-13 20:44:57.299	\N
ad14c99f-fdec-4640-8dbb-bef039be0503	\N	81981191202442	16218049	EMILIANO FERNANDO	CABRERA ARANCIBIA	2019-10-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.301	2026-09-13 20:44:57.301	\N
4b3d4ad2-b3e0-4c6d-8602-9393c8cc88e7	\N	8198119120243193	16175969	SARAH NAZARET	CAMACHO ADAUTO	2019-10-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.302	2026-09-13 20:44:57.302	\N
5bf50b63-be5f-4ebc-a117-fa3b1ce03ab7	\N	819811912024414A	17585664	SOFIA ALESSANDRA	CARRILLO SOLANO	2019-11-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.303	2026-09-13 20:44:57.303	\N
79ee9515-87e1-4971-bd24-a327ffcc84d8	\N	8198144020246408	16042858	AXEL ABDIEL	CASALI FELIX	2019-07-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.305	2026-09-13 20:44:57.305	\N
1a516bf2-1621-484f-aaa5-ca1c95cf6647	\N	8198119120247293	16424603	JHANS	CLAURE LLANOS	2020-03-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.306	2026-09-13 20:44:57.306	\N
658b7858-2d9a-4880-8251-16dc76f1201e	\N	8198119120246049	16799132	RASHELL SHERAZADE	CORONADO ROLDAN	2020-01-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.307	2026-09-13 20:44:57.307	\N
7d86bf29-e8f9-4280-9cee-950ed9ab895e	\N	8198119120246671	16895930	ARIADNA KATRINE	CUELLAR VILLARROEL	2020-02-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.31	2026-09-13 20:44:57.31	\N
0cb1efe7-ceea-4cc1-85f5-24d7c0c8baf7	\N	8198119120241606	16387611	TANIA YARETZI	CUELLAR VILLARROEL	2020-02-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.311	2026-09-13 20:44:57.311	\N
041eda94-7e8d-41f1-ae5f-d959e6a65287	\N	819811912024333A	16149628	ALI	GONZALES RODRIGUEZ	2019-09-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.313	2026-09-13 20:44:57.313	\N
d4470620-e4b4-4105-8d66-761982aea07b	\N	8198119120241424	16297220	DAMIAN	HERRERA RIVERO	2019-12-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.314	2026-09-13 20:44:57.314	\N
ec25b06d-e445-4c42-a8af-3a556ed1647b	\N	8198119120245615	16225273	SANTIAGO	HURTADO AYALA	2019-10-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.315	2026-09-13 20:44:57.315	\N
8eb01c14-c4dc-473b-81d1-cdbdfd652270	\N	8198012820243647	16048379	ANDREA ELIS	LAIME MEDINA	2019-07-28 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.317	2026-09-13 20:44:57.317	\N
a4a10ad9-db76-4d1c-8876-0cd09cf18ac9	\N	819811912024215A	16305769	EDGAR JHASET	LEDEZMA CRUZ	2020-01-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.318	2026-09-13 20:44:57.318	\N
ce0b4ebe-ae73-41dc-bbf2-f9d3e55238d9	\N	8198023220248632	16442292	GIANNA	MORON ULLOA	2020-05-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.319	2026-09-13 20:44:57.319	\N
8a522cab-6946-4511-8359-d84aa47a721a	\N	8198119120247144	16340990	SEBASTIAN	MUÑOZ CUELLAR	2020-01-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.321	2026-09-13 20:44:57.321	\N
dbd0e1ef-b3b8-4e38-8b65-1953d6811578	\N	8198119120243807	16097282	URIEL	NAY GARCIA	2019-08-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.323	2026-09-13 20:44:57.323	\N
b47c0541-61c5-43ee-8080-41e28a68509f	\N	8198155920246521	16389777	EAN JOSUE	ORTIZ CEREZO	2020-02-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.324	2026-09-13 20:44:57.324	\N
e66ef1e7-e34d-415c-a694-892ffe6bb92d	\N	8198023220242474	17101664	SANTINO	PANIAGUA ROJO	2019-12-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.327	2026-09-13 20:44:57.327	\N
0998d38f-d612-442f-843c-6e9f12a0b0eb	\N	8198168920249389	16452101	ALEXANDER	PEDRAZA CRUZ	2020-06-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.329	2026-09-13 20:44:57.329	\N
34a7291e-c16a-4a8f-8044-6ac54830cef0	\N	819811912024777	16452718	PRISCILA YONELLY	RIOS ESTEVEZ	2020-06-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.33	2026-09-13 20:44:57.33	\N
67b75e9f-50d6-4d79-a2e6-e87a7a3baaf4	\N	8198144020246346	16345727	ELISA	RUIZ GUZMAN	2020-01-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.332	2026-09-13 20:44:57.332	\N
cca1dad3-1879-4a83-814e-8f28e74db969	\N	819811912024205	16264367	SOPHIE ANTONELLA	SEMPERTEGUI COSSIO	2019-12-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.334	2026-09-13 20:44:57.334	\N
1751a186-565b-423e-a34f-5d05109e6ecb	\N	8198119120242360	16445542	KENDRA ADALET	VELEZ VIDAL	2020-05-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.335	2026-09-13 20:44:57.335	\N
2802b8cb-a51b-42e7-89b6-02220a26aa86	\N	8198119120232428	15350436	IAN SAMUEL	AÑEZ RUIZ	2018-07-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.336	2026-09-13 20:44:57.336	\N
996ac263-a46f-4a5b-a6fd-d777434084cb	\N	8198098220236541	15803510	ZOE	ARANCIBIA CONDORI	2019-04-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.338	2026-09-13 20:44:57.338	\N
e3ca141c-1890-4050-b30b-9c8e67034c24	\N	819811912023915	15511673	EMMA ESTEFANIA	BRANER MOLINA	2018-11-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.339	2026-09-13 20:44:57.339	\N
f0f50069-1f3b-4da6-a850-d9159a4b58b4	\N	819802322023304A	15853269	VICTORIA VALENTINA	CADIMA CABRERA	2019-04-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.341	2026-09-13 20:44:57.341	\N
c264ffe0-dbad-4012-804e-ad4702de5c4d	\N	8198119120232674	15441014	PRISCILA ROMINA	CHOQUE CAMPOS	2018-10-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.343	2026-09-13 20:44:57.343	\N
07bbb38d-7f4b-42b1-b315-3ed18b38068d	\N	8198151420236894	15733072	EZEQUIEL	CRUZ VACA	2019-03-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.345	2026-09-13 20:44:57.345	\N
a5640f38-cfab-40a6-901c-e1df2f445071	\N	8198119120235844	15413855	LUCIANA	DAZA MOLINA	2018-09-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.346	2026-09-13 20:44:57.346	\N
24a702b9-02ea-4a13-9c93-f9a93535230d	\N	8198119120231812	15918953	SOFIA	DAZA POGGI	2019-05-28 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.348	2026-09-13 20:44:57.348	\N
eb6b9615-6d80-4615-8d24-8d545973f13c	\N	8198144020232748	16735099	SAMUEL	ESTRADA VELASCO	2018-08-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.349	2026-09-13 20:44:57.349	\N
b530b9b4-2090-4a16-b8bb-9cf9bb6a620e	\N	8198119120239169	15806989	VALENTINA SARAHI	GUARDIA PADILLA	2019-04-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.351	2026-09-13 20:44:57.351	\N
d635da53-5843-45ee-a6b8-bddc4c33006e	\N	819811912023820A	15553380	AMANDA	HUALLPARA CACERES	2018-12-28 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.352	2026-09-13 20:44:57.352	\N
b8710f09-5382-437d-a334-b7c4c5a6d9a0	\N	8198124320239726	15845885	ANA MICHELLE	HURTADO LIMACHI	2019-04-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.354	2026-09-13 20:44:57.354	\N
007bd16a-b0f2-4fbf-abc2-f4bc3569a8e4	\N	8198119120231128	15912087	JOSE ANDRES	JURURO FERNANDEZ	2019-05-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.355	2026-09-13 20:44:57.355	\N
19b131a2-216e-4660-a850-afc9698a4099	\N	8198000820232559	16384875	RONNY RAPHAEL	LIJERON DELGADILLO	2019-06-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.356	2026-09-13 20:44:57.356	\N
49113de2-56a8-4afc-bf4f-dcdd46e8ea07	\N	8198119120233364	15523252	ABIGAIL	LIMON BERRIOS	2018-11-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.358	2026-09-13 20:44:57.358	\N
cccc8e36-9473-41c6-ad79-a212f64b74c6	\N	819814402023936	15385502	YSAIAS URIEL	MACHICADO ESPINDOLA	2018-08-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.36	2026-09-13 20:44:57.36	\N
ac482c4b-2016-4b0b-ba4d-c8131c4dbbb8	\N	8198119120237902	15433176	JHAEL FABRICIO	MAMANI OJEDA	2018-09-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.362	2026-09-13 20:44:57.362	\N
824fa6b3-71f3-4d12-a47d-a69fbc73c909	\N	819816592023239A	15340023	CRISTHIANY	MARQUINA GUARACHI	2018-07-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.363	2026-09-13 20:44:57.363	\N
2846b9ae-3c06-443b-abf6-4a0685ef1c10	\N	8198119120234509	16659862	JUAN AGUSTIN	MERCADO MARAZ	2019-06-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.365	2026-09-13 20:44:57.365	\N
a1aa8ff2-3ce6-40b7-8933-53954a16d83a	\N	8198119120233182	15806219	DANIEL	MURILLO ESPINOZA	2019-04-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.366	2026-09-13 20:44:57.366	\N
6ffaccaa-0058-437b-9821-5fa106af3b23	\N	8198119120238900	15483244	GEORGINA QUETZALY	OLMOS JATACO	2018-07-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.367	2026-09-13 20:44:57.367	\N
bcda57c2-87b1-4090-b013-88898a1c7b81	\N	8198144020239300	15881085	JULIETA SAMARA	PAZ CONDE	2019-05-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.369	2026-09-13 20:44:57.369	\N
a92c642d-a82c-4061-9c07-26d78946f2aa	\N	8198149720234750	15666299	FRANCO	RIBERA MONTERO	2018-12-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.37	2026-09-13 20:44:57.37	\N
03c69a48-a4cb-4dca-861f-556a5f6f93d0	\N	819811912023610	15867236	ISAIAS	RIVERA LAPACA	2019-05-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.372	2026-09-13 20:44:57.372	\N
d63e7422-764d-491a-80cd-020db25e0838	\N	8198144020239619	15582008	DIEGO	ROCHA ANTELO	2019-01-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.373	2026-09-13 20:44:57.373	\N
fb29ac55-04e1-47b1-91bc-da2d30aa4a24	\N	8198119120232372	17289479	EFRAIN	RUIZ QUISPE	2018-09-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.375	2026-09-13 20:44:57.375	\N
03a02aa1-53b9-43cd-8035-7f371dfe8e6f	\N	819814492023354	15731410	ZOE VALENTINA	SALVATIERRA ARANCIBIA	2019-03-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.377	2026-09-13 20:44:57.377	\N
0e3541d6-c08a-41bb-8b73-55e0750606f3	\N	819814492023524A	15332093	LUCAS STEFAN	SUAREZ PAZ	2018-07-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.379	2026-09-13 20:44:57.379	\N
235129e6-dc30-47e6-bd50-36eed17805a6	\N	8198119120239078	15736460	MOISES AARON	TORRES JALDIN	2019-03-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.38	2026-09-13 20:44:57.38	\N
e6dbed86-b4c1-4c02-8e14-edae6c4fd29a	\N	8198119120231339	15910701	MIA NICOLE	UNZUETA VARGAS	2019-05-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.381	2026-09-13 20:44:57.381	\N
ca03d57a-ded5-4276-a4e0-c2c36e4150f7	\N	8198144020231671	15517667	MATIAS EVANDRO	URGEL SANDOVAL	2018-11-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.383	2026-09-13 20:44:57.383	\N
7af56852-0774-47b7-bfa4-160acfd63578	\N	8198119120232788	16682218	BRIANA VALENTINA	URIMO CARDON	2019-06-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.384	2026-09-13 20:44:57.384	\N
ca2f45d9-2a9a-4775-8cbe-d53aa9db9c63	\N	81981243202371	15382016	LUCIANA ARLETH	ALARCON AÑEZ	2018-08-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.386	2026-09-13 20:44:57.386	\N
a8924d03-fbdb-49be-aabe-a600993ca271	\N	8198119120234881	15590790	ISABEL	ALMANZA IBAÑEZ	2019-01-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.387	2026-09-13 20:44:57.387	\N
c4aa1d7b-f8da-4d17-94ba-1a6a165f3d5d	\N	8198119120235821	15390373	ELIAS	ANTEZANA ROBLES	2018-08-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.388	2026-09-13 20:44:57.388	\N
86dfd43b-1d9b-4a2b-a512-eeb33e5a8f04	\N	819811912024850	15472702	MIA RENATA	BERNAL JIMENEZ	2018-10-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.39	2026-09-13 20:44:57.39	\N
5bb58c9d-a0d5-477c-a420-2526769be2d1	\N	8198111020238069	16798162	LIAM ZAID	CANDIA RUIZ	2019-03-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.391	2026-09-13 20:44:57.391	\N
6958b5fe-2f4a-4e80-8dce-8cd209a1389f	\N	8198149720234436	17585640	MIA ISABELLA	CARRILLO SOLANO	2018-09-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.394	2026-09-13 20:44:57.394	\N
7093a512-72cb-472c-8c92-79cbdd9b903f	\N	8198119120232103	15780519	AGUSTIN GABRIEL	CASTRO QUISPE	2019-03-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.395	2026-09-13 20:44:57.395	\N
9260b51b-545f-4443-8a44-756082453b1a	\N	8198026820232933	15325879	ADRIAN	CASUPA MURILLO	2018-07-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.397	2026-09-13 20:44:57.397	\N
05ab5d2d-f659-45c3-b6bf-893fe653a752	\N	8198102320238695	15838063	JHON CALEB	CHUMACERO PEREZ	2019-04-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.399	2026-09-13 20:44:57.399	\N
fddbf028-5b34-46f4-b2b4-4562fc9055a6	\N	8198123220236371	15965407	ALEJANDRO	COLQUE SACA	2019-06-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.401	2026-09-13 20:44:57.401	\N
c8b23479-ebdc-4a8c-82cd-f099fc57dd9c	\N	8198119120231105	15725245	ARIANE IBETH	CONDE SAAVEDRA	2019-03-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.402	2026-09-13 20:44:57.402	\N
531a9951-03ab-495e-acae-774dc95a906e	\N	8198119120238119	15732486	PAULETTE	EGUEZ CARBALLO	2019-03-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.403	2026-09-13 20:44:57.403	\N
52b9c7d5-d184-4a94-866e-687b10a8a514	\N	8198119120234385	17329383	LIA FLORENCIA	ETCHEVERRY GALLARDO	2019-06-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.405	2026-09-13 20:44:57.405	\N
5560ba9c-7043-43c1-95a7-2bed89dbf94f	\N	819814972023150A	15747110	ESTEFANY	GONZALES BACHO	2019-03-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.406	2026-09-13 20:44:57.406	\N
cb23ce9d-236d-46f3-a359-18938909b19e	\N	8198144020233159	15735426	IAN CALEB	HUANCA PACAY	2019-03-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.407	2026-09-13 20:44:57.407	\N
b4725fa6-bbd2-4e47-9aaa-5d4584472acd	\N	8198133120232963	15339383	LEANDRO	LEDEZMA FERNANDEZ	2018-07-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.41	2026-09-13 20:44:57.41	\N
ff646027-349d-4191-81ad-52c80eac9cad	\N	819812532024638A	15413758	ERNESTO	LOPEZ SANCHEZ	2018-09-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.412	2026-09-13 20:44:57.412	\N
3c47a01a-87ed-4572-9eb3-927109f3b083	\N	819816742023997	15802001	JANELY	MELCHOR PALACHAY	2019-04-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.413	2026-09-13 20:44:57.413	\N
c25ee0a2-b4d3-4754-a91d-9b28aeea917b	\N	8198119120235935	15333603	BRIANA MICHELL	OLIVA MAMANI	2018-07-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.415	2026-09-13 20:44:57.415	\N
1fb3b622-858e-46e2-959b-6fa1f0e52032	\N	8198023220239539	15916321	IRENE SARAI	ORTIZ VARGAS	2019-05-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.416	2026-09-13 20:44:57.416	\N
e4f6e04d-e7e8-4f4a-9105-29d5c1925f0c	\N	8198119120236398	15763046	ALESSANDRA	PARRA ORTIZ	2019-03-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.418	2026-09-13 20:44:57.418	\N
0e04e726-3a01-458c-baac-de4a2809ba14	\N	8198119220235255	15963028	ALTAIR	PEÑA ZARRAGA	2019-06-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.419	2026-09-13 20:44:57.419	\N
ea77e9c0-b251-4d32-a66b-28fee41e26c3	\N	8198144020239716	15495614	LUCAS GREGORY	PIMENTEL FELIX	2018-11-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.42	2026-09-13 20:44:57.42	\N
a02b88d7-c23d-4487-ba8f-8e9a6f64a156	\N	8198119120238359	15937264	LETICIA	ROJAS PEDRAZA	2019-06-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.422	2026-09-13 20:44:57.422	\N
d07338c5-1658-4907-b2d3-37b0250e35e2	\N	8198026820232443	16555442	PABLO ASHER	ROMERO MARTINEZ	2019-04-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.423	2026-09-13 20:44:57.423	\N
3f4e953b-e3b8-4ed6-a65f-9057069ec845	\N	8198119120238884	15422271	OLVER JAVIER	RUIZ PALACIOS	2018-09-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.424	2026-09-13 20:44:57.424	\N
a8e2a42a-1e12-44bf-a801-104c40a5b9b7	\N	8198119120235143	15357039	MATEO	SUAREZ MELGAR	2018-07-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.427	2026-09-13 20:44:57.427	\N
dd8e1925-cf0b-4983-bddd-95ca33b05232	\N	8198136020242746	15409588	SANTIAGO EZEQUIEL	TABORGA CUAQUIRA	2018-09-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.428	2026-09-13 20:44:57.428	\N
adc94853-dcbc-44a3-8a3a-085ecdd51a7b	\N	8198137720232162	15534083	MIREYA CLARA	TATTUM FERNANDEZ	2018-12-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.43	2026-09-13 20:44:57.43	\N
5b1fb2a8-b0c7-4c13-8ab0-f23734def076	\N	8198012320236059	15677492	IAN EZEQUIEL	TISCO ROJAS	2018-07-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.431	2026-09-13 20:44:57.431	\N
340a3fda-5c38-48c5-b6ef-65085df5f65d	\N	8198119120249322	15437119	ADRIANA	VEIZAGA FERNANDEZ	2018-10-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.433	2026-09-13 20:44:57.433	\N
04a15712-f950-417b-816f-9a1813423b2e	\N	819813602023946	15461127	SHARON	VILAJA GUTIERREZ	2018-10-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.434	2026-09-13 20:44:57.434	\N
3d4add20-0970-479a-8410-4ddaa6b6ee76	\N	8198038920222669	16873023	SHECCID ALEJANDRA	CARBAJAL IKEDA	2017-08-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.436	2026-09-13 20:44:57.436	\N
3030d67d-2e2f-461e-a809-76d576862266	\N	8198086820229250	16916998	HAYLEN	CHUMACERO SANDI	2017-09-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.437	2026-09-13 20:44:57.437	\N
42d9c436-0120-4fcf-8914-870a671b5f0b	\N	8198119120233147	15186673	SOFIA	DEL CASTILLO CUELLAR	2018-02-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.438	2026-09-13 20:44:57.438	\N
c5221b24-8175-4080-890e-3b8e6bb5a656	\N	8198165920224550	16983105	LAURA INES	FLORES MARQUINA	2017-11-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.44	2026-09-13 20:44:57.44	\N
ab84ea37-7028-48a8-b953-669582e44081	\N	819811912021648A	16288235	JUAN JOSE	GONZALES ORTIZ	2017-05-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.441	2026-09-13 20:44:57.441	\N
0c9a33e7-3046-40a8-81db-d4e2797b1e79	\N	8198119120237983	16342140	MISAEL	GONZALES RODA	2018-02-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.443	2026-09-13 20:44:57.443	\N
b03f074c-fd73-46a6-9c93-78283202622b	\N	8198121920223221	17047437	NICOLAS	LABARDENS JIMENEZ	2018-02-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.445	2026-09-13 20:44:57.445	\N
e969f398-4570-4b0a-bcbb-cb842d5e6488	\N	8198119120228000	17467747	ARTURO	LEIGUE ARREDONDO	2018-02-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.446	2026-09-13 20:44:57.446	\N
dd7914a0-2909-4a28-ab8d-aa00480ad180	\N	8198025520227269	16311774	FERNANDA MICHELLE	MAMANI SOLIZ	2017-08-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.448	2026-09-13 20:44:57.448	\N
70d1dc11-5b10-46df-9a95-1cb703440628	\N	8198144020225121	15514730	JOSE SEBASTIAN	MARISCAL GALARZA	2017-07-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.449	2026-09-13 20:44:57.449	\N
dd50103a-8c5e-4b7b-9c30-6d0dca5b9133	\N	8198164220236390	15743026	ANDER	MARTICORENA MAITA	2018-05-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.45	2026-09-13 20:44:57.45	\N
bb428375-ccbd-4e89-8ce9-f7b38efff032	\N	8198119120233922	16264298	VICTORIA	MENACHO CESPEDES	2017-10-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.452	2026-09-13 20:44:57.452	\N
59b5063a-978f-4412-8792-2d6875599704	\N	8198119120227755	17336074	JOSUE DILAN	OROCONDO ACAPA	2018-01-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.453	2026-09-13 20:44:57.453	\N
fcca9d98-8aa3-4191-a9b7-928a37e93df2	\N	8198119120227635	15978538	LUCAS ELIAS	ORTEGA CORDERO	2018-01-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.454	2026-09-13 20:44:57.454	\N
db4a74f7-2d2a-466f-890f-13fef56b5b2b	\N	8198144020224694	14837123	DANNA	ORTIZ LORA	2018-03-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.456	2026-09-13 20:44:57.456	\N
79846a0d-b660-4d21-b81b-0f02822a47e6	\N	8198119120221580	16091019	VALENTINA	PACELLO IBAÑEZ	2018-01-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.458	2026-09-13 20:44:57.458	\N
e03357f0-abd6-4ec5-adee-0d878c052be6	\N	819811912022147	16114703	URIEL GUSTAVO	PAREDES JALDIN	2018-01-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.461	2026-09-13 20:44:57.461	\N
d8d0aa6a-f3c1-45f5-b0c4-6ecd141f169f	\N	8198119120221791	16554964	JOSE FERNANDO	REYNOLDS SARAVIA	2017-07-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.463	2026-09-13 20:44:57.463	\N
f6d8e28c-47da-4c5c-9fa9-1e6730eb9add	\N	8198119120227914	14973490	ALESSANDRA	RIBERA AGUILERA	2017-08-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.464	2026-09-13 20:44:57.464	\N
b86617ba-b078-4fce-9fc0-75ed0b961bc9	\N	8198119120227151	17604393	BENJAMIN	RIVERA RODRIGUEZ	2018-01-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.466	2026-09-13 20:44:57.466	\N
6250b5d4-b93b-493c-aab9-c369621d6d8d	\N	8198119120228513	16744300	FABRICIO ADRIANO	RIVERO TORREZ	2018-03-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.468	2026-09-13 20:44:57.468	\N
f94be951-0abb-4b14-9515-a1e2dc7e5948	\N	8198134820236118	16271818	EZEQUIEL	ROCHA CHOQUE	2018-01-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.47	2026-09-13 20:44:57.47	\N
da5e8ebb-457e-44d7-b308-34cda614e8a2	\N	8198026020224735	15279148	ELIAS YAHIR	ROJAS RIOS	2017-10-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.472	2026-09-13 20:44:57.472	\N
971b97f8-8c73-4110-a51f-5a6da2aea706	\N	8198119120224219	16198225	ALISON	RUIZ MONTAÑO	2017-09-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.474	2026-09-13 20:44:57.474	\N
ba35d5ea-43a2-4609-b27a-5df84e76e047	\N	8198026820228545	16969309	MATEO	SUAREZ SAUCEDO	2018-01-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.478	2026-09-13 20:44:57.478	\N
d4c86102-d29c-4303-8866-44adc91cc97d	\N	8198119120231322	17224842	ANGELICA ROMINA	TABORGA GUTIERREZ	2018-02-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.48	2026-09-13 20:44:57.48	\N
f2468a97-f6e3-4919-9bdf-b9b57bf2ad6b	\N	8198144920222542	15176101	EMILIANO ALEM	VALDIVIA SIVILA	2018-02-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.482	2026-09-13 20:44:57.482	\N
598ca0cf-2add-4bb1-87b8-be970c7a94b0	\N	8198119120225035	16818790	MARISOL	VALETA ZABALA	2018-04-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.484	2026-09-13 20:44:57.484	\N
e1476052-109c-4fa2-8ab8-20f707b549ae	\N	8198025520219812	17719872	LUCAS	VEGA CHAO	2017-04-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.486	2026-09-13 20:44:57.486	\N
1e9d7f8b-2fe9-4d43-b03e-1bc250c54f32	\N	8198119120225810	16590899	MAXIMILIANO	VELASCO SOTO	2018-02-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.489	2026-09-13 20:44:57.489	\N
688358cd-5b43-44ff-8386-6305f07177c6	\N	8198060320221415	15261919	MADISON	VELIZ GOMEZ	2018-05-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.493	2026-09-13 20:44:57.493	\N
d5c4752f-ebfb-4ce0-8ad5-6c3295816027	\N	8198119120227573	15813891	LUIS ENRIQUE	ZAMBRANA PARADA	2018-04-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.496	2026-09-13 20:44:57.496	\N
1d749c4a-9c6e-4189-ac19-083fe358640d	\N	8198025520221681	15368921	FABIAN	ALPIRE LOPEZ	2018-02-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.497	2026-09-13 20:44:57.497	\N
e2e4f8ce-6db2-4af6-af19-f6ea2e124a24	\N	8198144020227186	17058504	BENJAMIN	ALVAREZ PADILLA	2017-07-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.499	2026-09-13 20:44:57.499	\N
655276c5-e99a-483d-9f61-5413146758a0	\N	8198119120225833	17004288	ANTONELLA	AÑEZ SALVATIERRA	2017-08-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.5	2026-09-13 20:44:57.5	\N
d65288d5-ed5d-4882-979b-c6f03e39e80b	\N	819811912022304	16617172	MATEO KALEB	BIAGAZO VELASCO	2018-02-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.502	2026-09-13 20:44:57.502	\N
3474426e-9691-4b5e-9424-49547c792113	\N	8198144020228639	16833192	GAEL ALEJANDRO	BORDA URGEL	2018-05-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.504	2026-09-13 20:44:57.504	\N
a92ee2bb-bca4-411f-b1d3-0c605f430989	\N	8198119120229859	14942628	FRANKO	BUTRON SAUCEDO	2017-07-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.505	2026-09-13 20:44:57.505	\N
7536942c-1666-4293-b896-8423d92ce3c3	\N	8198144020228366	16157604	SEBASTIAN	CAMACHO PERALES	2018-02-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.506	2026-09-13 20:44:57.506	\N
b4412550-16be-466f-bcf2-ecebda0de850	\N	8198119120227060	15239006	LIAM EMANUEL	CANAVIRI VEGA	2018-01-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.508	2026-09-13 20:44:57.508	\N
db8fb97e-fd05-4948-a4ee-c0102ea13831	\N	819811912022792	15717786	BELEN OLIVIA	CASTRO CONDORI	2017-07-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.51	2026-09-13 20:44:57.51	\N
8ba96824-94f9-4ebb-b5b3-04dd31f3c828	\N	8198119120228867	15720528	YELINNE	CHAVEZ MAMANI	2018-04-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.512	2026-09-13 20:44:57.512	\N
89cf7cc1-0b3a-4d41-b6ec-ea912c505ac4	\N	81981191202235	15515856	EDDY EDUARDO	COCA HURTADO	2018-02-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.513	2026-09-13 20:44:57.513	\N
ea832579-ea25-4fd3-8406-a361de6edd24	\N	8198119120232058	15938212	VICTORIA FIORELLA	CORTEZ SAUCEDO	2018-04-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.515	2026-09-13 20:44:57.515	\N
2e7fadca-358d-4518-9a97-1854feba9498	\N	81980869202247	15231464	SARA VALENTINA	CUBA MONTAÑO	2017-09-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.516	2026-09-13 20:44:57.516	\N
67c997b0-49d0-4feb-a99f-94bd3e67d50b	\N	8198119120228906	15383366	IAN ABDIEL	ESCALANTE ARAUZ	2018-03-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.518	2026-09-13 20:44:57.518	\N
37269b9c-c508-4b30-8856-4cc7d9b64444	\N	8198119120221785	15208129	DARA GALILEA	GUTIERREZ BARRIGA	2018-03-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.519	2026-09-13 20:44:57.519	\N
856a0f8a-dac9-491a-bb1a-61932516369c	\N	8198119120226455	16310498	RAFAELA	GUTIERREZ JOFFRE	2018-04-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.521	2026-09-13 20:44:57.521	\N
70972e3a-a3de-4360-83c8-89a1e22c8f47	\N	8198119120233273	17150796	ISASHI BENJAMIN	HURTADO PALOMEQUE	2018-01-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.522	2026-09-13 20:44:57.522	\N
af18df35-b3b0-4de1-aa9d-4c7e7d816331	\N	3192004720224557	15209689	BENJAMIN JACOB	IBAÑEZ PADILLA	2017-08-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.524	2026-09-13 20:44:57.524	\N
f6262aaa-9b29-4739-a624-2f97617e064c	\N	8198119120227538	15523665	SARAH THAIS	JULIEN ARAUZ	2017-12-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.525	2026-09-13 20:44:57.525	\N
29d28078-e17a-4a82-813b-64a337b55990	\N	8198119120227310	16411626	LUCAS ADRIAN	JUSTINIANO PADILLA	2017-06-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.528	2026-09-13 20:44:57.528	\N
eba9ae24-e495-4541-8271-d2ee00b3736f	\N	819811912022890	17004111	BRIANA NICOL	JUSTINIANO VACA	2018-02-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.529	2026-09-13 20:44:57.529	\N
fff968d3-e1a8-45e3-80a4-940fcce33cbe	\N	8198097820226769	15474200	MIA RAPHAELLA	LIMON CORDERO	2018-02-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.531	2026-09-13 20:44:57.531	\N
5668e48a-bc8b-442c-b55c-0c2d6d1f653f	\N	819811912022753	15402834	ANTONHELY	MELGAR PARADA	2017-08-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.532	2026-09-13 20:44:57.532	\N
588e094a-f6ce-4d7d-b732-5e2e41027255	\N	8198085620223517	17196281	ALEJANDRO RADAMEL	MENACHO VELASCO	2017-12-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.534	2026-09-13 20:44:57.534	\N
1e619ea7-f590-43d7-ba25-ad416b8caf8a	\N	8198119120225064	16982370	IRINA LEONELA	MIRANDA CORTEZ	2017-09-19 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.535	2026-09-13 20:44:57.535	\N
cc35ed2f-970c-4971-9ab2-42cbec1ef023	\N	8198166620225662	15281191	IAN MATEO	OCAMPO CUELLAR	2018-05-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.536	2026-09-13 20:44:57.536	\N
acd583db-dc5d-47fc-9569-fdc45ae1bc58	\N	8198119120228211	15371031	ISOLDE	POQUECHOQUE AGREDA	2018-04-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.538	2026-09-13 20:44:57.538	\N
631d702c-31e3-4148-a252-dd5a3bda2014	\N	8198151920225828	16868411	ISABELLA	RIBERA PADILLA	2017-07-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.539	2026-09-13 20:44:57.539	\N
791a1050-d1cd-4b0b-8b47-a37b79e269f8	\N	8198119220236646	15313668	AGUSTIN	STIPANCICH BRUZZO CASTRO	2018-06-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.541	2026-09-13 20:44:57.541	\N
63edb15c-f141-4a32-89be-25e7dc79330e	\N	8048016820224770	15851366	ISHA HINENI	TEJERINA FARFAN	2018-05-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.543	2026-09-13 20:44:57.543	\N
5dae6e29-b169-4c39-b04a-d8d9c460e4e2	\N	8193003720224326	16515131	DANNA OLIMPIA	TOLEDO VARGAS	2017-12-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.544	2026-09-13 20:44:57.544	\N
332d9aaf-f0f9-4a52-80bb-a13d28d104f2	\N	8198119120214152	16240061	ANALY	AGUILAR FLORES	2017-02-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.546	2026-09-13 20:44:57.546	\N
bcfe0b8f-0725-4482-8841-ca1dad9c978b	\N	819811912020043	14808173	AMIRA VALENTINA	AÑEZ SARAVIA	2016-09-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.547	2026-09-13 20:44:57.547	\N
2f5978b3-1568-439f-9aa5-2cded8847405	\N	8198119120213667	14973353	JOEL	ANGLARILL JUSTINIANO	2017-02-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.549	2026-09-13 20:44:57.549	\N
19b14625-dec2-4ba1-86fb-d555a7641355	\N	8198103720227716	17067318	THIAGO BEZALEEL	ANTEZANA ROBLES	2016-11-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.55	2026-09-13 20:44:57.55	\N
568be396-1559-4258-95fc-3ce7f565fc32	\N	8198156020214100	15551444	JADIEL	ARAMAYO HUALLPA	2017-01-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.552	2026-09-13 20:44:57.552	\N
3a504253-0c00-429f-b263-cd1fd990d67c	\N	8198144020219256	16883930	LIAM KENDRICK	ARENAS CANAVIRI	2016-09-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.553	2026-09-13 20:44:57.553	\N
b3b56d32-fd55-42e4-b698-3c19dbe3b423	\N	8198119120212367	17000064	SAMUEL	AZOGUE BUCETA	2016-11-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.554	2026-09-13 20:44:57.554	\N
f11b1844-11b6-461a-a355-a6bbfb2ea653	\N	8198012320213237	14972507	ROSSIO MIA	BEJARANO HUAYLLA	2017-05-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.556	2026-09-13 20:44:57.556	\N
231255f8-8c0f-4a55-965a-771d294e2fae	\N	8198119120217407	16664468	DARA JUDITH	CHOQUE CAMPOS	2017-01-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.557	2026-09-13 20:44:57.557	\N
555c3991-92e6-45d5-a053-461476a53b0f	\N	819811912020047	17660062	EZEQUIEL	DIAZ BARBA	2016-07-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.559	2026-09-13 20:44:57.559	\N
099d7d50-faf6-4ff2-b327-e79b67ae07e4	\N	8198119120214386	16005478	JESUS EMMANUEL	EGUEZ VEIZAGA	2017-01-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.561	2026-09-13 20:44:57.561	\N
10c2661f-56fb-46ba-a738-31a6ba6abea7	\N	8198146620211852	17000381	MIA VALERIA	ENDARA CARDONA	2017-01-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.562	2026-09-13 20:44:57.562	\N
29f54026-fc3a-463b-8901-4a293882338b	\N	8198144020212213	15962466	VALERIA ARLET	ESCALERA TAMAYO	2016-11-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.564	2026-09-13 20:44:57.564	\N
234ead59-346d-442a-ad7e-cd1eda186fe4	\N	819811912020048	14869445	MARIA ANTONELLA	GARCIA CRUZ	2017-03-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.566	2026-09-13 20:44:57.566	\N
6210f0b6-04c8-4cce-aa19-c7598a109028	\N	819810372022335A	14871625	DANIEL IGNACIO	HURTADO PALOMEQUE	2016-07-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.567	2026-09-13 20:44:57.567	\N
36032e83-a946-40bf-83ec-e3ba7898da71	\N	8198119120211528	17582300	FLAVIO	JUSTINIANO GALINDO	2017-01-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.568	2026-09-13 20:44:57.568	\N
58a63b09-46b2-4591-9564-975a1e02be12	\N	8198000820217236	15528998	RONNY GAEL	LIJERON DELGADILLO	2016-12-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.57	2026-09-13 20:44:57.57	\N
d4a5f093-0326-48aa-8c59-5fc8550d2f97	\N	819811912022385A	15961791	ROXANA NAZARETH	MEDINA ALMANZA	2016-08-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.572	2026-09-13 20:44:57.572	\N
e246333b-3556-4119-8515-e19b8c9086db	\N	819811912020054	15063964	JUAN SANTIAGO	MENA SANCHEZ	2016-07-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.573	2026-09-13 20:44:57.573	\N
41dfa627-6549-4aac-89d5-902bb9fecf01	\N	819811912020055	15030661	SALOMON	MOLINA FERNANDEZ	2017-06-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.574	2026-09-13 20:44:57.574	\N
78815367-2823-417b-ba31-9b954fa19d77	\N	8198119120216911	14990849	RUTH NAOMI	MONTAÑO CALVI	2017-05-25 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.577	2026-09-13 20:44:57.577	\N
865315e4-49e3-4e5f-bffe-ee9ef54bab30	\N	8198119120216541	13253266	ANDERSON RUBEN	MORALES MAMANI	2016-07-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.579	2026-09-13 20:44:57.579	\N
cb967836-97fa-4ea1-983b-08de8fa39ec4	\N	8198023920216133	16269880	MARIANA	QUISBERT CORTEZ	2016-10-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.58	2026-09-13 20:44:57.58	\N
831cf55a-ff46-41ba-9a6c-ed814dfeff73	\N	819811912020059	16180854	NICOLAS ELIAM	RODRIGUEZ GIL	2017-06-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.581	2026-09-13 20:44:57.581	\N
3cc2fe81-01be-487b-94f4-9d40fc7b6b23	\N	819811912020060	15189936	CESIA	ROMERO CALLAO	2016-11-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.583	2026-09-13 20:44:57.583	\N
8317129b-13fe-472c-b831-52ec67a73f89	\N	8198023220217744	16644148	LEO EMANUEL	RUIZ RUIZ	2016-09-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.584	2026-09-13 20:44:57.584	\N
3899c9a3-daad-4271-a831-a42d86dea313	\N	8198119120216649	15517621	MATHIAS	SALVATIERRA BARBA	2017-04-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.585	2026-09-13 20:44:57.585	\N
54abe713-5ea6-409e-92bb-f582a7acaaed	\N	819810372022291A	16974257	LIAM GAEL	SANDOVAL AGUILAR	2016-11-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.587	2026-09-13 20:44:57.587	\N
3fdbcafc-956c-4436-bf39-19aef960b271	\N	8198119120229129	15555091	SEBASTIAN	SOLARES BECERRA	2017-06-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.588	2026-09-13 20:44:57.588	\N
481e32b7-3a6d-4ffd-b4ec-fdcd0c48b6bd	\N	819811912021518A	16307885	MOISES	SUAREZ ROSPILLOSO	2017-02-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.59	2026-09-13 20:44:57.59	\N
ea71259f-0381-4648-add0-6476bedac602	\N	8198144020213325	14971413	FIORELLA	TORREZ LARREA	2017-05-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.591	2026-09-13 20:44:57.591	\N
83b4b079-782e-4d38-8551-d2f228721069	\N	8198119120216165	14993702	ARLET	VACA GUANDURUY	2017-01-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.593	2026-09-13 20:44:57.593	\N
29d97043-6786-464a-82a2-29a56440f89b	\N	8198119120217397	14970633	MILA ALEJANDRA	VARGAS PAREDES	2017-05-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.595	2026-09-13 20:44:57.595	\N
48311ae6-ed22-4b29-9c70-2db95e6f60db	\N	8198158420214307	15037848	MIKAELA	ALVAREZ CARDOZO	2017-03-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.596	2026-09-13 20:44:57.596	\N
1f7b3b02-9644-4ff0-8092-f1183d0d7a4c	\N	8198112120211464	14970745	JOSUE	ANTEZANA BALDIVIEZO	2016-09-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.598	2026-09-13 20:44:57.598	\N
1190a124-f255-4fb6-a92e-390d37be2b6f	\N	8198123220218550	16392006	DIOGO	AVILA AYALA	2017-06-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.599	2026-09-13 20:44:57.599	\N
ecf5ec5e-2305-4871-a67c-bcf751f9cff6	\N	8198097720226589	17064270	MARTINA	BERNAL JIMENEZ	2017-04-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.6	2026-09-13 20:44:57.6	\N
5a448581-d857-4949-9e8e-93b15ecce6cd	\N	8198119120229158	15423702	JUAN DIEGO	CACERES VALDA	2017-05-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.602	2026-09-13 20:44:57.602	\N
8a3adffa-5350-4452-8aeb-7387a610bfa3	\N	8198119120219335	15863189	LYAM SAID	CESPEDES MONTAÑO	2016-09-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.603	2026-09-13 20:44:57.603	\N
729a9aa0-096b-4709-8087-99b157f477bc	\N	819814402021798A	16512324	LIAM EMANUEL	CHAVEZ ROUG	2016-12-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.605	2026-09-13 20:44:57.605	\N
be46ebb4-e856-4abc-9d48-882e6f60d338	\N	8198053920217686	15635779	BRITHANY FABIANA	CHOQUE DIAZ	2016-06-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.606	2026-09-13 20:44:57.606	\N
8fa1c263-76ab-4275-ae8d-ce65e4880be7	\N	8198121520211439	14992220	JHERAN JOSUE	CHUMACERO PEREZ	2017-06-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.607	2026-09-13 20:44:57.607	\N
f16047fa-3896-453f-b1bb-9ae76fc02b56	\N	8198060320214798	15062027	ARLETT GUADALUPE	ESCALIER COSSIO	2017-03-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.609	2026-09-13 20:44:57.609	\N
c21b1887-4ae1-4976-a753-63e09044a2fd	\N	8198023220214779	16925116	ABNER RAFAEL	HERRERA PARARI	2017-05-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.611	2026-09-13 20:44:57.611	\N
354c935b-2683-4621-bf93-72923750f5e8	\N	8198144020218099	14873419	VLADIMIR	JACINTO LEYGUE	2016-09-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.613	2026-09-13 20:44:57.613	\N
b3b83982-e5b7-42c4-8ece-cb8343aa0630	\N	819811912020050	15523648	ALEXIA VALENTINA	JULIEN ARAUZ	2016-07-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.614	2026-09-13 20:44:57.614	\N
aaadffa4-1f0b-455a-b5c8-fedf5afbf458	\N	819811912022783A	S/CI-819811912022783A	MAGDIEL	LEAÑOS FLORES	2016-12-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.616	2026-09-13 20:44:57.616	\N
4f4d2f89-a9a0-4bca-b54f-25d0049e2683	\N	8198144020216706	14877917	RUDY	LEIGUE IBAÑEZ	2016-08-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.617	2026-09-13 20:44:57.617	\N
3df4580d-9003-4081-892b-b8e2026218c5	\N	819811912020008	15578839	CAMILA	MERCADO ROBLES	2016-04-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.619	2026-09-13 20:44:57.619	\N
4171177c-ade0-4667-be2f-29794d4d3c18	\N	8198144020215805	16863856	LUKA	MUÑIZ RIVERO	2016-12-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.62	2026-09-13 20:44:57.62	\N
605bfb75-bd15-4e17-89ac-7b2def10ad20	\N	819812122022711	17242731	ANNEL TIRZA	MURGA CARVAJAL	2017-05-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.621	2026-09-13 20:44:57.621	\N
3757598b-0567-48e0-ae91-e29576651c4c	\N	8198119120221175	17031044	SERGIO	PARICAHUA PEREZ	2017-04-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.623	2026-09-13 20:44:57.623	\N
790d82cc-2522-466e-9c6f-462ec9180432	\N	8198143020219491	16301703	FABRICIO	PINO CUELLAR	2016-09-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.624	2026-09-13 20:44:57.624	\N
9a3e7416-873c-46aa-87e7-2719e8f1b763	\N	8198053920212507	16751019	EMMA VALENTINA	QUINTELA RIVAS	2017-05-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.627	2026-09-13 20:44:57.627	\N
76ccb9cd-fa30-4003-91a4-11782dba8882	\N	8073046620212060	16581034	MICAELA ARELI	REYEROS GOSALVEZ	2017-03-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.628	2026-09-13 20:44:57.628	\N
636e953a-f989-43b9-bc46-86771525b66e	\N	8198148820215360	14871402	SANTIAGO	RODRIGUEZ LOPEZ	2016-07-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.63	2026-09-13 20:44:57.63	\N
db78800b-99aa-4882-9914-c683e3d6f311	\N	8198119120226916	17013144	MAIA	SOLIZ AYALA	2016-12-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.631	2026-09-13 20:44:57.631	\N
d8670d3d-ca00-4b95-9038-59bb28372202	\N	8198048720217823	16992164	SAMIRA	SUAREZ MONTENEGRO	2016-09-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.632	2026-09-13 20:44:57.632	\N
9c4652c5-a4ae-4ea4-adf2-6ece927a1cb7	\N	8198144020215224	14934941	SAMANTHA	SUAREZ VASQUEZ	2016-10-25 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.634	2026-09-13 20:44:57.634	\N
2c417cbd-7b1c-4728-967f-50b9e4308944	\N	8198119120221454	16818814	CRISTOBAL	VALETA ZABALA	2016-09-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.635	2026-09-13 20:44:57.635	\N
f7829be9-1192-47d6-9e36-ec2d140337f7	\N	8198111820213337	15236757	NICOLAS MATHIAS	VERDUGUEZ GONZALES	2017-06-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.637	2026-09-13 20:44:57.637	\N
369bb540-880a-41ed-96b2-c490f515a12e	\N	819811912020062	17005088	MATHIAS	VIDAL PRADEL	2016-07-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.638	2026-09-13 20:44:57.638	\N
a1eec824-41e1-49f6-894d-2345f8ebed5f	\N	8198144020211426	15325059	NAYELI FERNANDA	VIRUEZ LOBO	2017-02-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.639	2026-09-13 20:44:57.639	\N
b4d27c37-991d-43b8-a4b7-23fd3b91d9a8	\N	8198125820219528	15611380	ABDIEL	YUCRA SUAREZ	2017-06-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.641	2026-09-13 20:44:57.641	\N
4c1a0cfb-a588-43a5-b94b-b18eede77bab	\N	8197004120211857	16414578	SALVADOR	ZABALA ZABALA	2017-02-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.642	2026-09-13 20:44:57.642	\N
545afd34-61d1-4ffb-8018-e8c29bf255b6	\N	819811912019026	15932788	ROSEMBERTH	AGUILERA LEAÑOS	2015-09-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.644	2026-09-13 20:44:57.644	\N
58390e30-8e88-43b3-934d-c7e3320f7113	\N	819816572019013	16304420	IAN CARLO	ANTELO CHAVEZ	2016-03-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.646	2026-09-13 20:44:57.646	\N
c3443927-da9a-4ff7-84ae-c9c4299bd1ad	\N	819811912020001	17067305	ARELI SHARLET	ANTEZANA ROBLES	2015-08-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.647	2026-09-13 20:44:57.647	\N
291b80d6-f3e1-4374-8902-f4913657ab60	\N	819811912020003	15572930	ELIAS	ARANCIBIA VASQUEZ	2016-01-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.649	2026-09-13 20:44:57.649	\N
9cca88a6-238b-4812-8860-97cbb3eb5bce	\N	819811912019014	15720567	MILETT	ARANIBAR VERDUGUEZ	2015-10-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.652	2026-09-13 20:44:57.652	\N
da12afa9-729d-4556-a250-92db83ff86b8	\N	819811912020016	15587465	JOSIAS ALBERT	ARAUZ PALAVECINO	2016-04-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.654	2026-09-13 20:44:57.654	\N
5d817a33-5c27-4ea8-93a7-43788e83b897	\N	819802602020039	14942629	YERKO	BUTRON SAUCEDO	2016-02-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.656	2026-09-13 20:44:57.656	\N
bbcdeded-c0dd-4a41-90b8-42a622f4dcf9	\N	819811102020032	16263119	SHARON ARELY	CHOQUE JALDIN	2016-03-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.658	2026-09-13 20:44:57.658	\N
5d78af6b-0ba1-4225-881f-9d09ae9808d9	\N	819812322020050	17380449	AARON	COLQUE SACA	2016-06-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.661	2026-09-13 20:44:57.661	\N
e5586701-83af-4a19-a4c0-6faca2448d15	\N	819811912019092	14749265	XIOMARA ABIGAIL	CORDOVA QUIROGA	2016-01-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.662	2026-09-13 20:44:57.662	\N
9b9b1e70-396c-4fdb-b9eb-b686781215c4	\N	819811912020005	15520851	JOSIAS	CUELLAR AÑEZ	2016-06-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.664	2026-09-13 20:44:57.664	\N
be9e963d-af8d-4d59-b264-d914e197928b	\N	819802552020042	15241873	BRISIA ISABELLA	GONZALES CLAROS	2016-05-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.665	2026-09-13 20:44:57.665	\N
d013137b-9d8f-460f-8c83-5f7c7024c98d	\N	819811102020010	17263963	SEBASTIAN	GONZALES RICALDIS	2015-08-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.667	2026-09-13 20:44:57.667	\N
be0e4f07-df6a-4420-bf64-bd115d2a3efe	\N	819811912019017	14632570	EMILY SHARON	GUTIERREZ MEDINA	2015-12-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.668	2026-09-13 20:44:57.668	\N
f9c54e92-7b68-4011-937c-c5df96ca45ec	\N	819809822020871A	15548217	DEILY ANABEL	JURURO FERNANDEZ	2016-06-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.67	2026-09-13 20:44:57.67	\N
fea0dc71-1eff-4481-8299-a7489efdb22c	\N	819811912020006	16995599	RENATO	JUSTINIANO JUSTINIANO	2016-01-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.672	2026-09-13 20:44:57.672	\N
cbe8a31a-2563-4bb8-9105-03890c196dac	\N	819811912020069	14659009	YAMILE BELEN	LLANQUE TAPIA	2016-03-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.673	2026-09-13 20:44:57.673	\N
b28ac651-c527-4088-b3b6-6cd78149c6ea	\N	819811102020041	14930231	SANTIAGO	MALDONADO ESPINOZA	2015-09-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.674	2026-09-13 20:44:57.674	\N
fa53599d-1c31-48da-ba77-3e81928f3cf6	\N	819811912019027	14724504	AINARA	MENDEZ MELGAR	2015-12-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.677	2026-09-13 20:44:57.677	\N
d480e876-6633-4511-9ce7-dfb2882520f6	\N	8198103720216519	16291338	SHALEM	PAZ AGUILERA	2016-03-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.679	2026-09-13 20:44:57.679	\N
c421d758-e8e2-4bb1-97fb-e420fc49a60c	\N	819811912020070	14968032	MISAEL	PEÑA CARIUNDI	2016-03-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.68	2026-09-13 20:44:57.68	\N
eb504caa-ebd3-401b-899d-239123e069fc	\N	8198123920202029	15121181	ELIAS EIDHEN	PEREZ CAVERO	2015-10-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.682	2026-09-13 20:44:57.682	\N
2f012e25-265f-4861-a0e4-583235608034	\N	819814402020014	14874097	EDWARD JACOB	PIMENTEL FELIX	2015-12-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.683	2026-09-13 20:44:57.683	\N
13c7f5b1-746c-4324-9b74-660ff66cfb9a	\N	819811912020009	16180841	RUTH BRISA	RODRIGUEZ GIL	2016-04-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.685	2026-09-13 20:44:57.685	\N
ee7cc9f8-f8b8-4cbb-a557-570e69aba05b	\N	819811912020071	15277641	ANNEL SAMARA	RODRIGUEZ HEREDIA	2015-07-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.686	2026-09-13 20:44:57.686	\N
c8e9745d-934a-4d05-bdea-60d00f1cad11	\N	819801282020065	16142237	ANDERSON	RODRIGUEZ TAPIA	2015-11-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.687	2026-09-13 20:44:57.687	\N
31055de6-0c1a-48ff-85a5-d9c64298a1e1	\N	819811912019054	15466534	NICOLAS	ROJAS PADILLA	2016-02-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.689	2026-09-13 20:44:57.689	\N
c9f3464b-0b0f-4449-8d78-4e04bfef7b2e	\N	819811912019028	14868957	JOSE MIGUEL	ROJAS PEDRAZA	2016-03-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.69	2026-09-13 20:44:57.69	\N
33649d4b-29a1-4543-b92b-8ade3818667c	\N	819811912020072	17046901	LEANDRO	SALAS CAERO	2016-01-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.692	2026-09-13 20:44:57.692	\N
4eb406b5-a8ba-4de0-88fd-1b38a8277106	\N	819811912020011	16327529	SEBASTIAN ANDRES	SAUCEDO CHURA	2015-09-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.694	2026-09-13 20:44:57.694	\N
35418ee6-3131-41e6-881b-65c4e601e9f5	\N	819811912020012	14385898	BRUNO	SOLETO GUARDIA	2015-09-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.696	2026-09-13 20:44:57.696	\N
bd6cbe75-90c9-43cc-92f0-c5b73b613db6	\N	819811912020014	15782284	SAUL ALEJANDRO	TORRICO DOMINGUEZ	2016-05-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.697	2026-09-13 20:44:57.697	\N
54a9a653-8770-43f8-801f-c8bafc84f67a	\N	819802602020037	14457991	MATIAS	URGEL MELGAR	2016-04-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.699	2026-09-13 20:44:57.699	\N
7cca7829-8358-4ac9-9e83-c55c43be7f1d	\N	8198119120217089	16630684	LUCAS DANIEL	AGUILAR TORREZ	2015-10-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.7	2026-09-13 20:44:57.7	\N
6105ff55-8cb4-4490-bc4b-75eb616fc72d	\N	8198115920202603	17026240	NICOLAS	AÑEZ BENDEL	2016-03-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.701	2026-09-13 20:44:57.701	\N
eae11bdf-d8d4-41e0-8740-3eb39ef08436	\N	8198109320207916	16549551	AARON	ARDAYA AYALA	2016-03-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.703	2026-09-13 20:44:57.703	\N
1df0b1fd-017d-4ad7-8d9c-31c5656b471c	\N	8048005120212493	17116670	EIMI RUBI	CALDERON CORONADO	2015-08-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.704	2026-09-13 20:44:57.704	\N
9251ecc9-fc9f-4d32-800a-f0554aa7e31c	\N	819814402020006	16157592	EILEEN	CAMACHO PERALES	2016-01-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.705	2026-09-13 20:44:57.705	\N
d443c585-d8da-4cb4-b9c1-f760db74da7b	\N	819810372020006	14665608	ELSA FABIANA	CESPEDES MENDEZ	2015-11-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.707	2026-09-13 20:44:57.707	\N
470edd5f-57e5-4878-869d-679dd2673500	\N	819811912020018	15674277	BRISEYDA	CHAVEZ MAMANI	2016-06-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.709	2026-09-13 20:44:57.709	\N
ac7af626-abaa-4572-86af-90007c2b7ad6	\N	8198165920208252	16307635	SOFIA ANGELA	CHAVEZ VICENTE	2015-07-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.711	2026-09-13 20:44:57.711	\N
b59ce17c-48f6-4aa4-9bd4-e7b3d71e6cad	\N	819811912020019	17003642	MAYLEN SARAI	CONDORI LOPEZ	2016-06-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.713	2026-09-13 20:44:57.713	\N
61fe3bb6-2f07-4726-9343-c138cb701c85	\N	819811912020020	15877163	MAXIMILIANO	DURI NAURO	2016-01-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.714	2026-09-13 20:44:57.714	\N
57b08512-cc1c-4e77-addf-202b8690baf2	\N	819811182020009	15640631	ERIBERTH BRUNO	FALDIN VACA	2016-02-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.715	2026-09-13 20:44:57.715	\N
90565292-fec0-4b25-abfc-17e9eae51b42	\N	8198119120215138	14478302	SAMUEL	GUTIERREZ GIRONDA	2016-04-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.717	2026-09-13 20:44:57.717	\N
ac2ee8de-ee2e-41ea-92f9-1af3e0e212e1	\N	8198144920217013	15235643	SANTIAGO	GUTIERREZ VARGAS	2016-05-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.719	2026-09-13 20:44:57.719	\N
c957f262-7c65-4e8b-9e43-5fc66464e08d	\N	8198165920201096	15524895	IVER ADRIAN	GUTIERREZ ZEBALLOS	2016-04-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.72	2026-09-13 20:44:57.72	\N
6a475e8f-6166-4fee-99ec-3398403610f8	\N	819811912020022	15324622	BRIANNA FABIOLA	HEVIAVACA VASQUEZ	2016-03-21 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.722	2026-09-13 20:44:57.722	\N
f95eb84b-c1bc-458b-9060-e8ec692a091c	\N	8198103720218453	15471115	ALLISON	LIMON BARRON	2015-07-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.723	2026-09-13 20:44:57.723	\N
af66403d-0ec5-4cd5-83e7-29a714938b02	\N	819802552020122	16311810	ADRIANA GUISEL	MAMANI SOLIZ	2015-11-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.724	2026-09-13 20:44:57.724	\N
dad90ceb-1811-453c-b047-9c6bc064e450	\N	819811912020007	16264302	CARMELO	MENACHO CESPEDES	2016-05-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.727	2026-09-13 20:44:57.727	\N
b824fdc7-73ba-43da-862f-d8c9ec0dc42c	\N	819814402020011	15411066	NAHIARA AYDEM	MORUNO PERALES	2015-07-31 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.729	2026-09-13 20:44:57.729	\N
9be3fba8-e56a-4a1f-a6dc-7b85aec07153	\N	819812432020016	16211063	ABIGAIL FERNANDA	PANIAGUA VIZA	2016-03-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.73	2026-09-13 20:44:57.73	\N
0904ce9a-e8f2-477d-8468-7d1ebeb883dd	\N	8198119120216421	17022586	LUCAS	PARDO SIERRA	2016-03-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.732	2026-09-13 20:44:57.732	\N
b6c15720-f35e-4de3-be3c-652023ed37a2	\N	819812252020013	14936170	VALENTINA	RIVERA LAPACA	2016-04-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.733	2026-09-13 20:44:57.733	\N
c80eb055-afa9-49c8-81ee-7e4af2c22c3d	\N	819812602019022	15553408	SASHA	RIVERA RODRIGUEZ	2016-06-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.734	2026-09-13 20:44:57.734	\N
513096be-5bde-4040-a6ce-c8c757311410	\N	819811912019055	15953948	ANGEL YASHELL	ROSALES BARRIOS	2015-09-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.736	2026-09-13 20:44:57.736	\N
3f428560-755f-422b-9bc2-7e2b68576463	\N	8198111120207185	14386114	MATIAS ALEXANDER	SOLARES BECERRA	2015-09-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.737	2026-09-13 20:44:57.737	\N
4065ab7d-f63d-4d70-9f21-349834a662f6	\N	819810372020018	15175616	SANTIAGO	SUAREZ ROSPILLOSO	2016-01-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.739	2026-09-13 20:44:57.739	\N
0fa76439-36ab-452a-affe-92a8636f2cf4	\N	8173018420203235	13169089	LUIS MATEO	TEJERINA FARFAN	2016-01-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.74	2026-09-13 20:44:57.74	\N
1ea918ec-2b6b-4304-978b-106eea76c326	\N	819811322020117	16682251	IBEN ALBEIRO	URIMO CARDON	2016-04-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.742	2026-09-13 20:44:57.742	\N
25c9184a-41cc-4315-baf5-efd1b9e622ef	\N	819811912020031	15593349	FACUNDO	VACA GONZALES	2016-04-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.744	2026-09-13 20:44:57.744	\N
ad60fe8f-63c7-44c4-9205-d15d9f65ee88	\N	819811912020032	14750026	TALITHA BRYANNA	VALVERDE AGUILAR	2015-12-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.745	2026-09-13 20:44:57.745	\N
1395249c-4044-4a2b-8f34-9987caf43b34	\N	8198106420212881	14779295	IVAN JOSUE	VARGAS CHUMACERO	2016-02-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.747	2026-09-13 20:44:57.747	\N
8e40e7b4-9369-4498-83ff-801c298142d7	\N	819811912020033	14470509	ANTONELLA JADE CECILIA	VEGA VARGAS	2015-12-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.748	2026-09-13 20:44:57.748	\N
c7d26dbb-d831-4551-b7e8-cc4e95395424	\N	819804872020056	14576947	BRIANNA	VELEZ MONTENEGRO	2015-10-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.75	2026-09-13 20:44:57.75	\N
53bdd0f0-8983-494e-80d9-5bb50a97a6d0	\N	819815402019002	14574685	SANTIAGO	ALVAREZ CARDOZO	2015-04-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.751	2026-09-13 20:44:57.751	\N
6723afa6-af66-4881-8e24-390b7ddd3cee	\N	819802612019055	14929741	GERSON RAFAEL	AMAYA MELGAR	2015-02-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.752	2026-09-13 20:44:57.752	\N
b1095869-72f3-4eac-9630-085f418d1a6d	\N	819811912018044	14137726	JOSE DIER	ANDRADE RAMOS	2015-02-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.754	2026-09-13 20:44:57.754	\N
5c08ed21-70ab-43f5-a55a-64376e702948	\N	819814402019002	14135684	ADRIANA	ARANCIBIA MARISCAL	2014-08-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.755	2026-09-13 20:44:57.755	\N
006d9dc1-83a2-4638-b49e-b7211197eb03	\N	819811912019053	15494039	ANA AYELEN	CABALLERO VARGAS	2015-05-31 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.756	2026-09-13 20:44:57.756	\N
5618ed54-fd7c-4ce2-9f53-5607fe62b3f3	\N	819808692019009	14689359	PAUL MATIAS	CUBA MONTAÑO	2014-08-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.758	2026-09-13 20:44:57.758	\N
595a780c-520f-43c5-be48-590f06be4a77	\N	819811912018060	S/CI-819811912018060	DAVINIA	DEL RIO PALACIOS	2014-11-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.76	2026-09-13 20:44:57.76	\N
589d5611-423e-4658-9f7f-faeb6bd66bd1	\N	819811912018050	15307583	JAMES JUNIOR	DURAN PATICU	2015-03-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.761	2026-09-13 20:44:57.761	\N
d85687f4-fa4c-4951-9c50-3479a6cc5f68	\N	8198165920209056	14407355	NAZARETH	FLORES MARQUINA	2015-04-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.763	2026-09-13 20:44:57.763	\N
2cb0fcd7-0d93-42d9-995f-7b5052ffa034	\N	819811912019066	14990887	VALENTINA	GIL CAMPOS	2015-03-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.764	2026-09-13 20:44:57.764	\N
1d6d07cc-16e8-4dba-854b-980542e574e2	\N	819802512019053	15241941	JUAN DANIEL	GONZALES CLAROS	2014-10-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.765	2026-09-13 20:44:57.765	\N
6d4b118c-3c0d-4693-ac4f-3b0220358466	\N	819811102019045	14435882	MARIA ALEJANDRA	JALDIN SOLARES	2015-05-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.767	2026-09-13 20:44:57.767	\N
91f7a403-cc7c-4bee-9284-f6199e62f0b2	\N	819814402019037	14775607	AGUSTIN GERALD	LORENT LOPEZ	2015-06-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.768	2026-09-13 20:44:57.768	\N
7f016b6b-41cb-4eac-809c-a1a3d2e63a16	\N	819802392019013	14659405	AVRIL LIA	LUNA APAZA	2015-06-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.769	2026-09-13 20:44:57.769	\N
e91b1ee1-735a-4501-a4f8-1caec833522e	\N	819811912018063	15961763	MATEO	MEDINA ALMANZA	2015-05-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.771	2026-09-13 20:44:57.771	\N
42b6cdef-2ea0-4209-a686-001616036996	\N	8198059720205099	15836836	CAMILA	MELCHOR PALACHAY	2015-06-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.772	2026-09-13 20:44:57.772	\N
0598cf64-ba0c-4cd2-a2fc-e94e725d1162	\N	819810372019001	15931054	GUSTAVO ADRIAN	MONTAÑO BAYA	2014-11-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.773	2026-09-13 20:44:57.773	\N
4f1a4405-16ab-4bde-9e44-e76407d18b2d	\N	819809822019055	15045167	YAISA PATRICIA	ONDARZA ROCABADO	2015-03-18 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.776	2026-09-13 20:44:57.776	\N
c5e3c9cc-0fb5-4ed8-8614-934ff9766944	\N	8198060420208320	16655838	VALENTINA	ORELLANA YUCO	2015-06-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.778	2026-09-13 20:44:57.778	\N
8e2df95f-d108-4c31-9e84-7363d01591bf	\N	819811912018053	14474320	NOEMI ARACELI	ORTEGA CORDERO	2015-01-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.779	2026-09-13 20:44:57.779	\N
28ecd380-96c1-4f19-9acf-94e101e3f493	\N	819811912019067	15733327	VALENTINA	ORTIZ ROMERO	2014-10-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.781	2026-09-13 20:44:57.781	\N
5e5ae243-d9eb-4d9a-8421-30892193f881	\N	819811912018048	15258688	BENJAMIN JOEL	PANIAGUA POMA	2015-01-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.782	2026-09-13 20:44:57.782	\N
937409f3-1dc7-4f78-8d21-a90048f2e86a	\N	819811912019056	14989650	LEONELA	PANIAGUA ROJO	2015-03-31 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.783	2026-09-13 20:44:57.783	\N
8b0ead23-ef2a-4077-bac9-bd5c0567f10a	\N	819814402019014	15741261	EMMANUEL	PARADA TORREZ	2015-02-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.785	2026-09-13 20:44:57.785	\N
7e32bcdf-3b76-4168-8372-251a496f0c1c	\N	819811912018035	15253263	ABBY DUANETH	RODRIGUEZ ROCABADO	2014-07-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.786	2026-09-13 20:44:57.786	\N
c88f45d2-af9c-4e06-abca-ec5e4b65cc2a	\N	819811912019062	15491105	IVANA VICTORIA	SAUCEDO CHURA	2014-07-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.787	2026-09-13 20:44:57.787	\N
a659583a-6f88-480e-b80b-7ff9d18eac25	\N	819802322019027	14723849	LUCIANA	SOLETO OCAMPO	2014-08-28 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.789	2026-09-13 20:44:57.789	\N
7e1e996d-a500-4561-82c4-bbab4a384a17	\N	819811912018034	14253799	ANDRES	SUAREZ MELGAR	2014-12-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.79	2026-09-13 20:44:57.79	\N
2977f0ec-7faf-422c-86b2-d476107bfb4c	\N	819811362019042	14161272	KANDRA DOMINIQUE	TORREZ PEÑA	2014-07-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.792	2026-09-13 20:44:57.792	\N
4976ee35-d9f2-41ef-bd05-9b4ba1a4917a	\N	819811912019076	14635095	ISA VANESA	VASQUEZ NEGRETE	2015-04-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.794	2026-09-13 20:44:57.794	\N
cdf0ed76-16d6-4546-8b85-3ee02200cd5a	\N	819811912019080	15953049	KEVIN	ZAPATA FORERO	2014-07-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.796	2026-09-13 20:44:57.796	\N
33e3d059-ed45-481f-9357-9a71e43a5ef6	\N	819815842020034	14453882	AILIN MIKAELA	ALGARAÑAZ MONTERO	2014-10-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.797	2026-09-13 20:44:57.797	\N
3b493ebd-03d6-4293-bf52-48c20a5916a0	\N	819811912020035	13456540	JOSE ENRIQUE	BELTRE RUA	2014-07-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.798	2026-09-13 20:44:57.798	\N
f102f8c2-89d5-41b2-9335-efe07d47e0ae	\N	819811912019072	15943694	MARIEL	CASTRO QUISPE	2014-08-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.8	2026-09-13 20:44:57.8	\N
3bc593ef-c763-4073-a21c-8c93aa442b62	\N	819802392019038	15863256	JORGE DYLAN	CESPEDES MONTAÑO	2015-06-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.802	2026-09-13 20:44:57.802	\N
ef30db7c-63b7-4a7d-9889-b3688a5a31d7	\N	819811912019058	14942736	DANELI	CLAROS ARAS	2015-06-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.803	2026-09-13 20:44:57.803	\N
5b9ac2dc-4180-45b4-a567-7aca90fe13dc	\N	819809782019054	16202666	JULIO IGNACIO	CUELLAR ALARCON	2014-08-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.804	2026-09-13 20:44:57.804	\N
bbffe19c-20c1-42a4-968c-8a117fef12b3	\N	819811912019041	14469437	LUCAS	DOMINGUEZ MOGROVEJO	2014-12-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.806	2026-09-13 20:44:57.806	\N
e64af6a3-e07f-4b17-b698-f699cb112c69	\N	8198119120184986	15962737	LUCAS MAGDIEL	FARELL CAMACHO	2014-08-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.807	2026-09-13 20:44:57.807	\N
4a94e5d2-44b4-4b53-89b8-25be15b68688	\N	819811912019085	15942507	ADRIAN NATANAEL	FARFAN JUSTINIANO	2015-04-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.809	2026-09-13 20:44:57.809	\N
97e4ebef-75d8-4ae1-82c7-846a89335475	\N	819811912019084	14409483	MARIO ANDRES	GARCIA CRUZ	2015-04-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.811	2026-09-13 20:44:57.811	\N
1f5ee723-fd06-40b1-a894-537cc6588cfd	\N	8198144920203171	15235589	ISLAY	GUTIERREZ VARGAS	2014-07-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.812	2026-09-13 20:44:57.812	\N
d4f50e0a-0d6d-4771-81ee-5733e6a4e524	\N	819815762019034	15576009	TIFFANY	MARQUEZ MONTERO	2014-09-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.814	2026-09-13 20:44:57.814	\N
5e56c935-17fb-4b86-928b-5866081b25b0	\N	819809342019033	14467440	LENA CONSTANZA	MENA SANCHEZ	2014-09-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.815	2026-09-13 20:44:57.815	\N
390769a1-852a-4376-ab27-c20b934da1a2	\N	819811912019047	16811746	JAIRO THARIEL	MENDOZA ROMERO	2014-10-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.816	2026-09-13 20:44:57.816	\N
54005066-2a81-4400-a8d4-91851b7b957f	\N	8198156920204116	15608284	BRIYITH DANIELA	MONTENEGRO VASQUEZ	2015-05-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.818	2026-09-13 20:44:57.818	\N
a1705437-d88c-4b2d-9b74-7a8716a8e56e	\N	819814402019012	16863879	EMMA	MUÑIZ RIVERO	2015-03-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.819	2026-09-13 20:44:57.819	\N
e07896ff-432a-4116-b6e8-5646ae93b9a6	\N	819811912018036	14786819	SANTIAGO	MUÑOZ CUELLAR	2014-11-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.821	2026-09-13 20:44:57.821	\N
1acef56d-5214-424e-9fe0-5e4e79fc847d	\N	819811912019045	14903691	LUCAS ROBIN	OROCONDO ACAPA	2015-04-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.822	2026-09-13 20:44:57.822	\N
77ee6d6e-d31e-4b4e-9ea4-f2dba6c7ccbb	\N	619200012019024	15397891	MILAN	PADILLA EGGERS	2015-06-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.823	2026-09-13 20:44:57.823	\N
912c6256-fca6-4bfa-8da6-c889eeedce13	\N	819811912018039	14971461	AARON	PANAMA UGARTE	2014-09-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.825	2026-09-13 20:44:57.825	\N
56e92556-08ac-4c14-bddb-acafee984777	\N	819812252019019	14254972	SEBASTIAN	PARDO FLORES	2015-03-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.827	2026-09-13 20:44:57.827	\N
5370462a-4001-44dd-8055-ba1be84d3a59	\N	819811912018041	15941603	JESSIA FRIDA	PAREDES CAMACHO	2015-05-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.829	2026-09-13 20:44:57.829	\N
071a7ca8-5d8f-4671-95fe-5fbaad2392ed	\N	819811292019014	14271036	FERNANDO GAEL	PEÑA SERRANO	2015-05-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.83	2026-09-13 20:44:57.83	\N
72b77d5a-2d61-4dfc-bc89-39af54309df7	\N	819811912020039	17052215	ADRIANA SARELY	RIVERO VALVERDE	2014-09-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.831	2026-09-13 20:44:57.831	\N
9c18c5b9-550a-480e-ad9e-9e5cd2141ed8	\N	807304662019201	14703699	VICTORIA ISABELA	ROJAS MACHICADO	2014-09-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.833	2026-09-13 20:44:57.833	\N
f9e07b6b-ea12-41b6-be18-f329b1ac6ff9	\N	819810372019020	15966055	VIOLETTA ALESSIA	SEJAS ALVAREZ	2014-09-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.834	2026-09-13 20:44:57.834	\N
0566182f-d409-400b-a6b1-83690d9114cb	\N	819811912018038	14656784	MAXIMILIANO	TORREZ ALESSANDRI	2015-02-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.835	2026-09-13 20:44:57.835	\N
e843d230-29e4-402e-941a-41039268f828	\N	819811322020011	16682260	SHERLIN DOMINIK	URIMO CARDON	2015-03-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.837	2026-09-13 20:44:57.837	\N
57ab4fd4-094e-43fe-9978-9d632a6e9c90	\N	819812192019034	14972914	FLAVIA	VACA OVANDO	2014-12-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.838	2026-09-13 20:44:57.838	\N
edaa1019-8f16-468f-9db5-1cd3f8fa1920	\N	819811182019003	14662058	LUCAS FABRICIO	VACA SEMO	2015-06-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.84	2026-09-13 20:44:57.84	\N
955ca492-3471-4f9c-81b7-e2d7b7160263	\N	819802612019117	16597922	EIMY NICOL	YEYANDAR TRIGO	2014-08-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.841	2026-09-13 20:44:57.841	\N
61bb5f5e-2a9b-4420-84a2-8b09881b07e7	\N	819812432019008	14874315	AMIEL ARIADNA	YUCRA SUAREZ	2015-06-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.843	2026-09-13 20:44:57.843	\N
7a2f3624-bf15-42e2-b670-661ac64aee1b	\N	819811912018027	14773117	RENATA VALERIA	ANGELO MORO	2014-05-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.845	2026-09-13 20:44:57.845	\N
b59d1c34-df52-4d1e-8208-c4d99056cf37	\N	819811912018016	15588203	ISRAEL	ARAUZ PALAVECINO	2014-04-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.847	2026-09-13 20:44:57.847	\N
9fd868f3-69c5-4ed1-b929-1778d6c9cd04	\N	819811342017004	14086786	ANDRES JARED	BARRANCOS RODRIGUEZ	2014-05-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.848	2026-09-13 20:44:57.848	\N
51467732-5172-4e39-8f9f-3a9ec6e52498	\N	8198123220181144	16242405	ISABELLA	BARRIGA WENDE	2014-02-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.849	2026-09-13 20:44:57.849	\N
27a1d273-bca1-41b7-bb00-100e3792e67c	\N	819811912018024	14749926	ESTEBAN MATEO	BARROSO ZARATE	2013-12-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.85	2026-09-13 20:44:57.85	\N
d9cf5853-3727-4495-a66c-c863802451f3	\N	819812322019004	14132782	WALTER GHIULLIANO	BURGOS SALAS	2014-04-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.852	2026-09-13 20:44:57.852	\N
3b4b411c-7c4a-46ce-987b-28457f7c2f77	\N	8198119220183798	17040375	JOSHUA NEHEMIAH	CAMACHO ADAUTO	2014-07-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.853	2026-09-13 20:44:57.853	\N
159cd16a-09fb-46b6-86b6-4a27f30ef06a	\N	819811912018019	15717672	DANNA SOFIA	CASTRO CONDORI	2013-11-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.854	2026-09-13 20:44:57.854	\N
cd8e4a89-c9db-4a3d-9fda-5b8ecbabb3c6	\N	819811912018033	15213874	DAYRA LISBETH	CASTRO HURTADO	2013-10-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.856	2026-09-13 20:44:57.856	\N
fa590189-59dd-49b2-b807-0e33ad475963	\N	819814402018013	14133736	SAMIR	CHAVEZ ROUG	2014-02-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.857	2026-09-13 20:44:57.857	\N
ecdeb3e2-90a4-4ae1-a8d7-0a73e76bd7e8	\N	819813372019001	14472405	LYNDA MISHEL	COLQUE RODRIGUEZ	2014-01-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.858	2026-09-13 20:44:57.858	\N
4ae63fff-0c02-47f8-9138-e1caf669d7f0	\N	819811912018021	14471772	MATEO	FLORES BASTOS	2013-12-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.861	2026-09-13 20:44:57.861	\N
380ee44d-0e34-4852-9d00-08f1f9f48d9d	\N	819811912017006	14253962	SCARLET MISHEL	GONZALES GALARZA	2013-09-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.862	2026-09-13 20:44:57.862	\N
b2bc2378-60b2-485a-afb7-9bf06a206ddf	\N	819811912018003	14632569	PAULA RENATA	GUTIERREZ MEDINA	2014-07-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.864	2026-09-13 20:44:57.864	\N
ad880258-161c-4585-b2df-1fbf0fbb8099	\N	819810372018018	15105156	XIOMARA YIRETH	HURTADO VACA	2014-07-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.865	2026-09-13 20:44:57.865	\N
f8fc90e6-5c66-4607-8438-d3456f39617c	\N	819811912018029	15208189	MELANIE SARAI	JUSTINIANO VIDES	2013-07-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.866	2026-09-13 20:44:57.866	\N
cc2a673f-bb20-4d0d-b5db-ca0185c1f207	\N	819811912018026	14053066	ELIZABETH FERNANDA	MAREÑO CLAROS	2014-06-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.868	2026-09-13 20:44:57.868	\N
dbb35dd6-bc94-4a9a-93cf-ad9fc5f9235f	\N	819811912017064	13979191	ELIANA SHIREL	MEDINA GONZALEZ	2014-01-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.869	2026-09-13 20:44:57.869	\N
45b11111-57ff-42f7-b122-2f43e5f08a92	\N	819802612018138	16043488	JOSE MARIA	MERCADO ANTELO	2014-01-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.87	2026-09-13 20:44:57.87	\N
8ba5d770-e467-469d-ba1a-987ac688e874	\N	819815592018110	15047042	THIAGO ANDRE	ORTIZ CEREZO	2013-10-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.872	2026-09-13 20:44:57.872	\N
e55e0525-b56e-4e3b-844e-93db103bd133	\N	819811912017049	13977803	JOSHUA CALEB	PANIAGUA GOMEZ	2014-06-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.873	2026-09-13 20:44:57.873	\N
a28d3aa0-9e96-448a-83f7-0a794d510f1b	\N	819811292018013	14633428	OSCAR ADRIAN	QUISPE AGUILAR	2014-04-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.874	2026-09-13 20:44:57.874	\N
a58cd8dc-2474-4f32-a5a1-a624cc49272b	\N	807304662018150	15499104	ADRIANA NAOMI	REYEROS GOSALVEZ	2014-05-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.877	2026-09-13 20:44:57.877	\N
2e16bb49-1645-4c89-a923-f14bc5e142ac	\N	819810652018011	16396929	EDUARDO ISMAEL	RIBERA PADILLA	2014-02-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.879	2026-09-13 20:44:57.879	\N
713e1133-747d-48b7-a795-7af540a71c2f	\N	819811912018028	15275419	LEONARDO	RODAS VARGAS	2014-01-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.88	2026-09-13 20:44:57.88	\N
b3a529d9-8369-4626-8a0d-a7bd8bbcf3b0	\N	819811912017065	13145294	MAURICIO DANIEL	RODRIGUEZ DORFELT	2013-09-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.881	2026-09-13 20:44:57.881	\N
60a2f67b-6a9e-42d7-8e19-85d28937cbd2	\N	407300182018084	14703698	SAMAEL RAFAEL	ROJAS MACHICADO	2013-09-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.883	2026-09-13 20:44:57.883	\N
a767da6b-c4de-4218-b351-a8fc345cb7b1	\N	819810502019058	16193637	LEONEL	ROMERO GUTIERREZ	2014-06-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.884	2026-09-13 20:44:57.884	\N
56f01adb-25b8-4ff2-a919-fd0d8e94ee30	\N	819811912017063	13488725	VALENTINA	ROMERO VILLEGAS	2013-07-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.885	2026-09-13 20:44:57.885	\N
59835218-40b7-4735-9502-ef7dfc0d6ea6	\N	819811912018032	14995508	BENJAMIN	SORIA RAMALLO	2014-05-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.887	2026-09-13 20:44:57.887	\N
adfe1aa4-f238-4571-893f-8a04f1da6f6a	\N	819811912018015	13546197	LOGAN TSUYOSHI	TAMASHIRO ZABALA	2014-01-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.888	2026-09-13 20:44:57.888	\N
8b21da2a-66c1-4b3e-bdad-d024b6bc7151	\N	819814972018104	14395263	OSCAR LUIS	TORREZ LARREA	2014-05-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.889	2026-09-13 20:44:57.889	\N
1ddb6bd4-6276-4205-864e-bb5ee4e6992b	\N	819815422018017	14408929	DOMINIC	TORRICO SUAREZ	2013-12-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.891	2026-09-13 20:44:57.891	\N
6c84b46d-2281-4474-83d8-ec23678b0dac	\N	819815492018010	14633215	LUCAS	AUDIVERT TERRAZAS	2013-10-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.892	2026-09-13 20:44:57.892	\N
4c4863fb-26e3-4765-a170-aa6c82b3d9ba	\N	819815282018005	16157582	KATHALEYA	CAMACHO PERALES	2014-02-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.895	2026-09-13 20:44:57.895	\N
4986a581-bc7a-4b75-8af6-da4bbd88a3e5	\N	819814402018010	15123542	RAFAEL	CAMPOS CABRERA	2013-10-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.896	2026-09-13 20:44:57.896	\N
5c38b253-e3e6-4f95-90ed-84ed1a333392	\N	819811732018008	15238958	NICOLAS SAMIR	CANAVIRI VEGA	2013-08-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.898	2026-09-13 20:44:57.898	\N
29e6f608-ca3f-46d8-821f-23d24fd0d7de	\N	819812252018008	15136718	YANICE	CASUPA MURILLO	2013-08-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.9	2026-09-13 20:44:57.9	\N
7202693a-ba85-46af-9144-5ae3cbdff6a0	\N	819809782018118	15857512	NICOLE MICHELLE	CUELLAR CASPARY	2014-05-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.901	2026-09-13 20:44:57.901	\N
a24342c1-97da-4d00-a6ef-fb22977334de	\N	819804072018001	15095148	CAMILA	DAMM GOMEZ	2014-02-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.903	2026-09-13 20:44:57.903	\N
c94e11e2-9982-4989-8990-582cea7c0c86	\N	819811182018007	14254122	ALEXIA	DEL CASTILLO CUELLAR	2014-04-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.904	2026-09-13 20:44:57.904	\N
5c56c00a-8e2a-4896-8112-4404d56911e8	\N	819805832018057	15877150	HOLT	DURI NAURO	2014-06-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.905	2026-09-13 20:44:57.905	\N
b57655fe-197a-4a77-8514-24f6610de4a2	\N	819812322019005	14053115	MICAELA	HUALLPARA CACERES	2014-05-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.907	2026-09-13 20:44:57.907	\N
f07604a2-cdc3-4367-9eb5-feb2d746b3b2	\N	819802602018060	14661910	FABIANA	JUSTINIANO GALINDO	2013-09-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.908	2026-09-13 20:44:57.908	\N
ae21acbd-29f6-4ffd-a1da-822bc9d81069	\N	819802602018062	14102648	BRIANA ITZEL	MAGNE CORIA	2014-06-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.91	2026-09-13 20:44:57.91	\N
54e24dcc-66fd-43c6-ab58-1cffd956eff7	\N	819809342018066	12723177	SOFIA VALENTINA	MENA SANCHEZ	2013-09-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.912	2026-09-13 20:44:57.912	\N
a758a4b0-4631-46b8-b4c6-0627b9830ffc	\N	819814402018038	14809534	JEAN CARLOS	MENDOZA RUA	2014-01-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.913	2026-09-13 20:44:57.913	\N
3fd4f152-7319-41ba-85cd-4fc5ceef7c43	\N	819811732018062	13974428	NATANIEL ALEXIS	MORALES BERNAL	2014-05-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.915	2026-09-13 20:44:57.915	\N
325de075-675e-475e-8f52-bc6ca5762a11	\N	819811912018067	15933397	MARIA FERNANDA	OLIVA MAMANI	2013-08-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.916	2026-09-13 20:44:57.916	\N
2c265d26-e8d3-4e82-9a4a-7273a46d26a7	\N	819809822018046	15045151	CARLOS MATEO	ONDARZA ROCABADO	2014-01-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.917	2026-09-13 20:44:57.917	\N
54cf7e90-f1b6-4e8f-96f8-98e250f96174	\N	819805392017087	13962962	CAMILA	PAÑUNI CHAMBI	2013-04-19 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.919	2026-09-13 20:44:57.919	\N
a890a608-9965-4d0e-b07f-9ad3dfc0c782	\N	819809772018101	14990910	ARIANE GUADALUPE	PARRA ORTIZ	2013-09-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.92	2026-09-13 20:44:57.92	\N
4485b8f4-2b7e-40e8-962b-f4b35347c9a7	\N	819814492019072	14808722	VANIA	PITTARI CESPEDES	2014-05-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.921	2026-09-13 20:44:57.921	\N
af31366b-786f-4d43-b856-bf19f451218f	\N	819814402018049	13673794	ANDRES	PRADO BUSTILLOS	2013-08-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.923	2026-09-13 20:44:57.923	\N
377228d0-ff7f-4103-aa68-de15f576275e	\N	819814362018021	15027574	BRITANY LUCIANA	ROJAS GARCIA	2014-05-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.924	2026-09-13 20:44:57.924	\N
dbd7fef2-c165-4a35-ae06-11337d04f58e	\N	819814182018042	14868969	MARIA FE	ROJAS PEDRAZA	2013-10-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.925	2026-09-13 20:44:57.925	\N
8fbfe726-e9ce-46ae-8900-606b8897a6e7	\N	819809822018002	14810195	LEONARDO GABRIEL	RUIZ OVANDO	2014-01-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.928	2026-09-13 20:44:57.928	\N
72565323-5cb6-41a8-b6d7-6adc1c8f403c	\N	819814402018050	14657106	MARCO ANTONIO	SOLIS TOLA	2014-06-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.929	2026-09-13 20:44:57.929	\N
cdf85e82-153a-4bf5-9df6-9a3dbd695236	\N	819815842018012	15489961	TALITA	SOLIZ LIMPIAS	2014-03-31 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.931	2026-09-13 20:44:57.931	\N
edfd5e8a-7d01-459f-82a2-224c8bc63765	\N	819809782018004	15879681	LUCIANA	STIPANCICH BRUZZO CASTRO	2014-05-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.932	2026-09-13 20:44:57.932	\N
05548622-0a49-4447-8c64-df95263e9a01	\N	819811912018014	14872531	DENNIS JOSUE	TABOADA CESPEDES	2014-06-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.933	2026-09-13 20:44:57.933	\N
04be5280-174a-4d46-93de-0d876dc7a6ba	\N	819812612018041	14811468	RAFAELA	VACA MOLINA	2014-03-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.935	2026-09-13 20:44:57.935	\N
0628496b-ea48-4b3a-bdff-293e13b30a25	\N	819811562018018	14132740	ANDRES	VACA OVANDO	2014-01-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.936	2026-09-13 20:44:57.936	\N
7e79f204-7853-4dbb-a710-40012aff9207	\N	819814492019069	16244339	JOSIAS CALEB	VILLARROEL MONTAÑO	2014-04-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.937	2026-09-13 20:44:57.937	\N
7e0dd76f-8cbe-4a2e-8168-faac87c1f1ad	\N	819814492019070	16244337	JOSUE GAEL	VILLARROEL MONTAÑO	2014-04-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.938	2026-09-13 20:44:57.938	\N
583e6bfe-6f58-4fe1-847d-30822380a452	\N	819811912018025	16805154	SILVIA DENISSE	YAVITA GOMEZ	2013-08-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.94	2026-09-13 20:44:57.94	\N
03e5641a-5d4b-4f9a-9d26-042a26302e53	\N	819810832017073	14874765	MARIANA	AGUILERA ZAMORA	2013-04-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.941	2026-09-13 20:44:57.941	\N
61bbe3b5-3923-492e-8656-cf8fd054f7ac	\N	819802322017050	16174834	MILAGROS BELEN	ALGARAÑAZ CAMACHO	2012-10-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.943	2026-09-13 20:44:57.943	\N
dbdc809a-b0af-4a1b-8e45-613860524904	\N	819811912017020	14633264	EZEQUIEL ANDRES	ALI CHOQUE	2013-04-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.945	2026-09-13 20:44:57.945	\N
9692cf22-16c3-4793-9b57-1cef9b8ea122	\N	819811912017031	14137727	SAMUEL	ANDRADE RAMOS	2013-06-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.946	2026-09-13 20:44:57.946	\N
7c30d097-fd68-4c8d-8976-bc1b29f5559f	\N	819801232017130	13079833	LIAM JOSUE	BEJARANO HUAYLLA	2013-02-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.948	2026-09-13 20:44:57.948	\N
7b3fef16-c748-4690-abc8-b905b8a506f0	\N	819810232017083	13431842	VALENTINA	CHAMBI MOJICA	2012-09-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.949	2026-09-13 20:44:57.949	\N
73e18686-580a-49d7-9b9d-0b3708f04464	\N	819810522017003	15414910	ALEXIA	CUELLAR ARENAS	2013-04-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.951	2026-09-13 20:44:57.951	\N
93efbf0d-5722-463c-920e-3f6cde6dafb3	\N	819802322017111	14137288	NOELIA	MARTINEZ IBARRA	2013-04-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.952	2026-09-13 20:44:57.952	\N
063b26ee-2306-45fc-97bb-0ae96431397e	\N	819810372017018	14565928	LUCAS ANDRE	MENA HINOJOSA	2013-01-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.953	2026-09-13 20:44:57.953	\N
fc032dd7-67a6-4d19-a9c9-0055a37ccb0d	\N	819815612017008	16872664	SARITA	MENACHO CESPEDES	2013-01-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.955	2026-09-13 20:44:57.955	\N
83095788-b897-4177-90de-46b08398c73c	\N	819810372017019	13017710	SEBASTIAN	MENDEZ HINOJOSA	2012-10-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.956	2026-09-13 20:44:57.956	\N
08bb6ad5-78ce-428b-bb32-c914dae62cae	\N	819809822017039	13974011	KIARA ABIGAIL	MENDEZ JALDIN	2012-12-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.958	2026-09-13 20:44:57.958	\N
fcd7cf73-24f0-4bd3-ac03-8bf6fa94a44b	\N	819811912017018	14061634	NAVIF STEVEN	MERCADO VACA	2013-05-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.96	2026-09-13 20:44:57.96	\N
5469d803-f18e-408a-bcb5-a48dcbcecd5f	\N	819811912017046	15525469	MARVIN MATEO	MIRANDA BARRETO	2013-06-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.962	2026-09-13 20:44:57.962	\N
ff51e1cb-67de-49e8-b912-1d5083257032	\N	819810832016040	15735088	ELIAS	MONTERO MONTERO	2011-10-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.963	2026-09-13 20:44:57.963	\N
e6e5b06e-0d92-4ec2-8126-d4deed635dd0	\N	819811732017016	13015197	EMANUEL JESUS	MORALES BERNAL	2013-01-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.964	2026-09-13 20:44:57.964	\N
2ea1ed74-1447-4bd0-8166-af1df8505695	\N	819811562017046	14903728	YAHIR ERWIN	OROCONDO ACAPA	2012-08-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.966	2026-09-13 20:44:57.966	\N
434d80bb-880d-4d9b-a341-f28f4ea36123	\N	819810372017022	12987459	ALISSON	ORTEGA VELASQUEZ	2012-12-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.967	2026-09-13 20:44:57.967	\N
61b8f944-1aaa-4fa3-96f4-ac2f1465d898	\N	819811912017057	13639254	JONATAN	PACHECO DORFELT	2013-03-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.968	2026-09-13 20:44:57.968	\N
24171877-80e7-48c8-aac3-2354afe69002	\N	819815312017001	14254973	MARCO ANDRE	PARDO FLORES	2013-03-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.97	2026-09-13 20:44:57.97	\N
805f4689-e9cc-4fa0-b6ba-07f10fd80a7a	\N	819815142017032	13429682	SAULO	REVOLLO PAZ	2013-04-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.971	2026-09-13 20:44:57.971	\N
7c297376-0e37-462c-808b-9de55c7a79b5	\N	819811912017001	13972674	JOSIAS DANIEL	RIBERA HURTADO	2013-07-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.972	2026-09-13 20:44:57.972	\N
f4abba4a-617c-4392-a4aa-8cfb8093642a	\N	819811912019090	13174226	ISABELLA	RIFARACHI MANSILLA	2012-10-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.974	2026-09-13 20:44:57.974	\N
ed89db4a-528b-46be-82b0-b8208937a205	\N	819811912017042	14748222	MATHIAS JOEL	RIVERO ALVARADO	2012-07-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.975	2026-09-13 20:44:57.975	\N
83e7aa66-e9dd-4c2a-a267-45ecc8abe183	\N	819811912017045	14772256	ZOE MARIANNE	RODRIGUEZ ROCABADO	2012-08-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.978	2026-09-13 20:44:57.978	\N
6be872a4-e732-4d7a-b3df-b73d421f9e7a	\N	819810372017028	15953979	YARIS EMANUEL	ROSALES BARRIOS	2013-06-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.979	2026-09-13 20:44:57.979	\N
a61542af-d244-4187-966b-322a9bad42a0	\N	819811912017012	13174160	KEISY ARIANE	RUIZ PALACIOS	2013-03-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.98	2026-09-13 20:44:57.98	\N
2cf16cbf-eaa3-469b-94fb-289438e37ed1	\N	819811912017016	14053543	LUCIANA	SALAZAR ROCHA	2013-02-02 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.982	2026-09-13 20:44:57.982	\N
aedc1909-bdd1-450e-80bd-29e0f47c323d	\N	819812612017041	14811469	ARIANA	VACA MOLINA	2012-07-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.983	2026-09-13 20:44:57.983	\N
26b82c1d-4cf0-4258-8ef8-3b0d62434258	\N	819400282017090	14607874	SHARON ADRIANA	VARGAS RAMOS	2013-01-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.985	2026-09-13 20:44:57.985	\N
ffda5bfd-8231-4864-a249-775c2bf9be3d	\N	819812412017007	12884970	SAMUEL	VELASCO CUEVAS	2012-11-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.986	2026-09-13 20:44:57.986	\N
802a86f0-1b21-40e7-8fe2-117892a46c08	\N	819811182017036	12885079	JHON HAROLD	VELIZ LOPEZ	2012-10-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.987	2026-09-13 20:44:57.987	\N
fe8d241e-e561-4f9c-8b1f-fa3328403d98	\N	819805382018080	16630676	PAOLA DIANA	AGUILAR TORREZ	2013-02-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.989	2026-09-13 20:44:57.989	\N
904c6a73-27a6-41d8-b148-c34e406e54d5	\N	819814402017004	15037611	JOSE ARTURO	ARAUZ PAZ	2012-12-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.99	2026-09-13 20:44:57.99	\N
eb762a84-fe59-4fc5-b018-5c9d7e155b65	\N	819810372018001	15539684	MIQUEAS DANIEL	BAÑON GUZMAN	2013-01-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.992	2026-09-13 20:44:57.992	\N
3148136c-09c6-46e1-a7e5-3e237882ee7c	\N	819815602017016	13962773	MATIAS ALEN	BRAVO VEGA	2012-12-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.994	2026-09-13 20:44:57.994	\N
e9a4e7bc-7ecf-4444-8f0f-9278de4e69eb	\N	819810472017003	15494036	ADRIANA	CABALLERO VARGAS	2012-10-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:57.995	2026-09-13 20:44:57.995	\N
74beb92c-7527-4d93-997d-10cea4bffae5	\N	8048005120217095	17116652	DYLAN	CALDERON CORONADO	2012-12-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.997	2026-09-13 20:44:57.997	\N
2b62d3fb-4e37-4267-9f92-1cabc2246d98	\N	819811922017063	17024025	SANTIAGO	CARRASCO RODRIGUEZ	2013-03-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.998	2026-09-13 20:44:57.998	\N
4dab460f-e6a6-4741-8f55-d9e6ba12e410	\N	819810372017009	14871647	ELIAS	CARRILLO SORIA	2013-03-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:57.999	2026-09-13 20:44:57.999	\N
8e40d5c5-bb76-43d2-ab3e-ea21d15c0597	\N	819811912018005	14972424	LUCIANA GABRIELA	CASTRO DURAN	2013-05-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.001	2026-09-13 20:44:58.001	\N
7af7c0ef-1cbd-4332-a0a5-150a6384669a	\N	819812432017005	14088036	MAILY	CESPEDES MONTAÑO	2012-07-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.002	2026-09-13 20:44:58.002	\N
114eaf1a-98f7-41de-a063-c2fa33b42748	\N	714100072017038	16627594	MARIANA GUADALUPE	CHIRI AYALA	2013-03-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.003	2026-09-13 20:44:58.003	\N
81c33f7b-34f6-4ca4-a113-c827bba8f7d8	\N	819814402017009	14131833	JOSE LEONARDO	CORONADO TERCEROS	2012-07-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.005	2026-09-13 20:44:58.005	\N
7feae5ec-fabf-42fa-b97c-d9d9b67d9d13	\N	8198065720182336	15938227	BELLA ROSE	CORTEZ SAUCEDO	2013-04-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.006	2026-09-13 20:44:58.006	\N
210ad422-de50-49bb-ad06-2c1514889b18	\N	819811912017024	13634405	VALERIE	DAZA SALVATIERRA	2013-04-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.007	2026-09-13 20:44:58.007	\N
c98364c3-6195-4afe-81b7-d290a4497ec1	\N	819808682017081	15942437	GABRIEL LEANDRO	FARFAN JUSTINIANO	2012-11-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.009	2026-09-13 20:44:58.009	\N
924565ce-18e7-4bb0-8c79-163af22eba76	\N	819810372018002	14992485	NATALIA	GARCIA FLORES	2013-03-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.011	2026-09-13 20:44:58.011	\N
1c91d9aa-032a-4f2b-a1f1-c3f1662e0ac7	\N	819811322017085	13304338	VALERIA	GONZALES ORTIZ	2012-11-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.013	2026-09-13 20:44:58.013	\N
d149ba3b-c5eb-47ed-a4e2-385ae235e086	\N	819815682017035	13110607	VALENTINA BELEN	GRAGEDA RUIZ	2012-12-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.014	2026-09-13 20:44:58.014	\N
85bec907-07ce-45fe-acfb-4fd5be44d452	\N	819814402017034	13018982	JORGE SEBASTIAN	GUTIERREZ CASAS	2013-03-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.015	2026-09-13 20:44:58.015	\N
af9770cd-20ca-42ea-bc63-3022e790490a	\N	819810372017012	14794336	CESAR LEANDRO	HERRERA ESCALANTE	2013-05-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.017	2026-09-13 20:44:58.017	\N
b13b1030-a24c-4eff-881b-03ef375989e2	\N	819809822017093	14089075	ANDREA BELEN	JURURO FERNANDEZ	2013-05-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.018	2026-09-13 20:44:58.018	\N
3b599119-358f-4ec3-9c1e-5952dfbd7c30	\N	819810372016016	13014451	LEILA INES	LOPEZ COLQUE	2011-11-25 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.02	2026-09-13 20:44:58.02	\N
2968a3a7-b8c7-4c18-9db0-82cf851c8172	\N	819810372017015	15122373	ARIEL GUSTAVO	MACHICADO ESPINDOLA	2013-06-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.021	2026-09-13 20:44:58.021	\N
dc744523-b1ef-4050-8474-88db0e699600	\N	819812212017050	14262920	KATHERINE BRIANNA	MEJIA MUJICA	2013-05-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.022	2026-09-13 20:44:58.022	\N
51e0f092-ddaf-4288-8a8f-a771cb31136a	\N	819802322017067	15251575	ANGEL SANTIAGO	MOLINA OLMOS	2013-01-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.024	2026-09-13 20:44:58.024	\N
51793da2-caf2-4385-b7c5-f1c8a790c3aa	\N	819810832017071	13111379	JOSUE FERNANDO	ORTEGA CORDERO	2012-10-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.025	2026-09-13 20:44:58.025	\N
d55e7a63-48cf-4914-a6c6-bd9814f80c50	\N	819810832017018	15491630	CRISTIANI	PANIAGUA RIBERA	2012-08-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.027	2026-09-13 20:44:58.027	\N
f0a06e77-b897-4397-8853-d4319d840d12	\N	819811492017025	15098387	BRIANA LUCERO	RIVAS PARADA	2013-02-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.029	2026-09-13 20:44:58.029	\N
90c9a231-4d00-47c0-b3c3-4de63e4699b7	\N	819812432017014	13433446	MATIAS	RUIZ MONTAÑO	2012-12-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.03	2026-09-13 20:44:58.03	\N
67f8646b-c1a7-4643-825a-767929cdc629	\N	819810372017033	13396778	GUILLERMO	VALDEZ CONCHA	2012-10-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.032	2026-09-13 20:44:58.032	\N
8d81b3f7-5a4d-490d-969a-34c4a5fee100	\N	819811912017026	14433955	DYLAN SAMIR	VELASCO ROBLES	2013-01-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.033	2026-09-13 20:44:58.033	\N
a9313553-0b35-42e3-ae7c-79b1574fe949	\N	819812282017006	13435316	NATALIA	VILLALOBOS CARDOZO	2013-03-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.034	2026-09-13 20:44:58.034	\N
917200de-45d2-43b6-968c-2d6b5c341637	\N	819810372017034	14293425	JOEN ISRAEL	VILLEGAS ANTONIO	2013-05-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.036	2026-09-13 20:44:58.036	\N
11f8a439-aeaf-442b-983f-1840e865e91b	\N	819810372017036	15978198	JESUS ANDRES	ZAPATA VARGAS	2013-02-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.037	2026-09-13 20:44:58.037	\N
fa9035cd-6be0-4e65-8712-f220cfb6d13a	\N	819814402017001	15037609	ALEJANDRA	ARAUZ PAZ	2011-10-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.039	2026-09-13 20:44:58.039	\N
be6ca030-8c44-4e7f-80d6-57e4fc64fc05	\N	819802322016039	14749925	PABLO DIEGO	BARROSO ZARATE	2012-04-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.04	2026-09-13 20:44:58.04	\N
472a5f35-6723-45ad-8046-75dac28e69fb	\N	819804872016042	14467829	MATEO	BERNAL JIMENEZ	2012-05-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.041	2026-09-13 20:44:58.041	\N
37fba44e-68f8-4e03-9a16-d60aa2c57783	\N	819811912016019	15008973	JORGE	BERRIOS ROCHA	2011-09-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.044	2026-09-13 20:44:58.044	\N
2cf05db4-7273-4d13-9521-68c7117c718b	\N	819810932016002	16549548	DAYAN MATEO	BONILLA AYALA	2011-07-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.045	2026-09-13 20:44:58.045	\N
41200b14-9800-4ee2-8ce6-efb702589497	\N	819814402016031	13719910	KARLA MARIA	CAMPERO ESTRADA	2011-08-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.047	2026-09-13 20:44:58.047	\N
c3db6be0-020c-40b1-9bb8-a8106b141176	\N	819808692016025	15590735	ANEL XIANY	CANDIA CANDIA	2012-02-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.048	2026-09-13 20:44:58.048	\N
9a0d9310-f7cd-4cdc-9b2d-a188bf66c776	\N	819811092016011	14973909	JHOSUA BENJHAMIN	CAYOJA PAZ	2012-06-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.049	2026-09-13 20:44:58.049	\N
b8935819-70c1-4769-ba6d-38c8558cc6a4	\N	819800692016035	16266393	CANDY YARELY	CHARACAYO GABRIEL	2012-09-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.051	2026-09-13 20:44:58.051	\N
140770fc-a109-4aad-90a6-3e1f7891f1a4	\N	819812612016007	13779742	ALEX	CHUMACERO PEREZ	2012-04-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.052	2026-09-13 20:44:58.052	\N
2ff0469d-531e-424c-b9e5-858fef5ed245	\N	819811662016033	15593520	ANGIE GENESIS	CRUZ GABRIEL	2012-03-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.054	2026-09-13 20:44:58.054	\N
9e5a7847-30ee-4368-838a-910e06eba130	\N	819811912016030	14310447	LUCAS	CUELLAR AÑEZ	2012-03-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.055	2026-09-13 20:44:58.055	\N
1cc3be73-3717-48b6-9bce-06db0b00f47b	\N	819811912016033	14412218	JOSUE	FARELL CAMACHO	2011-11-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.057	2026-09-13 20:44:58.057	\N
c0af3290-4650-4b41-b8d1-a7ce94c6737c	\N	819809822016021	13785343	WILFREDO	GONZALES FLORES	2012-04-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.058	2026-09-13 20:44:58.058	\N
9bc5b534-0024-4029-b039-03a28cc8b615	\N	8198144920176987	13109743	LUCAS DIEGO	GRAGEDA RUIZ	2011-07-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.061	2026-09-13 20:44:58.061	\N
8a902d37-9553-44e0-a50d-a17ea72d545b	\N	819811912018059	15113354	ANGELO ADRIAN	GUERRERO CONDORETTY	2011-06-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.062	2026-09-13 20:44:58.062	\N
a5f804dd-a8e2-4716-bfed-23ebe7b9628b	\N	819812052016030	14871626	JOSHIE ELIZABETH	HURTADO PALOMEQUE	2012-06-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.064	2026-09-13 20:44:58.064	\N
1cb503af-5228-4f5d-b174-06b83fac378c	\N	819811912016022	12987113	NICOLAS	JACINTO LEYGUE	2011-09-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.065	2026-09-13 20:44:58.065	\N
206fcf53-9202-454f-9fe9-b74b514126cf	\N	819802322016021	13209798	MARCO ANTONIO	JALDIN SOLARES	2012-06-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.067	2026-09-13 20:44:58.067	\N
b1c0a69c-ce3a-4109-b6ce-f1facda1f231	\N	819810372016013	14130602	MIA	LANDIVAR TERCEROS	2012-03-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.068	2026-09-13 20:44:58.068	\N
1199abf4-839f-42bc-97bd-fa2ff154be56	\N	819814402016003	12984047	ALEJANDRO	MARTINEZ IBARRA	2011-11-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.07	2026-09-13 20:44:58.07	\N
d3016866-85e8-43b5-89f5-0d7f1989d04d	\N	81981064201664212	16753985	ELISA TATIANA	MENACHO HERRERA	2012-03-21 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.071	2026-09-13 20:44:58.071	\N
6496d613-3704-496d-941f-6cb1423256dd	\N	819811912016031	14777290	XIHOMARA	MERCADO MARAZ	2011-08-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.072	2026-09-13 20:44:58.072	\N
01cdc6c4-65a7-4063-8886-b6d4acabb1b7	\N	819809822016028	14162494	MAITE CRISTINA	MIRANDA BARRETO	2011-10-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.074	2026-09-13 20:44:58.074	\N
f3b5e066-1343-4d79-b90b-4ba673228066	\N	819811212016059	15738506	FRANCISCO	MURILLO ESPINOZA	2012-02-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.075	2026-09-13 20:44:58.075	\N
daeef27c-d1d9-4e7c-92ab-33b15f4d9e3b	\N	819815362015152	12920269	MARIA JOSE	ORTUÑO BAQUEROS	2011-09-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.078	2026-09-13 20:44:58.078	\N
087acdc7-5d66-45b0-9831-cb025c02953d	\N	819812162016020	13173625	ANTHONY MISAEL	PANIAGUA VIZA	2012-02-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.079	2026-09-13 20:44:58.079	\N
f6fd40c1-eb76-41a4-a007-fcfdaddf5a9e	\N	8198119120154695	13962961	JOSE FERNANDO	PAÑUNI CHAMBI	2011-05-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.08	2026-09-13 20:44:58.08	\N
f6d64921-9e8f-44dd-b518-66d7d68b351f	\N	819811912017027	14746173	YARITA EULALIA	PEÑA MERCADO	2011-09-21 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.082	2026-09-13 20:44:58.082	\N
e87605c6-e2d5-42f7-90b0-4bac5b508379	\N	819802602016067	14995132	MONSERRAT	RIVERO PEÑA	2011-11-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.083	2026-09-13 20:44:58.083	\N
9e2cbc76-60f1-482e-8b36-bbfe7996a220	\N	819811912016004	13142582	LUIS RAUL	RIVERO SEN	2011-11-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.084	2026-09-13 20:44:58.084	\N
f21b473a-6607-4d05-8e70-a031dfd55a3e	\N	819811092016040	12728789	OLGA CLARETH	SAAVEDRA PEREZ	2011-09-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.086	2026-09-13 20:44:58.086	\N
e014e93b-85ce-4642-a7b0-5caff29bb533	\N	319200422016010	12603285	ALEXIA MAYLETH	VILLA VALDEZ	2011-09-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.087	2026-09-13 20:44:58.087	\N
2a2a7f20-69ce-4987-a77b-b59a6fc33730	\N	819814492017143	16805169	SOFIA CAMILA	YAVITA GOMEZ	2011-09-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.089	2026-09-13 20:44:58.089	\N
c7ef286b-9bff-4d4b-bbf5-c3226a15858a	\N	8198131420175213	14456770	RISSEL	ABURDENE TIBUBAY	2011-10-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.09	2026-09-13 20:44:58.09	\N
0c84c1e0-4a77-4524-8beb-3b6c132c19c7	\N	819815492016005	13634957	THALIANA	AGUILERA LAMAS	2011-12-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.091	2026-09-13 20:44:58.091	\N
a2a1a504-3b8f-4c03-aa80-4b1cab767ad1	\N	819811912016008	13207093	SARA VALENTINA	AGUILERA MARTINEZ	2012-06-09 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.093	2026-09-13 20:44:58.093	\N
a40306a3-40d6-4a00-9b33-96a27666ad82	\N	819803262016012	13476361	AINOHA YOHANDRA	AQUINO ANDIA	2011-10-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.095	2026-09-13 20:44:58.095	\N
e14c68a9-be4b-4590-8dcd-9bf4ffb16f09	\N	819802602016078	14087604	CARLOS EMILIO	BALDELOMAR CARREÑO	2012-03-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.097	2026-09-13 20:44:58.097	\N
b423fd1c-069b-4a2a-bea1-3d2a81b2203e	\N	819811462016003	14053822	MAITTE JHULIANA	BIAGAZO VELASCO	2012-06-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.098	2026-09-13 20:44:58.098	\N
8118e53d-f790-49ec-9692-6224b6434a1e	\N	819814402016009	13396894	AYLEN NATANIA	BORDA URGEL	2011-09-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.099	2026-09-13 20:44:58.099	\N
29cbadfd-8914-4b7f-9ff3-954b0ff6b0d7	\N	81981191201635010	15904500	HEIDY LARISSA	CHOQUE LAURA	2011-11-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.101	2026-09-13 20:44:58.101	\N
6a3b66d4-03fc-4b08-b4da-02899e7ea9b5	\N	819809822016093	12662533	MISHEL VALENTINA	CHOQUE QUISPE	2012-04-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.102	2026-09-13 20:44:58.102	\N
dc0e91f2-037f-4b6e-a6bf-32a84dfcd51b	\N	819811912016024	13370281	JOSUE CALEB	CONDORI LOPEZ	2011-11-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.103	2026-09-13 20:44:58.103	\N
1267245c-2f03-4041-adcc-625210bc69d5	\N	819811492016002	15929465	JOEL FABRICIO	DELGADO RAMIREZ	2011-07-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.105	2026-09-13 20:44:58.105	\N
95d73d73-b1f3-4920-aab3-0b181965ff03	\N	819814882016019	12447950	PABLO LEONARDO	ECHALAR ORTIZ	2011-08-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.106	2026-09-13 20:44:58.106	\N
f3ddea98-8538-4e9b-a0c2-35e8e7b5c431	\N	819812432016013	12729278	LUCAS JOEL	MAREÑO CLAROS	2012-05-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.107	2026-09-13 20:44:58.107	\N
b4c305c7-f133-489f-87a5-01d919c6997a	\N	819811912016023	14932040	GAEL ALFREDO	MIRANDA AGUILERA	2011-08-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.109	2026-09-13 20:44:58.109	\N
4cba09f7-1ef9-4e99-8718-1d48856d5307	\N	819811912016017	13729252	IHAM JHAMIR	MONTAÑO CALVI	2012-03-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.111	2026-09-13 20:44:58.111	\N
dab123e4-a6bf-43d6-95b7-d4b9d271658f	\N	819815362016004	10991896	DANNIA LARISSA	MONTAÑO SEJAS	2012-06-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.112	2026-09-13 20:44:58.112	\N
bf483289-0eac-4170-a112-c737cc90ecd9	\N	819813272016004	14786916	MATIAS	MUÑOZ CUELLAR	2012-03-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.114	2026-09-13 20:44:58.114	\N
d30d5077-cf89-4126-a200-2fef1824692b	\N	819815592016024	15047013	ABRIL DAYRA	ORTIZ CEREZO	2012-03-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.115	2026-09-13 20:44:58.115	\N
9bf6d443-f13f-4b66-b145-eb6b33f4cfe8	\N	81980117201606757	15251215	MARINA IYARID	PAZ CORRALES	2012-04-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.116	2026-09-13 20:44:58.116	\N
62dfc8e6-33e8-40e5-babb-764953751340	\N	819802332018005	13429956	OTTO JOADEL	PEÑA ELENA	2011-09-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.118	2026-09-13 20:44:58.118	\N
81281743-f834-43e7-8151-63da97616637	\N	819812192016024	14088134	EMILIANO	PIÑEROS CALDERON	2011-09-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.119	2026-09-13 20:44:58.119	\N
852b8232-7710-437e-aadf-07bfcae2c4d4	\N	819805832017002	14942670	CALEB ELIAS	RAMOS MORALES	2012-01-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.121	2026-09-13 20:44:58.121	\N
43c413c2-82e8-452d-bf35-955b65809386	\N	819814402016034	12795400	LEANDRO	RIBERA RUEDA	2012-06-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.122	2026-09-13 20:44:58.122	\N
6430d572-bea5-40fb-8ab3-bad4ba2fd74a	\N	81980875201653527	14433741	MATEO	RIVERO ROLDAN	2012-01-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.123	2026-09-13 20:44:58.123	\N
9e2fd8dd-a2a9-4469-a9dd-670f34221f52	\N	819802322016053	13271474	MARK ROBERT	RUIZ RUIZ	2012-06-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.125	2026-09-13 20:44:58.125	\N
ebdb8c48-4e23-4d64-b12c-4a2664de4934	\N	819810432016014	14633981	KIARA DIHAMELY	SALVATIERRA REYES	2011-10-19 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.127	2026-09-13 20:44:58.127	\N
8b16d104-ed5a-4d1d-b8f6-cdcdc06e7ef2	\N	819810372016025	14633809	FRANZ ASAEL	SANDOVAL AGUILAR	2012-02-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.129	2026-09-13 20:44:58.129	\N
a19003e7-5f00-47cd-9c48-def13934488e	\N	819811912016009	12761678	ALEXANDER	SANTA CRUZ LANGUIDEY	2011-11-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.13	2026-09-13 20:44:58.13	\N
7c4bbd43-da92-4df3-b9b0-aebf1a31607f	\N	819802612016124	13333993	RAFAEL MATEO	SOLETO GUARDIA	2011-09-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.132	2026-09-13 20:44:58.132	\N
77bca337-b59b-4913-93d2-f6ba9dcb9844	\N	819810832016067	15489940	SANTIAGO	SOLIZ LIMPIAS	2012-03-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.133	2026-09-13 20:44:58.133	\N
1a564573-b33e-4a88-9ff3-f5154ea11973	\N	819802612016090	14253688	AMELIA SOFIA	TABORGA CABRERA	2011-12-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.134	2026-09-13 20:44:58.134	\N
c96a15b8-45a6-4712-ab4c-66aec73b94db	\N	819800352017004	12656678	RUBEN MATEO	TORRES GUINEART	2012-05-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.136	2026-09-13 20:44:58.136	\N
cf29247b-28d7-43b5-ad4f-c5d77b80b71b	\N	8198124120151569	12660758	JOSE CARLOS	TORRES JALDIN	2011-04-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.137	2026-09-13 20:44:58.137	\N
067cc675-01de-4ee3-8604-707c2d8ce6bd	\N	819802612016095	13974155	ANDRES	VERAMENDI MAMANI	2012-02-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.138	2026-09-13 20:44:58.138	\N
c0e5e489-9d0a-4166-b587-479c5d22d87c	\N	81981083201514324	14453881	LUCAS SAID	ALGARAÑAZ MONTERO	2011-04-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.139	2026-09-13 20:44:58.139	\N
9017f017-f6e2-4d87-9499-3c7e88a6560c	\N	8198103720152464	13635284	CIARA ALEXANDRA	ALVAREZ LARA	2010-07-30 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.141	2026-09-13 20:44:58.141	\N
c4ba888f-e9c7-452d-926e-d8dffb93ad14	\N	819815402015237	13975378	JOSE DAVID	ALVAREZ PADILLA	2010-09-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.142	2026-09-13 20:44:58.142	\N
5ad2055a-af69-49f7-a476-362c019770b1	\N	8048007420154019	S/CI-8048007420154019	FABIANA NICOLE	AMACHUY COPA	2011-05-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.145	2026-09-13 20:44:58.145	\N
511dc581-94bf-4250-8e48-d51470c28b22	\N	8198023220151984	14773116	BELEN ANDREA	ANGELO MORO	2011-03-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.146	2026-09-13 20:44:58.146	\N
da79cbd5-7da2-4f6c-979e-45f89d4c525c	\N	8198119120154661	13144339	FREDDY	AVILA TORREZ	2010-09-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.147	2026-09-13 20:44:58.147	\N
3b81c4e7-e1bf-4015-b44d-7b64ec1e3847	\N	8198097820152469	13976129	MARIA RENEE	BEJARANO BARBA	2011-01-07 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.149	2026-09-13 20:44:58.149	\N
8ac607d3-ffac-4c69-aded-9b1bfc7aecd6	\N	819811192016019	14995327	LEANDRO DANIEL	CANIDO TERRAZAS	2011-03-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.15	2026-09-13 20:44:58.15	\N
791e121e-a803-4e62-b024-4c146bcfefaa	\N	8198119120154619	12850977	EILEEN	DOMINGUEZ MOGROVEJO	2010-10-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.151	2026-09-13 20:44:58.151	\N
a150fe9b-8bab-48e3-8186-7b81b8399ff9	\N	819805452015117	14103209	SEBASTIAN KIOSHY	FLORES AGUILAR	2010-08-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.153	2026-09-13 20:44:58.153	\N
b09975b7-8238-45f7-a99a-d7316cad1969	\N	8198000820156311	13434171	RONNY SANTIAGO	LIJERON DELGADILLO	2011-02-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.154	2026-09-13 20:44:58.154	\N
4afb9e89-8fca-4bb8-8adc-7a835ffc3e00	\N	8198110320154506	13980637	CRISTIAN MATIAS	LUIZAGA DAZA	2011-06-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.155	2026-09-13 20:44:58.155	\N
07a58695-e8f4-4ec7-97b1-04a9996ee820	\N	819802512016045	15275020	YONATAN ISRAEL	MAGNE ALCOBA	2010-10-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.157	2026-09-13 20:44:58.157	\N
01bfa2c4-d6e5-4a70-b009-1296dcb39323	\N	8198103720152540	15525038	ZAHIR	MENDOZA SALVATIERRA	2010-07-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.158	2026-09-13 20:44:58.158	\N
f0411034-fbdf-4c69-add1-d9496d7b5230	\N	8198097720132286	16785337	ANTONIO	OLMOS MENDEZ	2009-06-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.161	2026-09-13 20:44:58.161	\N
3b8acf7a-fd91-4238-8dec-063994d777e9	\N	8198155920153048	15046978	CARLA YANDY	ORTIZ CEREZO	2010-09-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.162	2026-09-13 20:44:58.162	\N
fce15e1a-0635-41d1-8c91-b93fc11bec03	\N	8198103720152589	14690920	ISAIAS	PAREJA MENDEZ	2010-10-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.164	2026-09-13 20:44:58.164	\N
0d7db132-c33e-40fa-ab42-b90d249e56c5	\N	819815492015367	15289425	MATEO	PAZ HURTADO	2011-04-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.165	2026-09-13 20:44:58.165	\N
edb18c4d-e1a1-4a1e-969a-4fbbd33781b5	\N	8198023220152039	14772832	JHANAYHA LENY	PINTO MEDINA	2011-05-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.166	2026-09-13 20:44:58.166	\N
fcc629fa-293e-4ddd-a2fc-6da72fbb7557	\N	8198119120154843	14138362	JUAN PABLO	POZO AGUILERA	2011-06-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.168	2026-09-13 20:44:58.168	\N
d651d7bf-f7a8-41f9-a02e-193350d4cd12	\N	8198090620151579	13638568	ISAAC ASAEL	PRADO BUSTILLOS	2011-06-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.169	2026-09-13 20:44:58.169	\N
60d5adff-a3fb-40e7-838f-9bc1746b91a8	\N	81981198201512A	15871790	CARLA TAIS	REYEROS RAMIREZ	2011-04-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.171	2026-09-13 20:44:58.171	\N
286e0dca-c1b3-48dc-be40-03afd48f1462	\N	819814402015398	14135830	JOSE CARLOS	ROCHA ANTELO	2010-11-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.172	2026-09-13 20:44:58.172	\N
821a7098-3471-47cd-a0d4-2bda25a0341a	\N	719200622015792	11378481	KAMILA KEILA	RUIZ GOMEZ	2010-09-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.173	2026-09-13 20:44:58.173	\N
2a368447-5b9e-4b90-b083-78d68f4ef6d1	\N	8198103720152665	15951456	SAMUEL JOAB	SALVATIERRA ARCE	2011-03-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.175	2026-09-13 20:44:58.175	\N
be2b6978-a8a5-4ffd-9aaf-753c4dd7b811	\N	8198119120154805	14433677	LUIS GAMALIEL	SANDOVAL PEREIRA	2011-05-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.177	2026-09-13 20:44:58.177	\N
29956806-dacf-4b4c-8b43-7ecaaa6cbda5	\N	819814952016009	12358556	RAFAELA	SEGOVIA CORTEZ	2011-05-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.179	2026-09-13 20:44:58.179	\N
5f6f409d-8833-48d7-ab50-eba23b589e2b	\N	819814492016050	14689153	LUCIANA NICOLE	SUAREZ PAZ	2011-03-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.18	2026-09-13 20:44:58.18	\N
ebd998e1-51f7-43d1-9ebe-194364be5b19	\N	8198098220151773A	10980726	SERGIO ERNESTO	VARGAS PAREDES	2010-07-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.182	2026-09-13 20:44:58.182	\N
966d866c-4960-4175-9130-3fc50fed60c5	\N	81980687201526	13635249	SHEILA	VILAJA GUTIERREZ	2011-06-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.184	2026-09-13 20:44:58.184	\N
e610e128-f303-4df1-af98-a4f81276bc21	\N	81981487201582	13435315	VALERIA	VILLALOBOS CARDOZO	2011-02-25 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.185	2026-09-13 20:44:58.185	\N
e447e70b-973d-442f-850b-ad7b3aa50629	\N	8198147420131466	13146213	SARA	AÑEZ BERTON	2010-03-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.186	2026-09-13 20:44:58.186	\N
2d3ea941-f1f8-420e-bffa-ea64ca985735	\N	8198026020151930	14750768	RAFAEL	ARZE MENDEZ	2010-10-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.188	2026-09-13 20:44:58.188	\N
0edaac4a-0a5b-4548-8d1f-3643db34415f	\N	819802612015176A	11393694	CARLOS SEBASTIAN	CABRERA SALAS	2011-04-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.189	2026-09-13 20:44:58.189	\N
0c7fe13d-20aa-4532-8ad6-b8f13a9c1938	\N	8198113520158434	14386356	SANTIAGO	CARRILLO SORIA	2011-03-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.191	2026-09-13 20:44:58.191	\N
b57dca02-26ec-4b27-a426-e9ef40bb1a6f	\N	81981134201410514	12885687	SAID ABDIEL	CEREZO ARROYO	2011-03-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.194	2026-09-13 20:44:58.194	\N
52949bbd-4f0c-4d8f-b17e-4fe97cf6c1e5	\N	819805402017001	15635531	ARLETH JHOANNA	CHOQUE DIAZ	2010-10-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.195	2026-09-13 20:44:58.195	\N
9a8edced-1fa9-443d-b499-d4577882e9d0	\N	819812612015808A	13779741	MAYLI	CHUMACERO PEREZ	2010-08-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.197	2026-09-13 20:44:58.197	\N
523595db-cc72-4fc5-a124-d5af9e256c5b	\N	80730551201595	13144872	JENNIFER	CRUZ PADILLA	2011-04-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.199	2026-09-13 20:44:58.199	\N
846e4f8c-cb20-4914-af52-5e1b11fa51d0	\N	8198119120154752	14474040	JOSE DAVID	FLORES MARTINEZ	2011-02-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.2	2026-09-13 20:44:58.2	\N
418f44ba-8bae-4c90-b918-19daa9f6d180	\N	8223009820156528	13990437	RENATA	GAMARRA MELGAR	2010-09-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.201	2026-09-13 20:44:58.201	\N
7f30f24a-0489-44c1-ab73-1e3af30d523e	\N	819811912017038	S/CI-819811912017038	MADELEINE NOELI	GARCIA FERNANDEZ	2010-05-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.203	2026-09-13 20:44:58.203	\N
bd495110-96ed-414e-ac9b-a45f65c855af	\N	4073029620157389	11546139	LUCIANO MARTIN	HIDALGO ARUQUIPA	2010-07-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.204	2026-09-13 20:44:58.204	\N
5a6af662-e760-47c0-be18-61c9430775d8	\N	81980239201580A	15877349	ALEXANDER	LOPEZ CORONADO	2011-03-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.206	2026-09-13 20:44:58.206	\N
36aa5c85-1a50-4883-83ea-8c71b29772d7	\N	8198026020152300	14102647	SHARIK JASIEL	MAGNE CORIA	2010-11-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.207	2026-09-13 20:44:58.207	\N
02558cb2-e7c1-4e41-92f0-49210b9790c5	\N	8198103720152536	14565927	JERSON JUNIOR	MENA HINOJOSA	2010-07-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.208	2026-09-13 20:44:58.208	\N
262ab8e6-48c5-4e10-8f76-11073748ca73	\N	8198023220156550	10984089	ANGEL DAVID	MENDOZA BECERRA	2011-05-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.21	2026-09-13 20:44:58.21	\N
f55ef774-b039-442e-bfd4-5cba00a6375d	\N	8198156020151690	14708084	JOSE ERNESTO	MOYE PEREZ	2010-07-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.213	2026-09-13 20:44:58.213	\N
921c578e-5f39-442e-8532-a542ee042e82	\N	819810432015896	14633980	RAUL	NEGRETE SOLANO	2011-02-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.214	2026-09-13 20:44:58.214	\N
ca9b9394-c449-48da-bf99-47927ab2d861	\N	813700012016016	14715073	JOSE MANUEL	PEREZ NINA	2010-12-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.215	2026-09-13 20:44:58.215	\N
766e6bdf-d272-4d8e-817b-76e75c79c728	\N	819814402015564	12794929	ADRIANA	RIBERA RUEDA	2011-01-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.217	2026-09-13 20:44:58.217	\N
28492db9-3dda-4a2c-90dd-57c70f79509e	\N	8198103720152627	12884850	ESTHER TAIS	RIOS AGUIRRE	2011-04-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.218	2026-09-13 20:44:58.218	\N
b6d63970-4b49-4c6a-b075-94344fa4eae9	\N	8198001720151674	16142235	ARIANNE NAYELY	RODRIGUEZ TAPIA	2010-07-26 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.219	2026-09-13 20:44:58.219	\N
15e744e0-094f-4d63-9586-288f64dbeadc	\N	81981134201512770	12949110	DIANA FERNANDA	ROMAN CARREÑO	2010-08-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.221	2026-09-13 20:44:58.221	\N
351319bb-1579-4e1a-b5de-9cf4daabddc8	\N	8198103720152684	15966006	ANTHONELA ISABELLA	SEJAS ALVAREZ	2010-07-22 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.222	2026-09-13 20:44:58.222	\N
bdd39621-8876-4567-b495-e838b78f6d82	\N	8198134420158537	14084724	CHRISTIAN	SOLOGUREN NUÑEZ	2011-03-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.223	2026-09-13 20:44:58.223	\N
619ace34-d213-4c24-a921-5eb47769b876	\N	7068004520155784	14402563	OSCAR DANIEL	SOTO ELENA	2010-09-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.225	2026-09-13 20:44:58.225	\N
c1991970-2d6c-4fbb-a50b-a7eb9c5cab97	\N	519800202015195A	14810980	NICOLAS	SUAREZ MONTENEGRO	2011-01-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.227	2026-09-13 20:44:58.227	\N
5ac89434-f8a3-4dee-aafe-6288181f3b83	\N	8198145120152023	12859051	BRUNO	SUAREZ VASQUEZ	2010-07-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.229	2026-09-13 20:44:58.229	\N
fe418874-2e16-43d9-a461-fe2c0d7810c1	\N	8198114920156946	14874658	FANNY GALILEA	TABOADA CESPEDES	2010-07-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.23	2026-09-13 20:44:58.23	\N
58e6c0aa-4e0f-4701-aab7-8c0aad878259	\N	8198119120154680	13730090	RUBERTH	AGUILERA LEAÑOS	2011-03-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.231	2026-09-13 20:44:58.231	\N
e3ed413b-8e22-4403-b85b-9f7acf6505a4	\N	81981121201512629	14588489	NATHALIA	ANDIA AGUILAR	2011-03-24 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.233	2026-09-13 20:44:58.233	\N
02301c64-0a23-473b-95d8-9a0989b58960	\N	8198119120154676	13371233	MARIA JOSE	ARAUZ OTTERBURG	2011-04-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.234	2026-09-13 20:44:58.234	\N
cad6ad35-0eb0-4794-b307-13c6cb3e178c	\N	81981243201569	16987892	IVANA ISABELLA	BLANCO TOTORA	2011-02-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.236	2026-09-13 20:44:58.236	\N
ad2ebebc-d650-4391-afef-d8714033205a	\N	819811732015438	13304969	ABRAHAN	CANAVIRI VEGA	2011-04-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.237	2026-09-13 20:44:58.237	\N
77b085a2-02bb-43f4-978d-650785bd524a	\N	8198122520155000	13146960	JAVIER BRUNO	CASUPA MURILLO	2011-01-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.238	2026-09-13 20:44:58.238	\N
3d47293b-7b82-463f-a8b7-16cfcc1cb14a	\N	8198119120154623	13289196	VIVIAN LUCIANA	CHALLAPA CONDORI	2011-05-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.24	2026-09-13 20:44:58.24	\N
9c82226a-86ab-45ed-ad5d-40a0c197d88d	\N	8198131220156195	12418195	MISAEL	CORTEZ CHAVEZ	2011-06-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.241	2026-09-13 20:44:58.241	\N
722240a0-9166-4a87-ad6e-3f1d75af9de6	\N	819814952015216	13634404	KARLA VARINIA	DAZA SALVATIERRA	2011-04-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.242	2026-09-13 20:44:58.242	\N
59a0857f-0042-416f-b1bc-363ab4605457	\N	8198023220152024	13977427	CAMILA ANTHONELA	EGUEZ VEIZAGA	2010-08-21 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.245	2026-09-13 20:44:58.245	\N
b9f8b784-4871-481c-9a54-09b2277c4529	\N	8198103720152502	15951406	CARLOS ANDRES	GONZALES SEJAS	2010-10-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.246	2026-09-13 20:44:58.246	\N
ce43f8a6-845f-4fe2-807b-2c6b2658fbae	\N	8198103720152517	15943747	JAIRO FRANCISCO	JIMENEZ MONTAÑO	2010-12-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.248	2026-09-13 20:44:58.248	\N
d8d1d698-4b90-4542-a2e3-e98e2caab017	\N	8198111820155129	13729030	ABIGAIL	JUSTINIANO CALLAU	2010-10-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.249	2026-09-13 20:44:58.249	\N
21f66f77-a701-4e25-a5fa-c530e7727644	\N	8198119120154729	11395848	DAIRA	LANDIVAR SAUCEDO	2011-05-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.251	2026-09-13 20:44:58.251	\N
e30fb004-39f7-47c6-9080-657acd33ed2f	\N	819802392016011	14433800	SEBASTIAN HORACIO	MONTERO VILLALBA	2011-03-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.252	2026-09-13 20:44:58.252	\N
ba3f68cc-c845-4a2a-8eb9-63e8000bddbe	\N	819811732015651	13016194	SAMUEL ISAI	MORALES BERNAL	2011-03-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.253	2026-09-13 20:44:58.253	\N
59b3d399-6558-4577-aa80-c612400f6108	\N	819808682016024	15461806	SANTIAGO RAUL	NAVA CAREAGA	2011-05-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.255	2026-09-13 20:44:58.255	\N
b8aff508-998c-4ab3-9c31-25d000e53c6c	\N	819802392016012	15129967	CAMILA	NUÑEZ FLORES	2011-03-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.256	2026-09-13 20:44:58.256	\N
7cc1037a-0fd7-4fa1-9462-fa3ebca36891	\N	819815492015351	15289421	FABRIZIO	PAZ HURTADO	2011-04-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.257	2026-09-13 20:44:58.257	\N
758fc4ac-c146-4e1f-a623-f0a5b65dd3b8	\N	8198103720152593	15128717	JOSE MAURICIO	PEDRAZA MACHUA	2011-01-24 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.259	2026-09-13 20:44:58.259	\N
e44647e0-ff1f-4beb-bfb4-ed29b62ec606	\N	81980982201518657	13546781	MICHELLE KENNYA	PRIETO CORONEL	2010-09-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.261	2026-09-13 20:44:58.261	\N
395f0c63-1ecb-4a0b-ae78-e647759ba1bc	\N	8198119120154839	14409195	NICOLAS REYES	QUISBERT CORTEZ	2011-06-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.263	2026-09-13 20:44:58.263	\N
669c65e2-5cf7-4cff-861f-7a5b3ca0cedb	\N	8198143020152113	12884614	REGORS LUIS	RIOS ESTEVEZ	2010-07-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.264	2026-09-13 20:44:58.264	\N
5c04b9c6-b9ba-4892-86fc-a56a78541095	\N	8198151420159633	12727585	MIA ISABELLA	ROCHA ORDOÑEZ	2010-11-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.265	2026-09-13 20:44:58.265	\N
424f8668-554d-4441-a5f2-56cd14d089ab	\N	8198026020152133	14471410	LEONARDO	ROJAS RIOS	2011-01-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.267	2026-09-13 20:44:58.267	\N
43c5382d-470e-4a9b-ba5d-d02e82dd0877	\N	819811322016194	13207398	RICARDO	ROJAS YUCO	2010-08-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.268	2026-09-13 20:44:58.268	\N
74d6b00e-5ca7-42f7-baa6-fbcdb677bdbc	\N	819814402016043	14936128	CARLOS MATIAS	SUAREZ TABOADA	2011-06-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.269	2026-09-13 20:44:58.269	\N
2700e0ef-5640-42a9-aa40-628d56c70732	\N	8198119120154786	14097765	MIA ANDREA	VEIZAGA FERNANDEZ	2011-04-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.271	2026-09-13 20:44:58.271	\N
a01d0403-c8ec-4652-8615-38b4bf06e94b	\N	819809772014512	13306500	DIEGO	ALEMAN RODRIGUEZ	2010-06-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.272	2026-09-13 20:44:58.272	\N
9dee391a-f247-413a-a89a-82cea94b8cdb	\N	819814402014385	12726074	LUCAS	AZOGUE LEIGUE	2009-10-18 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.273	2026-09-13 20:44:58.273	\N
28fa7308-2e01-4ee4-8548-31b38a8a5871	\N	818500432014246	13112129	SHELOMI EDME	CAMACHO CARDENAS	2010-02-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.275	2026-09-13 20:44:58.275	\N
c97eab28-ff4f-4b50-80d1-2bb76150aaa5	\N	819814402014621	14794654	MISAEL RENATO	CHAVEZ BAYA	2009-08-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.277	2026-09-13 20:44:58.277	\N
3a4152c3-a12e-4e99-9d04-6a5e704346b2	\N	8198041820146568	12986317	OLIVER LEANDRO	CHAVEZ ROUG	2009-09-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.279	2026-09-13 20:44:58.279	\N
c190915d-8e09-4ddc-980b-561d6f4b021a	\N	8198119120154418	12474885	ANGELA CAMILA	CLAROS GALLEGO	2010-01-28 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.28	2026-09-13 20:44:58.28	\N
fbf3ec95-d88c-45af-94a8-ccd6e344569b	\N	8198119120144224	12985557	KEIDHY JESSENIA	CRUZ HENSEL	2009-08-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.282	2026-09-13 20:44:58.282	\N
65059b5c-0b02-4a43-ad01-e476722df430	\N	81981466201417293	14770544	TIAGO JOAN	ENDARA CARDONA	2009-07-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.283	2026-09-13 20:44:58.283	\N
16a4c38a-d8e9-494f-b8ac-201d1a83b9fe	\N	81981497201413620	13077446	JUAN DAVID	ESCALANTE HURTADO	2010-03-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.285	2026-09-13 20:44:58.285	\N
69c61af0-f44c-4bda-9622-b6ed8f3a70f6	\N	8198026020142117	11302854	IAN LUCIANO	FRANCO ARANIBAR	2009-08-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.286	2026-09-13 20:44:58.286	\N
97d63a55-a58e-4eb5-ae57-615a41825971	\N	819814972016099	13017445	SANTIAGO	GUTIERREZ MOLINA	2009-08-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.287	2026-09-13 20:44:58.287	\N
21cee03f-a621-43b3-9b1b-389b226afbc8	\N	819814952014149	14268580	LUCIA JARED	JUSTINIANO PADILLA	2010-01-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.289	2026-09-13 20:44:58.289	\N
f8048b26-d3c8-4432-95e1-9d95b76ebc7f	\N	81981440201437A	14877944	DANA	LEIGUE IBAÑEZ	2009-11-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.29	2026-09-13 20:44:58.29	\N
ccc759c9-afec-4e55-81b1-d88f8aacb985	\N	8198023920149762	14134324	JONATHAN EDIL	LLANOS TROCHE	2010-01-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.291	2026-09-13 20:44:58.291	\N
f788a259-9e8e-45eb-80b1-ae4e2d03af95	\N	819810372014343A	7420306	ANETTE NAYELI	LLANQUE TAPIA	2010-05-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.293	2026-09-13 20:44:58.293	\N
589eee32-de0d-4509-ae42-6ad41834b1e4	\N	8198119120150097	14273369	SUSAN MELIZA	MAMANI VILLCA	2010-05-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.296	2026-09-13 20:44:58.296	\N
24931acd-bd50-44d2-9162-2de0a5a9467a	\N	8198103720143444	16652415	THIAGO BENJAMIN	MATIAS RIVERO	2009-10-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.297	2026-09-13 20:44:58.297	\N
439db0dd-7664-482d-aaff-aeb8c14f0f50	\N	819814402014530	16841731	FABIANA ALEJANDRA	MENDOZA COSTA	2010-05-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.299	2026-09-13 20:44:58.299	\N
7947e4fc-4e7b-44b0-89d7-f4f6594c209d	\N	8198103720142448	13900515	DIOGO AMADEO	MERCADO ROBLES	2008-12-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.3	2026-09-13 20:44:58.3	\N
4360e8b5-ed7c-4dec-acf3-705f87d61425	\N	8195006620142677	14596726	JHEFERSON	NAVIA UGARTE	2010-03-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.302	2026-09-13 20:44:58.302	\N
cdc131da-bd78-4263-af52-d8c4e7f5d40b	\N	8198126120141001	11330065	BRUNO	ORTIZ LORA	2010-03-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.303	2026-09-13 20:44:58.303	\N
37b90c0a-e003-46d9-a152-ffeda7935b3b	\N	819814402014460	13431167	VICTORIA NAZARETH	RIBERA HURTADO	2009-10-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.305	2026-09-13 20:44:58.305	\N
55458d38-5138-4145-b925-bd24093782b0	\N	819806282014362	12760548	VICTOR JOSE	SAAVEDRA PEREZ	2010-04-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.306	2026-09-13 20:44:58.306	\N
68ba8d6a-c2f1-488d-8975-d774013caf84	\N	8198103720153035	13978005	SABRINA LUCIANA	SALVATIERRA VACA	2009-09-15 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.308	2026-09-13 20:44:58.308	\N
04e8e588-8ebe-45ef-9dee-9653084525f6	\N	8198119120144368	13900544	CARLA LORENA	SILES SANCHEZ	2010-02-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.309	2026-09-13 20:44:58.309	\N
16523cfd-d8fa-46ee-be5a-1139288e24f1	\N	81981497201413846	9795956	ELIAS MANUEL	TISCO ROJAS	2009-11-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.312	2026-09-13 20:44:58.312	\N
5edfc6d0-6193-42f3-b535-837f2321f8a0	\N	819811102014576	12358100	MATEO	URGEL MELGAR	2009-12-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.313	2026-09-13 20:44:58.313	\N
357671c1-5727-4ab4-a999-b4885b662600	\N	8198023320192126	16181647	MATIAS AGUSTIN	CABRERA	2010-01-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.314	2026-09-13 20:44:58.314	\N
19e1fa73-5111-4438-a4a0-9c799264052a	\N	8198007620133301	14141107	GENESIS MICHELLE	AGUILERA MONTENEGRO	2009-03-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.316	2026-09-13 20:44:58.316	\N
40d616c8-f389-438e-b906-db5627168896	\N	81980110201422	12419432	LUCIANA	AGUILERA ZAMORA	2010-04-03 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.317	2026-09-13 20:44:58.317	\N
2e9ad790-9a81-46ff-902f-7121d495ed00	\N	8198101420141448	14409785	MAILY JUDITH	ANGULO MUÑOZ	2009-05-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.318	2026-09-13 20:44:58.318	\N
bc6fc2dd-a240-47b8-a5a0-84df59b6bfbc	\N	819813602015261	12696045	BRUNO	ARANDIA ULLOA	2010-07-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.32	2026-09-13 20:44:58.32	\N
b39b8d85-2bbd-4ade-9747-5dadf38c88e5	\N	8198119220171751	14727198	LEAH KATE	ARIAS PEREIRA	2009-01-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.321	2026-09-13 20:44:58.321	\N
cc08512c-8950-4ca6-82d5-596bcbdb9d44	\N	81980982201699505	9701974	BENJAMIN ADRIAN	CHOQUE QUISPE	2009-03-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.323	2026-09-13 20:44:58.323	\N
90eede5c-19c7-4483-a517-e7a4efe5cb99	\N	8198119120218314	12611170	JUAN DANIEL	CHUMACERO SANDI	2009-12-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.324	2026-09-13 20:44:58.324	\N
1422c8a6-60c7-400a-b2cd-f31399fb4af7	\N	8198111820182101	15770531	AMANDA BEATRIZ	CUELLAR DE SOUZA	2009-05-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.326	2026-09-13 20:44:58.326	\N
b1054161-9807-46f6-b0e8-746d615ead6b	\N	81981121201512653	13602690	JOAQUIN DAVID	DIAZ VELARDE	2010-02-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.329	2026-09-13 20:44:58.329	\N
fac91184-8f83-44ff-9e81-f97fafef0b53	\N	717200312014384A	12659996	ALEXANDER	GUERRERO PERALTA	2010-01-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.33	2026-09-13 20:44:58.33	\N
1a2f18c9-602f-400b-92fd-10f773079e6a	\N	8198087520142149	16239787	EZEQUIEL	GUTIERREZ MIRANDA	2010-02-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.332	2026-09-13 20:44:58.332	\N
df82c5e6-107c-4cf5-acc5-a712b2b44b74	\N	8198119120156057	12948788	RAFAELA	LA TORRE OLIVARES	2010-04-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.333	2026-09-13 20:44:58.333	\N
d303023c-3d52-4c1b-b084-3c5bef669a22	\N	81981440201444A	14694193	ZAHIRA	MARAZ RIVERO	2010-05-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.335	2026-09-13 20:44:58.335	\N
1795b8f1-37ba-4568-acce-909bd5b6d7a3	\N	8198026120141925	10980582	LAURA JUDITH	MONASTERIO AYALA	2009-12-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.336	2026-09-13 20:44:58.336	\N
8eaec05c-8a1c-4401-9ba7-70e868d7e23e	\N	8073046720151111	13017203	KAREN VALENTINA	MONTES AVILA	2010-03-05 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.337	2026-09-13 20:44:58.337	\N
43b9e83e-e043-49b7-8e9b-4a8b6793423d	\N	8198050620154780	14633281	GRENY RASHELL	PARRAGA ALVAREZ	2010-04-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.339	2026-09-13 20:44:58.339	\N
3831928e-c51e-4f28-8c0c-59bda08679d1	\N	819802392014293	13839326	JOSE MARCO	PINTO MEDINA	2009-10-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.34	2026-09-13 20:44:58.34	\N
82901312-3fdc-4e72-82bc-b4704c4f9dc4	\N	8198119120221636	10942634	GANDI INTI	PUMA VILLCA	2009-04-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.341	2026-09-13 20:44:58.341	\N
e46951ec-5a70-449d-8be5-bafee4aba3d7	\N	81981132201665383	14621626	CAROLINA VICTORIA	QUEZADA RAMIREZ	2010-05-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.344	2026-09-13 20:44:58.344	\N
b5b60303-611e-4529-a3b2-e1f4909e0d17	\N	819815492014333	14075718	HEBERT OSWALDO	ROCHA CHOQUE	2009-07-17 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.346	2026-09-13 20:44:58.346	\N
2b80af13-d48c-4958-b9a5-827ed06a0b2f	\N	8198149720142391	11408173	MARIA RENE	ROMAN FLORES	2010-03-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.347	2026-09-13 20:44:58.347	\N
716879a2-c059-483a-9db7-a19b4658c9f8	\N	8198134620137979	12384283	MARIA JOSE	RUIZ GUZMAN	2010-01-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.349	2026-09-13 20:44:58.349	\N
2ed78b13-51fd-4e43-9ca9-50991740ec26	\N	8198126120141088	13537049	LUIS SANTIAGO	SARDINA CASIA	2010-03-31 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.35	2026-09-13 20:44:58.35	\N
f66b608e-f0f7-49d7-b2a4-0d1c97a0305d	\N	81730184201413953	10688775	SAMYAR ANNEL	TEJERINA FARFAN	2009-11-16 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.352	2026-09-13 20:44:58.352	\N
04213e37-3ed3-41f2-abf2-203942b24023	\N	3192002020151176	15206440	MICAELA YASSIN	VISCARRA VARGAS	2010-05-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.353	2026-09-13 20:44:58.353	\N
eaf48ca9-11a6-4811-8eab-3ade6b199035	\N	819812612013634	13720613	JESSIKA LUANA	AGUILERA URZAGASTE	2009-01-11 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.354	2026-09-13 20:44:58.354	\N
896174b1-e6db-49d1-a240-9fd4d36ea6e7	\N	81981037201314	12725453	CARLA ANGELINE	ANGLARILL JUSTINIANO	2009-03-29 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.356	2026-09-13 20:44:58.356	\N
0a3e14a5-5347-476b-bc25-594156112236	\N	81981191201318	13307440	ALVARO JAFET	ANZALDO ROJAS	2008-08-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.357	2026-09-13 20:44:58.357	\N
e9eb4ec9-1b91-485f-b938-f46b598962b6	\N	8198023220163491	10990748	CARLOS FABIAN	APONTE GUTIERREZ	2008-12-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.359	2026-09-13 20:44:58.359	\N
dfbdacbe-74c6-4503-9927-6b825bec0ae5	\N	81981037201320	13900098	JORGE LUIS	ARAUZ CONDORI	2009-04-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.361	2026-09-13 20:44:58.361	\N
08b5fc56-014a-4a41-8be6-6c7a07d10b6b	\N	819100052013658	15777378	ALEXANDRA	AVILA AVILA	2009-03-14 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.363	2026-09-13 20:44:58.363	\N
5c8ac4aa-b50e-4e08-af1e-698cdba2902a	\N	819814412014259	14254197	SEBASTIAN	BEJARANO SALGUERO	2008-11-22 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.364	2026-09-13 20:44:58.364	\N
74044bfd-8fff-4e5c-abc7-97eeb3e7c0dc	\N	819811912013269	13900097	MAIRA	BERRIOS ROCHA	2008-10-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.365	2026-09-13 20:44:58.365	\N
22d2f976-1df3-47e6-8c15-96b90b114906	\N	8198108320147861	14657223	ALINA ABIGAIL	CABALLERO VARGAS	2009-01-04 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.367	2026-09-13 20:44:58.367	\N
36c9c5bc-b466-4e9d-9c66-d9c75401dd44	\N	81981191201324	12820670	KEYLA HEFZIBA	CALLAPA HUALLPA	2008-07-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.368	2026-09-13 20:44:58.368	\N
1d8eed30-3357-4a7a-9dad-1da9e2740b56	\N	819811732013134	13307431	MATIAS JAEL	CANAVIRI VEGA	2009-03-28 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.369	2026-09-13 20:44:58.369	\N
7b540380-3cb2-4ac2-8437-8348e8a72836	\N	819810372013106	13899778	YAHIR SEBASTIAN	CARPIO GUZMAN	2009-03-08 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.371	2026-09-13 20:44:58.371	\N
8e6a6645-4393-40bd-9da3-113e9047475a	\N	81981134201310030	13335202	ANTONIO JOSE	CHAVEZ VICENTE	2009-06-23 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.372	2026-09-13 20:44:58.372	\N
7d9c01c4-e838-431c-b860-5c6078a5c61c	\N	8198131220143567	11306554	HEAVEN	CORTEZ CHAVEZ	2009-01-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.373	2026-09-13 20:44:58.373	\N
e0f1b433-f13b-4ce1-952c-bc483990da99	\N	819802322013154A	13209957	MARIA FERNANDA	JALDIN SOLARES	2009-01-23 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.375	2026-09-13 20:44:58.375	\N
f50dabdb-f54f-49f5-895d-8c86b4f27ff7	\N	819814402013190	14130601	AMY	LANDIVAR TERCEROS	2008-08-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.377	2026-09-13 20:44:58.377	\N
c1be9e20-8251-436a-9edd-c557368fd7f0	\N	8198023220145432	13900009	EMMANUEL ANTONIO	LOAIZA CARDOZO	2009-02-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.379	2026-09-13 20:44:58.379	\N
5812fece-984c-4e04-b376-a4a823a63966	\N	8198136220131817	15275021	ABIGAIL NAOMI	MAGNE ALCOBA	2009-04-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.38	2026-09-13 20:44:58.38	\N
0c28e5b5-a4db-4a0c-aba5-eb40c9645f6c	\N	81981134201310662	12985124	THIAGO CRISTOBAL	MARTINEZ MARTINEZ	2009-02-04 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.382	2026-09-13 20:44:58.382	\N
50163dd8-1ff0-489d-b3a1-535a84ad5ea9	\N	819809772013739	13046699	GERMAN	MENDIA VARGAS	2008-08-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.383	2026-09-13 20:44:58.383	\N
81c3a03f-2a57-49b7-b1ef-1bbc64feadb7	\N	819811912013136	12960026	FELIPE IGNACIO	MORALES PAZ	2008-10-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.384	2026-09-13 20:44:58.384	\N
9eddb95a-f25d-48cd-a07d-f61b3bb76af8	\N	819810372013270	12694001	THIAGO RENE	OVIEDO JUSTINIANO	2009-01-12 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.386	2026-09-13 20:44:58.386	\N
d1e9a72b-fe3c-4882-8b0e-87ba3e1f8cbe	\N	81981110201359A	13634622	YERINN SAID	PANIAGUA GOMEZ	2009-03-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.387	2026-09-13 20:44:58.387	\N
cf7f149e-04b1-4def-b040-e844c3d5e87d	\N	81981440201317A	15251242	ESCARLET NICOL	PAZ CORRALES	2009-05-29 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.388	2026-09-13 20:44:58.388	\N
f622685d-feda-4cd9-a395-98f1cba83a20	\N	8198144920145473	14138303	ARIANE YAZIEL	PEREZ VALVERDE	2009-03-19 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.39	2026-09-13 20:44:58.39	\N
037756d2-8ec7-4d66-b978-50047e1b5608	\N	818900652013690	14355450	ANDRES	ROSAS GONZALES	2008-12-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.391	2026-09-13 20:44:58.391	\N
277205d3-358a-416b-85e0-6737b3028977	\N	819811732013217A	13780540	WILLIAM	RUIZ MERIDA	2009-01-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.392	2026-09-13 20:44:58.392	\N
77b17341-2c87-4c02-afad-a0d7237aebd7	\N	819811912013178	13081631	SEBASTIAN FRANCO	SANDOVAL ARISPE	2009-06-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.395	2026-09-13 20:44:58.395	\N
f61de4be-8bba-440b-8da8-bf2a55339b55	\N	819802552013729	13899866	ESTHEFANIA	SANTA CRUZ EGUEZ	2009-02-13 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.397	2026-09-13 20:44:58.397	\N
d508e796-4a4f-4ec9-964a-db9b92c93821	\N	81980539201334A	12729638	JUAN AGUSTIN	SANTILLAN RUIZ	2008-12-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.398	2026-09-13 20:44:58.398	\N
8412ac30-dae1-4899-bdf7-0e5a33634b08	\N	8198119120136469	13400119	MOISES	VACA PINTO	2009-06-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.399	2026-09-13 20:44:58.399	\N
378a3738-24df-4d92-ad3c-d43db2f96075	\N	8073028720131244	13900069	YESHUA MAURICIO	VILLEGAS ANTONIO	2009-01-08 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.401	2026-09-13 20:44:58.401	\N
f85d61c8-258b-43d9-ab72-67446852f52e	\N	8198119120144425	14407879	HEBERTH RAFAEL	AMAYA BALCAZAR	2009-07-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.402	2026-09-13 20:44:58.402	\N
37aa4422-9fa4-426b-a3a7-4b55ff3a0f80	\N	81981121201313213	13702040	SAMANTHA	ANDIA AGUILAR	2008-06-12 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.404	2026-09-13 20:44:58.404	\N
9f90ca64-2a5f-489f-9b5b-9ea890a3430f	\N	8198088820131084	9809377	DANIEL ARMANDO	ANTEZANA AGUILAR	2009-03-10 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.405	2026-09-13 20:44:58.405	\N
90495062-89e6-4988-8e01-ce8c1e2e810f	\N	819814402013185	13785906	JASSIEL	BALDIVIEZO RIVERO	2009-03-30 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.407	2026-09-13 20:44:58.407	\N
e0546960-bb0c-40b9-a4f6-627da7bc73bb	\N	819814402013297	14632873	JULIO CESAR	CABRERA BALDELOMAR	2009-05-21 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.408	2026-09-13 20:44:58.408	\N
c64275b0-f8bc-4a8a-a51c-34bbae8bf5ef	\N	8198006920131994	13900517	AYELEN RUTH	ESCALANTE QUIROGA	2008-08-16 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.409	2026-09-13 20:44:58.409	\N
07dc9fec-b0ef-4fd0-8c01-3b008761c90e	\N	819814402013213	14053207	CAMILA FERNANDA	EYZAGUIRRE TERCEROS	2008-12-26 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.412	2026-09-13 20:44:58.412	\N
8d83859a-2a19-4908-8425-2ddf153cc87d	\N	81981191201399	13304339	CAMILA	GONZALES ORTIZ	2009-06-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.414	2026-09-13 20:44:58.414	\N
23f0659c-4123-47bc-adaf-5dd963516d9b	\N	81981132201323350	14811369	KAMILA	GUTIERREZ LAMAS	2008-10-10 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.415	2026-09-13 20:44:58.415	\N
d38cf281-2f66-4fd2-9800-5350973e7c70	\N	819804872013714	16756043	JIMENA	JIMENEZ MENACHO	2008-11-06 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.417	2026-09-13 20:44:58.417	\N
238f854d-0472-493d-9358-3bf102c379a3	\N	8198093520131182	16885669	ANGELICA	LEAÑOS AGUILERA	2008-11-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.419	2026-09-13 20:44:58.419	\N
518e1229-2785-43d6-8e73-12135db529f0	\N	81981549201411A	9834582	JOSE FERNANDO	LINO OJEDA	2008-07-11 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.42	2026-09-13 20:44:58.42	\N
cbfd683e-c16b-4632-bd7c-30a30009be58	\N	81980239201360	13900159	LEONARDO	LOPEZ CORONADO	2009-06-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.422	2026-09-13 20:44:58.422	\N
a8f1c06d-8148-4aa5-a553-349b826bf804	\N	8198113520125562	9667344	ANA CRISTINA	MENDEZ MONTERO	2008-04-01 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.423	2026-09-13 20:44:58.423	\N
5da9feb4-6aaa-42e8-acdb-53810deb5596	\N	81981549201458	13209527	RICARDO	MENDIETA VILLALVA	2008-07-02 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.424	2026-09-13 20:44:58.424	\N
5655d4eb-4c16-46ae-815a-6b52b4449297	\N	822300742014445	13991996	JAMES VLADIMIR	MERCADO VACA	2009-02-25 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.426	2026-09-13 20:44:58.426	\N
dac5a353-dff3-41f4-b525-558900fc83d7	\N	819802392013179	13633806	NICOLAS	MEZA VELASQUEZ	2009-01-15 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.429	2026-09-13 20:44:58.429	\N
427a988d-b3d9-49af-8bdd-1da7e0ca9ab6	\N	8198001720132069	13977429	JHONATAN PAUL	MORENO IBAÑEZ	2009-04-27 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.43	2026-09-13 20:44:58.43	\N
6977f562-d717-4c27-ac38-26776478432a	\N	819809062013134A	13670921	ALEXANDER	MORON CALDERON	2008-10-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.431	2026-09-13 20:44:58.431	\N
a695ba28-4b94-4926-b41e-b1621b77312a	\N	8198123220144631	14775755	MARICELLY JIZELL	MOUNZON QUIROGA	2009-02-03 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.433	2026-09-13 20:44:58.433	\N
f23b1f0a-7a1c-4216-9246-8d214256e83a	\N	81981121201313393	12355910	JOSE MANUEL	MURILLO ESPINOZA	2008-03-20 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.434	2026-09-13 20:44:58.434	\N
d357cf94-42d1-4313-8bc6-ea0c5d3eb6fb	\N	819811732013230	13729298	VALENTINA	PEÑA MONJE	2009-04-27 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.436	2026-09-13 20:44:58.436	\N
51f31dda-5644-48c6-a8ed-f5878609871b	\N	819803462014994	9752368	JHON DAIRO	RAMIREZ FERREL	2009-03-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.437	2026-09-13 20:44:58.437	\N
bb84d85b-593f-41ee-b9bc-79fd65927a56	\N	81981440201324A	12359275	RICARDO ROY	RIVERA CABALLERO	2008-09-06 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.438	2026-09-13 20:44:58.438	\N
01a8987d-d8fc-4cf8-9ca7-c6ebb11b11c7	\N	819808882013690	12507318	DANIA NICOLE	RODRIGUEZ RODRIGUEZ	2008-10-17 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.44	2026-09-13 20:44:58.44	\N
26bed60e-7b83-4dfa-a242-cd71d4b41473	\N	81981132201324426	13208435	RODRIGO	ROJAS YUCO	2009-06-13 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.441	2026-09-13 20:44:58.441	\N
e21c043d-6496-4f02-8e60-78def70c17a5	\N	8198103720143258	9786658	GENESIS GISSEL	SALDIAS ACHIPA	2009-06-09 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.443	2026-09-13 20:44:58.443	\N
025f2f14-d2f3-47a0-88a7-2d9918c4bbf7	\N	819811912013199	13839874	WILLY ANTHONY	TERRAZAS EGUEZ	2008-07-14 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.447	2026-09-13 20:44:58.447	\N
64618d2e-529d-459f-a080-fef62fd97e9e	\N	819811912013211	8482007	THIANA MILEY	TORREZ BALTAZAR	2009-01-20 12:00:00	FEMALE	\N	\N	t	2026-09-13 20:44:58.449	2026-09-13 20:44:58.449	\N
3c22b28b-1db6-49d4-b53c-9af50bcdf522	\N	819811912013227	12357261	BRUNO SAMUEL	VARGAS BRAILCO	2009-02-05 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.45	2026-09-13 20:44:58.45	\N
dceacbcf-f96a-4b11-a2e4-cece0cbf87af	\N	8198144920145492	12885325	LUCAS RAUL	VELASCO ROBLES	2009-05-01 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.451	2026-09-13 20:44:58.451	\N
967c0e70-d9c1-4929-8efe-0d8dc07291f5	\N	8198144920145507	14810554	GADIEL EDGAR	YAVITA GOMEZ	2009-02-07 12:00:00	MALE	\N	\N	t	2026-09-13 20:44:58.453	2026-09-13 20:44:58.453	\N
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
dd71c887-9ee6-4739-b795-375371b0642a	4d75e42f-46df-4984-9c90-98e6a8c7d655	3918213	MAURA MARILUZ	ALVAREZ ROJAS	MAESTRA/O	\N	1	2026-09-13 20:44:57.034	2026-09-13 20:44:57.034	\N
b3358d6a-11c3-4cfc-bb0e-b58b4cec22bd	0372cf5c-fc86-4abb-b6cb-85ca16383241	7719934	ERIKA	APONTE LEON	MAESTRA/O	\N	2	2026-09-13 20:44:57.038	2026-09-13 20:44:57.038	\N
99ea0568-8aa2-47c4-8235-a086faba3aeb	aed63b22-0fba-417d-bbc9-85204f5935b3	5886798	IVETH VANESSA	ARIAS ROJAS	MAESTRA/O	\N	3	2026-09-13 20:44:57.04	2026-09-13 20:44:57.04	\N
20c3bc24-181e-4e20-b05a-fd7b2ebb4017	f75c03b4-61c2-4206-b5a2-73d065b99d29	1105826	ELIA	AVENDAÑO GONZALES	MAESTRA/O	\N	4	2026-09-13 20:44:57.041	2026-09-13 20:44:57.041	\N
4c9bb168-80d6-4d79-974c-3d1954807305	0c88dce1-258c-409a-ad36-5a03848672d6	3912782	TESORO MARITZA	CARDONA URIONA	MAESTRA/O	\N	5	2026-09-13 20:44:57.044	2026-09-13 20:44:57.044	\N
433cc5dc-6ca4-467e-8bff-9ea8cae1caeb	812508b7-48f1-4cfb-84bd-6fd27938b9cb	4510795	ANGEL	CASTRO SOLIZ	MAESTRA/O	\N	6	2026-09-13 20:44:57.045	2026-09-13 20:44:57.045	\N
45105461-b36d-4a34-a358-d3b91b4fc14c	18ac2ecf-2ca2-4046-af6f-7f8a57133566	6297973	JENNY	CRESPO ARNEZ	MAESTRA/O	\N	7	2026-09-13 20:44:57.046	2026-09-13 20:44:57.046	\N
824dd303-f460-4b60-b084-1b2e0768c35c	4f85e83d-086b-48a0-bf6d-5ae290eb5415	7685586	JUAN CARLOS	CUELLAR HURTADO	MAESTRA/O	\N	8	2026-09-13 20:44:57.048	2026-09-13 20:44:57.048	\N
caf815d3-795d-4c87-ba85-739201948ff1	be41a55d-cded-431f-855a-aa7c45ae77d0	6272851	RICHARD	ESPINOZA VACA	MAESTRA/O	\N	9	2026-09-13 20:44:57.049	2026-09-13 20:44:57.049	\N
2798681b-8348-4c51-a158-63b62c397915	c1a951e9-da26-47e9-b0f9-3aaf4fda1ea3	5690439	BEYMAR	GALARZA MENDOZA	MAESTRA/O	\N	10	2026-09-13 20:44:57.05	2026-09-13 20:44:57.05	\N
610b09de-290a-4c96-adff-fb3b2c78f76f	bfcda9c1-06ee-4592-8e79-48da5be97f3a	4258830	EYENNIL	GALVEZ LINARES	MAESTRA/O	\N	11	2026-09-13 20:44:57.052	2026-09-13 20:44:57.052	\N
a8a0cc3d-d3a9-4b86-8441-09e78b335702	1d7e754a-fc92-459e-87ae-072123e3bfaf	5355944	EDITH	GARCIA VARGAS	MAESTRA/O	\N	12	2026-09-13 20:44:57.053	2026-09-13 20:44:57.053	\N
096fe635-58e4-4f39-9230-e2ebe97fb883	194ffa01-12d0-480b-8ed3-02915a7ac680	6239502	HEYBER ADOLFO	GEMIO BLANCO	MAESTRA/O	\N	13	2026-09-13 20:44:57.054	2026-09-13 20:44:57.054	\N
3a755960-72f4-486a-be25-1ccad90337ab	a69ff093-d8c7-456d-a17f-f870375f9b61	5635215	JUAN JOSE	GONZALES OVANDO	MAESTRA/O	\N	14	2026-09-13 20:44:57.055	2026-09-13 20:44:57.055	\N
c753158a-bd59-4325-934f-5ff80a1f26ed	aa7bf84a-af05-421c-a8d7-5e34659c7f5a	5422475	CECILIA	HERRERA GUTIERREZ	MAESTRA/O	\N	15	2026-09-13 20:44:57.057	2026-09-13 20:44:57.057	\N
d301257c-65b3-4aff-85ff-03bd23750268	5c3eebce-50b3-4c26-a0ef-4dd15c5c4ad9	7696194	MARCO ANTONIO	HUANCA POMA	MAESTRA/O	\N	16	2026-09-13 20:44:57.058	2026-09-13 20:44:57.058	\N
ace8e84c-0715-41d2-bf4b-b13a2860c168	9c703dce-4558-4d4c-ab0a-dd0891079525	12547694	MARCO ANTONIO	HUARANCA CONDORI	MAESTRA/O	\N	17	2026-09-13 20:44:57.061	2026-09-13 20:44:57.061	\N
95dd176d-1732-4e7e-8169-c5f6e7877954	f82ce2f4-6e1e-4344-a2df-d26f23656cfb	3061834	EDWIN	JIMENEZ CHOQUE	MAESTRA/O	\N	18	2026-09-13 20:44:57.062	2026-09-13 20:44:57.062	\N
72f2aea4-6c34-42d9-b30c-9344e50b4f31	79334cec-b223-41fe-8540-be8f5ab75519	5357970	ANA LAURENCIA	LUNA MONTERO	MAESTRA/O	\N	19	2026-09-13 20:44:57.063	2026-09-13 20:44:57.063	\N
cf40f811-326f-4e4f-9d28-d7f8a4227177	e589145a-1b45-4b02-bf7d-2447930cced9	4571197	MARIELA	MENDEZ ARAMBELL	MAESTRA/O	\N	20	2026-09-13 20:44:57.065	2026-09-13 20:44:57.065	\N
7cce7f4e-ef30-4899-b8d9-e5fd0ca8754f	09ac5e66-ff6c-4f74-80ca-8031ae5f37ef	3850857	ROXANA	MENDUIÑA MENACHO	MAESTRA/O	\N	21	2026-09-13 20:44:57.066	2026-09-13 20:44:57.066	\N
9baef62c-164b-42da-b529-d92bd7b1a68a	4e380eab-49ac-406e-ba75-5200f296f5bc	2982152	JUAN GERONIMO	ORTEGA UGARTE	MAESTRA/O	\N	22	2026-09-13 20:44:57.067	2026-09-13 20:44:57.067	\N
ff513b3d-3448-4fae-8dd3-b73b3671cd29	12348e92-680d-4c44-86d9-fb8ca6ccc496	5641181	ZENAIDA	PADILLA KISPE	MAESTRA/O	\N	23	2026-09-13 20:44:57.069	2026-09-13 20:44:57.069	\N
15398e67-2677-432f-8629-ab5d309123f0	956d9489-d3db-440d-8226-fed8de2fbdaa	3188482	JUDITH	PEREZ BURGOS	MAESTRA/O	\N	24	2026-09-13 20:44:57.07	2026-09-13 20:44:57.07	\N
b2c33cfb-d48e-4aa8-82c4-a1d4f44ed3f3	8e9aa70d-1c44-4a07-b811-47ec708ee6e3	3913909	MARIA ROSARIO	PINTO MONTAÑO	MAESTRA/O	\N	25	2026-09-13 20:44:57.071	2026-09-13 20:44:57.071	\N
d24e0a77-7441-4bde-ab24-e26afd384b43	7fa64101-a539-4326-8deb-e5ea43cd893a	5725469	KELMA	RAMOS CALIZAYA	MAESTRA/O	\N	26	2026-09-13 20:44:57.073	2026-09-13 20:44:57.073	\N
112462eb-7a15-446b-b3aa-4580f0b335db	acf28aeb-3651-4469-9668-7606d9a72a5d	7675380	BRIGITH ROSSIO	ROBLES CADIMA	MAESTRA/O	\N	27	2026-09-13 20:44:57.074	2026-09-13 20:44:57.074	\N
66223aa4-2982-47bb-8942-801336cae9cd	164f273b-1804-42d6-9ebb-fa2bdcb8135a	4629727	ANGELICA	ROJAS DELGADILLO	MAESTRA/O	\N	28	2026-09-13 20:44:57.077	2026-09-13 20:44:57.077	\N
8d32568e-a0d4-46c9-bbe3-3eaaaffb1002	e1251b59-9a8e-4547-b6b6-c39f340f2965	6258142	JOSE ANTONIO	SAAVEDRA CABEZAS	MAESTRA/O	\N	29	2026-09-13 20:44:57.079	2026-09-13 20:44:57.079	\N
95d5a583-d665-4a90-bdd2-3fd5c8d9993f	d059850b-386f-4fb8-8032-76ae2d1dac3e	3193881	EDWIN	SUAREZ GILES	MAESTRA/O	\N	30	2026-09-13 20:44:57.08	2026-09-13 20:44:57.08	\N
472103b7-99f3-4f5a-987e-457e06b0255d	abaa9910-cc0b-4a83-a2bd-11ea1c355c61	9717404	LIZET ROCIO	TERAN NUÑEZ	MAESTRA/O	\N	31	2026-09-13 20:44:57.082	2026-09-13 20:44:57.082	\N
b281e21f-1a84-4bd4-8f94-f9651cca8fa4	00565d2d-f101-49fc-9aaf-24771b94dbb1	3879497	MAIDA	TORRICO ALVAREZ	MAESTRA/O	\N	32	2026-09-13 20:44:57.084	2026-09-13 20:44:57.084	\N
fa0bf9ad-d1fa-4fc6-b93a-c562f5eec567	db5bcf7d-9001-488f-9c7b-49145e5a8a13	6388878	MARINA	VASQUEZ QUIROGA	MAESTRA/O	\N	33	2026-09-13 20:44:57.086	2026-09-13 20:44:57.086	\N
ca2515ca-55f6-4cfa-8551-8a29525c65ba	2d964508-16f5-44b8-85f4-0313d753fb7f	6376460	SANDRA	VILLARROEL ESPINAL	MAESTRA/O	\N	34	2026-09-13 20:44:57.088	2026-09-13 20:44:57.088	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: academic_admin
--

COPY public.users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at, deleted_at) FROM stdin;
3360123b-4d74-454d-ba3e-03f073d0c142	admin@example.local	$2b$10$xRS02ezD/WcSi/Jnk3Agp./p1S2PWiXbjeVM/69xB.HodnGnkTGKO	Administrador	General	ADMIN	t	2026-09-13 17:00:55.634	2026-09-13 17:00:55.634	\N
4d75e42f-46df-4984-9c90-98e6a8c7d655	docente.3918213@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MAURA MARILUZ	ALVAREZ ROJAS	TEACHER	t	2026-09-13 20:44:57.03	2026-09-13 20:44:57.03	\N
0372cf5c-fc86-4abb-b6cb-85ca16383241	docente.7719934@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ERIKA	APONTE LEON	TEACHER	t	2026-09-13 20:44:57.038	2026-09-13 20:44:57.038	\N
aed63b22-0fba-417d-bbc9-85204f5935b3	docente.5886798@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	IVETH VANESSA	ARIAS ROJAS	TEACHER	t	2026-09-13 20:44:57.039	2026-09-13 20:44:57.039	\N
f75c03b4-61c2-4206-b5a2-73d065b99d29	docente.1105826@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ELIA	AVENDAÑO GONZALES	TEACHER	t	2026-09-13 20:44:57.04	2026-09-13 20:44:57.04	\N
0c88dce1-258c-409a-ad36-5a03848672d6	docente.3912782@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	TESORO MARITZA	CARDONA URIONA	TEACHER	t	2026-09-13 20:44:57.043	2026-09-13 20:44:57.043	\N
812508b7-48f1-4cfb-84bd-6fd27938b9cb	docente.4510795@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ANGEL	CASTRO SOLIZ	TEACHER	t	2026-09-13 20:44:57.044	2026-09-13 20:44:57.044	\N
18ac2ecf-2ca2-4046-af6f-7f8a57133566	docente.6297973@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	JENNY	CRESPO ARNEZ	TEACHER	t	2026-09-13 20:44:57.046	2026-09-13 20:44:57.046	\N
4f85e83d-086b-48a0-bf6d-5ae290eb5415	docente.7685586@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	JUAN CARLOS	CUELLAR HURTADO	TEACHER	t	2026-09-13 20:44:57.047	2026-09-13 20:44:57.047	\N
be41a55d-cded-431f-855a-aa7c45ae77d0	docente.6272851@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	RICHARD	ESPINOZA VACA	TEACHER	t	2026-09-13 20:44:57.048	2026-09-13 20:44:57.048	\N
c1a951e9-da26-47e9-b0f9-3aaf4fda1ea3	docente.5690439@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	BEYMAR	GALARZA MENDOZA	TEACHER	t	2026-09-13 20:44:57.05	2026-09-13 20:44:57.05	\N
bfcda9c1-06ee-4592-8e79-48da5be97f3a	docente.4258830@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	EYENNIL	GALVEZ LINARES	TEACHER	t	2026-09-13 20:44:57.051	2026-09-13 20:44:57.051	\N
1d7e754a-fc92-459e-87ae-072123e3bfaf	docente.5355944@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	EDITH	GARCIA VARGAS	TEACHER	t	2026-09-13 20:44:57.052	2026-09-13 20:44:57.052	\N
194ffa01-12d0-480b-8ed3-02915a7ac680	docente.6239502@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	HEYBER ADOLFO	GEMIO BLANCO	TEACHER	t	2026-09-13 20:44:57.053	2026-09-13 20:44:57.053	\N
a69ff093-d8c7-456d-a17f-f870375f9b61	docente.5635215@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	JUAN JOSE	GONZALES OVANDO	TEACHER	t	2026-09-13 20:44:57.055	2026-09-13 20:44:57.055	\N
aa7bf84a-af05-421c-a8d7-5e34659c7f5a	docente.5422475@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	CECILIA	HERRERA GUTIERREZ	TEACHER	t	2026-09-13 20:44:57.056	2026-09-13 20:44:57.056	\N
5c3eebce-50b3-4c26-a0ef-4dd15c5c4ad9	docente.7696194@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MARCO ANTONIO	HUANCA POMA	TEACHER	t	2026-09-13 20:44:57.057	2026-09-13 20:44:57.057	\N
9c703dce-4558-4d4c-ab0a-dd0891079525	docente.12547694@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MARCO ANTONIO	HUARANCA CONDORI	TEACHER	t	2026-09-13 20:44:57.06	2026-09-13 20:44:57.06	\N
f82ce2f4-6e1e-4344-a2df-d26f23656cfb	docente.3061834@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	EDWIN	JIMENEZ CHOQUE	TEACHER	t	2026-09-13 20:44:57.061	2026-09-13 20:44:57.061	\N
79334cec-b223-41fe-8540-be8f5ab75519	docente.5357970@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ANA LAURENCIA	LUNA MONTERO	TEACHER	t	2026-09-13 20:44:57.063	2026-09-13 20:44:57.063	\N
e589145a-1b45-4b02-bf7d-2447930cced9	docente.4571197@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MARIELA	MENDEZ ARAMBELL	TEACHER	t	2026-09-13 20:44:57.064	2026-09-13 20:44:57.064	\N
09ac5e66-ff6c-4f74-80ca-8031ae5f37ef	docente.3850857@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ROXANA	MENDUIÑA MENACHO	TEACHER	t	2026-09-13 20:44:57.066	2026-09-13 20:44:57.066	\N
4e380eab-49ac-406e-ba75-5200f296f5bc	docente.2982152@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	JUAN GERONIMO	ORTEGA UGARTE	TEACHER	t	2026-09-13 20:44:57.067	2026-09-13 20:44:57.067	\N
12348e92-680d-4c44-86d9-fb8ca6ccc496	docente.5641181@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ZENAIDA	PADILLA KISPE	TEACHER	t	2026-09-13 20:44:57.068	2026-09-13 20:44:57.068	\N
956d9489-d3db-440d-8226-fed8de2fbdaa	docente.3188482@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	JUDITH	PEREZ BURGOS	TEACHER	t	2026-09-13 20:44:57.069	2026-09-13 20:44:57.069	\N
8e9aa70d-1c44-4a07-b811-47ec708ee6e3	docente.3913909@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MARIA ROSARIO	PINTO MONTAÑO	TEACHER	t	2026-09-13 20:44:57.07	2026-09-13 20:44:57.07	\N
7fa64101-a539-4326-8deb-e5ea43cd893a	docente.5725469@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	KELMA	RAMOS CALIZAYA	TEACHER	t	2026-09-13 20:44:57.072	2026-09-13 20:44:57.072	\N
acf28aeb-3651-4469-9668-7606d9a72a5d	docente.7675380@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	BRIGITH ROSSIO	ROBLES CADIMA	TEACHER	t	2026-09-13 20:44:57.074	2026-09-13 20:44:57.074	\N
164f273b-1804-42d6-9ebb-fa2bdcb8135a	docente.4629727@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	ANGELICA	ROJAS DELGADILLO	TEACHER	t	2026-09-13 20:44:57.076	2026-09-13 20:44:57.076	\N
e1251b59-9a8e-4547-b6b6-c39f340f2965	docente.6258142@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	JOSE ANTONIO	SAAVEDRA CABEZAS	TEACHER	t	2026-09-13 20:44:57.078	2026-09-13 20:44:57.078	\N
d059850b-386f-4fb8-8032-76ae2d1dac3e	docente.3193881@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	EDWIN	SUAREZ GILES	TEACHER	t	2026-09-13 20:44:57.08	2026-09-13 20:44:57.08	\N
abaa9910-cc0b-4a83-a2bd-11ea1c355c61	docente.9717404@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	LIZET ROCIO	TERAN NUÑEZ	TEACHER	t	2026-09-13 20:44:57.081	2026-09-13 20:44:57.081	\N
00565d2d-f101-49fc-9aaf-24771b94dbb1	docente.3879497@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MAIDA	TORRICO ALVAREZ	TEACHER	t	2026-09-13 20:44:57.083	2026-09-13 20:44:57.083	\N
db5bcf7d-9001-488f-9c7b-49145e5a8a13	docente.6388878@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	MARINA	VASQUEZ QUIROGA	TEACHER	t	2026-09-13 20:44:57.085	2026-09-13 20:44:57.085	\N
2d964508-16f5-44b8-85f4-0313d753fb7f	docente.6376460@sigce.edu.bo	$2b$10$Znb3mKdSEr34.9mU8/EzR.KmipEQ5J5d1WN32nzufJKiYBL7vrxEm	SANDRA	VILLARROEL ESPINAL	TEACHER	t	2026-09-13 20:44:57.087	2026-09-13 20:44:57.087	\N
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

\unrestrict QMK6y3saH6D9wVdrZkNQhrrbg4YmDtuBASp9b2rCxzZI5WWiz61LwSjSOfGQyDS


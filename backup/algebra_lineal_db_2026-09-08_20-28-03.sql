--
-- PostgreSQL database dump
--

\restrict AHoqzHpCKw23oxVIMHPHh99kEj9deqs9jVQyVIXrJlpwjvm2VkkLr3Flhkrxn8j

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'DOCENTE',
    'ESTUDIANTE',
    'SUPERUSUARIO'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actividad_estudiantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actividad_estudiantes (
    id integer NOT NULL,
    usuario_id integer,
    materia_id integer,
    semana_id integer,
    accion character varying(100) DEFAULT 'vista_plataforma'::character varying,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.actividad_estudiantes OWNER TO postgres;

--
-- Name: actividad_estudiantes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.actividad_estudiantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actividad_estudiantes_id_seq OWNER TO postgres;

--
-- Name: actividad_estudiantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.actividad_estudiantes_id_seq OWNED BY public.actividad_estudiantes.id;


--
-- Name: contador_visitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contador_visitas (
    id integer DEFAULT 1 NOT NULL,
    vistas_totales bigint DEFAULT 0,
    visitantes_unicos bigint DEFAULT 0,
    ultima_visita timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contador_visitas OWNER TO postgres;

--
-- Name: examenes_programados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examenes_programados (
    id integer NOT NULL,
    materia_id integer NOT NULL,
    docente_id integer NOT NULL,
    titulo character varying(150) NOT NULL,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone NOT NULL,
    duracion_min integer DEFAULT 15 NOT NULL,
    cantidad_teoria integer DEFAULT 0 NOT NULL,
    cantidad_ejercicio integer DEFAULT 0 NOT NULL,
    estado character varying(20) DEFAULT 'programado'::character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.examenes_programados OWNER TO postgres;

--
-- Name: examenes_programados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examenes_programados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examenes_programados_id_seq OWNER TO postgres;

--
-- Name: examenes_programados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examenes_programados_id_seq OWNED BY public.examenes_programados.id;


--
-- Name: examenes_programados_semanas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examenes_programados_semanas (
    id integer NOT NULL,
    examen_id integer NOT NULL,
    semana_id integer NOT NULL
);


ALTER TABLE public.examenes_programados_semanas OWNER TO postgres;

--
-- Name: examenes_programados_semanas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examenes_programados_semanas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examenes_programados_semanas_id_seq OWNER TO postgres;

--
-- Name: examenes_programados_semanas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examenes_programados_semanas_id_seq OWNED BY public.examenes_programados_semanas.id;


--
-- Name: horarios_materia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios_materia (
    id integer NOT NULL,
    materia_id integer NOT NULL,
    dia_semana smallint NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT horarios_materia_check CHECK ((hora_fin > hora_inicio)),
    CONSTRAINT horarios_materia_dia_semana_check CHECK (((dia_semana >= 0) AND (dia_semana <= 6)))
);


ALTER TABLE public.horarios_materia OWNER TO postgres;

--
-- Name: horarios_materia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_materia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_materia_id_seq OWNER TO postgres;

--
-- Name: horarios_materia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_materia_id_seq OWNED BY public.horarios_materia.id;


--
-- Name: inscripciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscripciones (
    id integer NOT NULL,
    materia_id integer NOT NULL,
    estudiante_id integer NOT NULL,
    creada_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inscripciones OWNER TO postgres;

--
-- Name: inscripciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscripciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscripciones_id_seq OWNER TO postgres;

--
-- Name: inscripciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscripciones_id_seq OWNED BY public.inscripciones.id;


--
-- Name: intentos_examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intentos_examen (
    id integer NOT NULL,
    estudiante_id integer,
    semana_id integer,
    examen_programado_id integer,
    nota5 numeric(3,1) NOT NULL,
    porcentaje integer NOT NULL,
    aprobado boolean NOT NULL,
    infraccion_ia boolean DEFAULT false NOT NULL,
    infracciones jsonb DEFAULT '[]'::jsonb NOT NULL,
    tiempo_empleado_seg integer NOT NULL,
    respuestas jsonb NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.intentos_examen OWNER TO postgres;

--
-- Name: intentos_examen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.intentos_examen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intentos_examen_id_seq OWNER TO postgres;

--
-- Name: intentos_examen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.intentos_examen_id_seq OWNED BY public.intentos_examen.id;


--
-- Name: materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    semestre character varying(20) DEFAULT '2026-1'::character varying,
    docente_id integer,
    creada_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    numero_semanas integer DEFAULT 16 NOT NULL
);


ALTER TABLE public.materias OWNER TO postgres;

--
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materias_id_seq OWNER TO postgres;

--
-- Name: materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_id_seq OWNED BY public.materias.id;


--
-- Name: preguntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preguntas (
    id character varying(50) NOT NULL,
    semana_id integer,
    tipo character varying(20) NOT NULL,
    pregunta text NOT NULL,
    opciones jsonb NOT NULL,
    correcta character varying(10) NOT NULL,
    explicacion text NOT NULL,
    falencia text NOT NULL,
    CONSTRAINT preguntas_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['teoria'::character varying, 'ejercicio'::character varying])::text[])))
);


ALTER TABLE public.preguntas OWNER TO postgres;

--
-- Name: quices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quices (
    id character varying(100) NOT NULL,
    materia_id integer,
    titulo character varying(255) NOT NULL,
    tipo character varying(50) DEFAULT 'ordinario'::character varying NOT NULL,
    semana_numero character varying(50) NOT NULL,
    semana_id integer,
    descripcion text,
    preguntas jsonb DEFAULT '[]'::jsonb NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quices OWNER TO postgres;

--
-- Name: registros_asistencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registros_asistencia (
    id integer NOT NULL,
    sesion_id integer NOT NULL,
    estudiante_id integer NOT NULL,
    estado character varying(20) DEFAULT 'PRESENTE'::character varying NOT NULL,
    justificada boolean DEFAULT false NOT NULL,
    justificacion_comentario text,
    escaneado_en timestamp without time zone,
    notificacion_enviada boolean DEFAULT false NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT registros_asistencia_estado_check CHECK (((estado)::text = ANY ((ARRAY['PRESENTE'::character varying, 'FALTA'::character varying])::text[])))
);


ALTER TABLE public.registros_asistencia OWNER TO postgres;

--
-- Name: registros_asistencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registros_asistencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registros_asistencia_id_seq OWNER TO postgres;

--
-- Name: registros_asistencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registros_asistencia_id_seq OWNED BY public.registros_asistencia.id;


--
-- Name: semanas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semanas (
    id integer NOT NULL,
    materia_id integer,
    numero character varying(10) NOT NULL,
    unidad_nombre character varying(200) NOT NULL,
    capitulo_grossman character varying(100) NOT NULL,
    ra character varying(20) NOT NULL,
    ra_descripcion text NOT NULL,
    duracion_examen_min integer DEFAULT 15 NOT NULL,
    preguntas_examen_count integer,
    contenido_json jsonb,
    objetivos_json jsonb DEFAULT '[]'::jsonb,
    notas_pdf_url character varying(500),
    guia_pdf_url character varying(500),
    diapositivas_pdf_url character varying(500),
    clase_web_url character varying(500),
    ejercicios_resueltos_url character varying(500),
    banco_preguntas_url character varying(500),
    tipo_examen character varying(30) DEFAULT 'combinada'::character varying,
    codigo_fuente_url character varying(500)
);


ALTER TABLE public.semanas OWNER TO postgres;

--
-- Name: semanas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semanas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.semanas_id_seq OWNER TO postgres;

--
-- Name: semanas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semanas_id_seq OWNED BY public.semanas.id;


--
-- Name: sesiones_asistencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sesiones_asistencia (
    id integer NOT NULL,
    materia_id integer NOT NULL,
    horario_id integer,
    docente_id integer NOT NULL,
    fecha_clase date NOT NULL,
    ventana_inicio timestamp without time zone NOT NULL,
    ventana_fin timestamp without time zone NOT NULL,
    token_actual character varying(64) NOT NULL,
    token_expira_en timestamp without time zone NOT NULL,
    cerrada boolean DEFAULT false NOT NULL,
    creada_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sesiones_asistencia OWNER TO postgres;

--
-- Name: sesiones_asistencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sesiones_asistencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sesiones_asistencia_id_seq OWNER TO postgres;

--
-- Name: sesiones_asistencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sesiones_asistencia_id_seq OWNED BY public.sesiones_asistencia.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol public.user_role_enum DEFAULT 'ESTUDIANTE'::public.user_role_enum NOT NULL,
    documento_identidad character varying(20),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reset_token character varying(100),
    reset_token_expira timestamp without time zone
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: actividad_estudiantes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividad_estudiantes ALTER COLUMN id SET DEFAULT nextval('public.actividad_estudiantes_id_seq'::regclass);


--
-- Name: examenes_programados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados ALTER COLUMN id SET DEFAULT nextval('public.examenes_programados_id_seq'::regclass);


--
-- Name: examenes_programados_semanas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados_semanas ALTER COLUMN id SET DEFAULT nextval('public.examenes_programados_semanas_id_seq'::regclass);


--
-- Name: horarios_materia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_materia ALTER COLUMN id SET DEFAULT nextval('public.horarios_materia_id_seq'::regclass);


--
-- Name: inscripciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones ALTER COLUMN id SET DEFAULT nextval('public.inscripciones_id_seq'::regclass);


--
-- Name: intentos_examen id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intentos_examen ALTER COLUMN id SET DEFAULT nextval('public.intentos_examen_id_seq'::regclass);


--
-- Name: materias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias ALTER COLUMN id SET DEFAULT nextval('public.materias_id_seq'::regclass);


--
-- Name: registros_asistencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_asistencia ALTER COLUMN id SET DEFAULT nextval('public.registros_asistencia_id_seq'::regclass);


--
-- Name: semanas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semanas ALTER COLUMN id SET DEFAULT nextval('public.semanas_id_seq'::regclass);


--
-- Name: sesiones_asistencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_asistencia ALTER COLUMN id SET DEFAULT nextval('public.sesiones_asistencia_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: actividad_estudiantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actividad_estudiantes (id, usuario_id, materia_id, semana_id, accion, creado_en) FROM stdin;
1	1	1	\N	vista_plataforma	2026-09-01 17:13:45.857632
2	98	4	\N	vista_plataforma	2026-09-01 21:12:39.161674
3	101	1	\N	vista_plataforma	2026-09-01 21:13:20.561278
4	94	1	\N	vista_plataforma	2026-09-01 21:13:20.615108
5	102	1	\N	vista_plataforma	2026-09-01 21:13:25.21758
6	102	4	\N	vista_plataforma	2026-09-01 21:13:38.782622
7	101	4	\N	vista_plataforma	2026-09-01 21:13:42.193088
8	94	4	\N	vista_plataforma	2026-09-01 21:13:44.813431
9	97	1	\N	vista_plataforma	2026-09-01 21:14:44.978871
10	97	4	\N	vista_plataforma	2026-09-01 21:14:50.939178
11	99	1	\N	vista_plataforma	2026-09-01 21:16:06.715035
12	99	4	\N	vista_plataforma	2026-09-01 21:16:35.627202
13	2	1	\N	vista_plataforma	2026-09-01 21:25:05.544827
14	35	1	\N	vista_plataforma	2026-09-02 02:52:58.362158
15	24	1	\N	vista_plataforma	2026-09-02 02:53:18.124524
16	35	1	\N	vista_plataforma	2026-09-02 03:34:55.675507
17	35	1	\N	vista_plataforma	2026-09-02 03:46:07.063142
18	35	1	\N	vista_plataforma	2026-09-02 03:46:14.034245
19	35	1	\N	vista_plataforma	2026-09-02 04:07:02.189177
20	35	1	\N	vista_plataforma	2026-09-02 04:10:16.838188
21	98	2	\N	vista_plataforma	2026-09-02 04:15:20.578698
22	98	1	\N	vista_plataforma	2026-09-02 04:15:20.978089
23	28	1	\N	vista_plataforma	2026-09-02 04:47:12.343131
24	21	1	\N	vista_plataforma	2026-09-02 05:46:12.769582
25	20	1	\N	vista_plataforma	2026-09-02 07:17:07.759468
26	33	1	\N	vista_plataforma	2026-09-02 13:51:33.952796
27	34	1	\N	vista_plataforma	2026-09-02 17:56:31.552131
28	28	1	\N	vista_plataforma	2026-09-02 17:56:41.428126
29	34	1	\N	vista_plataforma	2026-09-02 17:57:41.10872
30	87	1	\N	vista_plataforma	2026-09-03 16:18:47.848661
31	87	2	\N	vista_plataforma	2026-09-03 16:19:19.287308
32	92	1	\N	vista_plataforma	2026-09-03 16:56:54.976611
33	92	2	\N	vista_plataforma	2026-09-03 16:56:58.537091
34	98	1	\N	vista_plataforma	2026-09-03 22:19:48.940723
35	98	4	\N	vista_plataforma	2026-09-03 22:19:53.477793
36	25	1	\N	vista_plataforma	2026-09-04 23:15:02.891237
37	25	1	\N	vista_plataforma	2026-09-04 23:26:47.008201
38	22	1	\N	vista_plataforma	2026-09-05 01:19:17.175261
39	22	1	\N	vista_plataforma	2026-09-05 01:20:04.108203
40	22	1	\N	vista_plataforma	2026-09-05 01:23:24.319545
41	27	1	\N	vista_plataforma	2026-09-05 15:40:25.063986
42	20	1	\N	vista_plataforma	2026-09-05 19:09:44.568206
43	1	1	\N	vista_plataforma	2026-09-05 20:01:59.844126
44	2	1	\N	vista_plataforma	2026-09-05 20:28:11.981976
45	1	1	\N	vista_plataforma	2026-09-05 22:03:51.585543
46	1	1	\N	vista_plataforma	2026-09-05 22:09:27.395587
47	2	1	\N	vista_plataforma	2026-09-05 22:37:57.30739
48	2	1	\N	vista_plataforma	2026-09-05 22:45:48.25427
49	2	1	\N	vista_plataforma	2026-09-05 22:47:42.902845
50	2	1	\N	vista_plataforma	2026-09-05 22:52:44.636455
51	2	1	\N	vista_plataforma	2026-09-05 23:16:36.097866
52	2	1	\N	vista_plataforma	2026-09-05 23:29:25.748197
53	2	1	\N	vista_plataforma	2026-09-06 01:47:04.508379
54	2	1	\N	vista_plataforma	2026-09-06 02:22:40.34638
55	11	2	\N	vista_plataforma	2026-09-06 02:24:53.513586
56	11	3	\N	vista_plataforma	2026-09-06 02:24:55.163673
57	11	1	\N	vista_plataforma	2026-09-06 02:25:07.108659
58	1	1	\N	vista_plataforma	2026-09-06 03:22:31.471702
59	11	1	\N	vista_plataforma	2026-09-06 03:25:49.818659
60	24	1	\N	vista_plataforma	2026-09-06 03:29:37.955291
61	26	1	\N	vista_plataforma	2026-09-06 03:32:32.966901
62	26	1	\N	vista_plataforma	2026-09-06 03:33:29.459479
63	26	1	\N	vista_plataforma	2026-09-06 03:34:35.14574
64	22	\N	\N	login	2026-09-06 03:37:54.458182
65	22	1	\N	vista_plataforma	2026-09-06 03:37:55.232995
66	26	1	\N	vista_plataforma	2026-09-06 03:38:45.125187
67	26	1	\N	vista_plataforma	2026-09-06 03:40:49.194956
68	22	1	\N	vista_plataforma	2026-09-06 05:00:01.824098
69	15	\N	\N	login	2026-09-07 03:53:35.340625
70	15	1	\N	vista_plataforma	2026-09-07 03:53:35.649197
71	15	\N	\N	login	2026-09-07 03:56:39.720362
72	15	1	\N	vista_plataforma	2026-09-07 03:56:40.047785
73	15	\N	\N	login	2026-09-07 03:58:54.466569
74	15	1	\N	vista_plataforma	2026-09-07 03:58:54.969387
75	15	\N	\N	login	2026-09-07 04:31:05.357677
76	21	\N	\N	login	2026-09-07 04:32:01.42995
77	21	1	\N	vista_plataforma	2026-09-07 04:32:01.696618
78	1	\N	\N	login	2026-09-07 04:53:37.792418
79	1	1	\N	vista_plataforma	2026-09-07 04:53:38.051527
80	15	\N	\N	login	2026-09-07 15:04:29.332339
81	15	1	\N	vista_plataforma	2026-09-07 15:04:29.602005
82	77	\N	\N	login	2026-09-07 17:13:34.585866
83	77	2	\N	vista_plataforma	2026-09-07 17:13:35.699283
84	77	2	\N	vista_plataforma	2026-09-07 17:34:26.790905
85	77	1	\N	vista_plataforma	2026-09-07 17:34:26.971693
86	75	\N	\N	login	2026-09-07 18:29:54.785555
87	75	1	\N	vista_plataforma	2026-09-07 18:29:55.023288
88	75	2	\N	vista_plataforma	2026-09-07 18:29:55.312516
89	75	1	\N	vista_plataforma	2026-09-07 18:30:42.193512
90	75	2	\N	vista_plataforma	2026-09-07 18:30:42.213241
91	77	2	\N	vista_plataforma	2026-09-07 18:33:09.921435
92	77	1	\N	vista_plataforma	2026-09-07 18:33:10.170399
93	77	2	\N	vista_plataforma	2026-09-07 18:37:14.15012
94	77	1	\N	vista_plataforma	2026-09-07 18:37:14.171506
95	35	\N	\N	login	2026-09-07 18:38:19.306973
96	35	1	\N	vista_plataforma	2026-09-07 18:38:21.305966
97	75	1	\N	vista_plataforma	2026-09-07 18:43:21.51729
98	75	2	\N	vista_plataforma	2026-09-07 18:43:21.56883
99	75	2	\N	vista_plataforma	2026-09-07 18:45:52.736944
100	75	1	\N	vista_plataforma	2026-09-07 18:45:52.745163
101	102	\N	\N	login	2026-09-07 19:50:44.918497
102	102	4	\N	vista_plataforma	2026-09-07 19:50:45.343957
103	2	\N	\N	login	2026-09-07 22:49:59.884511
104	2	1	\N	vista_plataforma	2026-09-07 22:50:00.554923
105	79	\N	\N	login	2026-09-07 23:03:05.042574
106	79	1	\N	vista_plataforma	2026-09-07 23:03:05.359988
107	79	2	\N	vista_plataforma	2026-09-07 23:03:05.624204
108	75	\N	\N	login	2026-09-07 23:03:36.777006
109	75	1	\N	vista_plataforma	2026-09-07 23:03:37.066487
110	75	2	\N	vista_plataforma	2026-09-07 23:03:37.412678
111	1	\N	\N	login	2026-09-07 23:05:58.803239
112	1	1	\N	vista_plataforma	2026-09-07 23:05:59.131769
113	1	2	\N	vista_plataforma	2026-09-07 23:06:03.053501
114	80	\N	\N	login	2026-09-07 23:06:32.098648
115	80	1	\N	vista_plataforma	2026-09-07 23:06:32.928635
116	80	2	\N	vista_plataforma	2026-09-07 23:06:33.188015
117	91	\N	\N	login	2026-09-07 23:07:58.378228
118	91	2	\N	vista_plataforma	2026-09-07 23:07:58.590004
119	87	\N	\N	login	2026-09-07 23:08:26.378063
120	87	1	\N	vista_plataforma	2026-09-07 23:08:27.098161
121	87	2	\N	vista_plataforma	2026-09-07 23:08:27.282083
122	90	\N	\N	login	2026-09-07 23:08:35.392322
123	90	1	\N	vista_plataforma	2026-09-07 23:08:35.995648
124	90	2	\N	vista_plataforma	2026-09-07 23:08:36.153984
125	84	\N	\N	login	2026-09-07 23:08:42.446353
126	84	1	\N	vista_plataforma	2026-09-07 23:08:42.895582
127	84	2	\N	vista_plataforma	2026-09-07 23:08:43.15297
128	88	\N	\N	login	2026-09-07 23:09:53.806681
129	88	2	\N	vista_plataforma	2026-09-07 23:09:54.071945
130	93	\N	\N	login	2026-09-07 23:12:12.981023
131	93	2	\N	vista_plataforma	2026-09-07 23:12:13.812354
132	79	1	\N	vista_plataforma	2026-09-07 23:13:46.912726
133	79	2	\N	vista_plataforma	2026-09-07 23:13:46.916773
134	79	2	\N	vista_plataforma	2026-09-07 23:14:28.40819
135	79	1	\N	vista_plataforma	2026-09-07 23:14:28.412412
136	79	1	\N	vista_plataforma	2026-09-07 23:14:30.490541
137	79	2	\N	vista_plataforma	2026-09-07 23:14:30.493944
138	1	1	\N	vista_plataforma	2026-09-07 23:20:05.463407
139	82	\N	\N	login	2026-09-07 23:24:34.766784
140	82	1	\N	vista_plataforma	2026-09-07 23:24:35.242797
141	82	2	\N	vista_plataforma	2026-09-07 23:24:35.524725
142	81	\N	\N	login	2026-09-07 23:27:35.901308
143	81	2	\N	vista_plataforma	2026-09-07 23:27:36.174577
144	83	\N	\N	login	2026-09-07 23:28:25.960455
145	83	1	\N	vista_plataforma	2026-09-07 23:28:26.325833
146	83	2	\N	vista_plataforma	2026-09-07 23:28:26.581426
147	1	2	\N	vista_plataforma	2026-09-07 23:30:04.287944
148	1	1	\N	vista_plataforma	2026-09-07 23:40:39.053391
149	1	2	\N	vista_plataforma	2026-09-07 23:59:43.597066
150	73	\N	\N	login	2026-09-08 00:18:41.41516
151	73	2	\N	vista_plataforma	2026-09-08 00:18:41.731276
152	75	2	\N	vista_plataforma	2026-09-08 00:23:09.460082
153	75	1	\N	vista_plataforma	2026-09-08 00:23:09.479742
154	93	1	\N	vista_plataforma	2026-09-08 00:43:28.366635
155	93	2	\N	vista_plataforma	2026-09-08 00:43:28.563531
156	77	\N	\N	login	2026-09-08 01:12:46.266936
157	77	1	\N	vista_plataforma	2026-09-08 01:12:46.761244
158	77	2	\N	vista_plataforma	2026-09-08 01:12:47.469111
159	33	\N	\N	login	2026-09-08 02:39:15.428786
160	33	1	\N	vista_plataforma	2026-09-08 02:39:16.389133
161	2	\N	\N	login	2026-09-08 03:15:39.886216
162	2	1	\N	vista_plataforma	2026-09-08 03:15:40.352423
163	92	\N	\N	login	2026-09-08 04:10:01.570368
164	92	1	\N	vista_plataforma	2026-09-08 04:10:01.951201
165	92	2	\N	vista_plataforma	2026-09-08 04:10:02.269802
166	92	1	\N	vista_plataforma	2026-09-08 04:11:27.283252
167	92	2	\N	vista_plataforma	2026-09-08 04:11:27.500987
168	20	\N	\N	login	2026-09-08 06:29:07.208503
169	20	1	\N	vista_plataforma	2026-09-08 06:29:07.467201
170	20	\N	\N	login	2026-09-08 06:31:05.892975
171	20	5	\N	vista_plataforma	2026-09-08 06:31:06.108572
172	20	1	\N	vista_plataforma	2026-09-08 06:31:06.533403
173	22	\N	\N	login	2026-09-08 15:09:44.186312
174	22	1	\N	vista_plataforma	2026-09-08 15:09:44.605534
175	22	1	\N	vista_plataforma	2026-09-08 16:40:35.051251
176	21	\N	\N	login	2026-09-08 16:59:24.928129
177	21	1	\N	vista_plataforma	2026-09-08 16:59:25.466183
178	21	1	\N	vista_plataforma	2026-09-08 16:59:44.959128
179	27	\N	\N	login	2026-09-08 18:05:16.09659
180	27	1	\N	vista_plataforma	2026-09-08 18:05:17.09094
181	24	\N	\N	login	2026-09-08 18:07:01.760197
182	24	1	\N	vista_plataforma	2026-09-08 18:07:02.456416
183	32	\N	\N	login	2026-09-08 18:07:13.362889
184	32	1	\N	vista_plataforma	2026-09-08 18:07:14.08721
185	29	\N	\N	login	2026-09-08 18:08:02.001559
186	29	1	\N	vista_plataforma	2026-09-08 18:08:02.412887
187	15	\N	\N	login	2026-09-08 18:08:34.869215
188	15	1	\N	vista_plataforma	2026-09-08 18:08:35.358986
189	19	\N	\N	login	2026-09-08 18:09:18.848102
190	19	1	\N	vista_plataforma	2026-09-08 18:09:19.177586
191	14	\N	\N	login	2026-09-08 18:10:11.958417
192	14	1	\N	vista_plataforma	2026-09-08 18:10:16.823824
193	33	\N	\N	login	2026-09-08 18:11:19.396682
194	33	1	\N	vista_plataforma	2026-09-08 18:11:20.084176
195	34	\N	\N	login	2026-09-08 18:16:15.737887
196	34	1	\N	vista_plataforma	2026-09-08 18:16:16.324021
197	35	\N	\N	login	2026-09-08 18:53:27.701644
198	35	1	\N	vista_plataforma	2026-09-08 18:53:28.398248
199	35	1	\N	vista_plataforma	2026-09-08 18:54:06.185595
200	35	1	\N	vista_plataforma	2026-09-08 19:00:11.993026
201	15	1	\N	vista_plataforma	2026-09-08 19:08:14.625868
202	34	1	\N	vista_plataforma	2026-09-08 19:08:37.632894
203	28	\N	\N	login	2026-09-08 19:09:47.521992
204	28	1	\N	vista_plataforma	2026-09-08 19:09:48.192703
205	29	1	\N	vista_plataforma	2026-09-08 19:23:23.152733
206	19	1	\N	vista_plataforma	2026-09-08 19:44:43.729304
207	19	1	\N	vista_plataforma	2026-09-08 19:53:13.95641
208	19	1	\N	vista_plataforma	2026-09-08 19:54:11.861976
209	1	\N	\N	login	2026-09-08 21:09:15.537339
210	1	4	\N	vista_plataforma	2026-09-08 21:09:16.681938
211	102	\N	\N	login	2026-09-08 21:15:59.747981
212	102	4	\N	vista_plataforma	2026-09-08 21:16:00.277398
213	102	1	\N	vista_plataforma	2026-09-08 21:29:09.760027
214	102	4	\N	vista_plataforma	2026-09-08 21:29:10.24987
215	99	\N	\N	login	2026-09-08 21:40:29.101771
216	99	4	\N	vista_plataforma	2026-09-08 21:40:30.119717
217	72	\N	\N	login	2026-09-08 22:41:35.69515
218	72	1	\N	vista_plataforma	2026-09-08 22:41:36.140966
219	72	2	\N	vista_plataforma	2026-09-08 22:41:36.339471
220	25	\N	\N	login	2026-09-09 00:03:31.136493
221	25	1	\N	vista_plataforma	2026-09-09 00:03:31.56241
222	73	\N	\N	login	2026-09-09 00:21:27.181982
223	73	2	\N	vista_plataforma	2026-09-09 00:21:27.456296
224	25	1	\N	vista_plataforma	2026-09-09 01:48:02.731372
225	32	\N	\N	login	2026-09-09 02:00:59.264111
226	32	1	\N	vista_plataforma	2026-09-09 02:00:59.4836
227	15	\N	\N	login	2026-09-09 02:16:50.265995
228	15	1	\N	vista_plataforma	2026-09-09 02:16:50.599866
\.


--
-- Data for Name: contador_visitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contador_visitas (id, vistas_totales, visitantes_unicos, ultima_visita) FROM stdin;
1	2031	435	2026-09-09 03:26:42.592895
\.


--
-- Data for Name: examenes_programados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examenes_programados (id, materia_id, docente_id, titulo, fecha_inicio, fecha_fin, duracion_min, cantidad_teoria, cantidad_ejercicio, estado, creado_en) FROM stdin;
\.


--
-- Data for Name: examenes_programados_semanas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examenes_programados_semanas (id, examen_id, semana_id) FROM stdin;
\.


--
-- Data for Name: horarios_materia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios_materia (id, materia_id, dia_semana, hora_inicio, hora_fin, creado_en) FROM stdin;
\.


--
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscripciones (id, materia_id, estudiante_id, creada_en) FROM stdin;
410	1	11	2026-09-05 23:40:26.701801
411	1	12	2026-09-05 23:40:26.701801
413	1	14	2026-09-05 23:40:26.701801
414	1	15	2026-09-05 23:40:26.701801
415	1	16	2026-09-05 23:40:26.701801
416	1	17	2026-09-05 23:40:26.701801
417	1	18	2026-09-05 23:40:26.701801
418	1	19	2026-09-05 23:40:26.701801
419	1	20	2026-09-05 23:40:26.701801
420	1	21	2026-09-05 23:40:26.701801
421	1	22	2026-09-05 23:40:26.701801
422	1	23	2026-09-05 23:40:26.701801
423	1	24	2026-09-05 23:40:26.701801
424	1	25	2026-09-05 23:40:26.701801
425	1	26	2026-09-05 23:40:26.701801
426	1	27	2026-09-05 23:40:26.701801
427	1	28	2026-09-05 23:40:26.701801
428	1	29	2026-09-05 23:40:26.701801
429	1	30	2026-09-05 23:40:26.701801
430	1	31	2026-09-05 23:40:26.701801
431	1	32	2026-09-05 23:40:26.701801
432	1	33	2026-09-05 23:40:26.701801
433	1	34	2026-09-05 23:40:26.701801
434	1	35	2026-09-05 23:40:26.701801
435	1	36	2026-09-05 23:40:26.701801
436	1	37	2026-09-05 23:40:26.701801
437	1	38	2026-09-05 23:40:26.701801
438	1	39	2026-09-05 23:40:26.701801
439	1	40	2026-09-05 23:40:26.701801
440	2	71	2026-09-05 23:40:26.701801
441	2	72	2026-09-05 23:40:26.701801
442	2	73	2026-09-05 23:40:26.701801
443	2	74	2026-09-05 23:40:26.701801
444	2	75	2026-09-05 23:40:26.701801
445	2	76	2026-09-05 23:40:26.701801
446	2	77	2026-09-05 23:40:26.701801
447	2	78	2026-09-05 23:40:26.701801
448	2	79	2026-09-05 23:40:26.701801
449	2	80	2026-09-05 23:40:26.701801
450	2	81	2026-09-05 23:40:26.701801
451	2	82	2026-09-05 23:40:26.701801
452	2	83	2026-09-05 23:40:26.701801
453	2	84	2026-09-05 23:40:26.701801
454	2	85	2026-09-05 23:40:26.701801
455	2	86	2026-09-05 23:40:26.701801
456	2	87	2026-09-05 23:40:26.701801
457	2	88	2026-09-05 23:40:26.701801
458	2	89	2026-09-05 23:40:26.701801
459	2	90	2026-09-05 23:40:26.701801
460	2	91	2026-09-05 23:40:26.701801
461	2	92	2026-09-05 23:40:26.701801
462	2	93	2026-09-05 23:40:26.701801
463	4	94	2026-09-05 23:40:26.701801
464	4	95	2026-09-05 23:40:26.701801
465	4	96	2026-09-05 23:40:26.701801
466	4	97	2026-09-05 23:40:26.701801
467	4	98	2026-09-05 23:40:26.701801
468	4	99	2026-09-05 23:40:26.701801
469	4	100	2026-09-05 23:40:26.701801
470	4	101	2026-09-05 23:40:26.701801
471	4	102	2026-09-05 23:40:26.701801
472	4	103	2026-09-05 23:40:26.701801
\.


--
-- Data for Name: intentos_examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intentos_examen (id, estudiante_id, semana_id, examen_programado_id, nota5, porcentaje, aprobado, infraccion_ia, infracciones, tiempo_empleado_seg, respuestas, fecha) FROM stdin;
6	36	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "b", "c", "b", "c", "a", "c"]}	2026-09-05 22:41:56.215226
7	29	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "a", "c", "b", "a"]}	2026-09-05 22:44:33.45192
8	30	1	\N	3.6	71	t	f	[]	0	{"quizId": "rquiz1_s01_03", "tipoEvaluacion": "recuperacion", "respuestasSeleccionadas": ["b", "c", "c", "b", "c", "nr", "a"]}	2026-09-05 22:54:46.729637
9	40	1	\N	4.3	86	t	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "b", "d", "b", "b"]}	2026-09-05 22:56:01.439144
10	12	1	\N	1.4	29	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "b", "c", "c", "b", "d", "b"]}	2026-09-05 22:57:29.719599
11	15	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["d", "c", "nr", "b", "c", "b", "c"]}	2026-09-05 22:59:37.366443
12	25	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "c", "c", "d", "c", "b", "nr"]}	2026-09-05 23:02:14.935265
13	28	1	\N	3.6	71	t	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "b", "b", "c", "b", "a"]}	2026-09-05 23:03:20.942735
14	21	1	\N	2.1	43	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "b", "b", "nr", "nr"]}	2026-09-05 23:04:23.523617
15	37	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "d", "b", "b", "a"]}	2026-09-05 23:05:30.221858
16	38	1	\N	5.0	100	t	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "b", "c", "b", "b"]}	2026-09-05 23:06:15.978233
17	31	1	\N	5.0	100	t	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "b", "c", "b", "b"]}	2026-09-05 23:06:50.13219
18	35	1	\N	3.6	71	t	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "b", "c", "nr", "a"]}	2026-09-05 23:08:11.880878
19	32	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "b", "d", "b", "a"]}	2026-09-05 23:09:29.717721
20	39	1	\N	2.1	43	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "b", "a", "a", "d", "b", "b"]}	2026-09-05 23:10:33.280399
21	27	1	\N	1.4	29	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "b", "d", "a", "a", "a"]}	2026-09-05 23:11:29.20035
22	16	1	\N	2.1	43	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["c", "d", "c", "b", "b", "c", "b"]}	2026-09-05 23:12:12.211901
23	19	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "c", "b", "b", "c"]}	2026-09-05 23:13:00.323417
24	18	1	\N	2.1	43	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "b", "a", "c", "c"]}	2026-09-05 23:14:18.419343
25	20	1	\N	2.1	43	f	f	[]	0	{"quizId": "quiz1_s01_03", "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "c", "c", "d", "d", "b", "nr"]}	2026-09-05 23:15:47.603285
26	26	1	\N	1.4	29	f	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["d", "b", "a", "b", "d", "b", "a"]}	2026-09-05 23:17:31.731767
27	14	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "a", "d", "b", "a"]}	2026-09-05 23:18:53.490261
28	33	1	\N	3.6	71	t	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "b", "b", "b", "a"]}	2026-09-05 23:21:52.579244
29	11	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "c", "c", "a", "c", "a", "b"]}	2026-09-05 23:23:05.400606
30	24	1	\N	5.0	100	t	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "c", "b", "c", "b", "b"]}	2026-09-05 23:23:49.856332
31	22	1	\N	2.9	57	f	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "b", "b", "b", "a"]}	2026-09-05 23:24:37.916408
32	34	1	\N	4.3	86	t	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "b", "b", "c", "b", "b"]}	2026-09-05 23:25:43.567211
33	23	1	\N	2.1	43	f	f	[]	0	{"quizId": "quiz1_s01_03", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "b", "a", "b", "b", "a"]}	2026-09-05 23:26:47.906805
34	14	5	\N	2.9	57	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "d", "b", "a", "a", "a", "a"]}	2026-09-06 01:48:34.207601
35	21	5	\N	2.1	43	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "d", "b", "a", "b", "c", "a"]}	2026-09-06 01:49:32.555475
36	40	5	\N	2.9	57	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "b", "a", "a", "a", "c", "a"]}	2026-09-06 01:52:01.785144
37	26	5	\N	2.1	43	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["c", "c", "a", "c", "a", "c", "d"]}	2026-09-06 01:53:53.008177
38	20	5	\N	2.1	43	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "b", "a", "b", "c", "np"]}	2026-09-06 01:59:37.245453
39	29	5	\N	3.6	71	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "a", "a", "a", "a", "a", "a"]}	2026-09-06 02:01:16.165435
40	34	5	\N	4.3	86	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:02:53.616013
41	35	5	\N	2.9	57	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["c", "b", "a", "a", "a", "a", "c"]}	2026-09-06 02:04:04.761944
42	19	5	\N	2.1	43	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["c", "b", "b", "a", "a", "a", "c"]}	2026-09-06 02:05:16.296977
43	24	5	\N	5.0	100	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:06:29.028867
44	36	5	\N	3.6	71	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "d", "b", "a", "a", "a", "a"]}	2026-09-06 02:07:22.722957
45	38	5	\N	5.0	100	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:08:10.458486
46	39	5	\N	2.1	43	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "d", "a", "b", "c", "d", "a"]}	2026-09-06 02:09:14.131735
47	25	5	\N	5.0	100	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:10:10.920248
48	33	5	\N	4.3	86	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["c", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:11:17.347648
49	30	5	\N	3.6	71	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "c", "a", "a", "a", "a", "nr"]}	2026-09-06 02:12:32.024522
50	32	5	\N	5.0	100	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:13:27.301311
51	17	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:14:01.270113
52	37	5	\N	3.6	71	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["d", "c", "b", "a", "a", "a", "a"]}	2026-09-06 02:15:45.103005
53	15	5	\N	0.7	14	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "d", "b", "b", "a", "c", "b"]}	2026-09-06 02:16:36.530719
54	28	5	\N	5.0	100	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["b", "c", "a", "a", "a", "a", "a"]}	2026-09-06 02:17:25.576018
55	22	5	\N	3.6	71	t	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": false, "tipoEvaluacion": "ordinario", "respuestasSeleccionadas": ["a", "c", "b", "a", "a", "a", "a"]}	2026-09-06 02:18:12.425658
56	17	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:18:39.874609
57	11	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:19:54.8134
58	12	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:20:13.182735
59	16	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:20:23.158213
60	18	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:20:37.507224
61	23	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:20:49.10233
62	27	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:21:00.522758
63	31	5	\N	0.0	0	f	f	[]	0	{"quizId": "quiz2_s03_05", "noPresento": true, "tipoEvaluacion": "no_presento", "respuestasSeleccionadas": ["np", "np", "np", "np", "np", "np", "np"]}	2026-09-06 02:21:20.257822
64	75	201	\N	5.0	100	t	f	[]	1347	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-07 23:27:08.343219
65	81	201	\N	5.0	100	t	f	[]	67	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-07 23:28:49.763222
66	80	201	\N	3.8	75	t	f	[]	251	{"prog01_p1": "d", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "a", "prog01_p6": "a", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "a", "prog01_p15": "a", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "a", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-07 23:35:24.397855
67	83	201	\N	4.4	88	t	f	[]	970	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "a", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "c", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "c", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-07 23:47:01.916253
68	93	201	\N	4.8	96	t	f	[]	2131	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "d", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-07 23:48:38.462529
69	81	202	\N	4.6	92	t	f	[]	1369	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "a", "prog02_p4": "b", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "b", "prog02_p8": "b", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "a", "prog02_p12": "a", "prog02_p13": "c", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "a", "prog02_p18": "a", "prog02_p19": "b", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "b", "prog02_p23": "b", "prog02_p24": "a"}	2026-09-07 23:52:48.85394
70	75	202	\N	4.6	92	t	f	[]	1455	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "a", "prog02_p4": "b", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "b", "prog02_p8": "c", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "a", "prog02_p12": "b", "prog02_p13": "b", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "a", "prog02_p18": "a", "prog02_p19": "a", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "b", "prog02_p23": "b", "prog02_p24": "a"}	2026-09-07 23:54:42.827599
71	79	201	\N	4.8	96	t	f	[]	113	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "a", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:01:47.655504
72	79	201	\N	5.0	100	t	f	[]	97	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:03:44.828419
73	83	202	\N	4.4	88	t	f	[]	689	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "b", "prog02_p4": "b", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "b", "prog02_p8": "b", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "b", "prog02_p12": "b", "prog02_p13": "b", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "a", "prog02_p18": "a", "prog02_p19": "b", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "b", "prog02_p23": "b", "prog02_p24": "b"}	2026-09-08 00:03:50.66395
74	81	203	\N	4.6	92	t	f	[]	792	{"prog03_p1": "b", "prog03_p2": "b", "prog03_p3": "c", "prog03_p4": "b", "prog03_p5": "a", "prog03_p6": "b", "prog03_p7": "a", "prog03_p8": "a", "prog03_p9": "b", "prog03_p10": "b", "prog03_p11": "b", "prog03_p12": "a", "prog03_p13": "b", "prog03_p14": "a", "prog03_p15": "b", "prog03_p16": "b", "prog03_p17": "a", "prog03_p18": "b", "prog03_p19": "b", "prog03_p20": "a", "prog03_p21": "a", "prog03_p22": "b", "prog03_p23": "b", "prog03_p24": "a"}	2026-09-08 00:09:48.408429
75	90	201	\N	4.2	83	t	f	[]	352	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "a", "prog01_p9": "a", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "a", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "a", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:10:40.430946
76	75	203	\N	4.6	92	t	f	[]	877	{"prog03_p1": "b", "prog03_p2": "b", "prog03_p3": "c", "prog03_p4": "b", "prog03_p5": "a", "prog03_p6": "b", "prog03_p7": "a", "prog03_p8": "a", "prog03_p9": "b", "prog03_p10": "b", "prog03_p11": "b", "prog03_p12": "a", "prog03_p13": "b", "prog03_p14": "a", "prog03_p15": "a", "prog03_p16": "b", "prog03_p17": "a", "prog03_p18": "b", "prog03_p19": "b", "prog03_p20": "a", "prog03_p21": "a", "prog03_p22": "a", "prog03_p23": "b", "prog03_p24": "a"}	2026-09-08 00:10:42.456331
77	81	201	\N	5.0	100	t	f	[]	78	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:12:51.545139
78	81	202	\N	4.8	96	t	f	[]	105	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "a", "prog02_p4": "b", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "b", "prog02_p8": "b", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "a", "prog02_p12": "a", "prog02_p13": "b", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "a", "prog02_p18": "a", "prog02_p19": "b", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "b", "prog02_p23": "b", "prog02_p24": "a"}	2026-09-08 00:14:47.159361
79	93	202	\N	3.8	75	t	f	[]	1702	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "a", "prog02_p4": "a", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "d", "prog02_p8": "c", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "a", "prog02_p12": "b", "prog02_p13": "a", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "b", "prog02_p18": "b", "prog02_p19": "b", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "b", "prog02_p23": "b", "prog02_p24": "a"}	2026-09-08 00:17:56.565202
80	91	201	\N	5.0	100	t	f	[]	338	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:18:10.867987
81	80	202	\N	4.4	88	t	f	[]	266	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "a", "prog02_p4": "a", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "b", "prog02_p8": "b", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "a", "prog02_p12": "c", "prog02_p13": "b", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "a", "prog02_p18": "a", "prog02_p19": "b", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "a", "prog02_p23": "b", "prog02_p24": "a"}	2026-09-08 00:19:18.524536
82	83	203	\N	4.2	83	t	f	[]	1109	{"prog03_p1": "b", "prog03_p2": "b", "prog03_p3": "c", "prog03_p4": "b", "prog03_p5": "b", "prog03_p6": "b", "prog03_p7": "a", "prog03_p8": "a", "prog03_p9": "a", "prog03_p10": "b", "prog03_p11": "a", "prog03_p12": "a", "prog03_p13": "b", "prog03_p14": "a", "prog03_p15": "b", "prog03_p16": "a", "prog03_p17": "a", "prog03_p18": "b", "prog03_p19": "b", "prog03_p20": "a", "prog03_p21": "a", "prog03_p22": "b", "prog03_p23": "b", "prog03_p24": "a"}	2026-09-08 00:24:45.424732
83	79	202	\N	4.8	96	t	f	[]	117	{"prog02_p1": "b", "prog02_p2": "b", "prog02_p3": "a", "prog02_p4": "b", "prog02_p5": "b", "prog02_p6": "b", "prog02_p7": "b", "prog02_p8": "b", "prog02_p9": "b", "prog02_p10": "a", "prog02_p11": "a", "prog02_p12": "b", "prog02_p13": "a", "prog02_p14": "b", "prog02_p15": "b", "prog02_p16": "a", "prog02_p17": "a", "prog02_p18": "a", "prog02_p19": "b", "prog02_p20": "a", "prog02_p21": "b", "prog02_p22": "b", "prog02_p23": "b", "prog02_p24": "a"}	2026-09-08 00:25:48.21114
84	88	201	\N	3.5	71	t	f	[]	883	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "d", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "c", "prog01_p14": "a", "prog01_p15": "b", "prog01_p16": "d", "prog01_p17": "b", "prog01_p18": "d", "prog01_p19": "b", "prog01_p20": "a", "prog01_p21": "b", "prog01_p22": "a", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:30:07.25701
85	87	201	\N	5.0	100	t	f	[]	139	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:38:34.759018
86	82	201	\N	4.8	96	t	f	[]	120	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "d", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 00:41:37.520373
87	93	203	\N	4.2	83	t	f	[]	1351	{"prog03_p1": "b", "prog03_p2": "b", "prog03_p3": "b", "prog03_p4": "b", "prog03_p5": "a", "prog03_p6": "b", "prog03_p7": "a", "prog03_p8": "a", "prog03_p9": "b", "prog03_p10": "d", "prog03_p11": "a", "prog03_p12": "a", "prog03_p13": "b", "prog03_p14": "a", "prog03_p15": "b", "prog03_p16": "b", "prog03_p17": "b", "prog03_p18": "b", "prog03_p19": "b", "prog03_p20": "c", "prog03_p21": "a", "prog03_p22": "a", "prog03_p23": "b", "prog03_p24": "a"}	2026-09-08 00:42:01.630284
88	80	203	\N	4.6	92	t	f	[]	154	{"prog03_p1": "b", "prog03_p2": "b", "prog03_p3": "c", "prog03_p4": "b", "prog03_p5": "a", "prog03_p6": "b", "prog03_p7": "a", "prog03_p8": "a", "prog03_p9": "b", "prog03_p10": "a", "prog03_p11": "a", "prog03_p12": "a", "prog03_p13": "b", "prog03_p14": "a", "prog03_p15": "a", "prog03_p16": "b", "prog03_p17": "a", "prog03_p18": "b", "prog03_p19": "b", "prog03_p20": "a", "prog03_p21": "a", "prog03_p22": "a", "prog03_p23": "b", "prog03_p24": "a"}	2026-09-08 00:44:25.303285
89	22	1	\N	3.0	60	t	f	[]	401	{"s01_p8": "a", "s01_p11": "c", "s01_p34": "a", "s01_p42": "c", "s01_p43": "b"}	2026-09-08 15:18:21.778375
90	22	2	\N	2.0	40	f	f	[]	476	{"s02_p12": "b", "s02_p25": "c", "s02_p26": "d", "s02_p30": "c", "s02_p34": "a"}	2026-09-08 15:33:20.107573
91	72	201	\N	3.5	71	t	f	[]	1608	{"prog01_p1": "c", "prog01_p2": "b", "prog01_p3": "a", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "b", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "d", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "a", "prog01_p15": "b", "prog01_p16": "d", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "a", "prog01_p20": "b", "prog01_p21": "a", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-08 23:09:35.78792
92	73	201	\N	4.8	96	t	f	[]	5088	{"prog01_p1": "b", "prog01_p2": "b", "prog01_p3": "b", "prog01_p4": "b", "prog01_p5": "d", "prog01_p6": "b", "prog01_p7": "a", "prog01_p8": "b", "prog01_p9": "b", "prog01_p10": "b", "prog01_p11": "b", "prog01_p12": "b", "prog01_p13": "b", "prog01_p14": "b", "prog01_p15": "b", "prog01_p16": "b", "prog01_p17": "b", "prog01_p18": "b", "prog01_p19": "b", "prog01_p20": "b", "prog01_p21": "b", "prog01_p22": "b", "prog01_p23": "b", "prog01_p24": "a"}	2026-09-09 01:47:28.807708
\.


--
-- Data for Name: materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materias (id, codigo, nombre, descripcion, semestre, docente_id, creada_en, numero_semanas) FROM stdin;
1	MAT-101	Álgebra Lineal 2026	Curso oficial de Álgebra Lineal (Grossman 7a/8a ed.) — Departamento de Instrumentación y Control	2026-1	2	2026-08-19 01:23:01.519174	16
2	PRG-201	Programación	Algoritmos, estructuras de datos y programación estructurada en C/C++	2026-1	2	2026-08-19 01:23:01.519174	16
3	VIS-301	Visión de Máquina	Procesamiento digital de imágenes, visión por computador e inspección visual	2026-1	2	2026-08-19 01:23:01.519174	16
4	ENF-401	Énfasis / Electivas	Procesador Nios II sobre FPGA (GPIO, USART, SPI, ADC) y Procesamiento Digital de Señales	2026-1	2	2026-08-19 01:23:01.519174	16
5	Mini Curso	IA con NodeJS	Construyendo Backend con IA en Node.js: De Cero a Producción en 2 Horas	2026-2	2	2026-08-23 01:57:03.131624	1
\.


--
-- Data for Name: preguntas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas (id, semana_id, tipo, pregunta, opciones, correcta, explicacion, falencia) FROM stdin;
s01_p1	1	teoria	¿Cuál es la interpretación geométrica de un sistema de 2 ecuaciones lineales con 2 incógnitas que NO tiene solución (inconsistente)?	[{"id": "a", "texto": "Las dos rectas coinciden en todos sus puntos."}, {"id": "b", "texto": "Las dos rectas se intersecan en un único punto."}, {"id": "c", "texto": "Las dos rectas son paralelas y no se intersecan."}, {"id": "d", "texto": "Las rectas forman un ángulo recto entre sí."}]	c	Un sistema inconsistente no posee puntos en común, lo cual geométricamente representa dos rectas paralelas distintas en R² (Propiedad "Los tres casos", semana 1, sección 2).	Interpretación geométrica de sistemas 2x2 e inconsistencia de rectas.
s01_p2	1	ejercicio	Dado el sistema de ecuaciones 2x - 3y = 7 y 4x - 6y = 14, ¿cómo se clasifica este sistema?	[{"id": "a", "texto": "Inconsistente (sin solución)."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Sistema homogéneo trivial."}]	c	La segunda ecuación es exactamente el doble de la primera (4x-6y = 2·(2x-3y) = 14), por lo que ambas representan la misma recta: hay infinitas soluciones.	Identificación de sistemas dependientes (rectas coincidentes) e infinitas soluciones.
s01_p3	1	ejercicio	Dado el sistema  x1 + x2 + x3 = 2,  2x1 - x2 + x3 = 6, ¿la tupla (x1,x2,x3) = (2,-1,1) es solución del sistema?	[{"id": "a", "texto": "Sí, satisface ambas ecuaciones."}, {"id": "b", "texto": "No, falla en la primera ecuación."}, {"id": "c", "texto": "No, falla en la segunda ecuación."}, {"id": "d", "texto": "No, falla en ambas ecuaciones."}]	a	Ecuación 1: 2+(-1)+1=2 ✓. Ecuación 2: 2(2)-(-1)+1=4+1+1=6 ✓. La tupla satisface las dos ecuaciones simultáneamente.	Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales.
s01_p4	1	teoria	En el sistema  2x1 - x2 + 3x3 = 5,  x1 + x2 - x3 = 0, ¿cuántas ecuaciones (m) e incógnitas (n) tiene, y cuál es el coeficiente a12 (coeficiente de x2 en la ecuación 1)?	[{"id": "a", "texto": "m=2, n=3, a12 = -1."}, {"id": "b", "texto": "m=3, n=2, a12 = 2."}, {"id": "c", "texto": "m=2, n=3, a12 = 3."}, {"id": "d", "texto": "m=2, n=2, a12 = -1."}]	a	El sistema tiene 2 ecuaciones (m=2) y 3 incógnitas (n=3); el coeficiente de x2 en la primera ecuación es a12=-1.	Identificación de m, n y coeficientes a_ij en la forma general de un sistema lineal.
s02_p1	2	teoria	¿Cuál de las siguientes matrices está en Forma Escalonada Reducida por Renglones (FERR / RREF)?	[{"id": "a", "texto": "[1 2 0; 0 1 3; 0 0 0]"}, {"id": "b", "texto": "[1 0 3; 0 1 -2; 0 0 0]"}, {"id": "c", "texto": "[0 1 0; 1 0 0; 0 0 1]"}, {"id": "d", "texto": "[2 0 0; 0 1 0; 0 0 1]"}]	b	En FERR, el primer elemento no nulo de cada renglón es 1 (pivote), cada pivote está a la derecha del anterior, y en la columna de cada pivote todos los demás elementos son 0. La opción (a) falla porque la columna del segundo pivote tiene un 2 en la fila 1.	Criterios de Forma Escalonada Reducida por Renglones (FERR).
s02_p2	2	teoria	Todo sistema homogéneo de ecuaciones lineales A x = 0 es siempre:	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente, teniendo al menos la solución trivial x = 0."}, {"id": "c", "texto": "Indeterminado con infinitas soluciones necesariamente."}, {"id": "d", "texto": "Insoluble si m > n."}]	b	x=0 siempre satisface A·0=0 (cada ecuación queda 0=0), por lo que un sistema homogéneo nunca puede ser inconsistente.	Propiedad de la solución trivial en sistemas homogéneos.
s02_p3	2	ejercicio	Un sistema homogéneo tiene 3 ecuaciones y 5 incógnitas (m=3 < n=5). ¿Qué se puede afirmar sobre sus soluciones?	[{"id": "a", "texto": "Tiene solución única (la trivial)."}, {"id": "b", "texto": "Tiene infinitas soluciones no triviales (existen variables libres)."}, {"id": "c", "texto": "No tiene solución."}, {"id": "d", "texto": "El sistema es inconsistente."}]	b	Por el teorema de sistemas homogéneos con más incógnitas que ecuaciones (m<n), el rango r ≤ m < n, así que siempre hay al menos n-r variables libres y por tanto soluciones no triviales.	Teorema de sistemas homogéneos con m < n (soluciones no triviales garantizadas).
s02_p4	2	ejercicio	Al aplicar Gauss-Jordan a un sistema 3x3 se obtiene la matriz aumentada [1 0 2 | 5; 0 1 -1 | 3; 0 0 0 | 0]. ¿Cuál es la solución general?	[{"id": "a", "texto": "x = 5 - 2z, y = 3 + z, con z libre."}, {"id": "b", "texto": "x = 5 + 2z, y = 3 - z, con z libre."}, {"id": "c", "texto": "x = 5, y = 3, z = 0."}, {"id": "d", "texto": "Sistema inconsistente."}]	a	De la fila 1: x + 2z = 5 => x = 5 - 2z. De la fila 2: y - z = 3 => y = 3 + z, con z como variable libre (fila 3 es 0=0, no hay contradicción).	Parametrización de soluciones infinitas a partir de la forma escalonada reducida.
s01_p5	1	teoria	¿Cuál de las siguientes ecuaciones ES una ecuación lineal en sus variables?	[{"id": "a", "texto": "3x + 2y - xy = 5"}, {"id": "b", "texto": "x1 - 2x2 + 5x3 = 7"}, {"id": "c", "texto": "sqrt(x) + y = 3"}, {"id": "d", "texto": "1/x + y = 2"}]	b	En una ecuación lineal ninguna variable aparece elevada a potencia distinta de 1, multiplicada por otra variable, ni dentro de una función no lineal. (a) tiene el producto xy, (c) tiene una raíz, (d) tiene 1/x: ninguna es lineal. Solo (b) cumple la definición.	Identificación de ecuación lineal vs. no lineal.
s01_p6	1	teoria	¿Cuál de las siguientes ecuaciones NO es lineal?	[{"id": "a", "texto": "4x1 - x2 + 0x3 = 9"}, {"id": "b", "texto": "x1 x2 - 3x3 = 1"}, {"id": "c", "texto": "-x1 + 2x2 - x3 = 0"}, {"id": "d", "texto": "0.5x1 + x2 = 7"}]	b	El término x1 x2 multiplica dos variables entre sí, lo cual viola la definición de linealidad aunque el resto de la ecuación luzca simple. Las opciones (a), (c) y (d) sí son lineales.	Reconocer términos no lineales (productos de variables) en una ecuación.
s01_p7	1	teoria	Dado el sistema  x1 - 2x2 + 4x3 = 7,  3x1 + x2 - x3 = -2, ¿cuántas ecuaciones (m), cuántas incógnitas (n) tiene, y cuál es el coeficiente a21 (coeficiente de x1 en la ecuación 2)?	[{"id": "a", "texto": "m=2, n=3, a21 = 3."}, {"id": "b", "texto": "m=3, n=2, a21 = -2."}, {"id": "c", "texto": "m=2, n=3, a21 = -1."}, {"id": "d", "texto": "m=2, n=2, a21 = 3."}]	a	El sistema tiene 2 ecuaciones (m=2) y 3 incógnitas (n=3); a21 es el coeficiente de x1 en la ecuación 2, que vale 3.	Identificación de m, n y coeficientes a_ij en la forma general de un sistema lineal.
s01_p8	1	teoria	Dado el sistema  2x1 + 3x2 - x3 = -5,  -x1 + x2 + 4x3 = 8, ¿cuáles son los términos independientes b1 y b2?	[{"id": "a", "texto": "b1 = -5, b2 = 8."}, {"id": "b", "texto": "b1 = 2, b2 = -1."}, {"id": "c", "texto": "b1 = 8, b2 = -5."}, {"id": "d", "texto": "b1 = -5, b2 = 4."}]	a	El término independiente de cada ecuación es el valor a la derecha del signo igual: b1=-5 (ecuación 1) y b2=8 (ecuación 2).	Identificación del término independiente en la forma general de un sistema.
s01_p9	1	teoria	Un sistema "consistente determinado" tiene:	[{"id": "a", "texto": "Ninguna solución."}, {"id": "b", "texto": "Exactamente una solución."}, {"id": "c", "texto": "Infinitas soluciones."}, {"id": "d", "texto": "Exactamente dos soluciones."}]	b	Consistente significa que tiene al menos una solución, y determinado significa que esa solución es única: juntos, exactamente una solución.	Terminología: consistente/inconsistente, determinado/indeterminado.
s01_p10	1	teoria	¿Puede un sistema de ecuaciones lineales tener exactamente 2 soluciones distintas (ni una, ni infinitas)?	[{"id": "a", "texto": "Sí, siempre que el sistema sea 2x2."}, {"id": "b", "texto": "No: un sistema lineal consistente tiene una única solución o infinitas, nunca un número finito mayor que uno."}, {"id": "c", "texto": "Sí, si las dos rectas son paralelas."}, {"id": "d", "texto": "Sí, si el sistema es homogéneo."}]	b	Es una propiedad general de los sistemas lineales (ya observable en el caso 2x2): el conjunto solución es vacío, un único punto, o infinito — nunca un número finito mayor que uno.	Por qué un sistema lineal nunca tiene un número finito de soluciones mayor que 1.
s01_p11	1	ejercicio	Dado el sistema  x1 - x2 + 2x3 = 3,  2x1 + x2 - x3 = 4, ¿la tupla (x1,x2,x3) = (1,0,1) es solución?	[{"id": "a", "texto": "Sí, satisface ambas ecuaciones."}, {"id": "b", "texto": "No, falla en la primera ecuación."}, {"id": "c", "texto": "No, falla en la segunda ecuación."}, {"id": "d", "texto": "No, falla en ambas ecuaciones."}]	c	Ecuación 1: 1-0+2(1)=3 ✓. Ecuación 2: 2(1)+0-1=1, pero debería dar 4: no se cumple. Falla solo en la segunda ecuación.	Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales.
s01_p12	1	ejercicio	Dado el sistema  3x + y = 11,  x - 2y = -1, ¿la tupla (x,y) = (3,2) es solución?	[{"id": "a", "texto": "Sí, satisface ambas ecuaciones."}, {"id": "b", "texto": "No, falla en la primera ecuación."}, {"id": "c", "texto": "No, falla en la segunda ecuación."}, {"id": "d", "texto": "No, falla en ambas ecuaciones."}]	a	Ecuación 1: 3(3)+2=11 ✓. Ecuación 2: 3-2(2)=3-4=-1 ✓. La tupla satisface ambas ecuaciones.	Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales.
s01_p13	1	ejercicio	Dado el sistema  x + y = 4,  2x - y = 1, ¿la tupla (x,y) = (0,0) es solución?	[{"id": "a", "texto": "Sí, satisface ambas ecuaciones."}, {"id": "b", "texto": "No, falla en la primera ecuación."}, {"id": "c", "texto": "No, falla en la segunda ecuación."}, {"id": "d", "texto": "No, falla en ambas ecuaciones."}]	d	Ecuación 1: 0+0=0, debería dar 4: no se cumple. Ecuación 2: 2(0)-0=0, debería dar 1: tampoco se cumple. Falla en ambas.	Verificar si una n-tupla dada es solución de un sistema de ecuaciones lineales.
s01_p14	1	ejercicio	Dado el sistema  3x - 6y = 9,  x - 2y = 3, ¿cómo se clasifica?	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Sistema homogéneo."}]	c	La primera ecuación es exactamente 3 veces la segunda (3(x-2y)=3x-6y y 3(3)=9): representan la misma recta, así que hay infinitas soluciones.	Identificación de sistemas dependientes (rectas coincidentes) e infinitas soluciones.
s01_p15	1	ejercicio	Dado el sistema  4x + 2y = 6,  6x + 3y = 5, ¿cómo se clasifica?	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Sistema homogéneo."}]	a	Los coeficientes son proporcionales (4/6 = 2/3 = 2/3), pero los términos independientes no lo están (6/5 ≠ 2/3): las rectas son paralelas distintas, el sistema es inconsistente.	Identificación de rectas paralelas distintas (sistema inconsistente).
s01_p16	1	ejercicio	Dado el sistema  2x + y = 5,  x - y = 1, ¿cómo se clasifica (sin resolverlo)?	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Sistema homogéneo."}]	b	Las pendientes son distintas (-2 en la primera recta, 1 en la segunda), así que las rectas son secantes y se cortan en un único punto: solución única.	Clasificación de un sistema 2x2 por comparación de pendientes.
s01_p17	1	ejercicio	Resolver por eliminación el sistema  x + y = 5,  2x - y = 1.	[{"id": "a", "texto": "(x,y) = (2,3)."}, {"id": "b", "texto": "(x,y) = (3,2)."}, {"id": "c", "texto": "(x,y) = (1,4)."}, {"id": "d", "texto": "(x,y) = (4,1)."}]	a	Sumando ambas ecuaciones: 3x=6, x=2; sustituyendo en la primera, y=3. Verificación en la segunda: 2(2)-3=1 ✓.	Resolución de sistemas 2x2 por el método de eliminación.
s01_p18	1	ejercicio	Resolver por sustitución el sistema  3x - y = 5,  x + 2y = 4.	[{"id": "a", "texto": "(x,y) = (2,1)."}, {"id": "b", "texto": "(x,y) = (1,2)."}, {"id": "c", "texto": "(x,y) = (4,-4)."}, {"id": "d", "texto": "(x,y) = (-2,7)."}]	a	De la segunda ecuación: x = 4-2y. Sustituyendo en la primera: 3(4-2y)-y=5 => 12-7y=5 => y=1, y entonces x=2. Verificación: 3(2)-1=5 ✓.	Resolución de sistemas 2x2 por el método de sustitución.
s01_p19	1	ejercicio	Resolver por sustitución el sistema  2x + 3y = 12,  x - y = 1.	[{"id": "a", "texto": "(x,y) = (3,2)."}, {"id": "b", "texto": "(x,y) = (2,3)."}, {"id": "c", "texto": "(x,y) = (6,0)."}, {"id": "d", "texto": "(x,y) = (0,4)."}]	a	De la segunda ecuación: x = 1+y. Sustituyendo en la primera: 2(1+y)+3y=12 => 5y=10 => y=2, y entonces x=3. Verificación: 2(3)+3(2)=12 ✓.	Resolución de sistemas 2x2 por el método de sustitución.
s01_p20	1	ejercicio	Al intentar resolver por sustitución el sistema  x - y = 2,  2x - 2y = 7, se llega a la ecuación 4=7. ¿Qué significa esto?	[{"id": "a", "texto": "x=3, y=1."}, {"id": "b", "texto": "x=2, y=0."}, {"id": "c", "texto": "El sistema no tiene solución: se llegó a una contradicción."}, {"id": "d", "texto": "Infinitas soluciones parametrizadas por y."}]	c	De la primera ecuación x=2+y; al sustituir en la segunda se obtiene 2(2+y)-2y=7 => 4=7, una contradicción. Eso significa que el sistema es inconsistente (las rectas son paralelas distintas).	Reconocer una contradicción algebraica como evidencia de sistema inconsistente.
s01_p21	1	teoria	Dos rectas con la misma pendiente pero distinto intercepto (no coinciden) se llaman:	[{"id": "a", "texto": "Secantes."}, {"id": "b", "texto": "Paralelas distintas."}, {"id": "c", "texto": "Coincidentes."}, {"id": "d", "texto": "Perpendiculares."}]	b	Misma pendiente pero distinto intercepto significa que nunca se cruzan: son paralelas distintas, y el sistema asociado es inconsistente.	Interpretación geométrica de rectas paralelas distintas.
s01_p22	1	teoria	Si un sistema 2x2 tiene solución única, geométricamente las dos rectas son:	[{"id": "a", "texto": "Paralelas."}, {"id": "b", "texto": "Coincidentes."}, {"id": "c", "texto": "Secantes (se cortan en un único punto)."}, {"id": "d", "texto": "No existen como rectas."}]	c	Solución única significa un único punto que satisface ambas ecuaciones a la vez: geométricamente, las rectas se cortan en ese único punto (son secantes).	Interpretación geométrica de la solución única de un sistema 2x2.
s01_p23	1	ejercicio	Un circuito de dos mallas produce el sistema (corrientes en amperios)  3I1 - I2 = 5,  -I1 + 4I2 = 0. ¿Cuál es el valor de I1?	[{"id": "a", "texto": "I1 = 20/11 A."}, {"id": "b", "texto": "I1 = 5/11 A."}, {"id": "c", "texto": "I1 = 11/20 A."}, {"id": "d", "texto": "I1 = 1 A."}]	a	De la segunda ecuación: I1 = 4I2. Sustituyendo en la primera: 3(4I2)-I2=5 => 11I2=5 => I2=5/11, y entonces I1=4(5/11)=20/11 A.	Traducir y resolver un sistema de ecuaciones a partir de la ley de voltajes de Kirchhoff.
s01_p24	1	ejercicio	Se mezclan x litros de una solución al 20% de sal con y litros de una solución al 50% de sal para obtener 30 litros de una mezcla al 30%. ¿Cuántos litros de cada una se necesitan?	[{"id": "a", "texto": "x = 20 L, y = 10 L."}, {"id": "b", "texto": "x = 10 L, y = 20 L."}, {"id": "c", "texto": "x = 15 L, y = 15 L."}, {"id": "d", "texto": "x = 25 L, y = 5 L."}]	a	El sistema es x+y=30 (volumen total) y 0.2x+0.5y=0.3(30)=9 (balance de sal). De la primera, x=30-y; sustituyendo: 0.2(30-y)+0.5y=9 => 0.3y=3 => y=10, x=20.	Traducir un problema de mezclas a un sistema de ecuaciones lineales y resolverlo.
s01_p25	1	ejercicio	Para el sistema  x + 2y = 4,  2x + ky = 9, ¿qué valor de k hace que el sistema sea inconsistente (sin solución)?	[{"id": "a", "texto": "k = 4."}, {"id": "b", "texto": "k = 2."}, {"id": "c", "texto": "k = 8."}, {"id": "d", "texto": "Ningún valor de k lo hace inconsistente."}]	a	Para que las rectas sean paralelas se necesita 1/2 = 2/k, es decir k=4. Con k=4 los términos independientes no guardan la misma proporción (4/9 ≠ 1/2), así que las rectas son paralelas distintas: el sistema es inconsistente.	Determinar un parámetro que hace inconsistente un sistema 2x2.
s01_p26	1	ejercicio	Para el sistema  x - 3y = 2,  kx - 9y = 6, ¿qué valor de k hace que el sistema tenga infinitas soluciones?	[{"id": "a", "texto": "k = 3."}, {"id": "b", "texto": "k = -3."}, {"id": "c", "texto": "k = 9."}, {"id": "d", "texto": "k = 6."}]	a	Con k=3, la segunda ecuación es exactamente 3 veces la primera (3x-9y=6 equivale a x-3y=2): representan la misma recta, así que hay infinitas soluciones.	Determinar un parámetro que hace indeterminado (rectas coincidentes) un sistema 2x2.
s01_p27	1	ejercicio	Calcular la distancia entre la recta  3x - 4y = 12  y el punto (2,1).	[{"id": "a", "texto": "2."}, {"id": "b", "texto": "10."}, {"id": "c", "texto": "0.4."}, {"id": "d", "texto": "5."}]	a	Forma general: 3x-4y-12=0, con A=3, B=-4, C=-12. d = |3(2)-4(1)-12| / sqrt(3²+(-4)²) = |-10|/5 = 2.	Cálculo de la distancia de un punto a una recta con la fórmula d=|Ax+By+C|/sqrt(A²+B²).
s01_p28	1	ejercicio	Calcular la distancia entre la recta  x + y = 0  y el punto (3,3).	[{"id": "a", "texto": "3·sqrt(2) (≈4.24)."}, {"id": "b", "texto": "6."}, {"id": "c", "texto": "3."}, {"id": "d", "texto": "sqrt(2)."}]	a	Forma general: x+y-0=0, con A=1, B=1, C=0. d = |1(3)+1(3)+0| / sqrt(1²+1²) = 6/sqrt(2) = 3·sqrt(2).	Cálculo de la distancia de un punto a una recta con la fórmula d=|Ax+By+C|/sqrt(A²+B²).
s01_p29	1	teoria	La fórmula de distancia de un punto a una recta, d = |Ax1+By1+C|/sqrt(A²+B²), se fundamenta geométricamente en:	[{"id": "a", "texto": "El teorema de Pitágoras aplicado a un triángulo cualquiera."}, {"id": "b", "texto": "La proyección del vector desde un punto de la recta hasta P sobre la dirección normal a la recta."}, {"id": "c", "texto": "La ley de voltajes de Kirchhoff."}, {"id": "d", "texto": "El algoritmo de Gauss-Jordan."}]	b	La distancia mínima de un punto a una recta es la longitud de la proyección de un vector hacia ese punto sobre la dirección normal (perpendicular) de la recta, lo que da lugar exactamente a esa fórmula.	Fundamento geométrico de la fórmula de distancia punto-recta.
s02_p5	2	teoria	¿Cuál de las siguientes NO es una operación elemental de fila válida en la eliminación de Gauss-Jordan?	[{"id": "a", "texto": "Intercambiar dos filas."}, {"id": "b", "texto": "Multiplicar una fila por un escalar distinto de cero."}, {"id": "c", "texto": "Sumar a una fila un múltiplo escalar de otra fila."}, {"id": "d", "texto": "Elevar al cuadrado todos los elementos de una fila."}]	d	Las únicas tres operaciones elementales válidas son intercambiar filas, escalar una fila por una constante no nula, y sumar a una fila un múltiplo de otra. Elevar al cuadrado no es una operación elemental: no preserva el conjunto solución.	Identificación de las operaciones elementales de fila válidas.
s02_p6	2	teoria	Si se multiplica una fila de la matriz aumentada por 0, ¿qué ocurre?	[{"id": "a", "texto": "Se obtiene un sistema equivalente al original."}, {"id": "b", "texto": "Se pierde información: la operación NO es válida porque el escalar debe ser distinto de cero."}, {"id": "c", "texto": "El sistema se vuelve homogéneo."}, {"id": "d", "texto": "No cambia nada."}]	b	La operación elemental de escalar una fila exige un escalar c≠0; multiplicar por 0 destruye la ecuación (la reemplaza por 0=0) y NO preserva el conjunto solución, así que no es una operación elemental válida.	Condición c≠0 en la operación elemental de escalar una fila.
s02_p7	2	teoria	Dos sistemas de ecuaciones lineales son equivalentes si:	[{"id": "a", "texto": "Tienen el mismo número de ecuaciones."}, {"id": "b", "texto": "Tienen exactamente el mismo conjunto de soluciones, aunque sus ecuaciones sean distintas."}, {"id": "c", "texto": "Tienen la misma matriz de coeficientes."}, {"id": "d", "texto": "Ambos son homogéneos."}]	b	La equivalencia entre sistemas se define por el conjunto solución, no por la forma de las ecuaciones: dos sistemas pueden verse muy distintos y ser equivalentes si toda solución de uno es solución del otro.	Definición de sistemas equivalentes.
s02_p8	2	ejercicio	Sobre la matriz aumentada  [1 2 | 5; 3 1 | 4]  se aplica la operación F2 <- F2 - 3F1. ¿Cuál es la nueva fila 2?	[{"id": "a", "texto": "[0  -5 | -11]"}, {"id": "b", "texto": "[3  1 | 4]"}, {"id": "c", "texto": "[0  -5 | 4]"}, {"id": "d", "texto": "[3  -5 | -11]"}]	a	F2 - 3F1 = [3-3(1), 1-3(2) | 4-3(5)] = [0, 1-6 | 4-15] = [0, -5 | -11].	Aplicar una operación elemental de fila (combinación lineal de filas) sobre la matriz aumentada.
s02_p9	2	teoria	Una fila de la forma  [0 0 0 | 5]  en la matriz aumentada escalonada indica que el sistema es:	[{"id": "a", "texto": "Consistente determinado."}, {"id": "b", "texto": "Consistente indeterminado."}, {"id": "c", "texto": "Inconsistente."}, {"id": "d", "texto": "Homogéneo."}]	c	La fila [0 0 0 | 5] representa la ecuación 0=5, una contradicción: el sistema no tiene ninguna solución, es inconsistente.	Detección de inconsistencia a partir de una fila contradictoria.
s02_p10	2	ejercicio	Al reducir la matriz aumentada de un sistema se obtiene  [1 0 2 | 3; 0 1 -1 | 4; 0 0 0 | 0]. ¿Cómo es el sistema?	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente con solución única."}, {"id": "c", "texto": "Consistente con infinitas soluciones (una variable libre)."}, {"id": "d", "texto": "No hay suficiente información para decidir."}]	c	La fila 3 es 0=0 (no hay contradicción). El rango es r=2 y hay n=3 incógnitas, así que hay n-r=1 variable libre: infinitas soluciones.	Clasificar un sistema a partir de su forma escalonada reducida.
s02_p11	2	ejercicio	Al reducir un sistema 3x3 aparece en algún paso la fila  [0 0 0 | -2]. ¿Qué se puede concluir de inmediato, sin seguir reduciendo?	[{"id": "a", "texto": "El sistema tiene infinitas soluciones."}, {"id": "b", "texto": "El sistema es inconsistente: no hace falta seguir reduciendo."}, {"id": "c", "texto": "El sistema tiene solución única."}, {"id": "d", "texto": "Falta más información para decidir."}]	b	Esa fila representa 0=-2, una contradicción irreversible: en cuanto aparece, el sistema queda determinado como inconsistente sin importar el resto de la matriz.	Detección temprana de inconsistencia durante la reducción.
s02_p12	2	teoria	Sea r el número de pivotes de la matriz aumentada [A|b] y r' el número de pivotes de A sola. El sistema es inconsistente cuando:	[{"id": "a", "texto": "r = r' = n."}, {"id": "b", "texto": "r' < r."}, {"id": "c", "texto": "r' > r."}, {"id": "d", "texto": "r = n."}]	b	Si r'<r, hay un pivote adicional en la columna de b, es decir, una fila del tipo [0...0|c] con c≠0: eso es exactamente una contradicción.	Teorema de número de soluciones a partir del rango de A y de [A|b].
s02_p13	2	teoria	Un sistema consistente con r = n (número de pivotes igual al número de incógnitas) tiene:	[{"id": "a", "texto": "Infinitas soluciones."}, {"id": "b", "texto": "Solución única."}, {"id": "c", "texto": "Ninguna solución."}, {"id": "d", "texto": "Depende del valor de m."}]	b	Si r=n no quedan variables libres (cada incógnita tiene su propio pivote), así que la solución queda completamente determinada: es única.	Teorema de número de soluciones: r=n implica solución única.
s02_p14	2	teoria	¿Cuál es la diferencia principal entre la eliminación gaussiana (forma escalonada) y la eliminación de Gauss-Jordan (forma escalonada reducida)?	[{"id": "a", "texto": "Gauss-Jordan no requiere pivotes."}, {"id": "b", "texto": "Gauss-Jordan continúa hasta hacer cero también los elementos arriba de cada pivote, evitando la sustitución hacia atrás; la eliminación gaussiana se detiene en forma escalonada y requiere sustitución hacia atrás."}, {"id": "c", "texto": "Son exactamente el mismo algoritmo con nombres distintos."}, {"id": "d", "texto": "Gauss-Jordan solo aplica a sistemas homogéneos."}]	b	Ambos métodos usan las mismas operaciones elementales; la diferencia es hasta dónde se reduce la matriz: Gauss-Jordan llega a RREF (sin sustitución hacia atrás), la gaussiana se detiene antes y requiere ese paso final.	Diferencia entre eliminación gaussiana y eliminación de Gauss-Jordan.
s02_p15	2	ejercicio	¿Cuál matriz está en forma escalonada (no necesariamente reducida) pero NO en forma escalonada reducida (RREF)?	[{"id": "a", "texto": "[1 0 0; 0 1 0; 0 0 1]"}, {"id": "b", "texto": "[1 3 2; 0 1 -1; 0 0 1]"}, {"id": "c", "texto": "[1 0 0; 0 1 0; 0 0 0]"}, {"id": "d", "texto": "[0 0 0; 0 0 0; 0 0 0]"}]	b	En (b) los pivotes están correctamente escalonados, pero hay elementos no nulos arriba de los pivotes (3 y 2 en la fila 1, -1 en la fila 2): no es RREF. En (a), (c) y (d) sí se cumple la condición de RREF.	Distinguir forma escalonada de forma escalonada reducida (RREF).
s02_p16	2	ejercicio	Resolver por Gauss-Jordan el sistema  x + y = 7,  x - y = 1.	[{"id": "a", "texto": "(x,y) = (4,3)."}, {"id": "b", "texto": "(x,y) = (3,4)."}, {"id": "c", "texto": "(x,y) = (7,1)."}, {"id": "d", "texto": "(x,y) = (1,7)."}]	a	Sumando ambas ecuaciones: 2x=8, x=4; sustituyendo, y=3. Verificación: 4-3=1 ✓.	Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan.
s02_p17	2	ejercicio	Resolver por Gauss-Jordan el sistema  x1 + x2 = 4,  x1 - x2 = 2.	[{"id": "a", "texto": "x1 = 3, x2 = 1."}, {"id": "b", "texto": "x1 = 1, x2 = 3."}, {"id": "c", "texto": "x1 = 4, x2 = 0."}, {"id": "d", "texto": "x1 = 2, x2 = 2."}]	a	Sumando ambas ecuaciones: 2x1=6, x1=3; sustituyendo, x2=1. Verificación: 3-1=2 ✓.	Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan.
s02_p18	2	ejercicio	Resolver por Gauss-Jordan el sistema  x1+x2+x3=6,  x1-x2+2x3=5,  2x1+x2-x3=1.	[{"id": "a", "texto": "(x1,x2,x3) = (1,2,3)."}, {"id": "b", "texto": "(x1,x2,x3) = (3,2,1)."}, {"id": "c", "texto": "(x1,x2,x3) = (2,1,3)."}, {"id": "d", "texto": "(x1,x2,x3) = (1,3,2)."}]	a	Reduciendo el sistema (por ejemplo eliminando x1 de las ecuaciones 2 y 3, luego x2 de la 3) se obtiene x3=3, y por sustitución hacia atrás x2=2 y x1=1. Verificación en las tres ecuaciones: 1+2+3=6, 1-2+6=5, 2+2-3=1, todas correctas.	Resolución de un sistema 3x3 con solución única mediante Gauss-Jordan.
s02_p19	2	ejercicio	El sistema  x1+2x2-x3=5,  2x1+4x2-2x3=10  (la segunda ecuación es el doble de la primera). ¿Cuál es su solución general?	[{"id": "a", "texto": "x1 = 5-2s+t, x2 = s, x3 = t, con s,t libres."}, {"id": "b", "texto": "x1 = 5+2s-t, x2 = s, x3 = t, con s,t libres."}, {"id": "c", "texto": "x1=5, x2=0, x3=0 (solución única)."}, {"id": "d", "texto": "El sistema es inconsistente."}]	a	Al ser la segunda ecuación múltiplo de la primera, el rango es r=1 con n=3 incógnitas: hay n-r=2 variables libres. Tomando x2=s, x3=t libres, de la primera ecuación x1 = 5-2s+t.	Parametrización de la solución general cuando hay variables libres.
s02_p20	2	ejercicio	Al reducir la matriz aumentada  [1 -1 3 | 2; 2 -2 6 | 4; 1 0 1 | 3]  se observa que la fila 2 es exactamente el doble de la fila 1. ¿Cuántas variables libres tiene este sistema 3x3?	[{"id": "a", "texto": "0."}, {"id": "b", "texto": "1."}, {"id": "c", "texto": "2."}, {"id": "d", "texto": "3."}]	b	La fila 2 es redundante (2 veces la fila 1), así que solo hay 2 ecuaciones realmente independientes (filas 1 y 3) para 3 incógnitas: rango r=2, variables libres = n-r = 3-2 = 1.	Reconocer ecuaciones redundantes y contar variables libres.
s02_p21	2	ejercicio	Un circuito de tres mallas produce el sistema (corrientes en amperios)  2I1-I2=5,  -I1+3I2-I3=0,  -I2+2I3=1. ¿Cuál es el valor de I2?	[{"id": "a", "texto": "I2 = 3/2 A."}, {"id": "b", "texto": "I2 = 13/4 A."}, {"id": "c", "texto": "I2 = 5/4 A."}, {"id": "d", "texto": "I2 = 1 A."}]	a	Resolviendo el sistema (por sustitución o Gauss-Jordan) se obtiene I1=13/4 A, I2=3/2 A, I3=5/4 A. El valor pedido es I2=3/2 A.	Resolución de un sistema 3x3 de corrientes de malla (ley de voltajes de Kirchhoff).
s02_p22	2	ejercicio	Un circuito de dos mallas produce el sistema  3I1-I2=6,  -I1+2I2=1. ¿Cuál es el valor de I1?	[{"id": "a", "texto": "I1 = 13/5 A."}, {"id": "b", "texto": "I1 = 9/5 A."}, {"id": "c", "texto": "I1 = 6/5 A."}, {"id": "d", "texto": "I1 = 1 A."}]	a	De la segunda ecuación: I1=2I2-1. Sustituyendo en la primera: 3(2I2-1)-I2=6 => 5I2=9 => I2=9/5, y entonces I1=2(9/5)-1=13/5 A.	Resolución de un sistema 2x2 de corrientes de malla (ley de voltajes de Kirchhoff).
s02_p23	2	teoria	La solución trivial de un sistema homogéneo Ax=0 es:	[{"id": "a", "texto": "x = (1,1,...,1)."}, {"id": "b", "texto": "x = (0,0,...,0)."}, {"id": "c", "texto": "Cualquier solución no nula."}, {"id": "d", "texto": "No siempre existe."}]	b	x=0 satisface A·0=0 en cada ecuación (0=0), así que el vector cero siempre es solución de todo sistema homogéneo: es la solución trivial.	Definición de solución trivial en sistemas homogéneos.
s02_p24	2	teoria	Un sistema homogéneo tiene soluciones no triviales si y solo si:	[{"id": "a", "texto": "El número de pivotes r es igual a n."}, {"id": "b", "texto": "El número de pivotes r es menor que n (hay al menos una variable libre)."}, {"id": "c", "texto": "m > n."}, {"id": "d", "texto": "El sistema es inconsistente."}]	b	Si r<n hay al menos una variable libre, que puede tomar cualquier valor distinto de cero y generar soluciones no triviales. Si r=n, la única solución es la trivial. (Un sistema homogéneo nunca es inconsistente.)	Condición para la existencia de soluciones no triviales en un sistema homogéneo.
s02_p25	2	ejercicio	Resolver el sistema homogéneo  x1-2x2+x3=0,  2x1-4x2+2x3=0  (la segunda es el doble de la primera).	[{"id": "a", "texto": "x1=2s-t, x2=s, x3=t, con s,t libres."}, {"id": "b", "texto": "x1=2s+t, x2=s, x3=t, con s,t libres."}, {"id": "c", "texto": "Solo la solución trivial (0,0,0)."}, {"id": "d", "texto": "El sistema es inconsistente."}]	a	Al ser la segunda ecuación múltiplo de la primera, r=1 y n=3: hay 2 variables libres, x2=s y x3=t. De la primera ecuación: x1 = 2x2-x3 = 2s-t.	Resolución de un sistema homogéneo con variables libres.
s02_p26	2	teoria	Un sistema homogéneo tiene m=4 ecuaciones y n=4 incógnitas, y su matriz de coeficientes A tiene 4 pivotes tras reducirla. ¿Tiene soluciones no triviales?	[{"id": "a", "texto": "Sí, siempre."}, {"id": "b", "texto": "No: r=n=4, no hay variables libres, así que la única solución es la trivial."}, {"id": "c", "texto": "Sí, porque m=n."}, {"id": "d", "texto": "No se puede determinar con esta información."}]	b	Con r=n=4 no queda ninguna variable libre: la única solución del sistema homogéneo es la trivial x=0.	Aplicar el criterio r=n (sin variables libres) a un sistema homogéneo concreto.
s02_p27	2	ejercicio	En el sistema  x+ky=1,  kx+y=1, ¿qué ocurre cuando k=-1?	[{"id": "a", "texto": "El sistema es inconsistente (se llega a 0=2)."}, {"id": "b", "texto": "Infinitas soluciones."}, {"id": "c", "texto": "Solución única x=y=1/2."}, {"id": "d", "texto": "Solución única x=y=-1."}]	a	Reduciendo la matriz aumentada se obtiene la fila 2 = [0, 1-k² | 1-k]. Con k=-1: 1-k²=0 y 1-k=2, así que la fila queda [0 0 | 2], es decir 0=2: contradicción, sistema inconsistente.	Discusión de un sistema 2x2 con parámetro k: caso inconsistente.
s02_p28	2	ejercicio	En el sistema  x+ky=1,  kx+y=1, ¿qué ocurre cuando k=1?	[{"id": "a", "texto": "Infinitas soluciones: x+y=1."}, {"id": "b", "texto": "El sistema es inconsistente."}, {"id": "c", "texto": "Solución única (1,0)."}, {"id": "d", "texto": "Solo la solución trivial."}]	a	Con k=1, la fila 2 = [0, 1-k² | 1-k] = [0 0 | 0], es decir 0=0 (sin contradicción): queda solo la ecuación x+y=1, con infinitas soluciones.	Discusión de un sistema 2x2 con parámetro k: caso de infinitas soluciones.
s02_p29	2	teoria	En el contexto de la eliminación de Gauss-Jordan, el "rango" de una matriz se define como:	[{"id": "a", "texto": "El número de columnas de la matriz."}, {"id": "b", "texto": "El número de filas no nulas (pivotes) en su forma escalonada."}, {"id": "c", "texto": "El número de incógnitas del sistema."}, {"id": "d", "texto": "El valor del término independiente más grande."}]	b	El rango de una matriz es el número de pivotes (filas no nulas) que quedan al llevarla a forma escalonada; este número determina si un sistema es inconsistente, tiene solución única, o infinitas soluciones.	Definición de rango de una matriz.
s01_p30	1	ejercicio	Resolver por eliminación el sistema  x + 2y = 7,  x - y = 1.	[{"id": "a", "texto": "(x,y) = (3,2)."}, {"id": "b", "texto": "(x,y) = (2,3)."}, {"id": "c", "texto": "(x,y) = (5,1)."}, {"id": "d", "texto": "(x,y) = (1,3)."}]	a	De la segunda ecuación x=1+y. Sustituyendo en la primera: 1+y+2y=7 => 3y=6 => y=2, y entonces x=3. Verificación: 3-2=1 ✓.	Resolución de sistemas 2x2 por sustitución/eliminación.
s01_p31	1	ejercicio	Resolver por sustitución el sistema  4x - y = 10,  x + y = 5.	[{"id": "a", "texto": "(x,y) = (3,2)."}, {"id": "b", "texto": "(x,y) = (2,3)."}, {"id": "c", "texto": "(x,y) = (4,1)."}, {"id": "d", "texto": "(x,y) = (1,4)."}]	a	De la segunda ecuación y=5-x. Sustituyendo en la primera: 4x-(5-x)=10 => 5x-5=10 => x=3, y entonces y=2. Verificación: 12-2=10 ✓.	Resolución de sistemas 2x2 por sustitución/eliminación.
s01_p32	1	ejercicio	Clasificar el sistema  5x - 2y = 8,  -10x + 4y = -16.	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Homogéneo."}]	c	La segunda ecuación es exactamente -2 veces la primera (-2(5x-2y)=-10x+4y y -2(8)=-16): representan la misma recta, infinitas soluciones.	Clasificación de sistemas 2x2 por proporcionalidad de coeficientes.
s01_p33	1	ejercicio	Clasificar el sistema  3x + y = 4,  6x + 2y = 9.	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Homogéneo."}]	a	Los coeficientes son proporcionales (3/6 = 1/2), pero los términos independientes no lo están (4/9 ≠ 1/2): rectas paralelas distintas, sistema inconsistente.	Clasificación de sistemas 2x2 por proporcionalidad de coeficientes.
s01_p34	1	ejercicio	Clasificar (sin resolver) el sistema  x - y = 3,  x + y = 7.	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Homogéneo."}]	b	Las pendientes son distintas (1 y -1): las rectas se cortan en un único punto.	Clasificación de sistemas 2x2 por comparación de pendientes.
s01_p35	1	ejercicio	Dado el sistema  x + y = 10,  2x - y = 5, ¿la tupla (x,y) = (5,5) es solución?	[{"id": "a", "texto": "Sí, satisface ambas ecuaciones."}, {"id": "b", "texto": "No, falla en la primera ecuación."}, {"id": "c", "texto": "No, falla en la segunda ecuación."}, {"id": "d", "texto": "No, falla en ambas ecuaciones."}]	a	Ecuación 1: 5+5=10 ✓. Ecuación 2: 2(5)-5=5 ✓. La tupla satisface ambas ecuaciones.	Verificar si una tupla dada es solución de un sistema de ecuaciones lineales.
s01_p36	1	ejercicio	Dado el sistema  x + y = 10,  2x - y = 5, ¿la tupla (x,y) = (3,7) es solución?	[{"id": "a", "texto": "Sí, satisface ambas ecuaciones."}, {"id": "b", "texto": "No, falla en la primera ecuación."}, {"id": "c", "texto": "No, falla en la segunda ecuación."}, {"id": "d", "texto": "No, falla en ambas ecuaciones."}]	c	Ecuación 1: 3+7=10 ✓. Ecuación 2: 2(3)-7=-1, debería dar 5: no se cumple. Falla solo en la segunda ecuación.	Verificar si una tupla dada es solución de un sistema de ecuaciones lineales.
s01_p37	1	ejercicio	Para el sistema  2x + ky = 6,  x + 3y = 3, ¿qué valor de k produce infinitas soluciones?	[{"id": "a", "texto": "k = 6."}, {"id": "b", "texto": "k = 3."}, {"id": "c", "texto": "k = 2."}, {"id": "d", "texto": "k = -6."}]	a	Con k=6, la segunda ecuación multiplicada por 2 da 2x+6y=6, idéntica a la primera: misma recta, infinitas soluciones.	Determinar un parámetro que hace indeterminado un sistema 2x2.
s01_p38	1	ejercicio	Para el sistema  x + 2y = 5,  3x + ky = 10, ¿qué valor de k lo hace inconsistente?	[{"id": "a", "texto": "k = 6."}, {"id": "b", "texto": "k = 3."}, {"id": "c", "texto": "k = 1/6."}, {"id": "d", "texto": "Ningún valor de k lo hace inconsistente."}]	a	Para que las rectas sean paralelas se necesita 1/3 = 2/k, es decir k=6. Con k=6 los términos independientes no guardan esa misma proporción (5/10=1/2 ≠ 1/3): rectas paralelas distintas, inconsistente.	Determinar un parámetro que hace inconsistente un sistema 2x2.
s01_p39	1	ejercicio	Dos fuerzas F1 y F2 en un nodo satisfacen  3F1 - 2F2 = 12,  F1 + F2 = 9  (en newtons). ¿Cuál es el valor de F1?	[{"id": "a", "texto": "F1 = 6 N."}, {"id": "b", "texto": "F1 = 3 N."}, {"id": "c", "texto": "F1 = 9 N."}, {"id": "d", "texto": "F1 = 12 N."}]	a	De la segunda ecuación F1=9-F2. Sustituyendo en la primera: 3(9-F2)-2F2=12 => 27-5F2=12 => F2=3, y entonces F1=6 N.	Traducir y resolver un sistema de ecuaciones a partir de un equilibrio de fuerzas.
s01_p40	1	ejercicio	Se combinan x kg de una aleación al 30% de cobre con y kg de una aleación al 60% de cobre para obtener 50 kg de una aleación al 42% de cobre. ¿Cuántos kg de cada una se necesitan?	[{"id": "a", "texto": "x = 30 kg, y = 20 kg."}, {"id": "b", "texto": "x = 20 kg, y = 30 kg."}, {"id": "c", "texto": "x = 25 kg, y = 25 kg."}, {"id": "d", "texto": "x = 35 kg, y = 15 kg."}]	a	El sistema es x+y=50 (masa total) y 0.3x+0.6y=0.42(50)=21 (balance de cobre). De la primera, x=50-y; sustituyendo: 0.3(50-y)+0.6y=21 => 0.3y=6 => y=20, x=30.	Traducir un problema de mezclas/aleaciones a un sistema de ecuaciones lineales.
s01_p41	1	ejercicio	Al eliminar una variable de un sistema 2x2 se llega a la ecuación 0 = 0. ¿Qué significa esto?	[{"id": "a", "texto": "El sistema es inconsistente."}, {"id": "b", "texto": "Las dos ecuaciones representan la misma recta: hay infinitas soluciones."}, {"id": "c", "texto": "El sistema tiene solución única."}, {"id": "d", "texto": "No se puede determinar nada."}]	b	0=0 no es una contradicción: significa que la segunda ecuación no aportó información nueva (es múltiplo de la primera), así que ambas representan la misma recta y hay infinitas soluciones.	Interpretar el resultado 0=0 al reducir un sistema.
s01_p42	1	ejercicio	Al eliminar una variable de un sistema 2x2 se llega a la ecuación 0 = 5. ¿Qué significa esto?	[{"id": "a", "texto": "Infinitas soluciones."}, {"id": "b", "texto": "Solución única."}, {"id": "c", "texto": "El sistema es inconsistente: las rectas son paralelas distintas."}, {"id": "d", "texto": "El sistema es homogéneo."}]	c	0=5 es una contradicción (falsa para cualquier valor de las variables): el sistema no tiene ninguna solución, las rectas son paralelas distintas.	Interpretar una contradicción (0=c, c≠0) al reducir un sistema.
s01_p43	1	ejercicio	La solución de un sistema de ecuaciones es el punto (2,-1). Calcular la distancia de ese punto a la recta 3x - 4y = 5.	[{"id": "a", "texto": "1."}, {"id": "b", "texto": "5."}, {"id": "c", "texto": "0.2."}, {"id": "d", "texto": "15."}]	a	Forma general: 3x-4y-5=0, con A=3, B=-4, C=-5. d = |3(2)-4(-1)-5| / sqrt(3²+(-4)²) = |6+4-5|/5 = 5/5 = 1.	Combinar la solución de un sistema con la fórmula de distancia punto-recta.
s01_p44	1	ejercicio	En un sistema 2x2, las dos ecuaciones tienen la misma pendiente pero distinto intercepto. ¿Cuántas soluciones tiene el sistema?	[{"id": "a", "texto": "Ninguna."}, {"id": "b", "texto": "Una."}, {"id": "c", "texto": "Infinitas."}, {"id": "d", "texto": "Depende de los coeficientes."}]	a	Misma pendiente y distinto intercepto significa rectas paralelas distintas: nunca se cruzan, el sistema no tiene solución.	Interpretación geométrica de rectas paralelas distintas.
s02_p30	2	ejercicio	Resolver por Gauss-Jordan el sistema  x1 + 2x2 = 7,  3x1 - x2 = 0.	[{"id": "a", "texto": "(x1,x2) = (1,3)."}, {"id": "b", "texto": "(x1,x2) = (3,1)."}, {"id": "c", "texto": "(x1,x2) = (7,0)."}, {"id": "d", "texto": "(x1,x2) = (0,7)."}]	a	De la segunda ecuación x2=3x1. Sustituyendo en la primera: x1+2(3x1)=7 => 7x1=7 => x1=1, y entonces x2=3. Verificación: 3(1)-3=0 ✓.	Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan.
s02_p31	2	ejercicio	Resolver el sistema  x1+x2+x3=6,  x1-x2+x3=2,  x1+x2-x3=0.	[{"id": "a", "texto": "(x1,x2,x3) = (1,2,3)."}, {"id": "b", "texto": "(x1,x2,x3) = (3,2,1)."}, {"id": "c", "texto": "(x1,x2,x3) = (2,1,3)."}, {"id": "d", "texto": "(x1,x2,x3) = (1,3,2)."}]	a	Restando la ecuación 2 de la 1: 2x2=4 => x2=2. Restando la ecuación 3 de la 1: 2x3=6 => x3=3. Sustituyendo en la primera: x1=6-2-3=1. Verificación en las tres ecuaciones: correcta.	Resolución de un sistema 3x3 con solución única.
prog02_p13	202	ejercicio	for(int i=1;i<=10;i++){ if(i==7) break; if(i%2==0) continue; printf("%d",i); }  ¿Qué imprime?	[{"id": "a", "texto": "1357"}, {"id": "b", "texto": "135"}, {"id": "c", "texto": "1234567"}, {"id": "d", "texto": "13579"}]	b	i=1 (impar, imprime 1), i=2 (par, continue), i=3 (imprime 3), i=4 (continue), i=5 (imprime 5), i=6 (continue), i=7: break termina el ciclo antes de imprimir. Salida: 135.	Trazar un ciclo for combinando break y continue.
s02_p32	2	ejercicio	El sistema  2x1+4x2-6x3=8,  x1+2x2-3x3=4  (la primera es el doble de la segunda). ¿Cuál es su solución general?	[{"id": "a", "texto": "x1 = 4-2s+3t, x2 = s, x3 = t, con s,t libres."}, {"id": "b", "texto": "x1 = 4+2s-3t, x2 = s, x3 = t, con s,t libres."}, {"id": "c", "texto": "x1=4, x2=0, x3=0 (solución única)."}, {"id": "d", "texto": "El sistema es inconsistente."}]	a	Al ser una ecuación múltiplo de la otra, rank r=1 con n=3: hay 2 variables libres. Tomando x2=s, x3=t, de la segunda ecuación x1 = 4-2s+3t.	Parametrización de la solución general cuando hay variables libres.
s02_p33	2	ejercicio	Un sistema tiene las ecuaciones  x1+x2+x3=1,  2x1+2x2+2x3=5  (más una tercera ecuación cualquiera). ¿Qué se puede afirmar del sistema sin importar la tercera ecuación?	[{"id": "a", "texto": "Es inconsistente: la ecuación 2 contradice a la 1 (2 veces el lado izquierdo de la 1 debería dar 2, no 5)."}, {"id": "b", "texto": "Tiene solución única."}, {"id": "c", "texto": "Tiene infinitas soluciones."}, {"id": "d", "texto": "Depende de la tercera ecuación."}]	a	El lado izquierdo de la ecuación 2 es exactamente 2 veces el de la ecuación 1, así que su lado derecho debería ser 2(1)=2; pero es 5: contradicción irreversible, sin importar qué diga la tercera ecuación.	Detectar una contradicción entre dos ecuaciones antes de terminar de reducir el sistema.
s02_p34	2	ejercicio	Sistema homogéneo  x1+x2+x3=0,  x1-x2+x3=0,  2x1+x3=0. ¿Tiene soluciones no triviales?	[{"id": "a", "texto": "No, solo la trivial (0,0,0): el rango es r=n=3."}, {"id": "b", "texto": "Sí: x1=t, x2=0, x3=-2t."}, {"id": "c", "texto": "Sí, siempre que m<n."}, {"id": "d", "texto": "No se puede determinar."}]	a	Restando las dos primeras ecuaciones se obtiene x2=0; con la tercera, x3=-2x1; sustituyendo en la primera, -x1=0, así que x1=0 y por tanto x3=0. El rango es 3 (=n), no hay variables libres: solo la solución trivial.	Determinar si un sistema homogéneo tiene soluciones no triviales.
s02_p35	2	ejercicio	Sistema homogéneo  x1+2x2-x3=0,  2x1+4x2-2x3=0,  -x1-2x2+x3=0  (las tres ecuaciones son múltiplos entre sí). ¿Cuál es la solución general?	[{"id": "a", "texto": "x1=-2s+t, x2=s, x3=t, con s,t libres."}, {"id": "b", "texto": "Solo la solución trivial (0,0,0)."}, {"id": "c", "texto": "El sistema es inconsistente."}, {"id": "d", "texto": "x1=2s-t, x2=s, x3=t, con s,t libres."}]	a	Las tres ecuaciones son múltiplos de la primera, así que rango r=1 y n=3: hay 2 variables libres. Tomando x2=s, x3=t: x1 = -2x2+x3 = -2s+t.	Resolución de un sistema homogéneo con variables libres.
s02_p36	2	ejercicio	Un circuito de tres mallas produce el sistema (corrientes en amperios)  I1+I2=4,  -I1+2I2-I3=1,  -I2+3I3=2. ¿Cuál es el valor de I3?	[{"id": "a", "texto": "I3 = 11/8 A."}, {"id": "b", "texto": "I3 = 15/8 A."}, {"id": "c", "texto": "I3 = 17/8 A."}, {"id": "d", "texto": "I3 = 1 A."}]	a	Resolviendo el sistema (por sustitución o Gauss-Jordan) se obtiene I1=15/8 A, I2=17/8 A, I3=11/8 A.	Resolución de un sistema 3x3 de corrientes de malla (ley de voltajes de Kirchhoff).
s02_p37	2	ejercicio	Para el sistema  x + 2y = 3,  2x + ky = 6, ¿qué valor de k produce infinitas soluciones?	[{"id": "a", "texto": "k = 4."}, {"id": "b", "texto": "k = 2."}, {"id": "c", "texto": "k = 6."}, {"id": "d", "texto": "k = -4."}]	a	Con k=4, la segunda ecuación es exactamente 2 veces la primera (2(x+2y)=2x+4y=6): misma recta, infinitas soluciones.	Determinar un parámetro que hace indeterminado un sistema 2x2.
s02_p38	2	ejercicio	Clasificar el sistema  x + 2y = 3,  2x + 4y = 9.	[{"id": "a", "texto": "Inconsistente."}, {"id": "b", "texto": "Consistente determinado (solución única)."}, {"id": "c", "texto": "Consistente indeterminado (infinitas soluciones)."}, {"id": "d", "texto": "Homogéneo."}]	a	Los coeficientes son proporcionales (1/2 = 2/4), pero los términos independientes no (3/9=1/3 ≠ 1/2): rectas paralelas distintas, sistema inconsistente.	Clasificación de sistemas 2x2 por proporcionalidad de coeficientes.
s02_p39	2	ejercicio	Resolver por Gauss-Jordan el sistema  2x1 - 3x2 = -4,  x1 + x2 = 3.	[{"id": "a", "texto": "(x1,x2) = (1,2)."}, {"id": "b", "texto": "(x1,x2) = (2,1)."}, {"id": "c", "texto": "(x1,x2) = (3,0)."}, {"id": "d", "texto": "(x1,x2) = (-1,4)."}]	a	De la segunda ecuación x1=3-x2. Sustituyendo en la primera: 2(3-x2)-3x2=-4 => 6-5x2=-4 => x2=2, y entonces x1=1. Verificación: 2(1)-3(2)=-4 ✓.	Resolución de un sistema 2x2 con el algoritmo de Gauss-Jordan.
s02_p40	2	ejercicio	Una matriz aumentada de un sistema con 4 ecuaciones y 4 incógnitas se reduce y queda con 3 pivotes. Si el sistema es consistente, ¿cuántas variables libres tiene?	[{"id": "a", "texto": "0."}, {"id": "b", "texto": "1."}, {"id": "c", "texto": "2."}, {"id": "d", "texto": "3."}]	b	El número de variables libres es n-r = 4-3 = 1.	Contar variables libres a partir del rango y del número de incógnitas.
s02_p41	2	ejercicio	Un sistema homogéneo tiene m=2 ecuaciones y n=4 incógnitas. ¿Está garantizado que tiene soluciones no triviales?	[{"id": "a", "texto": "Sí: como m<n, el rango r≤m<n, así que siempre hay al menos una variable libre."}, {"id": "b", "texto": "No, depende de la matriz A."}, {"id": "c", "texto": "Solo si m=n."}, {"id": "d", "texto": "Nunca, un sistema homogéneo solo tiene la solución trivial."}]	a	El rango r nunca puede superar m; con m<n se cumple r≤m<n, así que siempre queda al menos una variable libre y, por tanto, soluciones no triviales garantizadas.	Garantía de soluciones no triviales cuando m<n en un sistema homogéneo.
s02_p42	2	ejercicio	Al reducir la matriz aumentada  [1 2 -1 | 3; 2 4 -2 | 6; 1 1 1 | 2]  se observa que la fila 2 es exactamente el doble de la fila 1. ¿Cuántas variables libres tiene este sistema 3x3 (si es consistente)?	[{"id": "a", "texto": "0."}, {"id": "b", "texto": "1."}, {"id": "c", "texto": "2."}, {"id": "d", "texto": "El sistema es inconsistente."}]	b	La fila 2 es redundante, así que solo hay 2 ecuaciones independientes (filas 1 y 3) para 3 incógnitas: rango r=2, variables libres = n-r = 3-2 = 1. No hay contradicción, el sistema es consistente.	Reconocer ecuaciones redundantes y contar variables libres.
s02_p43	2	ejercicio	Al reducir una matriz aumentada aparece una fila completa de ceros, incluida la columna de términos independientes: [0 0 0 | 0]. ¿Qué representa esa fila?	[{"id": "a", "texto": "Una contradicción (0=c, c≠0)."}, {"id": "b", "texto": "Una ecuación redundante (0=0) que no aporta ninguna restricción nueva."}, {"id": "c", "texto": "Que el sistema es homogéneo."}, {"id": "d", "texto": "Que el sistema tiene solución única."}]	b	0=0 es una identidad siempre verdadera: esa ecuación no restringe nada nuevo (era combinación lineal de las demás), no representa una contradicción.	Interpretar una fila de ceros (0=0) al reducir un sistema.
s02_p44	2	ejercicio	Al reducir un sistema, el número de pivotes r es igual al número de ecuaciones m, pero menor que el número de incógnitas n (r=m<n), y el sistema es consistente. ¿Qué tipo de sistema es?	[{"id": "a", "texto": "Determinado (solución única)."}, {"id": "b", "texto": "Indeterminado, con n-r variables libres."}, {"id": "c", "texto": "Inconsistente."}, {"id": "d", "texto": "Homogéneo únicamente."}]	b	Con r<n quedan n-r columnas sin pivote, es decir n-r variables libres: el sistema consistente es indeterminado (infinitas soluciones).	Clasificar un sistema consistente a partir de la relación entre r y n.
prog02_p1	202	teoria	En C, ¿qué valor se considera "falso" dentro de una condición (if, while, ...)?	[{"id": "a", "texto": "Cualquier valor negativo."}, {"id": "b", "texto": "Solo el valor 0."}, {"id": "c", "texto": "Cualquier valor distinto de 1."}, {"id": "d", "texto": "El valor -1."}]	b	En C, el valor 0 se considera falso y cualquier valor distinto de 0 (incluidos los negativos) se considera verdadero.	Convención de verdadero/falso en expresiones condicionales de C.
prog02_p2	202	teoria	¿Cuál es la diferencia principal entre un if-else y el operador ternario (?:)?	[{"id": "a", "texto": "El ternario no puede anidarse."}, {"id": "b", "texto": "El ternario es una expresión que produce un valor (útil para asignar directamente); if-else es una instrucción de control, no produce un valor por sí misma."}, {"id": "c", "texto": "if-else siempre es más rápido."}, {"id": "d", "texto": "No hay ninguna diferencia."}]	b	El operador ternario evalúa a un valor que se puede usar directamente (por ejemplo, asignarlo a una variable), mientras que if-else solo controla qué bloque de instrucciones se ejecuta.	Diferencia entre el operador ternario y la sentencia if-else.
prog02_p3	202	ejercicio	¿Cuál es la salida de:  int a=8, b=3, mayor;  mayor = (a>b) ? a : b;  printf("%d", mayor);	[{"id": "a", "texto": "8"}, {"id": "b", "texto": "3"}, {"id": "c", "texto": "1"}, {"id": "d", "texto": "0"}]	a	La condición a>b (8>3) es verdadera, así que el ternario evalúa al primer valor: mayor=8.	Evaluar una expresión con el operador ternario.
prog02_p4	202	teoria	En una cadena  if / else if / else if / ... / else, ¿cuántos bloques se ejecutan como máximo?	[{"id": "a", "texto": "Todos los que tengan condición verdadera."}, {"id": "b", "texto": "Solo uno: el primero (en orden) cuya condición sea verdadera."}, {"id": "c", "texto": "Ninguno; hace falta usar switch."}, {"id": "d", "texto": "Depende del compilador."}]	b	Las condiciones se evalúan en orden; en cuanto una es verdadera se ejecuta su bloque y se ignoran las siguientes ramas, aunque también serían verdaderas.	Orden de evaluación en una cadena de if / else if / else.
prog02_p5	202	ejercicio	float nota=3.2f; if(nota>=4.5f){printf("Excelente");}else if(nota>=3.0f){printf("Aprobado");}else{printf("Reprobado");}  ¿Qué imprime?	[{"id": "a", "texto": "Excelente"}, {"id": "b", "texto": "Aprobado"}, {"id": "c", "texto": "Reprobado"}, {"id": "d", "texto": "No imprime nada"}]	b	3.2 no es >=4.5, así que se evalúa la siguiente condición: 3.2>=3.0 es verdadera, se imprime "Aprobado".	Trazar una cadena if / else if / else con valores flotantes.
prog02_p6	202	teoria	¿Qué ocurre si se olvida el break al final de un case dentro de un switch?	[{"id": "a", "texto": "Error de compilación."}, {"id": "b", "texto": "La ejecución \\"cae\\" (fall-through) y sigue ejecutando el código del siguiente case, hasta encontrar un break o llegar al final."}, {"id": "c", "texto": "El programa termina inmediatamente."}, {"id": "d", "texto": "Solo se ejecuta el default."}]	b	Sin break, C no sale del switch al terminar un case: continúa ejecutando las instrucciones del siguiente case (fall-through), sin volver a comparar su etiqueta.	Comportamiento de fall-through en switch-case sin break.
prog02_p7	202	ejercicio	int opcion=2; switch(opcion){ case 1: printf("A"); break; case 2: printf("B"); break; case 3: printf("C"); break; default: printf("D"); }  ¿Qué imprime?	[{"id": "a", "texto": "A"}, {"id": "b", "texto": "B"}, {"id": "c", "texto": "C"}, {"id": "d", "texto": "D"}]	b	opcion vale 2, coincide con case 2: se imprime "B" y el break sale del switch sin ejecutar case 3 ni default.	Trazar la ejecución de un switch-case con break.
prog02_p8	202	ejercicio	Igual que el ejercicio anterior pero SIN el break del case 2 (opcion=2 sigue igual): case 1: printf("A"); break; case 2: printf("B"); case 3: printf("C"); break; default: printf("D");  ¿Qué imprime?	[{"id": "a", "texto": "B"}, {"id": "b", "texto": "BC"}, {"id": "c", "texto": "BCD"}, {"id": "d", "texto": "C"}]	b	Al faltar el break en case 2, tras imprimir "B" la ejecución cae (fall-through) al case 3, que imprime "C" y ahí sí encuentra un break que sale del switch: salida "BC".	Efecto del fall-through cuando falta un break en un caso intermedio.
prog02_p9	202	teoria	En la expresión  a && b, si a es falso, ¿se evalúa b?	[{"id": "a", "texto": "Sí, siempre se evalúan ambos operandos."}, {"id": "b", "texto": "No: por cortocircuito (short-circuit), si a ya es falso el resultado de && es falso sin importar b, así que b no se evalúa."}, {"id": "c", "texto": "Solo si b es una constante."}, {"id": "d", "texto": "Depende del compilador."}]	b	C evalúa && de izquierda a derecha y se detiene apenas el resultado queda determinado: si a es falso, el && completo ya es falso sin importar b.	Evaluación de cortocircuito (short-circuit) del operador &&.
prog02_p10	202	ejercicio	int edad=20, tiene_carnet=1; if(edad>=18 && tiene_carnet){printf("Puede ingresar");}else{printf("No puede ingresar");}  ¿Qué imprime?	[{"id": "a", "texto": "Puede ingresar"}, {"id": "b", "texto": "No puede ingresar"}, {"id": "c", "texto": "Error de compilación"}, {"id": "d", "texto": "No imprime nada"}]	a	edad>=18 (20>=18) es verdadero y tiene_carnet (1) también es verdadero: la condición compuesta es verdadera, se imprime "Puede ingresar".	Evaluar una condición compuesta con &&.
prog02_p11	202	ejercicio	int x=0; if (x != 0 && 10/x > 1) { printf("ok"); } else { printf("no"); }  ¿Se llega a ejecutar la división 10/x?	[{"id": "a", "texto": "No: por el cortocircuito de &&, como x!=0 ya es falso (x vale 0), el segundo operando (10/x) no se evalúa."}, {"id": "b", "texto": "Sí, C siempre evalúa ambos lados de un &&."}, {"id": "c", "texto": "Solo si x fuera negativo."}, {"id": "d", "texto": "Produce un error de compilación."}]	a	x!=0 es falso porque x vale 0, así que el && ya sabe que el resultado es falso sin evaluar el resto: el cortocircuito evita la división por cero.	Usar el cortocircuito de && para evitar una operación inválida (división por cero).
prog02_p12	202	ejercicio	for(int i=1;i<=5;i++){ if(i==3) continue; printf("%d",i); }  ¿Qué imprime?	[{"id": "a", "texto": "12345"}, {"id": "b", "texto": "1245"}, {"id": "c", "texto": "123"}, {"id": "d", "texto": "12"}]	b	Para i=1,2 se imprime normal. Para i=3, continue salta el printf y pasa a la siguiente iteración (no se imprime 3). Para i=4,5 se imprime normal. Salida: 1245.	Trazar un ciclo for con continue.
prog02_p14	202	teoria	¿Cuál es la diferencia clave entre while y do-while?	[{"id": "a", "texto": "while siempre ejecuta el cuerpo al menos una vez; do-while puede ejecutarlo 0 veces."}, {"id": "b", "texto": "do-while evalúa la condición al final, así que el cuerpo se ejecuta al menos una vez; while evalúa la condición antes y puede ejecutarse 0 veces."}, {"id": "c", "texto": "No hay diferencia real, son sinónimos."}, {"id": "d", "texto": "do-while no admite condiciones compuestas."}]	b	while comprueba la condición antes de cada repetición (si es falsa desde el inicio, el cuerpo nunca se ejecuta); do-while la comprueba después, garantizando al menos una ejecución.	Diferencia entre while (condición al inicio) y do-while (condición al final).
prog02_p15	202	ejercicio	int contador=1; while(contador<=5){ printf("%d",contador); contador++; }  ¿Cuántas veces se imprime un número?	[{"id": "a", "texto": "4"}, {"id": "b", "texto": "5"}, {"id": "c", "texto": "6"}, {"id": "d", "texto": "Infinitas veces (ciclo infinito)."}]	b	contador toma los valores 1,2,3,4,5 (se detiene cuando contador=6, ya que 6<=5 es falso): se imprime 5 veces.	Contar las repeticiones de un ciclo while con contador.
prog02_p16	202	ejercicio	int n=5; long factorial=1; for(int i=1;i<=n;i++){ factorial *= i; }  ¿Cuál es el valor final de factorial?	[{"id": "a", "texto": "120"}, {"id": "b", "texto": "100"}, {"id": "c", "texto": "24"}, {"id": "d", "texto": "25"}]	a	factorial acumula 1×1×2×3×4×5 = 120 (5! = 120).	Calcular un factorial acumulando el producto dentro de un ciclo for.
prog02_p17	202	ejercicio	int n=1234, invertido=0, digito; while(n>0){ digito=n%10; invertido=invertido*10+digito; n/=10; }  ¿Cuál es el valor final de invertido?	[{"id": "a", "texto": "4321"}, {"id": "b", "texto": "1234"}, {"id": "c", "texto": "4320"}, {"id": "d", "texto": "1243"}]	a	Cada iteración extrae el último dígito de n (con %10) y lo agrega al final de invertido (invertido*10+digito), mientras n pierde ese dígito (n/=10): 1234 se invierte a 4321.	Trazar el algoritmo de inversión de dígitos de un número con while.
prog02_p18	202	ejercicio	int n=257, suma=0; while(n>0){ suma += n%10; n /= 10; }  ¿Cuál es el valor final de suma?	[{"id": "a", "texto": "14"}, {"id": "b", "texto": "257"}, {"id": "c", "texto": "7"}, {"id": "d", "texto": "2"}]	a	Se suman los dígitos de 257: 2+5+7=14.	Trazar el algoritmo de suma de dígitos de un número con while.
prog02_p19	202	ejercicio	¿Cuántas veces se ejecuta el cuerpo del ciclo interno en:  for(int fila=1;fila<=3;fila++){ for(int col=1;col<=4;col++){ ... } }?	[{"id": "a", "texto": "7 veces."}, {"id": "b", "texto": "12 veces (3×4)."}, {"id": "c", "texto": "3 veces."}, {"id": "d", "texto": "4 veces."}]	b	Por cada una de las 3 repeticiones del ciclo externo, el ciclo interno se ejecuta completo (4 veces): 3×4=12 ejecuciones del cuerpo interno en total.	Contar las repeticiones totales de ciclos anidados.
prog02_p20	202	ejercicio	Con  int n=17, es_primo=1; for(int i=2;i<n;i++){ if(n%i==0){ es_primo=0; break; } }  ¿Es 17 primo según este código?	[{"id": "a", "texto": "Sí: ningún i entre 2 y 16 divide exactamente a 17, así que es_primo se queda en 1."}, {"id": "b", "texto": "No: es_primo termina en 0."}, {"id": "c", "texto": "El programa entra en un ciclo infinito."}, {"id": "d", "texto": "Produce un error de división."}]	a	17 no tiene divisores exactos entre 2 y 16, así que la condición n%i==0 nunca se cumple, es_primo nunca cambia y el ciclo termina normalmente con es_primo=1.	Trazar el algoritmo de prueba de primalidad por división.
prog02_p21	202	ejercicio	Mismo código del ejercicio anterior pero con n=15. ¿Es 15 primo según el código?	[{"id": "a", "texto": "Sí, es primo."}, {"id": "b", "texto": "No: en i=3, 15%3==0, así que es_primo pasa a 0 y break termina el ciclo."}, {"id": "c", "texto": "Depende del compilador."}, {"id": "d", "texto": "El ciclo nunca se ejecuta."}]	b	En i=2, 15%2=1 (no divide). En i=3, 15%3=0: es_primo se pone en 0 y break sale del ciclo de inmediato.	Trazar el algoritmo de prueba de primalidad con un número compuesto.
prog02_p22	202	teoria	¿Para qué sirve la instrucción break dentro de un ciclo (for/while/do-while)?	[{"id": "a", "texto": "Salta la iteración actual y continúa con la siguiente."}, {"id": "b", "texto": "Termina inmediatamente el ciclo (o switch) que lo contiene."}, {"id": "c", "texto": "Reinicia el ciclo desde el principio."}, {"id": "d", "texto": "Solo funciona dentro de un switch, no en ciclos."}]	b	break sale de inmediato del ciclo (o switch) más interno que lo contiene, sin evaluar más repeticiones.	Efecto de break dentro de un ciclo.
prog02_p23	202	teoria	¿Para qué sirve la instrucción continue dentro de un ciclo?	[{"id": "a", "texto": "Termina el ciclo inmediatamente, igual que break."}, {"id": "b", "texto": "Salta el resto del cuerpo del ciclo en la iteración actual y pasa directamente a evaluar la siguiente repetición."}, {"id": "c", "texto": "Es equivalente a break."}, {"id": "d", "texto": "Termina el programa completo."}]	b	continue no termina el ciclo: solo omite las instrucciones restantes del cuerpo en esa iteración y continúa con la siguiente (reevaluando la condición del ciclo).	Efecto de continue dentro de un ciclo.
prog02_p24	202	ejercicio	Un programa necesita pedir una opción de menú (1-3) por teclado y repetir la pregunta mientras la opción no sea válida. ¿Por qué do-while es más natural que while para este caso?	[{"id": "a", "texto": "Porque hay que pedirle el dato al usuario al menos una vez antes de poder validarlo; do-while garantiza esa primera ejecución sin necesitar un valor centinela inicial."}, {"id": "b", "texto": "Porque do-while es más rápido de ejecutar."}, {"id": "c", "texto": "Porque while no admite condiciones compuestas."}, {"id": "d", "texto": "No hay ninguna diferencia real entre usar una u otra."}]	a	Con while habría que inicializar la variable de opción con un valor inválido "de mentiras" antes del ciclo para que la primera comprobación falle; do-while evita ese truco porque ejecuta el cuerpo (pedir el dato) antes de comprobar la condición.	Elegir la estructura de ciclo adecuada para validar una entrada de usuario.
prog03_p1	203	teoria	¿Qué es una función en C?	[{"id": "a", "texto": "Una variable especial que solo existe dentro de main."}, {"id": "b", "texto": "Un bloque de código con nombre propio, reutilizable, que puede recibir parámetros y devolver un valor."}, {"id": "c", "texto": "Un tipo de dato primitivo."}, {"id": "d", "texto": "Un comentario dentro del código."}]	b	Una función agrupa instrucciones bajo un nombre, se puede llamar (invocar) tantas veces como se necesite, y opcionalmente recibe parámetros y devuelve un valor.	Definición de función.
prog03_p2	203	teoria	¿Qué es el "diseño descendente" (top-down)?	[{"id": "a", "texto": "Escribir todo el programa dentro de una sola función."}, {"id": "b", "texto": "Dividir un problema grande en subproblemas más pequeños y manejables, resolviendo cada uno con su propia función."}, {"id": "c", "texto": "Ordenar las funciones del archivo de la más grande a la más pequeña."}, {"id": "d", "texto": "Un estilo particular de indentación del código."}]	b	El diseño descendente parte del problema completo y lo va descomponiendo en partes más simples, cada una resuelta por una función, hasta que cada pieza es fácil de implementar.	Concepto de diseño descendente (top-down) y modularización.
prog03_p3	203	teoria	¿Cuál de las siguientes NO es una ventaja real de modularizar un programa en funciones?	[{"id": "a", "texto": "Reutilización de código."}, {"id": "b", "texto": "Mejor legibilidad del programa."}, {"id": "c", "texto": "El programa ocupa automáticamente menos espacio en disco por el simple hecho de usar funciones."}, {"id": "d", "texto": "Facilita probar cada parte del programa por separado."}]	c	Modularizar no reduce automáticamente el tamaño en disco del programa; sus ventajas reales son de organización, reutilización, legibilidad y facilidad de prueba/mantenimiento.	Distinguir las ventajas reales de modularizar de afirmaciones falsas.
prog03_p4	203	teoria	El prototipo de una función:	[{"id": "a", "texto": "Incluye el cuerpo completo de la función."}, {"id": "b", "texto": "Anuncia al compilador el nombre, tipo de retorno y tipos de los parámetros de la función, sin incluir su cuerpo."}, {"id": "c", "texto": "Solo es necesario en funciones void."}, {"id": "d", "texto": "Debe escribirse siempre dentro de main."}]	b	El prototipo es solo la "firma" de la función (tipo de retorno, nombre, tipos de parámetros) terminada en punto y coma, sin el cuerpo; le permite al compilador reconocer llamadas a la función antes de ver su definición completa.	Qué información contiene un prototipo de función.
prog03_p5	203	ejercicio	¿Cuál es el prototipo correcto para una función que recibe un double (radio) y retorna un double (área)?	[{"id": "a", "texto": "double areaCirculo(double radio);"}, {"id": "b", "texto": "void areaCirculo(double radio);"}, {"id": "c", "texto": "areaCirculo(double radio) double;"}, {"id": "d", "texto": "double areaCirculo();"}]	a	El prototipo debe indicar el tipo de retorno (double), el nombre (areaCirculo) y el tipo de cada parámetro (double radio), terminado en punto y coma.	Escribir el prototipo de una función con parámetro y valor de retorno.
prog03_p6	203	teoria	Una función declarada con tipo de retorno void:	[{"id": "a", "texto": "Siempre debe llevar return valor; al final de su cuerpo."}, {"id": "b", "texto": "No devuelve ningún valor; se usa para tareas como imprimir, donde lo que importa es el efecto, no un resultado calculado."}, {"id": "c", "texto": "Solo puede recibir un parámetro como máximo."}, {"id": "d", "texto": "No puede recibir ningún parámetro."}]	b	void indica ausencia de valor de retorno; la función puede seguir recibiendo parámetros normalmente, solo que no calcula un resultado para devolver con return.	Qué significa que una función sea void.
prog03_p7	203	ejercicio	double areaCirculo(double radio){ return 3.14159 * radio * radio; }  Llamada: areaCirculo(2.0). ¿Cuál es el resultado (aproximado)?	[{"id": "a", "texto": "12.57 (aprox.)"}, {"id": "b", "texto": "6.28"}, {"id": "c", "texto": "4.00"}, {"id": "d", "texto": "25.13"}]	a	3.14159 × 2.0 × 2.0 = 3.14159 × 4 = 12.56636, aproximadamente 12.57.	Evaluar el resultado de una función con retorno double.
prog03_p8	203	ejercicio	int maximo(int a,int b,int c){ int m=a; if(b>m) m=b; if(c>m) m=c; return m; }  Llamada: maximo(7,15,3). ¿Qué retorna?	[{"id": "a", "texto": "15"}, {"id": "b", "texto": "7"}, {"id": "c", "texto": "3"}, {"id": "d", "texto": "25"}]	a	m inicia en 7 (a). Como b=15>7, m pasa a 15. Como c=3 no es mayor que 15, m se queda en 15. Retorna 15.	Trazar una función que calcula el máximo de tres valores.
prog03_p9	203	ejercicio	int esPar(int n){ return (n%2==0) ? 1 : 0; }  ¿Qué retorna esPar(7)?	[{"id": "a", "texto": "1"}, {"id": "b", "texto": "0"}, {"id": "c", "texto": "7"}, {"id": "d", "texto": "-1"}]	b	7%2 = 1, distinto de 0, así que la condición n%2==0 es falsa: el ternario retorna 0.	Trazar una función que determina si un número es par.
prog03_p10	203	teoria	En C, los parámetros de una función se pasan:	[{"id": "a", "texto": "Por referencia siempre, modificando directamente la variable original."}, {"id": "b", "texto": "Por valor: la función recibe una copia del valor del argumento."}, {"id": "c", "texto": "Por nombre, sin copiar nada."}, {"id": "d", "texto": "Depende del tipo de dato del parámetro."}]	b	Salvo que se pase explícitamente un puntero, en C todo parámetro se pasa por valor: la función recibe y trabaja sobre una copia independiente.	Mecanismo de paso de parámetros por valor en C.
prog03_p11	203	ejercicio	void incrementar(int x){ x = x + 1; }  int numero=5; incrementar(numero); printf("%d", numero);  ¿Qué imprime?	[{"id": "a", "texto": "5"}, {"id": "b", "texto": "6"}, {"id": "c", "texto": "0"}, {"id": "d", "texto": "Error de compilación."}]	a	x recibe una copia del valor de numero (5). Modificar x dentro de incrementar no afecta a numero, que sigue valiendo 5.	Consecuencia del paso por valor: la función no modifica la variable original.
prog03_p12	203	teoria	¿Por qué la función incrementar del ejercicio anterior no modifica la variable original numero?	[{"id": "a", "texto": "Porque x es una copia local independiente del valor de numero; modificar la copia no afecta al original."}, {"id": "b", "texto": "Porque la función incrementar está mal escrita y tiene un error."}, {"id": "c", "texto": "Porque numero fue declarada como constante."}, {"id": "d", "texto": "Porque a la función le falta un return."}]	a	El paso por valor crea una copia independiente en cada llamada; esa copia (x) vive solo dentro de la función y desaparece al terminar, sin afectar la variable del llamador.	Explicar el paso por valor con sus propias palabras.
prog03_p13	203	teoria	¿Qué hace falta para que una función SÍ pueda modificar una variable del código que la llamó?	[{"id": "a", "texto": "Declarar la variable como global."}, {"id": "b", "texto": "Pasarle la dirección de memoria de la variable (un puntero) en vez de una copia de su valor."}, {"id": "c", "texto": "Usar un ciclo dentro de la función."}, {"id": "d", "texto": "No es posible en C bajo ninguna circunstancia."}]	b	Si la función recibe la dirección de memoria (puntero) de la variable, puede acceder y modificar directamente esa misma posición de memoria, no una copia. Este mecanismo se estudia en la Semana 14 (punteros).	Anticipar el mecanismo (punteros) que permite modificar variables del llamador.
prog03_p14	203	ejercicio	void f(int x){ printf("dentro: %d ", x); x = 100; }  int main(void){ int v=1; f(v); printf("fuera: %d", v); return 0; }  ¿Qué imprime en total?	[{"id": "a", "texto": "dentro: 1 fuera: 1"}, {"id": "b", "texto": "dentro: 1 fuera: 100"}, {"id": "c", "texto": "dentro: 100 fuera: 100"}, {"id": "d", "texto": "dentro: 100 fuera: 1"}]	a	Dentro de f, x recibe la copia de v (1) y se imprime "dentro: 1 " antes de que x se reasigne a 100 (que ya no se imprime). Al volver a main, v sigue siendo 1 (no se tocó, solo su copia x cambió), así que se imprime "fuera: 1".	Trazar el paso por valor combinando impresión y reasignación dentro de la función.
prog03_p15	203	teoria	Una variable local (declarada dentro de una función):	[{"id": "a", "texto": "Es visible y utilizable desde cualquier otra función del programa."}, {"id": "b", "texto": "Solo existe y es visible mientras se ejecuta la función donde fue declarada."}, {"id": "c", "texto": "Se comparte automáticamente entre todas las funciones que la usan."}, {"id": "d", "texto": "Debe declararse siempre anteponiendo la palabra global."}]	b	El ámbito de una variable local se limita a la función donde se declaró: se crea al entrar a la función y se destruye al salir de ella.	Ámbito (alcance) y tiempo de vida de una variable local.
prog03_p16	203	teoria	Una variable global (declarada fuera de todas las funciones):	[{"id": "a", "texto": "Solo puede declararse dentro de main."}, {"id": "b", "texto": "Es visible desde cualquier función definida después de ella, y existe durante toda la ejecución del programa."}, {"id": "c", "texto": "Desaparece automáticamente al terminar la primera función que la usa."}, {"id": "d", "texto": "Solo puede ser de tipo int."}]	b	Una variable global vive mientras el programa se ejecuta y puede ser leída/modificada por cualquier función que la tenga a la vista (definida después de su declaración).	Ámbito (alcance) y tiempo de vida de una variable global.
prog03_p17	203	ejercicio	int contadorEventos=0; void registrarEvento(void){ contadorEventos++; }  int main(void){ registrarEvento(); registrarEvento(); registrarEvento(); printf("%d", contadorEventos); return 0; }  ¿Qué imprime?	[{"id": "a", "texto": "3"}, {"id": "b", "texto": "0"}, {"id": "c", "texto": "1"}, {"id": "d", "texto": "Error: contadorEventos no es visible dentro de registrarEvento."}]	a	contadorEventos es global, así que registrarEvento la ve y la incrementa cada vez que se llama; tres llamadas la dejan en 3.	Usar una variable global compartida entre varias llamadas a una función.
prog03_p18	203	teoria	¿Por qué se recomienda no abusar de las variables globales?	[{"id": "a", "texto": "Porque C no permite usarlas dentro de funciones void."}, {"id": "b", "texto": "Porque cualquier función puede modificarlas en cualquier momento, generando efectos ocultos que dificultan entender y depurar el programa."}, {"id": "c", "texto": "Porque ocupan mucha más memoria que una variable local equivalente."}, {"id": "d", "texto": "Porque no se pueden inicializar con un valor al declararlas."}]	b	El riesgo principal de las variables globales no es técnico sino de diseño: al poder ser modificadas desde cualquier función, se vuelve difícil rastrear dónde y cuándo cambia su valor.	Riesgo de diseño al abusar de variables globales.
prog03_p19	203	ejercicio	Dos funciones distintas, cada una con su propia variable local llamada total (declarada dentro de cada función), ¿interfieren entre sí?	[{"id": "a", "texto": "Sí, siempre se sobrescriben porque tienen el mismo nombre."}, {"id": "b", "texto": "No: cada variable local pertenece solo a su propia función; el mismo nombre en dos funciones distintas son dos variables independientes."}, {"id": "c", "texto": "Solo interfieren si ambas funciones son void."}, {"id": "d", "texto": "Depende del orden en que se llamen las funciones."}]	b	El ámbito local significa que el nombre "total" dentro de una función no tiene ninguna relación con un "total" declarado dentro de otra función: son variables completamente distintas que solo comparten el nombre.	Independencia de variables locales con el mismo nombre en funciones distintas.
prog03_p20	203	ejercicio	void imprimirTabla(int n){ for(int i=1;i<=10;i++){ printf("%d ", n*i); } }  Llamada: imprimirTabla(3). ¿Cuál es el último número impreso?	[{"id": "a", "texto": "30"}, {"id": "b", "texto": "10"}, {"id": "c", "texto": "3"}, {"id": "d", "texto": "33"}]	a	El ciclo llega hasta i=10, y el último valor impreso es n*i = 3*10 = 30.	Trazar una función void que imprime una tabla de multiplicar.
prog03_p21	203	ejercicio	int contadorEventos=0; void registrarEvento(void){ int contadorEventos=0; contadorEventos++; }  int main(void){ registrarEvento(); registrarEvento(); printf("%d", contadorEventos); return 0; }  Nota: dentro de registrarEvento se declaró una variable LOCAL con el mismo nombre que la global. ¿Qué imprime el printf de main?	[{"id": "a", "texto": "0"}, {"id": "b", "texto": "2"}, {"id": "c", "texto": "1"}, {"id": "d", "texto": "Error de compilación."}]	a	La declaración local "int contadorEventos=0;" dentro de registrarEvento crea una variable nueva que sombrea (oculta) a la global durante toda esa función: cada llamada reinicia esa copia local en 0, la incrementa a 1, y la descarta al terminar. La variable global de main nunca se toca y sigue en 0.	Sombreado (shadowing) de una variable global por una local con el mismo nombre.
prog03_p22	203	ejercicio	double promedio(double a,double b,double c){ return (a+b+c)/3.0; }  Llamada: promedio(4.0,5.0,9.0). ¿Qué retorna?	[{"id": "a", "texto": "6.0"}, {"id": "b", "texto": "18.0"}, {"id": "c", "texto": "4.5"}, {"id": "d", "texto": "9.0"}]	a	(4.0+5.0+9.0)/3.0 = 18.0/3.0 = 6.0.	Trazar una función que calcula el promedio de tres valores.
prog03_p23	203	teoria	En un programa bien modularizado siguiendo diseño descendente, ¿cómo debería verse típicamente la función main?	[{"id": "a", "texto": "Con cientos de líneas que resuelven todo el problema directamente, sin llamar a otras funciones."}, {"id": "b", "texto": "Como una secuencia corta de llamadas a funciones, cada una responsable de una tarea bien definida."}, {"id": "c", "texto": "Vacía, sin ninguna instrucción dentro."}, {"id": "d", "texto": "Conteniendo únicamente declaraciones de variables globales."}]	b	El diseño descendente delega el trabajo detallado a funciones específicas; main queda como un resumen legible de "qué hace el programa, en qué orden".	Cómo se ve un main bien modularizado con diseño descendente.
prog01_p24	201	ejercicio	float base = 6.0f, altura = 4.5f, area;  area = base * altura / 2;  printf("%.2f", area);  ¿Qué imprime?	[{"id": "a", "texto": "13.50"}, {"id": "b", "texto": "27.00"}, {"id": "c", "texto": "10.50"}, {"id": "d", "texto": "13.5000"}]	a	base*altura = 27.0; dividido entre 2 da 13.5; %.2f lo imprime con dos decimales: 13.50.	Trazar el cálculo del área de un triángulo con variables float y formato de impresión con decimales fijos.
prog03_p24	203	ejercicio	int maximo(int a,int b,int c);  se escribe antes de main, y la definición completa de maximo aparece después de main, que la llama. ¿Por qué hace falta ese prototipo antes de main?	[{"id": "a", "texto": "Porque el compilador procesa el archivo de arriba hacia abajo y necesita conocer la firma de maximo antes de encontrar su llamada dentro de main, ya que la definición completa está más abajo."}, {"id": "b", "texto": "Por pura estética, no cambia nada si se omite."}, {"id": "c", "texto": "Porque maximo es una función void."}, {"id": "d", "texto": "Porque maximo tiene exactamente 3 parámetros."}]	a	Sin el prototipo, al llegar a la llamada dentro de main el compilador todavía no habría visto ninguna declaración de maximo (su definición está más abajo en el archivo) y reportaría un error o una advertencia grave.	Necesidad del prototipo cuando la definición de la función va después de su primera llamada.
prog01_p1	201	teoria	En el proceso de compilación de un programa en C con gcc, ¿cuál es el orden correcto de las cuatro etapas?	[{"id": "a", "texto": "Compilador → Preprocesador → Ensamblador → Enlazador."}, {"id": "b", "texto": "Preprocesador → Compilador → Ensamblador → Enlazador."}, {"id": "c", "texto": "Ensamblador → Compilador → Preprocesador → Enlazador."}, {"id": "d", "texto": "Preprocesador → Enlazador → Compilador → Ensamblador."}]	b	El preprocesador procesa las directivas #, el compilador traduce el código preprocesado a ensamblador, el ensamblador lo traduce a código objeto y el enlazador combina ese código objeto con las librerías necesarias para producir el ejecutable.	Orden de las cuatro etapas del proceso de compilación en C.
prog01_p2	201	teoria	¿Qué hace el preprocesador con una directiva como #include <stdio.h>?	[{"id": "a", "texto": "La compila directamente a código máquina."}, {"id": "b", "texto": "Procesa las directivas que empiezan por #, sustituyéndolas (en este caso, incluyendo las declaraciones necesarias de la librería) antes de compilar."}, {"id": "c", "texto": "La ignora, es solo un comentario para el programador."}, {"id": "d", "texto": "La ejecuta en tiempo de ejecución del programa."}]	b	El preprocesador es la primera etapa: procesa todas las directivas que empiezan por # (#include, #define, ...) y las sustituye antes de que el compilador vea el código.	Función del preprocesador sobre directivas que empiezan por #.
prog01_p3	201	teoria	¿Qué elemento es obligatorio, como mínimo, en todo programa en C ejecutable?	[{"id": "a", "texto": "Una directiva #define."}, {"id": "b", "texto": "Una función main, que es el punto de entrada: la primera función que se ejecuta al correr el programa."}, {"id": "c", "texto": "Un comentario inicial con el nombre del autor."}, {"id": "d", "texto": "Una variable global de tipo int."}]	b	Todo programa en C ejecutable necesita una función main, que es el punto de entrada del programa.	Estructura mínima de un programa en C: la función main como punto de entrada.
prog01_p4	201	ejercicio	El siguiente código tiene errores de sintaxis:  #include <stdio.h>  int main(void)  int x = 5  printf("x vale %d", x);  return 0; }  ¿Cuántos errores hay y cuáles son?	[{"id": "a", "texto": "1 error: falta el return."}, {"id": "b", "texto": "3 errores: falta la llave de apertura { después de main(void), falta el punto y coma tras int x = 5, y sobra la llave de cierre } final porque nunca se abrió la primera."}, {"id": "c", "texto": "2 errores: faltan dos puntos y comas."}, {"id": "d", "texto": "El código es válido, compila sin problemas."}]	b	Faltan la llave { que abre el cuerpo de main y el ; tras la declaración de x; y sobra la } final, que en el original cierra un bloque que nunca se abrió.	Detectar errores de sintaxis comunes: llaves y puntos y coma faltantes o sobrantes.
prog01_p5	201	teoria	¿Cuál de los cuatro tipos de datos básicos de C representa un solo carácter (código ASCII)?	[{"id": "a", "texto": "int"}, {"id": "b", "texto": "float"}, {"id": "c", "texto": "double"}, {"id": "d", "texto": "char"}]	d	char almacena un solo carácter, representado internamente por su código ASCII.	Identificar el tipo de dato básico para un solo carácter.
prog01_p6	201	ejercicio	En un compilador típico de 64 bits (por ejemplo gcc en Linux), ¿cuántos bytes ocupa normalmente un int?	[{"id": "a", "texto": "2"}, {"id": "b", "texto": "4"}, {"id": "c", "texto": "8"}, {"id": "d", "texto": "16"}]	b	int ocupa 4 bytes en la mayoría de compiladores de 64 bits, con rango aproximado de -2.147.483.648 a 2.147.483.647; el tamaño exacto debe confirmarse con sizeof en cada entorno.	Tamaño en bytes de int en un compilador típico de 64 bits.
prog01_p7	201	teoria	¿Cuál es el rango típico de un unsigned char (1 byte)?	[{"id": "a", "texto": "-128 a 127"}, {"id": "b", "texto": "0 a 255"}, {"id": "c", "texto": "0 a 65535"}, {"id": "d", "texto": "-255 a 255"}]	b	Un unsigned char ocupa 1 byte (8 bits) y, al no tener signo, representa valores de 0 a 255.	Rango de un tipo entero sin signo de 1 byte (unsigned char).
prog01_p8	201	teoria	El sufijo f al final de un literal numérico, como en 3.14f, ¿qué le indica al compilador?	[{"id": "a", "texto": "Que el valor es una constante entera larga."}, {"id": "b", "texto": "Que el literal debe interpretarse como float (precisión simple), no como double."}, {"id": "c", "texto": "Que el valor no puede modificarse (equivalente a const)."}, {"id": "d", "texto": "Que el valor es sin signo (unsigned)."}]	b	Los sufijos de un literal indican al compilador el tipo exacto: f para float, L/LL para enteros largos, U para sin signo, L para long double.	Significado del sufijo f en un literal numérico (float).
prog01_p9	201	teoria	¿Cuál es el especificador de formato correcto para imprimir una variable long int con printf?	[{"id": "a", "texto": "%d"}, {"id": "b", "texto": "%ld"}, {"id": "c", "texto": "%lld"}, {"id": "d", "texto": "%f"}]	b	Cada tipo tiene su propio especificador: %d para int, %ld para long int, %lld para long long int; usar el incorrecto es un error común que produce salidas basura.	Especificador de formato correcto en printf para cada tipo entero.
prog01_p10	201	ejercicio	char letra = 'A'; printf("%d", letra);  ¿Qué imprime?	[{"id": "a", "texto": "A"}, {"id": "b", "texto": "65"}, {"id": "c", "texto": "0"}, {"id": "d", "texto": "Error de compilación, porque %d no sirve para char."}]	b	Internamente un char es un entero pequeño; 'A' corresponde al código ASCII 65, que es lo que %d imprime.	Relación entre un char y su código ASCII al imprimirlo con %d.
s04_p1	4	teoria	¿Qué representa el producto de matriz por vector A*x en un sistema Ax = b?	[{"id": "a", "texto": "Una suma de escalares independientes."}, {"id": "b", "texto": "Una combinación lineal de las columnas de A ponderadas por las componentes de x."}, {"id": "c", "texto": "El producto punto de todos los elementos de A por b."}, {"id": "d", "texto": "La transpuesta de la matriz A."}]	b	El producto Ax expresa la combinación lineal de las columnas de A: x1*a1 + x2*a2 + ... + xn*an.	Interpretación de Ax como combinación lineal de columnas.
prog01_p11	201	teoria	¿Cuál es la diferencia principal entre #define NOMBRE valor y const tipo NOMBRE = valor;?	[{"id": "a", "texto": "No hay ninguna diferencia real."}, {"id": "b", "texto": "#define es una sustitución de texto del preprocesador, sin tipo ni verificación; const declara una variable con tipo, verificada por el compilador."}, {"id": "c", "texto": "const es más antiguo y ya no se recomienda usar."}, {"id": "d", "texto": "#define solo funciona con números enteros."}]	b	#define es sustitución de texto pura (sin tipo, la aplica el preprocesador); const califica una variable con tipo, cuyo uso el compilador sí verifica.	Diferencia entre una constante por #define y una constante con const.
prog01_p12	201	teoria	Una macro definida con #define que recibe parámetros, ¿cómo se procesa?	[{"id": "a", "texto": "El compilador la trata como una llamada a función normal en tiempo de ejecución."}, {"id": "b", "texto": "El preprocesador sustituye cada llamada por su definición textual, parámetro por parámetro, antes de que el compilador vea el código; no implica una llamada real en tiempo de ejecución."}, {"id": "c", "texto": "Se ejecuta una sola vez al iniciar el programa."}, {"id": "d", "texto": "Requiere que todos los parámetros sean del mismo tipo."}]	b	Una macro con parámetros es sustitución textual del preprocesador: reemplaza cada llamada por su definición, parámetro por parámetro, antes de compilar; a diferencia de una función, no hay una llamada real en tiempo de ejecución.	Cómo procesa el preprocesador una macro con parámetros (sustitución textual, no llamada).
prog01_p13	201	teoria	¿Cuál de los siguientes es un identificador (nombre de variable) válido en C?	[{"id": "a", "texto": "2valor"}, {"id": "b", "texto": "valor_2"}, {"id": "c", "texto": "int"}, {"id": "d", "texto": "precio-total"}]	b	Un identificador empieza por letra o guion bajo, sigue con letras/dígitos/guiones bajos, y no puede ser una palabra reservada (int) ni empezar con un dígito (2valor) ni contener un guion medio (precio-total, que C interpretaría como una resta).	Reglas de formación de un identificador (nombre de variable) válido en C.
prog01_p14	201	ejercicio	int a=7, b=2; printf("%d", a/b);  ¿Qué imprime?	[{"id": "a", "texto": "3.5"}, {"id": "b", "texto": "3"}, {"id": "c", "texto": "4"}, {"id": "d", "texto": "1"}]	b	La división entre dos int trunca el resultado: 7/2 da 3 (se descarta la parte decimal).	División entera entre dos variables int (trunca, no redondea).
prog01_p15	201	ejercicio	int a=7, b=2; printf("%d", a%b);  ¿Qué imprime?	[{"id": "a", "texto": "3"}, {"id": "b", "texto": "1"}, {"id": "c", "texto": "0"}, {"id": "d", "texto": "3.5"}]	b	% es el operador de residuo (módulo); 7 dividido entre 2 da cociente 3 y residuo 1.	Operador de residuo (%) entre dos enteros.
prog01_p16	201	ejercicio	int a=7, b=2; printf("%f", (float)a / b);  ¿Qué imprime?	[{"id": "a", "texto": "3"}, {"id": "b", "texto": "3.500000"}, {"id": "c", "texto": "3.5"}, {"id": "d", "texto": "Error de compilación"}]	b	(float)a convierte a a real antes de dividir, así que la división ya no trunca: 7.0/2 = 3.5; %f imprime 6 decimales por defecto: 3.500000.	Efecto de una conversión explícita (cast) antes de una división para evitar el truncamiento entero.
prog01_p17	201	teoria	¿Por qué scanf("%d", &edad) necesita el operador & delante de la variable edad?	[{"id": "a", "texto": "Es un error común, en realidad no se necesita."}, {"id": "b", "texto": "Porque scanf necesita la dirección de memoria de la variable para poder escribir el valor leído ahí; sin &, no tendría dónde guardar el dato."}, {"id": "c", "texto": "Porque edad es una variable de tipo entero."}, {"id": "d", "texto": "Solo se necesita si edad no fue inicializada antes."}]	b	scanf escribe el valor leído directamente en memoria, así que necesita la dirección de la variable (&); las cadenas (char[]) son la excepción porque el nombre del arreglo ya es una dirección.	Por qué scanf requiere el operador & (dirección de memoria) delante de la variable.
prog01_p18	201	ejercicio	int x=5; x++; printf("%d", x);  ¿Qué imprime?	[{"id": "a", "texto": "5"}, {"id": "b", "texto": "6"}, {"id": "c", "texto": "4"}, {"id": "d", "texto": "Error de compilación"}]	b	x++ incrementa x en 1 como sentencia independiente; después x vale 6.	Efecto del operador de incremento (++) como sentencia independiente.
prog01_p19	201	ejercicio	int x=5; printf("%d", x++);  ¿Qué imprime, y en qué orden actúa el postfijo ++?	[{"id": "a", "texto": "Imprime 6: primero incrementa y luego usa el valor."}, {"id": "b", "texto": "Imprime 5: el postfijo x++ usa primero el valor actual de x en la expresión y luego lo incrementa."}, {"id": "c", "texto": "Imprime 5 y no incrementa x."}, {"id": "d", "texto": "Produce un error porque ++ no puede usarse dentro de printf."}]	b	El postfijo x++ evalúa la expresión con el valor actual de x (5) y el incremento ocurre después; x queda en 6 pero lo impreso es 5.	Diferencia entre incremento postfijo (x++) y su efecto dentro de una expresión.
prog01_p20	201	ejercicio	int x=5; printf("%d", ++x);  ¿Qué imprime?	[{"id": "a", "texto": "5"}, {"id": "b", "texto": "6"}, {"id": "c", "texto": "4"}, {"id": "d", "texto": "Depende del compilador."}]	b	El prefijo ++x incrementa x primero y luego usa el nuevo valor en la expresión: se imprime 6.	Diferencia entre incremento prefijo (++x) y postfijo (x++) dentro de una expresión.
prog01_p21	201	ejercicio	int a=3, b=4, c; c = a + b * 2;  ¿Cuál es el valor final de c?	[{"id": "a", "texto": "14"}, {"id": "b", "texto": "11"}, {"id": "c", "texto": "10"}, {"id": "d", "texto": "8"}]	b	Por precedencia de operadores, * se evalúa antes que +: b*2=8, luego a+8=11.	Precedencia de operadores aritméticos (* antes que +) al evaluar una expresión.
prog01_p22	201	ejercicio	int a=10; a += 5; a *= 2; printf("%d", a);  ¿Qué imprime?	[{"id": "a", "texto": "20"}, {"id": "b", "texto": "30"}, {"id": "c", "texto": "15"}, {"id": "d", "texto": "25"}]	b	a += 5 deja a en 15; a *= 2 lo duplica a 30.	Trazar operadores de asignación compuesta (+=, *=) en secuencia.
prog01_p23	201	teoria	¿Qué valores puede producir un operador relacional en C, como en la expresión 5 > 3?	[{"id": "a", "texto": "verdadero o falso, como un tipo booleano nativo distinto de los enteros."}, {"id": "b", "texto": "0 (falso) o 1 (verdadero), representados como enteros — C no tenía un tipo booleano nativo antes de C99 (stdbool.h)."}, {"id": "c", "texto": "Cualquier número entero, según la magnitud de la comparación."}, {"id": "d", "texto": "Un error de compilación si se usa fuera de un if."}]	b	Los operadores relacionales (== != < > <= >=) resultan en 0 (falso) o 1 (verdadero), valores enteros ordinarios.	Valores que produce un operador relacional en C (0 o 1, no un booleano nativo).
s04_p2	4	teoria	Una matriz cuadrada A de orden n x n es invertible (no singular) si y solo si:	[{"id": "a", "texto": "Existe una matriz B tal que AB = BA = I_n y su determinante es distinto de cero."}, {"id": "b", "texto": "Todas sus entradas son mayores que cero."}, {"id": "c", "texto": "Su transpuesta es igual a cero."}, {"id": "d", "texto": "Tiene más filas que columnas."}]	a	Una matriz es invertible si posee matriz inversa única A^-1 que satisface AA^-1 = I_n, equivalente a det(A) ≠ 0.	Definición y condición de invertibilidad (no singularidad) de una matriz cuadrada.
s04_p3	4	ejercicio	¿Cuál es la inversa de la matriz A = [2 5; 1 3]?	[{"id": "a", "texto": "[3 -5; -1 2]"}, {"id": "b", "texto": "[2 -1; -5 3]"}, {"id": "c", "texto": "[-3 5; 1 -2]"}, {"id": "d", "texto": "No tiene inversa porque det(A) = 0."}]	a	det(A) = 2(3) - 5(1) = 1. La inversa es 1/1 * [3 -5; -1 2] = [3 -5; -1 2].	Cálculo de la inversa de una matriz 2x2 usando la fórmula del determinante.
s04_p4	4	ejercicio	Dada A = [4 2; 3 2], si Ax = [10; 8], ¿cuál es el vector solución x?	[{"id": "a", "texto": "x = [2; 1]"}, {"id": "b", "texto": "x = [1; 2]"}, {"id": "c", "texto": "x = [0; 4]"}, {"id": "d", "texto": "x = [3; -1]"}]	a	det(A) = 2, A^-1 = [1 -1; -1.5 2]. Multiplicando por [10; 8] resulta [2; 1].	Resolución de sistemas de ecuaciones lineales mediante la matriz inversa x = A^-1 b.
s04_p5	4	teoria	¿Cuál de las siguientes identidades para la inversa del producto (AB)^-1 es correcta?	[{"id": "a", "texto": "(AB)^-1 = A^-1 B^-1"}, {"id": "b", "texto": "(AB)^-1 = B^-1 A^-1"}, {"id": "c", "texto": "(AB)^-1 = AB"}, {"id": "d", "texto": "(AB)^-1 = (A+B)^-1"}]	b	La inversa del producto de dos matrices invertibles invierte el orden de los factores: (AB)^-1 = B^-1 A^-1.	Propiedades algebraicas de la matriz inversa (orden invertido en el producto).
s04_p6	4	teoria	El algoritmo de Gauss-Jordan para calcular la inversa de una matriz A transforma la matriz aumentada [A | I_n] en:	[{"id": "a", "texto": "[I_n | A^-1] mediante operaciones elementales por filas."}, {"id": "b", "texto": "[A^-1 | A] mediante intercambio de columnas únicamente."}, {"id": "c", "texto": "[0 | I_n] para cualquier matriz."}, {"id": "d", "texto": "[A^T | I_n]."}]	a	Al aplicar operaciones elementales de fila sobre [A | I_n] hasta llevar el lado izquierdo a I_n, el lado derecho se convierte en A^-1.	Algoritmo de eliminación de Gauss-Jordan para hallar la matriz inversa [A|I] -> [I|A^-1].
s04_p7	4	ejercicio	Si A es una matriz 2x3 dada por A = [1 4 7; 2 5 8], ¿cuál es su transpuesta A^T?	[{"id": "a", "texto": "[1 2; 4 5; 7 8] (de tamaño 3x2)"}, {"id": "b", "texto": "[7 4 1; 8 5 2]"}, {"id": "c", "texto": "[1 4; 2 5; 7 8]"}, {"id": "d", "texto": "No se puede transponer una matriz rectangular."}]	a	La transpuesta A^T intercambia las filas por columnas: la primera fila de A (1 4 7) pasa a ser la primera columna de A^T.	Obtención de la matriz transpuesta A^T intercambiando filas por columnas.
s04_p8	4	teoria	Una matriz cuadrada A se define como simétrica si:	[{"id": "a", "texto": "A^T = A"}, {"id": "b", "texto": "A^T = -A"}, {"id": "c", "texto": "A^-1 = A"}, {"id": "d", "texto": "det(A) = 0"}]	a	Una matriz es simétrica cuando al transponerla se obtiene exactamente la misma matriz: A^T = A (a_ij = a_ji).	Definición de matriz simétrica (A^T = A).
s04_p9	4	teoria	Una matriz cuadrada K es antisimétrica si K^T = -K. ¿Qué propiedad deben cumplir sus elementos diagonales k_ii?	[{"id": "a", "texto": "Todos deben ser iguales a 1."}, {"id": "b", "texto": "Todos deben ser estrictamente cero (k_ii = 0)."}, {"id": "c", "texto": "Deben ser todos números impares."}, {"id": "d", "texto": "No tienen ninguna restricción."}]	b	Puesto que k_ii = -k_ii, se deduce que 2 k_ii = 0 => k_ii = 0 para toda entrada de la diagonal principal.	Propiedad de la diagonal principal en matrices antisimétricas (k_ii = 0).
s04_p10	4	ejercicio	Dada A = [2 5; 1 4], ¿cuál es su componente simétrica S = (1/2)(A + A^T)?	[{"id": "a", "texto": "[2 3; 3 4]"}, {"id": "b", "texto": "[0 2; -2 0]"}, {"id": "c", "texto": "[4 6; 6 8]"}, {"id": "d", "texto": "[1 0; 0 1]"}]	a	A^T = [2 1; 5 4]. La suma A+A^T = [4 6; 6 8]. Multiplicando por 1/2 resulta S = [2 3; 3 4].	Cálculo de la componente simétrica S = (1/2)(A + A^T) en la descomposición matricial.
s04_p11	4	ejercicio	Dada A = [2 5; 1 4], ¿cuál es su componente antisimétrica K = (1/2)(A - A^T)?	[{"id": "a", "texto": "[0 2; -2 0]"}, {"id": "b", "texto": "[2 3; 3 4]"}, {"id": "c", "texto": "[0 4; -4 0]"}, {"id": "d", "texto": "[1 -1; 1 -1]"}]	a	A - A^T = [0 4; -4 0]. Dividido entre 2 resulta K = [0 2; -2 0].	Cálculo de la componente antisimétrica K = (1/2)(A - A^T) en la descomposición matricial.
s04_p12	4	teoria	¿Cuál es el resultado de la expresión (AB)^T para matrices de dimensiones compatibles?	[{"id": "a", "texto": "B^T A^T"}, {"id": "b", "texto": "A^T B^T"}, {"id": "c", "texto": "(BA)^T"}, {"id": "d", "texto": "A B^T"}]	a	Al igual que con las inversas, la transpuesta de un producto de matrices invierte el orden: (AB)^T = B^T A^T.	Propiedad algebraicas de la transpuesta sobre un producto (orden invertido).
s04_p13	4	ejercicio	Si A es una matriz 3x3 cuya inversa es A^-1 = [1 0 -1; 0 2 0; 1 1 1], ¿cuál es la solución del sistema Ax = [2; 1; 0]?	[{"id": "a", "texto": "x = [2; 2; 3]"}, {"id": "b", "texto": "x = [1; 0; 1]"}, {"id": "c", "texto": "x = [0; 1; 2]"}, {"id": "d", "texto": "x = [-1; 2; 0]"}]	a	x = A^-1 b = [1(2)+0(1)-1(0); 0(2)+2(1)+0(0); 1(2)+1(1)+1(0)] = [2; 2; 3].	Uso directo de la matriz inversa para calcular la solución x = A^-1 b.
s04_p14	4	teoria	Si una matriz cuadrada A cumple que A^2 = I, ¿cuál es su inversa A^-1?	[{"id": "a", "texto": "La misma matriz A (A^-1 = A)."}, {"id": "b", "texto": "La matriz nula 0."}, {"id": "c", "texto": "No existe inversa."}, {"id": "d", "texto": "La matriz transpuesta A^T."}]	a	Como A * A = I, por definición de inversa se cumple directamente que A^-1 = A.	Identificar que una matriz involutiva (A^2 = I) es su propia inversa.
s04_p15	4	ejercicio	Dadas A = [1 2; 0 1] y B = [3 1; 2 1], ¿cuál es la matriz (AB)^-1?	[{"id": "a", "texto": "[1 -3; -2 7]"}, {"id": "b", "texto": "[7 3; 2 1]"}, {"id": "c", "texto": "[-1 3; 2 -7]"}, {"id": "d", "texto": "[1 0; 0 1]"}]	a	AB = [7 3; 2 1]. Su determinante es 7(1)-3(2)=1. Por tanto (AB)^-1 = [1 -3; -2 7].	Cálculo de la inversa del producto de dos matrices.
s04_p16	4	teoria	Si A es una matriz no singular (invertible), ¿cuál es la relación entre (A^T)^-1 y (A^-1)^T?	[{"id": "a", "texto": "Son exactamente iguales: (A^T)^-1 = (A^-1)^T."}, {"id": "b", "texto": "Tienen signos opuestos."}, {"id": "c", "texto": "No guardan ninguna relación."}, {"id": "d", "texto": "Solo son iguales si A es diagonal."}]	a	La operación de transposición conmuta con la inversión de matrices: (A^T)^-1 = (A^-1)^T.	Conmutatividad entre las operaciones de transposición e inversión matricial.
s04_p17	4	ejercicio	Para A = [1 -1 3; 2 0 4], calcular la matriz M = A A^T.	[{"id": "a", "texto": "[11 14; 14 20]"}, {"id": "b", "texto": "[10 12; 12 16]"}, {"id": "c", "texto": "[11 0; 0 20]"}, {"id": "d", "texto": "No se puede calcular A A^T."}]	a	A^T tiene tamaño 3x2. El producto (2x3)(3x2) da una matriz 2x2: entradas 1+1+9=11, 2+0+12=14, 14, 4+0+16=20.	Cálculo del producto de una matriz por su transpuesta A A^T.
s04_p18	4	teoria	Para cualquier matriz A de tamaño m x n, ¿qué propiedad especial cumple la matriz M = A A^T?	[{"id": "a", "texto": "Siempre es una matriz cuadrada y simétrica de orden m x m."}, {"id": "b", "texto": "Siempre es una matriz antisimétrica."}, {"id": "c", "texto": "Siempre es igual a la matriz identidad."}, {"id": "d", "texto": "Siempre es singular."}]	a	Puesto que (A A^T)^T = (A^T)^T A^T = A A^T, la matriz producto M = A A^T es intrínsecamente simétrica.	Simetría garantizada del producto M = A A^T.
s04_p19	4	ejercicio	¿Para qué valor del parámetro k la matriz A = [2 k; 4 6] NO tiene inversa?	[{"id": "a", "texto": "k = 3"}, {"id": "b", "texto": "k = 0"}, {"id": "c", "texto": "k = 6"}, {"id": "d", "texto": "k = -3"}]	a	La matriz es singular si det(A) = 0 => 2(6) - 4k = 0 => 12 - 4k = 0 => k = 3.	Determinación de parámetros para los cuales una matriz es singular (det = 0).
s04_p20	4	teoria	Si A es una matriz escalar del tipo A = c I_n con c ≠ 0, ¿cuál es su inversa A^-1?	[{"id": "a", "texto": "A^-1 = (1/c) I_n"}, {"id": "b", "texto": "A^-1 = c I_n"}, {"id": "c", "texto": "A^-1 = -c I_n"}, {"id": "d", "texto": "A^-1 = I_n"}]	a	(c I_n) * ((1/c) I_n) = (c * (1/c)) (I_n I_n) = 1 * I_n = I_n.	Inversa de una matriz escalar o múltiplo de la identidad.
s04_p21	4	ejercicio	Si A es una matriz cuadrada tal que A^T = -A y tiene dimensión 3x3, ¿cuánto vale su entrada a_22?	[{"id": "a", "texto": "0"}, {"id": "b", "texto": "1"}, {"id": "c", "texto": "-1"}, {"id": "d", "texto": "No se puede saber."}]	a	Por ser antisimétrica (A^T = -A), todas sus entradas en la diagonal principal son cero (a_11=a_22=a_33=0).	Identificar ceros diagonales en matrices antisimétricas.
s04_p22	4	ejercicio	Resolver el sistema Ax = b usando matriz inversa donde A = [1 2; 3 4] y b = [5; 11].	[{"id": "a", "texto": "x = [1; 2]"}, {"id": "b", "texto": "x = [2; 1]"}, {"id": "c", "texto": "x = [3; 1]"}, {"id": "d", "texto": "x = [0; 2.5]"}]	a	det(A) = -2, A^-1 = [-2 1; 1.5 -0.5]. Multiplicando por [5; 11]: x1 = -10+11=1, x2 = 7.5-5.5=2.	Resolución de sistemas 2x2 mediante la matriz inversa.
s04_p23	4	teoria	¿Qué ocurre con el determinante de la matriz inversa det(A^-1) respecto al determinante de A?	[{"id": "a", "texto": "det(A^-1) = 1 / det(A)"}, {"id": "b", "texto": "det(A^-1) = -det(A)"}, {"id": "c", "texto": "det(A^-1) = det(A)"}, {"id": "d", "texto": "det(A^-1) = (det(A))^2"}]	a	Como A A^-1 = I, se cumple det(A A^-1) = det(A)det(A^-1) = det(I) = 1 => det(A^-1) = 1/det(A).	Relación entre el determinante de una matriz y el determinante de su inversa.
s04_p24	4	ejercicio	Si A = [3 0; 0 4], ¿cuál es su inversa A^-1?	[{"id": "a", "texto": "[1/3 0; 0 1/4]"}, {"id": "b", "texto": "[4 0; 0 3]"}, {"id": "c", "texto": "[-3 0; 0 -4]"}, {"id": "d", "texto": "[1/4 0; 0 1/3]"}]	a	La inversa de una matriz diagonal se obtiene invirtiendo cada uno de los elementos de su diagonal principal: diag(1/3, 1/4).	Inversa de una matriz diagonal.
\.


--
-- Data for Name: quices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quices (id, materia_id, titulo, tipo, semana_numero, semana_id, descripcion, preguntas, creado_en) FROM stdin;
\.


--
-- Data for Name: registros_asistencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registros_asistencia (id, sesion_id, estudiante_id, estado, justificada, justificacion_comentario, escaneado_en, notificacion_enviada, creado_en) FROM stdin;
\.


--
-- Data for Name: semanas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semanas (id, materia_id, numero, unidad_nombre, capitulo_grossman, ra, ra_descripcion, duracion_examen_min, preguntas_examen_count, contenido_json, objetivos_json, notas_pdf_url, guia_pdf_url, diapositivas_pdf_url, clase_web_url, ejercicios_resueltos_url, banco_preguntas_url, tipo_examen, codigo_fuente_url) FROM stdin;
10	1	10	Espacios vectoriales	Capítulo 5 (Grossman) — 5.4, 5.5	RA5.4-RA5.5	Independencia lineal, bases y dimensión.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
11	1	11	Espacios vectoriales	Capítulo 5 (Grossman) — 5.6, 5.7	RA5.6-RA5.7	Rango, nulidad, espacio renglón/columna de una matriz, y cambio de base.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
12	1	12	Espacios vectoriales con producto interno	Capítulo 6 (Grossman) — 6.1-6.3	RA6.1-RA6.3	Bases ortonormales y proyecciones en Rn, aproximación por mínimos cuadrados, espacios con producto interno.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
13	1	13	Transformaciones lineales	Capítulo 7 (Grossman) — 7.1, 7.2	RA7.1-RA7.2	Definición y ejemplos de transformaciones lineales; imagen y núcleo.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
14	1	14	Transformaciones lineales	Capítulo 7 (Grossman) — 7.3, 7.4	RA7.3-RA7.4	Representación matricial de una transformación lineal; isomorfismos e isometrías.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
15	1	15	Valores característicos, vectores característicos y formas canónicas	Capítulo 8 (Grossman) — 8.1-8.3	RA8.1-RA8.3	Eigenvalores y eigenvectores; matrices semejantes y diagonalización; matrices simétricas y diagonalización ortogonal.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
16	1	16	Valores característicos, vectores característicos y formas canónicas	Capítulo 8 (Grossman) — 8.4-8.6	RA8.4-RA8.6	Formas cuadráticas y secciones cónicas, forma canónica de Jordan, aplicaciones (ecuaciones diferenciales, modelos de población) y cierre del curso.	30	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
204	2	04	Estructuras Repetitivas	Módulo 2	RA2.3-RA2.4	Bucles while, do-while y for para control iterativo.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
205	2	05	Funciones y Modularidad	Módulo 3	RA3.1-RA3.2	Diseño descendente, modularización y paso de parámetros.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
206	2	06	Ámbito y Recursión	Módulo 3	RA3.3-RA3.4	Variables locales/globales y funciones recursivas básicas.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
207	2	07	Arreglos Unidimensionales	Módulo 4	RA4.1-RA4.2	Vectores, indexación y recorrido con ciclos.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
208	2	08	Matrices y Tablas	Módulo 4	RA4.3-RA4.4	Arreglos multidimensionales y álgebra computacional.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
209	2	09	Cadenas de Caracteres	Módulo 5	RA5.1-RA5.2	Manipulación de texto, subcadenas y comparación.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
210	2	10	Estructuras y Registros	Módulo 5	RA5.3-RA5.4	Modelado de entidades compuestas mediante structs.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
211	2	11	Algoritmos de Búsqueda	Módulo 6	RA6.1-RA6.2	Búsqueda lineal y búsqueda binaria eficiente.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
212	2	12	Algoritmos de Ordenamiento	Módulo 6	RA6.3-RA6.4	Burbuja, Selección e Inserción directa.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
213	2	13	Persistencia y Archivos	Módulo 7	RA7.1-RA7.2	Lectura y escritura de archivos de texto y binarios.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
214	2	14	Punteros y Memoria Dinámica	Módulo 7	RA7.3-RA7.4	Direcciones de memoria, punteros y asignación dinámica.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
215	2	15	Introducción a POO	Módulo 8	RA8.1-RA8.2	Clases, objetos, atributos y encapsulamiento.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
216	2	16	Proyecto de Programación	Módulo 8	RA8.3-RA8.4	Integración de algoritmos y solución de ingeniería.	30	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
308	3	08	Imagen Digital y Espacios de Color	Módulo 1	RA1.1-RA1.2	Muestreo, cuantización, espacios RGB, HSV y escala de grises.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
309	3	09	Histogramas y Contraste	Módulo 1	RA1.3-RA1.4	Ecualización de histograma y ajuste de contraste.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
310	3	10	Filtrado Espacial	Módulo 2	RA2.1-RA2.2	Convolución 2D, filtro Gaussiano y eliminación de ruido.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
311	3	11	Detección de Bordes	Módulo 2	RA2.3-RA2.4	Operadores Sobel, Prewitt, Laplaciano y algoritmo de Canny.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
312	3	12	Segmentación de Imágenes	Módulo 3	RA3.1-RA3.2	Umbralización global, Otsu y segmentación por color.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
313	3	13	Morfología Matemática	Módulo 3	RA3.3-RA3.4	Erosión, dilatación, apertura, cierre y gradiente morfológico.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
314	3	14	Descriptores de Forma	Módulo 4	RA4.1-RA4.2	Contornos, momentos de Hu y descriptores de contorno.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
315	3	15	Introducción a CNNs	Módulo 4	RA4.3-RA4.4	Redes neuronales convolucionales para clasificación de imágenes.	30	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
316	3	16	Proyecto de Inspección Visual	Módulo 5	RA5.1-RA5.2	Sistema automático de control de calidad por visión industrial.	30	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
5	1	05	Vectores y matrices	Capítulo 2 (Grossman) — 2.6, 2.7	RA2.6-RA2.7	Matrices elementales, matrices inversas y factorización LU.	25	5	\N	[]	/uploads/semanas/5-notas.pdf	/uploads/semanas/5-guia.pdf	/uploads/semanas/5-diapositivas.pdf	/uploads/semanas-html/5/material-web/index.html	\N	\N	combinada	\N
201	2	01	Fundamentos de Algoritmos	Módulo 1	RA1.1-RA1.2	Análisis de problemas, pseudocódigo y diagramas de flujo.	15	\N	\N	[]	/notas/materia-2/semana-01/notas.pdf	/notas/materia-2/semana-01/guia.pdf	/notas/materia-2/semana-01/diapositivas.pdf	/notas/materia-2/semana-01/material-web/index.html	\N	\N	combinada	\N
203	2	03	Estructuras Condicionales	Módulo 2	RA2.1-RA2.2	Bifurcaciones if-else, expresiones booleanas y switch-case.	20	\N	\N	[]	/notas/materia-2/semana-03/notas.pdf	/notas/materia-2/semana-03/guia.pdf	/notas/materia-2/semana-03/diapositivas.pdf	/notas/materia-2/semana-03/material-web/index.html	\N	\N	combinada	\N
4	1	04	Vectores y matrices	Capítulo 2 (Grossman) — 2.3-2.5	RA2.3-RA2.5	Matrices y sistemas de ecuaciones lineales; inversa y transpuesta de una matriz cuadrada.	20	5	\N	[]	/notas/materia-1/semana-04/notas.pdf	/notas/materia-1/semana-04/guia.pdf	/notas/materia-1/semana-04/diapositivas.pdf	/notas/materia-1/semana-04/material-web/index.html	\N	\N	combinada	\N
6	1	06	Determinantes	Capítulo 3 (Grossman) — 3.1-3.3	RA3.1-RA3.3	Definiciones y propiedades de los determinantes, regla de Cramer, determinantes e inversas.	25	5	\N	[]	/uploads/semanas/6-notas.pdf	/uploads/semanas/6-guia.pdf	/uploads/semanas/6-diapositivas.pdf	/uploads/semanas-html/6/material-web/index.html	\N	\N	combinada	\N
7	1	07	Vectores en R2 y R3	Capítulo 4 (Grossman) — 4.1-4.3	RA4.1-RA4.3	Vectores en el plano, producto escalar y proyecciones en R2, vectores en el espacio.	20	5	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
8	1	08	Vectores en R2 y R3	Capítulo 4 (Grossman) — 4.4, 4.5	RA4.4-RA4.5	Producto cruz de dos vectores; rectas y planos en el espacio.	20	5	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
9	1	09	Espacios vectoriales	Capítulo 5 (Grossman) — 5.1-5.3	RA5.1-RA5.3	Definición y propiedades básicas de espacio vectorial, subespacios, combinación lineal y espacio generado.	25	5	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
406	4	06	Práctica 4: Aritmética de Punto Fijo Q15 (Q1.15) en Hardware	Módulo 3 — Aritmética DSP en VHDL	RA3.3-RA3.4	Implementación del paquete VHDL pkg_q15.vhd: formato Q1.15 con signo, suma/resta con saturación, multiplicación Q15 con truncado y conversión entre entero/flotante.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	/uploads/semanas-codigo/406-codigo.zip
409	4	09	Práctica 5: Filtros IIR 1.er Orden RC y Biquad Butterworth	Módulo 5 — Filtros IIR y Calculadora Web	RA5.1-RA5.2	Implementación de filtros IIR recursivos (RC y Biquad Butterworth) con 5 coeficientes de 32 bits, calculadora web interactiva y simulación continua con Web Audio API.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	/uploads/semanas-codigo/409-codigo.zip
1	1	01	Sistemas de ecuaciones lineales	Capítulo 1 (Grossman) — 1.1, 1.2	RA1.1-RA1.2	Reconocer la forma general de un sistema de ecuaciones lineales, y resolver e interpretar geométricamente sistemas de dos ecuaciones con dos incógnitas.	15	5	\N	[]	/notas/materia-1/semana-01/notas.pdf	/notas/materia-1/semana-01/guia.pdf	/notas/materia-1/semana-01/diapositivas.pdf	/notas/materia-1/semana-01/material-web/index.html	\N	\N	combinada	\N
2	1	02	Sistemas de ecuaciones lineales	Capítulo 1 (Grossman) — 1.2b, 1.3, 1.4	RA1.2b-RA1.4	Resolver sistemas de m ecuaciones con n incógnitas mediante eliminación de Gauss-Jordan, y reconocer las propiedades particulares de los sistemas homogéneos.	20	5	\N	[]	/notas/materia-1/semana-02/notas.pdf	/notas/materia-1/semana-02/guia.pdf	/notas/materia-1/semana-02/diapositivas.pdf	/notas/materia-1/semana-02/material-web/index.html	\N	\N	combinada	\N
410	4	10	Práctica 6: Integración SoC del Filtro FIR en Platform Designer	Módulo 5 — Integración SoC Nios II	RA5.3-RA5.4	Ensamblado del sistema SoC sistema_dsp.qsys con fir_avalon, memoria de 64 KB, consola JTAG UART, PIOs de switches/LEDs y software C de filtrado de señal bi-tonal.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	/uploads/semanas-codigo/410-codigo.zip
411	4	11	Práctica 7: Adquisición Analógica en Tiempo Real (ADC SPI)	Módulo 6 — Controladores SPI para ADC	RA5.5-RA5.6	Controlador SPI en VHDL para ADC serie de 12 bits en modo free-running, máquina de estados FSM de 16 pulsos SCLK, IP Avalon-MM y conversión a milivoltios en Nios II.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	/uploads/semanas-codigo/411-codigo.zip
417	5	01	Sesión 01 — Tema pendiente de definir		RA1	Objetivo de aprendizaje pendiente de definir.	15	\N	\N	[{"ra": "RA1", "descripcion": "Objetivo de aprendizaje pendiente de definir."}]	\N	\N	\N	/uploads/semanas-html/417/material/index.html	\N	\N	combinada	\N
202	2	02	Variables y Tipos de Datos	Módulo 1	RA1.3-RA1.4	Expresiones aritméticas, lógicas y asignación de memoria.	15	\N	\N	[]	/notas/materia-2/semana-02/notas.pdf	/notas/materia-2/semana-02/guia.pdf	/notas/materia-2/semana-02/diapositivas.pdf	/notas/materia-2/semana-02/material-web/index.html	\N	\N	combinada	\N
412	4	12	Práctica 8: Procesamiento de Audio Streaming (Avalon-ST)	Módulo 6 — Protocolo Streaming Avalon-ST	RA5.7-RA5.8	Diseño de tubería de procesamiento de audio por flujos (streaming) con protocolo de handshaking valid/ready y gestión de backpressure en tiempo real.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
413	4	13	Práctica 9: Filtros Recursivos IIR de Segundo Orden (Biquad SOS)	Módulo 7 — Filtros Biquad IIR	RA6.1-RA6.2	Cálculo de coeficientes mediante RBJ Audio EQ Cookbook, implementación en VHDL de la ecuación en diferencias de 2º orden y almacenamiento de estados pasados.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
402	4	02	Práctica 1: Arquitectura Nios II, Bus Avalon-MM y BSP	Módulo 1 — Bus Avalon-MM y BSP	RA1.3-RA1.4	Construcción y asignación del mapa de memoria en bus Avalon-MM, configuración de reloj maestro (50 MHz), generación del Board Support Package (BSP) y depuración por JTAG.	20	\N	\N	[]	\N	\N	\N	/uploads/semanas-html/402/material-web/index.html	\N	\N	combinada	/uploads/semanas-codigo/402-codigo.zip
407	4	07	Práctica 4: Conversión ADC (LTC2308) e Interrupciones Timer	Módulo 4 — Muestreo y Adquisición ADC	RA4.1-RA4.2	Módulo 0 de adquisición: interfaz SPI dedicada para el ADC LTC2308 (12 bits) de la DE1-SoC, muestreo periódico por interrupción de Timer e integración con la tubería Q15.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	/uploads/semanas-codigo/407-codigo.zip
408	4	08	Práctica 5: Filtros Digitales FIR Reconfigurables (N=9 taps)	Módulo 4 — Procesamiento Digital FIR	RA4.3-RA4.4	Diseño e implementación en VHDL de IP Avalon-MM de filtro FIR (fir_avalon.vhd) con 6 modos fijos (LP, HP, BP, BR) en formato Q15 y registros de control de 32 bits.	20	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	/uploads/semanas-codigo/408-codigo.zip
416	4	16	Práctica 11: Automatización y Flujo Headless con Quartus CLI	Módulo 8 — Automatización y CI/CD	RA7.3-RA7.4	Automatización de compilación y programación de bitstreams .sof en FPGA con scripts Tcl (compilar.tcl), Shell (programar.sh) y Makefile con Quartus CLI.	30	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
401	4	01	Práctica 1: Sistema Nios II Básico en FPGA DE1-SoC	Módulo 1 — Co-diseño Hardware/Software	RA1.1-RA1.2	Primer contacto con el flujo co-diseño: crear un sistema Nios II mínimo en Platform Designer (Qsys), sintetizarlo en Quartus Prime sobre DE1-SoC (Cyclone V SE) y ejecutar un programa C "Hello World" por consola JTAG UART.	20	\N	\N	[]	/notas/materia-4/semana-01/notas.pdf	/notas/materia-4/semana-01/guia.pdf	/notas/materia-4/semana-01/diapositivas.pdf	/notas/materia-4/semana-01/material-web/index.html	\N	\N	combinada	/uploads/semanas-codigo/401-codigo.zip
405	4	05	Práctica 3: Generador PWM Avanzado	Módulo 3 — Periféricos Propios	RA3.1-RA3.2	Modulación por ancho de pulso (PWM) avanzada en hardware VHDL con control de frecuencia dinámico y registros Avalon-MM de 32 bits.	20	\N	\N	[]	\N	\N	\N	/uploads/semanas-html/405/material-web/index.html	\N	\N	combinada	/uploads/semanas-codigo/405-codigo.zip
404	4	04	Práctica 4: Aritmética Q15 y Adquisición ADC (LTC2308)	Módulo 2 — Aritmética y Muestreo ADC	RA2.3-RA2.4	Aritmética de punto fijo Q15 (pkg_q15.vhd), adquisición analógica con ADC LTC2308 (12 bits), muestreo periódico por interrupción de Timer e integración en hardware DE1-SoC.	20	\N	\N	[]	\N	\N	\N	/uploads/semanas-html/404/material-web/index.html	\N	\N	combinada	/uploads/semanas-codigo/404-codigo.zip
3	1	03	Vectores y matrices	Capítulo 2 (Grossman) — 2.1, 2.2	RA2.1-RA2.2	Vectores y matrices; productos vectorial y matricial.	20	5	\N	[]	/notas/materia-1/semana-03/notas.pdf	/notas/materia-1/semana-03/guia.pdf	/notas/materia-1/semana-03/diapositivas.pdf	/notas/materia-1/semana-03/material-web/index.html	\N	\N	combinada	\N
414	4	14	Práctica 9: Análisis de Estabilidad y Margen de Fase en IIR	Módulo 7 — Estabilidad y Círculo Unitario	RA6.3-RA6.4	Evaluación de estabilidad de filtros IIR recursivos en el plano z, ubicación de polos, efecto del redondeo/saturación Q15 y prevención de oscilaciones parásitas.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
415	4	15	Práctica 10: Proyecto Integrador — GUI Osciloscopio Python + UART	Módulo 8 — Proyecto Integrador y GUI	RA7.1-RA7.2	Integración completa: ADC → Filtro Digital FIR/IIR → Transmisión UART 115200 baudios → Interfaz Gráfica (GUI) Osciloscopio en Python para monitoreo y control.	25	\N	\N	[]	\N	\N	\N	\N	\N	\N	combinada	\N
403	4	03	Práctica 3: Generador PWM como IP Avalon-MM Propia	Módulo 2 — Creación de IPs Avalon-MM	RA2.1-RA2.2	Diseño en VHDL de un generador PWM propio (pwm_avalon.vhd), empaquetado con Component Editor, integración en Platform Designer y control de periodo y duty cycle desde C (IOWR/IORD).	20	\N	\N	[]	\N	\N	\N	/uploads/semanas-html/403/material-web/index.html	\N	\N	combinada	/uploads/semanas-codigo/403-codigo.zip
\.


--
-- Data for Name: sesiones_asistencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sesiones_asistencia (id, materia_id, horario_id, docente_id, fecha_clase, ventana_inicio, ventana_fin, token_actual, token_expira_en, cerrada, creada_en) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password_hash, rol, documento_identidad, creado_en, reset_token, reset_token_expira) FROM stdin;
1	Fabio Hernán Realpe (Admin)	frealpe@gmail.com	$2b$10$tUE8OCKseG2sTsfGva5J2.KEvJAEgDYO/Iah8u.Hw3o5aCcF9uqji	SUPERUSUARIO	\N	2026-08-19 01:23:01.515193	\N	\N
180	Carlos Perez (Estudiante)	estudiante@unicauca.edu.co	$2b$10$oBlwi5OQPLdS6.ZvqshDYuImf40JnGDAbEWyJErjmA3n4A3cnPBGm	ESTUDIANTE	\N	2026-08-19 03:16:21.093098	\N	\N
11	BONILLA AYALA DIANA ISABELLA	dianaibonilla@unicauca.edu.co	$2b$10$xFTt2IKgzCaSUAAIRdXvKOEIp90s/ZSTan6qzGvi5wePk2X3PNeUm	ESTUDIANTE	104726011638	2026-08-19 03:10:57.317168	\N	\N
2	Fabio Hernán Realpe	frealpe@unicauca.edu.co	$2b$10$vDaOfGWkrQda4td/UXqXN.xVJKOuFZ7.mGqzmChOCbV6R7jBS06cy	DOCENTE	87248875	2026-08-19 01:23:01.515193	\N	\N
12	CAMPO CUARÁN CRISTIAN CAMILO	cristiancam@unicauca.edu.co	$2b$10$ywXE7YIiCtbX4KbgMovlgumNjGqGpQ1ML2FJN/R/6AzbcKM/U0doG	ESTUDIANTE	100626011595	2026-08-19 03:10:57.404998	\N	\N
13	CAMPO NARVAEZ MARIA JOSE	mariacn@unicauca.edu.co	$2b$10$b3fz1E0AO2yHX4ZgpfaWoe1fA8SrDi0tMIlxK1jQBop8zmp8ngBOu	ESTUDIANTE	104724011626	2026-08-19 03:10:57.535551	\N	\N
14	CAMPO ZAMBRANO JIMMY ALEJANDRO	jimmycampo@unicauca.edu.co	$2b$10$xWLvGWL1CsCByePifRGqbe1PLjDedJOupGyKZ8JBS6ECLuyQpkAlG	ESTUDIANTE	104725021236	2026-08-19 03:10:57.707812	\N	\N
74	BOLAÑOS RODRÍGUEZ LUIS MIGUEL	luismbolanos@unicauca.edu.co	$2b$10$DzzDfo5IovSPUwatux4yGu/adzPPoUSOfUfuEycr6ZmuLIrcziz1q	ESTUDIANTE	104726021515	2026-08-19 03:11:36.392435	\N	\N
75	BRAVO CISNEROS ELANIE ZULEY	elanie@unicauca.edu.co	$2b$10$cdmxfzI4/BNin2hyZFfuUO9HcDI73fS3jBYfTsRy02rrbLgSKNhGW	ESTUDIANTE	104726021494	2026-08-19 03:11:36.392435	\N	\N
76	CAMPO CAMAYO LUIS ADRIÁN	luiscc@unicauca.edu.co	$2b$10$NepHGqxBIHoADtyQssq2feMZ8s6bFFrkCl8HXmE2B1mZ1k7B0HPXu	ESTUDIANTE	104726021502	2026-08-19 03:11:36.392435	\N	\N
77	CARVAJAL SANDOVAL JUAN LUIS	juanlcarvajal@unicauca.edu.co	$2b$10$RCHcf/O0Iu6vLPmXLJ9VSeHdzPh1f1Dp1gFmlM6A4EfFIZkxjb1ge	ESTUDIANTE	104726021531	2026-08-19 03:11:36.392435	\N	\N
78	ESGUERRA ESGUERRA JACOBO	jacobope@unicauca.edu.co	$2b$10$yKQzLyq8Gpm4MhQ0PkBO1.Nw1UM46bAiShrZi/Hp.1F1DPUtemAUG	ESTUDIANTE	104726021532	2026-08-19 03:11:36.392435	221435	2026-09-07 23:58:00.497
4	Yamit Bolaños	yhbolanos@unicauca.edu.co	$2b$10$DCsBlG0AmYrSkgHg.iley.3QEKzXFuN3xEHdEjZecqp4Lvr4gUh32	DOCENTE	10301511	2026-08-19 02:47:04.700032	\N	\N
90	ROSERO CRIOLLO ANDRES FELIPE	afrosero@unicauca.edu.co	$2b$10$lzdOs04N5nNjKQWEc7zYUOZUlCND2ELpXOmxZsB4mwzCOBzLHy22m	ESTUDIANTE	104726021498	2026-08-19 03:11:36.392435	\N	\N
94	CAICEDO GÓMEZ JHON DAVID	jhoncaicedo@unicauca.edu.co	$2b$10$5fIJ6s4cnNfgVk5ma5DiCewzSjufGNpN9plJybWqTNdzxgLPOH9SO	ESTUDIANTE	100623010390	2026-08-19 03:11:36.392435	\N	\N
95	HENAO YELA CRISTIAN CAMILO	cchenao@unicauca.edu.co	$2b$10$.6f6zBt4YQdXZil1wU5fVuwJH9p0CsIPpp1jeEHkap34V2Zm0XgxW	ESTUDIANTE	100621011400	2026-08-19 03:11:36.392435	\N	\N
97	MENESES MONTENEGRO GIANCARLO	giancarlomeneses@unicauca.edu.co	$2b$10$ZI4ckhOONnH5rWUq5YrCaOZXZIJ7J.8UvUG//AcByFameWuwmygvi	ESTUDIANTE	100623020692	2026-08-19 03:11:36.392435	\N	\N
98	ORDOÑEZ LOPEZ PAOLA ANDREA	paolaordonezl@unicauca.edu.co	$2b$10$gFNeH5Pr7Y4LtSzoMlStm.3uXJbjNKXJ0JaXYP1clxceuWUZxlRI2	ESTUDIANTE	100623010416	2026-08-19 03:11:36.392435	\N	\N
100	SANCHEZ CUCHUMBE JOSE MANUEL	josemasanchez@unicauca.edu.co	$2b$10$M.BTY6D4GSag9IgaoKnVfuIUOlGU6D8juQrkF9rLFEf3Fdu.UHGGO	ESTUDIANTE	100622021291	2026-08-19 03:11:36.392435	\N	\N
101	SANCHEZ HIDALGO ADRIAN YESID	adriansanchez@unicauca.edu.co	$2b$10$Es6SZ7IVdjBBiC8Y/D.3fe6JNWhnkS1lNxIgXrC.0aVkPYogIMoCa	ESTUDIANTE	100622011616	2026-08-19 03:11:36.392435	\N	\N
102	SANCHEZ LOPEZ JOSE LUIS	joselsanchez@unicauca.edu.co	$2b$10$.c4LpM.ku7ayFwjnM0vUu.SeKAUQUUX7.ALOghCAmgXlqSfmMgg1S	ESTUDIANTE	100623020688	2026-08-19 03:11:36.392435	\N	\N
103	VALDIVIESO QUIÑONEZ KEVIN ALEJANDRO	kevinvaldivieso@unicauca.edu.co	$2b$10$ojVUrslHMc3R0RQgPfqlI.Afd9ktmgVJqLcDND6Pyd5OUuF91rYpG	ESTUDIANTE	100623010389	2026-08-19 03:11:36.392435	\N	\N
15	CANDO LOPEZ YEIMI DANIELA	yeimicando@unicauca.edu.co	$2b$10$WLn10zoPDnvptTQDPtXjq.QLgdbtlu9wX7zPo/tLveCj4ejXElWui	ESTUDIANTE	104726011616	2026-08-19 03:10:58.013784	\N	\N
16	CORREA MIRANDA DENIS SANTIAGO	deniscorrea@unicauca.edu.co	$2b$10$eERV3/6Y7nAko3uGypnX..J5jhDjxO.4JQnGeTVhdOkcf17fGh.Ji	ESTUDIANTE	104725021216	2026-08-19 03:10:58.155029	\N	\N
17	CRUZ ERAZO DANIEL ALEJANDRO	danielce@unicauca.edu.co	$2b$10$J3QvSn77ZAz8Hq5IrWW0Rea8IwABYv3tf.pWZQ6LOPsAFXxZE4/vC	ESTUDIANTE	104723020735	2026-08-19 03:10:58.301906	\N	\N
18	ESPINOSA BOLAÑOS IVAN SANTIAGO	ivanespinosa@unicauca.edu.co	$2b$10$VoaOkJC1L2e5moBAvDtece6QWcpYdekQ9nRXBXLRhRPjEMFHeTU7i	ESTUDIANTE	104725021210	2026-08-19 03:10:58.384538	\N	\N
32	ORDOÑEZ HURTADO JUAN CAMILO	juanoh@unicauca.edu.co	$2b$10$9t7tjq.CTikJ8CACjmm0..yVrwpLEz/xzsQO6wXThZ0ii/AZTEZI.	ESTUDIANTE	104724011631	2026-08-19 03:11:01.850839	\N	\N
33	OROZCO ESPAÑA YEISON ANDRES	yeisonorozco@unicauca.edu.co	$2b$10$UIZNiJGPeBsfOs8HfaLInOKLFi2Rt9AxdJo/5dFO5gUFjuoHs6QL.	ESTUDIANTE	100626011586	2026-08-19 03:11:02.154181	\N	\N
35	PORRAS BETANCOURT PAULO ALEXANDRO	paulo@unicauca.edu.co	$2b$10$Om5A5EdIzkib/HxeUgTQcuViDjYItR00N2LDHurlpABxRQM8w9Oam	ESTUDIANTE	104725021202	2026-08-19 03:11:02.368301	\N	\N
38	TORO VERGARA JUAN DAVID	juandtoro@unicauca.edu.co	$2b$10$ULPrtWMDLQAv4FDTBhbmEOZdkvEsdojj3qygpeRrnZllFFUJOvjPm	ESTUDIANTE	104726011610	2026-08-19 03:11:02.749612	\N	\N
39	TOVAR VELASCO SANTIAGO	santiagotovar@unicauca.edu.co	$2b$10$DRUWkb37ADlLJOND8yXzueSGnnfEsdzvvqrG8eyVV6S72GmHEJkb.	ESTUDIANTE	104725011589	2026-08-19 03:11:02.839528	\N	\N
40	VELASCO MUÑOZ JUAN SEBASTIÁN	juansvelasco@unicauca.edu.co	$2b$10$xYkq5WIAsj2NWnDNpxNZBe7AZP6aXmY349PmZ5pU.aNI/YL9MrjQ6	ESTUDIANTE	104725011662	2026-08-19 03:11:02.981429	\N	\N
71	ANAYA GOMEZ JUAN JOSE	juananaya@unicauca.edu.co	$2b$10$5t628Ks7DxFhFpSPSsscbuGnbKqJtfzgT9QTje9dI4r9Ff9rllE8a	ESTUDIANTE	104726021496	2026-08-19 03:11:36.392435	\N	\N
72	ARIAS GONZÁLEZ KEVIN ANDRES	kevinarias@unicauca.edu.co	$2b$10$8U2GwvPmA67l2kCykOzIYuK973u5mz.IfCzO9Y8dkc8SFXTrEEsJO	ESTUDIANTE	104725021232	2026-08-19 03:11:36.392435	\N	\N
73	BOLAÑOS FERNÁNDEZ KAREN GINETH	karengbolanos@unicauca.edu.co	$2b$10$DNZBAyzRT8/q2b0cPdC8k.rdhxu.e0.u/XzHJI1b4KHqYKVNZEt/e	ESTUDIANTE	104726021508	2026-08-19 03:11:36.392435	\N	\N
84	MARTÍNEZ DAZA CHRISTIAN FELIPE	christianmartinez@unicauca.edu.co	$2b$10$wSj0eEWEjwgoTNmnKZPDwurB.AbIUqnZv5dXhsJq3H.HxIImal8JC	ESTUDIANTE	104726021536	2026-08-19 03:11:36.392435	\N	\N
85	MARTINEZ MONTERO JUAN DAVID	juandmartinezm@unicauca.edu.co	$2b$10$sNU6bPH2Q1K14WMzVFmSwu.w.jyuNhJMn4HHAjIIN.HA/AEm0acly	ESTUDIANTE	104726021518	2026-08-19 03:11:36.392435	\N	\N
86	MEDINA QUINTERO KATHERINE	katherinemedina@unicauca.edu.co	$2b$10$5MTASBF8d95ntRXxkW.t8.K9/sdyJ3MVW2v1bU6anMEDSS99GI4YC	ESTUDIANTE	104726021519	2026-08-19 03:11:36.392435	\N	\N
83	MANCILLA SOLARTE ANDRES CAMILO	andresmancilla@unicauca.edu.co	$2b$10$B9sKKf79x7qHJad4jBYdtO8aGxjpuE5JqHCuyDZLcRgGgtaEuQb5C	ESTUDIANTE	104726021499	2026-08-19 03:11:36.392435	922216	2026-09-07 23:41:32.526
37	REYES RODRIGUEZ GABRIELA	gabrielareyes@unicauca.edu.co	$2b$10$dpE2cm9MLhHsqyfDdHwBve/y3cS6kdshsftmjCetOKwul/JXyrPyK	ESTUDIANTE	104726011642	2026-08-19 03:11:02.649865	651484	2026-09-08 05:54:00.88
34	PINZÓN GARZÓN VICTOR HUGO	victorpinzon@unicauca.edu.co	$2b$10$HQfFvm3Je6jcmHrzitz2N.t3Uhm9baiF299.vTiPCcJSdx7o1Dhga	ESTUDIANTE	104725011382	2026-08-19 03:11:02.280627	390587	2026-09-08 18:21:18.479
36	REALPE CABRERA KEVIN JHOAN	kevinrealpe@unicauca.edu.co	$2b$10$CThdaIqf.qC2v7Ob6afUo.U1IsAvt7bux/uyDSHCzqJn9vrjeyor.	ESTUDIANTE	104725011385	2026-08-19 03:11:02.492914	350101	2026-09-08 19:21:02.383
19	FERNÁNDEZ ZAMBRANO YOSETH DAVID	yoseth@unicauca.edu.co	$2b$10$sqprTBBe0C9JU.fl1LpQiO1ch09lVP8TdrZfO6iUbtdd5qxg9bb0m	ESTUDIANTE	104726011604	2026-08-19 03:10:58.464467	\N	\N
20	FULI LÓPEZ LEIDY ISABELLA	leidyfuli@unicauca.edu.co	$2b$10$zkpCcy/9PjwEvJH74fnxj.mu29ZS4jd9zfz5UOBEP0PWpSmWRwP.O	ESTUDIANTE	104726011628	2026-08-19 03:10:58.551434	\N	\N
21	GARCÍA MORALES JOSE MANUEL	josemgarcia@unicauca.edu.co	$2b$10$qNedrfIPpmj2N41lEnyI7Os1ym3E0Owrvk7ahboefZMrCT4q44Mvy	ESTUDIANTE	104726011605	2026-08-19 03:10:58.645141	\N	\N
22	GUERRERO QUINTO JUAN SEBASTIAN	juansguerrero@unicauca.edu.co	$2b$10$npD4V1Meh/yoPtYHQiZqg.YHCtNXWpMvWn1KejWutOYZXGWcAxvJC	ESTUDIANTE	100625021172	2026-08-19 03:10:58.728542	\N	\N
23	JIMENEZ ALZATE JUAN PABLO	juanja@unicauca.edu.co	$2b$10$sWDbLMysXmTqJpOjqZmGHeiHxr48G304NWfGFIImovf/eT2C.oK06	ESTUDIANTE	104725021198	2026-08-19 03:10:58.823538	\N	\N
24	LÓPEZ MUÑOZ JUAN SEBASTIÁN	juanlopezmu@unicauca.edu.co	$2b$10$22KrnVRv2MV1VFnLzlhale7HnlLgpbKsLwODXA0zwgT6H6PINIaCS	ESTUDIANTE	104725021233	2026-08-19 03:10:58.904545	\N	\N
26	MANQUILLO JOSE FERNANDO	josemanquillo@unicauca.edu.co	$2b$10$7.n9ilkY7P8fAdXA4819DezrRwzHvMae6Sxoqc/.czyY8pepAvPGi	ESTUDIANTE	104724011609	2026-08-19 03:10:59.076261	\N	\N
27	MANQUILLO LOPEZ ALEJANDRO	alejandromanquillo@unicauca.edu.co	$2b$10$nUEEPSeMr/JE/R6UMM4bkOF510oVRofjStgiywHDqrkFQg3zSfFW.	ESTUDIANTE	104724021127	2026-08-19 03:10:59.215595	\N	\N
28	MENA OMEN ALEXANDER	alexandermena@unicauca.edu.co	$2b$10$NvELxyH3DMe6fiIiuokM8eI4U7.a6uO0xvCnThsF2tWfQ.G5VJvYW	ESTUDIANTE	104726011639	2026-08-19 03:11:00.768586	\N	\N
29	MUÑOZ DAZA YEFERSON	yefersonm@unicauca.edu.co	$2b$10$zaw8cUeEATjtAwP4cMNKVu1dwFdANtLDrc2EqwwMMj7POqiZleg.2	ESTUDIANTE	104724011615	2026-08-19 03:11:01.47223	\N	\N
30	MUÑOZ TORRES MARÍA JULIANA	mariajmunoz@unicauca.edu.co	$2b$10$XAvLtT1BZiHyGra/eD9RXeOTXLwL6hxgzXHODw5HQfFqKFnOC4qdS	ESTUDIANTE	104724011647	2026-08-19 03:11:01.679069	\N	\N
31	OPOCUE MEDINA JUAN ESTEBAN	juanopocue@unicauca.edu.co	$2b$10$NgQCGhiqh0IFb0vTLki3eOTACeMcg0Fm/7uEAZGkB9g3/DdEjoxfm	ESTUDIANTE	104725011381	2026-08-19 03:11:01.769315	\N	\N
87	PERDOMO LOSADA ALEJANDRA	alejandraperdomo@unicauca.edu.co	$2b$10$4W/E8Y6s9zztgjtL7gg0eeXUTIkPUH9pTggWNOuFnsAw4tca0U3.2	ESTUDIANTE	104726021510	2026-08-19 03:11:36.392435	\N	\N
88	QUINTERO MUÑOZ JUAN JOSE	juanjquintero@unicauca.edu.co	$2b$10$AozkJ4GinhJ9AVwQ9A.by.zqBZRDWzf2/sGOuRhmZyeEieYjyCn.C	ESTUDIANTE	104726021523	2026-08-19 03:11:36.392435	\N	\N
89	RIVERA LÓPEZ KAREN VANESSA	karenvrivera@unicauca.edu.co	$2b$10$u77bwu7tsr1r8ihLzmdCVO7KSqaRQHEk0L7y5KtMeW8xzDnuo7XXa	ESTUDIANTE	104726021529	2026-08-19 03:11:36.392435	\N	\N
91	RUIZ LLANTEN KAREN VANESSA	karenvruiz@unicauca.edu.co	$2b$10$kavpdXNFKiB/2Uv1JAuTgO811fjF9UF49LoAhMGlvFol0ILxtOqLy	ESTUDIANTE	104726021501	2026-08-19 03:11:36.392435	\N	\N
92	SANDOVAL OSORIO DAYANNA SOPHIE	dayannasandoval@unicauca.edu.co	$2b$10$Ke9EgXJUr/tZJJRAKUw3XeQDldTtMjaTr/2Px9ak0Y/yIhULLufNy	ESTUDIANTE	104726021512	2026-08-19 03:11:36.392435	\N	\N
93	ZANABRIA PALECHOR CAROL YULITHZA	carolzanabria@unicauca.edu.co	$2b$10$w8JMSw7ogo7ow0nSC6kPIeBi00LwQdx0hT.oum000tzmki.OHpyHu	ESTUDIANTE	104726021521	2026-08-19 03:11:36.392435	\N	\N
25	MAMIAN LUNA LUIZA FERNANDA	luizamamian@unicauca.edu.co	$2b$10$mxxyb.hJ/rDj0aNQWvSnwe0sX.gnYzANo1ltQXgBGX9v3nCNff5Lu	ESTUDIANTE	100626011558	2026-08-19 03:10:58.991894	948372	2026-09-09 00:08:07.661
96	MENDEZ MENDEZ DELER SANTIAGO	delermendez@unicauca.edu.co	$2b$10$uEckhb1BeXtue84K2HYu8OsD64EmN7Nl0f5waC1yg/RpSk5YxwvKm	ESTUDIANTE	100623010402	2026-08-19 03:11:36.392435	\N	\N
79	ESTRADA QUINTANA DAVID SANTIAGO	destrada@unicauca.edu.co	$2b$10$PaxG7lizaaU8Qz7FjX4kWOAflDhS9Y5QFDg0geQMkoOAb8ZXc20Ay	ESTUDIANTE	104726021503	2026-08-19 03:11:36.392435	\N	\N
80	GARCES RUIZ GUILLERMO ANDRÉS	guillermogarces@unicauca.edu.co	$2b$10$DywwLPfnUXapLJ3KZQYtXuoWQ/2a9sKg2FHcYFJA/23aDx/w5lJTa	ESTUDIANTE	104726021511	2026-08-19 03:11:36.392435	\N	\N
81	JIMÉNEZ VÁSQUEZ JESICA ALEXANDRA	jesicajimenez@unicauca.edu.co	$2b$10$uYCA8DgxikLitMmF6AMrsuxaVCIlsko9MTVGkw4X4QOmPkNjc52Fy	ESTUDIANTE	104726021524	2026-08-19 03:11:36.392435	\N	\N
82	MALLAMA RIVERA DANIEL ALEJANDRO	danielmallama@unicauca.edu.co	$2b$10$55Z/7D/97ilAX1KNPEMvAObEoazgksYZPAaHZqDGl8XOlqlG.DeCK	ESTUDIANTE	104726021516	2026-08-19 03:11:36.392435	\N	\N
99	SAMBONI SOTO BRENDA ISABELLA	brendasamboni@unicauca.edu.co	$2b$10$1knbEeMa2TlPjxo0skZDrOVFedxHJfvRfsf2UvmobLriyO7PDJaw.	ESTUDIANTE	100623010434	2026-08-19 03:11:36.392435	\N	\N
\.


--
-- Name: actividad_estudiantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.actividad_estudiantes_id_seq', 228, true);


--
-- Name: examenes_programados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examenes_programados_id_seq', 1, false);


--
-- Name: examenes_programados_semanas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examenes_programados_semanas_id_seq', 1, false);


--
-- Name: horarios_materia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_materia_id_seq', 1, false);


--
-- Name: inscripciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscripciones_id_seq', 472, true);


--
-- Name: intentos_examen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intentos_examen_id_seq', 92, true);


--
-- Name: materias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materias_id_seq', 5, true);


--
-- Name: registros_asistencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_asistencia_id_seq', 1, false);


--
-- Name: semanas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semanas_id_seq', 417, true);


--
-- Name: sesiones_asistencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sesiones_asistencia_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 248, true);


--
-- Name: actividad_estudiantes actividad_estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividad_estudiantes
    ADD CONSTRAINT actividad_estudiantes_pkey PRIMARY KEY (id);


--
-- Name: contador_visitas contador_visitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contador_visitas
    ADD CONSTRAINT contador_visitas_pkey PRIMARY KEY (id);


--
-- Name: examenes_programados examenes_programados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados
    ADD CONSTRAINT examenes_programados_pkey PRIMARY KEY (id);


--
-- Name: examenes_programados_semanas examenes_programados_semanas_examen_id_semana_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados_semanas
    ADD CONSTRAINT examenes_programados_semanas_examen_id_semana_id_key UNIQUE (examen_id, semana_id);


--
-- Name: examenes_programados_semanas examenes_programados_semanas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados_semanas
    ADD CONSTRAINT examenes_programados_semanas_pkey PRIMARY KEY (id);


--
-- Name: horarios_materia horarios_materia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_materia
    ADD CONSTRAINT horarios_materia_pkey PRIMARY KEY (id);


--
-- Name: inscripciones inscripciones_materia_id_estudiante_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_materia_id_estudiante_id_key UNIQUE (materia_id, estudiante_id);


--
-- Name: inscripciones inscripciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_pkey PRIMARY KEY (id);


--
-- Name: intentos_examen intentos_examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intentos_examen
    ADD CONSTRAINT intentos_examen_pkey PRIMARY KEY (id);


--
-- Name: materias materias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_codigo_key UNIQUE (codigo);


--
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- Name: preguntas preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id);


--
-- Name: quices quices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quices
    ADD CONSTRAINT quices_pkey PRIMARY KEY (id);


--
-- Name: registros_asistencia registros_asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_asistencia
    ADD CONSTRAINT registros_asistencia_pkey PRIMARY KEY (id);


--
-- Name: registros_asistencia registros_asistencia_sesion_id_estudiante_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_asistencia
    ADD CONSTRAINT registros_asistencia_sesion_id_estudiante_id_key UNIQUE (sesion_id, estudiante_id);


--
-- Name: semanas semanas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semanas
    ADD CONSTRAINT semanas_pkey PRIMARY KEY (id);


--
-- Name: sesiones_asistencia sesiones_asistencia_materia_id_fecha_clase_ventana_inicio_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_asistencia
    ADD CONSTRAINT sesiones_asistencia_materia_id_fecha_clase_ventana_inicio_key UNIQUE (materia_id, fecha_clase, ventana_inicio);


--
-- Name: sesiones_asistencia sesiones_asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_asistencia
    ADD CONSTRAINT sesiones_asistencia_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_registros_asistencia_estudiante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registros_asistencia_estudiante ON public.registros_asistencia USING btree (estudiante_id, estado, justificada);


--
-- Name: idx_sesiones_asistencia_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sesiones_asistencia_token ON public.sesiones_asistencia USING btree (token_actual);


--
-- Name: usuarios_documento_identidad_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuarios_documento_identidad_key ON public.usuarios USING btree (documento_identidad) WHERE (documento_identidad IS NOT NULL);


--
-- Name: actividad_estudiantes actividad_estudiantes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividad_estudiantes
    ADD CONSTRAINT actividad_estudiantes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: examenes_programados examenes_programados_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados
    ADD CONSTRAINT examenes_programados_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuarios(id);


--
-- Name: examenes_programados examenes_programados_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados
    ADD CONSTRAINT examenes_programados_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: examenes_programados_semanas examenes_programados_semanas_examen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados_semanas
    ADD CONSTRAINT examenes_programados_semanas_examen_id_fkey FOREIGN KEY (examen_id) REFERENCES public.examenes_programados(id) ON DELETE CASCADE;


--
-- Name: examenes_programados_semanas examenes_programados_semanas_semana_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examenes_programados_semanas
    ADD CONSTRAINT examenes_programados_semanas_semana_id_fkey FOREIGN KEY (semana_id) REFERENCES public.semanas(id) ON DELETE CASCADE;


--
-- Name: horarios_materia horarios_materia_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_materia
    ADD CONSTRAINT horarios_materia_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: inscripciones inscripciones_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: inscripciones inscripciones_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: intentos_examen intentos_examen_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intentos_examen
    ADD CONSTRAINT intentos_examen_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: intentos_examen intentos_examen_examen_programado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intentos_examen
    ADD CONSTRAINT intentos_examen_examen_programado_id_fkey FOREIGN KEY (examen_programado_id) REFERENCES public.examenes_programados(id) ON DELETE CASCADE;


--
-- Name: intentos_examen intentos_examen_semana_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intentos_examen
    ADD CONSTRAINT intentos_examen_semana_id_fkey FOREIGN KEY (semana_id) REFERENCES public.semanas(id) ON DELETE CASCADE;


--
-- Name: materias materias_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: preguntas preguntas_semana_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_semana_id_fkey FOREIGN KEY (semana_id) REFERENCES public.semanas(id) ON DELETE CASCADE;


--
-- Name: quices quices_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quices
    ADD CONSTRAINT quices_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: quices quices_semana_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quices
    ADD CONSTRAINT quices_semana_id_fkey FOREIGN KEY (semana_id) REFERENCES public.semanas(id) ON DELETE SET NULL;


--
-- Name: registros_asistencia registros_asistencia_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_asistencia
    ADD CONSTRAINT registros_asistencia_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: registros_asistencia registros_asistencia_sesion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_asistencia
    ADD CONSTRAINT registros_asistencia_sesion_id_fkey FOREIGN KEY (sesion_id) REFERENCES public.sesiones_asistencia(id) ON DELETE CASCADE;


--
-- Name: semanas semanas_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semanas
    ADD CONSTRAINT semanas_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: sesiones_asistencia sesiones_asistencia_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_asistencia
    ADD CONSTRAINT sesiones_asistencia_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuarios(id);


--
-- Name: sesiones_asistencia sesiones_asistencia_horario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_asistencia
    ADD CONSTRAINT sesiones_asistencia_horario_id_fkey FOREIGN KEY (horario_id) REFERENCES public.horarios_materia(id) ON DELETE SET NULL;


--
-- Name: sesiones_asistencia sesiones_asistencia_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones_asistencia
    ADD CONSTRAINT sesiones_asistencia_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict AHoqzHpCKw23oxVIMHPHh99kEj9deqs9jVQyVIXrJlpwjvm2VkkLr3Flhkrxn8j


# Frontend Medical System

Frontend medico modular con Vue 3, Vite y TypeScript, listo para produccion con Docker + Nginx.

El repositorio soporta dos modos Docker:

- Produccion: build estatico de Vite servido por Nginx
- Desarrollo: Vite dev server con hot reload y volumen del codigo fuente

## Stack

- Vue 3 + Vite + TypeScript
- Vue Router
- Pinia
- Axios con interceptors globales
- Zod para validaciones
- ESLint + Prettier
- Docker multi-stage + Nginx

## Estructura del proyecto

```text
frontend-medical-system/
  src/
    app/
      config.ts
    router/
      index.ts
    stores/
      auth.store.ts
      ui.store.ts
    services/
      auth.service.ts
      crud.service.ts
      http.ts
    modules/
      auth/
      dashboard/
      users/
      patients/
      medical-records/
      consultations/
      prescriptions/
      appointments/
      files/
    shared/
      components/
      layouts/
      ui/
      utils/
      types/
    assets/
  nginx/
    default.conf.template
  Dockerfile
  Dockerfile.dev
  docker-compose.yml
  docker-compose.dev.yml
  .env.example
  .env.docker.example
```

## Variables de entorno

Copia una de las plantillas:

- `.env.example` para desarrollo local
- `.env.docker.example` para Docker

Variables:

- `VITE_API_URL`: URL base de API en navegador.
  - Modo A recomendado: `/api`
  - Modo B directo: `http://localhost:8000`
- `VITE_AUTH_LOGIN_PATH`: endpoint de login relativo a `VITE_API_URL`
- `VITE_AUTH_ME_PATH`: endpoint de usuario actual
- `VITE_AUTH_REFRESH_PATH`: endpoint de refresh
- `VITE_ENABLE_REFRESH`: habilita refresh token
- `BACKEND_UPSTREAM`: solo Docker/Nginx, upstream interno para proxy
- `SHARED_DOCKER_NETWORK`: red externa compartida entre repos

## Modo A recomendado (sin CORS)

Navegador -> Frontend Nginx -> proxy /api -> Backend

- En frontend, usar `VITE_API_URL=/api`
- Nginx del frontend enruta `/api/*` y `/auth/*` hacia `BACKEND_UPSTREAM`
- El navegador nunca usa DNS interno Docker

## Modo B fallback directo

Navegador -> Backend directo

- En frontend, usar `VITE_API_URL=http://localhost:8000`
- No depende de proxy Nginx
- Puede requerir CORS habilitado en backend

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run type-check`
- `npm run lint`
- `npm run format`

## Ejecucion paso a paso

### 1. Frontend solo en modo desarrollo

1. Instala dependencias: `npm install`
2. Crea `.env` con base en `.env.example`
3. Ejecuta: `npm run dev`
4. Abre `http://localhost:5173`

### 2. Frontend Docker produccion (modo proxy recomendado)

1. Crea red compartida una vez:
   - `docker network create medical_shared_network`
2. Configura `.env` con base en `.env.docker.example`
3. Define upstream backend interno, por ejemplo:
  - Frontend solo (backend en host): `BACKEND_UPSTREAM=http://host.docker.internal:8000`
  - Frontend + backend en red compartida: `BACKEND_UPSTREAM=http://backend:8000`
4. Levanta frontend en produccion:
   - `docker compose up -d --build`
5. Abre `http://localhost:5173`

### 3. Frontend Docker desarrollo (hot reload)

1. Crea red compartida una vez (si no existe):
  - `docker network create medical_shared_network`
2. Opcional: ajusta variables en `.env` (o exportalas) para desarrollo.
  - `VITE_API_URL=/api`
  - `BACKEND_UPSTREAM=http://host.docker.internal:8000`
3. Levanta frontend en modo desarrollo:
  - `docker compose -f docker-compose.dev.yml up --build`
4. Abre `http://localhost:5173`
5. Hot reload habilitado con polling (`CHOKIDAR_USEPOLLING=true`) para entornos Docker/Linux.

### 4. Frontend + backend en repos separados con red compartida

1. En ambos repos, usa la misma red externa:
   - `medical_shared_network` (o la que definas en `SHARED_DOCKER_NETWORK`)
2. Conecta servicio backend a esa red en su compose.
3. Conecta servicio frontend a la misma red (ya configurado en este repo).
4. Mantén `VITE_API_URL=/api` en frontend.
5. Ajusta `BACKEND_UPSTREAM` al nombre/host interno accesible desde Nginx del frontend.

### 5. Modo directo (fallback)

1. Establece `VITE_API_URL=http://localhost:8000`.
2. Ejecuta `npm run dev` o `docker compose up -d --build`.
3. Verifica CORS en backend si aparece bloqueo en navegador.

## Tabla de rutas frontend -> endpoint backend

| Front route | Metodo | Backend endpoint |
|---|---|---|
| /login | POST | /api/auth/login o /api/v1/auth/login |
| /dashboard | GET | /api/health |
| /dashboard | GET | /api/v1/dashboard/kpis |
| /users | GET/POST | /api/v1/users |
| /users | PUT/DELETE | /api/v1/users/:id |
| /patients | GET/POST | /api/v1/patients |
| /patients/:id | GET/PUT/DELETE | /api/v1/patients/:id |
| /medical-records | GET/POST | /api/v1/medical-records |
| /medical-records | PUT/DELETE | /api/v1/medical-records/:id |
| /medical-records | GET | /api/v1/medical-records/:id/consultations |
| /consultations | GET/POST | /api/v1/consultations |
| /consultations | PUT/DELETE | /api/v1/consultations/:id |
| /prescriptions | GET/POST | /api/v1/prescriptions |
| /prescriptions | PUT/DELETE | /api/v1/prescriptions/:id |
| /prescriptions | GET | /api/v1/prescriptions/:id/pdf |
| /appointments | GET/POST | /api/v1/appointments |
| /appointments | PUT/DELETE | /api/v1/appointments/:id |
| /files | GET | /api/v1/files |
| /files | POST | /api/v1/files/upload |
| /files | GET | /api/v1/files/:id/download |
| /files | DELETE | /api/v1/files/:id |

## Seguridad y autorizacion

- Route guards por autenticacion en `router/index.ts`
- Guards por permisos basados en rol (`admin`, `doctor`, `receptionist`)
- Sidebar dinamico segun permisos
- Interceptor request: agrega `Authorization: Bearer <token>`
- Interceptor response: manejo centralizado de `401/403/422/500` y errores de red

## Checklist E2E de validacion funcional

- [ ] Login exitoso con backend real
- [ ] Logout elimina sesion y redirige a login
- [ ] Persistencia de token tras recargar
- [ ] Endpoint `/auth/me` carga usuario actual
- [ ] Guard bloquea rutas privadas sin sesion
- [ ] Guard por rol oculta rutas y acciones no permitidas
- [ ] Dashboard muestra estado de backend (`/api/health`)
- [ ] CRUD usuarios funciona (admin)
- [ ] CRUD pacientes funciona
- [ ] Detalle de paciente abre correctamente
- [ ] Medical records: CRUD y carga historial
- [ ] Consultations CRUD funcional
- [ ] Prescriptions CRUD y descarga PDF
- [ ] Appointments CRUD con filtros por fecha/doctor/paciente/estado
- [ ] Files upload/list/download/delete funcional
- [ ] Modo proxy (`VITE_API_URL=/api`) sin CORS
- [ ] Build de produccion sin errores (`npm run build`)

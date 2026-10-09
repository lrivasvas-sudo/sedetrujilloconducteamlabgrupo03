# Requisitos de Nara

Este documento separa los requisitos **implementados** de los **pendientes**.
Solo se marca como implementado lo que existe y se puede comprobar en el código.

## Implementados

| # | Requisito | Dónde se ve |
|---|-----------|-------------|
| R-01 | Página inicial con el nombre «Nara» y la frase «¿Estás bien? Un espacio para ti, cuando lo necesites». | `src/app/page.tsx`, `src/components/WelcomeHero.tsx` |
| R-02 | Interfaz en español (`lang="es"`). | `src/app/layout.tsx` |
| R-03 | Paleta pastel (lavanda, verde menta, azul cielo, crema) y esquinas redondeadas. | `src/app/globals.css` |
| R-04 | Diseño adaptable a celulares, tabletas y computadoras. | Clases responsivas de Tailwind en `src/components/WelcomeHero.tsx` |
| R-05 | Logotipo de texto «Nara» con tipografía redondeada (Nunito). | `src/components/Logo.tsx` |
| R-06 | Comandos de desarrollo, comprobación y producción. | `package.json` |
| R-07 | Formulario de acceso **en modo de prueba**: pide correo y contraseña, pero cualquier valor permite entrar. No verifica, no guarda y no envía datos. Lleva a una página provisional `/inicio`. **No es autenticación real.** | `src/components/LoginForm.tsx`, `src/app/inicio/page.tsx` |

## Pendientes

Estos requisitos vienen de la especificación del proyecto. **Ninguno está implementado todavía.**

| # | Requisito | Etapa prevista |
|---|-----------|----------------|
| P-01 | Inicio de sesión real con cuentas creadas por un administrador (hoy solo existe el modo de prueba R-07). | Etapa 3 |
| P-02 | Gestión de usuarios, perfiles y permisos. | Etapa 3 |
| P-03 | Asistente conversacional con inteligencia artificial. | Etapa 4 |
| P-04 | Historial de conversaciones. | Etapa 4 |
| P-05 | Seguimiento emocional con ocho opciones de emociones. | Etapa 5 |
| P-06 | Resumen gráfico del historial emocional. | Etapa 5 |
| P-07 | Solicitudes de atención psicológica. | Etapa 6 |
| P-08 | Gestión y consulta de recursos de bienestar. | Etapa 6 |
| P-09 | Notificaciones dentro de la aplicación y por correo electrónico. | Etapa 7 |
| P-10 | Panel de administración. | Etapa 3 |
| P-11 | Panel del equipo psicológico. | Etapa 6 |
| P-12 | Estadísticas de uso y bienestar. | Etapa 7 |
| P-13 | Protocolos de orientación ante situaciones de riesgo emocional. | Etapa 6 |
| P-14 | Registro de auditoría para acciones sobre información sensible. | Etapa 3 |
| P-15 | Protección de datos personales y controles de acceso. | Etapa 3 |
| P-16 | Despliegue en Vercel. | Etapa 2 |

Las etapas se describen en [ROADMAP.md](ROADMAP.md). Los números de etapa son provisionales y pueden cambiar con tu aprobación.

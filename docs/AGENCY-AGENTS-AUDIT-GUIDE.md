# Uso de The Agency Agents para auditar Trusted Home Services

Este documento explica cómo usar el repositorio **The Agency** (`Test project agents git`) para auditar este proyecto web en **seguridad**, **buenas prácticas**, **organización** y **cumplimiento**.

## ¿Qué es The Agency?

Es un conjunto de **agentes de IA** (definidos en archivos `.md`). No son scripts que se ejecutan solos: son **reglas/personas** que se instalan en tu proyecto para que el asistente de Cursor (u otra herramienta) adopte ese rol cuando lo invocas. Cada agente tiene:

- Identidad y misión
- Reglas críticas y entregables (checklists, plantillas de informe)
- Flujos de trabajo (qué revisar y en qué orden)

## Agentes útiles para tu auditoría

| Objetivo | Agente | Archivo | Qué hace |
|----------|--------|---------|----------|
| **Seguridad** | Security Engineer | `engineering/engineering-security-engineer.md` | Threat modeling, revisión de código segura, OWASP Top 10, checklist de vulnerabilidades, arquitectura segura |
| **Buenas prácticas / listo para producción** | Reality Checker | `testing/testing-reality-checker.md` | Certificación basada en evidencia, evita aprobaciones “fantasma”, exige pruebas y capturas antes de “production ready” |
| **Accesibilidad** | Accessibility Auditor | `testing/testing-accessibility-auditor.md` | Auditoría WCAG 2.2, pruebas con lectores de pantalla, teclado, severidad por criterio |
| **Cumplimiento legal / privacidad** | Legal Compliance Checker | `support/support-legal-compliance-checker.md` | GDPR, CCPA, políticas de privacidad, evaluación de riesgos, auditoría de cumplimiento |
| **Buenas prácticas frontend / organización** | Frontend Developer | `engineering/engineering-frontend-developer.md` | React/Vite, rendimiento, Core Web Vitals, estructura de componentes |
| **Estructura / arquitectura** | Backend Architect | `engineering/engineering-backend-architect.md` | APIs, estructura de capas, escalabilidad (útil si tienes API o serverless) |

## ¿Se puede usar con este proyecto? **Sí**

- Los agentes están pensados para proyectos web y se integran con **Cursor**.
- Instalándolos en la carpeta de **Trusted home services**, puedes pedir en Cursor que “actúe como” Security Engineer, Accessibility Auditor, etc., y seguirán sus checklists y entregables para auditar este codebase.

## Cómo instalar los agentes en Cursor (en este proyecto)

### Requisitos

- Repositorio de agentes clonado en:  
  `C:\Users\AlexDesk\Documents\Test project agents git`
- **Bash**: en Windows hace falta Git Bash o WSL para ejecutar los scripts del repo.

### Pasos

1. **Generar las reglas para Cursor** (crea `.mdc` en `integrations/cursor/rules/`):

   Desde Git Bash o WSL, en el repo de agentes:

   ```bash
   cd "C:/Users/AlexDesk/Documents/Test project agents git/agency-agents"
   ./scripts/convert.sh --tool cursor
   ```

   Si `convert.sh` no tiene permisos:  
   `chmod +x scripts/convert.sh` y volver a ejecutar.

2. **Instalar las reglas en el proyecto web** (copia a `Trusted home services/.cursor/rules/`):

   ```bash
   cd "C:/Users/AlexDesk/Documents/Trusted home services"
   "/c/Users/AlexDesk/Documents/Test project agents git/agency-agents/scripts/install.sh" --tool cursor
   ```

   Esto crea o actualiza `.cursor/rules/*.mdc` en este proyecto.

3. **Si no tienes Bash**: puedes copiar a mano los `.mdc` generados (tras ejecutar `convert.sh` en algún entorno) desde  
   `Test project agents git/agency-agents/integrations/cursor/rules/`  
   a  
   `Trusted home services/.cursor/rules/`.

## Cómo usar la auditoría en Cursor

Después de instalar, en el chat de Cursor puedes escribir por ejemplo:

- *“Usa las reglas de @security-engineer y audita este proyecto: seguridad, dependencias, formularios, headers, y entrega un resumen de riesgos y remediación.”*
- *“Actúa como @accessibility-auditor y revisa la home y las páginas legales contra WCAG 2.2 AA.”*
- *“Sigue el agente @legal-compliance-checker y revisa nuestra política de privacidad y el manejo de datos en el sitio.”*
- *“Como @reality-checker, valora si este sitio está listo para producción y qué falta.”*
- *“Con el rol de @frontend-developer, revisa estructura, rendimiento y buenas prácticas del frontend.”*

El nombre exacto del archivo `.mdc` (por ejemplo `security-engineer.mdc`) es el que Cursor usa como `@security-engineer`; suele ser el nombre del agente en minúsculas y con guiones.

## Resumen

- **Sí es posible** usar esos agentes para auditar Trusted Home Services en seguridad, buenas prácticas, organización y cumplimiento.
- Los “agentes” son **reglas de Cursor** (`.mdc`) que hacen que el modelo siga el proceso y los entregables de cada especialista.
- Para que “haya un agente para cada cosa”: Security Engineer (seguridad), Reality Checker (buenas prácticas / producción), Accessibility Auditor (accesibilidad), Legal Compliance Checker (legal/privacidad), y opcionalmente Frontend Developer / Backend Architect (organización y buenas prácticas de código).
- Pasos prácticos: ejecutar `convert.sh --tool cursor` en el repo de agentes y luego `install.sh --tool cursor` desde la carpeta de Trusted home services (o copiar los `.mdc` a mano si no usas Bash).

Si quieres, en el siguiente paso podemos ejecutar juntos `convert.sh` desde tu máquina (o simular la generación de un `.mdc` de ejemplo) y comprobar que Cursor reconoce las reglas en este proyecto.

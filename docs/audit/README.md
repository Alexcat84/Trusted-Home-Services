# Security audit — Trusted Home Services

Documentación de la auditoría de seguridad realizada el **22 de junio de 2026** sobre el proyecto desplegado en Vercel.

| Documento | Descripción |
|-----------|-------------|
| [security-audit.md](./security-audit.md) | Informe completo: alcance, metodología, hallazgos y estado de controles |
| [remediation-plan.md](./remediation-plan.md) | Plan de solución priorizado con fases, esfuerzo e impacto |
| [implementation-status.md](./implementation-status.md) | Estado de implementación de las fases 0–3 |

**Entorno auditado:** `https://trusted-home-services.vercel.app` (producción) + código en `main`.

**Contexto operativo:** el dominio custom `trustedhomeservices.ca` aún no apunta a Vercel; la auditoría aplica al deploy activo en Vercel.

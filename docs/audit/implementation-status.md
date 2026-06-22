# Estado de implementación — remediación de seguridad

**Última actualización:** 2026-06-22

## Fases completadas

| Fase | Estado | Notas |
|------|--------|-------|
| **Fase 0** — Quick wins | ✅ | CSV formula-safe, texto admin 30s, Vercel URL en `adminCors`, docs rotación secretos |
| **Fase 1** — Auth | ✅ | Sin bypass `ADMIN_SECRET`, login constant-time, cookie HttpOnly, `/api/admin/session`, `/api/admin/logout` |
| **Fase 2** — CSP enforced | ✅ | `Content-Security-Policy` activo; sin `unsafe-eval` ni `unsafe-inline` en scripts |
| **Fase 3** — Scripts sin inline | ✅ | `public/ga-init.js` + refactor `CookieConsent.jsx` |
| **Fase 4** — Hardening | ✅ | JWT/cookie 24 h, `noindex` admin, Dependabot, CI `npm audit`, CSP `report-uri` |

## Cambios técnicos clave

### Autenticación
- Módulos: `server-lib/admin-auth.js`, `server-lib/cookies.js`, `server-lib/admin-session.js`
- Cookie: `th_admin` — `HttpOnly`, `SameSite=Strict`, `Secure` en producción, **TTL 24 h**
- Admin UI: `credentials: 'include'`; sin `localStorage` para JWT
- Admin SEO: `<meta name="robots" content="noindex, nofollow">` en `AdminPage`

### CSP (vercel.json)
```
script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data:
report-uri /api/csp-report
```

### CI / dependencias
- `.github/dependabot.yml` — actualizaciones npm semanales
- `.github/workflows/security-audit.yml` — `npm audit --audit-level=high` en push/PR a `main`

### Verificación post-deploy
1. Login / logout en `/#admin` (sesión expira a las 24 h)
2. View source en admin → meta `noindex`
3. Aceptar cookies → GA sin errores CSP
4. Violaciones CSP → logs Vercel en `/api/csp-report`

## Backlog opcional

- [ ] Search Console + sitemap cuando el dominio custom esté activo
- [ ] Fotos/redes del cliente en Our Projects y footer

## Toolchain

- **Vite 8** + `@vitejs/plugin-react` 6 (2026-06-22) — build verificado; `npm audit` 0 vulnerabilidades

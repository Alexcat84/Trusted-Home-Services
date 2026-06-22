# Estado de implementación — remediación de seguridad

**Última actualización:** 2026-06-22  
**Commit de referencia:** (ver `git log` tras merge)

## Fases completadas

| Fase | Estado | Notas |
|------|--------|-------|
| **Fase 0** — Quick wins | ✅ | CSV formula-safe, texto admin 30s, Vercel URL en `adminCors`, docs rotación secretos |
| **Fase 1** — Auth | ✅ | Sin bypass `ADMIN_SECRET`, login constant-time, cookie HttpOnly, `/api/admin/session`, `/api/admin/logout` |
| **Fase 2** — CSP enforced | ✅ | `Content-Security-Policy` activo; sin `unsafe-eval` ni `unsafe-inline` en scripts |
| **Fase 3** — Scripts sin inline | ✅ | `public/ga-init.js` + refactor `CookieConsent.jsx` (no requiere Edge Middleware ni nonces) |
| **Fase 4** — Backlog | ⏳ | JWT corto, CSP report-uri, Dependabot, etc. |

## Cambios técnicos clave

### Autenticación
- Módulos: `server-lib/admin-auth.js`, `server-lib/cookies.js`
- Cookie: `th_admin` — `HttpOnly`, `SameSite=Strict`, `Secure` en producción
- Admin UI: `credentials: 'include'`; sin `localStorage` para JWT

### CSP (vercel.json)
```
script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com  (React inline styles)
img-src 'self' data:
```

### Verificación post-deploy
1. Login / logout en `/#admin`
2. Listado y PATCH de submissions
3. Aceptar cookies → GA carga (Network: gtag/js + ga-init.js)
4. Consola sin errores CSP en home y admin
5. `curl -I` muestra `Content-Security-Policy` (no Report-Only)

## Pendiente (Fase 4)

- [ ] Acortar TTL JWT (24 h)
- [ ] `report-uri` / `report-to` para violaciones CSP
- [ ] Dependabot o `npm audit` en CI
- [ ] `X-Robots-Tag: noindex` en admin (opcional)

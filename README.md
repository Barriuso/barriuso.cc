# barriuso — Offensive Security Research

Sitio personal estático de pentesting / red team / security research.

El proyecto está directamente en la raíz de `barriuso-web`. El diseño proporcionado se conserva, con la identidad `barriuso` en textos, terminal, favicon e imágenes. La carpeta contenedora anterior se ha eliminado.

Estética terminal, contenido en Markdown, búsqueda local (`Ctrl+K`) y despliegue en GitHub Pages.

> Breaking things to understand how they work.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Markdown en `src/content/` (posts, writeups, tools)
- SPA estática (HashRouter) lista para GitHub Pages
- GitHub Actions → GitHub Pages

No hay base de datos ni claves en el frontend. Las estrellas de GitHub son una captura de los datos públicos, con fecha de consulta en `starsChecked`; no se actualizan en directo.

## Desarrollo

```bash
npm ci
npm run dev
```

Build:

```bash
npm run build
```

El build verifica TypeScript y genera RSS, sitemap y metadatos. `npm run check` ejecuta solo la comprobación de tipos.

## Cómo publicar un artículo

1. Crea un fichero Markdown en `src/content/posts/`:

```
src/content/posts/abusing-kerberos-delegation.md
```

El **slug** de la URL es el nombre del fichero (sin `.md`):

```
/#/articles/abusing-kerberos-delegation
```

2. Frontmatter mínimo:

```yaml
---
title: "Abusing Kerberos Delegation"
description: "Understanding Kerberos delegation attacks in Active Directory"
date: 2026-09-10
author: "barriuso"
tags:
  - Active Directory
  - Kerberos
  - Pentesting
category: "Active Directory"
draft: false
---
```

3. Escribe el cuerpo en Markdown. Soporta:

- títulos (`##`, `###`) → TOC automático
- listas, tablas, blockquotes
- ` ```bash ` / `python` / `powershell` / `json` / `yaml` / …
- callouts:

```markdown
:::note
Texto
:::

:::warn
Texto
:::
```

4. `draft: true` oculta el post de los listados. No es una medida de privacidad: todos los archivos versionados se ven en un repositorio público, y el importador puede incluir borradores en el JavaScript generado. Conserva cualquier material privado fuera de este proyecto.

5. `sample: true` identifica contenido de ejemplo en las tarjetas, la página y los metadatos. Los ejemplos usan `author: "Template sample"` para no atribuir una experiencia a la persona propietaria del sitio.

6. Commit y `git push`. Actions construye y publica.

## Writeups

Ficheros en `src/content/writeups/`. Extra:

```yaml
difficulty: "Hard"      # Easy | Medium | Hard | Insane
platform: "Hack The Box"
os: "Windows"
```

URL: `/#/writeups/<slug>`

## Tools

Ficheros en `src/content/tools/`. Extra:

```yaml
language: "Python"
repo: "https://github.com/Barriuso/b64_windows"
stars: 2
starsChecked: "2026-09-10"
featured: true
```

La sección incluye cuatro proyectos públicos verificados el 10 de septiembre de 2026: `SMBGhost_AutomateExploitation`, `b64_windows`, `binaryToShellcode` y `python_cheatsheet`. Se conservan los créditos indicados en sus README. Los enlaces apuntan a los repositorios reales de `Barriuso`; las fichas no incorporan capturas ficticias ni instrucciones de instalación inventadas. Las fechas de las fichas corresponden a la creación de cada repositorio.

Puedes añadir una captura real mediante el campo opcional `screenshot`, con la ruta de un archivo en `public/`.

## Personalizar identidad

Edita `src/config.ts`:

- handle (`barriuso`)
- GitHub (otros contactos solo cuando estén verificados)
- título y tagline

Cambia `./barriuso` en el header automáticamente.

## Búsqueda

`Ctrl+K` (o `⌘K`) abre la command palette. Indexa articles, writeups, tools, tags y páginas. Es 100% local.

## SEO / RSS

- meta + Open Graph + Twitter en `index.html` y por ruta (`Seo`)
- `public/robots.txt`
- El build regenera `dist/sitemap.xml`, `dist/rss.xml` y `dist/robots.txt` desde el contenido y la dirección configurada.
- La URL de la vista previa se guarda en `site.config.json`. Puedes sustituirla con `VITE_SITE_URL`, la URL pública completa (incluido el subdirectorio, si existe), y `BASE_PATH`, con `/` o `/nombre-del-repo/`. Usa `.env.production.local` o variables del entorno.
- Se conserva el `HashRouter` del diseño entregado. Las rutas `/#/articles/...` funcionan sin servidor, pero los buscadores y las tarjetas sociales reciben inicialmente el documento principal. El sitemap incluye la URL base, no fragmentos. Para SEO independiente por artículo sería necesaria una migración a páginas prerenderizadas.
- En una primera vista previa sin URL asignada, el build omite la canonical y marca el sitio como no indexable. Una vez definida `VITE_SITE_URL`, genera los metadatos definitivos.

## GitHub Pages

1. Settings → Pages → Source: **GitHub Actions**
2. Push a `main`
3. El workflow `.github/workflows/deploy.yml` instala, hace build y publica `dist/`

El workflow detecta automáticamente repositorios de usuario y de proyecto. Para un dominio personalizado, configura las variables de GitHub `VITE_SITE_URL` y `BASE_PATH`. Los enlaces a imágenes y RSS respetan ese prefijo.

El perfil GitHub y los cuatro proyectos de Tools se han verificado con datos públicos. Se han retirado los contactos inventados. Los artículos y writeups de la plantilla están señalados como ejemplos pendientes de revisión y no se atribuyen al propietario como trabajos realizados.

La publicación se prepara para `https://barriuso.cc` desde `https://github.com/Barriuso/barriuso.cc`. Configura GitHub Pages con la fuente GitHub Actions y el dominio personalizado `barriuso.cc`. Cloudflare gestiona el DNS. La integración local de Sites en `.openai/` se excluye de los archivos generados con `git archive`; no contiene claves de acceso.

## Estructura

```
src/
  components/     Header, Footer, Terminal, cards, palette, markdown
  content/
    posts/
    writeups/
    tools/
  layouts/        (Layout.tsx)
  lib/            markdown, content loader, highlight
  pages/
  styles/         index.css
public/           favicon, og, robots, rss, sitemap, images
.github/workflows/deploy.yml
```

## Notas de seguridad

- No subas hashes, tickets, ni loot de clientes.
- No incluyas API keys.
- Los writeups de este repo son **metodología**, no PoCs explotables.

## Licencia

Contenido y código: úsalo, fórkealo, cámbiale el handle. Las capturas de lab son ilustrativas.

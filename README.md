# 🐾 Pet Paradise Shop

Tienda online de productos para mascotas construida con **Next.js 16** y **Tailwind CSS 4**, desplegada en **Vercel** y conectada a **Shopify** como backend (catálogo, carrito y checkout a través de la Storefront API).

---

## 🏗️ Arquitectura

```
┌─────────────────┐        Storefront API (GraphQL)        ┌─────────────────┐
│                 │  ────────────────────────────────────► │                 │
│  Next.js        │   productos · carrito · checkout        │    Shopify      │
│  (frontend)     │  ◄──────────────────────────────────── │   (backend)     │
│  en Vercel      │                                          │                 │
└────────┬────────┘                                          └─────────────────┘
         │
         │  formulario de contacto (nodemailer + Gmail)
         ▼
   📧 Email al vendedor
```

- **Frontend:** Next.js (App Router) alojado en Vercel.
- **Backend / e-commerce:** Shopify. El catálogo, los precios, el carrito y el checkout viven en Shopify; la web los consume vía la **Storefront API**.
- **Modo demo:** si Shopify no está configurado, la web funciona igual mostrando productos de demostración (ver `src/lib/shopify.ts`).
- **Contacto:** un endpoint (`/api/contact`) envía los mensajes del formulario por email usando Gmail.

---

## 🚀 Puesta en marcha local

Requisitos: **Node.js 20+**.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env.local   # y completá los valores (ver más abajo)

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts disponibles

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Servidor de desarrollo               |
| `npm run build` | Build de producción                  |
| `npm run start` | Sirve el build de producción         |
| `npm run lint`  | Linter (ESLint)                      |

---

## 🔑 Variables de entorno

Creá un archivo `.env.local` (nunca se sube a git) con las siguientes variables:

```env
# ── Shopify (backend / catálogo) ─────────────────────────────
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Formulario de contacto (Gmail) ───────────────────────────
GMAIL_USER=tucorreo@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

| Variable | Dónde se usa | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `src/lib/shopify.ts` | Dominio de tu tienda Shopify (ej. `mitienda.myshopify.com`). |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `src/lib/shopify.ts` | **Token público** de la Storefront API. |
| `GMAIL_USER` | `src/app/api/contact/route.ts` | Cuenta de Gmail que envía los mensajes de contacto. |
| `GMAIL_APP_PASSWORD` | `src/app/api/contact/route.ts` | Contraseña de aplicación de Gmail (no la contraseña normal). |

---

## 🛍️ Conectar Shopify (backend)

1. Ingresá al **Panel de administración de Shopify**.
2. Andá a **Settings → Apps and sales channels → Develop apps**.
3. Creá una app personalizada (**Create an app**).
4. En **Configuration → Storefront API**, habilitá los permisos de lectura necesarios:
   - `unauthenticated_read_product_listings` (productos)
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts` / `unauthenticated_read_checkouts` (carrito y checkout)
5. Instalá la app y copiá el **Storefront API access token** (público).
6. Pegá el token y tu dominio en las variables `NEXT_PUBLIC_SHOPIFY_*`.

Una vez configurado, la web reemplaza automáticamente los productos de demostración por los reales de tu tienda. El checkout redirige al carrito seguro de Shopify.

---

## ▲ Despliegue en Vercel

1. Subí este repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importá el repositorio.
3. Vercel detecta Next.js automáticamente (no hace falta configurar el build).
4. En **Settings → Environment Variables**, cargá las mismas variables del `.env.local`:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
5. Hacé **Deploy**. Cada `git push` a la rama principal genera un despliegue automático.

> 💡 Recordá cargar las variables en Vercel para los entornos **Production**, **Preview** y **Development** según los necesites.

---

## 📧 Formulario de contacto (Gmail)

El endpoint `POST /api/contact` (`src/app/api/contact/route.ts`) recibe `{ nombre, email, mensaje }` y envía un correo con **nodemailer** vía Gmail.

Para obtener la `GMAIL_APP_PASSWORD`:

1. Activá la **verificación en dos pasos** en tu cuenta de Google.
2. Andá a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Generá una **contraseña de aplicación** y usala como `GMAIL_APP_PASSWORD`.

---

## 🧰 Stack

- [Next.js 16](https://nextjs.org) — App Router
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront) — backend e-commerce
- [Nodemailer](https://nodemailer.com) — envío de emails
- [Vercel](https://vercel.com) — hosting y CI/CD

---

## 📁 Estructura relevante

```
src/
├── app/
│   ├── api/contact/route.ts   # Endpoint del formulario de contacto (Gmail)
│   └── producto/[handle]/     # Página de detalle de producto
├── lib/
│   ├── shopify.ts             # Cliente de la Storefront API + productos demo
│   ├── queries.ts             # Queries y mutations GraphQL de Shopify
│   └── sanitize.ts            # Sanitización de HTML (anti-XSS)
├── context/CartContext.tsx    # Estado global del carrito
└── types/shopify.ts           # Tipos de Shopify
```

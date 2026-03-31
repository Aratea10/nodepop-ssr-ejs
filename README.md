# 🎯 Nodepop (SSR - EJS)
<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/EJS-2B3A42?style=for-the-badge)](https://ejs.co/)
[![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)](https://www.ecma-international.org/)
[![CSS3](https://img.shields.io/badge/css-663399?style=for-the-badge&logo=css&logoColor=white)](https://www.w3.org/Style/CSS/)

</div>

## 📖 Descripción
Nodepop es una aplicación server-side rendered (SSR) desarrollada con Express y EJS para gestionar anuncios de venta de segunda mano.

Cada anuncio (producto) contiene:

- Nombre
- Propietario (usuario que lo publica)
- Precio
- Tags (uno o varios de: `work`, `lifestyle`, `motor`, `mobile`)

Funcionalidades principales:

- Lista de productos del usuario (paginada) con filtros por tag, rango de precio y nombre por prefijo.
- Creación de producto.
- Borrado de producto (cada usuario solo puede borrar/ver sus propios productos).

La aplicación usa MongoDB (Mongoose) para persistencia y `express-session` con `connect-mongo` para sesiones.

---

## 🌐 Despliegue en producción

La aplicación está desplegada en un servidor AWS EC2:

### Ejercicio 1 - Nodepop (por dominio)

[**http://aratea.duckdns.org**](http://aratea.duckdns.org)

### Ejercicio 2 - React Avanzado / Next.js (por IP)

[**http://35.170.15.75**](http://35.170.15.75)

### Archivo estático servido por Nginx con cabecera X-Owner

[**http://aratea.duckdns.org/public/stylesheets/login.css**](http://aratea.duckdns.org/public/stylesheets/login.css)

> Verificar cabecera `X-Owner: Aratea10`:
> ```bash
> curl -I http://aratea.duckdns.org/public/stylesheets/login.css
> ```

### Arquitectura de despliegue

- **Servidor:** AWS EC2 (t3.micro) con Ubuntu 24.04 LTS
- **IP estática:** [35.170.15.75](http://35.170.15.75) (Elastic IP)
- **Dominio:** [aratea.duckdns.org](http://aratea.duckdns.org)
- **Nodepop:** Node.js v20 + Express + MongoDB + Supervisor (puerto 3000)
- **Marketplace:** Next.js 16 + PostgreSQL (Docker) + Supervisor (puerto 4000)
- **Nginx:** Proxy inverso + archivos estáticos con cabecera X-Owner
- **Repositorio de configuración:** [https://github.com/Aratea10/devops-practice](https://github.com/Aratea10/devops-practice)

---

## ✨ Características principales
- SSR con EJS para renderizado de páginas.
- Modelos Mongoose: `User` y `Product`.
- Búsqueda y filtros: tag, priceMin, priceMax, name (starts-with).
- Paginación y `skip`/`limit`.
- Ordenación por nombre y precio.
- Seed script (`scripts/initDB.js`) que carga usuarios y productos de ejemplo.

---

## 🛠️ Stack tecnológico
| Backend           | Base de datos      | Vistas | Utilidades                       |
| ----------------: | :----------------: | :----: | :------------------------------: |
| Node.js + Express | MongoDB (Mongoose) |  EJS   | nodemon, dotenv, express-session |

---

## 🚀 Cómo ejecutar el proyecto (local)
### Prerrequisitos
- Node.js (>= 16 recomendado)
- MongoDB accesible (local o en URI)

### Instalar dependencias
```bash
npm install
```

### Variables de entorno
Copiar `.env.example` o crear `.env` con al menos las siguientes variables:

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/nodepop
SESSION_SECRET=tu_secreto_de_sesion
```

### Inicializar la base de datos (seed)

El proyecto incluye `scripts/initDB.js` que borra y carga usuarios y productos de ejemplo. Úsalo solo en entornos de desarrollo.

```bash
npm run initDB
```

Las credenciales seeds incluidas (solo dev):

```
kratos@example.com   / hQXs5Eu0LvqM
zeus@example.com     / KEP3sIRhRliC
atenea@example.com   / Q7qqtMVU5zVa
poseidon@example.com / mvgMMwfzmb0s
... (más usuarios en scripts/initDB.js)
```

### Ejecutar en modo desarrollo
```bash
npm run dev
# o
npm start
```

Por defecto la app escucha en `http://localhost:3000` (siempre que PORT esté libre o configurado por `.env`).

Si encuentras "Port 3000 is already in use" detén la otra instancia o cambia `PORT` en `.env`.

---

## 🔎 Endpoints y ejemplos de uso
- GET `/` — Página principal (muestra el índice si el usuario está autenticado, de lo contrario redirige al login).
- GET `/auth/login` — Formulario de login.
- POST `/auth/login` — Iniciar sesión (email + password).
- POST `/auth/logout` — Cerrar sesión.
- GET `/products` — Lista de productos del usuario autenticado (permite filtros y paginación).
- GET `/products/new` — Formulario para crear un nuevo producto.
- POST `/products/new` — Crear producto.
- POST `/products/:id/delete` — Borrar producto (solo propietario).

Ejemplo de query con filtros/paginación:
```
GET /products?tag=lifestyle&priceMin=100&priceMax=1000&page=1&limit=8&sort=price-asc
```

Notas sobre filtros:
- `tag` debe ser uno de: `work`, `lifestyle`, `motor`, `mobile`.
- `priceMin` / `priceMax` son números (floats aceptados).
- `name` busca por prefijo (empieza por...).
- `skip` puede usarse para paginación alternativa.

---

## 📁 Estructura del proyecto (resumen)
```
nodepop-ssr-ejs/
├── app.js
├── bin/
│   └── www
├── lib/
│   └── connectMongoose.js
├── models/
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   └── products.js
├── views/
│   ├── partials/
│   │   ├── _head.ejs
│   │   └── _header.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── product-new.ejs
│   └── error.ejs
├── public/
│   ├── stylesheets/
│   └── javascripts/
├── scripts/
│   └── initDB.js
├── package.json
└── README.md
```

---

## ✅ Buenas prácticas y recomendaciones
- No comitees `.env` ni secretos en repositorios públicos.
- El `scripts/initDB.js` contiene contraseñas para testing: elimínalas o cámbialas en producción.
- Para despliegue, configurar correctamente `PORT`, `MONGODB_URI` y `SESSION_SECRET`.

---

## 🤝 Contribución
Si quieres mejorar el proyecto:

1. Haz fork del repositorio.
2. Crea una rama: `git checkout -b feature/mi-mejora`.
3. Haz commits claros y push.
4. Abre un PR describiendo los cambios.

---

## 📄 Licencia
Este proyecto se entrega con **Licencia MIT**.

---

## 👨‍💻 Autor
**Sara Gallego Méndez (Aratea10)** — estudiante Bootcamp Desarrollo Web FullStack

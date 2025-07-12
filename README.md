# 🚀 Pokedex API

<p align="center">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" width="120" alt="Pikachu" />
</p>

<p align="center">Una API RESTful moderna para gestionar información de Pokémon, construida con NestJS y TypeScript.</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
</p>

## 📝 Descripción

Esta es una API RESTful para gestionar información de Pokémon, desarrollada como ejemplo de implementación con NestJS. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una colección de Pokémon.

### ✨ Características

- 🏗️ **Arquitectura modular** con NestJS
- 🔒 **TypeScript** para mayor seguridad de tipos
- 🌐 **CORS habilitado** para desarrollo frontend
- 📡 **API REST** con prefijo global `/api`
- 🎯 **DTOs** para validación de datos
- 🧪 **Testing** con Jest incluido
- 📁 **Estructura de proyecto** bien organizada

## 🛠️ Tecnologías

- **[NestJS](https://nestjs.com/)** - Framework de Node.js
- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript
- **[Jest](https://jestjs.io/)** - Framework de testing

## 📋 Prerequisitos

- Node.js (v16 o superior)
- npm o yarn

## 🚀 Instalación del proyecto

```bash
# Clonar el repositorio
git clone https://github.com/martuwilson/nest-mongo-pokedex-example.git
cd pokedex

# Instalar dependencias
npm install
```

## 🏃‍♂️ Ejecutar el proyecto

```bash
# Desarrollo
npm run start

# Modo desarrollo con recarga automática
npm run start:dev

# Modo producción
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3001`

## 🔌 API Endpoints

Todos los endpoints tienen el prefijo `/api`:

### Pokémon

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pokemon` | Obtener todos los Pokémon |
| `GET` | `/api/pokemon/:id` | Obtener un Pokémon por ID |
| `POST` | `/api/pokemon` | Crear un nuevo Pokémon |
| `PATCH` | `/api/pokemon/:id` | Actualizar un Pokémon |
| `DELETE` | `/api/pokemon/:id` | Eliminar un Pokémon |

### Ejemplo de uso

```bash
# Obtener todos los Pokémon
curl http://localhost:3001/api/pokemon

# Crear un nuevo Pokémon
curl -X POST http://localhost:3001/api/pokemon \
  -H "Content-Type: application/json" \
  -d '{"name": "Pikachu", "type": "Electric", "level": 25}'
```

## 🧪 Ejecutar tests

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov

# Tests en modo watch
npm run test:watch
```

## 📁 Estructura del proyecto

```
src/
├── app.controller.ts      # Controlador principal
├── app.module.ts          # Módulo principal
├── main.ts               # Punto de entrada
└── pokemon/              # Módulo Pokémon
    ├── dto/              # Data Transfer Objects
    │   ├── create-pokemon.dto.ts
    │   └── update-pokemon.dto.ts
    ├── entities/         # Entidades
    │   └── pokemon.entity.ts
    ├── pokemon.controller.ts
    ├── pokemon.module.ts
    └── pokemon.service.ts
```

## 🌐 Frontend

El proyecto incluye un frontend básico en la carpeta `public/` que puedes usar para probar la API:

- `index.html` - Interfaz web
- `script.js` - Lógica JavaScript
- `css/styles.css` - Estilos

## 🚀 Despliegue

Para desplegar tu aplicación NestJS en producción, consulta la [documentación de despliegue](https://docs.nestjs.com/deployment).

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📖 Recursos útiles

- [Documentación de NestJS](https://docs.nestjs.com)
- [Canal de Discord de NestJS](https://discord.gg/G7Qnnhy)
- [Cursos oficiales de NestJS](https://courses.nestjs.com/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

- **Martín Wilson** - [@martuwilson](https://github.com/martuwilson)

---

<p align="center">
  ⭐ ¡Dale una estrella si te gustó el proyecto! ⭐
</p>

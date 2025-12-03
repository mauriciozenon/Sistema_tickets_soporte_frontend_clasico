# Configuración de Variables de Entorno

Este proyecto usa un sistema de configuración basado en archivos JavaScript para manejar variables de entorno.

## 🚀 Configuración Rápida

### Para Desarrollo Local

1. Copia el archivo de ejemplo:
   ```bash
   cp config/env.example.js config/env.js
   ```

2. El archivo `config/env.js` ya está configurado para desarrollo local:
   ```javascript
   window.ENV = {
     API_BASE: 'http://localhost:3000/api',
     ENVIRONMENT: 'development'
   };
   ```

### Para Producción (GitHub Pages)

1. Antes de desplegar a GitHub Pages, crea `config/env.js` con tu URL de producción:
   ```javascript
   window.ENV = {
     API_BASE: 'https://tu-api-produccion.com/api',
     ENVIRONMENT: 'production'
   };
   ```

2. Despliega normalmente a GitHub Pages

## 📝 Notas Importantes

- ⚠️ El archivo `config/env.js` **NO se sube a Git** (está en `.gitignore`)
- ✅ El archivo `config/env.example.js` **SÍ se sube a Git** como plantilla
- 🔧 Cada desarrollador debe crear su propio `config/env.js` local
- 🌐 Para GitHub Pages, usa GitHub Actions para inyectar secrets automáticamente

## 🚀 Deployment a GitHub Pages

**¡Usa GitHub Actions para inyectar secrets automáticamente!**

En lugar de crear `config/env.js` manualmente, configura GitHub Actions:

1. **Agrega tu API URL como secret en GitHub:**
   - Settings → Secrets and variables → Actions
   - New repository secret: `API_BASE_URL`
   - Valor: `https://tu-api-produccion.com/api`

2. **GitHub Actions generará `env.js` automáticamente** en cada deployment

📖 **Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones completas**

## 🛠️ Agregar Nuevas Variables

Edita `config/env.js` y agrega tus variables:

```javascript
window.ENV = {
  API_BASE: 'http://localhost:3000/api',
  ENVIRONMENT: 'development',
  TIMEOUT: 5000,
  DEBUG: true,
  // ... más variables
};
```

Luego accede a ellas en tu código:
```javascript
const timeout = window.ENV.TIMEOUT;
```

## ❓ Solución de Problemas

**Error: `window.ENV is undefined`**
- Asegúrate de que `config/env.js` existe
- Verifica que el script se carga antes que otros scripts en tu HTML:
  ```html
  <script src="./config/env.js"></script>
  <script src="./scripts/utils.js"></script>
  ```

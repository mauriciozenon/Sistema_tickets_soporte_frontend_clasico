# Configuración de GitHub Actions para Deployment

Este proyecto usa GitHub Actions para desplegar automáticamente a GitHub Pages, inyectando las variables de entorno desde GitHub Secrets.

## 🔐 Configurar Secrets en GitHub

### Paso 1: Ir a Settings del Repositorio

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**

### Paso 2: Agregar el Secret

1. Click en **New repository secret**
2. Nombre: `API_BASE_URL`
3. Valor: La URL de tu API de producción (ejemplo: `https://tu-api.com/api`)
4. Click en **Add secret**

## 🚀 Cómo Funciona el Deployment

### Automático
Cada vez que hagas `git push` a la rama `main`, GitHub Actions:
1. ✅ Genera automáticamente `config/env.js` con el valor de `API_BASE_URL` desde los secrets
2. ✅ Despliega todo el sitio a GitHub Pages

### Manual
También puedes ejecutar el deployment manualmente:
1. Ve a la pestaña **Actions** en tu repositorio
2. Selecciona el workflow **Deploy to GitHub Pages**
3. Click en **Run workflow**

## 📝 Archivo de Workflow

El workflow está en: `.github/workflows/deploy.yml`

### Lo que hace:
```yaml
- Genera config/env.js con:
  window.ENV = {
    API_BASE: '${{ secrets.API_BASE_URL }}',
    ENVIRONMENT: 'production'
  };
  
- Despliega a GitHub Pages
```

## ⚙️ Configuración de GitHub Pages

Asegúrate de que GitHub Pages esté configurado correctamente:

1. Ve a **Settings** → **Pages**
2. En **Source**, selecciona **GitHub Actions**
3. Guarda los cambios

## 🔍 Verificar el Deployment

Después de cada deployment:
1. Ve a la pestaña **Actions**
2. Verás el workflow ejecutándose
3. Click en el workflow para ver los logs
4. Busca el paso "Create env.js from secrets" para ver el contenido generado

## 🛠️ Desarrollo Local

Para desarrollo local, sigue usando tu archivo `config/env.js` local:

```javascript
window.ENV = {
  API_BASE: 'http://localhost:3000/api',
  ENVIRONMENT: 'development'
};
```

Este archivo NO se sube a Git (está en `.gitignore`).

## ❓ Solución de Problemas

### Error: "Secret API_BASE_URL not found"
- Verifica que hayas creado el secret con el nombre exacto `API_BASE_URL`
- Los nombres de secrets son case-sensitive

### El sitio no se actualiza
- Verifica que el workflow se haya ejecutado correctamente en la pestaña Actions
- Puede tomar unos minutos para que GitHub Pages se actualice

### env.js no se genera
- Revisa los logs del workflow en la pestaña Actions
- Verifica que el paso "Create env.js from secrets" se haya ejecutado

## 🔄 Agregar Más Variables

Para agregar más variables de entorno:

1. **Agrega el secret en GitHub:**
   - Settings → Secrets → New secret
   - Ejemplo: `OTRA_VARIABLE`

2. **Actualiza el workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   cat > config/env.js << EOF
   window.ENV = {
     API_BASE: '${{ secrets.API_BASE_URL }}',
     OTRA_VARIABLE: '${{ secrets.OTRA_VARIABLE }}',
     ENVIRONMENT: 'production'
   };
   EOF
   ```

3. **Usa la variable en tu código:**
   ```javascript
   const otraVar = window.ENV.OTRA_VARIABLE;
   ```

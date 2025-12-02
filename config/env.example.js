/**
 * Archivo de ejemplo de configuración de variables de entorno
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo como 'env.js' en el mismo directorio
 * 2. Actualiza los valores según tu ambiente (desarrollo o producción)
 * 3. NO subas el archivo 'env.js' a Git (está en .gitignore)
 * 
 * Para desarrollo local:
 *   API_BASE: 'http://localhost:3000/api'
 * 
 * Para producción (GitHub Pages):
 *   API_BASE: 'https://tu-api-produccion.com/api'
 */

window.ENV = {
    // URL base de tu API backend
    API_BASE: 'http://localhost:3000/api',

    // Ambiente actual: 'development' o 'production'
    ENVIRONMENT: 'development',

    // Otras configuraciones que puedas necesitar
    // TIMEOUT: 5000,
    // DEBUG: true,
};

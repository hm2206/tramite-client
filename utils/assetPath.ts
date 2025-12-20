/**
 * Utilidad para manejar rutas de assets estáticos
 *
 * IMPORTANTE:
 * - Para Next.js Link y Router.push NO usar estas funciones (Next.js maneja basePath automáticamente)
 * - Solo usar para elementos HTML nativos: <img src>, <link href>, etc.
 */

const ASSET_PREFIX_RAW = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// Asegurar que el prefijo termine con /
export const ASSET_PREFIX = ASSET_PREFIX_RAW
  ? (ASSET_PREFIX_RAW.endsWith('/') ? ASSET_PREFIX_RAW : ASSET_PREFIX_RAW + '/')
  : '';

/**
 * Genera la ruta completa para un asset estático
 * @param path - Ruta relativa del asset (ej: 'img/logo.png', 'css/app.css')
 * @returns Ruta completa con el prefijo de assets
 */
export const assetPath = (path: string): string => {
  // Remover / inicial si existe para evitar doble /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${ASSET_PREFIX}${cleanPath}`;
};

/**
 * Genera la ruta para imágenes
 */
export const imagePath = (filename: string): string => {
  return assetPath(`img/${filename}`);
};

/**
 * Genera la ruta para archivos CSS
 */
export const cssPath = (filename: string): string => {
  return assetPath(`css/${filename}`);
};

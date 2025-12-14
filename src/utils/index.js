export function createPageUrl(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

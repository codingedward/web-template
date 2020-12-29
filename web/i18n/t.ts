import en from './en';

const cache = {};

export default function t(fieldName = ''): string {
  if (cache[fieldName]) {
    return cache[fieldName];
  }
  const value = fieldName
    .split('.')
    .reduce((foundPath, pathKey) => foundPath[pathKey] ?? '', en);
  cache[fieldName] = value;
  return value;
}

declare global {
  function t(fieldName: string): string;
}

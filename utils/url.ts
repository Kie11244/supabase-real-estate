import type { Property } from '../types';

const latinCharMap: Record<string, string> = {
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ä': 'a',
  'æ': 'ae',
  'å': 'a',
  'ã': 'a',
  'ā': 'a',
  'è': 'e',
  'é': 'e',
  'ê': 'e',
  'ë': 'e',
  'ē': 'e',
  'ì': 'i',
  'í': 'i',
  'î': 'i',
  'ï': 'i',
  'ī': 'i',
  'ò': 'o',
  'ó': 'o',
  'ô': 'o',
  'ö': 'o',
  'ø': 'o',
  'ō': 'o',
  'õ': 'o',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ü': 'u',
  'ū': 'u',
  'ñ': 'n',
  'ç': 'c',
  'ß': 'ss',
  'ý': 'y',
  'ỳ': 'y',
  'ÿ': 'y',
};

const replaceAccents = (value: string) =>
  value
    .split('')
    .map((char) => latinCharMap[char as keyof typeof latinCharMap] ?? char)
    .join('');

export const slugify = (value: string): string => {
  if (!value) return '';
  const normalized = replaceAccents(value)
    .toLowerCase()
    .replace(/['`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-');

  const collapsed = normalized.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  return collapsed;
};

export const buildPropertySlug = (property: Property): string => {
  const base = property.slug_en || property.title_en || property.title_th || 'room';
  const slug = slugify(base) || 'room';
  return `${slug}-${property.id}`;
};

export const buildPropertyPath = (property: Property): string => {
  const slug = buildPropertySlug(property);
  return `/projects/${property.project_slug}/${property.type}/${slug}`;
};

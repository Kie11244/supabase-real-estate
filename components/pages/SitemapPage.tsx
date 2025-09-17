import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import Spinner from '../ui/Spinner';
import { buildPropertyPath } from '../../utils/url';
import type { Property, Project } from '../../types';

// FIX: Define an interface for sitemap URL objects to allow for the optional 'lastmod' property.
interface SitemapUrl {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

const SitemapPage: React.FC = () => {
  const [sitemapXml, setSitemapXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('id, created_at, project_slug, type, slug_en, title_en, title_th');

        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('slug, created_at, updated_at');

        if (propertiesError) throw propertiesError;
        if (projectsError) throw projectsError;
        
        // Note: The app doesn't have dedicated project detail pages, 
        // so only properties are included in the dynamic URLs for now.
        // Articles are not part of the current app structure.

        const baseUrl = window.location.origin;
        // FIX: Type the 'urls' array with the SitemapUrl interface.
        const urls: SitemapUrl[] = [
          { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
          { loc: `${baseUrl}/projects`, priority: '0.9', changefreq: 'daily' },
          { loc: `${baseUrl}/properties`, priority: '0.7', changefreq: 'daily' },
          { loc: `${baseUrl}/login`, priority: '0.5', changefreq: 'monthly' },
        ];

        projects?.forEach((project) => {
          const projectDates = (project as Project & { updated_at?: string }).updated_at || project.created_at;
          const lastmod = projectDates ? new Date(projectDates).toISOString().split('T')[0] : undefined;
          urls.push(
            { loc: `${baseUrl}/projects/${project.slug}`, changefreq: 'weekly', priority: '0.8', lastmod },
            { loc: `${baseUrl}/projects/${project.slug}/rent`, changefreq: 'weekly', priority: '0.7', lastmod },
            { loc: `${baseUrl}/projects/${project.slug}/buy`, changefreq: 'weekly', priority: '0.7', lastmod },
          );
        });

        properties?.forEach(property => {
          const propertyRecord = {
            ...property,
          } as Property;
          urls.push({
            loc: `${baseUrl}${buildPropertyPath(propertyRecord)}`,
            lastmod: new Date(property.created_at).toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.7'
          });
        });
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

        setSitemapXml(sitemap.trim());

      } catch (err: any) {
        console.error("Error generating sitemap:", err);
        setError(err.message || 'Failed to generate sitemap.');
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);
  
  // This component is intended to be rendered at a ".xml" path.
  // It renders a <pre> tag, and crawlers should be able to parse the content.
  // In a server-rendered app, we would set the Content-Type header to 'application/xml'.

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-4 font-sans text-red-500">Error generating sitemap: {error}</div>;
  }

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace', margin: 0 }}>
      {sitemapXml}
    </pre>
  );
};

export default SitemapPage;
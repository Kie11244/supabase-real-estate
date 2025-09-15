import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Project } from '../../types';

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Form state
  const [title_th, setTitleTh] = useState('');
  const [project_slug, setProjectSlug] = useState('');
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [price, setPrice] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [bathrooms, setBathrooms] = useState<number | ''>('');
  const [size_sqm, setSizeSqm] = useState<number | ''>('');
  const [floor, setFloor] = useState<number | ''>('');
  const [status, setStatus] = useState<'available' | 'unavailable'>('available');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('slug, name_th');
      if (error) {
        console.error('Error fetching projects:', error);
        setError('Could not load projects. Please try again later.');
      } else {
        setProjects(data as any[]);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!project_slug || !title_th || price === '' || bedrooms === '' || bathrooms === '' || size_sqm === '') {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }

    try {
      const { error: insertError } = await supabase.from('properties').insert([
        {
          title_th,
          project_slug,
          type,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          size_sqm: Number(size_sqm),
          floor: floor === '' ? null : Number(floor),
          status,
        },
      ]);

      if (insertError) {
        throw insertError;
      }
      
      alert('Property added successfully!');
      navigate('/dashboard');

    } catch (err: any) {
        let errorMessage = 'An unexpected error occurred.';
        if (typeof err === 'string') {
            errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
            errorMessage = String(err.message);
        }
        setError(errorMessage);
        console.error('Error adding property:', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Property</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project */}
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project</label>
            <select
              id="project"
              value={project_slug}
              onChange={(e) => setProjectSlug(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>Select a project</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name_th}</option>
              ))}
            </select>
          </div>

          {/* Title (TH) */}
          <div>
            <label htmlFor="title_th" className="block text-sm font-medium text-gray-700">Title (Thai)</label>
            <input
              type="text"
              id="title_th"
              value={title_th}
              onChange={(e) => setTitleTh(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Listing Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'rent' | 'buy')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
              </select>
            </div>
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (THB)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                required
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Bathrooms */}
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Size */}
            <div>
              <label htmlFor="size_sqm" className="block text-sm font-medium text-gray-700">Size (m²)</label>
              <input
                type="number"
                id="size_sqm"
                value={size_sqm}
                onChange={(e) => setSizeSqm(e.target.value === '' ? '' : Number(e.target.value))}
                required
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Floor */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Floor</label>
              <input
                type="number"
                id="floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value === '' ? '' : Number(e.target.value))}
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'available' | 'unavailable')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Submitting...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;

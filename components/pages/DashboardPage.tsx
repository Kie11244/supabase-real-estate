import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import Spinner from '../ui/Spinner';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: Select all required fields for the nested 'projects' object
      // to match the 'Project' type definition. Supabase returns nested objects
      // as an array for list queries, and the `Property` type expects a single object.
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select(`
          id,
          created_at,
          project_slug,
          title_th,
          price,
          type,
          status,
          projects (
            id,
            created_at,
            slug,
            name_th,
            name_en
          )
        `)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      
      // FIX: The Supabase query for a list returns related tables as an array, but the 
      // `Property` type expects `projects` to be a single object. We transform the data
      // to take the first item from the `projects` array to match the expected type.
      const transformedData = data?.map(p => ({
        ...p,
        projects: Array.isArray(p.projects) ? p.projects[0] : p.projects,
      }));

      setProperties((transformedData || []) as Property[]);
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred while fetching properties.';
      if (typeof err === 'string') {
          errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String(err.message);
      }
      setError(errorMessage);
      console.error('Error fetching properties for dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        alert('Error deleting property: ' + error.message);
      } else {
        alert('Property deleted successfully.');
        fetchProperties();
      }
    }
  };

  const formatter = new Intl.NumberFormat('th-TH');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Properties</h1>
        <Link 
          to="/add-property"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          + Add New Property
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((prop) => (
                <tr key={prop.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prop.title_th}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prop.projects?.name_th}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{prop.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatter.format(prop.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prop.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* Placeholder for Edit functionality */}
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(prop.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
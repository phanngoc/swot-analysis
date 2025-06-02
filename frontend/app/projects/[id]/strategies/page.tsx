'''
'use client';

import StrategiesComponent from '@/app/components/Strategies';
import { useSWOTStore } from '@/app/store/swot-store';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs'; // Make sure this component exists and path is correct

export default function ProjectStrategiesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    loadProject,
    project,
    isLoading,
    error
  } = useSWOTStore(state => ({
    loadProject: state.loadProject,
    project: state.project,
    isLoading: state.loading,
    error: state.error,
  }));

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading project strategies...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error loading project: {error}.
        <button 
          onClick={() => router.push('/projects')} 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to projects list
        </button>
      </div>
    );
  }

  if (!project && !isLoading) { // Project not found after loading attempt
    return (
      <div className="container mx-auto p-4 text-center">
        Project not found.
        <button 
          onClick={() => router.push('/projects')} 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to projects list
        </button>
      </div>
    );
  }
  
  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    { label: project?.title || 'Project', href: `/projects/${projectId}/analysis` },
    { label: 'Strategies', href: `/projects/${projectId}/strategies` },
  ];

  return (
    <div className="container mx-auto p-4">
      {project && <Breadcrumbs items={breadcrumbItems} />}
      {/* StrategiesComponent should use the data loaded into the store */}
      <StrategiesComponent /> 
    </div>
  );
}
'''

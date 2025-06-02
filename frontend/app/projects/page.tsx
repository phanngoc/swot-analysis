'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Calendar, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Layout from '../components/Layout';

// Define the project type for this page
type Project = {
  id: string;
  title: string;
  description: string;
  industry: string;
  stage: string;
  decisionType: string;
  created_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data: Project[] = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
        console.error('Error loading projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateToProject = (id: string) => {
    router.push(`/analysis?id=${id}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này không? Hành động này không thể hoàn tác.')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          if (response.status === 204) { // Handle 204 No Content as success
            setProjects(projects.filter(p => p.id !== projectId));
            // Optionally show a success toast/message here
            return;
          }
          throw new Error('Failed to delete project');
        }
        setProjects(projects.filter(p => p.id !== projectId));
        // Optionally show a success toast/message here
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Không thể xóa dự án. Vui lòng thử lại.');
        // Optionally show an error toast/message here
      }
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-6">
        <Breadcrumbs items={[{ label: 'Projects' }]} />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft size={16} /> Trang chủ
              </Button>
            </Link>
            <h1 className="text-3xl font-bold ml-4">Dự án của bạn</h1>
          </div>
          <Link href="/analysis">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Tạo dự án mới
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
            <p>Đang tải dự án...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Không có dự án nào</h3>
            <p className="mt-2 text-gray-500">Hãy bắt đầu với việc tạo một dự án phân tích SWOT mới.</p>
            <Link href="/analysis">
              <Button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white">
                Tạo dự án
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(project.created_at)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-gray-700">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {project.industry}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {project.stage}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    onClick={() => navigateToProject(project.id)}
                    className="flex-grow gap-1 bg-blue-500 hover:bg-blue-600 text-white mr-2"
                  >
                    Xem phân tích <ArrowRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-500 hover:bg-red-100 hover:text-red-700"
                    aria-label="Xóa dự án"
                  >
                    <Trash2 size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

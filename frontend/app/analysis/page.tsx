'use client';

import { useState, useEffect } from 'react';
import InputForm from '@/components/InputForm';
import SWOTMatrix from '@/components/SWOTMatrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWOTWithToast } from '@/app/components/hooks/use-swot-with-toast';
import Layout from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function AnalysisPage() {
  const { analysis, project, loadProject, resetState, generateAnalysis, loading } = useSWOTWithToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("input");
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have a project ID in the URL
  const projectId = searchParams.get('id');

  // Load project data if we have an ID
  useEffect(() => {
    const loadProjectData = async () => {
      if (projectId) {
        setIsLoading(true);
        try {
          await loadProject(projectId);
          setActiveTab('matrix'); // Show the matrix tab when loading a project
        } catch (error) {
          console.error("Error loading project:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset the store if no project ID (new analysis)
        // resetState();
      }
    };

    loadProjectData();
  }, [projectId, loadProject, resetState]);

  // Check if we have any analysis data
  const hasAnalysisData = Object.values(analysis).some(arr => arr.length > 0);

  // If we have analysis data and the input form is submitted, switch to the matrix tab
  useEffect(() => {
    if (hasAnalysisData && activeTab === 'input') {
      setActiveTab('matrix');
    }
  }, [hasAnalysisData, activeTab]);

  const handleSubmitForm = async () => {
    try {
      // Call the API to generate SWOT analysis
      await generateAnalysis();
      setActiveTab('matrix');
    } catch (error) {
      console.error("Error generating SWOT analysis:", error);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-6 bg-slate-50 rounded-lg shadow-md">
        <Breadcrumbs
          items={[
            { label: 'Analysis', href: '/analysis' },
            { label: project.title || 'New Project' }
          ]}
        />
        
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-blue-600 hover:bg-blue-50">
              <ArrowLeft size={16} /> Trang chủ
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold ml-4 text-slate-700">
            {project.title ? `Phân tích SWOT: ${project.title}` : 'Phân tích SWOT'}
          </h1>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow-sm"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="input" className="bg-blue-500 text-white hover:bg-blue-600">Nhập thông tin</TabsTrigger>
            <TabsTrigger value="matrix" disabled={!hasAnalysisData} className="bg-purple-500 text-white hover:bg-purple-600">Ma trận SWOT</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p>Đang tải dữ liệu dự án...</p>
            </div>
          ) : (
            <>
              <TabsContent value="input">
                <InputForm onSubmit={handleSubmitForm} />
              </TabsContent>

              <TabsContent value="matrix">
                <div className="space-y-8">
                  <SWOTMatrix />

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('input')}
                      className="gap-2 text-blue-600 hover:bg-blue-50"
                    >
                      <ArrowLeft size={16} /> Quay lại thông tin
                    </Button>

                    <Button 
                      onClick={() => router.push('/strategies')}
                      className="gap-2 bg-blue-500 text-white hover:bg-blue-600"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Đang xử lý...' : 'Tiếp tục với chiến lược'} <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}

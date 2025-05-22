'use client';

import { useState, useEffect } from 'react';
import InputForm from '@/components/InputForm';
import SWOTMatrix from '@/components/SWOTMatrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWOTStore from '@/store/swot-store';
import Layout from '@/components/Layout';

export default function AnalysisPage() {
  const { analysis, project } = useSWOTStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("input");
  
  // Check if we have any analysis data
  const hasAnalysisData = Object.values(analysis).some(arr => arr.length > 0);

  // If we have analysis data and the input form is submitted, switch to the matrix tab
  useEffect(() => {
    if (hasAnalysisData && activeTab === 'input') {
      setActiveTab('matrix');
    }
  }, [hasAnalysisData, activeTab]);

  const handleSubmitForm = () => {
    setActiveTab('matrix');
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-6">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} /> Trang chủ
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">
            {project.title ? `Phân tích SWOT: ${project.title}` : 'Phân tích SWOT'}
          </h1>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="input">Nhập thông tin</TabsTrigger>
            <TabsTrigger value="matrix" disabled={!hasAnalysisData}>Ma trận SWOT</TabsTrigger>
          </TabsList>
          
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
                  className="gap-2"
                >
                  <ArrowLeft size={16} /> Quay lại thông tin
                </Button>
                
                <Button 
                  onClick={() => router.push('/strategies')}
                  className="gap-2"
                  size="lg"
                >
                  Tiếp tục với chiến lược <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

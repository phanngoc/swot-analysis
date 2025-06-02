'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWOTStore from '@/app/store/swot-store';
import Layout from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InsightSection, InsightCard, InsightCardGroup } from '@/components/InsightCard';
import Strategies from '@/components/Strategies';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Use store selectors to avoid recreating objects on every render
  const project = useSWOTStore(state => state.project);
  const analysis = useSWOTStore(state => state.analysis);
  const loadProject = useSWOTStore(state => state.loadProject);
  const loading = useSWOTStore(state => state.loading);
  const error = useSWOTStore(state => state.error);

  useEffect(() => {
    if (id) {
      loadProject(id as string);
    }
  }, [id, loadProject]);

  if (loading) {
    return (
      <Layout>
        <div className="py-16 text-center text-lg">Đang tải dữ liệu dự án...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-16 text-center text-red-500">
          {error}
          <div className="mt-4">
            <button 
              onClick={() => router.push('/projects')} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Quay về danh sách dự án
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-6 bg-slate-50 rounded-lg shadow-md">
        <Breadcrumbs
          items={[
            { label: 'Dự án', href: '/projects' },
            { label: project.title || 'Chi tiết dự án' }
          ]}
        />
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold">Ngành:</div>
                <div>{project.industry}</div>
              </div>
              <div>
                <div className="font-semibold">Giai đoạn:</div>
                <div>{project.stage}</div>
              </div>
              <div>
                <div className="font-semibold">Loại quyết định:</div>
                <div>{project.decisionType}</div>
              </div>
              <div>
                <div className="font-semibold">Mục tiêu:</div>
                <ul className="list-disc pl-5">
                  {project.goals && project.goals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <InsightSection title="Phân tích SWOT" description="Tổng quan các yếu tố SWOT của dự án">
          <InsightCardGroup>
            {analysis.strengths.map((item) => (
              <InsightCard
                key={item.id}
                title="Điểm mạnh"
                content={item.content}
                category="strength"
                tags={[`Tác động: ${item.impact}/5`, `Ưu tiên: ${item.priority}`]}
              />
            ))}
            {analysis.weaknesses.map((item) => (
              <InsightCard
                key={item.id}
                title="Điểm yếu"
                content={item.content}
                category="weakness"
                tags={[`Tác động: ${item.impact}/5`, `Ưu tiên: ${item.priority}`]}
              />
            ))}
            {analysis.opportunities.map((item) => (
              <InsightCard
                key={item.id}
                title="Cơ hội"
                content={item.content}
                category="opportunity"
                tags={[`Tác động: ${item.impact}/5`, `Ưu tiên: ${item.priority}`]}
              />
            ))}
            {analysis.threats.map((item) => (
              <InsightCard
                key={item.id}
                title="Thách thức"
                content={item.content}
                category="threat"
                tags={[`Tác động: ${item.impact}/5`, `Ưu tiên: ${item.priority}`]}
              />
            ))}
          </InsightCardGroup>
        </InsightSection>

        <Separator />

        <InsightSection title="Chiến lược đề xuất" description="Các chiến lược được AI đề xuất dựa trên phân tích SWOT">
          <Strategies />
        </InsightSection>
      </div>
    </Layout>
  );
}
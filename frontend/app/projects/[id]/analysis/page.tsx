'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSWOTWithToast } from '@/app/components/hooks/use-swot-with-toast';
import Layout from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InsightSection, InsightCard, InsightCardGroup } from '@/components/InsightCard';
import Strategies from '@/components/Strategies';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { project, analysis, strategies, loadProject, loading } = useSWOTWithToast();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      loadProject(id as string).finally(() => setIsLoading(false));
    }
  }, [id, loadProject]);

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="py-16 text-center text-lg">Đang tải dữ liệu dự án...</div>
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
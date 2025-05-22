'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, Share2 } from 'lucide-react';
import useSWOTStore from '../store/swot-store';

const StrategyCard = ({
  title,
  description,
  strategies,
  icon,
  className,
}: {
  title: string;
  description: string;
  strategies: string[];
  icon: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <ul className="space-y-2 list-disc pl-5">
          {strategies.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function Strategies() {
  const { strategies, analysis, project } = useSWOTStore();

  // Check if we have strategies and analysis data
  const hasStrategies = Object.values(strategies).some(arr => arr.length > 0);
  const hasAnalysisData = Object.values(analysis).some(arr => arr.length > 0);

  // Icons for each strategy quadrant
  const soIcon = <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">S</div>;
  const woIcon = <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">W</div>;
  const stIcon = <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">S</div>;
  const wtIcon = <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">W</div>;
  
  if (!hasAnalysisData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chiến lược SWOT</CardTitle>
          <CardDescription>
            Bạn cần thực hiện phân tích SWOT trước khi tạo chiến lược
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p>Vui lòng quay lại bước phân tích SWOT để nhập dữ liệu trước</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasStrategies) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chiến lược SWOT</CardTitle>
          <CardDescription>
            Dựa trên phân tích SWOT, hệ thống sẽ đề xuất các chiến lược
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p>Đang tạo chiến lược...</p>
          <p className="text-sm text-muted-foreground mt-2">
            (Trong ứng dụng thực tế, các chiến lược sẽ được tạo bởi AI dựa trên phân tích SWOT)
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{project.title || 'Chiến lược SWOT'}</CardTitle>
          <CardDescription>
            Chiến lược dựa trên phân tích SWOT
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="so">SO</TabsTrigger>
              <TabsTrigger value="wo">WO</TabsTrigger>
              <TabsTrigger value="st">ST</TabsTrigger>
              <TabsTrigger value="wt">WT</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StrategyCard
                  title="Chiến lược SO (Strength-Opportunity)"
                  description="Tận dụng điểm mạnh để nắm bắt cơ hội"
                  strategies={strategies.so}
                  icon={soIcon}
                />
                
                <StrategyCard
                  title="Chiến lược WO (Weakness-Opportunity)"
                  description="Cải thiện điểm yếu để nắm bắt cơ hội"
                  strategies={strategies.wo}
                  icon={woIcon}
                />
                
                <StrategyCard
                  title="Chiến lược ST (Strength-Threat)"
                  description="Sử dụng điểm mạnh để đối phó với thách thức"
                  strategies={strategies.st}
                  icon={stIcon}
                />
                
                <StrategyCard
                  title="Chiến lược WT (Weakness-Threat)"
                  description="Giảm thiểu điểm yếu để tránh các thách thức"
                  strategies={strategies.wt}
                  icon={wtIcon}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="so" className="pt-4">
              <StrategyCard
                title="Chiến lược SO (Strength-Opportunity)"
                description="Tận dụng điểm mạnh để nắm bắt cơ hội"
                strategies={strategies.so}
                icon={soIcon}
              />
            </TabsContent>
            
            <TabsContent value="wo" className="pt-4">
              <StrategyCard
                title="Chiến lược WO (Weakness-Opportunity)"
                description="Cải thiện điểm yếu để nắm bắt cơ hội"
                strategies={strategies.wo}
                icon={woIcon}
              />
            </TabsContent>
            
            <TabsContent value="st" className="pt-4">
              <StrategyCard
                title="Chiến lược ST (Strength-Threat)"
                description="Sử dụng điểm mạnh để đối phó với thách thức"
                strategies={strategies.st}
                icon={stIcon}
              />
            </TabsContent>
            
            <TabsContent value="wt" className="pt-4">
              <StrategyCard
                title="Chiến lược WT (Weakness-Threat)"
                description="Giảm thiểu điểm yếu để tránh các thách thức"
                strategies={strategies.wt}
                icon={wtIcon}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex justify-end space-x-4 p-4">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Tải xuống PDF
          </Button>
          <Button variant="secondary" className="gap-2">
            <Share2 size={16} />
            Chia sẻ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

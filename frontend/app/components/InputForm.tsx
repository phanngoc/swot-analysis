'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X } from 'lucide-react';
import { useSWOTWithToast } from './hooks/use-swot-with-toast';

export default function InputForm({ onSubmit }: { onSubmit: () => void }) {
  const [goal, setGoal] = useState('');
  const { project, setProject } = useSWOTWithToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProject({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProject({ [name]: value });
  };

  const addGoal = () => {
    if (goal.trim()) {
      setProject({
        goals: [...project.goals, goal.trim()],
      });
      setGoal('');
    }
  };

  const removeGoal = (index: number) => {
    const updatedGoals = [...project.goals];
    updatedGoals.splice(index, 1);
    setProject({ goals: updatedGoals });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin dự án</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tên dự án</Label>
            <Input
              id="title"
              name="title"
              value={project.title}
              onChange={handleChange}
              placeholder="Nhập tên dự án"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về dự án của bạn"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Mục tiêu</Label>
            <div className="flex space-x-2">
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Thêm mục tiêu"
              />
              <Button type="button" onClick={addGoal} variant="outline">
                <Plus className="h-4 w-4" />
                Thêm
              </Button>
            </div>

            <div className="mt-2">
              {project.goals.map((g, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md mt-1"
                >
                  <span>{g}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Ngành nghề</Label>
              <Select
                value={project.industry}
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Công nghệ</SelectItem>
                  <SelectItem value="finance">Tài chính</SelectItem>
                  <SelectItem value="healthcare">Y tế</SelectItem>
                  <SelectItem value="education">Giáo dục</SelectItem>
                  <SelectItem value="retail">Bán lẻ</SelectItem>
                  <SelectItem value="manufacturing">Sản xuất</SelectItem>
                  <SelectItem value="services">Dịch vụ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Giai đoạn</Label>
              <Select
                value={project.stage}
                onValueChange={(value) => handleSelectChange('stage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giai đoạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Ý tưởng</SelectItem>
                  <SelectItem value="startup">Khởi nghiệp</SelectItem>
                  <SelectItem value="growth">Tăng trưởng</SelectItem>
                  <SelectItem value="mature">Trưởng thành</SelectItem>
                  <SelectItem value="renewal">Đổi mới</SelectItem>
                  <SelectItem value="decline">Suy thoái</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decisionType">Loại quyết định</Label>
              <Select
                value={project.decisionType}
                onValueChange={(value) => handleSelectChange('decisionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại quyết định" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategic">Chiến lược</SelectItem>
                  <SelectItem value="tactical">Chiến thuật</SelectItem>
                  <SelectItem value="operational">Vận hành</SelectItem>
                  <SelectItem value="investment">Đầu tư</SelectItem>
                  <SelectItem value="organizational">Tổ chức</SelectItem>
                  <SelectItem value="product">Sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="submit" 
            disabled={!project.title || !project.description}
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded"
          >
            Phân tích SWOT
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

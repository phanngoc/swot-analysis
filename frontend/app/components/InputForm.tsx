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
  const { project, setProject, loading } = useSWOTWithToast();

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
            <Label className="text-lg font-semibold text-gray-700">Mục tiêu</Label>
            <div className="flex space-x-2 items-center">
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Thêm mục tiêu"
                className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
              />
              <Button type="button" onClick={addGoal} variant="outline" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Thêm</span>
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              {project.goals.map((g, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-200 p-2 rounded-md shadow-sm hover:bg-green-400 transition"
                >
                  <span className="text-gray-800 font-medium">{g}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(index)}
                    className="text-red-500 hover:text-red-700"
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
                  <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                  <SelectItem value="Tài chính">Tài chính</SelectItem>
                  <SelectItem value="Y tế">Y tế</SelectItem>
                  <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                  <SelectItem value="Bán lẻ">Bán lẻ</SelectItem>
                  <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                  <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
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
                  <SelectItem value="Ý tưởng">Ý tưởng</SelectItem>
                  <SelectItem value="Khởi nghiệp">Khởi nghiệp</SelectItem>
                  <SelectItem value="Tăng trưởng">Tăng trưởng</SelectItem>
                  <SelectItem value="Trưởng thành">Trưởng thành</SelectItem>
                  <SelectItem value="Đổi mới">Đổi mới</SelectItem>
                  <SelectItem value="Suy thoái">Suy thoái</SelectItem>
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
                  <SelectItem value="Chiến lược">Chiến lược</SelectItem>
                  <SelectItem value="Chiến thuật">Chiến thuật</SelectItem>
                  <SelectItem value="Vận hành">Vận hành</SelectItem>
                  <SelectItem value="Đầu tư">Đầu tư</SelectItem>
                  <SelectItem value="Tổ chức">Tổ chức</SelectItem>
                  <SelectItem value="Sản phẩm">Sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button 
            type="submit" 
            disabled={!project.title || !project.description || loading}
            variant="default"
            className="pt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded disabled:opacity-50"
            >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang phân tích...
              </>
            ) : (
              'Phân tích SWOT'
            )}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

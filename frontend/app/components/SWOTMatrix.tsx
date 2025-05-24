'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Edit, Trash2, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { SWOTItem } from '../store/swot-store';
import { useSWOTWithToast } from './hooks/use-swot-with-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Add types for DnD
type DroppableProvided = {
  innerRef: (element: HTMLElement | null) => void;
  droppableProps: Record<string, any>;
  placeholder?: React.ReactNode;
};

type DraggableProvided = {
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: Record<string, any>;
  dragHandleProps?: Record<string, any> | null;
};

type DropResult = {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
};

export default function SWOTMatrix() {
  const { analysis, addItem, removeItem, updateItem, moveItem, generateStrategies } = useSWOTWithToast();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Omit<SWOTItem, 'id'>>({
    content: '',
    impact: 3,
    priority: 'medium',
    category: 'strength',
  });
  const [editingItem, setEditingItem] = useState<SWOTItem | null>(null);

  const handleAddItem = () => {
    if (newItem.content.trim()) {
      addItem(newItem);
      setNewItem({
        content: '',
        impact: 3,
        priority: 'medium',
        category: 'strength',
      });
      setIsAddingItem(false);
    }
  };

  const handleUpdateItem = () => {
    if (editingItem && editingItem.content.trim()) {
      updateItem(editingItem);
      setEditingItem(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in a different category
    if (source.droppableId !== destination.droppableId) {
      moveItem(
        draggableId,
        source.droppableId as 'strengths' | 'weaknesses' | 'opportunities' | 'threats',
        destination.droppableId as 'strengths' | 'weaknesses' | 'opportunities' | 'threats'
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'weakness':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'opportunity':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'threat':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return '';
    }
  };

  const renderEditForm = (item: SWOTItem) => (
    <div className="p-4 space-y-4 bg-muted/20 rounded-md">
      <Input
        value={item.content}
        onChange={(e) => setEditingItem({ ...item, content: e.target.value })}
        placeholder="Nội dung"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={item.priority}
          onValueChange={(value) =>
            setEditingItem({ ...item, priority: value as 'high' | 'medium' | 'low' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={item.impact.toString()}
          onValueChange={(value) =>
            setEditingItem({ ...item, impact: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tác động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 (Rất thấp)</SelectItem>
            <SelectItem value="2">2 (Thấp)</SelectItem>
            <SelectItem value="3">3 (Trung bình)</SelectItem>
            <SelectItem value="4">4 (Cao)</SelectItem>
            <SelectItem value="5">5 (Rất cao)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={item.category}
          onValueChange={(value) =>
            setEditingItem({
              ...item,
              category: value as 'strength' | 'weakness' | 'opportunity' | 'threat',
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Điểm mạnh</SelectItem>
            <SelectItem value="weakness">Điểm yếu</SelectItem>
            <SelectItem value="opportunity">Cơ hội</SelectItem>
            <SelectItem value="threat">Thách thức</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setEditingItem(null)}>
          Hủy
        </Button>
        <Button onClick={handleUpdateItem}>Cập nhật</Button>
      </div>
    </div>
  );

  const renderAddForm = () => (
    <div className="p-4 space-y-4 bg-muted/20 rounded-md mt-4">
      <Input
        value={newItem.content}
        onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
        placeholder="Nội dung mục mới"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={newItem.priority}
          onValueChange={(value) =>
            setNewItem({ ...newItem, priority: value as 'high' | 'medium' | 'low' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={newItem.impact.toString()}
          onValueChange={(value) =>
            setNewItem({ ...newItem, impact: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tác động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 (Rất thấp)</SelectItem>
            <SelectItem value="2">2 (Thấp)</SelectItem>
            <SelectItem value="3">3 (Trung bình)</SelectItem>
            <SelectItem value="4">4 (Cao)</SelectItem>
            <SelectItem value="5">5 (Rất cao)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={newItem.category}
          onValueChange={(value) =>
            setNewItem({
              ...newItem,
              category: value as 'strength' | 'weakness' | 'opportunity' | 'threat',
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Điểm mạnh</SelectItem>
            <SelectItem value="weakness">Điểm yếu</SelectItem>
            <SelectItem value="opportunity">Cơ hội</SelectItem>
            <SelectItem value="threat">Thách thức</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsAddingItem(false)}>
          Hủy
        </Button>
        <Button onClick={handleAddItem}>Thêm</Button>
      </div>
    </div>
  );

  const renderSWOTItem = (item: SWOTItem) => {
    if (editingItem && editingItem.id === item.id) {
      return renderEditForm(editingItem);
    }

    return (
      <div className="p-3 bg-background rounded-md shadow-sm border mb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <p>{item.content}</p>
            <div className="flex gap-2 flex-wrap">
              <Badge className={getPriorityColor(item.priority)}>
                {item.priority === 'high'
                  ? 'Ưu tiên cao'
                  : item.priority === 'medium'
                  ? 'Ưu tiên trung bình'
                  : 'Ưu tiên thấp'}
              </Badge>
              <Badge variant="outline">Tác động: {item.impact}/5</Badge>
              <Badge className={getCategoryColor(item.category)}>
                {item.category === 'strength'
                  ? 'Điểm mạnh'
                  : item.category === 'weakness'
                  ? 'Điểm yếu'
                  : item.category === 'opportunity'
                  ? 'Cơ hội'
                  : 'Thách thức'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingItem(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(item.id)}
              className="h-8 w-8 p-0 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold">Ma trận SWOT</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddingItem(true)}>
            <Plus className="mr-1 h-4 w-4" /> Thêm mục
          </Button>
          <Button onClick={() => generateStrategies()}>Tạo chiến lược</Button>
        </div>
      </div>

      {isAddingItem && renderAddForm()}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle className="text-green-700 dark:text-green-400 flex justify-between items-center">
                <span>Điểm mạnh (S)</span>
                <Badge variant="outline">{analysis.strengths.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Droppable droppableId="strengths" type="SWOT-ITEM">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {analysis.strengths.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Chưa có điểm mạnh nào được thêm
                      </p>
                    ) : (
                      analysis.strengths.map((item, index) => (
                        <Draggable key={`strength-${index}`} draggableId={`strength-${index}`} index={index}>
                          {(provided: DraggableProvided) => (
                            <div
                              key={`strength-${index}`} // Added key here as well
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {renderSWOTItem(item)}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <CardTitle className="text-red-700 dark:text-red-400 flex justify-between items-center">
                <span>Điểm yếu (W)</span>
                <Badge variant="outline">{analysis.weaknesses.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Droppable droppableId="weaknesses" type="SWOT-ITEM">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {analysis.weaknesses.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Chưa có điểm yếu nào được thêm
                      </p>
                    ) : (
                      analysis.weaknesses.map((item, index) => (
                        <Draggable key={`weakness-${index}`} draggableId={`weakness-${index}`} index={index}>
                          {(provided: DraggableProvided) => (
                            <div
                              key={`weakness-${index}`} // Added key here as well
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {renderSWOTItem(item)}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle className="text-blue-700 dark:text-blue-400 flex justify-between items-center">
                <span>Cơ hội (O)</span>
                <Badge variant="outline">{analysis.opportunities.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Droppable droppableId="opportunities" type="SWOT-ITEM">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {analysis.opportunities.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Chưa có cơ hội nào được thêm
                      </p>
                    ) : (
                      analysis.opportunities.map((item, index) => (
                        <Draggable key={`opportunity-${index}`} draggableId={`opportunity-${index}`} index={index}>
                          {(provided: DraggableProvided) => (
                            <div
                              key={`opportunity-${index}`} // Added key here as well
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {renderSWOTItem(item)}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
              <CardTitle className="text-orange-700 dark:text-orange-400 flex justify-between items-center">
                <span>Thách thức (T)</span>
                <Badge variant="outline">{analysis.threats.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Droppable droppableId="threats" type="SWOT-ITEM">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {analysis.threats.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Chưa có thách thức nào được thêm
                      </p>
                    ) : (
                      analysis.threats.map((item, index) => (
                        <Draggable key={`threat-${index}`} draggableId={`threat-${index}`} index={index}>
                          {(provided: DraggableProvided) => (
                            <div
                              key={`threat-${index}`} // Added key here as well
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {renderSWOTItem(item)}
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>
    </div>
  );
}

import { useToast } from '../ui/use-toast';
import useSWOTStore from '@/app/store/swot-store';
import { useCallback } from 'react';

export const useSWOTWithToast = () => {
  const store = useSWOTStore();
  const { toast } = useToast();

  const saveProject = useCallback(async () => {
    try {
      const result = await store.saveProject();

      if (result) {
        toast({
          title: "Thành công",
          description: "Đã lưu dự án thành công!",
          variant: "success",
        });
      } else if (store.error) {
        toast({
          title: "Có lỗi xảy ra",
          description: store.error,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      console.error('Error in saveProject:', error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể lưu dự án. Vui lòng thử lại.",
        variant: "destructive",
      });
      return null;
    }
  }, [store, toast]);

  const loadProject = useCallback(async (id: string) => {
    try {
      await store.loadProject(id);
      if (store.error) {
        toast({
          title: "Có lỗi xảy ra",
          description: store.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in loadProject:', error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tải dự án. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [store, toast]);

  const generateAnalysis = useCallback(async () => {
    try {
      await store.generateAnalysis();
      if (store.error) {
        toast({
          title: "Có lỗi xảy ra",
          description: store.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in generateAnalysis:', error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tạo phân tích SWOT. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [store, toast]);

  const generateStrategies = useCallback(async () => {
    try {
      await store.generateStrategies();
      if (store.error) {
        toast({
          title: "Có lỗi xảy ra",
          description: store.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in generateStrategies:', error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tạo chiến lược. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [store, toast]);

  // Return the original store methods plus our toast-enabled methods
  return {
    ...store,
    saveProject,
    loadProject,
    generateAnalysis,
    generateStrategies,
  };
};

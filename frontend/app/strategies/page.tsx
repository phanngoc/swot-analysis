'use client';

import Strategies from '@/components/Strategies';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function StrategiesPage() {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-6">
        <div className="flex items-center mb-8">
          <Link href="/analysis">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} /> Quay lại phân tích
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Chiến lược SWOT</h1>
        </div>
        
        <Strategies />
      </div>
    </Layout>
  );
}

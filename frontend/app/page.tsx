import { Button } from './components/ui/button';
import { ArrowRight, FileBarChart, LineChart, GitFork } from 'lucide-react';
import Link from 'next/link';
import Layout from './components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">
            SWOT Analysis Tool
          </h1>
          <p className="text-xl text-gray-500">
            Make better business decisions with comprehensive SWOT analysis
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/analysis">
              <Button className="flex items-center gap-2 px-6 py-5">
                <span>Start New Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 p-2 bg-blue-50 rounded-full w-fit">
              <FileBarChart className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Visual Analysis</h3>
            <p className="text-gray-500">
              Generate comprehensive SWOT analyses with AI assistance and visualize your findings.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 p-2 bg-green-50 rounded-full w-fit">
              <LineChart className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Strategic Insights</h3>
            <p className="text-gray-500">
              Convert your analysis into actionable strategies with AI-powered recommendations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 p-2 bg-purple-50 rounded-full w-fit">
              <GitFork className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Decision Support</h3>
            <p className="text-gray-500">
              Streamline decision-making with clear visualization of opportunities and challenges.
            </p>
          </div>
        </div>
        
        <div className="mt-24 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-500 mb-3">01</div>
              <h3 className="text-lg font-medium mb-2">Input Project Details</h3>
              <p className="text-gray-500">
                Enter your project information, goals, and business context.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-500 mb-3">02</div>
              <h3 className="text-lg font-medium mb-2">Review SWOT Analysis</h3>
              <p className="text-gray-500">
                Our AI generates a comprehensive SWOT analysis for your review.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-500 mb-3">03</div>
              <h3 className="text-lg font-medium mb-2">Get Strategic Recommendations</h3>
              <p className="text-gray-500">
                Receive tailored strategic recommendations based on your SWOT analysis.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Ready to improve your strategic decision-making?</h2>
          <Link href="/analysis">
            <Button className="flex items-center gap-2 px-6 py-5">
              <span>Start Your SWOT Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

import { Button } from './components/ui/button';
import { ArrowRight, FileBarChart, LineChart, GitFork } from 'lucide-react';
import Link from 'next/link';
import Layout from './components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-indigo-600">
            SWOT Analysis Tool
          </h1>
          <p className="text-xl text-gray-700">
            Make better business decisions with comprehensive SWOT analysis
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/analysis">
              <Button className="flex items-center gap-2 px-6 py-5 bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600">
                <span>Start New Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button className="flex items-center gap-2 px-6 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                <span>View My Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow duration-200">
            <div className="mb-4 p-2 bg-blue-200 rounded-full w-fit">
              <FileBarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-blue-700">Visual Analysis</h3>
            <p className="text-gray-600">
              Generate comprehensive SWOT analyses with AI assistance and visualize your findings.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border border-green-200 hover:shadow-xl transition-shadow duration-200">
            <div className="mb-4 p-2 bg-green-200 rounded-full w-fit">
              <LineChart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-green-700">Strategic Insights</h3>
            <p className="text-gray-600">
              Convert your analysis into actionable strategies with AI-powered recommendations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-shadow duration-200">
            <div className="mb-4 p-2 bg-purple-200 rounded-full w-fit">
              <GitFork className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-purple-700">Decision Support</h3>
            <p className="text-gray-600">
              Streamline decision-making with clear visualization of opportunities and challenges.
            </p>
          </div>
        </div>

        <div className="mt-24 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-yellow-500 mb-3">01</div>
              <h3 className="text-lg font-medium mb-2 text-yellow-700">Input Project Details</h3>
              <p className="text-gray-600">
                Enter your project information, goals, and business context.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-teal-500 mb-3">02</div>
              <h3 className="text-lg font-medium mb-2 text-teal-700">Review SWOT Analysis</h3>
              <p className="text-gray-600">
                Our AI generates a comprehensive SWOT analysis for your review.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-pink-500 mb-3">03</div>
              <h3 className="text-lg font-medium mb-2 text-pink-700">Get Strategic Recommendations</h3>
              <p className="text-gray-600">
                Receive tailored strategic recommendations based on your SWOT analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Ready to improve your strategic decision-making?</h2>
          <Link href="/analysis">
            <Button className="flex items-center gap-2 px-6 py-5 bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600">
              <span>Start Your SWOT Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

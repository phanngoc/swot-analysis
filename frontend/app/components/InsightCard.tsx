'use client';

import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface InsightCardProps {
  title: string;
  description?: string;
  content: string;
  category: "strength" | "weakness" | "opportunity" | "threat";
  tags?: string[];
  date?: string;
}

const categoryVariantMap = {
  strength: "insight",
  weakness: "default",
  opportunity: "wisdom",
  threat: "analysis",
} as const;

const categoryColorMap = {
  strength: "bg-green-100 text-green-800 border-green-200",
  weakness: "bg-orange-100 text-orange-800 border-orange-200",
  opportunity: "bg-blue-100 text-blue-800 border-blue-200",
  threat: "bg-red-100 text-red-800 border-red-200",
};

export function InsightCard({ 
  title, 
  description, 
  content, 
  category,
  tags = [],
  date 
}: InsightCardProps) {
  const variant = categoryVariantMap[category];
  
  return (
    <Card variant={variant} className="transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={categoryColorMap[category]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          {date && <span className="text-xs text-muted-foreground">{date}</span>}
        </div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{content}</p>
      </CardContent>
      {tags.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export function InsightCardGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

export function InsightSection({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="space-y-6 my-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <Separator />
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}

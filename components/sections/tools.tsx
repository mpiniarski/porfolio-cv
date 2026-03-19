"use client";

import Image from "next/image";

import type { CvData } from "@/lib/resumeData";
import { Card, CardContent } from "@/components/ui/card";

export function ToolsSection({ cv }: { cv: CvData["cv"] }) {
  const items = cv.tools ?? [];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Tools I Use</h2>
          <p className="text-muted-foreground text-lg">
            Modern development tools that enhance productivity and code quality
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {items.map((tool) => (
            <Card
              key={tool.name}
              className="hover:shadow-lg transition-all hover:border-primary/30 border-border/50"
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-background rounded-lg">
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{tool.name}</h4>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


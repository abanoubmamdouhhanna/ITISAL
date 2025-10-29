
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';

interface SetupPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  headerTitle: string;
}

const SetupPageLayout: React.FC<SetupPageLayoutProps> = ({
  children,
  title,
  description,
  headerTitle
}) => {
  return (
    <AnimatedTransition location={`setup-${title.toLowerCase()}`}>
      <div className="flex flex-col min-h-screen">
        <Header 
          title={headerTitle} 
          showBackButton={true}
        />
        
        <main className="flex-1 container mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default SetupPageLayout;

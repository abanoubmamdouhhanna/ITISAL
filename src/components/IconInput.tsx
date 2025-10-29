
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          className={cn(icon ? "pl-10" : "", className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

IconInput.displayName = "IconInput";

export { IconInput };

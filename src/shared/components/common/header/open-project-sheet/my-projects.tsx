import dayjs from 'dayjs';
import { useState } from 'react';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

import { mockProjects } from '../../../../../__mock__/projects';
import { Image } from '../../image';

export const MyProjects = () => {
  const [query, setQuery] = useState('');

  return (
    <>
      <Input
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-2">
        {mockProjects.map((project) => (
          <Button
            key={project.id}
            unstyled
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-muted/70 border border-transparent hover:border-primary/30 cursor-pointer transition-all group w-full">
            <Image alt="" wrapperClassName="size-12" />
            <div className="min-w-0 text-start">
              <h3 className="text-sm font-medium truncate">{project.name}</h3>
              <p className="text-xs text-muted-foreground">Created on {dayjs(project.created).format('MMM D, YYYY')}</p>
            </div>
            <div
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'group-hover:bg-gradient-to-r from-primary to-secondary group-hover:text-primary-foreground ml-auto'
              )}>
              Open
            </div>
          </Button>
        ))}
      </div>
    </>
  );
};

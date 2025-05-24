import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

import { Image } from '../../../../shared/components/common/image';
import { Pagination } from '../../../../shared/components/common/pagination';
import { QueryKeys } from '../../../../shared/constants/query-keys';
import { ProjectService } from '../../services/project.service';

export const MyProjects = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const options = useMemo(
    () => ({
      limit: 4,
      sortBy: 'updatedAt' as const,
      sortOrder: 'desc' as const,
      search: query,
      page
    }),
    [query, page]
  );
  const myProjects = useQuery({
    queryKey: [QueryKeys.PROJECTS, options],
    queryFn: () => ProjectService.getMy(options)
  });

  return (
    <div className="grid gap-6">
      <Input placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        {myProjects.data?.items.map((project) => (
          <Button
            key={project.id}
            unstyled
            className="group cursor-pointer aspect-square rounded-lg border border-transparent p-2 hover:border-primary hover:shadow-md transition-all hover:bg-muted">
            <div className="aspect-video rounded-lg overflow-hidden border">
              <Image alt="" wrapperClassName="size-full aspect-video" src={project.previewUrl} />
            </div>
            <div className="mt-1 grid gap-1 text-start">
              <h3 className="text-sm font-medium">{project.name}</h3>
              <p className="text-xs text-muted-foreground">{`Created ${dayjs(project.createdAt).fromNow()}`}</p>
              <div
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'xs' }),
                  'w-full group-hover:bg-gradient-to-r from-primary to-secondary group-hover:text-primary-foreground'
                )}>
                Open
              </div>
            </div>
          </Button>
        ))}
      </div>
      <Pagination
        currentPage={myProjects.data?.meta.currentPage || 1}
        totalPages={myProjects.data?.meta.totalPages || 1}
        onPageChange={(newPage) => {
          console.log('Changing page to:', newPage);
          setPage(newPage);
        }}
      />
    </div>
  );
};

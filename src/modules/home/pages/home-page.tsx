import { SidebarInset } from '../../../shared/components/ui/sidebar';
import { LeftSidebar } from '../components/left-sidebar';
import { RightSidebar } from '../components/right-sidebar';

export const HomePage = () => {
  return (
    <div className="flex">
      <LeftSidebar />
      <SidebarInset className="flex flex-1 flex-col gap-4 p-4 max-h-screen-no-header bg-canvas-background ">
        <div className="flex flex-col items-center justify-center h-screen-no-header">
          <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
          <p className="mt-4 text-lg">This is the home page of our application.</p>
        </div>
      </SidebarInset>
      <RightSidebar />
    </div>
  );
};

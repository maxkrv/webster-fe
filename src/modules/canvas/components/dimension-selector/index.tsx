'use client';

import { Lock } from 'lucide-react';
import type React from 'react';
import { FC, useState } from 'react';

import { Button } from '../../../../shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../shared/components/ui/dialog';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Separator } from '../../../../shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../shared/components/ui/tabs';
import { useCanvasStore } from '../../../../shared/store/canvas-store';
import { useDimensionDialogStore } from '../../hooks/dimention-dialog-store';
import { CommonFormats } from './format-categories/common-formats';
import { PresentationFormats } from './format-categories/presentation-formats';
import { PrintFormats } from './format-categories/print-formats';
import { SocialMediaFormats } from './format-categories/social-media-formats';
import { VideoFormats } from './format-categories/video-formats';
import { getAspectRatio } from './utils';
interface DimensionSelectorProps {
  children?: React.ReactNode;
  onSelect?: (width: number, height: number) => void;
}

const TABS = ['custom', 'social', 'presentation', 'print', 'video'] as const;

export const DimensionSelector: FC<DimensionSelectorProps> = ({ children, onSelect }) => {
  const { width, height, setDimensions } = useCanvasStore();
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [customRatio, setCustomRatio] = useState(false);
  const { isOpen, setIsOpen } = useDimensionDialogStore();

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number.parseInt(e.target.value);
    setCurrentWidth(newWidth);
    setSelectedFormat(null);
    setCustomRatio(true);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number.parseInt(e.target.value);
    setCurrentHeight(newHeight);
    setSelectedFormat(null);
    setCustomRatio(true);
  };

  const selectFormat = (formatName: string, formatWidth: number, formatHeight: number) => {
    setCurrentWidth(formatWidth);
    setCurrentHeight(formatHeight);
    setSelectedFormat(formatName);
    setCustomRatio(false);
  };

  const handleSubmit = () => {
    setDimensions(currentWidth, currentHeight);
    setIsOpen(false);
    onSelect?.(currentWidth, currentHeight);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] h-full max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose Canvas Dimensions</DialogTitle>
          <DialogDescription>
            Select from predefined formats or enter custom dimensions for your project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="custom" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 mb-1 rounded-full bg-muted sticky top-0 z-10 w-full">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="overflow-y-auto flex-1 pr-1 scroll-container thin-scrollbar hover-show-scrollbar">
            <TabsContent value="custom" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-3">
                <CommonFormats selectedFormat={selectedFormat} onSelectFormat={selectFormat} />
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-3">
                <SocialMediaFormats selectedFormat={selectedFormat} onSelectFormat={selectFormat} />
              </div>
            </TabsContent>

            <TabsContent value="presentation" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-3">
                <PresentationFormats selectedFormat={selectedFormat} onSelectFormat={selectFormat} />
              </div>
            </TabsContent>

            <TabsContent value="print" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-3">
                <PrintFormats selectedFormat={selectedFormat} onSelectFormat={selectFormat} />
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-3">
                <VideoFormats selectedFormat={selectedFormat} onSelectFormat={selectFormat} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
        <Separator orientation="horizontal" />
        <div>
          <div className="flex items-center gap-4">
            <div className="grow">
              <Label htmlFor="width-input" className="text-xs text-muted-foreground mb-1">
                Width
              </Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="number"
                  id="width-input"
                  defaultValue="1920"
                  className="w-73"
                  min={0}
                  max={10000}
                  value={currentWidth}
                  iconPosition="right"
                  onChange={handleWidthChange}
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
            <div className="flex items-center justify-center text-muted-foreground mt-6">
              <Lock className="h-5 w-5" />
            </div>
            <div className="grow">
              <Label htmlFor="height-input" className="text-xs text-muted-foreground mb-1">
                Height
              </Label>
              <div className="flex items-center gap-2 relative w-full ">
                <Input
                  type="number"
                  id="height-input"
                  defaultValue="1080"
                  className="w-73"
                  min={0}
                  max={10000}
                  value={currentHeight}
                  onChange={handleHeightChange}
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Ratio:</span>
                <span>{customRatio ? 'Custom' : getAspectRatio(currentWidth, currentHeight)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Size:</span>
                <span>
                  {currentWidth} × {currentHeight} px
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-full">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-gradient-start to-gradient-end text-white shadow-md hover:shadow-lg transition-all rounded-full">
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

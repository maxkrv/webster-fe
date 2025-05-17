'use client';

import { Lock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Button } from '../../../../shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../../../shared/components/ui/dialog';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../shared/components/ui/tabs';
import { useCanvasStore } from '../../../../shared/store/canvas-store';
import { useDimensionDialogStore } from '../../hooks/dimention-dialog-store';
import { CommonFormats } from './format-categories/common-formats';
import { PresentationFormats } from './format-categories/presentation-formats';
import { PrintFormats } from './format-categories/print-formats';
import { SocialMediaFormats } from './format-categories/social-media-formats';
import { VideoFormats } from './format-categories/video-formats';
import { getAspectRatio } from './utils';

export const DimensionSelector = () => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose Canvas Dimensions</DialogTitle>
          <DialogDescription>
            Select from predefined formats or enter custom dimensions for your project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="custom" className="mt-4 flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 mb-4 rounded-full bg-muted sticky top-0 z-10">
            <TabsTrigger
              value="custom"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Common
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Social Media
            </TabsTrigger>
            <TabsTrigger
              value="presentation"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Presentation
            </TabsTrigger>
            <TabsTrigger
              value="print"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Print
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Video
            </TabsTrigger>
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

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="width">Width (px)</Label>
              <div className="flex items-center rounded-xl bg-muted/50 border border-border shadow-sm">
                <Input
                  id="width"
                  type="number"
                  value={currentWidth}
                  onChange={handleWidthChange}
                  className="border-0 bg-transparent"
                  min={1}
                />
                <span className="pr-3 text-sm text-muted-foreground">px</span>
              </div>
            </div>
            <div className="flex items-center justify-center text-muted-foreground mt-6">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="height">Height (px)</Label>
              <div className="flex items-center rounded-xl bg-muted/50 border border-border shadow-sm">
                <Input
                  id="height"
                  type="number"
                  value={currentHeight}
                  onChange={handleHeightChange}
                  className="border-0 bg-transparent"
                  min={1}
                />
                <span className="pr-3 text-sm text-muted-foreground">px</span>
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

'use client';

import type React from 'react';
import { type FC, useEffect, useRef, useState } from 'react';

import { ConstrainProporions } from '@/shared/components/common/constrain-proportions';

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
  const { maxSize, minSize, width, height, setDimensions } = useCanvasStore();
  const [currentWidthInput, setCurrentWidthInput] = useState(width.toString());
  const [currentHeightInput, setCurrentHeightInput] = useState(height.toString());
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [customRatio, setCustomRatio] = useState(false);
  const [constrainProportions, setConstrainProportions] = useState(false);
  const aspectRatioRef = useRef(width / height);
  const { isOpen, setIsOpen } = useDimensionDialogStore();

  // Update local state when canvas dimensions change
  useEffect(() => {
    setCurrentWidthInput(width.toString());
    setCurrentHeightInput(height.toString());
  }, [width, height]);

  useEffect(() => {
    if (!constrainProportions) {
      const w = parseInt(currentWidthInput, 10);
      const h = parseInt(currentHeightInput, 10);
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        aspectRatioRef.current = w / h;
      }
    }
  }, [currentWidthInput, currentHeightInput, constrainProportions]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCurrentWidthInput(value);
      setSelectedFormat(null);
      setCustomRatio(true);

      const num = Number(value);
      if (constrainProportions && !isNaN(num) && num > 0 && aspectRatioRef.current !== 0) {
        const newHeight = Math.round(num / aspectRatioRef.current);
        setCurrentHeightInput(newHeight.toString());
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCurrentHeightInput(value);
      setSelectedFormat(null);
      setCustomRatio(true);

      const num = Number(value);
      if (constrainProportions && !isNaN(num) && num > 0 && aspectRatioRef.current !== 0) {
        const newWidth = Math.round(num * aspectRatioRef.current);
        setCurrentWidthInput(newWidth.toString());
      }
    }
  };

  const selectFormat = (formatName: string, formatWidth: number, formatHeight: number) => {
    setCurrentWidthInput(formatWidth.toString());
    setCurrentHeightInput(formatHeight.toString());
    setSelectedFormat(formatName);
    setCustomRatio(false);
  };

  const handleSubmit = () => {
    let newWidth = parseInt(currentWidthInput, 10);
    let newHeight = parseInt(currentHeightInput, 10);

    if (isNaN(newWidth)) newWidth = minSize;
    if (isNaN(newHeight)) newHeight = minSize;

    newWidth = Math.max(minSize, Math.min(maxSize, newWidth));
    newHeight = Math.max(minSize, Math.min(maxSize, newHeight));

    setCurrentWidthInput(newWidth.toString());
    setCurrentHeightInput(newHeight.toString());

    setDimensions(newWidth, newHeight);
    setIsOpen(false);
    onSelect?.(newWidth, newHeight);
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
                  type="text"
                  id="width-input"
                  className="w-73"
                  min={10}
                  max={10000}
                  value={currentWidthInput}
                  iconPosition="right"
                  onChange={handleWidthChange}
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
            <ConstrainProporions checked={constrainProportions} onCheckedChange={setConstrainProportions} />
            <div className="grow">
              <Label htmlFor="height-input" className="text-xs text-muted-foreground mb-1">
                Height
              </Label>
              <div className="flex items-center gap-2 relative w-full ">
                <Input
                  type="text"
                  id="height-input"
                  className="w-73"
                  min={10}
                  max={10000}
                  value={currentHeightInput}
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
                <span>
                  {customRatio
                    ? 'Custom'
                    : getAspectRatio(parseInt(currentWidthInput, 10) || 0, parseInt(currentHeightInput, 10) || 0)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Size:</span>
                <span>
                  {currentWidthInput || 0} × {currentHeightInput || 0} px
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-full">
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Apply</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

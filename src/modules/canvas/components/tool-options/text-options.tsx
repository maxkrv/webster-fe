import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { useState } from 'react';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Separator } from '../../../../shared/components/ui/separator';

const TEXT_ALIGNMENTS = [
  { value: 'left', icon: <AlignLeft className="h-4 w-4 mx-auto" /> },
  { value: 'center', icon: <AlignCenter className="h-4 w-4 mx-auto" /> },
  { value: 'right', icon: <AlignRight className="h-4 w-4 mx-auto" /> },
  { value: 'justify', icon: <AlignJustify className="h-4 w-4 mx-auto" /> }
];

const FONT_OPTIONS = ['Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Inter'];

export function TextOptions() {
  const [textColor, setTextColor] = useState('#000000');
  const [alignment, setAlignment] = useState('left');
  const [font, setFont] = useState('Montserrat');
  const [textStyle, setTextStyle] = useState({
    bold: true,
    italic: false,
    underline: false
  });

  const toggleStyle = (style: keyof typeof textStyle) => {
    setTextStyle((prev) => ({
      ...prev,
      [style]: !prev[style]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Font</h3>
        <Select value={font} onValueChange={setFont}>
          <SelectTrigger className="w-full rounded-full">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((fontOption) => (
              <SelectItem key={fontOption} value={fontOption}>
                {fontOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Size</h3>
        <EnhancedSlider
          defaultValue={[24]}
          max={72}
          step={1}
          displayFormat={{ type: 'numeric', unit: 'px' }}
          labels={{
            min: 'Small',
            mid: 'Medium',
            max: 'Large'
          }}
        />
      </div>
      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Style</h3>
        <div className="flex gap-2">
          <Button
            variant={textStyle.bold ? 'default' : 'outline'}
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => toggleStyle('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={textStyle.italic ? 'default' : 'outline'}
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => toggleStyle('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={textStyle.underline ? 'default' : 'outline'}
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => toggleStyle('underline')}>
            <Underline className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Alignment</h3>
        <div className="flex gap-2">
          {TEXT_ALIGNMENTS.map((align) => (
            <Button
              key={align.value}
              variant={alignment === align.value ? 'default' : 'outline'}
              size="sm"
              className="flex-1 rounded-full"
              onClick={() => setAlignment(align.value)}>
              {align.icon}
            </Button>
          ))}
        </div>
      </div>
      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Color</h3>
        <ColorPicker value={textColor} onChange={setTextColor} />
      </div>
    </div>
  );
}

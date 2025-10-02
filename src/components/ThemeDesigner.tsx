import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Palette, Type, CornerUpRight, Sparkles } from "lucide-react";

interface ThemeDesignerProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    bubbleStyle: string;
  };
  onThemeChange: (theme: any) => void;
}

const ThemeDesigner = ({ theme, onThemeChange }: ThemeDesignerProps) => {
  const colorPresets = [
    { name: "Purple Gradient", primary: "#8B5CF6", secondary: "#A855F7" },
    { name: "Blue Ocean", primary: "#3B82F6", secondary: "#06B6D4" },
    { name: "Green Nature", primary: "#10B981", secondary: "#34D399" },
    { name: "Orange Sunset", primary: "#F97316", secondary: "#FB923C" },
    { name: "Pink Rose", primary: "#EC4899", secondary: "#F472B6" },
    { name: "Red Fire", primary: "#EF4444", secondary: "#F87171" },
  ];

  const fontOptions = [
    { value: "font-sans", label: "Sans Serif" },
    { value: "font-serif", label: "Serif" },
    { value: "font-mono", label: "Monospace" },
  ];

  const radiusOptions = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
  ];

  const updateTheme = (updates: Partial<typeof theme>) => {
    onThemeChange({ ...theme, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Color Presets */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-primary" />
            Color Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-12 justify-start gap-3 p-3"
                onClick={() => updateTheme({ 
                  primaryColor: preset.primary, 
                  secondaryColor: preset.secondary 
                })}
              >
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` 
                  }}
                />
                <span className="text-sm font-medium">{preset.name}</span>
              </Button>
            ))}
          </div>
          
          {/* Custom Colors */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="w-5 h-5 text-primary" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Family</Label>
            <Select
              value={theme.fontFamily}
              onValueChange={(value) => updateTheme({ fontFamily: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.value}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CornerUpRight className="w-5 h-5 text-primary" />
            Border Radius
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Corner Roundness</Label>
            <Select
              value={theme.borderRadius}
              onValueChange={(value) => updateTheme({ borderRadius: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {radiusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Generate Random Theme */}
      <Button 
        variant="outline" 
        className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 hover:opacity-90"
        onClick={() => {
          const randomPreset = colorPresets[Math.floor(Math.random() * colorPresets.length)];
          const randomFont = fontOptions[Math.floor(Math.random() * fontOptions.length)];
          const randomRadius = radiusOptions[Math.floor(Math.random() * radiusOptions.length)];
          
          updateTheme({
            primaryColor: randomPreset.primary,
            secondaryColor: randomPreset.secondary,
            fontFamily: randomFont.value,
            borderRadius: randomRadius.value,
          });
        }}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Generate Random Theme
      </Button>
    </div>
  );
};

export default ThemeDesigner;
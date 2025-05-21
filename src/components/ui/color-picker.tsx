import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { HexColorPicker } from "react-colorful";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  value?: string | null;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  value,
  className,
}) => {
  const [open, setOpen] = useState(false); // Popover open state
  const [color, setColor] = useState(value); // Current color state

  const handleColorChange = (newColor: string) => {
    setColor(newColor); // Update color state
    onColorChange(newColor); // Notify parent component of the color change
  };
  useEffect(() => {
    if (value != color) {
      setColor(value);
    }
  }, [value]);
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className={cn(
            " pl-2 aspect-square w-full flex gap-4 justify-start first-line: place-items-start font-inter",
            className
          )}
        >
          <div
            className={`w-[18px] rounded h-[18px] `}
            style={{
              background: color ? color : "#000000",
            }}
          />
          <div
            className={`font-normal text-sm uppercase ${
              !color && "text-button-filter-text"
            } `}
            style={{
              color: color ? color : "#000000",
            }}
          >
            {color ?? "#00000"}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" sideOffset={5} className="w-full mb-16 ">
        <div className="flex flex-col items-center">
          <HexColorPicker color={color ?? ""} onChange={handleColorChange} />
          <Input
            className="mt-2 font-mono uppercase"
            value={color ?? ""}
            maxLength={7}
            onChange={(e) => handleColorChange(e.currentTarget.value)}
            style={{ marginTop: "10px", width: "100%" }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;

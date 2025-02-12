import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { HexColorPicker } from "react-colorful";
import { Input } from "./input";
import { Button } from "./button";

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  value?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  value = "#000000",
}) => {
  const [open, setOpen] = useState(false); // Popover open state
  const [color, setColor] = useState(value); // Current color state

  const handleColorChange = (newColor: string) => {
    setColor(newColor); // Update color state
    onColorChange(newColor); // Notify parent component of the color change
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className=" pl-2 aspect-square flex gap-4 justify-start first-line: place-items-start"
        >
          <div
            className={`w-[18px] rounded h-[18px] `}
            style={{
              background: color,
            }}
          />
          <div className="font-normal text-sm">{color}</div>
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" sideOffset={5} className="w-full mb-16 ">
        <div className="flex flex-col items-center">
          <HexColorPicker color={color} onChange={handleColorChange} />
          <Input
            className="mt-2 font-mono"
            value={color}
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

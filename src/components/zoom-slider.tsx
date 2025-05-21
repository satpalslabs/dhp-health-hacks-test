import React, { forwardRef } from "react";
import { Minus, Plus } from "lucide-react";

import {
  Panel,
  useViewport,
  // useStore,
  useReactFlow,
  PanelProps,
} from "@xyflow/react";

// import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ZoomSlider = forwardRef<
  HTMLDivElement,
  Omit<PanelProps, "children"> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const { zoom } = useViewport();
  // const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoomTo, zoomIn, zoomOut } = useReactFlow();

  // const { minZoom, maxZoom } = useStore(
  //   (state) => ({
  //     minZoom: state.minZoom,
  //     maxZoom: state.maxZoom,
  //   }),
  //   (a, b) => a.minZoom !== b.minZoom || a.maxZoom !== b.maxZoom
  // );

  return (
    <Panel
      className={cn(
        "flex rounded-md bg-primary-foreground p-1 text-foreground font-inter",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomOut({ duration: 300 })}
      >
        <Minus className="h-4 w-4" />
      </Button>
      {/* <Slider
        className="w-[140px]"
        value={[zoom]}
        min={minZoom}
        max={maxZoom}
        step={0.01}
        onValueChange={(values) => zoomTo(values[0])}
      /> */}
      <Button
        className=" w-9 hover:bg-transparent tabular-nums"
        variant="ghost"
        onClick={() => zoomTo(1, { duration: 300 })}
      >
        {(100 * zoom).toFixed(0)}%
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomIn({ duration: 300 })}
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* <Button
        variant="ghost"
        size="icon"
        onClick={() => fitView({ duration: 300 })}
      >
        <Maximize className="h-4 w-4" />
      </Button> */}
    </Panel>
  );
});

ZoomSlider.displayName = "ZoomSlider";

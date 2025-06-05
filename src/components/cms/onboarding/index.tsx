"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Background,
  BackgroundVariant,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ZoomSlider } from "@/components/zoom-slider";
import { RotateCcw } from "lucide-react";
import SideDrawer from "./side-drawer";
import DropDownMenuAddStep from "./add-step-dropdown";
import Node from "./step-components";

const OnboardingFlow = () => {
  const initialNodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      type: "location",
      data: {
        title: "Location",
        description: "Additional Features are available based on location",
        components: [
          {
            type: "help",
            title: "Why we're asking this?",
            description: "",
          },
          {
            type: "single-choice",
            buttons: [
              {
                text: "England",
              },
              {
                text: "Scotland",
              },
              {
                text: "Wales",
              },
              {
                text: "Northern Ireland",
              },
            ],
          },
        ],
        help: {
          title: "",
          description: "",
        },
      },
    },
  ];

  const { resolvedTheme } = useTheme();
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState<any>([]);
  const [undoStack, setUndoStack] = useState<
    { nodes: typeof nodes; edges: typeof edges }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { nodes: typeof nodes; edges: typeof edges }[]
  >([]);

  const [open, setOpen] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onNodesChange = useCallback(
    (changes: any) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setUndoStack((prev) => [...prev, { nodes, edges }]); // Save history before updating state
      }, 500);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [nodes, edges, setNodes]
  );

  const onAddStep = useCallback(
    (data: any) => {
      setNodes((prevNodes: any) => {
        const lastNode = prevNodes[prevNodes.length - 1];
        const newId = (prevNodes.length + 1).toString() ?? "1";
        const newNode = {
          id: newId,
          position: {
            x: lastNode ? lastNode.position.x + 400 : 0,
            y: lastNode ? lastNode.position.y : 0,
          },
          type: "location",
          data: data,
        };
        return [...prevNodes, newNode];
      });

      setNodes((prevNodes: any[]) => {
        if (prevNodes.length < 2) return prevNodes; // Ensure at least two nodes exist

        const lastNodeId = prevNodes[prevNodes.length - 2].id;
        const newNodeId = prevNodes[prevNodes.length - 1].id;

        if (!lastNodeId || !newNodeId) return prevNodes; // Extra safety check

        const newEdge: Edge = {
          id: `e${lastNodeId}-${newNodeId}`,
          source: lastNodeId,
          type: "smoothstep",
          target: newNodeId,
        };
        setEdges((prevEdges: any) => [...prevEdges, newEdge]);

        return [...prevNodes]; // Ensure nodes remain unchanged
      });
    },
    [setEdges, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setUndoStack((prev) => [...prev, { nodes, edges }]);
      }, 500);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [nodes, edges, setEdges]
  );

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, { nodes, edges }]); // Save current state in redo stack
    setNodes(lastState.nodes);
    setEdges(lastState.edges);
    setUndoStack((prev) => prev.slice(0, -1));
  }, [undoStack, nodes, edges, setEdges, setNodes]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, { nodes, edges }]); // Save current state in undo stack
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    setRedoStack((prev) => prev.slice(0, -1));
  }, [redoStack, nodes, edges, setNodes, setEdges]);

  const nodeTypes = useMemo(
    () => ({
      location: (nodeProps: any) => (
        <Node
          {...nodeProps}
          edges={edges}
          onAddStep={onAddStep}
          setOpen={setOpen}
        />
      ),
    }),
    [edges, onAddStep]
  );

  interface ConnectionParams {
    source: string;
    sourceHandle: string | null;
    target: string;
    targetHandle: string | null;
  }

  const onConnect = useCallback(
    (params: ConnectionParams) => {
      const { sourceHandle, targetHandle } = params;

      // Enforce directional connections
      const isValidConnection =
        (sourceHandle === "bottom" && targetHandle === "top") ||
        (sourceHandle === "right" &&
          (targetHandle === "left" || targetHandle === "top"));

      if (!isValidConnection) return;

      setEdges((eds: any) => addEdge({ ...params, type: "smoothstep" }, eds));
    },
    [setEdges]
  );

  return (
    <div className="grow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onConnect={onConnect}
      >
        {nodes.length == 0 && (
          <div className="h-[calc(100%-72px)]   flex items-center justify-center ">
            <div className="flex flex-col gap-8 items-center w-fit max-w-[472px] relative z-[100]">
              <div className="flex flex-col gap-3   items-center">
                <p className="font-inter font-semibold text-[32px] leading-[38px]">
                  Onboarding Flow
                </p>
                <p className="font-inter text-text w-fit text-text-darkGray text-lg leading-[19px] text-center">
                  Design a seamless onboarding experience for your users by
                  adding steps
                </p>
              </div>
              <DropDownMenuAddStep onAddStep={onAddStep} setOpen={setOpen} />
            </div>
          </div>
        )}
        <MiniMap />
        <ZoomSlider position="bottom-left">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={undoStack.length == 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={redoStack.length == 0}
          >
            <RotateCcw
              className="h-4 w-4 "
              style={{
                transform: "scale(-1,1)", // mirror-flip
              }}
            />
          </Button>
        </ZoomSlider>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <SideDrawer
        open={open}
        setOpen={setOpen}
        // setNodes={setNodes}
      />
    </div>
  );
};

export default OnboardingFlow;

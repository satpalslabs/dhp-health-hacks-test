/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useMemo } from "react";
import { Handle, Position, useConnection } from "@xyflow/react";
import { BaseNode } from "@/components/base-node";
import { ButtonHandle } from "@/components/button-handle";
import DropDownMenuAddStep from "../add-step-dropdown";
import ButtonGroup from "./button-group";

const Component = ({ data }: { data: any }) => {
  return (
    <div
      className="px-5 h-[283px] w-[278px] py-4 pointer-events-auto rounded-lg bg-white dark:bg-mobile-dark-article flex flex-col "
      style={{ boxShadow: "var(--onboarding-card)" }}
    >
      <div className="flex flex-col gap-[11px]">
        <div className="flex flex-col gap-[6px]">
          <div className="font-poppins font-semibold text-[15px] leading-[22px] text-mobile-text-heading dark:text-white">
            {data.title}
          </div>
          <div className="font-mulish font-semibold text-[13px] leading-[17px] text-mobile-text-heading dark:text-white">
            {data.description}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-[11px]">
        {data.components.map((_component: any, inx: number) => {
          switch (_component.type) {
            case "help":
              return (
                <span
                  className="font-mulish font-semibold text-[13px] leading-[17px] text-mobile-text-primary"
                  key={inx}
                >
                  {_component.title}
                </span>
              );
            case "single-choice":
              return (
                <ButtonGroup
                  groupData={[..._component.buttons, { text: "Other" }]}
                  key={inx}
                /> // Add onClick handler
              );
          }
        })}
      </div>
    </div>
  );
};

const Node = ({ data, id, edges, onAddStep, setOpen }: any) => {
  const connectionInProgress = useConnection(
    (connection) => connection.inProgress
  );

  // Check if this node has outgoing edges
  const isLastNode = useMemo(() => {
    return !edges.some((edge: any) => edge.source === id);
  }, [edges, id]);
  return (
    <BaseNode className="p-0 rounded-[10px]">
      {/* Show button only on last node */}
      <Component data={data} />
      {isLastNode && (
        <ButtonHandle
          type="source"
          position={Position.Right}
          style={{
            background: "transparent",
          }}
          showButton={!connectionInProgress}
        >
          <DropDownMenuAddStep onAddStep={onAddStep} setOpen={setOpen} />
        </ButtonHandle>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: "transparent",
        }}
        isConnectable
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "transparent",
        }}
        isConnectable
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable
        style={{
          background: "transparent",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable
        style={{
          background: "transparent",
        }}
      />
    </BaseNode>
  );
};

export default Node;

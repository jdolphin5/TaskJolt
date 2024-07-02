import * as React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams";
import { TSCustomNodeModel } from "./TSCustomNodeModel";

export interface TSCustomNodeWidgetProps {
  node: TSCustomNodeModel;
  engine: DiagramEngine;
}

export interface TSCustomNodeWidgetState {
  node: TSCustomNodeModel;
  engine: any;
}

export const TSCustomNodeWidget: React.FC<TSCustomNodeWidgetProps> = ({
  node,
  engine,
}) => {
  return (
    <div className="custom-node" style={{ backgroundColor: node.color }}>
      <div className="custom-node-header">
        {node.name}
        {(() => {
          const p = node.getPort("in");
          if (p) {
            return (
              <PortWidget engine={engine} port={p}>
                <div className="circle-port" />
              </PortWidget>
            );
          }
          return null; // or any fallback content if needed
        })()}
        {(() => {
          const p = node.getPort("out");
          if (p) {
            return (
              <PortWidget engine={engine} port={p}>
                <div className="circle-port" />
              </PortWidget>
            );
          }
          return null; // or any fallback content if needed
        })()}
        <div
          className="custom-node-color"
          style={{ backgroundColor: node.color }}
        />
      </div>
    </div>
  );
};

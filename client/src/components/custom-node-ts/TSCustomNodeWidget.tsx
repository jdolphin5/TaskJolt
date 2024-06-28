import * as React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams";
import { TSCustomNodeModel } from "./TSCustomNodeModel";

export interface TSCustomNodeWidgetProps {
  node: TSCustomNodeModel;
  engine: DiagramEngine;
}

export interface TSCustomNodeWidgetState {}

export class TSCustomNodeWidget extends React.Component<
  TSCustomNodeWidgetProps,
  TSCustomNodeWidgetState
> {
  constructor(props: TSCustomNodeWidgetProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="custom-node">
        {(() => {
          const p = this.props.node.getPort("in");
          if (p) {
            return (
              <PortWidget engine={this.props.engine} port={p}>
                <div className="circle-port" />
              </PortWidget>
            );
          }
          return null; // or any fallback content if needed
        })()}
        {(() => {
          const p = this.props.node.getPort("out");
          if (p) {
            return (
              <PortWidget engine={this.props.engine} port={p}>
                <div className="circle-port" />
              </PortWidget>
            );
          }
          return null; // or any fallback content if needed
        })()}
        <div
          className="custom-node-color"
          style={{ backgroundColor: this.props.node.color }}
        />
      </div>
    );
  }
}

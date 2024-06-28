import React, { useEffect, useState } from "react";
import createEngine, {
  DiagramModel,
  DefaultLinkModel,
} from "@projectstorm/react-diagrams";
import { BodyWidget } from "./BodyWidget";
import { TSCustomNodeModel } from "./custom-node-ts/TSCustomNodeModel";
import { TSCustomNodeFactory } from "./custom-node-ts/TSCustomNodeFactory";

const NetworkDiagram: React.FC = () => {
  // Create an instance of the engine
  const engineInstance = createEngine();
  engineInstance.getNodeFactories().registerFactory(new TSCustomNodeFactory());

  const model = new DiagramModel();

  const node1 = new TSCustomNodeModel({ color: "rgb(192,255,0)" });
  node1.setPosition(50, 50);

  const node2 = new TSCustomNodeModel({ color: "rgb(0,192,255)" });
  node2.setPosition(200, 50);

  const link1 = new DefaultLinkModel();
  link1.setSourcePort(node1.getPort("out"));
  link1.setTargetPort(node2.getPort("in"));

  model.addAll(node1, node2, link1);

  // Log to verify nodes and links
  console.log("Nodes and link added:", node1, node2, link1);

  // Set the model to the engine
  engineInstance.setModel(model);

  return <BodyWidget engine={engineInstance} />;
};

export default NetworkDiagram;

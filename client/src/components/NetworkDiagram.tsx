import React, { useEffect, useState } from "react";
import createEngine, {
  DiagramModel,
  DefaultLinkModel,
  DefaultLabelModel,
} from "@projectstorm/react-diagrams";
import { BodyWidget } from "./BodyWidget";
import { TSCustomNodeModel } from "./custom-node-ts/TSCustomNodeModel";
import { TSCustomNodeFactory } from "./custom-node-ts/TSCustomNodeFactory";
import { NetworkDiagramProps } from "../Types";
import { fetchTasksAndDependencies } from "../APIFunc";

const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  tasksPageLoaded,
  setTasksPageLoaded,
  projectsLoaded,
  setProjectsLoaded,
  tasksLoaded,
  setTasksLoaded,
  projectData,
  setProjectData,
  taskData,
  setTaskData,
  projectId,
  setProjectId,
}) => {
  const [engineInstance] = useState(createEngine());
  const [model, setModel] = useState<DiagramModel | null>(null);

  useEffect(() => {
    const generateDiagram = async () => {
      engineInstance
        .getNodeFactories()
        .registerFactory(new TSCustomNodeFactory());

      const { tasks, dependencies } = await fetchTasksAndDependencies(
        projectId
      );

      // Create a new DiagramModel
      const newModel = new DiagramModel();

      // Map to store node models
      const nodeMap = new Map();

      // Create nodes
      tasks.forEach((task: any) => {
        const node = new TSCustomNodeModel({ color: "rgb(192,255,0)" }); // Customize the color based on task properties
        node.setPosition(Math.random() * 400, Math.random() * 400); // Random positioning for now, you can set your own logic
        node.name = task.name;
        nodeMap.set(task.id, node);
        newModel.addNode(node);
      });

      // Create links
      dependencies.forEach((dependency: any) => {
        const parent = nodeMap.get(dependency.parent_id);
        const child = nodeMap.get(dependency.child_id);

        if (parent && child) {
          const link = new DefaultLinkModel();
          link.setSourcePort(parent.getPort("out"));
          link.setTargetPort(child.getPort("in"));
          /*
          link.addLabel(
            new DefaultLabelModel({
              label: `${parent.name} -> ${child.name}`,
            })
          );
          */
          newModel.addLink(link);
        }
      });

      // Log to verify nodes and links
      console.log(
        "Nodes and links added:",
        Array.from(nodeMap.values()),
        dependencies
      );

      // Set the model to the engine
      engineInstance.setModel(newModel);
      setModel(newModel);
    };

    generateDiagram();
  }, [engineInstance, projectId]);

  if (!model) {
    return null; // or some loading spinner
  }

  return <BodyWidget engine={engineInstance} />;
};

export default NetworkDiagram;

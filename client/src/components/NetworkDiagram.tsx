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

      // Create a map to store node models
      const nodeMap = new Map();

      // Create a map to store children of each task
      const childrenMap = new Map();
      tasks.forEach((task: any) => {
        childrenMap.set(task.id, []);
      });
      dependencies.forEach((dependency: any) => {
        if (!childrenMap.has(dependency.parent_id)) {
          childrenMap.set(dependency.parent_id, []);
        }
        childrenMap.get(dependency.parent_id).push(dependency.child_id);
      });

      // Recursive function to position nodes
      const positionNodes = (taskId: any, x: number, y: number) => {
        const node = nodeMap.get(taskId);
        node.setPosition(x, y);

        const children = childrenMap.get(taskId);
        children.forEach((childId: any, index: number) => {
          positionNodes(childId, x + index * 150, y + 150);
        });
      };

      // Create nodes and add them to the model
      tasks.forEach((task: any) => {
        const node = new TSCustomNodeModel({
          name: task.name,
          color: "rgb(192,255,0)",
        });
        nodeMap.set(task.id, node);
        newModel.addNode(node);
      });

      // Position the root nodes (tasks without parents)
      const rootNodes = tasks.filter(
        (task: any) =>
          !dependencies.some(
            (dependency: any) => dependency.child_id === task.id
          )
      );

      rootNodes.forEach((rootNode: any, index: number) => {
        positionNodes(rootNode.id, index * 150, 50);
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

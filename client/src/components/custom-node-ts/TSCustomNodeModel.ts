import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import { DefaultPortModel } from "@projectstorm/react-diagrams";

interface TSCustomNodeModelOptions extends NodeModelGenerics {
  color?: string;
  name?: string;
}

export class TSCustomNodeModel extends NodeModel<TSCustomNodeModelOptions> {
  color: string;
  name: string;

  constructor(options: any = {}) {
    super({
      ...options,
      type: "ts-custom-node",
    });
    this.color = options.color || "red";
    this.name = options.name || "Unnamed Node";
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: "in",
      })
    );
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: "out",
      })
    );
  }

  serialize() {
    return {
      ...super.serialize(),
      color: this.color,
      name: this.name,
    };
  }

  deserialize(event: any): void {
    super.deserialize(event);
    this.color = event.data.color;
    this.name = event.data.name;
  }
}

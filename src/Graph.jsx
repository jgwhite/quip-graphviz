import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

export default class Graph extends React.Component {
  element = null;
  graph = null;

  render() {
    return <div ref={e => (this.element = e)} style={this.props.style} />;
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  componentWillUnmount() {
    this.removeGraph();
  }

  async renderGraph() {
    let { dot } = this.props;
    let viz = new Viz({ Module, render });
    let graph = await viz.renderSVGElement(dot);

    graph.style.display = "block";
    graph.style.position = "relative";
    graph.style.maxWidth = "100%";
    graph.style.height = "auto";
    graph.style.margin = "0";

    this.removeGraph();
    this.element.appendChild(graph);
    this.graph = graph;

    let { onRender } = this.props;

    if (onRender) {
      onRender(this.graph);
    }
  }

  removeGraph() {
    if (!this.graph) {
      return;
    }

    this.graph.remove();
    this.graph = null;
  }
}

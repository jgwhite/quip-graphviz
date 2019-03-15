import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

export default class App extends React.Component {
  render() {
    let dot = this.props.rootRecord.get("dot");
    let width = quip.apps.getContainerWidth();

    return (
      <div
        style={{
          display: "flex",
          width: `${width}px`
        }}
      >
        <textarea
          rows="20"
          style={{
            width: "50%",
            fontFamily: "monospace",
            border: "1px solid grey",
            borderRadius: "0",
            zIndex: 1
          }}
          onInput={e => this.updateDot(e.target.value)}
        >
          {dot}
        </textarea>
        <div
          style={{
            width: "50%",
            border: "1px solid grey",
            borderLeft: "0",
            zIndex: 0
          }}
          ref={e => (this.graphContainer = e)}
        />
      </div>
    );
  }

  updateDot(value) {
    let { rootRecord } = this.props;
    rootRecord.set("dot", value);
    this.renderGraph();
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  async renderGraph() {
    let viz = new Viz({ Module, render });
    let dot = this.props.rootRecord.get("dot");
    let svg = await viz.renderSVGElement(dot);
    let div = this.graphContainer;
    let old = div.firstChild;

    if (old) {
      div.replaceChild(svg, old);
    } else {
      div.appendChild(svg);
    }
  }
}

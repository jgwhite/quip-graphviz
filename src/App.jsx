import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

export default class App extends React.Component {
  state = {
    focused: false
  };

  render() {
    let dot = this.props.rootRecord.get("dot");
    let width = quip.apps.getContainerWidth();
    let { focused } = this.state;

    return (
      <div
        style={{
          display: "flex",
          width: `${width}px`,
          minHeight: focused ? "200px" : "0",
          boxSizing: "border-box",
          border: focused ? "1px solid grey" : "1px solid white"
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            width: focused ? "50%" : "100%",
            borderRight: focused ? "1px solid grey" : "0",
            zIndex: 0
          }}
          ref={e => (this.graphContainer = e)}
        />
        {focused && (
          <textarea
            style={{
              width: "50%",
              fontFamily: "monospace",
              border: "0",
              borderRadius: "0",
              zIndex: 1
            }}
            onInput={e => this.updateDot(e.target.value)}
            spellCheck={false}
          >
            {dot}
          </textarea>
        )}
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
    quip.apps.addEventListener(quip.apps.EventType.FOCUS, this.onFocus);
    quip.apps.addEventListener(quip.apps.EventType.BLUR, this.onBlur);
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  componentWillUnmount() {
    quip.apps.removeEventListener(quip.apps.EventType.FOCUS, this.onFocus);
    quip.apps.removeEventListener(quip.apps.EventType.BLUR, this.onBlur);
  }

  onFocus = () => this.setState({ focused: true });

  onBlur = () => this.setState({ focused: false });

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

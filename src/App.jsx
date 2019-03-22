import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";
import MonacoEditor from 'react-monaco-editor';

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
          <MonacoEditor
          width="800"
          height="600"
          language="javascript"
          theme="vs-dark"
          value={dot}
          onChange={(value)=> this.updateDot(value) }
          editorDidMount={(editor) => this.editorDidMount(editor) }
        />
        )}
      </div>
    );
  }

  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
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

    svg.style.width = "100%";

    if (old) {
      div.replaceChild(svg, old);
    } else {
      div.appendChild(svg);
    }
  }
}

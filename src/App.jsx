import Graph from "./Graph.jsx";
import Editor from "./Editor.jsx";

export default class App extends React.Component {
  state = {
    isFocused: false
  };

  render() {
    let dot = this.props.rootRecord.get("dot");
    let width = quip.apps.getContainerWidth();
    let { isFocused } = this.state;
    let gray = "#e3e5e8";

    return (
      <div
        style={{
          outline: isFocused ? `2px solid ${gray}` : "none"
        }}
      >
        <Graph
          dot={dot}
          style={{ width: `${width}px` }}
          onRender={() => this.graphDidRender()}
        />
        {isFocused && (
          <Editor
            dot={dot}
            style={{
              position: "absolute",
              top: "-2px",
              left: "100%",
              bottom: "-2px",
              width: (document.body.clientWidth - width) / 2 - 16 + "px",
              border: `2px solid ${gray}`
            }}
            onChange={value => this.updateDot(value)}
            onMount={editor => this.editorDidMount(editor)}
          />
        )}
      </div>
    );
  }

  updateDot(value) {
    let { rootRecord } = this.props;
    rootRecord.set("dot", value);
    this.forceUpdate();
  }

  editorDidMount(editor) {
    editor.focus();
    this.editor = editor;
  }

  graphDidRender() {
    this.editor.layout();
  }

  componentDidMount() {
    quip.apps.addEventListener(quip.apps.EventType.FOCUS, this.onFocus);
    quip.apps.addEventListener(quip.apps.EventType.BLUR, this.onBlur);
  }

  componentWillUnmount() {
    quip.apps.removeEventListener(quip.apps.EventType.FOCUS, this.onFocus);
    quip.apps.removeEventListener(quip.apps.EventType.BLUR, this.onBlur);
  }

  onFocus = () => this.setState({ isFocused: true });
  onBlur = () => this.setState({ isFocused: false });
}

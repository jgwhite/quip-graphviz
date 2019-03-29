import Graph from "./Graph.jsx";
import Editor from "./Editor.jsx";

export default class App extends React.Component {
  state = {
    isFocused: false,
    isEditing: false
  };

  render() {
    let dot = this.props.rootRecord.get("dot");
    let width = quip.apps.getContainerWidth();
    let gray = "#e3e5e8";
    let { isEditing } = this.state;

    return (
      <div
        style={{
          outline: isEditing ? `2px solid ${gray}` : "none",
          minHeight: isEditing ? "128px" : "0"
        }}
      >
        <Graph
          dot={dot}
          style={{ width: `${width}px` }}
          onRender={() => this.graphDidRender()}
        />
        {isEditing && (
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

  updateMenu() {
    if (this.state.isEditing) {
      quip.apps.updateToolbar({
        toolbarCommandIds: ["edit"],
        menuCommands: [
          {
            id: "edit",
            label: "Done",
            handler: () => this.setState({ isEditing: false })
          }
        ]
      });
    } else {
      quip.apps.updateToolbar({
        toolbarCommandIds: ["edit"],
        menuCommands: [
          {
            id: "edit",
            label: "Edit",
            handler: () => this.setState({ isEditing: true })
          }
        ]
      });
    }
  }

  editorDidMount(editor) {
    editor.focus();
    this.editor = editor;
  }

  graphDidRender() {
    if (this.editor) {
      this.editor.layout();
    }
  }

  componentDidMount() {
    quip.apps.addEventListener(quip.apps.EventType.FOCUS, this.onFocus);
    quip.apps.addEventListener(quip.apps.EventType.BLUR, this.onBlur);
    this.props.rootRecord.listen(this.onChange);
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  componentWillUnmount() {
    quip.apps.removeEventListener(quip.apps.EventType.FOCUS, this.onFocus);
    quip.apps.removeEventListener(quip.apps.EventType.BLUR, this.onBlur);
    this.props.rootRecord.unlisten(this.onChange);
  }

  onFocus = () => {
    this.setState({ isFocused: true });
    this.updateMenu();
  }

  onBlur = () => {
    this.setState({ isFocused: false, isEditing: false });
    this.updateMenu();
  }

  onChange = () => {

    if (this.state.isEditing) {
      return;
    }
    this.forceUpdate();
  }
}

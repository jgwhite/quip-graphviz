import MonacoEditor from "react-monaco-editor";

export default class Editor extends React.Component {
  render() {
    return (
      <div style={this.props.style} ref={e => (this.element = e)}>
        <MonacoEditor
          language="dot"
          theme="github"
          value={this.props.dot}
          options={{
            minimap: {
              enabled: false
            },
            renderIndentGuides: false,
            renderLineHighlight: "gutter",
            scrollBeyondLastLine: false
          }}
          onChange={value => this.props.onChange(value)}
          editorDidMount={editor => this.editorDidMount(editor)}
        />
      </div>
    );
  }

  componentDidMount() {
    quip.apps.addDetachedNode(this.element);
  }

  editorDidMount(editor) {
    this.editor = editor;
    this.props.onMount(editor);
  }

  componentWillUnmount() {
    quip.apps.removeDetachedNode(this.element);
  }
}

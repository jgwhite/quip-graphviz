import quip from "quip";
import App from "./App.jsx";

export class RootRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      dot: "string"
    };
  }

  static getDefaultProperties() {
    return {
      dot: "digraph {\n\n}"
    };
  }
}

quip.apps.registerClass(RootRecord, "root-record");

quip.apps.initialize({
  initializationCallback(rootNode) {
    let rootRecord = quip.apps.getRootRecord();

    ReactDOM.render(<App rootRecord={rootRecord} />, rootNode);
  }
});

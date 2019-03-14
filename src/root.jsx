import quip from "quip";
import App from "./App.jsx";

quip.apps.initialize({
  initializationCallback(rootNode) {
    let rootRecord = quip.apps.getRootRecord();

    ReactDOM.render(
      <App rootRecord={rootRecord} />,
      rootNode
    );
  }
});

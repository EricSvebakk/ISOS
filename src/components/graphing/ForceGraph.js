import React from "react";
import { runForceGraph } from "./ForceGraphGenerator";
import styles from "./forceGraph.module.css";

export function ForceGraph({
  linksData,
  nodesData,
  nodesPosition,
  setNodesPosition,
  setForceGraphUpdater,
  funcColor
  
  // nodeHoverTooltip,
  // funcColor,
}) {
  const containerRef = React.useRef(null);

  // const funcColor = () => {}
  const nodeHoverTooltip = () => {}
  
  
  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy, update, nodes } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        funcColor,
        setNodesPosition,
        nodesPosition,
        nodeHoverTooltip,
        // hovered
      );
      destroyFn = destroy;

      // nodes();

      setForceGraphUpdater(update); 
    }

    return destroyFn;
  }, [nodesData, funcColor]);

  return (
    <>
      <div ref={containerRef} className={styles.container} />
      {/* <div className={styles.container}>{text}</div> */}
    </>
  );
}

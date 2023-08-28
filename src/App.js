
import React, { Component } from "react";

import data from "./data/ifi_subjects_010823.json";
import { codeColor } from "./components/NodeColor";

import { MyNavbar } from "./components/Navbar";
import SubjectManager from "./components/subjectManagement/SubjectManager";
import { ForceGraph } from "./components/graphing/ForceGraph";
// import SemesterPlan from "./components/Semesterplan";


class App extends Component {
  
  state = {
    subjectsAll: data.nodes,
    subjectsSelected: [],
    subjectsSelectedNodePosition: [],
    forceGraphUpdater: () => {console.log("FGU empty")},
    funcColor: codeColor
  }
  
  
  setSubjectsSelected = (newSubjectsSelected) => {
    this.setState({
      subjectsSelected: newSubjectsSelected,
    });
  }
  
  setsubjectsSelectedNodePosition = (arr) => {
    this.setState({
      subjectsSelectedNodePosition: arr,
    });
  };

  /**
   * sets the function which must be called when updating forceGraph
   * @param {*} e force-graph updater function
   */
  setForceGraphUpdater = (e) => {
    this.setState({
      forceGraphUpdater: e,
    });
  };

  // ===============================================================
  nodeHoverTooltip = (node) => {
    return node.title;
  };

  render() {
    const {
      subjectsAll,
      subjectsSelected,
      subjectsSelectedNodePosition,
      forceGraphUpdater,
      funcColor
    } = this.state;
    

    return (
      <div className="App">
        <MyNavbar></MyNavbar>
        
        <div className="app-container">
          <section className="left">
            <ForceGraph
              linksData={data.links}
              nodesData={subjectsSelected}
              nodesPosition={subjectsSelectedNodePosition}
              setNodesPosition={this.setsubjectsSelectedNodePosition}
              setForceGraphUpdater={this.setForceGraphUpdater}
              funcColor={funcColor}
              
              // funcColor={funcColor}
              // nodeHoverTooltip={this.nodeHoverTooltip}
            />
          </section>

          <section className="middle">
            <SubjectManager
              subjectsAll={subjectsAll}
              setSubjectsSelected={this.setSubjectsSelected}
              forceGraphUpdater={forceGraphUpdater}
            />
          </section>

          <section className="right">
            {/* <SemesterPlan
              nodesData={selectedSubjects}
              linksData={data.links}
              result={nodesTopsorted}
              funcColor={funcColor}
              setTopsort={this.setTopsort}
              setSemesters={this.setSemesters}
              sems={semesters}
            /> */}
          </section>
        </div>
      </div>
    );
  }
}

export default App;

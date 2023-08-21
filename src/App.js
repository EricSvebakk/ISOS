
import React, { Component } from "react";

import data from "./data/ifi_subjects_010823.json";
// import { codeColor, semesterColor } from "./components/NodeColor";

import { MyNavbar } from "./components/Navbar";
import SubjectManager from "./components/subjectManagement/SubjectManager";
// import { ForceGraph } from "./components/graphing/ForceGraph";
// import SemesterPlan from "./components/Semesterplan";


class App extends Component {
  
  state = {
    subjectsAll: data.nodes,
    subjectsSelected: [],
    subjectsSelectedNodePosition: [],
  }
  
  // new functions
  // setSubjectsSelected = () => {
  //   this.setState({
  //     subjectsSelected
  //   })
  // }

  // ===============================================================
  // sets the function which must be called when updating forceGraph
  setForceGraphUpdater = (e) => {
    this.setState({
      forceGraphUpdater: e,
    });
  };

  // ===============================================================
  nodeHoverTooltip = (node) => {
    return node.title;
  };

  setNodesPosition = (arr) => {
    this.setState({
      nodesPosition: arr,
    });
  };

  render() {
    const {
      subjectsAll
    } = this.state;
    

    return (
      <div className="App">
        <MyNavbar></MyNavbar>
        
        <div className="app-container">
          <section className="left">
            {/* <ForceGraph
              linksData={data.links}
              nodesData={subjectsSelected}
              funcColor={funcColor}
              nodeHoverTooltip={this.nodeHoverTooltip}
              mytemp={this.setForceGraphUpdater}
              setNodesPosition={this.setNodesPosition}
              nodesPosition={nodesPosition}
            /> */}
          </section>

          <section className="middle">
            <SubjectManager
              subjectsAll={subjectsAll}
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

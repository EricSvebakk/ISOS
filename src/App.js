
import React, { Component } from "react";
import data from "./data/ifi_subjects_010823.json";
import Subjects from "./components/subjectManagement/Subjects";
// import SemesterPlan from "./components/Semesterplan";
// import Settings from "./components/Settings";
import { SubjectManager } from "./components/subjectManagement/SubjectManager";


import { MyNavbar } from "./components/Navbar";
import { ForceGraph } from "./components/graphing/ForceGraph";
import { codeColor, semesterColor } from "./components/NodeColor";
// import { SubjectManager } from "./components/subjectManagement/SubjectManager";

class App extends Component {
  state = {
    subjectsSelected: [],
    nodesTopsorted: [],
    nodesPosition: [],
    semesters: [],
    funcColor: codeColor,
  };

  // // ===============================================================
  // // selects/deselects subjects to be show in force-graph
  // toggleSubject = (e) => {
    
  //   console.log(e);
    
  //   const node = e.currentTarget.getAttribute("data-item");
  //   const temp = data.nodes.filter((a) => a.code === node)[0];

  //   const { subjectsSelected: selectedSubjects, forceGraphUpdater } = this.state;

  //   // console.log("ts!", node)

  //   if (!selectedSubjects.includes(temp)) {
  //     const result = this.toggleSubjectRecursive([temp]);
  //     const result2 = result.filter((n) => !selectedSubjects.includes(n));
  //     const result3 = [...new Set(result2)];

  //     let result4 = [...result3];
  //     let equivs = null;

  //     // console.log(result, result2, result3, result4);

  //     // for (const temp_node of result3) {

  //     //   // console.log("tn", temp_node.id, temp_node.equivalent)

  //     //   if (temp_node.equivalent != null) {

  //     //     let temp_equivs = [...temp_node.equivalent, temp_node.code];

  //     //     equivs = data.nodes.filter((n) => temp_equivs.includes(n.code));
  //     //     equivs = equivs.sort((a, b) => a.code.localeCompare(b.code));

  //     //     let nodeUsed = equivs[0];

  //     //     result4 = result4.filter((n) => !equivs.includes(n));
  //     //     result4 = [...result4, nodeUsed]

  //     //     console.log("er", equivs, result4);
  //     //     // console.log(result4);

  //     //     // console.log("NU", equivs, equivs[0]);

  //     //     // result.filter((a) => {
  //     //     //   for (const ntemp of equivs) {
  //     //     //     if (a.code == ntemp.code) {
  //     //     //       return false;
  //     //     //     }
  //     //     //   }
  //     //     //   return true;
  //     //     // });
  //     //   }
  //     // }

  //     this.setState({
  //       selectedSubjects: [...selectedSubjects, ...result4],
  //     });
  //   } else {
  //     this.setState({
  //       selectedSubjects: selectedSubjects.filter((sub) => sub !== temp),
  //     });
  //   }
  //   forceGraphUpdater();
  // };

  // // helper-function for toggleSubject()
  // toggleSubjectRecursive = (nodeList) => {
  //   let result = [...nodeList];

  //   for (const node of nodeList) {
  //     // more code was here before
  //     // nodeUsed used for overlap
  //     let nodeUsed = node;

  //     if (nodeUsed.msubs != null) {
  //       let rec = data.nodes.filter((n) => nodeUsed.msubs.includes(n.id));
  //       result = [...result, ...this.toggleSubjectRecursive(rec)];
  //     }

  //     if (nodeUsed.rsubs != null) {
  //       let rec = data.nodes.filter((n) => nodeUsed.rsubs.includes(n.id));
  //       result = [...result, ...this.toggleSubjectRecursive(rec)];
  //     }

  //     // if (equivs != null) {

  //     //   // result = []
  //     // }
  //   }

  //   return result;
  // };

  // ===============================================================
  // deselects all subjects
  clearSubjects = () => {
    const { forceGraphUpdater } = this.state;

    this.setState({
      selectedSubjects: [],
    });

    forceGraphUpdater();
  };

  // ===============================================================
  // sets the color-mode for the force-graph
  setColorMode = (e) => {
    const mode = e.currentTarget.getAttribute("data-item");
    let temp;

    const { forceGraphUpdater, funcColor } = this.state;

    console.log(mode);

    switch (mode) {
      case "semester":
        temp = semesterColor;
        break;
      // case "points":
      //   temp = pointsColor;
      //   break;
      default:
        temp = codeColor;
        break;
    }

    if (temp !== funcColor) {
      this.setState({
        funcColor: temp,
      });
      forceGraphUpdater();
    }
  };

  // sets the function which must be called when updating forceGraph
  setForceGraphUpdater = (e) => {
    this.setState({
      forceGraphUpdater: e,
    });
  };

  //
  setTopsort = (e) => {
    this.setState({
      nodesTopsorted: e,
    });
  };

  setSemesters = (e) => {
    this.setState({
      semesters: e,
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
      // subjectsSelected: selectedSubjects,
      // visibleSubjects,
      // sortingCategory,
      // nodesTopsorted,
      nodesPosition,
      // semesters,
      // filterSelected,
      funcColor,
      forceGraphUpdater,
    } = this.state;

    return (
      <div className="App">
        <MyNavbar></MyNavbar>
        <div className="app-container">
          <section className="left">
            <ForceGraph
              linksData={data.links}
              nodesData={subjectsSelected}
              funcColor={funcColor}
              nodeHoverTooltip={this.nodeHoverTooltip}
              mytemp={this.setForceGraphUpdater}
              setNodesPosition={this.setNodesPosition}
              nodesPosition={nodesPosition}
            />
            {/* <div className="spacer" /> */}
            {/* <div style={{ display: "inline-block" }}>
              
              <button
                className="subject-button"
                data-item={"code"}
                onClick={this.setColorMode}
              >
                code
              </button>
              
              <button
                className="subject-button"
                data-item={"semester"}
                onClick={this.setColorMode}
              >
                semester
              </button>
              
            </div> */}
          </section>

          <section className="middle">
            <SubjectManager
              subjects={nodes}
              setSubjects={null}
              
              forceGraphUpdater={forceGraphUpdater}
            />
            {/* <Subjects
              nodesData={data.nodes}
              // subjectsSelected={selectedSubjects}
              // levelSelected={selectedSubjects}
              // sortBy={sortingCategory}
              // selectSubject={this.toggleSubject}
              // funcSort={this.chooseSort}
              // clearSubjects={this.clearSubjects}
              // searchInSubjects={this.searchInSubjects}
              // test={this.testing}
              forceGraphUpdater={forceGraphUpdater}
            /> */}
          </section>

          <section className="right">
            {/* <Settings
              filterFunction={this.filterSubjects}
              filterSelected={filterSelected}
            /> */}
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

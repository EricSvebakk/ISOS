
import React, { Component } from "react";

import data from "./data/ifi_subjects_010823.json";
import { codeColor } from "./components/NodeColor";

import { MyNavbar } from "./components/Navbar";
import SubjectManager from "./components/subjectManagement/SubjectManager";
import { ForceGraph } from "./components/graphing/ForceGraph";
// import SemesterPlan from "./components/subjectManagement/Semesterplan";


class App extends Component {
  
  state = {
    subjectsAll: data.nodes,
    subjectsVisible:  data.nodes,
    subjectsSelected: [],
    subjectLevelsSelected: {
      "bachelor": true,
      "master": true,
      "phd": true,
    },
    
    subjectsSelectedNodePosition: [],
    forceGraphUpdater: () => {console.log("FGU empty")},
    funcColor: codeColor,
    
    nodesTopsorted: [],
    semesters: [],
  }
  
  setSubjectsVisible = (newSubjectsVisible) => {
    this.setState({
      subjectsVisible: newSubjectsVisible,
    });
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
  
  toggleSubjectLevel = (level) => {
    
    const { subjectLevelsSelected, subjectsAll } = this.state;
    
    const newSLS = {...subjectLevelsSelected, [level]: !subjectLevelsSelected[level] }
    const newSV = subjectsAll.filter((node) => {
      
        const num = parseInt(node.code.slice(2, node.code.length));
        
        if (!Number.isInteger(num)) {
          return false;
        }
      
        for (const [level, val] of Object.entries(newSLS)) {
          if (!val) continue;    
          if (level.localeCompare("bachelor") === 0 && (num < 4000)) return true;
          else if (level.localeCompare("master") === 0 && (num < 9000) && (num >= 4000)) return true;
          else if (level.localeCompare("phd") === 0 && (num >= 9000)) return true;
        }
        
        return false;
      }
    );
    
    this.setState({
      subjectLevelsSelected: newSLS,
      subjectsVisible: newSV,
    });
  }

  render() {
    
    const {
      subjectsAll,
      subjectsSelected,
      subjectsSelectedNodePosition,
      forceGraphUpdater,
      funcColor,
      
      subjectsVisible,
      subjectLevelsSelected,
      
      nodesTopsorted,
      semesters
    } = this.state;
    
    const checkBoxes = Object.entries(subjectLevelsSelected).map(([key, val]) => {
      return (
        <div
          key={key}
          style={{
            display: "inline-block",
            filter: "brightness(" + (val ? "100" : "80") + "%)",
          }}
        >
          {/* <p 
            style={{ width: "50%", display: "inline-block", backgroundColor: "green", margin:"0"}}
          >{key}</p> */}

          <button
            // className="subject-button"
            onClick={() => {
              // console.log("gur", key, val)
              this.toggleSubjectLevel(key);
            }}
          >
            {key}
          </button>

          {/* <input
            style={{ width: "10%", height: "100%", color: "pink", margin: "0px" }}
            type="checkbox"
            checked={val}
            onChange={() => this.toggleSubjectLevel(key)}
          /> */}
        </div>
      );
    });

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
              nodeHoverTooltip={this.nodeHoverTooltip}
            />
          </section>

          <section className="middle">
            <SubjectManager
              subjectsAll={subjectsAll}
              subjectsVisible={subjectsVisible}
              setSubjectsVisible={this.setSubjectsVisible}
              setSubjectsSelected={this.setSubjectsSelected}
              forceGraphUpdater={forceGraphUpdater}
              checkBoxes={checkBoxes}
            />
          </section>

          <section className="right">
            
            {/* <div className="subject-search">
              {checkBoxes}
            </div> */}
            {/* <SemesterPlan
              nodesData={subjectsVisible}
              linksData={data.links}
              result={nodesTopsorted}
              setTopsort={this.setTopsort}
              
              funcColor={funcColor}
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

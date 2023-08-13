import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
// import { color } from "d3";

class Subjects extends Component {
  // ===============================================================
  // selects/deselects subjects to be show in force-graph
  toggleSubject = (e) => {
    const { subjectsSelected, forceGraphUpdater, allNodes } = this.state;

    // console.log(e);

    const node = e.currentTarget.getAttribute("data-item");
    const temp = allNodes.filter((a) => a.code === node)[0];

    // console.log("ts!", node)

    if (!subjectsSelected.includes(temp)) {
      const result = this.toggleSubjectRecursive([temp]);
      const result2 = result.filter((n) => !subjectsSelected.includes(n));
      const result3 = [...new Set(result2)];

      let result4 = [...result3];
      let equivs = null;

      // console.log(result, result2, result3, result4);

      // for (const temp_node of result3) {

      //   // console.log("tn", temp_node.id, temp_node.equivalent)

      //   if (temp_node.equivalent != null) {

      //     let temp_equivs = [...temp_node.equivalent, temp_node.code];

      //     equivs = data.nodes.filter((n) => temp_equivs.includes(n.code));
      //     equivs = equivs.sort((a, b) => a.code.localeCompare(b.code));

      //     let nodeUsed = equivs[0];

      //     result4 = result4.filter((n) => !equivs.includes(n));
      //     result4 = [...result4, nodeUsed]

      //     console.log("er", equivs, result4);
      //     // console.log(result4);

      //     // console.log("NU", equivs, equivs[0]);

      //     // result.filter((a) => {
      //     //   for (const ntemp of equivs) {
      //     //     if (a.code == ntemp.code) {
      //     //       return false;
      //     //     }
      //     //   }
      //     //   return true;
      //     // });
      //   }
      // }

      this.setState({
        subjectsSelected: [...subjectsSelected, ...result4],
      });
    } else {
      this.setState({
        subjectsSelected: subjectsSelected.filter((sub) => sub !== temp),
      });
    }
    // forceGraphUpdater();
  };

  // helper-function for toggleSubject()
  toggleSubjectRecursive = (nodeList) => {
    const { allNodes } = this.state;

    let result = [...nodeList];

    for (const node of nodeList) {
      // more code was here before
      // nodeUsed used for overlap
      let nodeUsed = node;

      if (nodeUsed.msubs != null) {
        let rec = allNodes.filter((n) => nodeUsed.msubs.includes(n.id));
        result = [...result, ...this.toggleSubjectRecursive(rec)];
      }

      if (nodeUsed.rsubs != null) {
        let rec = allNodes.filter((n) => nodeUsed.rsubs.includes(n.id));
        result = [...result, ...this.toggleSubjectRecursive(rec)];
      }

      // if (equivs != null) {

      //   // result = []
      // }
    }

    return result;
  };

  // ===============================================================
  // deselects all subjects
  clearSubjects = () => {
    const { forceGraphUpdater } = this.state;

    this.setState({
      subjectsSelected: [],
    });

    // forceGraphUpdater();
  };

  // ===============================================================
  toggleLevel = (e) => {
    const { allNodes, levelsSelected } = this.state;

    const content = e.currentTarget.getAttribute("data-item");
    let fs = levelsSelected;

    if (levelsSelected.includes(content)) {
      fs = fs.filter((s) => s !== content);
      console.log("included! but removed!");
    } else {
      console.log("not included yet?");
      fs = [...fs, content];
    }

    let changes = allNodes;
    console.log(fs, changes);

    for (const f of fs) {
      switch (f) {
        case "bachelor":
          changes = changes.filter(
            (n) => parseInt(n.code[2]) > 0 && parseInt(n.code[2]) < 4
          );
          break;
        case "master":
          changes = changes.filter(
            (n) => parseInt(n.code[2]) > 3 && parseInt(n.code[2]) < 9
          );
          break;

        default:
          console.log("what");
          break;
      }
    }

    console.log("cont", content, changes);

    this.setState({
      levelsSelected: fs,
      subjectsVisible: changes,
    });
  };

  // ===============================================================
  filterSubjects = (e) => {
    const { allNodes } = this.state;

    // console.log(e);

    // if (node)

    let temp = allNodes.filter(
      (node) =>
        node.code.toLowerCase().includes(e.toLowerCase()) ||
        node.title.toLowerCase().includes(e.toLowerCase())
    );

    console.log(e, temp);

    this.setState({
      subjectsVisible: temp,
    });
  };

  // ===============================================================
  setSubjectSort = (e) => {
    this.setState({
      subjectSortingCategory: e.currentTarget.getAttribute("data-item"),
    });
  };
  
  checkFGU = (e) => {
    if (e != null) {
      this.setState({
        forceGraphUpdater: e
      });
    }
  }

  // ===============================================================
  constructor(props) {
    super(props);

    let temp = ["bachelor", "master", "phd"];

    console.log(props);

    this.state = {
      allNodes: props.nodesData,
      subjectsVisible: props.nodesData,
      subjectsSelected: [],

      levels: temp,
      levelsSelected: temp,

      subjectSortingCategory: "code",
      forceGraphUpdater: () => {}
    };
  }

  // ===============================================================
  render() {
    const {
      //   nodesData,
      //   levelSelected,
      selectSubject,
      clearSubjects,
      //   searchInSubjects,
      forceGraphUpdater
    } = this.props;

    if (forceGraphUpdater == null) {
      return;
    }
    
    const {
      // allNodes
      subjectsVisible,
      subjectsSelected,
      levels,
      levelsSelected,
      subjectSortingCategory,
    } = this.state;

    const isSelected = (sid) => subjectsSelected.map((d) => d.id).includes(sid);

    // let smt = (text) => {
    //   return allNodes.filter((node) => node.code.includes(text));
    // };

    let data = subjectsVisible.sort((a, b) => {
      // if (isSelected(a.id) && !isSelected(b.id)) {
      //   return -1;
      // }
      // else if (!isSelected(a.id) && isSelected(b.id)) {
      //   return 1;
      // }

      switch (subjectSortingCategory) {
        case "code":
          return a.code.localeCompare(b.code);
        case "title":
          return a.title.localeCompare(b.title);
        case "semester":
          if (a.semester != null && b.semester != null) {
            return a.semester.localeCompare(b.semester);
          } else if (a.semester != null) {
            return 1;
          } else if (b.semester != null) {
            return -1;
          }

          return 0;
        default:
          return 0;
      }
    });

    const trStyle1 = (pred) => {
      return { filter: "brightness(" + (pred ? "80" : "100") + "%)" };
    };
    const trStyle2 = (pred) => {
      return {
        fontWeight: "bold",
        textDecorationLine:
          subjectSortingCategory === pred ? "underline" : "none",
      };
    };
    const link = (code) =>
      "https://www.uio.no/studier/emner/matnat/ifi/" + code + "/index.html";

    const tableBodyContent = data.map((row) => {
      return (
        <tr style={trStyle1(isSelected(row.id))} key={row.id}>
          <td headers="th1">
            <a
              style={{ color: "black" }}
              href={link(row.code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.code}
            </a>
          </td>
          <td
            headers="th2"
            className="td2"
            data-item={row.code}
            onClick={this.toggleSubject}
          >
            {row.title}
          </td>
          <td
            headers="th3"
            className="td3"
            data-item={row.code}
            onClick={this.toggleSubject}
          >
            {row.semester === null ? "utilgjengelig" : row.semester}
          </td>
        </tr>
      );
    });

    // const stuff = ["bachelor", "master", "phd"];

    const data2 = levels.map((f) => {
      return (
        <div>
          <label>
            <input
              type="checkbox"
              className="filter-button"
              checked={levelsSelected.includes(f)}
              data-item={f}
              onChange={this.toggleLevel}
            />
            {f}
          </label>
        </div>
      );
    });

    return (
      <div className="inner-container-subject-table">
        <div className="subject-search">
          <input
            id="filter"
            name="filter"
            type="text"
            placeholder="tast inn kode eller navn"
            onChange={(event) => this.filterSubjects(event.target.value)}
          />
        </div>

        <table className="subject-table">
          <thead>
            <tr>
              <th
                id="th1"
                style={trStyle2("code")}
                data-item={"code"}
                onClick={this.setSubjectSort}
              >
                kode
              </th>
              <th
                id="th2"
                style={trStyle2("title")}
                data-item={"title"}
                onClick={this.setSubjectSort}
              >
                navn
              </th>
              <th
                id="th3"
                style={trStyle2("semester")}
                data-item={"semester"}
                onClick={this.setSubjectSort}
              >
                semester
              </th>
            </tr>
          </thead>

          <tbody>{tableBodyContent}</tbody>

          <tfoot>
            <button
              className="subject-button"
              // data-item={visibleSubjects}
              onClick={this.clearSubjects}
            >
              nullstill
            </button>
          </tfoot>

          {/* <div style={{ display: "block" }}>{data}</div> */}

          {/* <div className="subject-table-options">
          </div> */}
        </table>
      </div>
    );
  }
}

export default Subjects;

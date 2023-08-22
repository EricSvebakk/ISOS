import React, { Component } from "react";
// import Subjects from "./Subjects";
// import { SubjectContainer } from "./SubjectContainer";

class SubjectManager extends Component {
  selectSubject = (e) => {
    const {
      subjectsVisible,
      subjectsSelected,
      setSubjectsSelected,
    } = this.state;

    const { forceGraphUpdater } = this.props;

    const dataItem = e.currentTarget.getAttribute("data-item");
    const temp = subjectsVisible.filter((a) => a.code === dataItem)[0];

    let newSubjectsSelected = [];

    if (!subjectsSelected.includes(temp)) {
      const resultPrereqCodes = this.selectPrereq([temp]);
      const resultPrereqs = resultPrereqCodes.filter(
        (n) => !subjectsSelected.includes(n)
      );
      const resultUniquePrereqs = [...new Set(resultPrereqs)];

      newSubjectsSelected = [...subjectsSelected, ...resultUniquePrereqs];
    } else {
      newSubjectsSelected = subjectsSelected.filter((sub) => sub !== temp);
    }

    this.setState({
      subjectsSelected: newSubjectsSelected,
    });

    setSubjectsSelected(newSubjectsSelected);
    forceGraphUpdater();
  };

  selectPrereq = (nodeList) => {
    const { subjectsAll } = this.state;

    let result = [...nodeList];

    for (const node of nodeList) {
      let nodeUsed = node;

      if (nodeUsed.msubs != null) {
        let rec = subjectsAll.filter((n) => nodeUsed.msubs.includes(n.id));
        result = [...result, ...this.selectPrereq(rec)];
      }

      if (nodeUsed.rsubs != null) {
        let rec = subjectsAll.filter((n) => nodeUsed.rsubs.includes(n.id));
        result = [...result, ...this.selectPrereq(rec)];
      }
    }

    return result;
  };

  clearSubjectSelection = () => {
    this.setState({
      subjectsSelected: [],
    });
  };
  
  constructor(props) {
    super(props);

    this.state = {
      subjectsAll: props.subjectsAll,
      subjectsVisible: props.subjectsAll,
      subjectsSelected: [],
      
      setSubjectsSelected: props.setSubjectsSelected,
    };
  }

  render() {
    const { subjectsAll, subjectsVisible, subjectsSelected, subjectLevelsSelected } = this.state;

    const c1 = { width: "10%" };
    const c2 = { width: "40%" };
    const c3 = { width: "15%" };
    const c4 = { width: "10%" };
    // const c5 = { width: "15%" };

    const theadData = (
      <tr>
        <th style={c1} data-item={"code"} id="th1">
          code
        </th>
        <th style={c2} data-item={"title"}>
          title
        </th>
        <th style={c4} data-item={"points"}>
          points
        </th>
        <th style={c3} data-item={"semester"}>
          semester
        </th>
        {/* <th style={c5} data-item={"priority"}>
          priority
        </th> */}
      </tr>
    );

    const tbodyData = subjectsVisible.map((row) => {
      const isSelected = subjectsSelected.map((d) => d.id).includes(row.id);
      const semRow =
        row.semester === null ? (
          <td style={c3} data-item={row.code}>
            {"utilgjengelig"}
          </td>
        ) : (
          <td style={c3} data-item={row.code}>
            {row.semester}
          </td>
        );

      return (
        <tr key={row.id} style={trStyle(isSelected, row)}>
          <td style={c1}>
            <a
              style={{ color: "black" }}
              href={link(row.code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.code}
            </a>
          </td>
          <td style={c2} data-item={row.code} onClick={this.selectSubject}>
            {row.title}
          </td>
          <td style={c4} data-item={row.code} onClick={this.selectSubject}>
            {row.points}
          </td>
          {semRow}
          {/* <td style={c5} data-item={row.code} onClick={this.selectSubject}>
            {row.requires != null ? row.requires.join(", ") : ""}
          </td> */}
        </tr>
      );
    });

    // elements
    return (
      <div className="outer-outer">
        <div className="subject-search">
          <input
            id="filter"
            name="filter"
            type="text"
            placeholder="tast inn kode eller navn"
            onChange={(event) => this.filterSubjects(event.target.value)}
          />
        </div>

        <div className="inner-container-subject-table">
          <div>
            {/* search */}
            <div></div>

            {/* table */}
            <table className="subject-table">
              <thead>{theadData}</thead>
              <tbody>{tbodyData}</tbody>
              <div className="subject-tfoot">
                <button
                  className="subject-button"
                  // data-item={visibleSubjects}
                  onClick={this.clearSubjectSelection}
                >
                  nullstill
                </button>
              </div>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default SubjectManager;


const trStyle = (pred, sub) => {
  return {
    // backgroundColor: c,
    filter: "brightness(" + (pred ? "80" : "100") + "%)",
  };
};

const link = (code) => "https://www.uio.no/studier/emner/matnat/ifi/" + code + "/index.html";
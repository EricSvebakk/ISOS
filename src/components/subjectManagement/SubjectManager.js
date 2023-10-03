import React, { Component } from "react";
// import Subjects from "./Subjects";
// import { SubjectContainer } from "./SubjectContainer";

class SubjectManager extends Component {
  
  selectSubject = (e) => {
    
    const { subjectsSelected } = this.state;
    const { subjectsVisible, setSubjectsSelected, forceGraphUpdater } = this.props;

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
    const { forceGraphUpdater } = this.props;
    
    this.setState({
      subjectsSelected: [],
    });
    
    forceGraphUpdater();
  };

  filterSubjects = (e) => {
    const { subjectsAll } = this.state;
    const { setSubjectsVisible } = this.props;
    
    let newSubjectsVisible = subjectsAll.filter(
      (node) =>
        node.code.toLowerCase().includes(e.toLowerCase()) ||
        node.title.toLowerCase().includes(e.toLowerCase())
    );
    
    // console.log(e, newSubjectsVisible);
    
    setSubjectsVisible(newSubjectsVisible)
    // this.setState({
    //   subjectsVisible: newSubjectsVisible,
    // });
  };
  
  setSorting = (e) => {
    const dataItem = e.currentTarget.getAttribute("data-item");
    
    // console.log("ss", dataItem)
    
    this.setState({
      sortBy: dataItem,
    });
  }
  
  constructor(props) {
    super(props);

    this.state = {
      subjectsAll: props.subjectsAll,
      subjectsSelected: [],
      // subjectsVisible: props.subjectsVisible,
      setSubjectsSelected: props.setSubjectsSelected,
      sortBy: "code"
    };
  }

  render() {
    const { subjectsSelected, sortBy } = this.state;
    const { subjectsVisible, checkBoxes } = this.props;

    const c1 = { width: "10%" };
    const c2 = { width: "40%" };
    const c3 = { width: "15%" };
    const c4 = { width: "10%" };

        
    const sorted = subjectsVisible.sort((a, b) => {
      switch (sortBy) {
        case "code":
          return a.code.localeCompare(b.code);
        case "title":
          return a.title.localeCompare(b.title);
        case "points":
          return b.points - a.points;
        case "semester":
          if (a.semester != null && b.semester != null) {
          } else if (a.semester != null) {
            return 1;
          } else if (b.semester != null) {
            return -1;
          }
          return a.semester.localeCompare(b.semester);
        case "priority":
          // console.log(a.requires, b.requires);
          let reqA = a.requires !== null ? a.requires : [""];
          let reqB = b.requires !== null ? b.requires : [""];

          let resA = reqA.sort().join();
          let resB = reqB.sort().join();

          return resB.localeCompare(resA);
        default:
          return 0;
      }
    });
    
    const theadData = (
      <tr>
        <th style={c1} onClick={this.setSorting} data-item={"code"} id="th1">kode</th>
        <th style={c2} onClick={this.setSorting} data-item={"title"}>tittel</th>
        <th style={c4} onClick={this.setSorting} data-item={"points"}>poeng</th>
        <th style={c3} onClick={this.setSorting} data-item={"semester"}>semester</th>
        {/* <th style={c5} data-item={"priority"}>
          priority
        </th> */}
      </tr>
    );

    const tbodyData = sorted.map((row) => {
      const isSelected = subjectsSelected.map((d) => d.id).includes(row.id);
      const semRow =
        row.semester === null
        ? (<td style={c3} data-item={row.code}>{"utilgjengelig"}</td>)
        : (<td style={c3} data-item={row.code}>{row.semester}</td>);

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

    // const stuff = subjectsVisible.length;
    
    // elements
    return (
      <div className="outer-outer">
        <div className="inner-container-subject-table">
          <div>
            {/* search */}
            <div></div>

            {/* table */}
            <table className="subject-table">
              <thead>{theadData}</thead>
              <tbody>{tbodyData}</tbody>
            </table>
          </div>
        </div>

        <div className="subject-tfoot">
          <button
            className="subject-button"
            // data-item={visibleSubjects}
            onClick={this.clearSubjectSelection}
          >
            fjern valg
          </button>
          {/* <p>{stuff}</p> */}
          <input
            id="filter"
            name="filter"
            type="text"
            placeholder="søk kode/tittel"
            onChange={(event) => this.filterSubjects(event.target.value)}
          />
          {/* <div
          style={{
            width: "auto",
            display: "inline-block",
          }}
          >
            
          </div> */}
          <div
            style={{
              display: "inline-block",
              float: "right",
              margin: "10px"
              // left: "auto"
            }}
            >
            {checkBoxes}
          </div>
        </div>

        {/* <div className="subject-search">
          <div
            style={{
              // height:"50px",
              width: "50%",
              backgroundColor: "brown",
              marginTop: "10px",
            }}
          >
            Show
          </div>
        </div> */}
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
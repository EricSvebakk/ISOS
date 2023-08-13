import { Component } from "react";
import Subjects from "./Subjects";
// import { SubjectContainer } from "./SubjectContainer";

class SubjectManager extends Component {
  
  selectSubject = (e) => {};
  selectPrereq = (e) => {};
  clearSubject = (e) => {};
  
  
  constructor(props) {
    super(props);

    this.state = {
      subjects: props.subjects,

      subjectsVisible: props.subjects,
      setSubjectsVisible: null,

      setSubjectsSelected: null,

      forceGraphUpdater: null,
    };
  }

  render() {
    
    const {
      
    } = this.props;
    
    
  	const theadData = null;
    const tbodyData = null;

    // elements
    return (
      <>
        <div>
          {/* search */}
          <div></div>

          {/* table */}
          <table>
            <thead>{theadData}</thead>
            <tbody>{tbodyData}</tbody>
          </table>
        </div>
      </>
    );
  }
}

function selectSubject(nodeElement, subsVisible, subsSelected, FGUpdater) {

  const node = nodeElement.currentTarget.getAttribute("data-item");
  const temp = subsVisible.filter((a) => a.code === node)[0];

  if (!subsSelected.includes(temp)) {
    const result = selectPrereq([temp]);
    const result2 = result.filter((n) => !subsSelected.includes(n));
    const result3 = [...new Set(result2)];

    let result4 = [...result3];

	return [...subsSelected, ...result4]	
  }
  
  else {
	return subsSelected.filter((sub) => sub !== temp)
  }
  
  FGUpdater();
}

// helper-function for selectSubject()
function selectPrereq(nodeList) {
  const { allNodes } = this.state;

  let result = [...nodeList];

  for (const node of nodeList) {

    let nodeUsed = node;

    if (nodeUsed.msubs != null) {
      let rec = allNodes.filter((n) => nodeUsed.msubs.includes(n.id));
      result = [...result, ...this.toggleSubjectRecursive(rec)];
    }

    if (nodeUsed.rsubs != null) {
      let rec = allNodes.filter((n) => nodeUsed.rsubs.includes(n.id));
      result = [...result, ...this.toggleSubjectRecursive(rec)];
    }

  }

  return result;
};
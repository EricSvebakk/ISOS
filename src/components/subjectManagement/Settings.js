// import React, { Component } from "react";

// class Settings extends Component {
	
//   // ========================================================
//   state = {
//     visibleSubjects: [],
//     filterSelected: ["bachelor", "master", "phd"],
//   };

//   // ========================================================
//   filterSubjects = (e) => {
//     const { filterSelected } = this.state;

//     const content = e.currentTarget.getAttribute("data-item");
//     let fs = filterSelected;

//     if (filterSelected.includes(content)) {
//       fs = fs.filter((s) => s !== content);
//       console.log("included! but removed!");
//     } else {
//       console.log("not included yet?");
//       fs = [...fs, content];
//     }

//     let changes = data.nodes;
//     console.log(fs, changes);

//     for (const f of fs) {
//       switch (f) {
//         case "bachelor":
//           changes = changes.filter(
//             (n) => parseInt(n.code[2]) > 0 && parseInt(n.code[2]) < 4
//           );
//           break;
//         case "master":
//           changes = changes.filter(
//             (n) => parseInt(n.code[2]) > 3 && parseInt(n.code[2]) < 9
//           );
//           break;

//         default:
//           console.log("what");
//           break;
//       }
//     }

//     console.log("cont", content, changes);

//     this.setState({
//       filterSelected: fs,
//       visibleSubjects: changes,
//     });
//   };

//   // ========================================================
//   render() {
//     const { filterFunction, filterSelected } = this.props;

//     // bachelor, master, PHD, autumn, spring

//     const stuff = ["bachelor", "master", "phd"];

//     const data = stuff.map((f) => {
//       return (
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               className="filter-button"
//               checked={filterSelected.includes(f)}
//               data-item={f}
//               onChange={filterFunction}
//             />
//             {f}
//           </label>
//         </div>
//       );
//     });

//     return <div style={{ display: "block" }}>{data}</div>;
//   }
// }

// export default Settings;

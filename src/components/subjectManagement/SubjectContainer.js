import SubjectManager from "./SubjectManager";

export function SubjectContainer({
	subjects,
	setSubjects,
	forceGraphUpdater
	// stuff
	// function for sending nodesSelected back
	// function for sending nodesVisible back
}) {
	
	selectSubjectWrapper = (e) => {
		selectSubject(e, )
	};
	
	const containerRef = React.useRef(null);
	let nodes = null;
	
	// 
	const theadData = null;
	const tbodyData = null;
	
	return (
		<>
			<div>
				{/* search */}
				<div>
					
				</div>
				
				{/* table */}
				<table>
					<thead>
						
					</thead>
					
					<tbody>
						
					</tbody>
				</table>
			</div>
		</>
	);
}
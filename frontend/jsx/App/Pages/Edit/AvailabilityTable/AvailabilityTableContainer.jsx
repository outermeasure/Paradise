import { connect, } from "react-redux";
import View from "./AvailabilityTableView";

const mapStateToProps = (
	_,
	{ table, onTableChange, lastColumn, onLastColumnChange, }
) => {
	return {
		table,
		onTableChange,
		lastColumn,
		onLastColumnChange,
	};
};

export default connect(mapStateToProps)(View);

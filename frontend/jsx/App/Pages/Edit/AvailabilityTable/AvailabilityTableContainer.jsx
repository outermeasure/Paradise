import { connect, } from "react-redux";
import View from "./AvailabilityTableView";

const mapStateToProps = (_, { table, onTableChange, }) => {
	return {
		table,
		onTableChange,
	};
};

export default connect(mapStateToProps)(View);

import React from "react";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";

function SimpleTable({ table, onTableChange, }) {
	const onEditValue = (row, column) => ({ target: { value, }, }) => {
		const newTable = cloneDeep(table);
		newTable[row][column] = value;
		onTableChange(newTable);
	};
	const addRow = () => {
		const newTable = cloneDeep(table);
		newTable.push(newTable[0].map(() => ""));
		onTableChange(newTable);
	};

	const addColumn = () => {
		const newTable = cloneDeep(table);
		newTable.forEach((row) => {
			row.push("");
		});
		onTableChange(newTable);
	};

	const removeRow = () => {
		if (table.length <= 1) {
			return;
		}
		const newTable = cloneDeep(table);
		newTable.pop();
		onTableChange(newTable);
	};

	const removeColumn = () => {
		if (table[0].length <= 1) {
			return;
		}
		const newTable = cloneDeep(table);
		newTable.forEach((row) => {
			row.pop();
		});
		onTableChange(newTable);
	};

	return (
		<div className="availability-table">
			Tabel Disponibilitate
			<div className="availability-table-paper">
				<table className="availability-table-table">
					<thead className="availability-table-thead">
						<tr className="availability-table-thead-tr">
							{table[0].map((value, index) => {
								if (index <= 1) {
									return (
										<th
											className="availability-table-th"
											key={index}
											scope="col"
										>
											<input
												type="text"
												value={value}
												onChange={onEditValue(0, index)}
											/>
										</th>
									);
								}
								return (
									<th
										className="availability-table-th right"
										key={index}
										scope="col"
									>
										<input
											type="text"
											value={value}
											onChange={onEditValue(0, index)}
										/>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className="availability-table-tbody">
						{table.slice(1).map((row, rowIndex) => {
							return (
								<tr className="availability-table-tbody-tr" key={rowIndex}>
									{row.map((value, index) => {
										if (index <= 1) {
											return (
												<th
													className="availability-table-th-row"
													scope="row"
													key={index}
												>
													<input
														type="text"
														value={value}
														onChange={onEditValue(rowIndex + 1, index)}
													/>
												</th>
											);
										}
										return (
											<td className="availability-table-td right" key={index}>
												<input
													type="text"
													value={value}
													onChange={onEditValue(rowIndex + 1, index)}
												/>
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<button type="button" className="primary" onClick={addRow}>
				Adauga linie
			</button>
			&nbsp;
			<button type="button" className="primary" onClick={addColumn}>
				Adauga coloana
			</button>
			<br />
			<button type="button" className="accent" onClick={removeColumn}>
				Sterge ultima coloana
			</button>
			&nbsp;
			<button type="button" className="accent" onClick={removeRow}>
				Sterge ultima linie
			</button>
		</div>
	);
}

SimpleTable.propTypes = {
	table: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
	onTableChange: PropTypes.func.isRequired,
};

export default SimpleTable;

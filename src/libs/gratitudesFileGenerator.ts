import { Document, ISectionOptions, Packer, Paragraph, Table, TableCell, TableRow, VerticalAlign } from "docx";

const ROW_SIZE = 3;

export const generateGratitudesFile = async (gratitudesInput: string): Promise<string> => {
	const gratitudes = gratitudesInput.split("\n");

	const gratitudeCells = gratitudes.map(
		(g) => new TableCell({ children: [new Paragraph(g)], verticalAlign: VerticalAlign.CENTER }),
	);
	const gratitudeRows: Array<TableRow> = [];
	let rowCells: Array<TableCell> = [];
	for (let i = 0; i < gratitudeCells.length; i++) {
		rowCells.push(gratitudeCells[i]);

		if (i % ROW_SIZE === ROW_SIZE - 1 || i === gratitudeCells.length - 1) {
			gratitudeRows.push(new TableRow({ children: rowCells }));
			rowCells = [];
		}
	}
	const gratitudeTable = new Table({
		rows: gratitudeRows,
	});
	const gratitudesSection: ISectionOptions = {
		children: [gratitudeTable],
		properties: { page: { ...pageStyles } },
	};

	const gratitudesFile = new Document({ sections: [gratitudesSection] });
	return await Packer.toBase64String(gratitudesFile);
};

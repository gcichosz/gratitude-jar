import {
	AlignmentType,
	Document,
	HeightRule,
	ISectionOptions,
	Packer,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	VerticalAlign,
	WidthType,
} from "docx";

const ROW_SIZE = 3;
const A4_DXA_WIDTH = 11906;
const A4_DXA_HEIGHT = 16838;

const pageStyles = {
	margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const generateGratitudesFile = async (gratitudesInput: string): Promise<string> => {
	const gratitudes = gratitudesInput.split("\n");

	const gratitudeCells = gratitudes.map(
		(gratitude) =>
			new TableCell({
				children: [new Paragraph({ text: gratitude, alignment: AlignmentType.CENTER })],
				verticalAlign: VerticalAlign.CENTER,
				width: { size: A4_DXA_WIDTH / 3, type: WidthType.DXA },
			}),
	);
	const gratitudeRows: Array<TableRow> = [];
	let rowCells: Array<TableCell> = [];
	for (let i = 0; i < gratitudeCells.length; i++) {
		rowCells.push(gratitudeCells[i]);

		if (i % ROW_SIZE === ROW_SIZE - 1 || i === gratitudeCells.length - 1) {
			gratitudeRows.push(
				new TableRow({ children: rowCells, height: { rule: HeightRule.EXACT, value: A4_DXA_HEIGHT / 10 } }),
			);
			rowCells = [];
		}
	}
	const gratitudeTable = new Table({
		rows: gratitudeRows,
		columnWidths: [A4_DXA_WIDTH / 3, A4_DXA_WIDTH / 3, A4_DXA_WIDTH / 3],
	});
	const gratitudesSection: ISectionOptions = {
		children: [gratitudeTable],
		properties: { page: { ...pageStyles } },
	};

	const gratitudesFile = new Document({ sections: [gratitudesSection] });
	return await Packer.toBase64String(gratitudesFile);
};

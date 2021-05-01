import { resolve } from "path";
import PDFDocument from "pdfkit";
import { PassThrough, Readable } from "stream";

const COLUMNS = process.env.COLUMNS ? parseInt(process.env.COLUMNS, 10) : 3;
const ROWS = process.env.ROWS ? parseInt(process.env.ROWS, 10) : 10;
const FONT_SIZE = process.env.FONT_SIZE ? parseInt(process.env.FONT_SIZE, 10) : 16;
const DRAW_GRID = process.env.DRAW_GRID === "true";
const LONG_LINE_THRESHOLD = process.env.LONG_LINE_THRESHOLD ? parseInt(process.env.LONG_LINE_THRESHOLD, 10) : 35;

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const COLUMN_WIDTH = A4_WIDTH / COLUMNS;
const ROW_WIDTH = A4_HEIGHT / ROWS;
const TEXT_X_START = 0;
const TEXT_Y_START = ROW_WIDTH / 2;
const MAGIC_Y_OFFSET = FONT_SIZE / 2 + 2;

export const generateGratitudesFile = (gratitudesInput: string): Readable => {
	const gratitudes = gratitudesInput.split("\n");

	const stream = new PassThrough();
	const doc = new PDFDocument({ size: "A4", margin: 0 });
	doc.pipe(stream);
	doc.fontSize(FONT_SIZE);

	let textX = TEXT_X_START;
	let textY = TEXT_Y_START;
	for (let i = 0; i < gratitudes.length; i++) {
		const gratitude = gratitudes[i];
		const offsetY = Math.floor(gratitude.length / LONG_LINE_THRESHOLD) * MAGIC_Y_OFFSET;

		doc.font(resolve(__dirname, "Caveat-Regular.ttf")).text(gratitude, textX, textY - offsetY, {
			align: "center",
			baseline: "middle",
			width: COLUMN_WIDTH,
		});

		textX += COLUMN_WIDTH;

		if (i % COLUMNS === COLUMNS - 1) {
			textX = TEXT_X_START;
			textY += ROW_WIDTH;
		}

		const lastGratitudeOnPage = i % (ROWS * COLUMNS) === ROWS * COLUMNS - 1;
		const lastGratitude = i === gratitudes.length - 1;
		if (DRAW_GRID && (lastGratitudeOnPage || lastGratitude)) {
			drawGrid(doc);
		}

		if (lastGratitudeOnPage && !lastGratitude) {
			textY = TEXT_Y_START;
			doc.addPage();
		}
	}

	doc.end();

	return stream;
};

const drawGrid = (doc: PDFKit.PDFDocument) => {
	for (let i = 1; i < COLUMNS; i++) {
		doc.moveTo(COLUMN_WIDTH * i, 0)
			.lineTo(COLUMN_WIDTH * i, A4_HEIGHT)
			.lineWidth(1)
			.dash(5, { space: 10 })
			.stroke();
	}

	for (let i = 1; i < ROWS; i++) {
		doc.moveTo(0, ROW_WIDTH * i)
			.lineTo(A4_WIDTH, ROW_WIDTH * i)
			.lineWidth(1)
			.dash(5, { space: 10 })
			.stroke();
	}
};

import { resolve } from "path";
import PDFDocument from "pdfkit";
import { PassThrough, Readable } from "stream";

const FONT_SIZE = process.env.FONT_SIZE ? parseInt(process.env.FONT_SIZE, 10) : 16;
const CARD_WIDTH_MM = process.env.CARD_WIDTH_MM ? parseInt(process.env.CARD_WIDTH_MM, 10) : 70;
const CARD_HEIGHT_MM = process.env.CARD_HEIGHT_MM ? parseInt(process.env.CARD_HEIGHT_MM, 10) : 30;

const postScriptPointCoefficient = 2.83465;
const cardWidth = CARD_WIDTH_MM * postScriptPointCoefficient;
const cardHeight = CARD_HEIGHT_MM * postScriptPointCoefficient;
const margin = 5 * postScriptPointCoefficient;
const textOptions: PDFKit.Mixins.TextOptions = {
	align: "center",
	width: cardWidth - margin * 2,
};

export const generateGratitudesFile = (gratitudesInput: string): Readable => {
	const gratitudes = gratitudesInput.split("\n");

	const stream = new PassThrough();
	const doc = new PDFDocument({
		size: [cardWidth, cardHeight],
		margin: margin,
	});
	doc.pipe(stream);
	doc.fontSize(FONT_SIZE);
	doc.font(resolve(__dirname, "fonts/Caveat-Regular.ttf"));

	for (let i = 0; i < gratitudes.length; i++) {
		const gratitude = gratitudes[i];
		doc.text(
			gratitude,
			doc.x,
			doc.y + 0.5 * (cardHeight - margin * 2 - doc.heightOfString(gratitude, textOptions)),
			textOptions,
		);

		if (i < gratitudes.length - 1) {
			doc.addPage();
		}
	}

	doc.end();

	return stream;
};

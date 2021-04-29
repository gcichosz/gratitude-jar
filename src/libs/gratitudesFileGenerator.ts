import { resolve } from "path";
import PDFDocument from "pdfkit";
import { PassThrough, Readable } from "stream";

export const generateGratitudesFile = (gratitudesInput: string): Readable => {
	const gratitudes = gratitudesInput.split("\n");

	const stream = new PassThrough();
	const doc = new PDFDocument();
	doc.pipe(stream);
	for (const gratitude of gratitudes) {
		doc.font(resolve(__dirname, "Caveat-Regular.ttf")).text(gratitude);
	}
	doc.end();

	return stream;
};

const API_URL = "";

const generateFile = async (gratitudes) => {
	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ gratitudes }),
	});
	const responseData = await response.json();
	return responseData.downloadUrl;
};

const saveFile = (downloadUrl) => {
	const downloadAnchor = document.querySelector("a");
	downloadAnchor.href = downloadUrl;
	downloadAnchor.click();
};

const onButtonClicked = async () => {
	const gratitudes = document.querySelector("textarea").value;
	const downloadUrl = await generateFile(gratitudes);
	saveFile(downloadUrl);
};

const onDocumentLoaded = () => {
	document.querySelector("button").addEventListener("click", onButtonClicked);
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);

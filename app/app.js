const API_URL = "";

const generateFile = async (gratitudes) => {
	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(gratitudes),
	});
	const downloadUrl = await response.json();
	return downloadUrl;
};

const saveFile = (downloadUrl) => {
	const downloadAnchor = document.querySelector("a");
	downloadAnchor.href = downloadUrl;
	downloadAnchor.click();
};

const onButtonClicked = async (event) => {
	const gratitudes = document.querySelector("textarea").value;
	const button = event.target;

	button.disabled = true;
	button.textContent = "Generowanie...";

	const downloadUrl = await generateFile(gratitudes);
	saveFile(downloadUrl);

	button.disabled = false;
	button.textContent = "Wygeneruj plik";
};

const onDocumentLoaded = () => {
	document.querySelector("button").addEventListener("click", onButtonClicked);
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);

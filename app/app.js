function onButtonClicked() {
	const gratitudesInput = document.querySelector("textarea").value;
	console.log(gratitudesInput);
}

function onDocumentLoaded() {
	document.querySelector("button").addEventListener("click", onButtonClicked);
}

document.addEventListener("DOMContentLoaded", onDocumentLoaded);

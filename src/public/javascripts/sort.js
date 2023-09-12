import Sortable from '/javascripts/sortable.core.esm.js';

const listWithHandle = document.querySelector('div.listWithHandle');

Sortable.create(listWithHandle, {
	handle: 'img',
	animation: 150,
});

const convertButton = document.querySelector('a.convert');

convertButton.onclick = () => {
	const images = document.querySelectorAll('.item img');
	const loader = document.querySelector('span.loader');
	const convertText = document.querySelector('span.text');
	const downloadButton = document.querySelector('a.download');

	const filenames = [];

	for (let image of images) {
		filenames.push(image.dataset.name);
	}
	//activate loading animation
	loader.style.display = 'inline-block';
	convertText.style.display = 'none';

	fetch('/pdf', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(filenames),
	})
		.then((resp) => {
			return resp.text();
		})
		.then((data) => {
			//stop the loading animation
			loader.style.display = 'none';

			//display the convert and download button
			convertText.style.display = 'inline-block';
			downloadButton.style.display = 'inline-block';

			downloadButton.href = data;
		})
		.catch((error) => {
			console.error(error.message);
		});
};



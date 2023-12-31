import Sortable from '/javascripts/sortable.core.esm.js';

const listWithHandle = document.querySelector('.content__gallery');

Sortable.create(listWithHandle, {
	handle: 'img',
	animation: 150,
});

const convertButton = document.querySelector('.content__convert');
const newButton = document.querySelector('.content__new');
const downloadLink = document.querySelector('.content__link');

newButton.onclick = () => {
	window.location.href = '/new';
};

convertButton.onclick = () => {
	const images = document.querySelectorAll('.gallery-item__image');

	const filenames = [];
	for (let image of images) {
		filenames.push(image.dataset.name);
	}

	convertButton.setAttribute('loading', true);

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
			convertButton.removeAttribute('loading');
			downloadLink.href = data;
			downloadLink.click();
		})
		.catch((error) => {
			console.error(error.message);
		});
};

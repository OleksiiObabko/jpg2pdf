async function rotateImage(imgName) {
	try {
		const rotatedImgName = await fetch('/rotate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({imgName}),
		});

		return await rotatedImgName.json();
	} catch (error) {
		console.error('Error:', error);
	}
}

document.addEventListener('DOMContentLoaded', async function () {
	const rotateButtons = document.querySelectorAll('.gallery-item__rotate');
	const convertButton = document.querySelector('.content__convert');

	rotateButtons.forEach(button => {
		button.addEventListener('click', async function () {
			try {
				const parentDiv = this.closest('.gallery-item');
				const image = parentDiv.querySelector('.gallery-item__image');
				const imageName = image.getAttribute('data-name');

				parentDiv.setAttribute('loading', true);
				convertButton.setAttribute('loading', true);

				const rotatedImgName = await rotateImage(imageName);

				parentDiv.removeAttribute('loading');
				convertButton.removeAttribute('loading');

				image.setAttribute('src', `/images/${rotatedImgName}`);
				image.setAttribute('data-name', rotatedImgName);
			} catch (e) {
				console.log(e);
			}
		});
	});
});

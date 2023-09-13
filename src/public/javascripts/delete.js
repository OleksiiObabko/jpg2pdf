async function deleteImage(imgName) {
	try {
		await fetch('/del', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({imgName}),
		});
	} catch (error) {
		console.error('Error:', error);
	}
}

const convertButton = document.querySelector('.content__convert');
const downloadLink = document.querySelector('.content__link');
const newButton = document.querySelector('.content__new');
const deleteButtons = document.querySelectorAll('.gallery-item__delete');

deleteButtons.forEach(async button => {
	button.addEventListener('click', async function () {
		const parentDiv = this.closest('.gallery-item');
		const image = parentDiv.querySelector('.gallery-item__image');
		const imageName = image.getAttribute('data-name');

		try {
			parentDiv.setAttribute('loading', true);
			convertButton.setAttribute('loading', true);
			newButton.setAttribute('loading', true);

			await deleteImage(imageName);

			newButton.removeAttribute('loading');
			convertButton.removeAttribute('loading');
			convertButton.style.display = 'flex';
			downloadLink.style.display = 'none';
			parentDiv.remove();

			const gallery = document.querySelectorAll('.gallery-item');
			if (!gallery.length) {
				newButton.setAttribute('loading', true);
				window.location.href = '/new';
			}
		} catch (e) {
			console.log(e);
		}
	});
});

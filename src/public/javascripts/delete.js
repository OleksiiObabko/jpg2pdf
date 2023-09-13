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

document.addEventListener('DOMContentLoaded', function () {
	const deleteButtons = document.querySelectorAll('.gallery-item__delete');

	deleteButtons.forEach(async button => {
		button.addEventListener('click', async function () {
			const parentDiv = this.closest('.gallery-item');
			const image = parentDiv.querySelector('.gallery-item__image');

			const imageName = image.getAttribute('data-name');
			try {
				parentDiv.style.pointerEvents = 'none';
				await deleteImage(imageName);
				parentDiv.remove();

				convertButton.style.display = 'flex';
				downloadLink.style.display = 'none';

				const gallery = document.querySelectorAll('.gallery-item');
				if (!gallery.length) {
					window.location.href = '/new';
				}
			} catch (e) {
				console.log(e);
			}
		});
	});
});

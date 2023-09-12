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

document.addEventListener('DOMContentLoaded', function () {
	const deleteButtons = document.querySelectorAll('.delete');

	deleteButtons.forEach(async button => {
		button.addEventListener('click', async function () {
			const parentDiv = this.closest('.item');
			const image = parentDiv.querySelector('img');

			const imageName = image.getAttribute('data-name');
			try {
				parentDiv.style.pointerEvents = 'none';
				await deleteImage(imageName);
				parentDiv.remove();

				const gallery = document.querySelectorAll('.item');
				if (!gallery.length) {
					window.location.href = '/new';
				}
			} catch (e) {
				console.log(e);
			}
		});
	});
});

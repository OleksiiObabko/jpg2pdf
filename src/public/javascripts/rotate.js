async function rotateImage(imgName) {
	try {
		await fetch('/rotate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({imgName}),
		});
	} catch (error) {
		console.error('Error:', error);
	}
}

document.addEventListener('DOMContentLoaded', async function () {
	const rotateButtons = document.querySelectorAll('.gallery-item__rotate');
	rotateButtons.forEach(button => {
		button.addEventListener('click', async function () {
			const parentDiv = this.closest('.gallery-item');
			const image = parentDiv.querySelector('.gallery-item__image');

			let currentRotation = parseFloat(image.dataset.rotation) || 0;
			currentRotation += 90;

			const imageName = image.getAttribute('data-name');

			parentDiv.style.pointerEvents = 'none';
			parentDiv.style.opacity = 0.5;
			await rotateImage(imageName);
			parentDiv.style.transform = `rotate(${currentRotation}deg)`;
			image.dataset.rotation = currentRotation;
			parentDiv.style.pointerEvents = 'auto';
			parentDiv.style.opacity = 1;
		});
	});
});

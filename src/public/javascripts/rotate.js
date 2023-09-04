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

document.addEventListener('DOMContentLoaded', function () {
	const rotateButtons = document.querySelectorAll('.rotate');
	rotateButtons.forEach(async button => {
		button.addEventListener('click', function () {
			const parentDiv = this.closest('.item');
			const image = parentDiv.querySelector('img');

			let currentRotation = parseFloat(image.dataset.rotation) || 0;
			currentRotation += 90;

			const imageName = image.getAttribute('data-name');

			rotateImage(imageName).then(() => {
				image.style.transform = `rotate(${currentRotation}deg)`;
				image.dataset.rotation = currentRotation;
			});
		});
	});
});

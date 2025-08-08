window.addEventListener("keydown", (event) => {
  const planeController = window.playground?.planeController;
  const plane = planeController?.selectedPlane;
  if (!plane) return;

  switch (event.key) {
    case "ArrowUp":
      plane.planeDirectionX = 0;
      plane.planeDirectionY = -1;
      break;
    case "ArrowDown":
      plane.planeDirectionX = 0;
      plane.planeDirectionY = 1;
      break;
    case "ArrowLeft":
      plane.planeDirectionX = -1;
      plane.planeDirectionY = 0;
      break;
    case "ArrowRight":
      plane.planeDirectionX = 1;
      plane.planeDirectionY = 0;
      break;
    default:
      return;
  }
});

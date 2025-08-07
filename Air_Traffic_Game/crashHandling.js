export function checkCrash(firstPlane, secondPlane) {
  // Mittelpunkt-Koordinaten der beiden Flieger
  const firstPlaneX = firstPlane.planePositionX;
  const firstPlaneY = firstPlane.planePositionY;
  const secondPlaneX = secondPlane.planePositionX;
  const secondPlaneY = secondPlane.planePositionY;

  // Radius Berechnung anhand der Höhe der Kreise
  const firstPlaneRadius = firstPlane.planeElement.offsetHeight / 2;
  const secondPlaneRadius = secondPlane.planeElement.offsetHeight / 2;

  // Abstand zwischen den Mittelpunkten
  const deltaX = firstPlaneX - secondPlaneX;
  const deltaY = firstPlaneY - secondPlaneY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Crash, wenn Abstand kleiner/gleich Summe der Radien
  return distance <= firstPlaneRadius + secondPlaneRadius;
}

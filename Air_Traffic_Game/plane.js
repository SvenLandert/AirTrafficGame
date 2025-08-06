// Flugzeugobjekt erstellen
export class Plane {
  constructor(
    playgroundSize,
    playgroundMargin,
    flightNumber,
    startPositionX,
    startPositionY,
    planeTargetX,
    planeTargetY
  ) {
    this.playgroundSize = playgroundSize;
    this.playgroundMargin = playgroundMargin;
    this.flightNumber = flightNumber;
    this.startPositionX = startPositionX;
    this.startPositionY = startPositionY;
    this.planeTargetX = planeTargetX;
    this.planeTargetY = planeTargetY;
    this.planePositionX = startPositionX;
    this.planePositionY = startPositionY;
    this.isSelected = false;

    // DOM-Elemente
    this.planeElement = document.createElement("div");
    this.planeElement.className = "plane";

    // Unsichtbare, größere Klickfläche
    this.hitbox = document.createElement("div");
    this.hitbox.className = "plane-hitbox";
    this.planeElement.appendChild(this.hitbox); // hier wird die hitbox zum kind des planeElement und erbt dadurch den Klickevent

    this.label = document.createElement("span");
    this.label.className = "flightNumber";
    this.label.textContent = this.flightNumber;
    this.planeElement.appendChild(this.label);

    // Initiale Position setzen
    this.planeElement.style.left = this.planePositionX + "px";
    this.planeElement.style.top = this.planePositionY + "px";

    // Richtung
    const planeDirectionX = planeTargetX - startPositionX;
    const planeDirectionY = planeTargetY - startPositionY;
    this.planeDirectionX = Math.sign(planeDirectionX); // -1, 0, 1
    this.planeDirectionY = Math.sign(planeDirectionY); // -1, 0, 1
  }

  move() {
    // Flieger bewegt sich immer in die aktuelle Richtung
    this.planePositionX += this.planeDirectionX * this.planeSpeed;
    this.planePositionY += this.planeDirectionY * this.planeSpeed;
    this.planeElement.style.left = this.planePositionX + "px";
    this.planeElement.style.top = this.planePositionY + "px";
  }
}

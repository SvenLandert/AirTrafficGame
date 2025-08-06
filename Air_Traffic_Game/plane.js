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
    this.planeElement.appendChild(this.hitbox); // hier wird die hitbox zum child des planeElement und erbt dadurch den clickevent

    this.label = document.createElement("span");
    this.label.className = "flightNumber";
    this.label.textContent = this.flightNumber;
    this.planeElement.appendChild(this.label);

    // Initiale Position setzen
    this.planeElement.style.left = this.planePositionX + "px";
    this.planeElement.style.top = this.planePositionY + "px";

    // Richtung
    const planeDirectionX = planeTargetX - startPositionX; // Wie weit ist das Ziel vom Start in X-Richtung entfernt (+ = rechts, - = links)
    const planeDirectionY = planeTargetY - startPositionY; // Wie weit ist das Ziel vom Start in Y-Richtung entfernt (+ = unten, - = oben)
    this.planeDirectionX = Math.sign(planeDirectionX); // Math.sign gibt zurück ob der Wert negativ, positiv oder 0 ist. (-1 nach links, 0 keine Bewegung, 1 nach rechts)
    this.planeDirectionY = Math.sign(planeDirectionY); // Math.sign gibt zurück ob der Wert negativ, positiv oder 0 ist. (-1 nach oben, 0 keine Bewegung, 1 nach unten)
  }

  move() {
    this.planePositionX += this.planeDirectionX * this.planeSpeed; //X-Position +1/-1/0 * speed definiert die Bewegung in X-Position
    this.planePositionY += this.planeDirectionY * this.planeSpeed; //Y-Position +1/-1/0 * speed definiert die Bewegung in Y-Position
    //neue Position wir ins DOM gesetzt (Flugzeug an neuer Position angezeigt)
    this.planeElement.style.left = this.planePositionX + "px";
    this.planeElement.style.top = this.planePositionY + "px";
  }
}

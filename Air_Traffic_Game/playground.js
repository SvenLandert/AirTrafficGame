import { Plane } from "./plane.js";
import { PlaneController } from "./planeController.js";
import { Timer } from "./Timer.js";

// Definition der Intervalle und der verschiedenen Speeds
const PLANE_MOVE_INTERVAL_MS = 50;
const MIN_SPEED_SLOW = 10;
const MAX_SPEED_SLOW = 20;
const MIN_SPEED_FAST = 30;
const MAX_SPEED_FAST = 50;

// Definition der Timerwerten
let timer;

class Playground {
  constructor(playgroundSize, stepsGrid) {
    //im konstruktor wird unter anderem die Grösse des Spielfelds und die Anzahl Gitter definiert
    this.playgroundSize = playgroundSize;
    this.stepsGrid = stepsGrid;
    this.playgroundElement = document.getElementById("playground");
    this.numberRadarCircles = 5; // Anzahl der Kreise zentral festlegen

    this.maxSizeRadarCircles =
      (this.playgroundSize * this.numberRadarCircles) /
      (this.numberRadarCircles + 1); // größter Kreis zentral berechnen

    this.activePlanes = []; // leeres Array für die aktiven Flieger
    this.maxActivePlanes = 5; // Startwert der maximal aktiven Fliegern
    this.maxFastPlanes = 1; // Startwert der schnellen Flieger
    this.planeController = new PlaneController(this);

    this.remainingLives = 3;
    this.maxLives = 3;
    this.livesIcons = document.getElementById("lives-icons");

    this.createGrid(); //Zeichnet das Raster
    this.createRadarCircles(); //Zeichnet die Kreise vom Radar
    this.createRadarPointer(); // Zeiger erzeugen

    setInterval(() => this.addPlane(20), 2000); // alle 2 sek ein neues Flugzeug sofern Platz mit min 20Px Abstand zum Seitenrand
    /* setInterval(() => {
      //Erhöhung der max. Flieger und schnellen Flieger
      this.maxActivePlanes++;
      this.maxFastPlanes++;
    }, 60000); // jede Minute erhöhen
    setInterval(() => this.checkProximity(), PLANE_MOVE_INTERVAL_MS); //alles 50 mSek wird Nähe der aktiven Flieger geprüft*/
  }
  //TODO: aus Playground nehmen
  reset() {
    this.activePlanes.forEach((plane) => {
      if (plane.planeElement) {
        plane.planeElement.classList.remove("warning");
        plane.planeElement.remove();
      }
    });
  }
  //TODO: aus Playground nehmen
  updateLivesDisplay() {
    this.livesIcons.innerHTML = "";
    for (let index = 0; index < this.maxLives; index++) {
      if (index < this.remainingLives) {
        this.livesIcons.innerHTML +=
          '<img class="life-icon" src="./assets/airplane-svgrepo-com.svg">';
      } else {
        this.livesIcons.innerHTML +=
          '<img class="life-icon-crashed" src="./assets/airplane-mode-off-1407-svgrepo-com.svg">';
      }
    }
  }

  //TODO: Aus Playground nehmen
  //Generieren der Flugnummer
  generateFlightNumber() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nameAirline =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return nameAirline + randomNumber;
  }

  //Erstellung des Rasters des Radars
  createGrid() {
    Array.from({ length: this.stepsGrid - 1 }).forEach((_, index) => {
      const horizontalLine = document.createElement("div");
      horizontalLine.className = "horizontalLine";
      horizontalLine.style.top =
        ((index + 1) * this.playgroundSize) / this.stepsGrid + "px";
      horizontalLine.style.left = "0";
      this.playgroundElement.appendChild(horizontalLine);

      const verticalLine = document.createElement("div");
      verticalLine.className = "verticalLine";
      verticalLine.style.left =
        ((index + 1) * this.playgroundSize) / this.stepsGrid + "px";
      verticalLine.style.top = "0";
      this.playgroundElement.appendChild(verticalLine);
    });
  }

  //Erstellung der Kreise des Radars
  createRadarCircles() {
    const numberRadarCircles = this.numberRadarCircles;
    const maxSizeRadarCircles = this.maxSizeRadarCircles;
    for (let index = 1; index <= numberRadarCircles; index++) {
      // Schlaufe, welche durch die Anzahl Kreise läuft (for-schlaufe ist hier kürzer als ein Array zu erstellen und ein forEach zu machen)
      const radarCircle = document.createElement("div");
      radarCircle.className = "radarCircle";
      const sizeRadarCircle =
        (maxSizeRadarCircles / numberRadarCircles) * index; //Berechnung der Grösse des Kreises (Durchmesser)
      radarCircle.style.width = sizeRadarCircle + "px"; // Breite des Quadrats
      radarCircle.style.height = sizeRadarCircle + "px"; // Höhe des Quadrats
      this.playgroundElement.appendChild(radarCircle);
    }
  }

  //Erstellung des Zeigers
  createRadarPointer() {
    const radarPointer = document.createElement("div");
    radarPointer.id = "radarPointer";
    this.playgroundElement.appendChild(radarPointer);
    const maxSizeRadarCircles = this.maxSizeRadarCircles;
    radarPointer.style.height = maxSizeRadarCircles / 2 + "px"; //es wird der Radius des grössten Kreises berechnet, damit hat man die Länge des Zeigers
    let angleRadarPointer = 0; //Startwinkel des Zeigers (oben)

    setInterval(() => {
      //alle 20 mSec wird der Winkel des Zeigers um 0.5 Grad rotiert. Das translate ist dafür zuständig, dass der Zeiger über die Mitte des Feldes dreht
      angleRadarPointer = (angleRadarPointer + 0.5) % 360;
      radarPointer.style.transform = `translate(0%, -100%)rotate(${angleRadarPointer}deg)`;
    }, 20);
  }

  //TODO: aus Playground nehmen
  //Einsettzen des Fliegers
  addPlane(playgroundMargin) {
    // Abfrage wie viele Flieger aktiv sind und ob ein weiterer Flieger eingesetzt werden kann
    if (this.activePlanes.length >= this.maxActivePlanes) return;
    // generieren einer Zahl zwischen 0 und 3. Diese Zahl steht für eine Spielfeldkante
    const playgroundEdge = Math.floor(Math.random() * 4);

    // Ausrechnen der Einfügekoordinate (inkl. Abzug der Margin. Das sorgt dafür, dass die Flieger genau am Rand erscheinen und nicht darüberragen)
    let startPositionX, startPositionY;
    if (playgroundEdge === 0) {
      startPositionX = Math.random() * (this.playgroundSize - playgroundMargin);
      startPositionY = 0;
    } else if (playgroundEdge === 1) {
      startPositionX = this.playgroundSize - playgroundMargin;
      startPositionY = Math.random() * (this.playgroundSize - playgroundMargin);
    } else if (playgroundEdge === 2) {
      startPositionX = Math.random() * (this.playgroundSize - playgroundMargin);
      startPositionY = this.playgroundSize - playgroundMargin;
    } else {
      startPositionX = 0;
      startPositionY = Math.random() * (this.playgroundSize - playgroundMargin);
    }

    //Ausrechnen der Ziel-Koordinate (auch hier mit Berücksichtigung der Margin)
    const planeTargetX =
      Math.random() * (this.playgroundSize - playgroundMargin);
    const planeTargetY =
      Math.random() * (this.playgroundSize - playgroundMargin);

    //Zähler der schnellen Flieger
    const fastPlanesCount = this.activePlanes.filter(
      (plane) => plane.planeSpeed > MIN_SPEED_FAST
    ).length;

    //Definition der Geschwindigkeiten und dem Intervall
    const stepsPerSecond = 1000 / PLANE_MOVE_INTERVAL_MS;

    // Berechnung der Geschwindigkeit abhängig vom Zähler der schnellen Fliegern
    let planeSpeed;
    if (fastPlanesCount < this.maxFastPlanes) {
      const pxPerSec =
        Math.random() * (MAX_SPEED_FAST - MIN_SPEED_FAST) + MIN_SPEED_FAST;
      planeSpeed = pxPerSec / stepsPerSecond;
    } else {
      const pxPerSec =
        Math.random() * (MAX_SPEED_SLOW - MIN_SPEED_SLOW) + MIN_SPEED_SLOW;
      planeSpeed = pxPerSec / stepsPerSecond;
    }

    // erzeugen des neuen Flugzeugs mit allen Attributen
    const plane = new Plane(
      this.playgroundSize,
      playgroundMargin,
      this.generateFlightNumber(), //Zuweisung der zufällig generierten Flugnummer
      startPositionX,
      startPositionY,
      planeTargetX,
      planeTargetY
    );
    plane.planeSpeed = planeSpeed;

    // Definition der Sichtbarkeit am Start und am Ende
    plane.fadeIn = true;
    plane.fadeOut = false;

    // on Klick-Auswahl für den Flieger -> Übergabe an handleControl
    if (this.planeController) {
      plane.planeElement.onclick = () => {
        this.planeController.handleControl(plane);
      };
    }
    // Intervall mit der Bewegung
    plane.moveInterval = setInterval(() => {
      // move-Methode
      plane.move();
      // Berechnung des kleinsten Abstands zum Rand. Der kleinste Wert wird genommen
      let distToEdge = Math.min(
        plane.planePositionX,
        plane.planePositionY,
        this.playgroundSize - plane.planePositionX - playgroundMargin,
        this.playgroundSize - plane.planePositionY - playgroundMargin
      );
      //Steuert das Einblenden und Ausblenden des Fliegers
      if (plane.fadeIn) {
        if (distToEdge < playgroundMargin) {
          plane.planeElement.style.opacity =
            1 - (playgroundMargin - distToEdge) / playgroundMargin;
        } else {
          plane.planeElement.style.opacity = 1;
          plane.fadeIn = false;
        }
      }
      // wenn fadeOut nicht aktiv und der Flieger zu nahe ein einem Rand ist, stell auf fadeOut aktiv
      if (
        !plane.fadeOut &&
        (plane.planePositionX < playgroundMargin ||
          plane.planePositionX > this.playgroundSize - playgroundMargin ||
          plane.planePositionY < playgroundMargin ||
          plane.planePositionY > this.playgroundSize - playgroundMargin)
      ) {
        plane.fadeOut = true;
      }

      // Steuert das Verlassen des Flugzeug und entfernt es ( auch aus der Liste)
      if (plane.fadeOut) {
        let opacity = parseFloat(plane.planeElement.style.opacity); //holt die aktuelle Sichtbarkeit aus dem Style
        if (distToEdge < playgroundMargin) {
          //wenn sich der Flieger im Bereich der Margin befindet...
          opacity = Math.max(0, distToEdge / playgroundMargin); //stellt die Sichtbarkeit herunter (kann nie negativ sein)
          plane.planeElement.style.opacity = opacity;
        }
        if (opacity <= 0.01) {
          // wenn die Sichtbarkeit <=0.01 ist...
          plane.planeElement.remove(); //wird der Flieger aus dem DOM entfernt...
          clearInterval(plane.moveInterval); // der Bewegungsintervall gestoppt...
          const index = this.activePlanes.indexOf(plane); //Stelle des Fliegers im Array suchen, gibt den Index zurück, falls der Flieger nicht im array ist gibt indexOf den Wert -1 zurück
          if (index > -1) {
            //Prüfung ob Flieger im Array
            this.activePlanes.splice(index, 1); // der Flieger aus der aktiven liste gelöscht (Indexnummer und Anzahl an zu löschenden Stellen im Parameter)
          }
          if (this.planeController) this.planeController.renderPanels();
        }
      }
    }, PLANE_MOVE_INTERVAL_MS);
    this.activePlanes.push(plane); // das neue Flugzeug wird zur Liste der aktuellen Flieger hinzugefügt
    this.playgroundElement.appendChild(plane.planeElement); //der Flieger wird ins DOM eingefügt, damit es sichtbar wird
    if (this.planeController) this.planeController.renderPanels(); // der Flieger wird im Panel angezeigt
  }

  //TODO: aus Playground nehmen
  //Annäherungswarnsystem
  checkProximity() {
    const warningPlanesTooClose = new Set(); // neues leeres Set für die Flieger welche zu nah sind

    for (
      //Schleife durch alle Flieger beginnend bei Index 0
      let firstPlaneIndex = 0;
      firstPlaneIndex < this.activePlanes.length; // Schleife läuft durch bis jedes Flugzeug mal firstPlane war
      firstPlaneIndex++ //nach jedem Durchlauf wird der Index erhöht
    ) {
      for (
        let secondPlaneIndex = firstPlaneIndex + 1; // diese Schleife startet immer +1 von der ersten, so wird verhindert, dass jedes Paar doppelt geprüft wird
        secondPlaneIndex < this.activePlanes.length; //Schlaufe läuft bis zum letzten Flieger im Array
        secondPlaneIndex++ //Erhöhung des Index
      ) {
        const firstPlane = this.activePlanes[firstPlaneIndex]; //Flieger 1 wird genommen
        const secondPlane = this.activePlanes[secondPlaneIndex]; //Flieger 2 wird genommen

        const deltaX = firstPlane.planePositionX - secondPlane.planePositionX; // Berechnung der Distanz X
        const deltaY = firstPlane.planePositionY - secondPlane.planePositionY; // Berechnung der Distanz Y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Satz des Pythagoras für die Direktdistanz zwischen den Fliegern

        if (distance < 80) {
          // wenn die Distanz kleiner als 80px ist...
          warningPlanesTooClose.add(firstPlane);
          warningPlanesTooClose.add(secondPlane);
        }
      }
    }
    this.activePlanes.forEach((plane) => {
      //jedes aktive Flugzeug wird geprüft,
      if (warningPlanesTooClose.has(plane)) {
        // ob es im Set ist
        plane.planeElement.classList.add("warning"); // wenn ja kommt die CSS-Klasse warning zum Einsatz
      } else {
        plane.planeElement.classList.remove("warning"); // // sonst wird die Klasse entfernt
      }
    });
    if (warningPlanesTooClose.size > 0) {
      //wenn mindestens ein Paar zu Nahe ist
      this.playgroundElement.classList.add("danger"); //kommt die CSS-Klasse danger zum Einsatz
    } else {
      this.playgroundElement.classList.remove("danger"); // sonst wird die Klasse entfernt
    }

    if (this.planeController) this.planeController.renderPanels(); //Falls ein Controller existiert, wird das Panel aktualisiert, damit der aktuelle Status angezeigt wird.
  }
}

window.onload = function () {
  const timerElement = document.getElementById("timer-display");
  timer = new Timer(timerElement);
  const playground = new Playground(800, 10); //Definition der Grösse und der Anzahl Felder im Raster
  playground.updateLivesDisplay(); // Lebensanzeige initial anzeigen
  timer.startTimer();
  window.playground = playground;
};

document.getElementById("restart-btn").addEventListener("click", () => {
  window.playground.reset();
  timer.resetTimer();
});

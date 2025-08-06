// Panel-Klasse für die Anzeige in der Liste
class PlanePanel {
  constructor(plane, onControl, isSelected = false) {
    this.plane = plane;
    this.panelElement = document.createElement("div");
    this.panelElement.className = "plane-panel";
    if (isSelected) this.panelElement.classList.add("selected");
    this.panelElement.textContent = plane.flightNumber; // Flugnummer wird im Panel angezeigt
    this.panelElement.addEventListener("click", () => console.log("aaaaa"));
    //this.panelElement.onclick = () => console.log("eee"); //onControl(plane);
  }
}

class PlaneController {
  constructor(playground) {
    this.playground = playground;
    this.selectedPlane = null;
    this.panels = [];
    this.panelContainer = document.getElementById("plane-list");
  }

  handleControl(plane) {
    this.selectedPlane = plane;
    this.renderPanels();
  }

  syncPlaneElementClicks() {
    this.playground.activePlanes.forEach((plane) => {
      if (plane.planeElement) {
        plane.planeElement.onclick = () => {
          this.handleControl(plane);
        };
      }
    });
  }

  renderPanels() {
    if (!this.panelContainer) return;
    this.panelContainer.innerHTML = "";
    this.panels = [];
    const isDanger =
      this.playground.playgroundElement.classList.contains("danger");

    this.playground.activePlanes.forEach((plane, idx) => {
      const isSelected = this.selectedPlane === plane;
      const isWarning = plane.planeElement.classList.contains("warning");
      const panel = new PlanePanel(
        plane,
        this.handleControl.bind(this),
        isSelected
      );
      panel.panelElement.id = "plane-panel-" + idx;

      /* panel.panelElement.addEventListener("click", () => {
        alert("Panel clicked!"); // Nur zum Testen, später entfernen!
        this.handleControl(plane); // Das ist die eigentliche Steuerung
      });*/

      panel.panelElement.classList.remove(
        "warning",
        "selected-warning",
        "selected"
      );
      if (plane.planeElement) {
        plane.planeElement.classList.remove(
          "warning",
          "selected-warning",
          "selected"
        );
      }

      if (isWarning && isSelected && isDanger) {
        panel.panelElement.classList.add("selected-warning");
        plane.planeElement.classList.add("selected-warning");
      } else if (isWarning) {
        panel.panelElement.classList.add("warning");
        plane.planeElement.classList.add("warning");
      } else if (isSelected) {
        panel.panelElement.classList.add("selected");
        plane.planeElement.classList.add("selected");
      }

      this.panels.push(panel);
      panel.panelElement.addEventListener("click", () => console.log("aaaaa"));
      this.panelContainer.appendChild(panel.panelElement);
    });

    this.syncPlaneElementClicks();
  }
}

export { PlaneController };

// Panel-Klasse für die Anzeige in der Liste
class PlanePanel {
  constructor(plane, onControl, isSelected = false) {
    this.plane = plane;
    this.panelElement = document.createElement("div");
    this.panelElement.className = "plane-panel";
    this.panelElement.id = "plane-panel-" + plane.flightNumber;
    if (isSelected) this.panelElement.classList.add("selected");
    this.panelElement.textContent = plane.flightNumber; // Flugnummer wird im Panel angezeigt
    this.panelElement.addEventListener("click", () => {
      console.log("aaaaa", plane.flightNumber);
      plane.setSelected();
    });
    //this.panelElement.onclick = () => console.log("eee"); //onControl(plane);
  }
}

class PlaneController {
  constructor(playground) {
    this.playground = playground;
    this.selectedPlane = null; // kein Flieger gewählt
    this.panels = []; // leeres Panel-Array
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

    this.playground?.activePlanes?.forEach((plane, idx) => {
      console.log("XXXXXXX", plane);
      console.log("YYYY", this.selectedPlane);
      const isSelected =
        this.selectedPlane?.flightNumber === plane.flightNumber;
      const isWarning = plane.planeElement.classList.contains("warning");
      const panel = new PlanePanel(
        plane,
        this.handleControl.bind(this),
        isSelected
      );

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

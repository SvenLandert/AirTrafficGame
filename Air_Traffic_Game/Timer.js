const timerIntervall = 100; //Intervall für die Aktualisierung der Zeit in ms (100ms = Zehntelsekunden)
class Timer {
  constructor(timerElement) {
    this.timerElement = timerElement;
  }

  //startet den Timer
  startTimer() {
    this.startTime = Date.now(); //speichert den Startzeitpunkt in Milisekunden
    this.interval = setInterval(() => this.updateDisplay(), timerIntervall); //aktualisiert die Anzeige
  }

  //Stoppt den Intervall
  stopTimer() {
    clearInterval(this.interval);
  }

  //setzt die Zeit zurück und aktualisiert die Anzeige sofort
  resetTimer() {
    this.startTime = Date.now();
    this.updateDisplay();
  }

  //Berechnet die vergangene Zeit seit dem Start
  updateDisplay() {
    const ms = Date.now() - this.startTime; //Berechnet die vergangene Zeit Seit start in ms
    const tenth = Math.floor(ms / 100) % 10; //Umwandlung in ZehntelSek (10% sorgt, dass der wert nie über 9 geht)
    const sec = Math.floor(ms / 1000) % 60; // Umwandlung in Sec (%60 sorgt, dass die Sek nie über 59 gehen)
    const min = Math.floor(ms / 60000); //Umwandlung in Min
    if (this.timerElement) {
      //Prüft ob das timerElement existiert
      // setzt die Anzeige ins entsprechende Format um (die Sekunden werden zu einem String, welcher immer zwei Stellen anzeigt, damit die Uhr auch richtig aussieht)
      this.timerElement.textContent = `${min}:${sec
        .toString()
        .padStart(2, "0")}.${tenth}`;
    }
  }
}

export { Timer };

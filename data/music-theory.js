(function () {
  const keyOrder = [
    { id: 'C', name: 'C', relativeMinor: 'Am', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], position: 0 },
    { id: 'G', name: 'G', relativeMinor: 'Em', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], position: 1 },
    { id: 'D', name: 'D', relativeMinor: 'Bm', notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'], position: 2 },
    { id: 'A', name: 'A', relativeMinor: 'F#m', notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'], position: 3 },
    { id: 'E', name: 'E', relativeMinor: 'C#m', notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'], position: 4 },
    { id: 'B', name: 'B', relativeMinor: 'G#m', notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'], position: 5 },
    { id: 'F#', name: 'F#', relativeMinor: 'D#m', notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'], position: 6 },
    { id: 'C#', name: 'C#', relativeMinor: 'A#m', notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'], position: 7 },
    { id: 'G#', name: 'G#', relativeMinor: 'E#m', notes: ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##'], position: 8 },
    { id: 'D#', name: 'D#', relativeMinor: 'B#m', notes: ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##'], position: 9 },
    { id: 'A#', name: 'A#', relativeMinor: 'Fm', notes: ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##'], position: 10 },
    { id: 'F', name: 'F', relativeMinor: 'Dm', notes: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'], position: 11 }
  ];

  const circleOfFifths = keyOrder.map((item) => item.id);

  const commonChords = [
    { id: 'C', symbol: 'C', label: 'ド', quality: 'major' },
    { id: 'G', symbol: 'G', label: 'ソ', quality: 'major' },
    { id: 'D', symbol: 'D', label: 'レ', quality: 'major' },
    { id: 'Am', symbol: 'Am', label: 'ラm', quality: 'minor' },
    { id: 'Em', symbol: 'Em', label: 'ミm', quality: 'minor' },
    { id: 'F', symbol: 'F', label: 'ファ', quality: 'major' },
    { id: 'Bm', symbol: 'Bm', label: 'シm', quality: 'minor' },
    { id: 'Dm', symbol: 'Dm', label: 'レm', quality: 'minor' }
  ];

  const tunings = [
    { id: 'standard', name: 'Standard', notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
    { id: 'drop-d', name: 'Drop D', notes: ['D', 'A', 'D', 'G', 'B', 'E'] },
    { id: 'open-g', name: 'Open G', notes: ['D', 'G', 'D', 'G', 'B', 'D'] }
  ];

  const voiceRanges = [
    { id: 'soprano', name: 'Soprano', low: 'C4', high: 'A5' },
    { id: 'alto', name: 'Alto', low: 'A3', high: 'F5' },
    { id: 'tenor', name: 'Tenor', low: 'B2', high: 'G5' },
    { id: 'bass', name: 'Bass', low: 'E2', high: 'C4' }
  ];

  const commonProgressions = {
    C: ['C', 'F', 'G', 'Am'],
    G: ['G', 'C', 'D', 'Em'],
    D: ['D', 'G', 'A', 'Bm'],
    A: ['A', 'D', 'E', 'F#m'],
    E: ['E', 'A', 'B', 'C#m']
  };

  const theory = {
    keys: keyOrder,
    circleOfFifths,
    commonChords,
    tunings,
    voiceRanges,
    commonProgressions
  };

  const helpers = {
    getKeyById(id) {
      return theory.keys.find((key) => key.id === id) || null;
    },
    getCircleOfFifths() {
      return theory.circleOfFifths.slice();
    },
    getRelativeMinor(keyId) {
      const key = this.getKeyById(keyId);
      return key ? key.relativeMinor : null;
    },
    getCommonChords() {
      return theory.commonChords.map((chord) => ({ ...chord }));
    },
    getTuning(id) {
      return theory.tunings.find((tuning) => tuning.id === id) || theory.tunings[0];
    },
    getVoiceRange(name) {
      return theory.voiceRanges.find((item) => item.name === name) || theory.voiceRanges[2];
    },
    getChordProgression(keyId) {
      return commonProgressions[keyId] || ['C', 'F', 'G', 'Am'];
    }
  };

  window.MUSIC_THEORY_DATA = theory;
  window.musicTheory = helpers;
})();

// Reset localStorage data and reload page
localStorage.removeItem('scoresTN3Settings');
localStorage.removeItem('scoresTN3GameState');
console.log('localStorage cleared!');
window.location.reload();

function search() {
  const term = document.getElementById('search').value;
  if (term) {
    alert(`Searching for: ${term}`);
  } else {
    alert('Please enter a service or doctor name.');
  }
}

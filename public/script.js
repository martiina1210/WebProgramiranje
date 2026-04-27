let sviFilmovi = [];
let kosarica = [];

fetch('netflix_titles.csv')
  .then(res => res.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });

    sviFilmovi = rezultat.data.map(film => ({
      title: film.title,
      year: Number(film.release_year),
      genre: film.listed_in,
      duration: film.duration,
      country: film.country?.split(',').map(c => c.trim()) || [],
      rating: Math.random() * 10 
    }));

    prikaziTablicu(sviFilmovi.slice(0, 50));
  });

function prikaziTablicu(filmovi) {
  const tbody = document.querySelector('#filmovi-tablica tbody');
  tbody.innerHTML = '';

  filmovi.forEach(film => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.year}</td>
      <td>${film.genre}</td>
      <td>${film.duration}</td>
      <td>${film.country.join(', ')}</td>
      <td>${film.rating.toFixed(1)}</td>
      <td><button onclick='dodajUKosaricu(${JSON.stringify(film)})'>Dodaj</button></td>
    `;

    tbody.appendChild(row);
  });
}

const slider = document.getElementById('filter-rating');
const ratingValue = document.getElementById('rating-value');

slider.addEventListener('input', () => {
  ratingValue.textContent = slider.value;
});

document.getElementById('filtriraj').addEventListener('click', () => {
  const genre = document.getElementById('filter-genre').value.toLowerCase();
  const year = parseInt(document.getElementById('filter-year').value);
  const country = document.getElementById('filter-country').value.toLowerCase();
  const rating = parseFloat(document.getElementById('filter-rating').value);

  const filtrirani = sviFilmovi.filter(film => {
    return (!genre || film.genre.toLowerCase().includes(genre)) &&
           (!year || film.year >= year) &&
           (!country || film.country.some(c => c.toLowerCase().includes(country))) &&
           (film.rating >= rating);
  });

  prikaziTablicu(filtrirani);
});

function dodajUKosaricu(film) {
  if (!kosarica.find(f => f.title === film.title)) {
    kosarica.push(film);
    osvjeziKosaricu();
  } else {
    alert("Već dodano!");
  }
}

function osvjeziKosaricu() {
  const potvrdiBtn = document.getElementById('potvrdi');

  if (kosarica.length === 0) {
    potvrdiBtn.style.display = 'none';
    } else {
    potvrdiBtn.style.display = 'block';
  }
  
  const lista = document.getElementById('lista-kosarice');
  lista.innerHTML = '';

  kosarica.forEach((film, index) => {
    const li = document.createElement('li');
    li.textContent = `${film.title} (${film.year}) - ${film.genre}`;;

    const btn = document.createElement('button');
    btn.textContent = 'X';
    btn.onclick = () => {
      kosarica.splice(index, 1);
      osvjeziKosaricu();
    };

    li.appendChild(btn);
    lista.appendChild(li);
  });

  document.getElementById('toggle-kosarica').textContent =
  `🛒 Košarica (${kosarica.length})`;

  document.getElementById('naslov-kosarice').textContent = 
  `Košarica (${kosarica.length})`;
}

document.getElementById('potvrdi').addEventListener('click', () => {
  if (kosarica.length === 0) {
    alert("Košarica je prazna!");
  } else {
    alert(`Uspješno ste dodali ${kosarica.length} filmova u svoju košaricu za vikend maraton!`);
    kosarica = [];
    osvjeziKosaricu();

    document.getElementById('kosarica').style.display = 'none';
  }
});

const toggleBtn = document.getElementById('toggle-kosarica');
const kosaricaDiv = document.getElementById('kosarica');

toggleBtn.addEventListener('click', () => {
  kosaricaDiv.style.display =
    kosaricaDiv.style.display === 'none' ? 'block' : 'none';
});
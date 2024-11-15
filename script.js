const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  volume = wrapper.querySelector(".word i"),
  infoText = wrapper.querySelector(".info-text"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  removeIcon = wrapper.querySelector(".search span");

let audio;

function displayData(result, word) {
  if (result.title) {
    // Display message when word not found
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try searching for another word.`;
  } else {
    wrapper.classList.add("active");
    const wordData = result[0];
    const definitions = wordData.meanings[0].definitions[0] || {};
    const phonetic = wordData.phonetics[0]?.text || "Not available";

    // Update content dynamically
    document.querySelector(".word p").innerText = wordData.word || word;
    document.querySelector(".word span").innerText = `${wordData.meanings[0].partOfSpeech || ""} /${phonetic}/`;
    document.querySelector(".meaning span").innerText = definitions.definition || "No definition found.";
    document.querySelector(".example span").innerText = definitions.example || "No example available.";
    audio = new Audio(wordData.phonetics[0]?.audio || "");

    // Synonyms handling
    if (!definitions.synonyms || definitions.synonyms.length === 0) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      definitions.synonyms.slice(0, 5).forEach((syn) => {
        synonyms.insertAdjacentHTML("beforeend", `<span onclick="search('${syn}')">${syn}, </span>`);
      });
    }
  }
}

function search(word) {
  fetchApi(word);
  searchInput.value = word;
}

function fetchApi(word) {
  wrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching for the meaning of <span>"${word}"</span>...`;

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => displayData(result, word))
    .catch(() => {
      infoText.innerHTML = `Error: Can't find the meaning of <span>"${word}"</span>. Please try again.`;
    });
}

// Event Listeners
searchInput.addEventListener("keyup", (e) => {
  const word = e.target.value.trim();
  if (e.key === "Enter" && word) {
    fetchApi(word);
  }
});

volume.addEventListener("click", () => {
  if (audio) {
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() => {
      volume.style.color = "#999";
    }, 800);
  }
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

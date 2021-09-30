const buildAllPhrases = (sentence) => {
  const splitSentence = sentence.split(" ");
  const phraseSize = splitSentence.length;
  const allPhrases = [];
  for (let i = phraseSize; i > 0; i--) {
    for (let y = 0; y + i <= phraseSize; y++) {
      const sliceedSplitSentence = splitSentence.slice(y, y + i);
      if (sliceedSplitSentence.length > 1) {
        allPhrases.push(splitSentence.slice(y, y + i));
      }
    }
  }
  return allPhrases.map((phrase) => phrase.join(" "));
};

const getRepetedSnippets = (sentences) => {
  const allPhrases = new Set();
  const repeatedPhrases = new Set();
  let phrases;
  sentences.forEach((phrase) => {
    phrases = buildAllPhrases(phrase);
    phrases.forEach((subPhrase) => {
      if (
        allPhrases.has(subPhrase) &&
        ![...repeatedPhrases].some((e) => e.includes(subPhrase))
      ) {
        repeatedPhrases.add(subPhrase);
      } else {
        allPhrases.add(subPhrase);
      }
    });
  });
  return [...repeatedPhrases];
};

module.exports = getRepetedSnippets;

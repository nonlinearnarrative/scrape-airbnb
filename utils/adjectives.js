module.exports = listing => {
  const adjectives = [];
  listing
    .sorted_reviews
    .filter(({ language, comments }) => (
      language === 'en' &&
      !/automated/.test(comments)
    ))
    .forEach(({ comments }) => {
      wordpos.getAdjectives(
        comments,
        words => adjectives.push(...words)
      );
    });
  console.log(adjectives.join(' & '));
}

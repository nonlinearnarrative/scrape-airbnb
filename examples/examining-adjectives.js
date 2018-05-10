const fs = require('fs-extra');
const listings = require('../utils/listings');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

let count = 0;
listings.forEach(listing => {
    listing
      .sorted_reviews
      .filter(({ language, comments }) => (
        language === 'en' &&
        !/automated/.test(comments)
      ))
      .forEach(({ comments }) => {
        wordpos.getAdjectives(comments, console.log);
        count++;
      });
  });
var amenities = require('./amenities.json');
for (var i = 0; i < 297; i++) {
  const amenity = amenities.find(
    amenity => {
      return amenity.id === i;
    }
  );
  if (amenity) {
    console.log(`${i} ${amenity.name}`)
  } else {
    console.log(`${i}`)
  }
}

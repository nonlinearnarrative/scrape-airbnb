const pointInPolygon = require('point-in-polygon');

module.exports = (neighbourhoods, { lat, lng }) => Object.keys(neighbourhoods)
  .find(id => pointInPolygon([lat, lng], neighbourhoods[id]));

var inside = require('point-in-polygon');

module.exports = ({ lat, lng }, polygonPoints) => inside([ lat, lng ], polygonPoints);
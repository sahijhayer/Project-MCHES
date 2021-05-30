var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  name_field: String,
  about_field: String,
  location_field: String,
  admissions_field: String,
  img:
  {
    data: Buffer,
    contentType: String
  }
});

module.exports = new mongoose.model('Image', imageSchema);

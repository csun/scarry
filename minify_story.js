var yaml = require('js-yaml');
var fs = require('fs');

function is_dict(val) {
  return val !== null && typeof val === 'object';
}

function update_dict(target, delta) {
  Object.keys(delta).forEach(function(key) {
    update_key(key, target, delta[key]);
  });
}

function update_key(key, dict, value) {
  if(key in dict && is_dict(dict[key]) && is_dict(value)) {
    update_dict(dict[key], value);
  }
  else if(key in dict) {
    console.log('ERROR: Trying to overwrite a value.');
    process.exit(1);
  }
  else {
    dict[key] = value;
  }
}



if(process.argv.length !== 4) {
  console.log('Usage: node minify_story.js <PARTS_FOLDER> <DESTINATION>');
  process.exit(0)
}

var parts_dir = process.argv[2];
var filenames = fs.readdirSync(parts_dir);
var output = process.argv[3];
var minified_dict = {};

filenames.forEach(function(name) {
  var loaded_yaml;
  try {
    if(name.slice(-5) === '.yaml') {
      loaded_yaml = yaml.safeLoad(fs.readFileSync(parts_dir + '/' + name));
    }
    else {
      return;
    }
  }
  catch(err) {
    console.log('Unable to load YAML from file ' + name);
    console.log(err.message);
    process.exit(1);
  }

  update_dict(minified_dict, loaded_yaml)
});

fs.writeFileSync(output, yaml.safeDump(minified_dict));

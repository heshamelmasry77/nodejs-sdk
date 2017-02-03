/**
 * Module dependencies.
 */
var Prismic = require('prismic-nodejs');
var app = require('./config');
var PORT = app.get('port');
var PConfig = require('./prismic-configuration');
var request = require('request');
var express = require('express');
var app = express();

app.use(express.static('app/public'));

// SETTING MY VIEW ENGINE
app.set('view engine', 'ejs');

// DIRECTING WHERE IS MY VIEWS
app.set('views','./app/views');

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send('404 not found');
  } else {
    res.status(500).send('Error 500: ' + err.message);
  }
}

app.listen(PORT, function() {
  const repoEndpoint = PConfig.apiEndpoint.replace('/api', '');
  request.post(repoEndpoint + '/app/settings/onboarding/run', {form: {language: 'node', framework: 'express'}});
  console.log('Point your browser to: http://localhost:' + PORT);
});

/**
* initialize prismic context and api
*/
function api(req, res) {
  res.locals.ctx = { // So we can use this information in the views
    endpoint: PConfig.apiEndpoint,
    linkResolver: PConfig.linkResolver
  };
  return Prismic.api(PConfig.apiEndpoint, {
    accessToken: PConfig.accessToken,
    req: req
  });
}
// GETTING MODEL STEVEN VERSION

// app.get('/make/:make', function(req, res) {
//   api(req, res).then(function(api) {
//     return api.getByUID('make', req.params.make);
//   }).then(function(document) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send({
//       id: document.id,
//       uid: document.uid,
//       title: document.data['make.title'].value[0].text
//     });
//   });
// });

app.get('/', function(req, res) {

// pass along the location of my index file
  res.render('index')

});


// GETTING MAKE HESHAM VERSION

app.get('/make/:make', function(req, res) {
  api(req, res).then(function(api) {
    return api.getByUID('make', req.params.make);
  }).then(function(document) {
    // console.log(document);
    var info = '';
    // res.setHeader('Content-Type', 'application/json');
    info += `
    <ul>
    <li>
      <h2>${document.id}</h2>
      <p>${document.data['make.title'].value[0].text}</p>
    </li>
    </ul>
    `;
    res.send(`
      <link rel="stylesheet" type="text/css" href="/css/style.css">
      <h1>carzar</h1>
      ${info}
  `);
  });

});

// GETTING MODEL STEVEN VERSION

// app.get('/model/:model', function(req, res) {
//   api(req, res).then(function(api) {
//     return api.getByUID('model', req.params.model);
//   }).then(function(document) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(document));
//   });
// });

// GETTING MODEL HESHAM VERSION
app.get('/model/:model', function(req, res) {
  api(req, res).then(function(api) {
    return api.getByUID('model', req.params.model);
  }).then(function(document) {
    // res.setHeader('Content-Type', 'application/json');
    // console.log(document);
      var info = '';

      info += `
      <ul>
      <li>
        <h2>${document.id}</h2>
        <p>${document.fragments['model.description'].blocks[0].text}</p>
        <img src="${document.fragments['model.banner-image'].url}">
      </li>
      </ul>
      `;
    res.send(
      `
        <h1>carzar</h1>
        ${info}
      `
      // JSON.stringify(document)
  );
  });
});

// GETTING ALL THE MAKE MODELS eg: make/volkswagen/models
app.get('/make/:make/models', function(req, res) {
  api(req, res).then(function(api) {
    return api.query([
      Prismic.Predicates.at("document.type", "model"),
      Prismic.Predicates.at("my.model.make", req.params.make)
    ]);
  }).then(function(document) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document.results));
  });
});

// GETTING MAKE/MODEL  eg:  volkswagen/volkswagen-polo-classic
app.get('/make/:make/:model', function(req, res) {
  api(req, res).then(function(api) {
    return api.query([
      Prismic.Predicates.at("document.type", "model"),
      Prismic.Predicates.at("my.model.make", req.params.make)
    ]);
  }).then(function(document) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document.results));
  });
});

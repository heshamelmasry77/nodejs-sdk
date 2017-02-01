/**
 * Module dependencies.
 */
var Prismic = require('prismic-nodejs');
var app = require('./config');
var PORT = app.get('port');
var PConfig = require('./prismic-configuration');
var request = require('request');

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

app.get('/make/:make', function(req, res) {
  api(req, res).then(function(api) {
    return api.getByUID('make', req.params.make);
  }).then(function(document) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      id: document.id,
      uid: document.uid,
      title: document.data['make.title'].value[0].text
    });
  });
});

app.get('/model/:model', function(req, res) {
  api(req, res).then(function(api) {
    return api.getByUID('model', req.params.model);
  }).then(function(document) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document));
  });
});

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

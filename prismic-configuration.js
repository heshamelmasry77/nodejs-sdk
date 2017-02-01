module.exports = {

  apiEndpoint: 'https://carzar.prismic.io/api',

  // -- Access token if the Master is not open
  accessToken: 'MC5XSVg1M1NzQUFBcEJPWnhW.Te-_vWVq77-977-977-977-9au-_vXYtJO-_ve-_vRAjcxbvv73vv70w77-977-977-977-9e1hC77-977-977-9',

  // OAuth
   clientId: 'WIX53SsAALA-OZxU',
   clientSecret: 'af67dbe3fdd578488b0e78e05e136783',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver: function(doc, ctx) {
    return '/';
  }
};

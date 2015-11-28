/**
 * Fastly API client.
 *
 * @package fastly
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var rp = require('request-promise');

/**
 * Constructor
 */
function Fastly (apikey) {
    this.apikey = apikey || '';
}

/**
 * Adapter helper method.
 *
 * @param {string} Method
 * @param {string} URL
 * @param {params} Optional params to update.
 *
 * @return {Promise}
 */
Fastly.prototype.request = function (method, url, params) {
    // Construct headers
    var headers = { 'Fastly-Key': this.apikey };
    var requestOptions = {
        method: method,
        uri: 'https://api.fastly.com' + url,
        headers: headers,
        form: params,
        resolveWithFullResponse: false,
        json: true
    };
    return rp(requestOptions);
};

// -------------------------------------------------------

Fastly.prototype.purge = function (host, url) {
    return this.request('POST', '/purge/' + host + url);
};

Fastly.prototype.purgeAll = function (service) {
    var url = '/service/' + encodeURIComponent(service) + '/purge_all';
    return this.request('POST', url);
};

Fastly.prototype.purgeKey = function (service, key) {
    var url = '/service/' + encodeURIComponent(service) + '/purge/' + key;
    return this.request('POST', url);
};

Fastly.prototype.stats = function (service) {
    var url = '/stats' + (service || '');
    return this.request('GET', url);
};

Fastly.prototype.content = function (service) {
    var url = '/content/edge_check?' + encodeURIComponent(service);
    return this.request('GET', url);
};

/**
 * Export
 */
module.exports = function (apikey) {
    return new Fastly(apikey);
};

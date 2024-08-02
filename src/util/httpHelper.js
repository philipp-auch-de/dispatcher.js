import pkg from 'xhr2';
import { dispatcherJsConfig } from '../dispatcherJsConfig.js';
import { debug } from './logging.js';

export async function _callUrl(method, url, data) {
  const xhr = new pkg.XMLHttpRequest();
  xhr.withCredentials = true;

  return new Promise(function (resolve) {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        resolve(xhr);
      }
    };
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (dispatcherJsConfig.DEBUG_GET_CALLS) debug('BASE', method + ' ' + url + ' ' + (!data ? '' : data + ' '), 'call started');
    xhr.send(data);
  });
}

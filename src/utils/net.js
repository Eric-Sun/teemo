import Flyio from 'flyio/dist/npm/wx'
import {api} from '../const'

export function checkT(t,falseFunction,trueFunction) {
  new Flyio().get(`${api}`,
    {
      act: 'user.checkToken',
      t: t
    }).then(function (res) {
    if (res.data.result == 1) {
      falseFunction();
    } else {
      trueFunction();
    }
  });
}

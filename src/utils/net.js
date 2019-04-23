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

/**
 * 处理服务端返回的信息，如果有错误的话，会对应的弹出错误框
 * @param res
 * @param falseFunction
 * @param trueFunction
 */
export function handleResponse(res,falseFunction,trueFunction){


}

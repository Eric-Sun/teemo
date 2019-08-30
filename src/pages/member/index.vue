<template>
  <div class="container">
    <button @click.stop="purchase">购买会员</button>
  </div>
</template>

<script>
  import authorHead from '../../components/authorHead'
  import {api} from '../../const'
  import {checkT} from '../../utils/net'
  import login from '../../components/login'

  export default {
    data() {
      return {
        loginVisible: false,
        user: {},
        t: 0
      }
    },
    components: {
      authorHead,
      login
    },
    methods: {
      purchase: function () {
        // 获取到需要支付的价钱
        var price = 1000;
        var t = wx.getStorageSync("t")
        //后台订单生成
        // const res = await
        // this.$http.get(`${api}`,
        //   {
        //     act: 'order.create',
        //     t: t,
        //     price:price
        //   })
        // wx.hideLoading()
        // if (res.data.list.length != 0) {
        //   var data = JSON.parse(data);
        //   console.log(data)
        //   wx.requestPayment({
        //     'timeStamp': data.timeStamp,
        //     'nonceStr': data.nonceStr,
        //     'package': data.package,
        //     'signType': 'MD5',
        //     'paySign': data.paySign,
        //     'success': function (res) {
        //       wxb.Post('/api/cards.member/confirm_integral', {
        //         // 支付成功的业务逻辑代码
        //       }, function (datas) {
        //         wx.redirectTo({
        //           url: '/pages/mine/index'
        //         })
        //
        //       });
        //     },
        //     'fail': function (res) {
        //
        //       wxb.Post('/api/cards.member/confirm_integral', {
        //         // 支付失败或者取消支付代码
        //       }, function (datas) {
        //       });
        //     }
        //
        //   });
        // } else {
        //
        // }
      }
    },
    onShow() {
      var that = this
      var t = wx.getStorageSync("t")
      checkT(t,
        function () {
          that.loginVisible = true
        },
        function () {

        }
      );
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    height: 100vh;
    background-color: rgb(245, 245, 249);

    .list {
      margin-top: 30rpx;
      background-color: white;

      .list-item {
        height: 76rpx;
        line-height: 76rpx;
        margin: 0 30rpx;
        padding: 10rpx 0;
      }

      .list-item + .list-item {
        border-top: 1rpx solid $borderColor;
      }

      .margin {
        margin-top: 30rpx;
      }
    }
  }
</style>

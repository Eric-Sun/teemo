<template>
  <div class='mask' v-if='visible'>
    <div class="container">
      <div style='width:100%;padding-left:30rpx;font-size: 28rpx;margin-top:30rpx;'>1、同意当前小程序获取我的微信头像；</div>
      <div style='width:100%;padding-left:30rpx;font-size: 28rpx;margin-top:30rpx;'>2、同意当前小程序获取我的微信昵称等其他信息；</div>
      <button open-type="getUserInfo" v-on:click="doLogin()" class="save-btn">授权登录</button>
    </div>
  </div>

</template>
<script>
  import { api } from '../const'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        accesstoken: ''
      }
    },
    methods: {

      doLogin () {
        var that = this
        wx.login({
          success: function (res) {
            var code = res.code // 微信登录接口返回的 code 参数，下面注册接口需要用到
            wx.getUserInfo({
              success: function (res) {
                wx.setStorageSync('userInfo', res.userInfo)
                var iv = res.iv
                var encryptedData = res.encryptedData
                // 下面开始调用注册接口
                that.$http.get(`${api}`, {
                  act: 'user.wechatLogin',
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv
                }).then(function (response) {
                  if (response.data.code != null) {
                    console.log('err=' + response.data.code)
                  } else {
                    wx.setStorageSync('t',response.data.t);
                    wx.setStorageSync('userId',response.data.userId)
                    that.$emit("modalClose");
                  }
                })
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  .mask {
    position: fixed;
    background-color: white;
    height: 100vh;
    width: 100vw;
    z-index: 2333;
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .input {
        border-bottom: 2rpx solid $borderColor;
        width: 600rpx;
        margin-top: 200rpx;
      }
      .button {
        width: 600rpx;
        margin-top: 150rpx;
      }
      .tips {
        font-size: 22rpx;
        color: #888;
        margin-top: 10rpx;
      }
      .save-btn,
      .cancel-btn {
        width: 690rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        margin-top: 30rpx;
        border-radius: 6rpx;
        box-sizing: border-box;
      }
      .save-btn {
        background-color: #e64340;
        color: #fff;
      }
    }
  }
</style>

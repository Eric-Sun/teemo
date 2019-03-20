<template>
  <div class="container">
    <login :visible='visible' v-on:modalClose='closeModalEvent'></login>
    <div class='list'>
      <span>标题:</span>
      <input class='input' type="text" placeholder="最少10个字" v-model="title">
    </div>
    <picker class='picker' @change="bindPickerChange($event)" :value="type.index" :range="type.pickerData">
      <span>类型:</span><span style='margin-left:400rpx;'>{{type.pickerData[type.index]}}</span>
    </picker>
    <picker class='picker' @change="bindPickerChange1($event)" :value="anon.index" :range="anon.pickerData">
      <span>匿名:</span><span style='margin-left:400rpx;'>{{anon.pickerData[anon.index]}}</span>
    </picker>

    <textarea v-show="tab==='markdown'" class='textarea' v-model="content"></textarea>

    <button @click.stop="handle">发帖</button>
  </div>
</template>

<script>
  import login from '../../components/login'
  import { api } from '../../const'
  import { barId } from '../../const'

  export default {
    components: {
      login
    },

    watch: {
      content (next) {
        console.log(next)
      }
    },
    data () {
      return {
        type: {
          pickerData: ['故事贴', '一日一记'],
          index: -1
        },
        anon: {
          pickerData: ['非匿名', '匿名'],
          index: -1
        },
        title: '',
        content: '',
        visible: false,
        tab: 'markdown', // or preview
        t: ''
      }
    },
    methods: {
      bindPickerChange (e) {
        // console.log(e)
        this.type.index = e.mp.detail.value
      },
      bindPickerChange1 (e) {
        // console.log(e)
        this.anon.index = e.mp.detail.value
      },
      changeTab (e) {
        this.tab = e.target.dataset.tab
      },
      async handle () {
        if (this.type.index == -1) {
          wx.showToast({
            title: '请选择类型',
            icon: 'none',
            duration: 2000
          })
        }
        if (this.anon.index == -1) {
          wx.showToast({
            title: '请选择是否匿名',
            icon: 'none',
            duration: 2000
          })
        }
        const res = this.$http.get(`${api}`, {
          act: 'post.add',
          t: this.t,
          barId: `${barId}`,
          title:
          this.title,
          content:
          this.content,
          type: this.type.index,
          anonymous: this.anon.index
        }).then(function (response) {
          if (!response.data.code) {
            console.log(response.data.postId)
            wx.showToast({
              title: '发帖成功',
              icon: 'none',
              duration: 2000
            })
          }
        })

      }
      ,
      closeModalEvent () {
        this.visible = false
      }
    },
    onShow () {
      this.t = wx.getStorageSync('t')
      var that = this
      wx.checkSession({
        success () {
        },
        fail () {
          that.visible = true
        }
      })
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    height: 100vh;
    background-color: rgb(245, 245, 249);
    .list {
      display: flex;
      justify-content: space-between;
      background-color: white;
      margin-bottom: 30rpx;
      height: 90rpx;
      padding: 0 30rpx;
      line-height: 90rpx;
      .input {
        height: 90rpx;
        line-height: 90rpx;
      }
    }
    .picker {
      display: flex;
      justify-content: space-between;
      background-color: white;
      margin-bottom: 30rpx;
      height: 90rpx;
      line-height: 90rpx;
      padding: 0 30rpx;
    }
    .tabs {
      display: flex;
      background-color: white;
      & > div {
        width: 50%;
        text-align: center;
      }
    }
    .textarea {
      width: 100%;
      background-color: white;
      margin-bottom: 30rpx;
      height: 500rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
    }
  }

  .selected {
    color: $color;
    border-bottom: 2rpx solid $color;
  }
</style>

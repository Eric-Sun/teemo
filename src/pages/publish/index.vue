<template>
  <div class="container">
    <login :visible='visible' v-on:modalClose='closeModalEvent'></login>
    <div class='list'>
      <span>标题:</span>
      <input class='input' type="text" placeholder="最少10个字" v-model="title">
    </div>
    <picker class='picker' @change="bindPickerChange($event)" :value="index" :range="pickerData">
      <span>选择主题:</span><span style='margin-left:400rpx;'>{{pickerData[index]}}</span>
    </picker>

    <textarea v-show="tab==='markdown'" class='textarea' v-model="content"></textarea>

    <button @click.stop="handle">发帖</button>
  </div>
</template>

<script>
  import login from '../../components/login'
  import { api } from '../../const'

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
        pickerData: ['故事贴', '一日一记'],
        index: 0,
        title: '',
        content: '',
        visible: false,
        tab: 'markdown' // or preview
      }
    },
    methods: {
      bindPickerChange (e) {
        // console.log(e)
        this.index = e.mp.detail.value
      },
      changeTab (e) {
        this.tab = e.target.dataset.tab
      },
      async handle () {
        const res = await this.$http.post(`${api} `, {
          title: this.title,
          tab: trans[this.index],
          content: this.content
        })
        if (res.data.success) {
          wx.showToast({
            title: '发帖成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
      ,
      closeModalEvent () {
        this.visible = false
      }
    },
    onShow () {
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

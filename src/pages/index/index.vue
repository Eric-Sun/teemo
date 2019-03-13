<template>
  <div class='container'>
    <div class='header'>
      <div :class='{ active: tab==="all" }' @click.stop='changeTab($event)' data-tab='all' :data-offset='0'>全部</div>
      <div :class='{ active: tab==="good" }' @click.stop='changeTab($event)' data-tab='good' :data-offset='1'>精华</div>
      <div :class='{ active: tab==="share" }' @click.stop='changeTab($event)' data-tab='share' :data-offset='2'>分享</div>
      <div :class='{ active: tab==="job" }' @click.stop='changeTab($event)' data-tab='job' :data-offset='3'>招聘</div>
      <div :class='{ active: tab==="ask" }' @click.stop='changeTab($event)' data-tab='ask' :data-offset='4'>问答</div>
    </div>
    <div class="containers" :animation='animation'>
      <div v-for='(listItem,listIndex) in list' :key='listIndex'>
        <scroll-view scroll-y class='scroll-container' @scrolltolower='getMore'>
          <div v-for='item in cardData[listItem]' :key='item.id'>
            <card :item='item'></card>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
  import card from '@/components/card'

  export default {
    data () {
      return {
        page: 0,
        tab: 'all',
        cardData: {
          all: [],
          good: [],
          share: [],
          job: [],
          ask: []
        },
        isLoading: false,
        list: ['all', 'good', 'share', 'job', 'ask'],
        animation: {}
      }
    },

    components: {
      card
    },

    mounted () {
      this.getData('all', 0)
      // this.uploadImg()
    },

    methods: {

      // async uploadImg () {
      //   console.log(1);
      //   var that = this;
      //   wx.chooseImage({
      //     count: 1, //最多可以选择的图片总数
      //     sizeType: ['original'], // 只能是原图
      //     sourceType: ['album'], // 只能是相册
      //     success: function(res) {
      //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      //       var tempFilePaths = res.tempFilePaths;
      //       wx.showToast({
      //         title: '正在上传...',
      //         icon: 'loading',
      //         mask: true,
      //         duration: 10000
      //       })
      //
      //
      //       wx.uploadFile({
      //         url: "http://localhost:8081/api",
      //         filePath: tempFilePaths[0],
      //         name: "file",
      //         header: {
      //           "Content-Type": "multipart/form-data"
      //         },
      //         formData: {
      //           "act": "img.upload",
      //         },
      //         success: function(res) {
      //           wx.hideToast();
      //          }
      //       });
      //
      //     }
      //   })
      // },
      async getData (tab, page) {
        wx.showLoading({
          title: '加载中'
        })
        this.isLoading = true
        const res = await
          this.$http.get('http://localhost:8081/api?act=post.list&' +
            'userId=1&size=10&barId=1&pageNum=0&type=-1')
        wx.hideLoading()
        console.log(res.data.list.length)
        if (res.data.list.length != 0) {
          if (this.cardData[tab].length > 0 && page === 0) {
            // 下拉刷新
            this.cardData[tab] = res.data.list
            // res.data.data;
          } else {
            // 底部加载更多 h和初始得时候
            this.cardData[tab] = [...this.cardData[tab], ...res.data.list]
          }
        } else {
          // 获取数据失败
        }
        this.isLoading = false
      },
      async getMore () {
        if (!this.isLoading) {
          await this.getData(this.tab, this.page + 1)
          this.page += 1
        }
      },
      async onPullDownRefresh () {
        await this.getData(this.tab, 0)
        wx.stopPullDownRefresh()
      },
      changeTab (e) {
        const currentTab = e.target.dataset.tab
        const offset = e.target.dataset.offset
        this.tab = currentTab
        this.page = 0
        this.getData(currentTab, 0)
        this.animation = wx
          .createAnimation({
            duration: 1000,
            timingFunction: 'ease'
          })
          .left(`-${offset * 100}vw`)
          .step()
          .export()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    background-color: rgb(245, 245, 249);
    font-size: 30 rpx;
    overflow: hidden;
    width: 100vw;
    .header {
      display: flex;
      & > div {
        width: 20%;
        background-color: #41b883;
        color: white;
        text-align: center;
        height: 86 rpx;
        line-height: 86 rpx;
      }
    }
    .containers {
      display: flex;
      position: relative;
      .scroll-container {
        height: 90vh;
        width: 100vw;
      }
    }
  }

  .header .header > div + .header > div {
    border-left: 2 rpx solid white;
  }

  .active {
    font-weight: bold;
  }
</style>

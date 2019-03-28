<template>
  <div class='container'>
    <login :visible='visible' v-on:modalClose='closeModalEvent'></login>
    <div class='header'>
      <div :class='{ active: tab==="story" }' @click.stop='changeTab($event)' data-tab='story' :data-offset='0'>故事贴
      </div>
      <div :class='{ active: tab==="diary" }' @click.stop='changeTab($event)' data-tab='diary' :data-offset='1'>一日一记
      </div>
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
  import { api, barId } from '../../const'

  export default {
    data () {
      return {
        t: 0,
        page: 0,
        tab: 'story',
        cardData: {
          story: [],
          diary: []
        },
        isLoading: false,
        list: ['story', 'diary'],
        animation: {},
        visible: false
      }
    },

    components: {
      card
    },

    mounted () {
      var t = wx.getStorageSync('t')
      var that = this
      this.$http.get(`${api}`,
        {
          act: 'user.checkToken',
          t: t
        }).then(function (res) {
        if (res.data.result == 1) {
          that.visible = true
        } else {
          that.getData()
        }

      })
      this.t = wx.getStorageSync('t')
      this.getData('story', 0)
    },

    methods: {
      closeModalEvent () {
        this.visible = false
        this.getData()
      },

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
        var type = -1
        if (tab == 'story') {
          type = 0
        } else {
          type = 1
        }
        wx.showLoading({
          title: '加载中'
        })
        this.isLoading = true
        const res = await
          this.$http.get(`${api}`,
            {
              act: 'post.list',
              t: this.t,
              barId: `${barId}`,
              pageNum: page,
              size: 10,
              type: type
            })
        wx.hideLoading()
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
          wx.showToast({
            title: '已经没有更新的数据了',
            icon: 'none',
            duration: 2000
          })
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
    font-size: 30rpx;
    overflow: hidden;
    width: 100vw;
    .header {
      display: flex;
      & > div {
        width: 20%;
        /*background-color: #41b883;*/
        color: black;
        text-align: center;
        height: 86rpx;
        line-height: 86rpx;
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
    border-left: 2rpx solid white;
  }

  .active {
    font-weight: bolder;
  }
</style>

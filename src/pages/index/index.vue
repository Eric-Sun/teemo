<template>
  <div class='container'>
    <login :visible='visible' v-on:modalClose='closeModalEvent'></login>
    <div class='header'>
      <div :class='{ active: tab==="story" }' data-tab='story' :data-offset='0'>故事贴
      </div>
<!--      <div :class='{ active: tab==="diary" }' @click.stop='changeTab($event)' data-tab='diary' :data-offset='1'>一日一记-->
<!--      </div>-->
    </div>
    <div class="containers" :animation='animation'>
      <div v-for='(listItem,listIndex) in list' :key='listIndex'>
        <scroll-view scroll-y class='scroll-container' @scrolltolower='getMore' :scroll-top="cursor">
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
  import {api, barId} from '../../const'
  import login from '../../components/login'
  import {checkT} from '../../utils/net'

  export default {
    data() {
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
        visible: false,
        cursor: 0,
      }
    },

    components: {
      card,
      login
    },
    onShow() {
      this.init();
    },
    onload() {
      this.init();
    },
    onShareAppMessage: function () {
      return {
        title: '豆子社区',//分享内容
        path: '/pages/index/index' //分享地址
        // imageUrl: '/images/img_share.png',//分享图片
      }
    },
    methods: {
      init() {
        var t = wx.getStorageSync('t')
        var that = this
        checkT(t,
          function () {
            that.visible = true
          },
          function () {
            that.t = wx.getStorageSync('t')
            that.getData('story', 0)
            // that.getData('diary', 0);
          }
        );
        this.cursor = 0;
        this.page = 0;
      },
      closeModalEvent() {
        this.visible = false
        this.t = wx.getStorageSync('t')
        this.getData('story', 0)
      },


      async getData(tab, page) {
        var that = this;

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
              t: that.t,
              barId: `${barId}`,
              pageNum: this.page,
              size: 5,
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
        if (res.data.noticeSize > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: res.data.noticeSize + ''
          })
        }

        this.isLoading = false
      },
      async getMore() {
        if (!this.isLoading) {
          this.page += 1
          await this.getData(this.tab, this.page)
        }
      },
      async onPullDownRefresh() {
        await this.getData(this.tab, 0)
        wx.stopPullDownRefresh()
      },
      changeTab(e) {
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

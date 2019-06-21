<template>
  <div class="container">
    <login :visible='loginVisible' v-on:modalClose='closeModalEvent'></login>
    <!--<bottomAction v-if="bottomActionVisible" @close-modal="closeModal" :postId="deletedPostId"></bottomAction>-->
    <div class='margin' v-for='item in currentData' :key='item.id'>
      <card :item='item' :hidden='true' @reloadCardList="reloadCardList" @close-modal='closeModal'></card>
    </div>

  </div>
</template>
<script>
  import {api, barId} from '../../const'
  import card from '../../components/card'
  import bottomAction from '../../components/bottomAction'
  import {checkT} from '../../utils/net'
  import login from '../../components/login'



  export default {
    data() {
      return {
        currentData: [],
        t: 0,
        bottomActionVisible: false,
        deletedPostId: 0,
        type: '',
        otherUserId: 0,
        loginVisible: false
      }
    },
    components: {
      card,
      bottomAction,
      login
    },
    onLoad(options) {
      this.type = options.type
      console.log('type=' + this.type)
      this.t = wx.getStorageSync('t')
      this.otherUserId = options.otherUserId
      this.loadData()

    },
    onShow() {
      var that = this;
      var t = wx.getStorageSync("t")
      checkT(t,
        function () {
          that.loginVisible = true
        },
        function () {
        }
      );
    },
    methods: {
      async loadData() {
        const res = await
        this.$http.get(`${api}`, {
          act: 'collection.post.list',
          t: this.t,
          pageNum: 0,
          size: 10
        })
        if (res.data.code == null) {
          this.currentData = res.data.list.map(_ => {
            return _.post;
          })
        }
      }
      ,
      // closeModal: function () {
      //   this.bottomActionVisible = false
      // },
      // showActionModal: function (data) {
      //   this.bottomActionVisible = true
      //   this.deletedPostId = data
      //
      // },
      reloadCardList() {
        this.loadData()
      }
    }
  }
</script>
<style lang='scss' scoped>
  .container {
    background-color: rgb(245, 245, 249);
    min-height: 100vh;

    .margin {
      margin-bottom: 20rpx;
    }
  }
</style>

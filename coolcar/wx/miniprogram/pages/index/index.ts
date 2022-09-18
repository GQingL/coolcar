import { IAppOption } from "../../appoption"

Page({
  data: {
  avatarURL: '',
  setting: {
    skew: 0,
    rotate: 0,
    showLocation: true,
    showScale: true,
    subKey: '',
    layerStyle: -1,
    enableZoom: true,
    enableScroll: true,
    enableRotate: false,
    showCompass: false,
    enable3D: false,
    enableOverlooking: false,
    enableSatellite: false,
    enableTraffic: false,
  },
  location: {
    latitude: 30,
    longitude: 120,
  },
  scale: 16,
  },
  async onLoad() {
    const userInfo = await getApp<IAppOption>().globalData.userInfo
    this.setData({
      avatarURL: userInfo.avatarUrl,
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onMyLocationTap() {
    // wx.getSetting({
    //   success(res){
    //     if(res.authSetting['scope.userLocation']===false){
    //       wx.openSetting({
    //         success(res){
    //         res.authSetting ={
    //           "scope.userLocation": true
    //         }
    //       }
    //       })
    //     }else{
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success(){

    //         }
    //       })
    //     }
    //   }
    // })
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
        })
      }, 
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '请前往设置页授权',
        })
      }
    })
  },
})

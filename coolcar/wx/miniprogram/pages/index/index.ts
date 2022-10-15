import { IAppOption } from "../../appoption"

Page({
  data: {
  isPageShow: false,
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
  markers: [
      {
          iconPath: "/resources/car.png",
          id: 0,
          latitude: 23.099994,
          longitude: 113.324520,
          width: 50,
          height: 50
      }
  ]
  },
  // 获取用户头像
  async onLoad() {
    const userInfo = await getApp<IAppOption>().globalData.userInfo
    this.setData({
        // 获取头像图片
      avatarURL: userInfo.avatarUrl,
    })
  },
  onMyLocationTap() {
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
  onScanClicked() {
    wx.scanCode({
        success: console.log,
        fail: console.error
    })
  },
  moveCars(){
     const map =  wx.createMapContext("map");
     const dest = {
         latitude: 23.099994,
         longitude: 113.324520,
     }
     const moveCar = () =>{
         dest.latitude += 0.1
         dest.longitude += 0.1
        map.translateMarker({
            destination: {
                latitude: dest.latitude,
                longitude: dest.longitude,
            },
            markerId: 0,
            autoRotate: false,
            rotate: 0,
            duration: 5000,
            animationEnd: () => {
                if(this.isPageShow){
                    moveCar()
                }
            },
         })
     }
  }
})

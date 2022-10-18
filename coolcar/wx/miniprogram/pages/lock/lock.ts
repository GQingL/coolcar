import { IAppOption } from "../../appoption"
import { routing } from "../../utils/routing"

const shareLocationKey = "share_location"

const tripId = 'trip456'

Page({
    data:{
    shareLocation: '',
    avatarURL: ''
    },
    async onLoad() {
        const userInfo = await getApp<IAppOption>().globalData.userInfo
        this.setData({
            avatarURL: userInfo.avatarUrl,
            shareLocation: wx.getStorageSync(shareLocationKey)
        })
    },
    onGetUserInfo(e: any){
        const userInfo: WechatMiniprogram.UserInfo = e.detail.userInfo
        if(userInfo){
            getApp<IAppOption>().resolveUserInfo(userInfo)
        }
    },
    onShareLocation(e: any) {
        const shareLocation : boolean = e.detail.value
        wx.setStorageSync(shareLocationKey, shareLocation)
    },
    onUnlockTap() {
        wx.getLocation({
            type: 'gcj02',
            success: loc => {
                console.log('starting a trip', { 
                    location: {
                        location: loc.latitude,
                        longitude: loc.longitude,
                    },
                    avatarUrl: this.data.shareLocation 
                                ? this.data.avatarURL : '',
                })
        wx.showLoading({
            title: '开锁中',
            mask: true
        })
        setTimeout(() => {
            wx.redirectTo({
                url: routing.driving({
                    trip_id: tripId
                }),
                complete: () =>{
                    wx.hideLoading
                }
            })
        },3000)
        },
        fail: () => {
            wx.showToast({
                icon: 'none',
                title: '请前往设置页授权位置信息'
            })
        },
    })
    },
})
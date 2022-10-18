import { routing } from "../../utils/routing"

Page({
    redirectURL: '',
    data: {
        licNo: '',
        name: '',
        genderIndex: 1,
        genders: ['未知', '男', '女'],
        birthDate: '1990-01-01',
        licImgURL: '',
        state: 'UNSUBMITTED'
    },
    onLoad(opt: Record<'redirect',string>){
        const o: routing.RegisterOpts = opt
        if(o.redirect){
            this.redirectURL = decodeURIComponent(o.redirect)
        }
    },
    onGenderChange(e: any) {
        this.setData({
            genderIndex: parseInt(e.detail.value),
        })
    },
    onBirthDateChange(e: any) {
        this.setData({
            birthDate: e.detail.value,
        })
    },
    onUploadLic(){
        wx.chooseImage({
            success: res => {
                if(res.tempFilePaths.length > 0){
                this.setData({
                    licImgURL: res.tempFilePaths[0]
                })
            }
            }
        })
    },
    onSubmit(){
        this.setData({
            state: 'PENDING'
        })
    },
    onResubmit(){
        this.setData({
            state: 'UNSUBMITTED'
        })
    },
    onLicVerified() {
        this.setData({
            state: 'VERIFIED'
        })
        if (this.redirectURL) {
            wx.redirectTo({
                url: '/pages/lock/lock'
            })
        }
    }
})
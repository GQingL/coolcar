Page({
    data: {
        licNo: '',
        name: '',
        genderIndex: 0,
        genders: ['未知', '男', '女'],
        birthDate: '1990-01-01',
        licImgURL: undefined as string | undefined,
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
    }
})
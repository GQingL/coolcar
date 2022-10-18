import { routing } from "../../utils/routing"

Page({
    data: {
        current: 0,
        imageUrls: [
            {
                img: 'https://img2.mukewang.com/6348d2460001023417920764.jpg',
                imageId: 1,
            },
            {
                img: 'https://img4.mukewang.com/63477b460001842a17920764.jpg',
                imageId: 2, 
            }
        ]
    },
    
    onSwiperChange(e: any) {
        if (!e.detail.value){
            return
        }
        console.log(e)
    },
    onImageItemTap(e: any){
        console.log(e)
        const imageId = e.currentTarget.dataset.promotionId
        if(imageId){
            console.log("success"+imageId)
        }
    },
    onRegisterTap(){
        wx.navigateTo({
            url: routing.notRegister()
        })
    }
})
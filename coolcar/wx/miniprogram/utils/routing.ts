export namespace routing {

    export interface DrivingOpts  {
        trip_id: string
    }

    export function driving(o: DrivingOpts) {
        return `/pages/driving/driving?trip_id=${o.trip_id}`
    }

    export interface LockOpts  {
        car_id: string
    }

    export function lock(o: LockOpts) {
        return `/pages/lock/lock?car_id=${o.car_id}`
    }

    export interface RegisterOpts  {
        redirect: string
    }

    export function register(o: RegisterOpts) {
        return `/pages/register/register?redirect=${o.redirect}`
    }

    export function notRegister(){
        return '/pages/register/register'
    }

    export function notMyTrips(){
        return '/pages/mytrips/mytrips'
    }
}
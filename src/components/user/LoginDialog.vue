<template>
  <v-dialog v-model="showLogin">
    <v-card class="pa-4">
      <v-tabs grow v-model="mode">
        <v-tab value="mobile">
          {{ $t('login.mobile_login') }}
        </v-tab>
        <v-tab value="password">
          {{ $t('login.password_login') }}
        </v-tab>
      </v-tabs>
      <v-window v-model="mode">
        <v-window-item value="mobile">
          <mobile-login-form @success="onMobileLoggedInSuccess" />
        </v-window-item>
        <v-window-item value="password">
          <login-form />
        </v-window-item>
      </v-window>

      <v-btn block v-if="$soul.login.wechat && (isApp || isWechat)" @click="wechatLogin" class="mt-2" color="#44b549"
        dark>
        <v-icon>mdi-wechat</v-icon>{{ $t('login.sign_in_wechat') }}
      </v-btn>
      <v-btn block v-if="$soul.login.apple && (isIOS || isAppIOS) && !isWechatApp" :dark="!$vuetify.theme.dark"
        @click="appleLogin" class="mt-2">
        <v-icon>mdi-apple</v-icon>{{ $t('login.sign_in_apple') }}
      </v-btn>
      <v-btn block v-if="$soul.login.apple && isAppIOS" :dark="!$vuetify.theme.dark" @click="touchIdLogin" class="mt-2">
        <v-icon>mdi-fingerprint</v-icon>
        {{ $t('login.sign_in_touchid') }}
      </v-btn>
      <div class="mt-2 d-flex flex-wrap align-center">
        <v-btn text color="primary" @click="register" class="">{{
          $t('login.register')
          }}</v-btn>
        <v-btn text color="primary" @click="forgot" class="">{{
          $t('login.forgot_password')
          }}</v-btn>

        <!-- <page-dialog :code="`useragreement-${$i18n.locale}`"
						>&nbsp;{{ $t('user_agreement') }}</page-dialog
					>
					<page-dialog :code="`privacypolicy-${$i18n.locale}`"
						>&nbsp;{{ $t('privacy_policy') }}</page-dialog
					> -->
      </div>
      <!--
				<v-btn
					v-if="$soul.login.github && !isWechatApp"
					text
					@click="goTo('/oauth/index/Github')"
					class="mt-2"
				>
					<v-icon>mdi-github</v-icon>
				</v-btn>
				<v-btn
					v-if="$soul.login.facebook"
					text
					@click="goTo('/oauth/facebook')"
					class="mt-2"
				>
					<v-icon>mdi-facebook</v-icon>
				</v-btn>

				<v-btn
					v-if="$soul.login.google && !isWechat"
					text
					@click="goTo('/oauth/google')"
					class="mt-2"
				>
					<v-icon>mdi-google</v-icon>
				</v-btn> -->
    </v-card>
  </v-dialog>
</template>

<script>
import Utils from '@/utils/utils'
// import MobileLoginForm from './MobileLoginForm'
// import LoginForm from './LoginForm'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useRootStore } from '@/stores/root'
import { useVisitorStore } from '@/stores/visitor'
import { PageDialog, MobileLoginForm, LoginForm } from '@ui'
export default {
  data() {
    return {
      // modes: {
      //     mobile: '手机登录',
      //     password: '密码登录'
      // },
      mode: null, //default mobile, /password
      isIOS: Utils.isIOS(),
      isMobile: Utils.isMobile(),
      isTablet: Utils.isTablet(),
      isWechat: Utils.isWechat(),
      isWechatApp: Utils.isWechatApp(),
      isApp: Utils.isApp(),
      isAppIOS: Utils.isAppIOS()
    }
  },
  computed: {
    ...mapWritableState(useRootStore, ['showLogin']),
    ...mapState(useRootStore, ['device'])
  },
  mounted() {
    if (!this.isWechat && !this.isWechatApp) {
      this.mode = 'mobile'
    }
  },
  methods: {
    ...mapActions(useVisitorStore, ['setReturnURL', 'onLoggedIn']),
    setMode(mode) {
      if (this.mode === mode) this.mode = false
      else this.mode = mode
    },
    forgot() {
      this.$router.push({ path: '/user/forgotpassword' })
      this.showLogin = false
    },
    register() {
      this.setReturnURL(this.$router.currentRoute.fullPath)
      this.$router.push('/user/register')
      this.showLogin = false
    },
    onMobileLoggedInSuccess(r) {
      this.showLogin = false
    },
    wechatLogin() {
      //如果是router拦截弹出的，这里的currentRoute就是 '/'
      this.setReturnURL(this.$router.currentRoute.fullPath)
      if (this.isApp) {
        this.$router.push({ path: '/oauth/wechatmobileapp' }) //location.href 在app中无法使用
      } else {
        if (this.isWechat) {
          if (this.isWechatApp) {
            location.href = '/oauth/wechatapp'
          } else {
            location.href = '/oauth/wechat'
          }
        } else {
          //非微信浏览器
          location.href = '/oauth/wechat'
        }
      }
    },
    appleLogin() {
      this.setReturnURL(this.$router.currentRoute.fullPath)
      if (this.isApp) {
        this.$router.push({ path: '/oauth/appleapp' })
      } else {
        this.$router.push({ path: '/oauth/appleweb' })
      }
    },
    touchIdLogin() {
      //ref:https://github.com/EddyVerbruggen/cordova-plugin-touch-id
      if (this.$touchid) {
        //todo 真机上点击无反映
        let self = this
        let touchIdType = null
        this.$touchid.isAvailable(
          function (type) {
            // console.log(type)  // type returned to success callback: 'face' on iPhone X, 'touch' on other devices
            touchIdType = type + 'id'
            let message =
              type === 'face'
                ? self.$t('member.touchid_scan_face')
                : self.$t('member.touchid_scan_touch')
            self.$touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
              message, // this will be shown in the native scanner popup
              self.$t('member.touchid_enter_pin'),
              function (msg) {
                // success handler: fingerprint accepted
                console.log('msg', msg)
                self.$http
                  .post(`/oauth/loginByTouchId`, {
                    id: self.device.uuid,
                    type: touchIdType
                  })
                  .then((r) => {
                    console.log(r)
                    self.onLoggedIn(r)
                  })
              },
              function (msg) {
                // error handler with errorcode and localised reason
                console.log('not ok: ' + JSON.stringify(msg))
              }
            )
          },
          function (msg) {
            // error handler: no TouchID available
            alert('not available, message: ' + msg)
          }
        )
      } else {
        console.log('touchid not initialized')
      }
    }
  },
  components: {
    LoginForm,
    MobileLoginForm,
    PageDialog
  }
}
</script>

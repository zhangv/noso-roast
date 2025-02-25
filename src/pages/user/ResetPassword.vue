<template>
  <v-container class="h-100">
    <v-text-field type="password" label="新密码" v-model="form.newpassword" />
    <v-text-field type="password" label="再次输入新密码" v-model="form.passwordconfirm" />
    <v-bottom-navigation grow fixed>
      <v-btn @click.stop="submit" block color="primary" style="color: white !important">
        确认修改
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import sha256 from 'js-sha256'

export default {
  //未登录用户重置密码
  props: ['token', 'id'], //id - mobile 或者 email
  data() {
    return {
      form: {
        newpassword: '',
        passwordconfirm: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.$api.auth.validateResetPasswordToken(
      this.token,
      this.id,
      (r) => { },
      (err) => {
        alert(err.message)
        // window.location.href = '/'
      }
    )
  },
  methods: {
    submit: function () {
      let self = this
      this.$api.auth.resetPassword(
        {
          email: this.id,
          token: this.token,
          newpassword: sha256(this.form.newpassword),
          passwordconfirm: sha256(this.form.passwordconfirm)
        },
        (r) => {
          alert('密码重置成功')
          self.$store.commit('showLogin', true, { root: true })
        },
        (err) => {
          alert(err.message)
        }
      )
    }
  },
  components: {}
}
</script>
<style></style>

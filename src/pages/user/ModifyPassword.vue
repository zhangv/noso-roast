<template>
  <v-container class="h-100">
    <v-text-field type="password" :label="$t('member.current_password')" v-model="form.oldpassword" />
    <v-text-field type="password" :label="$t('member.new_password')" v-model="form.newpassword" />
    <v-text-field type="password" :label="$t('member.new_password_confirm')" v-model="form.passwordconfirm" />

    <v-bottom-navigation value="1" grow fixed>
      <v-btn @click.stop="submit" block color="primary" class="white--text">
        {{ $t('common.confirm') }}
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import { sha256 } from 'js-sha256'

export default {
  data() {
    return {
      form: { oldpassword: '', newpassword: '', passwordconfirm: '' }
    }
  },
  methods: {
    submit: function () {
      this.$api.user.modifyPassword(
        {
          oldpassword: sha256(this.form.oldpassword),
          newpassword: sha256(this.form.newpassword),
          passwordconfirm: sha256(this.form.passwordconfirm)
        },
        (response) => {
          alert('修改成功')
          this.$store.dispatch('visitor/logout')
          this.$router.go(-1)
          this.$store.commit('showLogin', true)
        }
      )
    }
  },
  computed: {},
  mounted() { },
  components: {}
}
</script>
<style></style>

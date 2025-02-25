<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" class="justify-center">
          <v-text-field prepend-icon="mdi-at" :label="$t('login.email')" type="email" :hint="$t('login.email_hint')"
            persistent-hint outlined v-model="form.email" :error-messages="errors.email" />
        </v-col>

        <v-col cols="12" sm="6" md="4" outlined>
          <v-text-field prepend-icon="mdi-lock" type="password" :label="$t('login.password')" v-model="form.password"
            :hint="$t('login.password_hint')" persistent-hint outlined :error-messages="errors.password" />
        </v-col>
        <v-col cols="12" sm="6" md="4" outlined>
          <v-text-field prepend-icon="mdi-content-copy" type="password" :label="$t('login.password_confirm')"
            v-model="form.passwordconfirm" hint="" persistent-hint outlined :error-messages="errors.passwordconfirm" />
        </v-col>
        <v-col class="d-flex py-0 align-center justify-center">
          <v-checkbox v-model="form.accept" hide-details class="mr-0 mt-0"></v-checkbox>
          <div class="d-flex align-center" @click.stop="form.accept = !form.accept">
            {{ $t('i_accept') }}
            <page-dialog :code="`useragreement-${$i18n.locale}`">&nbsp;{{ $t('user_agreement')
            }}</page-dialog>
            &nbsp;{{ $t('and') }}
            <page-dialog :code="`privacypolicy-${$i18n.locale}`">&nbsp;{{ $t('privacy_policy')
            }}</page-dialog>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-bottom-navigation dark grow fixed>
      <v-btn block @click="save" color="primary" dark>
        {{ $t('common.submit') }}
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import sha256 from 'js-sha256'
import { useVuelidate } from '@vuelidate/core'
import { maxLength, required, email, sameAs } from '@vuelidate/validators'
import { PageDialog } from '@ui'
import { useVisitorStore } from '@/stores/visitor'
import { useRootStore } from '@/stores/root'
export default {
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    form: {
      email: { required, email, maxLength: maxLength(100) },
      password: { required },
      passwordconfirm: { required, sameAsPassword: sameAs('password') },
      accept: { required }
    }
  },
  data() {
    return {
      form: {
        email: null,
        password: '',
        passwordconfirm: '',
        accept: false
      },
      errors: {}
    }
  },
  methods: {
    ...mapActions(useVisitorStore, ['setReturnURL']),
    ...mapActions(useRootStore, ['setShowLogin']),
    save() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        let es = {}
        if (!this.$v.form.email.required)
          es.email = this.$t('errors.required')
        if (!this.$v.form.email.email)
          es.email = this.$t('errors.email_invalid')
        if (!this.$v.form.email.maxLength)
          es.email = this.$t('errors.email_invalid')
        if (!this.$v.form.password.required)
          es.password = this.$t('errors.required')
        if (!this.$v.form.passwordconfirm.required)
          es.passwordconfirm = this.$t('errors.required')
        if (!this.$v.form.passwordconfirm.sameAsPassword)
          es.passwordconfirm = this.$t('errors.password_not_same')
        this.errors = es
      } else {
        let password = sha256(this.form.password)
        let passwordconfirm = sha256(this.form.passwordconfirm)
        this.$http
          .post(
            '/user/registerByEmail',
            {
              email: this.form.email,
              password: password,
              passwordconfirm: passwordconfirm
            },
            { alertError: false }
          )
          .then((res) => {
            alert('注册成功')
            this.$router.push({ path: this.returnURL })
            this.setReturnURL(null)
            this.setShowLogin(true)
          })
          .catch((err) => {
            this.errors = err.message
          })
      }
    }
  },
  computed: {
    ...mapState(useVisitorStore, ['returnURL'])
  },
  mounted() { },
  components: {
    PageDialog
  }
}
</script>

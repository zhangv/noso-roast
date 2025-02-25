<template>
	<!-- 烘焙参数 -->
	<v-form>
		<v-card-text>
			<div class="d-flex flex-row align-center">
				{{ form.name }}
			</div>
			<div class="d-flex flex-row align-center">

				<v-text-field type="number" label="熟豆重量" v-model="form.outQty" style="max-width: 10rem">
				</v-text-field>
				克
			</div>

		</v-card-text>

		<slot name="actions" :object="form"></slot>
	</v-form>
</template>

<script>
import { clone, value } from 'lodash-es'
export default {
	props: {
		value: { type: Object, default: null }
	},
	data() {
		return {
			form: {
				outQty: 0
			}
		}
	},
	mounted() {
		if (this.value) {
			this.form = clone(this.value)
		} else this.form = {}
	},
	computed: {

	},
	watch: {
		value(v) {
			if (v) this.form = clone(v)
		}
	},
	methods: {

	}
}
</script>

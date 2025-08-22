<template>
	<!-- 价目表-->
	<div></div>
</template>
<script>
import { startsWith, trim } from 'lodash-es'

export default {
	components: {},
	props: {
		ids: {
			//改为请求参数qps
			type: String,
			default: '17,18'
		},
		type: {
			type: String,
			default: 'c'
		}
	},
	data() {
		return {
			prices: []
		}
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.$http.get(
				`/bean/pricelist`,
				{
					params: {
						beanids: this.ids,
						leveltype: this.type
					}
				},
				(r) => {
					this.prices = r
				}
			)
		}
	}
}
</script>

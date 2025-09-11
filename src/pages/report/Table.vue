<template>
	<div>
		<div>共{{ result['cnt'] }}条记录</div>

		<v-table fixed-header height="100%" density="compact">
			<thead>
				<tr>
					<th v-for="(c, j) in result['cols']" :key="j">
						{{ c.displayname }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(r, i) in result['list']" :key="i">
					<td v-for="(c, j) in result['cols']" :key="j">
						<template v-if="c.link">
							<v-btn text @click="link(c.link, r)">{{ r[c.name] }}</v-btn>
						</template>
						<template v-else>{{ r[c.name] }}</template>
					</td>
				</tr>
			</tbody>
		</v-table>
	</div>
</template>

<script>
const S = require('string')
export default {
	components: {},
	props: {
		report: { type: Object },
		result: { type: Object }
	},
	data: () => ({
		// report:null,
		menus: {},
		errors: {},
		parameters: [],
		columns: []
		// result:null
	}),
	mounted() {},
	methods: {
		linkold(template, k, v) {
			console.log('report link', template, k, v)
			let l = S(template).replaceAll(`#${k}#`, v)
			this.goTo(l)
		},
		link(template, row) {
			let str = template // 'aaaaa#a_1#vvvv#b#'
			let reg = /#[\w]+#/g
			let matched = [...str.matchAll(reg)]
			// console.log(result)
			let result = template
			console.log('report link', template, row)
			matched.forEach((e) => {
				let columnid = e[0].replaceAll('#', '') //trim ##
				result = result.replaceAll(e[0], row[columnid])
			})
			console.log('result', result)
			// let l = S(template).replaceAll(`#${k}#`, v)
			this.goTo(result)
		},
		clear() {
			this.form = {}
		}
	}
}
</script>
<style></style>

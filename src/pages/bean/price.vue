<template>
	<v-card>
		<v-card-title class="d-flex align-center">
			<template v-if="bean">{{ bean.name }}</template>
			熟豆价格表
			<v-btn color="primary" dark @click="generate">生成</v-btn>
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>

			<v-btn @click="goTo(`/price/levelmanage`)" text>价格等级</v-btn>
		</v-card-title>
		<v-card-subtitle>基础零售价：{{ bean.cprice }}元/公斤 基础批发价：{{ bean.bprice }}元/公斤</v-card-subtitle>
		<v-card-text>
			<v-table>
				<thead>
					<tr>
						<th class="text-left">等级</th>
						<th class="text-left">价格</th>
						<th class="text-left">最后修改时间</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in prices" :key="item.id">
						<td>{{ item.pricelevel ? item.pricelevel.name : '' }}</td>
						<td>{{ item.price }}</td>
						<td>{{ item.updated_at }}</td>
						<td>
							<v-btn @click="edit(item)">修改</v-btn>
							<v-btn @click="del(item)">删除</v-btn>
						</td>
					</tr>
				</tbody>
			</v-table>
		</v-card-text>
	</v-card>
	<v-dialog v-model="formDlg" max-width="600px">
		<v-card>
			<v-card-title>编辑价格（{{ bean.name }}）</v-card-title>
			<v-card-subtitle>{{ editingObj.pricelevel.name }}</v-card-subtitle>
			<v-card-text>
				<div class="d-flex flex-row align-center">
					<v-text-field
						label="价格"
						type="number"
						min="0.01"
						style="max-width: 20rem"
						v-model.number="form.price"
						:error-messages="errors.price"
					>
						<template #append>元/公斤</template>
					</v-text-field>
				</div>
			</v-card-text>
			<v-card-actions>
				<v-btn @click="save(form)">保存</v-btn>
				<v-btn @click="formDlg = false">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: {},
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			beanid: qps.beanid,
			bean: {},
			query: qps,
			prices: [],
			editingObj: {},
			formDlg: false,
			form: {},
			errors: {}
		}
	},
	mounted() {
		this.load()
		this.loadBean()
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$api2.price.search({ bean_id: this.beanid, sortBy: 'level_name' }, (r) => {
				this.prices = r.objects
			})
		},
		loadBean() {
			this.$api2.bean.getById(this.beanid, (r) => {
				this.bean = r
			})
		},
		add() {
			this.form = {}
			this.formDlg = true
		},
		edit(item) {
			this.editingObj = clone(item)
			this.form = {
				id: parseInt(item.id),
				price: parseFloat(item.price),
				pricelevel_id: parseInt(item.pricelevel_id)
			}
			this.formDlg = true
		},
		save() {
			this.$api2.price.update(
				this.form,
				(r) => {
					this.load()
					this.formDlg = false
				},
				(e) => {
					this.errors = e.message
				}
			)
		},
		generate() {
			this.$api2.bean.generatePrice(this.beanid, (r) => {
				this.load()
			})
		},
		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					let id = item.id
					this.$api.price.remove(id, (data) => {
						const index = this.objects.findIndex((e) => e.ID === id)
						if (index >= 0) this.objects.splice(index, 1)
					})
				} else {
					alert(r)
				}
			})
		}
	}
}
</script>

<style scoped></style>

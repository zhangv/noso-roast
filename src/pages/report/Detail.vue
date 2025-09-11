<template>
	<v-sheet elevation="0" class="pb-10">
		<v-card>
			<v-card-title class="d-flex align-center">
				{{ report.name }}
				<v-icon @click="goTo(`/report/update/${report.id}`)" class="ml-2">mdi-pencil</v-icon>
				<v-icon @click="goTo(`/report/chartmanage/${report.id}`)" class="ml-2">mdi-chart-areaspline</v-icon>
			</v-card-title>
			<v-card-subtitle>{{ report.description }}</v-card-subtitle>
			<v-card-text class="d-inline-flex d-flex align-center">
				<template v-for="(p, i) in parameters">
					<template v-if="p.type === 'timestamp'">
						<v-datetime-picker v-model="form[p.name]" class="d-inline" :label="p.label"></v-datetime-picker>
					</template>
					<template v-if="p.type === 'date'">
						<v-menu
							v-model="menus[p.name]"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							max-width="290px"
							min-width="290px"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="form[p.name]"
									:label="p.label"
									prepend-inner-icon="$event"
									persistent-hint
									:hint="p.description"
									readonly
									class="d-inline mr-2"
									style="max-width: 14rem !important"
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="form[p.name]"
								no-title
								@input="menus[p.name] = false"
							></v-date-picker>
						</v-menu>
					</template>
					<template v-if="p.type === 'month'">
						<v-menu
							v-model="menus[p.name]"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
							max-width="290px"
							min-width="290px"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="form[p.name]"
									class="d-inline mr-2"
									style="max-width: 10rem !important"
									:label="p.label"
									persistent-hint
									prepend-icon0="event"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="form[p.name]"
								type="month"
								no-title
								@input="menus[p.name] = false"
							></v-date-picker>
						</v-menu>
					</template>
					<template v-if="p.type === 'text'">
						<v-text-field v-model="form[p.name]" :label="p.label" style="max-width: 10rem"></v-text-field>
					</template>
					<template v-if="p.type === 'select'">
						<v-select
							v-model="form[p.name]"
							:items="getSelectOptions(p.description)"
							:label="p.label"
							persistent-hint
							class="d-inline mr-2"
							style="max-width: 10rem !important"
						/>
					</template>
					<template v-if="p.type === 'multiselect'">
						<v-checkbox
							:key="i"
							v-for="(o, i) in p.options"
							v-model="form[p.name]"
							:value="o.value"
							:label="o.text"
						/>
					</template>
					<template v-if="p.type === 'year'">
						年
						<v-select
							v-model="form[p.name]"
							:items="p.options"
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
						></v-select>
					</template>
					<template v-if="p.type === 'lastnmonthselect'">
						<v-select
							v-model="form[p.name]"
							:items="p.options"
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
						></v-select>
					</template>
					<template v-if="p.type === 'lastndayselect'">
						<v-select
							v-model="form[p.name]"
							:items="p.options"
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
						></v-select>
					</template>
					<template v-if="p.type === 'itemselect'">
						<item-selector
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
							@selected="onItemSelected($event, p)"
						/>
					</template>
					<template v-if="p.type === 'categoryselect'">
						<category-selector
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
							@selected="onCategorySelected($event, p)"
						/>
					</template>
					<template v-if="p.type === 'shopselect'">
						<shop-selector
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
							@selected="onSelected($event, p)"
						/>
					</template>
					<template v-if="p.type === 'multishopselect'">
						<shop-selector
							multiple
							:label="p.label"
							class="d-inline mr-2"
							style="max-width: 10rem !important"
							@selected="onSelected($event, p)"
						/>
					</template>
				</template>
				<v-btn @click="generate" color="primary" class="ml-3" large>生成</v-btn>
				<template v-if="result && result['cnt'] > 0">
					<v-btn-toggle class="float-right ml-2">
						<v-btn @click="sql" small>
							<v-icon>mdi-cursor-pointer</v-icon>
							SQL
						</v-btn>
						<v-btn @click="exportIt('xlsx')" small classx="float-right  ml-2">
							<v-icon>mdi-file-excel</v-icon>
							Excel
						</v-btn>
					</v-btn-toggle>
				</template>
			</v-card-text>
		</v-card>
		<v-card v-if="result" class="mt-2">
			<v-card-text>
				<report-table :report="report" :result="result"></report-table>
			</v-card-text>
		</v-card>
	</v-sheet>
</template>

<script>
import ReportTable from './Table'
import { CategorySelector, ShopSelector, UserSelector, ItemSelector } from '@ui'
import { keys, trim } from 'lodash-es'
import qs from 'qs'

export default {
	components: {
		ReportTable,
		CategorySelector,
		ShopSelector,
		UserSelector,
		ItemSelector
	},

	props: {
		id: { type: String }
	},
	data: () => ({
		form: {},
		report: {},
		menus: {},
		errors: {},
		parameters: [],
		columns: [],
		result: null
	}),
	computed: {},
	watch: {},
	mounted() {
		this.$api.common.getMeta('Report', 'STATUSLABEL,TYPELABEL', (r) => {
			this.options = r
		})
		if (this.id) {
			this.getReport(this.id).then((r) => {
				//将默认值填入form
				let paramvaluesCnt = 0
				this.parameters.forEach((e) => {
					if (e.type === 'multiselect') {
						//多选默认初始化为数组
						this.$set(this.form, e.name, [])
					}
					if (e.defaultValue) {
						this.$set(this.form, e.name, e.defaultValue)
						paramvaluesCnt++
					}
				})

				//从query中提取参数覆盖默认值
				let params = this.$route.query
				keys(params).forEach((k) => {
					if ('' === trim(params[k])) return
					if (this.form[k]) {
						this.form[k] = params[k]
					} else {
						this.form[k] = params[k]
						paramvaluesCnt++
					}
				})
				//如果参数够了，则调用generate
				if (paramvaluesCnt === this.parameters.length) {
					this.generate()
				}
			})
		}
	},
	methods: {
		getSelectOptions(description) {
			return description.split(',').map((e) => {
				let [value, text] = e.split(':')
				if (!text) {
					text = value
				}
				return {
					text: text,
					value: value
				}
			})
		},
		generate() {
			this.$loading.show()
			this.$api.report.generate(
				this.id,
				this.form,
				(r) => {
					this.result = r
					this.$loading.hide()
				},
				(e) => {
					this.$loading.hide()
					this.$alert(e)
				}
			)
		},
		exportIt(format) {
			let ps = qs.stringify(this.form)
			let url = `/report/${this.id}/generate?${ps}&export=${format}`
			this.$http
				.downloadFile({
					url: url,
					method: 'GET'
				})
				.then((response) => {
					console.log('response', response)
					// 处理下载成功的情况
					const blob = new Blob([response.data])
					const url = window.URL.createObjectURL(blob)
					const link = document.createElement('a')
					link.href = url

					// 从 Content-Disposition 头中获取文件名
					let fileName = `report_${this.id}.${format}` // 默认文件名
					const contentDisposition = response.headers['content-disposition']
					if (contentDisposition) {
						const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
						if (filenameMatch && filenameMatch[1]) {
							fileName = filenameMatch[1].replace(/['"]/g, '')
							// 解码 URL 编码的文件名
							try {
								fileName = decodeURIComponent(fileName)
							} catch (e) {
								// 如果解码失败，使用原始文件名
								console.warn('文件名解码失败:', e)
							}
						}
					}

					link.download = fileName
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					window.URL.revokeObjectURL(url)
				})
				.catch((error) => {
					// 处理下载失败的情况
					console.error('下载失败:', error)

					// 当 responseType 为 blob 时，错误响应也可能是 blob
					if (error.response && error.response.data instanceof Blob) {
						// 读取 blob 中的错误信息
						const reader = new FileReader()
						reader.onload = () => {
							try {
								const errorData = JSON.parse(reader.result)
								this.$alert(errorData.message || '下载失败，请稍后重试')
							} catch (e) {
								// 如果解析失败，显示通用错误信息
								this.$alert(`下载失败 (${error.response.status}): ${error.response.statusText}`)
							}
						}
						reader.readAsText(error.response.data)
					} else {
						// 普通错误处理
						const errorMessage = error.response?.data?.message || error.message || '下载失败，请稍后重试'
						this.$alert(errorMessage)
					}
				})
		},
		sql() {
			let ps = qs.stringify(this.form)
			this.$api.report.sql(this.id, ps, (sqlstr) => {
				this.$clipboard.copy(sqlstr, (r) => {
					alert('SQL已复制到剪贴板')
				})
			})
		},
		clear() {
			this.form = {}
		},
		getReport(id) {
			return new Promise((resolve, reject) => {
				this.$api.report.getById(
					id,
					(r) => {
						this.report = r
						this.parameters = r.parameters
						this.columns = r.columns
						resolve(true)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		onSelected(event, p) {
			this.form[p.name] = event
		},
		onCategorySelected(event, p) {
			this.form[p.name] = event[0]
		},
		onItemSelected(event, p) {
			this.form[p.name] = event[0]
		}
	}
}
</script>
<style></style>

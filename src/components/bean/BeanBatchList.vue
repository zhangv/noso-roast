<template>
  <v-sheet>
    <v-card-title v-if="title" class="d-flex align-center">
      {{ title }}
      <v-icon color="info" @click="load">$reload</v-icon>
    </v-card-title>
    <v-card-text class=" d-flex flex-row flex-wrap align-center">
      <v-text-field outlined dense v-model="query.name" label="名称" hide-details />
      <v-select outlined dense label="状态" v-model="query.status" :items="refs['statusLabels']" hide-details
        clearable></v-select>
      <v-btn color="primary" @click="search"><v-icon>$search</v-icon>查询</v-btn>
      <v-icon v-if="queryPairs.length > 0" @click="reset">$close</v-icon>
    </v-card-text>
    <v-data-table :headers="headers" :items="objects" :options.sync="options" :server-items-length="parseInt(total)"
      :loading="loading" :show-select="showSelect" :single-select="singleSelect" v-model="selected" :footer-props="{
        showFirstLastPage: true,
        showCurrentPage: true,
        itemsPerPageOptions: [10, 20, 30]
      }">
      <template v-slot:top>
        <slot name="batchActions" v-bind:selected="selected"></slot>
      </template>

      <template v-slot:item.status="{ item }">
        {{ item.status }}
      </template>
      <template v-slot:item.name="{ item }"> {{ item.code }} {{ item.name }}
      </template>
      <template v-slot:item.action="{ item }">
        <slot name="actions" v-bind:item="item"></slot>
      </template>

      <template v-slot:footer>
        <slot name="batchActions" v-bind:selected="selected"></slot>
      </template>
    </v-data-table>

  </v-sheet>
</template>

<script>
import { clone, valuesIn, toPairsIn, filter, intersection } from 'lodash-es'
import qs from 'qs'
export default {
  components: {},
  props: {
    beanId: { type: [Number, String], default: null },
    type: { type: String, default: null },
    title: { type: String, default: null },
    showSelect: { type: Boolean, default: false },
    singleSelect: { type: Boolean, default: true },
    headers: {
      type: Array,
      default: () => [
        { title: '#', value: 'id' },
        { title: '日期', align: 'left', sortable: true, value: 'date' },
        { title: '类型', sortable: true, value: 'type' },
        { title: '总数量', sortable: true, value: 'totalqty' },
        { title: '当前数量', sortable: true, value: 'currentqty' },
        { title: '状态', value: 'status' },
        { title: '', align: 'left', sortable: false, value: 'action' }
      ]
    }
  },
  data() {
    const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
    return {
      query: qps,
      currentQuery: {}, //当前结果的查询条件
      objects: [],
      total: 0,
      loading: false,
      options: {},
      refs: {},
      selected: [],
      errors: {}
    }
  },
  mounted() {

    if (this.initQuery) {
      this.query = clone(this.initQuery)
    }
  },
  computed: {
    queryValues() {
      return filter(valuesIn(this.query), (e) => !!e)
    },
    currentQueryValues() {
      return filter(valuesIn(this.currentQuery), (e) => !!e)
    },
    queryPairs() {
      return filter(toPairsIn(this.query), (e) => !!e[1])
    }
  },
  watch: {
    // options: {
    // 	handler() {
    // 		this.load()
    // 	},
    // 	deep: true
    // }
  },
  methods: {
    search() {
      if (
        this.queryValues.length !== this.currentQueryValues.length ||
        intersection(this.queryValues, this.currentQueryValues)
          .length !== this.queryValues.length
      ) {
        //条件变化
        if (this.options.page === 1) {
          //当前如果是第一页，手动触发
          this.load()
        } else {
          this.options.page = 1 //当前不是第一页，修改后通过watcher触发
        }
      } else {
        //条件没变，忽略
      }
    },
    reset() {
      this.query = {}
    },
    load() {
      let { sortBy, sortDesc, page, itemsPerPage } = this.options
      this.loading = true
      let qwp = clone(this.query)
      qwp.pageno = page
      qwp.pagesize = itemsPerPage
      qwp.sortBy = 'modifiedTime'
      if (sortBy && sortBy.length > 0) qwp.sortBy = sortBy[0]
      qwp.sortDesc = 'desc'
      if (sortDesc && sortDesc.length > 0)
        qwp.sortDesc = sortDesc[0] === false ? 'asc' : 'desc'
      this.currentQuery = clone(this.query)

      qwp['bean_id'] = this.beanId
      this.$api.roast.searchBeanBatch(
        qwp,
        (response) => {
          // console.log('response', response)
          this.objects = response.objects
          this.total = response.total
          this.loading = false
        },
        (error) => {
          this.errors = error.message
          this.loading = false
        }
      )
    }
  }
}
</script>

<style scoped>
.silent td {
  color: rgba(3, 3, 3, 0.5) !important;
}
</style>

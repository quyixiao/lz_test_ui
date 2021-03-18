<template>
  <div class="home2">
    <el-table
      size="small"
      :default-sort="{ prop: 'sortNum', order: 'ascending' }"
      :data="tableData"
      align="left"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in col"
        :key="`col_${index}`"
        :prop="col[index].prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <i
            v-if="item.label === '接口名'"
            class="el-icon-time"
            style="margin-right: 10px"
          ></i>
          <span>{{ scope.row[item.prop] }}</span>
          <p v-if="item.label === '操作'">
            <el-button size="mini" type="success">上架</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      col: [
        {
          label: '接口名',
          prop: 'date'
        },
        {
          label: '位置',
          prop: 'location'
        },
        {
          label: '广告信息',
          prop: 'content'
        },
        {
          label: '跳转url',
          prop: 'url'
        },
        {
          label: '联系人',
          prop: 'contacts'
        },
        {
          label: '开始时间',
          prop: 'startDate'
        },
        {
          label: '结束时间',
          prop: 'endDate'
        },
        {
          label: '经办人',
          prop: 'operator'
        },
        {
          label: '操作',
          prop: 'isClick'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          location: 'A5',
          content: '这个鞋子好啊',
          url: 'http://xiezi.com',
          contacts: '温州皮革城',
          startDate: '2019-08-28',
          endDate: '2019-08-31',
          operator: '小李'
        },
        {
          date: '2016-05-02',
          location: 'A1',
          content: '落魄前端炒粉',
          url: 'http://888.com',
          contacts: '陈老板',
          startDate: '2019-08-28',
          endDate: '2019-08-31',
          operator: '小李'
        },
        {
          date: '2016-05-02',
          location: 'A0',
          content: '某宝啥都有',
          url: 'http://taobao.com',
          contacts: '马总',
          startDate: '2019-08-28',
          endDate: '2019-12-01',
          operator: '大锤'
        },
        {
          date: '2016-05-02',
          location: 'A4',
          content: '时尚潮流服饰',
          url: 'http://good.com',
          contacts: '廖老板',
          startDate: '2018-09-28',
          endDate: '2019-01-10',
          operator: '狗蛋'
        },
        {
          date: '2016-05-02',
          location: 'A3',
          content: '人到中年秃不由己',
          url: 'http://666666.com',
          contacts: '土豪',
          startDate: '2019-03-28',
          endDate: '2019-06-18',
          operator: '翠花'
        },
        {
          date: '2016-05-02',
          location: 'A2',
          content: '落魄前端炒粉',
          url: 'http://dddd.com',
          contacts: '李老板',
          startDate: '2019-02-13',
          endDate: '2019-05-31',
          operator: '小黄'
        }
      ]
    }
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tbody)
    }
  }
}
</script>

<style lang="less" scoped>
.home2 {
  width: 1200px;
  margin: 0 auto;
}
</style>

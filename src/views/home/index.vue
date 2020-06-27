<template>
  <div>
    <el-table :data="tableData" style="width: 100%" height="500">
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.type==1?'腾讯视频':'天翼云盘'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span
            :style="scope.row.status==1?'color:#67C23A':scope.row.status==2?'color:#909399':'color:red'"
          >{{scope.row.status==1?'正常':scope.row.status==2?'待校验':'失效'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span style="color:#409EFF;cursor: pointer;" @click="deleteItem(scope.row._id)">删除</span>
          <span
            style="color:#409EFF;cursor: pointer;"
            @click="$router.push({path:scope.row.type==1?'./tentVideo':'/netdisc',query:{id:scope.row._id}})"
          >编辑</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getList, deleteList } from "../../api/index";
//
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getList().then(res => {
        this.tableData = res.data;
      });
    },
    deleteItem(val) {
      deleteList({ id: val }).then(res => {
        if (res.code == 200) {
          this.getData();
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
</style>
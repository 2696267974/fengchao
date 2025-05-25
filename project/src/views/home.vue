<template>
  <div class="content">
    <!-- 标题区域 -->
    <div class="title-group">
      <h2 class="title">物料关联管理</h2>
      <el-button type="primary" class="addform" size="small" @click="handleAdd">
        <i class="el-icon-plus" style="margin-right:5px;"></i>单个添加</el-button>
    </div>
    <!-- 上传区域 -->
    <el-upload class="upload-box" drag multiple action="http://localhost:3000/upload" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        点击或拖拽文件至此上传<br>
        <span class="sub-text">支持csv、xlsx、xls格式文件，单个不超过5MB</span>
      </div>
    </el-upload>
    <div class="button-group">
      <el-button size="small" class="template-btn" @click="downloadTemplate">下载模板</el-button>
      <el-button type="primary" size="small">开始导入</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <div class="table-header">
        <h2 class="sub-title">关联关系列表</h2>
        <div class="search-group">
        <el-input v-model="keyword" placeholder="请输入震坤行SKU编码、T+存货编码" class="search-input" size="small" clearable filterable>
        <el-select slot="prepend" placeholder="请选择" style="width: 120px" v-model="searchType">
           <el-option label="全部" value="1"></el-option>
           <el-option label="SKU编码" value="2"></el-option>
           <el-option label="T+存货编码" value="3"></el-option>
        </el-select>
        </el-input>
          <div class="action-btns">
            <el-button type="primary" size="small" @click="handleSearch"><i class="el-icon-search" style="margin-right:5px;"></i>查询</el-button>
            <el-button size="small" @click="exportAll"><i class="el-icon-upload2" style="margin-right:5px;"></i>导出</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <el-table :data="tableData" style="width: 100%" border fit v-loading="loading" :header-cell-style="{'background-color':'#f5f7fa'}">
      <el-table-column prop="skuCode" label="震坤行SKU编码" align="center"></el-table-column>
      <el-table-column prop="inventoryCode" label="T+存货编码" align="center"></el-table-column>
      <el-table-column prop="skuName" label="震坤行SKU名称" align="center"></el-table-column>
      <el-table-column prop="inventoryName" label="T+存货名称" align="center"></el-table-column>
      <el-table-column prop="modifyDate" label="操作时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope.row)">
          <i class="el-icon-delete danger-icon"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.queryParams.pageNum" background :page-size="this.queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 20px" :pager-count="computedPagerCount">
    </el-pagination>
    <!-- 抽屉表单 -->
    <el-drawer title="单个添加" :visible.sync="open" :size="drawerSize" :direction="drawerDirection">
      <div class="drawer-content">
        <el-form ref="form" label-width="120px" :model="form" label-position="top" style="padding: 20px" :rules="rules">
          <el-form-item label="震坤行SKU编码" prop="skuCode" class="drawer-item">
            <el-input v-model="form.skuCode" placeholder="请输入震坤行SKU编码" />
          </el-form-item>
          <el-form-item label="T+存货编码" prop="inventoryCode" class="drawer-item">
            <el-input v-model="form.inventoryCode" placeholder="请输入T+存货编码" />
          </el-form-item>
          <el-form-item label="震坤行SKU名称" prop="skuName" class="drawer-item">
            <el-input v-model="form.skuName" placeholder="请输入震坤行SKU名称" />
          </el-form-item>
          <el-form-item label="T+存货名称" prop="inventoryName" class="drawer-item">
            <el-input v-model="form.inventoryName" placeholder="请输入存货名称" />
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')" :loading="loading">{{ loading ? '提交中 ...' : '保 存' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { queryList,add,del,edit } from "@/api/index.js";
export default {
  name: "home",
  data() {
    return {
      tableData: [],
      queryParams:{
        inventoryCode:"",
        skuCode:"",
        pageNum:1,
        pageSize:10
      },
      total: 0,
      open: false,
      keyword: "",
      searchType: "1",
      form: {
        skuCode: "",
        skuName: "",
        inventoryCode: "",
        inventoryName: "",
      },
      loading: false,
      screenWidth: document.documentElement.clientWidth,

      rules: {
        skuCode: [
          {
            required: true,
            message: "震坤行SKU编码不能为空",
            trigger: "blur",
          },
        ],
        inventoryCode: [
          { required: true, message: "T+存货编码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // 响应式抽屉设置
    drawerSize() {
      return this.screenWidth < 768 ? "60%" : "40%";
    },
    drawerDirection() {
      return this.screenWidth < 768 ? "btt" : "rtl";
    },
    computedPagerCount() {
      return this.screenWidth < 768 ? 3 : 5;
    },
  },
  created() {
    this.getQueryList();
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
  handleDelete(row) {
    this.$confirm("确定删除该条数据?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        del(row.id).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getQueryList();
        }).catch((err) => {
          this.$message({
            type: "error",
            message: "删除失败",
          });
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  },

    handleUploadSuccess(res, file) {
      console.log(res, file);
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.queryParams.pageNum = 1;
      this.getQueryList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getQueryList();
    },

    handleSearch() {
    this.queryParams.skuCode = "";
    this.queryParams.inventoryCode = "";

    if(this.searchType === "1"){
      this.queryParams.skuCode = this.keyword;
      this.queryParams.inventoryCode = this.keyword;
    }else if (this.searchType === "2") {
      // 震坤行SKU编码查询
      this.queryParams.skuCode = this.keyword;
    } else if (this.searchType === "3") {
      // T+存货编码查询
      this.queryParams.inventoryCode = this.keyword;
    }
    this.queryParams.pageNum = 1;
    this.getQueryList();

    },
    handleResize() {
      this.screenWidth = document.documentElement.clientWidth;
    },

    //表格数据
    getQueryList() {
      this.loading = true;
      queryList(this.queryParams).then((res) => {
      this.tableData = res.rows.filter(item => item.isDelete === 0);
      this.total=parseInt(res.total);
      this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
    },

    cancelForm() {
      this.loading = false;
      this.open = false;
      this.reset()
    },
    handleAdd(){
      this.open=true;
      this.reset()
    },
    reset(){
      this.form={
        skuCode: "",
        skuName: "",
        inventoryCode: "",
        inventoryName: "",
      }
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if(valid) {
          add(this.form).then((res) => {
          console.log(res)
            this.open=false;
            this.$message({
              type: "success",
              message: res,
            });
            this.getQueryList();
          }).catch((err) => {
            console.log(err);
            this.$message({
              type: "error",
              message: res,
            });
          })
          
        }
      });
    },
    exportAll() {
      this.$confirm("确定要导出全部数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 导出逻辑
          this.exportToCSV()
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    exportToCSV(){
      const data=this.tableData;
      const headers = ["震坤行SKU编码", "T+存货编码", "震坤行SKU名称", "T+存货名称", "操作时间"];
      const csvContent = [
      headers.join(","), // 表头
      ...data.map(item => [
        item.skuCode,
        item.inventoryCode,
        item.skuName,
        item.inventoryName,
        item.modifyDate,
        ].join(","))
      ].join("\n");

      // 创建下载链接
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "物料关联管理.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    beforeUpload(file) {
      const isExcel = ["xls", "xlsx", "csv"].includes(
        file.name.split(".").pop()
      );
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isExcel) {
        this.$message.error("只能上传Excel文件!");
      }
      if (!isLt5M) {
        this.$message.error("文件大小不能超过5MB!");
      }
      return isExcel && isLt5M;
    },
    downloadTemplate() {
      const filePath = "/example.xlsx";
      const link = document.createElement("a");
      link.href = filePath;
      link.setAttribute("download", "模板文件.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

  },
};
</script>

<style scoped>
.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
/* 标题区域 */
.title-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  color: #303133;
  margin: 0;
  font-weight: bold;
}
.upload-box {
  margin: 20px 0;
  position: relative;
}

::v-deep .el-upload {
  width: 100%;
}
::v-deep .el-upload-dragger {
  width: 100%;
  height: 220px;
  background-color: #f9fafb;
}
.sub-text {
  color: #909399;
  font-size: 12px;
}

.button-group {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 表格区域 */
.table-container {
  margin-top: 24px;
  overflow-x: auto;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 16px;
}
.search-group {
  display: flex;
  /* flex-grow: 1; */
  gap: 10px;
}

.search-input {
  flex: 1;
  width: 400px;
}
.action-btns {
  flex-shrink: 0;
}
.el-pagination {
  margin-top: 20px;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}
/* 抽屉样式 */
.drawer-content {
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-actions {
  margin-top: 24px;
  text-align: right;
}

.danger-icon {
  color: #f56c6c;
  cursor: pointer;
  font-size: 16px;
}
/* ::v-deep .el-drawer {
  width: 400px;
} */
.sub-title {
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

.el-upload__text {
  font-size: 14px;
  line-height: 20px;
}
::v-deep .el-drawer__header {
  padding: 20px 20px;
  border-bottom: 1px solid #eeeeee;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 0px;
}
.drawer__footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #eeeeee;
  margin-top: auto;
  background-color: #f9fafb;
}
@media screen and (max-width: 768px) {
  .title-group {
    gap: 12px;
  }

  .add-btn {
    width: 100%;
  }

  /* .el-upload__text {
    font-size: 14px;
    line-height: 20px;
  } */

  .button-group {
    /* flex-direction: column; */
    width: 100%;
  }

  .button-group button {
    width: 100%;
  }

  .table-header {
    /* display: inline-block; */
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }
  /* .sub-title {
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #333;
  } */

  .search-group {
    flex-direction: column;
  }
  .action-btns {
    margin-top: 5px;
  }
  .mobile-hidden {
    display: none;
  }
  
}
@media screen and (max-width: 480px) {
  .el-table__cell {
    padding: 8px !important;
  }

  .el-drawer__header {
    padding: 16px;
  }

  /* .drawer-item {
    margin-bottom: 0px;
  } */
  .drawer__footer {
    margin-top: 20px;
  }
  .search-input {
    width: 350px;
  }

}
</style>

<template>
  <div class="content">
    <div class="title">
      <span class="text">物料关联管理</span>
      <el-button type="primary" class="add" size="small" @click="open = true">
        <i class="el-icon-plus"></i>单个添加</el-button
      >
    </div>

    <el-upload
      class="upload-box"
      drag
      action="http://localhost:3000/upload"
      multiple
      :on-success="handleUploadSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        点击或拖拽文件至此上传，支持csv、xlsx、xls格式文件，单个不超过5MB
      </div>
     <div class="button-group">
        <el-button class="upload" size="small">下载导入模版</el-button>
        <el-button type="primary" class="upload" size="small">开始导入</el-button>
     </div>
    </el-upload>
    <div class="title" style="margin-top: 20px">
      <span class="text">关联关系列表</span>
      <div class="fl-group">
      <el-input
        placeholder="请输入SKUID或物料编号"
        v-model="keyword"
        style="width: 350px;margin-right: 20px;"
        size="small"
        prefix-icon="el-icon-search"
      ></el-input>
      <el-button type="primary" size="small">查询</el-button>
      <el-button size="small">全部导出</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      highlight-current-row
    >
      <el-table-column prop="sku_code" label="震坤行SKU编码" align="center"></el-table-column>
      <el-table-column
        prop="inventry_code"
        label="T+存货编码"
        align="center"
      ></el-table-column>
       <el-table-column
        prop="sku_name"
        label="SKU名称"
        align="center"
      ></el-table-column>
       <el-table-column
        prop="inventry_code"
        label="T+存货名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <i
            class="el-icon-delete"
            @click="handleDelete(index, row)"
            style="color: red"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      background
      :page-sizes="[10, 20, 100, 500, 1000]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="100"
      style="margin-top: 20px"
    >
    </el-pagination>

    <el-drawer
    title="单个添加"
    :visible.sync="open"
    :before-close="handleClose">
    <div class="drawer_content">
      <el-form ref="form" label-width="100px" :model="form">
        <el-form-item label="SKUID" prop="sku_code"">
          <el-input v-model="form.sku_code"  placeholder="请输入震坤行SKU编码" />
        </el-form-item>
        <el-form-item label="T+存货编码" prop="inventry_code">
          <el-input v-model="form.inventry_code"  placeholder="请输入T+存货编码" />
        </el-form-item>
        <el-form-item label="存货名称" prop="inventry_name"">
          <el-input v-model="form.inventry_name" placeholder="请输入存货名称" />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
    </div>
    </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      tableData: [
        {
          sku_code: 20250001,
          inventry_code: "123456789",
          sku_name: "sku001",
          inventry_name: "存货001",
          createTime: "2025-01-01 12:00:00",
        },
        {
          sku_code: 20250002,
          inventry_code: "123456789",
          sku_name: "sku001",
          inventry_name: "存货002",
          createTime: "2025-01-01 12:00:00",
        },
      ],
      currentPage: 1,
      open: false,
      keyword:"",
      form:{
        sku_code:"",
        inventry_code:"",
        inventry_name:""
      },
      loading: false,
    };
  },
  methods: {
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleUploadSuccess(res, file) {
      console.log(res, file);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClose(done) {
     if (this.loading) {
        return;
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch(_ => {});
      },
    cancelForm() {
      this.loading = false;
      this.open = false;
      clearTimeout(this.timer);
    },
    submitForm(form) {  
      this.$refs[form].validate((valid) => {
        if (valid) {
          
          console.log(this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
.content .title {
  display: flex;
  justify-content: space-between;
  .text {
    font-size: 20px;
    font-weight: bold;
  }
}

.upload-box {
  margin-top: 20px;
}

::v-deep .el-upload {
  width: 100%;
}
::v-deep .el-upload-dragger {
  width: 100%;
  height:220px;
}

.button-group{
  margin-top: 20px;
}

.el-table {
  margin-top: 20px;
}
::v-deep .el-table .el-table__header th {
  background-color: #f9f9f9;
}

.demo-drawer__footer{
  text-align: right;
}
</style>

<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="产品编码" prop="code">
        <el-input
          v-model="code"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {
    getCategory
  } from "@/api/product/category";

  export default {
    name: "index_attr",
    data() {
      return {
        // 查询参数
        code: null,
        rules: {
          code: [{
            required: true,
            message: '请输入分类编码',
            trigger: 'blur'
          }]
        },
        logoAction: process.env.VUE_APP_BASE_API + '/api/common/file/upload?module=商品分类管理&function=分类图标上传',
      };
    },
    methods: {
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          code: null
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 修改按钮操作 */
      handleQuery() {
        getCategory(code).then(response => {
          console.log(response)
          this.open = true;
          this.title = "修改商品分类";
        });
      }

    }
  };
</script>

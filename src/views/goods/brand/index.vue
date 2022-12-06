<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="品牌名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入品牌名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.product_brand_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select
          v-model="queryParams.auditStatus"
          placeholder="字典状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.product_brand_audit_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['goods:brand:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['goods:brand:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['goods:brand:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['goods:brand:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brandList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="" align="center" prop="id"/>
      <el-table-column label="品牌名称" align="center" prop="name"/>
      <el-table-column label="英文名称" align="center" prop="englishName"/>
      <el-table-column label="图标" align="center" prop="logo">
        <template slot-scope="scope">
          <image-preview :src="file(scope.row.logo)" :width="32" :height="32"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.product_brand_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.product_brand_audit_status" :value="scope.row.auditStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['goods:brand:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['goods:brand:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAudit(scope.row)"
            v-hasPermi="['goods:brand:audit']"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLink(scope.row)"
            v-hasPermi="['goods:brand:linkCategory']"
          >关联分类
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改品牌对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item required label="品牌名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入品牌名称"/>
        </el-form-item>
        <el-form-item label="英文名称" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入英文名称"/>
        </el-form-item>
        <el-form-item required label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item required label="图标" prop="logo">
          <file-upload ref="logo" :file-list="logofileList" :uploadFileUrl="logoAction"
                       :fileType="['jpg','png','jpeg']"
                       @input="handleUploadSuccess">
          </file-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改品牌对话框 -->
    <el-dialog :title="title" :visible.sync="link" width="900px" append-to-body>
      <el-form ref="linkForm" :model="linkForm" :rules="rules" label-width="80px">
        <el-form-item required label="品牌" prop="name">
          <el-input v-model="linkForm.name" readonly/>
        </el-form-item>
        <el-form-item label="品牌" prop="linkCategory">
          <el-transfer
            filterable
            :titles="['商品分类','选中分类']"
            filter-placeholder="请输入分类名称"
            v-model="linkForm.categoryCodes"
            :data="categoryOptions">
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLink">确 定</el-button>
        <el-button @click="cancelLink">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listBrand, getBrand, delBrand, addBrand, updateBrand, listCategory, linkCategory} from "@/api/goods/brand";
  import {selectOption} from "@/api/goods/category";

  export default {
    name: "Brand",
    dicts: ['product_brand_status', 'product_brand_audit_status'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 品牌表格数据
        brandList: [],
        logofileList: [],
        categoryOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        link: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          status: null,
          auditStatus: null
        },
        logoAction: process.env.VUE_APP_BASE_API + '/api/common/file/upload?module=商品品牌管理&function=品牌图标上传',
        // 表单参数
        form: {},
        linkForm: {
          id: null,
          name: null,
          categoryCodes: [],
        },
        // 表单校验
        rules: {
          name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }],
          orderNum: [{
            required: true,
            message: '排序必填',
            trigger: 'blur'
          }],
          loge: [{
            required: true,
            message: '请上传品牌图标',
            trigger: 'blur'
          }],
        }
      };
    },
    created() {
      this.getList();
      this.getSelectOption();
    },
    methods: {
      getSelectOption() {
        selectOption().then(response => {
          for (var index in response) {
            response[index]["key"] = response[index].value
          }

          this.categoryOptions = response

        })
      },
      /** 查询品牌列表 */
      getList() {
        this.loading = true;
        listBrand(this.queryParams).then(response => {
          this.brandList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      handleLink(row) {
        this.linkForm.id = row.id
        this.linkForm.name = row.name
        this.link = true;
        listCategory(row.id).then(res => {
            this.linkForm.categoryCodes = res
          }
        );
      },
      handleAudit(row) {

      },
      file(url) {
        return process.env.VUE_APP_BASE_API + "/api/common/file/" + url;
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      cancelLink() {
        this.link = false;
        this.resetLink();
      },
      // 表单重置
      resetLink() {
        this.linkForm = {
          id: null,
          name: null,
          linkCategory: []
        };
        this.resetForm("linkForm");
      },
      reset() {
        this.form = {
          id: null,
          name: null,
          logo: null,
          orderNum: null,
          englishName: null,
          productCount: null,
          status: "0",
          remark: null,
          createTime: null,
          updateTime: null,
          updateBy: null,
          createBy: null,
          updateById: null,
          createById: null,
          auditStatus: 0
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加品牌";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getBrand(id).then(response => {
          this.form = response;
          this.open = true;
          this.title = "修改品牌";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateBrand(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addBrand(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 提交按钮 */
      submitLink() {
        linkCategory(this.linkForm).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.link = false;
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除品牌编号为"' + ids + '"的数据项？').then(function () {
          return delBrand(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('goods/brand/export', {
          ...this.queryParams
        }, `brand_${new Date().getTime()}.xlsx`)
      },
      handleUploadSuccess(res) {
        // 获取富文本组件实例
        this.form.logo = res.url
      },
    }
  };
</script>


<style>
  .el_scrollbar_wap {
    height: 200px;
  }
</style>

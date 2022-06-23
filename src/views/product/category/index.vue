<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="晨级" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入晨级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['product:category:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="categoryList"
      row-key="id"
      lazy
      :load="getList"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="分类名称" align="center" prop="name"/>
      <el-table-column label="产品编码" align="center" prop="code"/>
      <el-table-column label="分类图标" align="center" prop="logo">
        <template slot-scope="scope">
          <image-preview :src="file(scope.row.logo)" :width="32" :height="32" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.product_category_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['product:category:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['product:category:add']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:category:remove']"
          >删除
          </el-button>
          <el-button
            v-if="scope.row.level == 3"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['product:category:remove']"
          >属性编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="open" :title="title" width="500px" append-to-body>
      <el-form ref="category" :model="form" :rules="rules" size="smail" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="父分类" prop="parentId" v-if="action == 'add'">
          <el-cascader v-model="form.parentId" :options="parentIdOptions" :props="parentIdProps"
                       :style="{width: '100%'}" placeholder="请选择父分类" filterable clearable></el-cascader>
        </el-form-item>
        <el-form-item label="分类编码" prop="code" v-if="action == 'update'">
          <el-input v-model="form.code" readonly :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" placeholder="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="分类图标" prop="logo" required>
          <file-upload ref="logo" :file-list="logofileList" :uploadFileUrl="logoAction"
                       :fileType="['jpg','png','jpeg']"
                       @input="handleUploadSuccess">
          </file-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listCategory,
    getCategory,
    delCategory,
    addCategory,
    updateCategory,
    treeSelect
  } from "@/api/product/category";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "Category",
    dicts: ['product_category_status'],
    components: {
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 商品分类表格数据
        categoryList: [],
        // 商品分类树选项
        categoryOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部展开
        isExpandAll: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          parentId: null,
          name: null,
          level: null,
          code: null,
          ancestors: null,
          logo: null,
          productCount: null,
          status: null,
          orderNum: null
        },
        form: {
          name: undefined,
          parentId: null,
          code: undefined,
          orderNum: 0,
          logo: null,
        },
        rules: {
          name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }],
          orderNum: [{
            required: true,
            message: '排序',
            trigger: 'blur'
          }],
        },
        logoAction: process.env.VUE_APP_BASE_API + '/api/common/file/upload?module=商品分类管理&function=分类图标上传',
        logofileList: [],
        parentIdOptions: [],
        parentIdProps: {
          lazy: true,
          checkStrictly:true,
          emitPath:true,
          lazyLoad(node, resolve) {
            var param = {
              "parentId": node.root ? 0 : node.data.value
            }

            treeSelect(param).then(data => {
              resolve(data);
            })
          }
        },
        action:'',
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询商品分类列表 */
      file(url) {
        return process.env.VUE_APP_BASE_API+"/api/common/file/"+url;
      },
      getList(tree, treeNode, resolve) {
        this.loading = true;
        if (tree === undefined) {
          this.queryParams.parentId = 0;
          listCategory(this.queryParams).then(response => {
            this.categoryList = response;
            this.loading = false;
          });
        } else {
          this.queryParams.parentId = tree.id
          listCategory(this.queryParams).then(response => {
            resolve(response);
            this.loading = false;
          });
        }
      },

      /** 转换商品分类数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
      /** 查询商品分类下拉树结构 */
      // getTreeselect() {
      //   listCategory().then(response => {
      //     this.categoryOptions = [];
      //     const data = {id: 0, name: '顶级节点', children: []};
      //     data.children = this.handleTree(response, "id", "parentId");
      //     this.categoryOptions.push(data);
      //   });
      // },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          parentId: null,
          name: null,
          code: null,
          logo: null,
          orderNum: 0
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        this.action = 'add'
        // this.getTreeselect();

        this.open = true;
        this.title = "添加商品分类";
        if (row != null && row.ancestors) {
          this.form.parentId = row.ancestors.split(",");
        } else {
          this.form.parentId = null;
        }
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.action='update'
        // this.getTreeselect();
        // if (row != null) {
        //   this.form.parentId = row.id;
        // }
        getCategory(row.id).then(response => {
          this.form = response;
          this.open = true;
          this.title = "修改商品分类";
        });
      },
      /** 提交按钮 */
      submitForm() {
        var form = Object.assign({},this.form);
        if (form.parentId) {
          form.parentId = form.parentId.slice(-1)[0]
        }

        this.$refs["category"].validate(valid => {
          if (valid) {
            if (form.id != null) {
              updateCategory(form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCategory(form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除商品分类编号为"' + row.code + '"的数据项？').then(function () {
          return delCategory(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      handleUploadSuccess(res) {
        // 获取富文本组件实例
        this.form.logo = res.url
      }
    }
  };
</script>

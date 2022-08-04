<template>
  <div class="app-container">
    <el-descriptions title="商品分类信息">
      <el-descriptions-item label="名称">{{category.name}}</el-descriptions-item>
      <el-descriptions-item label="编码">{{category.code}}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <dict-tag :options="dict.type.product_category_status" :value="category.status"/>
      </el-descriptions-item>
    </el-descriptions>

    <el-divider/>

    <el-descriptions title="分类属性"/>

    <div class="attribute">
      <div>
        <el-form :ref="index" :model="item" :rules="rules" v-for="(item,index) in attributeList" class="layout" :key="index">
          <el-form-item required label-width="100px" label="属性名称" prop="name">
            <el-input v-model="item.name" style="width: 200px"/>
          </el-form-item>
          <el-form-item required label-width="100px" label="属性编码" prop="code">
            <el-input v-model="item.code" style="width: 200px"/>
          </el-form-item>
          <el-form-item required label-width="100px" label="取值类型">
            <el-select v-model="item.inputType" placeholder="请选择">
              <el-option
                v-for="item in dict.type.product_category_attribute_input_type"
                :key="item.value"
                :label="item.label"
                :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px" label="属性类型" prop="typeArray">
            <el-checkbox-group v-model="typeArrays[index]" >
              <el-checkbox label="1">公共</el-checkbox>
              <el-checkbox label="2">销售</el-checkbox>
              <el-checkbox label="4">关键</el-checkbox>
              <el-checkbox label="8">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label-width="80px">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(item,index)"
              v-hasPermi="['product:category:attribute:edit']"
            >保存
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(item)"
              v-hasPermi="['product:category:attribute:remove']"
            >删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form>
          <el-form-item>
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['product:category:attribute:add']"
            >新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 添加或修改商品分类属性对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入属性名称"/>
        </el-form-item>
        <el-form-item label="属性编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入属性编码"/>
        </el-form-item>
        <el-form-item required label-width="80px" label="取值类型">
          <el-select v-model="form.inputType" placeholder="请选择">
            <el-option
              v-for="item in dict.type.product_category_attribute_input_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="80px" label="属性类型" prop="typeArray">
          <el-checkbox-group v-model="form.typeArray">
            <el-checkbox label="1">公共</el-checkbox>
            <el-checkbox label="2">销售</el-checkbox>
            <el-checkbox label="4">关键</el-checkbox>
            <el-checkbox label="8">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAttribute, delAttribute, addAttribute, updateAttribute} from "@/api/product/attribute";
  import {getCategoryAttribute} from "@/api/product/category";

  export default {
    name: "Attribute",
    dicts: ['product_category_status', "product_category_attribute_input_type", "product_category_attribute_type"],
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
        typeArrays:[],
        // 总条数
        total: 0,
        // 商品分类属性表格数据
        attributeList: [],
        category: {},
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          categoryCode: null,
          type: null,
        },
        // 表单参数
        form: {
          name: null,
          type: null,
          categoryCode: null,
          inputType: null,
          typeArray: [],
          code:null
        },
        // 表单校验
        rules: {
          name: [{
            required: true,
            message: '请输入属性名称',
            trigger: 'change'
          }],
          code: [{
            required: true,
            message: '请输入属性编码',
            trigger: 'change'
          }],
          inputType: [{
            required: true,
            message: '请选择输入类型',
            trigger: 'blur'
          }]
        }
      };
    },
    created() {
      this.get();
    },
    methods: {
      /** 查询商品分类属性列表 */
      get() {
        this.loading = true;
        getCategoryAttribute(this.$route.params.categoryCode).then(response => {
          this.category = response;
          var typeArrays =[];
          for (var index in response.attributes) {
            let type = response.attributes[index].type;
            var typeArray = [];
            if ((type & 1) === 1) {
              typeArray.push("1");
            }
            if ((type & 2) === 2) {
              typeArray.push("2");
            }
            if ((type & 4) === 4) {
              typeArray.push("4");
            }
            if ((type & 8) === 8) {
              typeArray.push("8");
            }
            response.attributes[index].typeArray = typeArray;
            typeArrays.push(typeArray);
          }
          this.typeArrays = typeArrays;
          this.attributeList = response.attributes;
          this.form.categoryCode = response.code;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          name: null,
          type: null,
          inputType: null,
          typeArray: []
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.get();
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
        this.title = "添加商品分类属性";
      },
      /** 修改按钮操作 */
      handleUpdate(row, index) {
        this.$refs[index][0].validate(valid => {
          if (valid) {
            row.categoryCode = this.category.code
            var type = 0;
            for (var i in this.typeArrays[index]) {
              type += parseInt(this.typeArrays[index][i])
            }
            row.type = type;
            updateAttribute(row).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.get();
            });
          }
        });
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateAttribute(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.get();
              });
            } else {
              this.form.categoryCode = this.category.code
              var type = 0;
              for (var index in this.form.typeArray) {
                type += parseInt(this.form.typeArray[index])
              }
              this.form.type = type;
              addAttribute(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.get();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除商品分类属性编号为"' + ids + '"的数据项？').then(function () {
          return delAttribute(ids);
        }).then(() => {
          this.get();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('product/attribute/export', {
          ...this.queryParams
        }, `attribute_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>

<style>
  .attribute {
    display: grid;
    width: 100%;
    grid-template-columns: 75% auto;
  }

  .layout {
    display: flex;
  }
</style>

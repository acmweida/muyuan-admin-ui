<template>
  <div class="app-container">
    <el-descriptions title="商品分类信息">
      <el-descriptions-item label="名称">{{category.name}}</el-descriptions-item>
      <el-descriptions-item label="编码">{{category.code}}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <dict-tag :options="dict.type.goods_category_status" :value="category.status"/>
      </el-descriptions-item>
    </el-descriptions>

    <el-divider/>

    <el-descriptions title="分类属性"/>
    <div>
      <el-form>
        <el-form-item>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['category:attribute:add']"
          >新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="attributeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="属性名称" align="center" prop="name"/>
      <el-table-column label="属性编码" align="center" prop="code"/>
      <el-table-column label="取值类型" align="center" prop="inputType">
        <template slot-scope="scope">
          <el-select v-model="scope.row.inputType">
            <el-option disabled
                       v-for="item in dict.type.goods_category_attribute_input_type"
                       :key="item.value"
                       :label="item.label"
                       :value="parseInt(item.value)">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="属性类型" align="center" prop="typeArray">
        <template slot-scope="scope">
          <el-checkbox-group v-model="typeArrays[scope.$index]" disabled>
            <el-checkbox label="1">公共</el-checkbox>
            <el-checkbox label="2">销售</el-checkbox>
            <el-checkbox label="4">关键</el-checkbox>
            <el-checkbox label="8">其他</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.inputType === 2 && scope.row.valueType === 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['goods:brand:edit']"
          >编辑可选值
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(item)"
            v-hasPermi="['category:attribute:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <!-- 添加或修改商品分类属性对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入属性名称"/>
        </el-form-item>
        <el-form-item label="属性编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入属性编码"/>
        </el-form-item>
        <el-form-item required label-width="80px" label="取值类型">
          <el-select v-model="form.inputType" placeholder="请选择">
            <el-option
              v-for="item in dict.type.goods_category_attribute_input_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label-width="80px" label="值类型">
          <el-select v-model="form.valueType" placeholder="请选择">
            <el-option
              v-for="item in dict.type.goods_category_attribute_value_type"
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


    <!-- 添加或修改商品分类属性对话框 -->
    <el-dialog :title="title" :visible.sync="valueOpen" width="500px" append-to-body>
      <el-form ref="valuesForm" :model="valuesForm" :rules="rules" label-width="80px">
        <el-form-item label="属性名称" >
          {{valuesForm.name}}
        </el-form-item>
        <el-form-item label="属性编码">
          {{valuesForm.code}}
        </el-form-item>
        <el-form-item label="可选值">
          <el-tag
            :key="tag"
            v-for="tag in valuesForm.values"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Value</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormValue">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAttribute, delAttribute, addAttribute, updateAttribute,updateAttributeValue} from "@/api/goods/attribute";
  import {getCategoryAttribute} from "@/api/goods/category";

  export default {
    name: "Attribute",
    dicts: ['goods_category_status', "goods_category_attribute_input_type", "goods_category_attribute_type", "goods_category_attribute_value_type"],
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
        typeArrays: [],
        inputVisible: false,
        inputValue: '',
        // 总条数
        total: 0,
        // 商品分类属性表格数据
        attributeList: [],
        category: {},
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        valueOpen: false,
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
          code: null,
          valueType: null
        },
        valuesForm: {
          id:null,
          values:[],
          name: null,
          code:null
        },
        // 表单校验
        rules: {
          values:[{
            required:true,
            message: '请输入属性值',
            trigger: 'change'
          }],
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
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.valuesForm.values.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleClose(tag) {
        this.valuesForm.values.splice(this.valuesForm.values.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      /** 查询商品分类属性列表 */
      get() {
        this.loading = true;
        getCategoryAttribute(this.$route.params.categoryCode).then(response => {
          this.category = response;
          var typeArrays = [];
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
        this.valueOpen = false
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
        this.valuesForm = {
          id:null,
            values:[],
            name: null,
            code:null
        };
        this.resetForm("valuesForm");
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
      handleUpdate(row) {
        this.reset();
        getAttribute(row.id).then(response => {
          var attributeValues = response.attributeValues;

          var values = [];
          for (var index in attributeValues) {
              values.push(attributeValues[index].value)
          }
          response.values =values;


          this.valuesForm = response;
          this.valueOpen = true;
          this.title = "编辑可选值";
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
      /** 提交按钮 */
      submitFormValue() {
        this.$refs["valuesForm"].validate(valid => {
          if (valid) {
            if (this.valuesForm.id != null) {
              updateAttributeValue({id:this.valuesForm.id,values:this.valuesForm.values}).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.valueOpen = false;
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
        this.download('goods/attribute/export', {
          ...this.queryParams
        }, `attribute_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>

<style>

  .el-checkbox.is-disabled.is-checked > span.el-checkbox__input.is-disabled.is-checked > span {
    background-color: #00afff;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

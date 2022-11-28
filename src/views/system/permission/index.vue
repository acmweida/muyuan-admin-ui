<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="平台类型" prop="platformType">
        <el-select v-model="queryParams.platformType" placeholder="平台" size="small">
          <el-option
            v-for="dict in dict.type.platform_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分组" prop="group">
        <el-input
          v-model="queryParams.business"
          placeholder="请输入分组"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块" prop="module">
        <el-input
          v-model="queryParams.module"
          placeholder="请输入模块"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限名称" prop="resource">
        <el-input
          v-model="queryParams.resource"
          placeholder="请输入权限名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限类型" prop="action">
        <el-select v-model="queryParams.type" placeholder="权限类型" size="small">
          <el-option
            v-for="dict in dict.type.permission_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          v-hasPermi="['system:perms:add']"
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
          v-hasPermi="['system:perms:edit']"
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
          v-hasPermi="['system:perms:remove']"
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
          v-hasPermi="['system:system:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="permissionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="平台类型" align="center" prop="platformType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.platform_type" :value="scope.row.platformType"/>
        </template>
      </el-table-column>
      <el-table-column label="分组" align="center" prop="business"/>
      <el-table-column label="模块" align="center" prop="module"/>
      <el-table-column label="权限名称" align="center" prop="resource"/>
      <el-table-column label="权限类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permission_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="权限表达式" align="center" prop="perms"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:perms:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:perms:remove']"
          >删除
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

    <!-- 添加或修改权限信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="open = false ">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="平台类型" prop="platformType">
          <el-select v-model="form.platformType" placeholder="平台" size="small">
            <el-option
              v-for="dict in dict.type.platform_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="business">
          <el-input v-model="form.business" placeholder="请输入分组" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-input v-model="form.module" placeholder="请输入模块" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="resource">
          <el-input v-model="form.resource" placeholder="请输入权限名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="form.type" size="small">
            <el-option
              v-for="dict in dict.type.permission_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限表达式" prop="perms">
          <el-input v-model="form.perms" placeholder="请输入权限表达式" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" size="medium">
            <el-radio v-for="(item, index) in dict.type.sys_normal_disable" :key="index" :label="item.value"
                      :disabled="item.disabled">{{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type === 'M' || form.type === 'C' " label="关联菜单" prop="resourceRef">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍候"
            :check-strictly="true"
            :props="defaultProps"
            @check-change="handleCheckChange"
            :filter-node-method="filterNode"
          ></el-tree>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {listPermission, getPermission, delPermission, addPermission, updatePermission} from "@/api/system/permission";
  import { treeselectAll as menuTreeselect, roleMenuTreeSelect } from "@/api/system/menu";

  export default {
    name: "Permission",
    dicts: ['sys_normal_disable', 'platform_type', "permission_type"],
    data() {
      const checkResourceRef = (role,value,callback) => {
          if ((this.form.type === "M" || this.form.type === "C")  &&
            (this.form.resourceRef === null  || this.form.resourceRef === "" )) {
              callback(new Error("必须选择关联菜单或目录！"))
          } else {
            callback();
          }
      }
      return {
        filterText: '',
        defaultProps: {
          children: "children",
          label: "label"
        },
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
        // 权限信息表格数据
        permissionList: [],
        // 菜单列表
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          business: null,
          module: null,
          resource: null,
          type: null,
          perms: null,
          status: null,
          platformType: "0",
          resourceRef: null,
        },
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        menuExpand: false,
        menuNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 表单参数
        form: {
          platformType:"0",
          status: "0",
          resourceRef:null
        },
        // 表单校验
        rules: {
          platformType: [{
            required: true,
            message: '请选择运营平台',
            trigger: 'change'
          }],
          business: [{
            required: true,
            message: '请输入分组',
            trigger: 'blur'
          }],
          module: [{
            required: true,
            message: '请输入模块',
            trigger: 'blur'
          }],
          resource: [{
            required: true,
            message: '请输入权限名称',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请选择权限类型',
            trigger: 'change'
          }],
          perms: [{
            required: true,
            message: '请输入权限表达式',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '状态不能为空',
            trigger: 'change'
          }],
          resourceRef:[{
            validator : checkResourceRef,trigger:"change"
          }]
        }
      };
    },
    watch: {
      filterText(val) {
        this.$refs.menu.filter(val);
      }
    },
    created() {
      this.getList();
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      /** 查询权限信息列表 */
      getList() {
        this.loading = true;
        listPermission(this.queryParams).then(response => {
          this.permissionList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询菜单树结构 */
      getMenuTreeselect() {
        menuTreeselect(this.queryParams.platformType).then(data => {
          this.menuOptions = data;
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
          business: null,
          module: null,
          resource: null,
          type: null,
          perms: null,
          status: "0",
          platformType: "0"
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
      // 菜单选择事件
      handleCheckChange(data,chained,indeterminate) {
        if (chained) {
          let value = [data.id];
          this.$refs.menu.setCheckedKeys(value);
        }
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'menu') {
          let treeList = this.menuOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
          }
        } else if (type == 'dept') {
          let treeList = this.deptOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
          }
        }
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
        this.getMenuTreeselect();
        this.open = true;
        this.title = "添加权限信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getMenuTreeselect();
        const id = row.id || this.ids
        getPermission(id).then(response => {
          this.form = response;
          this.open = true;
          this.title = "修改权限信息";
          this.$refs.menu.setChecked(parseInt(response.resourceRef), true ,false);
        });
      },
      // 所有菜单节点数据
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys();
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
      /** 提交按钮 */
      submitForm() {
        var menuId = this.getMenuAllCheckedKeys();
        this.form.resourceRef = menuId.length === 0 ? null : menuId[0];
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updatePermission(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPermission(this.form).then(response => {
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
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除权限信息编号为"' + ids + '"的数据项？').then(function () {
          return delPermission(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('user/permission/export', {
          ...this.queryParams
        }, `permission_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>

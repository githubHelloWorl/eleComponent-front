<template>
<!-- 唯一div -->
<div class="search">
    <!-- 卡片盒子 -->
    <Card>
        <!-- 上方按钮与搜索层 -->
        <Row v-show="openSearch" @keydown.enter.native="handleSearch">
            <!-- Form父级盒子 -->
            <Form ref="searchForm" :model="searchForm" inline :label-width="0">
                <!-- 样式盒子 -->
                <Form-item ref="searchForm" :model="searchForm" inline :label-width="0" style="display:flex;">
                    <!-- 元器件名称子级盒子 -->
                    <Form-item label="" prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="元器件名称" clearable style="width: 120px" />
                    </Form-item>
                    <Form-item label="" prop="buyUser">
                        <Input type="text" v-model="searchForm.buyUser" placeholder="采购人" clearable style="width: 120px" />
                    </Form-item>
                    <Form-item label="" prop="giveName">
                        <Input type="text" v-model="searchForm.giveName" placeholder="领用人" clearable style="width: 120px" />
                    </Form-item>
                    <Form-item label="" prop="warehouse">
                        <Select v-model="searchForm.warehouse" placeholder="仓库" style="width:120px">
                            <Option v-for="(item,index) in wareList" :value="item.id" :key="index">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="" prop="buyDate">
                        <DatePicker type="daterange" @on-change="changeBuyDate" format="yyyy-MM-dd" placeholder="采购日期" style="width: 200px"></DatePicker>
                    </Form-item>
                    <!-- 按钮层 -->
                    <Form-item style="margin-left:10px;" class="br">
                        <!-- 搜索按钮 -->
                        <Button @click="handleSearch" type="primary" icon="ios-search" size="small" ghost shape="circle">搜索</Button>
                        <!-- 重置按钮 -->
                        <Button @click="handleReset" type="warning" size="small" ghost shape="circle" icon="md-refresh">重置</Button>
                        <!-- 新增按钮 -->
                        <Button @click="manyEdit" type="info" icon="md-trash" size="small" ghost shape="circle">批量出库</Button>
                        <Button @click="delAll" type="error" icon="md-trash" size="small" ghost shape="circle">批量销毁</Button>
                        <!-- 删除按钮 -->
                        <Button @click="excelData" type="success" icon="md-paper-plane" size="small" ghost shape="circle">导出</Button>
                    </Form-item>
                    <!-- 右侧俩按钮栏 -->
                    <Form-item style="position:fixed;right:50px;top:110px">
                        <!-- 列筛选按钮 -->
                        <Poptip trigger="hover" content="自定义表格的显示列,适应屏幕显示" placement="left">
                            <Button type="info" @click="showFilterPanelFlag = !showFilterPanelFlag" class="showFilterPanelFlag" icon="ios-settings" size="small" ghost>列筛选
                            </Button>
                        </Poptip>
                        <!-- 使用教程按钮 -->
                        <Poptip trigger="hover" content="点我查看本模块的使用教程" placement="left">
                            <Button type="warning" @click="modal1 = true" class="showFilterPanelFlag" icon="md-help" size="small" ghost>使用教程
                            </Button>
                        </Poptip>
                        <!-- 使用教程内容弹窗 -->
                        <Modal v-model="modal1" title="使用教程">
                            <p>1.XXXXXXXXXXXXXXXXXXXXXXXX</p>
                            <p>2.XXXXXXXXXXXXXXXXXXXXXXXX</p>
                            <p>3.XXXXXXXXXXXXXXXXXXXXXXXX</p>
                        </Modal>
                    </Form-item>
                </Form-item>
            </Form>
        </Row>
        <!-- 样式盒子 -->
        <Row class="operation" style="position:relative;">
            <transition>
                <div v-show="showFilterPanelFlag" class="filter-panel">
                    <CheckboxGroup v-model="selected">
                        <div v-for="item in mycolumns" :key="item.key" v-if="item.title != null">
                            <Checkbox :label="item.title" style="margin: 2px 5px"></Checkbox>
                        </div>
                    </CheckboxGroup>
                </div>
            </transition>
        </Row>
        <!-- 样式层 -->
        <Row v-show="openTip"> </Row>
        <!-- 表格层盒子 -->
        <Row :gutter="16">
            <!-- 根据后台数据生成的表格 -->
            <Col span="24">
            <Table :loading="loading" :height="tableHeight" border stripe size="small" :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect" @on-row-click="rowClick" :row-class-name="rowClassNmae"></Table>
            </Col>
        </Row>
        <!-- 分页栏 -->
        <Row type="flex" justify="end" class="page">
            <!-- 分页器,可控制每页显示的条数 -->
            <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[15, 20, 50, 100, 200]" size="small" show-total show-elevator show-sizer></Page>
        </Row>
    </Card>
    <!-- 弹窗 -->
    <Modal v-model="outWageModel" :title="outWageTitle" draggable :z-index="outWageModelIndex" :ok-text="outWageOkText" @on-ok="outWageFx">
        <!-- 比例16子盒子 -->
        <Row :gutter="16">
            <Col span="24">
            出库方式：
            <Select v-model="outWageType" style="width:100%">
                <Option value="1">按人领用</Option>
                <Option value="2">按部门领用</Option>
                <Option value="3" :disabled="editType!=0">销毁出库</Option>
            </Select>
            </Col>
        </Row>
        <Divider />
        <!-- 比例16子盒子 -->
        <Row :gutter="16" v-show="outWageType == '1'">
<!--            当前选择员工：{{ outWageName }}-->
          当前选择员工：{{ tempUserNameStr }}
            <AutoComplete v-model="tempUserNameStr" :data="autoCompleteData" clearable @on-change="selectByNameFx" @on-select="selectByNameFx2" placeholder="请选择领用人..." style="width:100%"></AutoComplete>
        </Row>
        <!-- 比例16子盒子 -->
        <Row :gutter="16" v-show="outWageType == '2'">
            <Col span="24">
            请选择领用部门：
            <Select v-model="outWageId" clearable style="width:100%">
                <Option value="1">总经办</Option>
                <Option value="2">行政综合部</Option>
                <Option value="3">人力资源部</Option>
                <Option value="4">财务部</Option>
                <Option value="5">设计研发</Option>
                <Option value="6">产品应用</Option>
                <Option value="7">业务部</Option>
                <Option value="8">品牌发展部</Option>
                <Option value="9">市场部</Option>
                <Option value="10">综合发展部</Option>
                <Option value="11">客服部</Option>
                <Option value="12">培训部</Option>
            </Select>
            </Col>
        </Row>
    </Modal>
</div>
</template>

<script>
import {
    getAdminAssetsList,
    deleteAdminAssets,
    outWage,
    getAutoCompleteNames,
    getAllWareList
} from "./api.js";
import departmentChoose from "./department-choose.vue";
import userSelect from "./userSelect.vue";
export default {
    name: "single-window",
    components: {
        userSelect,
        departmentChoose,
    },
    data() {
        return {
            outWageTitle: "",
            outWageOkText: "",
            editType: 0,
            tempUserNameStr: "",
            autoCompleteData: [],
            tableHeight: 500,
            showOwnerWindowFlag: false,
            outWageModelIndex: "1100",
            outWageModel: false,
            outWageType: "1",
            outWageId: 0,
            outWageName: "未选择领用人",
            selected: [
                "选择",
                "序号",
                "元器件编码",
                "元器件名称",
                "型号",
                "领用人",
                "计量单位",
                "仓库",
                "元器件状态",
                "采购日期",
                "采购人",
                "领用情况",
                "领用操作人",
                "是否被申请",
                "操作",
            ],
            modal1: false,
            openSearch: true, // 显示搜索
            openTip: true, // 显示提示
            formData: {},
            loading: true, // 表单加载状态
            searchForm: {
                // 搜索框初始化对象
                pageNumber: 1, // 当前页数
                pageSize: 15, // 页面大小
                sort: "createTime", // 默认排序字段
                order: "desc", // 默认排序方式
            },
            selectList: [], // 多选数据
            selectCount: 0, // 多选计数
            selectRow: {
                id: "",
            },
            columns: [{
                    type: "selection",
                    width: 60,
                    title: "选择",
                    align: "center",
                    fixed: "left",
                },
                {
                    title: "序号",
                    width: 85,
                    align: "center",
                    fixed: "left",
                    sortType: true,
                    render: (h, params) => {
                        return h(
                            "span",
                            params.index +
                            (this.searchForm.pageNumber - 1) * this.searchForm.pageSize +
                            1
                        );
                    },
                },
                {
                    title: "元器件编码",
                    key: "code",
                    minWidth: 180,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "元器件名称",
                    key: "name",
                    minWidth: 200,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "型号",
                    key: "model",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "领用人",
                    key: "giveName",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                    render: (h, params) => {
                        if (params.row.outFlag == 0) {
                            return h("div", [
                                "[ 尚未领用 ]"
                            ]);
                        } else {
                            return h("div", [
                                params.row.giveName
                            ]);
                        }
                    },
                },
                {
                    title: "计量单位",
                    key: "unit",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "仓库",
                    key: "warehouseName",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "元器件状态",
                    key: "status",
                    sortType: "desc",
                    minWidth: 180,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                    render: (h, params) => {
                        if (params.row.status == 0) {
                            return h("div", [
                                h(
                                    "span", {
                                        style: {
                                            color: "#000000",
                                        },
                                    },
                                    "正常"
                                ),
                            ]);
                        } else {
                            return h("div", [
                                h(
                                    "span", {
                                        style: {
                                            color: "#ff0000",
                                        },
                                    },
                                    "[ 已销毁 ]"
                                ),
                            ]);
                        }
                    },
                },
                {
                    title: "采购人",
                    key: "buyUser",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "采购日期",
                    key: "buyDate",
                    minWidth: 160,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "领用情况",
                    key: "outFlag",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                    render: (h, params) => {
                        if (params.row.outFlag == 0) {
                            return h("div", [
                                h(
                                    "span", {
                                        style: {
                                            color: "#ff9900",
                                        },
                                    },
                                    "[ 未被领用 ]"
                                ),
                            ]);
                        } else {
                            return h("div", [
                                "[ 已领用 ]"
                            ]);
                        }
                    },
                },
                {
                    title: "领用操作人",
                    key: "outWork",
                    sortable: true,
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "领用操作时间",
                    key: "outTime",
                    sortable: true,
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "是否被申请",
                    key: "applyFlag",
                    minWidth: 150,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                    render: (h, params) => {
                        if (params.row.applyFlag == 0) {
                            return h("div", [
                                "[ 尚未申请 ]"
                            ]);
                        } else {
                            return h("div", [
                                params.row.applyUser + "已申请"
                            ]);
                        }
                    },
                },
                {
                    title: "申请时间",
                    key: "applyTime",
                    sortable: true,
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "销毁人",
                    key: "destroyName",
                    sortable: true,
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "销毁时间",
                    key: "destroyTime",
                    sortable: true,
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "创建者",
                    key: "createBy",
                    sortable: true,
                    minWidth: 100,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "修改时间",
                    key: "updateTime",
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "修改者",
                    key: "updateBy",
                    minWidth: 100,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    width: 300,
                    fixed: "right",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button", {
                                    props: {
                                        type: "success",
                                        size: "small",
                                        ghost: true,
                                        icon: "ios-settings",
                                        disabled: params.row.outFlag < 1 || params.row.status > 0
                                    },
                                    style: {
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row, 1);
                                        },
                                    },
                                },
                                "更换领用"
                            ),
                            h(
                                "Button", {
                                    props: {
                                        type: "primary",
                                        size: "small",
                                        ghost: true,
                                        icon: "ios-create-outline",
                                        disabled: params.row.outFlag > 0 || params.row.status > 0,
                                    },
                                    style: {
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row, 0);
                                        },
                                    },
                                },
                                "出库"
                            ),
                            h(
                                "Button", {
                                    props: {
                                        type: "error",
                                        size: "small",
                                        ghost: true,
                                        icon: "ios-create-outline",
                                        disabled: params.row.outFlag > 0 || params.row.status > 0,
                                    },
                                    style: {
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row);
                                        },
                                    },
                                },
                                "销毁"
                            )
                        ]);
                    },
                },
            ],
            data: [], // 表单数据
            pageNumber: 1, // 当前页数
            pageSize: 10, // 页面大小
            total: 0, // 表单数据总数
            showFilterPanelFlag: false,
            wareList: []
        };
    },
    methods: {
        // 加载调用
        init() {
            this.getDataList();
            this.getAllWareListFx();
        },
        changeBuyDate(e) {
            if (e.length > 1) {
                this.searchForm.buyDate = e[0] + "ZWZ@ZWZ" + e[1];
            } else {
                this.searchForm.buyDate = "";
            }
        },
        getAllWareListFx() {
            var that = this;
            getAllWareList().then(res => {
                if (res.success) {
                    that.wareList = res.result;
                }
            })
        },
        selectByNameFx() {
            var that = this;
            // TODO 去除systemId
            if (that.tempUserNameStr != "") {
                getAutoCompleteNames({
                    str: that.tempUserNameStr
                }).then((res) => {
                    that.autoCompleteData = res.result;
                });
            }
        },
        selectByNameFx2(e) {
            this.outWageId = e;
            this.outWageName = e;
        },
        // 提交
        ownerSubmited(e) {
            this.outWageId = e.id;
            this.outWageName = e.username;
            this.showOwnerWindowFlag = false;
        },
        // 按人出库
        openShowOwnerWindowFlag(e) {
            this.showOwnerWindowFlag = true;
        },
        // 确认出库
        outWageFx() {
            var that = this;
            var assetId = this.selectRow.id;
            outWage({
                ids: assetId,
                type: that.outWageType,
                userId: that.outWageId,
                nickName: that.tempUserNameStr,
            }).then((res) => {
                if (res.success) {
                    this.$Message.success("操作成功");
                    that.getDataList();
                }
            });
        },
        // 当前页数
        changePage(v) {
            this.searchForm.pageNumber = v;
            this.getDataList();
            this.clearSelectAll();
        },
        // 页面大小
        changePageSize(v) {
            this.searchForm.pageSize = v;
            this.getDataList();
        },
        // 表格点击
        rowClick(row, index) {
            this.selectRow = row;
        },
        // 表格类名添加
        rowClassNmae(row, index) {
            if (row.id == this.selectRow.id) {
                return "rowClassNmaeColor";
            }
            return "";
        },
        // 导出Excel
        excelData() {
            this.$refs.table.exportCsv({
                filename: "导出结果",
            });
        },
        // 搜索
        handleSearch() {
            this.searchForm.pageNumber = 1;
            this.searchForm.pageSize = 15;
            this.getDataList();
        },
        // 重置搜索条件
        handleReset() {
            this.$refs.searchForm.resetFields();
            this.searchForm.pageNumber = 1;
            this.searchForm.pageSize = 15;
            this.getDataList();
        },
        // 切换查询排序规则
        changeSort(e) {
            this.searchForm.sort = e.key;
            this.searchForm.order = e.order;
            if (e.order === "normal") {
                this.searchForm.order = "";
            }
            this.getDataList();
        },
        // 全选
        clearSelectAll() {
            this.$refs.table.selectAll(false);
        },
        // 多选
        changeSelect(e) {
            this.selectList = e;
            this.selectCount = e.length;
        },
        // 编辑
        edit(e, v) {
            this.editType = v;
            this.selectRow = e;
            if (v == 0) {
                this.outWageTitle = e.name + "元器件出库";
                this.outWageOkText = "确认出库";
            } else {
                this.outWageTitle = e.name + "元器件领用变更";
                this.outWageOkText = "确认变更";
            }
            this.outWageModel = true;
        },
        // 出库编辑
        manyEdit() {
            if (this.selectCount <= 0) {
                this.$Message.warning("您还未选择要出库的元器件");
                return;
            }
            let ids = "";
            this.selectList.forEach(function (e) {
                if (e.outFlag == 0 && e.status == 0) {
                    ids += e.id + ",";
                }
            });
            if (ids == "") {
                this.$Message.warning("您选择的元器件已出库或销毁");
                return;
            }
            ids = ids.substring(0, ids.length - 1);
            this.selectRow.id = ids;
            this.outWageModel = true;
        },
        // 获取渲染
        getDataList() {
            this.loading = true;
            getAdminAssetsList(this.searchForm).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.data = res.result.records;
                    this.total = res.result.total;
                }
            });
        },
        // 删除
        remove(v) {
            this.$Modal.confirm({
                title: "确认销毁该元器件",
                content: "确认销毁该元器件!",
                loading: true,
                onOk: () => {
                    deleteAdminAssets({
                        ids: v.id
                    }).then((res) => {
                        this.$Modal.remove();
                        if (res.success) {
                            this.$Message.success("操作成功");
                            this.getDataList();
                        }
                    });
                },
            });
        },
        // 批量删除
        delAll() {
            if (this.selectCount <= 0) {
                this.$Message.warning("您还未选择要删除的数据");
                return;
            }
            this.$Modal.confirm({
                title: "确认删除",
                content: "您确认要销毁所选的 " + this.selectCount + " 个元器件?",
                loading: true,
                onOk: () => {
                    let ids = "";
                    this.selectList.forEach(function (e) {
                        ids += e.id + ",";
                    });
                    ids = ids.substring(0, ids.length - 1);
                    // 批量删除
                    deleteAdminAssets({
                        ids: ids
                    }).then((res) => {
                        this.$Modal.remove();
                        if (res.success) {
                            this.$Message.success("操作成功");
                            this.clearSelectAll();
                            this.getDataList();
                        }
                    });
                },
            });
        },
    },
    mounted() {
        this.init();
        this.tableHeight = Number(window.innerHeight - 290);
        // 列筛选
        this.mycolumns = this.columns;
        let showcolumns = [];
        for (var i = 0; i < this.selected.length; i++) {
            var item = this.selected[i];
            for (var j = 0; j < this.columns.length; j++) {
                if (this.columns[j].title == item) {
                    showcolumns.push(this.columns[j]);
                }
            }
        }
        this.columns = showcolumns;
    },
    watch: {
        // 列筛选
        selected: function (newcolumns) {
            let showcolumns = [];
            for (var i = 0; i < this.mycolumns.length; i++) {
                var item = this.mycolumns[i];
                if (item.title == undefined) showcolumns.push(item);
                else if (newcolumns.includes(item.title)) showcolumns.push(item);
            }
            this.columns = showcolumns;
        },
    },
};
</script>

<style lang="less">
.search {
    padding-top: 0px;

    .operation {
        margin-bottom: 2vh;
    }

    .select-count {
        font-weight: 600;
        color: #40a9ff;
    }

    .select-clear {
        margin-left: 10px;
    }

    .page {
        margin-top: 2vh;
    }

    .drop-down {
        margin-left: 5px;
    }
}

.filter-panel {
    width: 166px;
    min-height: 120px;
    height: 200px;
    position: absolute;
    background-color: white;
    z-index: 9999;
    margin-left: 1px;
    overflow-y: scroll;
    border: 1px solid blue;
    top: 35px;
    right: 10px;
}

.openSearch {
    position: absolute;
    right: 240px;
}

.openTip {
    position: absolute;
    right: 130px;
}

.showFilterPanelFlag {
    position: static !important;
    right: 10px;
    margin-right: 10px;
}

.ivu-table td {
    height: 38px !important;
}

.ivu-table-cell-with-expand {
    height: 38px !important;
    line-height: 38px !important;
}

.ivu-table .rowClassNmaeColor td {
    background-color: #b0b3b6 !important;
    color: #515A6E !important;
    font-size: 14px;
}

.spanTS {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
}
</style>

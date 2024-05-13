<template>
<!-- 唯一div -->
<div class="search">
    <!-- 卡片盒子 -->
    <Card>
        <!-- 上方按钮与搜索层 -->
        <Row v-show="openSearch">
            <!-- Form父级盒子 -->
            <Form ref="searchForm" :model="searchForm" inline :label-width="0">
                <!-- 样式盒子 -->
                <Form-item ref="searchForm" :model="searchForm" inline :label-width="0" style="display:flex;">
                    <!-- 元器件名称子级盒子 -->
                    <Form-item label="" prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="元器件名称" clearable style="width: 240px" />
                    </Form-item>
                    <!-- 按钮层 -->
                    <Form-item style="margin-left:10px;" class="br">
                        <!-- 搜索按钮 -->
                        <Button @click="handleSearch" type="primary" icon="ios-search" size="small" ghost shape="circle">搜索</Button>
                        <!-- 重置按钮 -->
                        <Button @click="handleReset" type="warning" size="small" ghost shape="circle" icon="md-refresh">重置</Button>
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
</div>
</template>

<script>
import {
    getByNotAuditPage,
    deleteAdminAssets,
    outWage,
    getAutoCompleteNames,
    getAllWareList,
    disApplyAssets,
    applySuccessAssets,
    applyFailAssets
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
            tableHeight: 500,
            showOwnerWindowFlag: false,
            selected: [
                "选择",
                "序号",
                "元器件编码",
                "元器件名称",
                "申请人",
                "申请时间",
                "采购序号",
                "计量单位",
                "型号",
                "采购人",
                "采购日期",
                "仓库",
                "元器件状态",
                "领用情况",
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
                warehouse: "1564489653061554176",
                status: 0,
                outFlag: 0,
                applyFlag: 0
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
                    key: "id",
                    minWidth: 200,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "元器件名称",
                    key: "name",
                    minWidth: 180,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "申请人",
                    key: "applyUser",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "申请时间",
                    key: "applyTime",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "采购序号",
                    key: "assIndex",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
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
                    title: "型号",
                    key: "model",
                    minWidth: 120,
                    sortable: true,
                    align: "center",
                    tooltip: true,
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
                    width: 260,
                    fixed: "right",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button", {
                                    props: {
                                        type: "success",
                                        size: "small",
                                        ghost: true,
                                        icon: "ios-settings"
                                    },
                                    style: {
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: () => {
                                            this.applySuccessAssetsFx(params.row);
                                        },
                                    },
                                },
                                "审核通过"
                            ),
                            h(
                                "Button", {
                                    props: {
                                        type: "warning",
                                        size: "small",
                                        ghost: true,
                                        icon: "ios-settings"
                                    },
                                    style: {
                                        marginRight: "5px",
                                    },
                                    on: {
                                        click: () => {
                                            this.applyFailAssetsFx(params.row);
                                        },
                                    },
                                },
                                "审核驳回"
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
        applySuccessAssetsFx(e) {
            var that = this;
            this.$Modal.confirm({
                title: "确认审核通过",
                content: "确认审核通过",
                loading: true,
                onOk: () => {
                    applySuccessAssets({
                        id: e.id
                    }).then((res) => {
                        this.$Modal.remove();
                        if (res.success) {
                            this.$Message.success("通过成功");
                            that.getDataList();
                        }
                    });
                },
            });
        },
        applyFailAssetsFx(e) {
            var that = this;
            this.$Modal.confirm({
                title: "确认审核驳回",
                content: "确认审核驳回",
                loading: true,
                onOk: () => {
                    applyFailAssets({
                        id: e.id
                    }).then((res) => {
                        this.$Modal.remove();
                        if (res.success) {
                            this.$Message.success("驳回成功");
                            that.getDataList();
                        }
                    });
                },
            });
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
            if (that.tempUserNameStr != "") {
                getAutoCompleteNames({
                    str: that.tempUserNameStr,
                    systemId: "",
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
            getByNotAuditPage(this.searchForm).then((res) => {
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

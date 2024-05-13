<template>
<div>
    <Drawer title="导入元器件品类" closable v-model="visible" draggable width="1600">
        <Row>
            <Form ref="huasearchForm" :model="huasearchForm" inline :label-width="70">
                <Form-item label="元器件名">
                    <Input type="text" v-model="huasearchForm.name" clearable placeholder="元器件名..." style="width: 150px" />
                </Form-item>
                <Form-item label="元器件编码">
                    <Input type="text" v-model="huasearchForm.code" clearable placeholder="元器件编码..." style="width: 150px" />
                </Form-item>
                <Form-item label="规格">
                    <Input type="text" v-model="huasearchForm.gg" clearable placeholder="元器件规格..." style="width: 150px" />
                </Form-item>
                <Form-item label="分类">
                    <Cascader :data="cascaderData" change-on-select @on-change="changeSearchType" placeholder="元器件分类..." style="width: 180px"></Cascader>
                </Form-item>
                <Form-item>
                    <Button @click="huahandleSearch" type="primary" icon="ios-search" size="small" ghost shape="circle">搜索</Button>
                    <Button @click="huahandleReset" type="warning" size="small" ghost shape="circle" icon="md-refresh" style="margin-left: 10px;">重置</Button>
                </Form-item>
            </Form>
        </Row>
        <Row v-show="openTip">
            <Alert show-icon>
                已选择
                <span class="select-count">{{huaselectCount}}</span> 项
                <a class="select-clear" @click="huaclearSelectAll">清空</a>
            </Alert>
        </Row>
        <Row :gutter="16">
            <Col span="24">
            <Table :loading="hualoading" :height="tableHeight" border stripe size="small" :columns="userColumns" :data="huaData" sortable="custom" @on-sort-change="huachangeSort" @on-row-dblclick="huashowHuaSelect" ref="table1"></Table>
            </Col>
        </Row>
        <Row type="flex" justify="end" class="page">
            <Page :current="huasearchForm.pageNumber" :total="huaTotal" :page-size="huasearchForm.pageSize" @on-change="huachangePage" @on-page-size-change="huachangePageSize" :page-size-opts="[20,50,100,200]" size="small" show-total show-elevator show-sizer></Page>
        </Row>
        <span style="font-size:18px;color:#ff9900">请双击导入元器件品类!</span>
        <Button type="primary" @click="closeWindow">退出</Button>
        <Divider>没有你要采购的元器件？在下面快速新增！</Divider>
        <Form inline :label-width="100">
            <Row :gutter="16">
                <Col span="8">
                <Form-item label="元器件品类名称" style="width:100%">
                    <Input type="text" v-model="fastAddName" clearable placeholder="请输入元器件品类名称..." />
                </Form-item>
                </Col>
                <Col span="8">
                <FormItem label="分类" prop="type" style="width:100%">
                    <Cascader :data="cascaderData" v-model="cascaderValue" placeholder="请选择元器件分类..."></Cascader>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="型号" prop="xh" style="width:100%">
                    <Input v-model="fastAddModal" clearable placeholder="请输入元器件品类型号..." />
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="16" type="flex" justify="center">
                <Button type="success" ghost @click="fastInsertAdminAssetFx">快速新增并导入</Button>
            </Row>
            <Divider />
        </Form>
    </Drawer>
</div>
</template>

<script>
import {
    getAdminAssetList,
    fastInsertAdminAsset,
    getTypeCascaderData
} from "./api.js";
import dict from "@/views/template/dict";
export default {
    name: "add",
    components: {
        dict
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object
        },
    },
    watch: {
        value(val) {
            this.setCurrentValue(val);
        },
        visible(value) {
            this.$emit("input", value);
        }
    },
    data() {
        return {
            tableHeight: 500,
            cascaderData: [],
            cascaderValue: [],
            fastAddName: "",
            fastAddType: "办公设备",
            fastAddModal: "",
            showValue: false,
            visible: this.value,
            title: "",
            submitLoading: false,
            maxHeight: 510,
            form: {},
            formValidate: {},
            roleList: [],
            userColumns: [{
                    title: "元器件编码",
                    key: "code",
                    width: 120,
                    align: "center",
                    fixed: "left",
                },
                {
                    title: "名称",
                    key: "name",
                    minWidth: 300,
                    align: "center",
                    tooltip: true,
                    fixed: "left",
                },
                {
                    title: "大类",
                    key: "type2",
                    minWidth: 120,
                    align: "center"
                },
                {
                    title: "分类",
                    key: "type",
                    minWidth: 120,
                    align: "center",
                },
                {
                    title: "规格",
                    key: "gg",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "型号",
                    key: "xh",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "单位",
                    key: "jldw",
                    minWidth: 120,
                    align: "center",
                },
                {
                    title: "销售价",
                    key: "xsj",
                    minWidth: 130,
                    align: "center",
                    sortable: true,
                },
                {
                    title: "采购状态",
                    key: "status1",
                    minWidth: 120,
                    align: "center",
                    render: (h, params) => {
                        if (params.row.status1 == "正常") {
                            return h("div", [
                                h(
                                    "span", {
                                        style: {
                                            color: "#111111",
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
                                            color: "#ff9900",
                                        },
                                    },
                                    params.row.status1
                                ),
                            ]);
                        }
                    },
                },
                {
                    title: "物料状态",
                    key: "status2",
                    minWidth: 120,
                    align: "center",
                    render: (h, params) => {
                        if (params.row.status2 == "正常") {
                            return h("div", [
                                h(
                                    "span", {
                                        style: {
                                            color: "#111111",
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
                                            color: "#ff9900",
                                        },
                                    },
                                    params.row.status2
                                ),
                            ]);
                        }
                    },
                },
                {
                    title: "色号",
                    key: "color",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "用途",
                    key: "purpose",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "备注",
                    key: "remark",
                    minWidth: 160,
                    align: "center",
                },
                {
                    title: "物料图片",
                    key: "imageUrl",
                    minWidth: 100,
                    align: "center",
                    fixed: "right",
                    render: (h, params) => {
                        if (params.row.imageUrl != undefined && params.row.imageUrl != "") {
                            return h("img", {
                                attrs: {
                                    src: require("@/assets/file.png"),
                                },
                                style: {
                                    cursor: "zoom-in",
                                    width: "16px",
                                    height: "16px",
                                    margin: "auto 0",
                                    "object-fit": "contain",
                                },
                                on: {
                                    click: () => {
                                        this.showPic(params.row.imageUrl);
                                    },
                                },
                            });
                        } else {
                            return h("div", [
                                h(
                                    "span", {
                                        style: {
                                            color: "#ff9900",
                                        },
                                    },
                                    "未上传"
                                ),
                            ]);
                        }
                    }
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    sortable: true,
                    sortType: "desc",
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                },
                {
                    title: "创建者",
                    key: "createBy",
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
            ],
            isImportHuaData: true,
            huasearchForm: {
                pageNumber: 1,
                pageSize: 20,
            },
            selectHuaList: [],
            selectHuaCount: [],
            huaData: [],
        };
    },
    methods: {
        init() {
            this.cascaderValue = [];
            this.fastAddModal = "";
            this.fastAddName = "";
            this.getTypeCascaderDataFx();
            this.getHuaUserList();
        },
        changeSearchType(e) {
            if (e.length > 1) {
                this.huasearchForm.type2 = e[0];
                this.huasearchForm.type = e[1];
            } else if (e.length > 0) {
                this.huasearchForm.type2 = e[0];
                this.huasearchForm.type = "";
            } else {
                this.huasearchForm.type2 = "";
                this.huasearchForm.type = "";
            }
        },
        getTypeCascaderDataFx() {
            var that = this;
            getTypeCascaderData().then(res => {
                if (res.success) {
                    that.cascaderData = res.result;
                }
            })
        },
        fastInsertAdminAssetFx() {
            var that = this;
            if (that.fastAddName == "") {
                this.$Message.warning("元器件品类名称不能为空");
            } else if (that.fastAddModal == "") {
                this.$Message.warning("元器件品类规格不能为空");
            } else if (this.cascaderValue == undefined || this.cascaderValue.length < 2) {
                this.$Message.warning("请选择元器件分类！");
            } else {
                fastInsertAdminAsset({
                    name: that.fastAddName,
                    type: that.cascaderValue[1],
                    type2: that.cascaderValue[0],
                    modal: that.fastAddModal
                }).then(res => {
                    if (res.success) {
                        this.$emit("submited", res.result);
                        this.$Message.success("导入成功");
                    }
                })
            }

        },
        handleSelectDep(e) {
            var that = this;
            e.forEach(function (ee) {
                that.huasearchForm.departmentId = ee.id;
            });
        },
        huashowHuaSelect(e) {
            this.$emit("submited", e);
            // console.log(e);
        },
        setCurrentValue(value) {
            if (value === this.visible) {
                return;
            }
            this.visible = value;
        },
        closeWindow() {
            this.visible = false;
        },
        huahandleSearch() {
            this.huasearchForm.pageNumber = 1;
            this.huasearchForm.pageSize = 10;
            this.getHuaUserList();
        },
        huahandleReset() {
            this.$refs.huasearchForm.resetFields();
            this.huasearchForm.type2 = "";
            this.huasearchForm.type = "";
            this.huasearchForm.pageNumber = 1;
            this.huasearchForm.pageSize = 20;
            this.huasearchForm.departmentId = '';
            this.getHuaUserList();
        },
        huaclearSelectAll() {
            this.$refs.table1.selectAll(false);
        },
        huachangePage(v) {
            this.huasearchForm.pageNumber = v;
            this.getHuaUserList();
            this.huaclearSelectAll();
        },
        huachangePageSize(v) {
            this.huasearchForm.pageSize = v;
            this.getHuaUserList();
        },
        huaAddData() {
            var that = this;
            if (this.huaselectCount <= 0) {
                this.$Message.warning("您还未选择要从花名册导入的数据");
                return;
            }
            this.$Modal.confirm({
                title: "确认导入",
                content: "您确认要导入所选的 " + this.huaselectCount + " 条数据?",
                loading: true,
                onOk: () => {
                    let ids = "";
                    this.huaselectList.forEach(function (e) {
                        ids += e.nickname + ",";
                        ids = ids.substring(0, ids.length - 1);
                        this.$Modal.remove();
                        this.$Message.success("导入成功");
                        this.isImportHuaData = false;
                        that.form.inPeople = ids;
                    })
                }
            })
        },
        getHuaUserList() {
            this.hualoading = true;
            getAdminAssetList(this.huasearchForm).then(res => {
                this.hualoading = false;
                if (res.success) {
                    this.huaData = res.result.records;
                    this.huaTotal = res.result.total;
                }
            });
        },
    },
    mounted() {
        this.tableHeight = Number(window.innerHeight - 500);
        this.init();
    }
};
</script>

<style lang="less">
.edit-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .back-title {
        color: #515a6e;
        display: flex;
        align-items: center;
    }

    .head-name {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        font-size: 16px;
        color: #17233d;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .window-close {
        z-index: 1;
        font-size: 12px;
        position: absolute;
        right: 0px;
        top: -5px;
        overflow: hidden;
        cursor: pointer;

        .ivu-icon-ios-close {
            color: #999;
            transition: color .2s ease;
        }
    }

    .window-close .ivu-icon-ios-close:hover {
        color: #444;
    }
}
</style>

<template>
<div>
    <Card>
        <div slot="title">
            <div class="edit-head">
                <a @click="close" class="back-title">
                    <Icon type="ios-arrow-back" />返回
                </a>
                <div class="head-name">添加</div>
                <span></span>
                <a @click="close" class="window-close">
                    <Icon type="ios-close" size="31" class="ivu-icon-ios-close" />
                </a>
            </div>
        </div>
        <Form ref="form" :model="form" :label-width="100" :rules="formValidate" label-position="left">
            <Row :gutter="16">
                <Col span="12">
                <FormItem label="仓库名称" prop="name">
                    <Input v-model="form.name" clearable style="width:100%" placeholder="请输入仓库的名称..." />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="管理类型" prop="attributionType">
                    <Select v-model="form.attributionType" clearable style="width:100%" placeholder="请选择仓库的管理类型...">
                        <Option value="0">个人管理</Option>
                        <Option value="1">部门管理</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12" v-show="form.attributionType!='1'">
                <FormItem label="管理员" prop="adminName">
                    <AutoComplete v-model="form.adminName" :data="autoCompleteData" clearable @on-change="selectByNameFx" placeholder="请选择仓管员" style="width:100%"></AutoComplete>
                </FormItem>
                </Col>
                <Col span="12" v-show="form.attributionType=='1'">
                <FormItem label="归属部门" prop="department">
                    <Select v-model="form.department" clearable style="width:100%" placeholder="请选择归属的部门...">
                        <Option value="总经办">总经办</Option>
                        <Option value="行政综合部">行政综合部</Option>
                        <Option value="人力资源部">人力资源部</Option>
                        <Option value="财务部">财务部</Option>
                        <Option value="设计研发">设计研发</Option>
                        <Option value="产品应用">产品应用</Option>
                        <Option value="业务部">业务部</Option>
                        <Option value="品牌发展部">品牌发展部</Option>
                        <Option value="市场部">市场部</Option>
                        <Option value="综合发展部">综合发展部</Option>
                        <Option value="客服部">客服部</Option>
                        <Option value="培训部">培训部</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="状态" prop="status">
                    <Select v-model="form.status" clearable style="width:100%">
                        <Option value="0">正常</Option>
                        <Option value="1">封存</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="仓库地址" prop="address">
                    <Input v-model="form.address" type="textarea" :rows="4" clearable style="width:100%" show-word-limit maxlength="240" placeholder="请输入仓库的地址..." />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="备注" prop="remark">
                    <Input v-model="form.remark" type="textarea" :rows="4" show-word-limit maxlength="240" clearable style="width:100%" placeholder="选填仓库的其他备注..." />
                </FormItem>
                </Col>
                <Form-item class="br">
                    <Button @click="handleSubmit" :loading="submitLoading" type="primary">提交并保存</Button>
                    <Button @click="handleReset">重置</Button>
                    <Button type="dashed" @click="close">关闭</Button>
                </Form-item>
            </Row>
        </Form>
    </Card>
</div>
</template>

<script>
import {
    addAdminAssetWare,
    getAutoCompleteNames
} from "./api.js";
export default {
    name: "add",
    components: {},
    data() {
        return {
            autoCompleteData: [],
            submitLoading: false, // 表单提交状态
            form: { // 添加或编辑表单对象初始化数据
                name: "",
                address: "",
                attributionType: "0",
                adminName: "",
                department: "",
                remark: "",
                status: "0",
            },
            // 表单验证规则
            formValidate: {}
        };
    },
    methods: {
        init() {},
        selectByNameFx() {
            var that = this;
            if (that.form.adminName != "") {
                getAutoCompleteNames({
                    str: that.form.adminName,
                    systemId: "",
                }).then((res) => {
                    that.autoCompleteData = res.result;
                });
            }
        },
        handleReset() {
            this.$refs.form.resetFields();
        },
        handleSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    addAdminAssetWare(this.form).then(res => {
                        this.submitLoading = false;
                        if (res.success) {
                            this.$Message.success("操作成功");
                            this.submited();
                        }
                    });
                }
            });
        },
        close() {
            this.$emit("close", true);
        },
        submited() {
            this.$emit("submited", true);
        }
    },
    mounted() {
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

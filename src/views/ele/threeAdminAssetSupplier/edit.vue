<template>
<div>
    <Card>
        <div slot="title">
            <div class="edit-head">
                <a @click="close" class="back-title">
                    <Icon type="ios-arrow-back" />返回
                </a>
                <div class="head-name">编辑元器件供应商（编码：{{form.id}}）</div>
                <span></span>
                <a @click="close" class="window-close">
                    <Icon type="ios-close" size="31" class="ivu-icon-ios-close" />
                </a>
            </div>
        </div>
        <Form ref="form" :model="form" :label-width="100" :rules="formValidate" label-position="left">
            <Row :gutter="16">
                <Col span="8">
                <FormItem label="名称" prop="name">
                    <Input v-model="form.name" clearable style="width:100%" placeholder="请输入供应商的全称..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="类型" prop="type">
                    <Select v-model="form.type" clearable style="width:100%" placeholder="请选择供应商的类型...">
                        <Option value="元器件元器件">元器件元器件</Option>
                        <Option value="元器件设备">元器件设备</Option>
                        <Option value="元器件物料">元器件物料</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="收款人姓名" prop="userName">
                    <Input v-model="form.userName" clearable style="width:100%" placeholder="请输入收款人姓名，提交审核前必须填写..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="开户行" prop="open">
                    <Input v-model="form.open" clearable style="width:100%" placeholder="请输入开户行，提交审核前必须填写..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="银行账号" prop="code">
                    <Input v-model="form.code" clearable style="width:100%" placeholder="请输入银行账号，提交审核前必须填写..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="付款抬头" prop="rise">
                    <dict dict="payRise" v-model="form.rise" transfer style="width: 100%" placeholder="请选择付款抬头，提交审核前必须填写..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="电话" prop="mobile">
                    <Input v-model="form.mobile" clearable style="width:100%" placeholder="请输入供应商的联系电话..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="链接" prop="url">
                    <Input v-model="form.url" type="textarea" :rows="1" show-word-limit maxlength="240" clearable style="width:100%" placeholder="选填供应商的官网链接..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="状态" prop="status">
                    <Select v-model="form.status" clearable style="width:100%" placeholder="选择供应商的供货状态...">
                        <Option value="0">正常</Option>
                        <Option value="1">封存</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="地址" prop="address">
                    <Input v-model="form.address" type="textarea" :rows="2" show-word-limit maxlength="240" clearable style="width:100%" placeholder="请输入供应商的地址..." />
                </FormItem>
                </Col>
                <Col span="16">
                <FormItem label="备注" prop="remark">
                    <Input v-model="form.remark" type="textarea" :rows="2" show-word-limit maxlength="240" clearable style="width:100%" placeholder="选填供应商的其他备注..." />
                </FormItem>
                </Col>
            </Row>

            <Form-item class="br">
                <Button @click="handleSubmit" :loading="submitLoading" type="primary">确认保存</Button>
                <Button @click="handleReset">重置</Button>
                <Button type="dashed" @click="close">关闭</Button>
            </Form-item>
        </Form>
    </Card>
</div>
</template>

<script>
import {
    editAdminAssetSupplier
} from "./api.js";
import dict from "@/views/template/dict";
export default {
    name: "edit",
    components: {
        dict
    },
    props: {
        data: Object
    },
    data() {
        return {
            submitLoading: false, // 表单提交状态
            form: { // 添加或编辑表单对象初始化数据
                bm: "",
                name: "",
                type: "",
                address: "",
                mobile: "",
                url: "",
                remark: "",
                status: "",
                userName: "",
                open: "",
                code: "",
                rise: "",
            },
            // 表单验证规则
            formValidate: {}
        };
    },
    methods: {
        init() {
            this.handleReset();
            this.form = this.data;
            if (this.form.status == false) {
                this.form.status = "0";
            } else {
                this.form.status = "1";
            }
        },
        handleReset() {
            this.$refs.form.resetFields();
        },
        handleSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    editAdminAssetSupplier(this.form).then(res => {
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

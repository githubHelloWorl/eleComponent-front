<template>
<div>
    <Card>
        <div slot="title">
            <div class="edit-head">
                <a @click="close" class="back-title">
                    <Icon type="ios-arrow-back" />返回
                </a>
                <div class="head-name">编辑未提交的采购单</div>
                <span></span>
                <a @click="close" class="window-close">
                    <Icon type="ios-close" size="31" class="ivu-icon-ios-close" />
                </a>
            </div>
        </div>
        <Form ref="form" :model="form" :label-width="100" :rules="formValidate" label-position="left">
            <Row :gutter="16">
                <Col span="8">
                <FormItem label="元器件编码">
                    <Input v-model="form.assetsCode" readonly style="width:100%" />
                </FormItem>
                </Col>
                <Col span="16">
                <FormItem label="元器件名称" prop="name">
                    <Input v-model="form.name" readonly style="width:100%" icon="md-create" @on-click="openAssetSelectWindow" placeholder="点击右边图标导入元器件品类..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="采购数量" prop="quantity">
                    <InputNumber min="0" max="10000000" v-model="form.quantity" style="width:100%" placeholder="请输入采购数量..."></InputNumber>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="首款费用" prop="money2">
                    <InputNumber min="0" max="10000000" v-model="form.money1" style="width:100%" placeholder="请输入采购首款费用..."></InputNumber>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="采购总费用" prop="money">
                    <InputNumber min="0" max="10000000" v-model="form.money" style="width:100%" placeholder="请输入采购总费用..."></InputNumber>
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="center">
                <Form-item class="br">
                    <Button @click="handleSubmit" :loading="submitLoading" type="success">更新采购单</Button>
                    <Button type="dashed" @click="close">关闭</Button>
                </Form-item>
            </Row>
        </Form>
    </Card>
    <assetSelect v-model="showOwnerWindowFlag" @submited="ownerSubmited" />
</div>
</template>

<script>
import {
    editAdminAssetsBuy
} from "./api.js";
import assetSelect from './assetSelect.vue';
export default {
    name: "edit",
    components: {
        assetSelect
    },
    props: {
        data: Object
    },
    data() {
        return {
            showOwnerWindowFlag: false,
            submitLoading: false,
            form: {
                money: 0,
                money1: 0,
                name: "",
                quantity: 0,
            },
            formValidate: {},
            selectAssetsCode: ""
        };
    },
    methods: {
        init() {
            this.handleReset();
            this.form = this.data;
        },
        openAssetSelectWindow() {
            this.showOwnerWindowFlag = true;
        },
        ownerSubmited(e) {
            this.form.name = e.name;
            this.selectAssetsCode = e.code;
            this.form.assetId = e.id;
            this.showOwnerWindowFlag = false;
        },
        handleReset() {
            this.$refs.form.resetFields();
        },
        handleSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    editAdminAssetsBuy(this.form).then(res => {
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

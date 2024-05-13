<template>
<div>
    <Card>
        <div slot="title">
            <div class="edit-head">
                <a @click="close" class="back-title">
                    <Icon type="ios-arrow-back" />返回
                </a>
                <div class="head-name">更新元器件数据</div>
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
                    <Input v-model="form.name" clearable style="width:100%" placeholder="请输入元器件品类名称..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="分类" prop="type">
                    <Cascader :data="cascaderData" v-model="cascaderValue" placeholder="请选择元器件分类..."></Cascader>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="规格" prop="gg">
                    <Input v-model="form.gg" clearable style="width:100%" placeholder="选填元器件规格..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="型号" prop="xh">
                    <Input v-model="form.xh" clearable style="width:100%" placeholder="选填元器件品类型号..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="色号" prop="color">
                    <Input v-model="form.color" clearable style="width:100%" placeholder="选填元器件色号..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="用途" prop="purpose">
                    <Input v-model="form.purpose" clearable style="width:100%" placeholder="选填元器件用途..." />
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="计量单位" prop="jldw">
                    <Select v-model="form.jldw" clearable style="width:100%" placeholder="选填计量单位...">
                        <Option v-for="(item,index) in unitList" :key="index" :value="item.name">{{item.name}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="销售价" prop="xsj">
                    <InputNumber v-model="form.xsj" style="width:100%" placeholder="选填元器件销售价..."></InputNumber>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="图片" prop="imageUrl">
                    <upload-pic-input v-model="form.imageUrl" style="width:100%" placeholder="请上传元器件图片..."></upload-pic-input>
                </FormItem>
                </Col>
                <Col span="24">
                <FormItem label="备注" prop="remark">
                    <Input v-model="form.remark" type="textarea" :rows="4" show-word-limit maxlength="240" clearable style="width:100%" placeholder="选填元器件备注..." />
                </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="center">
                <Form-item class="br">
                    <Button @click="handleSubmit" :loading="submitLoading" type="primary">确认更新</Button>
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
    editAdminAsset,
    getAllUnitList,
    getTypeCascaderData
} from "./api.js";
import uploadPicInput from "@/views/template/upload-pic-input";
export default {
    name: "edit",
    components: {
        uploadPicInput
    },
    props: {
        data: Object
    },
    data() {
        return {
            submitLoading: false, // 表单提交状态
            form: { // 添加或编辑表单对象初始化数据
                name: "",
                type: "",
                type2: "",
                gg: "",
                xh: "",
                color: "",
                purpose: "",
                jldw: "个",
                xsj: 0,
                status1: "",
                status2: "",
                remark: ""
            },
            // 表单验证规则
            formValidate: {},
            unitList: [],
            cascaderData: [],
            cascaderValue: []
        };
    },
    methods: {
        init() {
            this.getTypeCascaderDataFx();
            this.handleReset();
            this.form = this.data;
            this.cascaderValue.push(this.form.type2);
            this.cascaderValue.push(this.form.type);
            this.getAllUnitListFx();
        },
        getTypeCascaderDataFx() {
            var that = this;
            getTypeCascaderData().then(res => {
                if (res.success) {
                    that.cascaderData = res.result;
                }
            })
        },
        getAllUnitListFx() {
            var that = this;
            getAllUnitList().then(res => {
                if (res.success) {
                    that.unitList = res.result;
                }
            })
        },
        handleReset() {
            this.$refs.form.resetFields();
        },
        handleSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    editAdminAsset(this.form).then(res => {
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
